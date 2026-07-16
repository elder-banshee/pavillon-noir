#!/usr/bin/env python3
"""Enrichit les candidats GEBCO avec parents <50 m et contexte 5–50 km."""

from __future__ import annotations

import argparse
import base64
import csv
import gc
import io
import json
import math
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

from audit_gebco_bahamas import geotiff_metadata
from classify_gebco_bahamas import DIRECT_TID, classes_rgb


Image.MAX_IMAGE_PIXELS = None
TOOL_DIR = Path(__file__).resolve().parent
DEFAULT_CONFIG = TOOL_DIR / 'bathymetrie-globale.json'
DEFAULT_SUMMARY = TOOL_DIR / 'output' / 'global' / 'bathymetrie-globale-structures-50m.json'


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=DEFAULT_CONFIG)
    parser.add_argument('--summary', type=Path, default=DEFAULT_SUMMARY)
    parser.add_argument('--chunk-rows', type=int, default=240)
    parser.add_argument('--context-step', type=int, default=2,
                        help='Sous-échantillonnage du contexte (2 ≈ 0,9 km).')
    return parser.parse_args()


def close_memmap(array):
    if getattr(array, '_mmap', None) is not None:
        array._mmap.close()


def make_mask_and_labels(classes, generated, width, height, mask_name, labels_name, predicate, chunk_rows):
    mask_path = generated / mask_name
    labels_path = generated / labels_name
    mask = np.memmap(mask_path, dtype=np.uint8, mode='w+', shape=(height, width))
    for top in range(0, height, chunk_rows):
        bottom = min(height, top + chunk_rows)
        mask[top:bottom] = predicate(classes[top:bottom]).astype(np.uint8)
    mask.flush()
    labels = np.memmap(labels_path, dtype=np.int32, mode='w+', shape=(height, width))
    count = int(ndimage.label(mask, structure=ndimage.generate_binary_structure(2, 1), output=labels))
    labels.flush()
    close_memmap(mask); del mask; gc.collect(); mask_path.unlink(missing_ok=True)
    return labels, count, labels_path


def annulus_offsets(latitude, step, pixel_degrees, inner_km, outer_km):
    lat_km = 111.195 * pixel_degrees * step
    lon_km = lat_km * math.cos(math.radians(latitude))
    max_row = math.ceil(outer_km / lat_km)
    max_col = math.ceil(outer_km / lon_km)
    dy, dx = np.mgrid[-max_row:max_row + 1, -max_col:max_col + 1]
    distances = np.hypot(dy * lat_km, dx * lon_km)
    keep = (distances >= inner_km) & (distances < outer_km)
    return dy[keep].astype(np.int32), dx[keep].astype(np.int32)


def sample_context(context, row, col, dy, dx):
    rows, cols = row + dy, col + dx
    valid = (rows >= 0) & (rows < context.shape[0]) & (cols >= 0) & (cols < context.shape[1])
    values = np.asarray(context[rows[valid], cols[valid]], dtype=np.uint8)
    counts = np.bincount(values, minlength=4)
    marine = int(counts[1] + counts[2] + counts[3])
    total = int(counts.sum())
    return {
        'samples': total, 'marineSamples': marine,
        'landPercent': float(counts[0] / total * 100) if total else 0,
        'moderateWater50mPercent': float(counts[1] / marine * 100) if marine else 0,
        'intermediateWater50to200mPercent': float(counts[2] / marine * 100) if marine else 0,
        'deepWater200mPercent': float(counts[3] / marine * 100) if marine else 0,
    }


def signature(candidate):
    area = candidate['plateau50AreaKm2']
    extent = candidate['plateau50ExtentKm']
    outer_moderate = candidate['plateauContext25to50KmPercent']
    outer_deep = candidate['deepWater200m25to50KmPercent']
    inner_moderate = candidate['plateauContext5to25KmPercent']
    detached = candidate['classification'] == 'detache'
    if detached and area < 10 and outer_moderate < 10 and outer_deep >= 60:
        return 'pinnacle_isole'
    if detached and area < 500 and outer_deep >= 40 and inner_moderate >= 10:
        return 'atoll_ou_banc_detache'
    if area >= 100 or extent >= 25:
        if outer_deep >= 45 and outer_moderate < 45:
            return 'bord_de_plateau'
        return 'plateau_structurant'
    return 'indetermine'


def png_uri(rgb):
    image = Image.fromarray(rgb, mode='RGB')
    buffer = io.BytesIO(); image.save(buffer, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')


def render_svg(classes, context, candidates, acquisition, output):
    preview = np.asarray(classes[5::10, 5::10])
    map_x, map_y, map_w, map_h = 60, 80, 1800, 1200
    west, south, east, north = (acquisition[key] for key in ('west', 'south', 'east', 'north'))
    colors = {
        'plateau_structurant': '#22c55e', 'bord_de_plateau': '#06b6d4',
        'atoll_ou_banc_detache': '#facc15', 'pinnacle_isole': '#f97316',
        'indetermine': '#ef4444',
    }
    groups = {key: [] for key in colors}
    for item in reversed(candidates):
        x = map_x + (item['centroid']['lon'] - west) / (east - west) * map_w
        y = map_y + (north - item['centroid']['lat']) / (north - south) * map_h
        radius = max(1.0, min(6.5, 1 + math.log10(item['plateau50AreaKm2'] + 1) * 1.2))
        kind = item['structuralSignature']
        groups[kind].append(
            f'<circle id="{item["id"]}" cx="{x:.2f}" cy="{y:.2f}" r="{radius:.2f}" '
            f'fill="{colors[kind]}" fill-opacity="0.68" stroke="#0f172a" stroke-width="0.45" '
            f'data-plateau="{item["plateau50Id"]}" data-area-km2="{item["plateau50AreaKm2"]:.3f}" '
            f'data-context-outer="{item["plateauContext25to50KmPercent"]:.3f}"/>'
        )
    layers = ''.join(f'<g id="{key}">{"".join(items)}</g>' for key, items in groups.items())
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2240px" height="1360px" viewBox="0 0 2240 1360">
  <title>GEBCO 2026 — structures sous 50 m</title>
  <style>.title{{font:700 28px sans-serif;fill:#e2e8f0}}.small{{font:14px sans-serif;fill:#cbd5e1}}</style>
  <rect width="2240" height="1360" fill="#07111f"/>
  <text x="60" y="42" class="title">Parents structurels &lt;50 m et contexte 5–50 km</text>
  <g id="classes_reference"><image x="{map_x}" y="{map_y}" width="{map_w}" height="{map_h}" preserveAspectRatio="none" opacity="0.50" href="{png_uri(classes_rgb(preview))}"/></g>
  {layers}
  <g id="legende">
    <text x="1900" y="120" class="small">● vert : plateau structurant</text>
    <text x="1900" y="150" class="small">● cyan : bord de plateau</text>
    <text x="1900" y="180" class="small">● jaune : atoll/banc détaché</text>
    <text x="1900" y="210" class="small">● orange : pinnacle isolé</text>
    <text x="1900" y="240" class="small">● rouge : indéterminé</text>
    <text x="1900" y="290" class="small">Rayon : aire du parent &lt;50 m</text>
    <text x="1900" y="335" class="small">Classification heuristique, sans suppression.</text>
  </g>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def main():
    args = arguments()
    config = json.loads(args.config.read_text(encoding='utf-8'))
    acquisition = config['acquisition']
    generated = Path(config['generatedDirectory']); generated.mkdir(parents=True, exist_ok=True)
    source = Path(acquisition['sourceDirectory'])
    bathy_path = source / acquisition['bathymetryFilename']
    tid_path = source / acquisition['tidFilename']
    candidates_path = generated / 'bathymetrie-04-candidats-wgs84.json'
    candidates = json.loads(candidates_path.read_text(encoding='utf-8'))['candidates']
    width, height = acquisition['expectedWidth'], acquisition['expectedHeight']
    classes = np.memmap(generated / 'gebco-2026-jaillot-classes.u8', dtype=np.uint8,
                        mode='r', shape=(height, width))

    with Image.open(bathy_path) as bathy_image, Image.open(tid_path) as tid_image:
        metadata = geotiff_metadata(bathy_image)
        mask50_path = generated / 'mask50-scratch.u8'
        mask50 = np.memmap(mask50_path, dtype=np.uint8, mode='w+', shape=(height, width))
        context_step = args.context_step
        context_shape = (height // context_step, width // context_step)
        context_path = generated / 'gebco-2026-jaillot-context-50-200.u8'
        context = np.memmap(context_path, dtype=np.uint8, mode='w+', shape=context_shape)
        sample_cols = np.arange(context_step // 2, width, context_step)
        for top in range(0, height, args.chunk_rows):
            bottom = min(height, top + args.chunk_rows)
            bathy = np.asarray(bathy_image.crop((0, top, width, bottom)), dtype=np.int32)
            mask50[top:bottom] = ((bathy < 0) & (bathy >= -50)).astype(np.uint8)
            sample_rows = np.arange(top + ((context_step // 2 - top) % context_step), bottom, context_step)
            local_rows = sample_rows - top
            sampled = bathy[np.ix_(local_rows, sample_cols)]
            codes = np.zeros(sampled.shape, dtype=np.uint8)
            codes[(sampled < 0) & (sampled >= -50)] = 1
            codes[(sampled < -50) & (sampled >= -200)] = 2
            codes[sampled < -200] = 3
            context[sample_rows // context_step] = codes
        mask50.flush(); context.flush()
        labels50_path = generated / 'labels50-scratch.i32'
        labels50 = np.memmap(labels50_path, dtype=np.int32, mode='w+', shape=(height, width))
        plateau_count = int(ndimage.label(mask50, structure=ndimage.generate_binary_structure(2, 1), output=labels50))
        labels50.flush(); close_memmap(mask50); del mask50; mask50_path.unlink(missing_ok=True)

        labels12_path = generated / 'labels12-scratch.i32'
        mask12_path = generated / 'mask12-scratch.u8'
        mask12 = np.memmap(mask12_path, dtype=np.uint8, mode='w+', shape=(height, width))
        for top in range(0, height, args.chunk_rows):
            bottom = min(height, top + args.chunk_rows)
            block = classes[top:bottom]
            mask12[top:bottom] = ((block >= 1) & (block <= 5)).astype(np.uint8)
        mask12.flush()
        labels12 = np.memmap(labels12_path, dtype=np.int32, mode='w+', shape=(height, width))
        candidate_count = int(ndimage.label(mask12, structure=ndimage.generate_binary_structure(2, 1), output=labels12))
        labels12.flush(); close_memmap(mask12); del mask12; mask12_path.unlink(missing_ok=True)
        if candidate_count != len(candidates):
            raise ValueError(f'Numérotation candidats instable : {candidate_count} != {len(candidates)}')

        size = plateau_count + 1
        counts = np.zeros(size, dtype=np.int64)
        direct = np.zeros(size, dtype=np.int64)
        row_sums = np.zeros(size, dtype=np.float64)
        col_sums = np.zeros(size, dtype=np.float64)
        candidate_to_plateau = np.zeros(candidate_count + 1, dtype=np.int32)
        conflicts = 0
        for top in range(0, height, args.chunk_rows):
            bottom = min(height, top + args.chunk_rows)
            plateau_block = np.asarray(labels50[top:bottom])
            candidate_block = np.asarray(labels12[top:bottom])
            tid = np.asarray(tid_image.crop((0, top, width, bottom)), dtype=np.uint8)
            flat = plateau_block.ravel()
            counts += np.bincount(flat, minlength=size)
            direct += np.bincount(flat, weights=np.isin(tid, list(DIRECT_TID)).ravel(), minlength=size).astype(np.int64)
            row_values = np.repeat(np.arange(top, bottom, dtype=np.float64), width)
            col_values = np.tile(np.arange(width, dtype=np.float64), bottom - top)
            row_sums += np.bincount(flat, weights=row_values, minlength=size)
            col_sums += np.bincount(flat, weights=col_values, minlength=size)
            child_flat = candidate_block.ravel()
            positive = child_flat > 0
            child_ids = child_flat[positive]
            plateau_ids = flat[positive]
            unique, first = np.unique(child_ids, return_index=True)
            proposed = plateau_ids[first]
            existing = candidate_to_plateau[unique]
            conflicts += int(((existing != 0) & (existing != proposed)).sum())
            unset = existing == 0
            candidate_to_plateau[unique[unset]] = proposed[unset]

    slices = ndimage.find_objects(labels50)
    plateau_candidate_counts = np.bincount(candidate_to_plateau[1:], minlength=plateau_count + 1)
    shallow_counts = np.zeros(plateau_count + 1, dtype=np.int64)
    for candidate in candidates:
        number = int(candidate['id'].rsplit('-', 1)[1])
        plateau_id = int(candidate_to_plateau[number])
        if candidate['shallowestThresholdM'] <= 6:
            shallow_counts[plateau_id] += 1

    plateau_records = {}
    for plateau_id in np.flatnonzero(plateau_candidate_counts):
        count = int(counts[plateau_id])
        centroid_row = row_sums[plateau_id] / count
        centroid_col = col_sums[plateau_id] / count
        latitude = metadata['north'] - (centroid_row + 0.5) * metadata['pixelSizeLatDeg']
        longitude = metadata['west'] + (centroid_col + 0.5) * metadata['pixelSizeLonDeg']
        pixel_area = (6371.0088 ** 2 * math.radians(metadata['pixelSizeLonDeg'])
                      * math.radians(metadata['pixelSizeLatDeg']) * math.cos(math.radians(latitude)))
        bounds_slice = slices[plateau_id - 1]
        north_south_km = (bounds_slice[0].stop - bounds_slice[0].start) * metadata['pixelSizeLatDeg'] * 111.195
        east_west_km = ((bounds_slice[1].stop - bounds_slice[1].start) * metadata['pixelSizeLonDeg']
                        * 111.195 * math.cos(math.radians(latitude)))
        area = count * pixel_area
        extent = max(north_south_km, east_west_km)
        plateau_records[int(plateau_id)] = {
            'id': f'PLATEAU50-{plateau_id:06d}', 'cells': count,
            'areaApproxKm2': area, 'extentKm': extent,
            'centroid': {'lat': latitude, 'lon': longitude},
            'bbox': {
                'west': metadata['west'] + bounds_slice[1].start * metadata['pixelSizeLonDeg'],
                'east': metadata['west'] + bounds_slice[1].stop * metadata['pixelSizeLonDeg'],
                'north': metadata['north'] - bounds_slice[0].start * metadata['pixelSizeLatDeg'],
                'south': metadata['north'] - bounds_slice[0].stop * metadata['pixelSizeLatDeg'],
            },
            'directMeasurementPercent': direct[plateau_id] / count * 100,
            'candidateCount': int(plateau_candidate_counts[plateau_id]),
            'shallowCoreCount': int(shallow_counts[plateau_id]),
            'structureClass': 'plateau_structurant' if area >= 100 or extent >= 25 else 'structure_locale',
            'candidateIds': [], 'candidateSignatures': {},
        }

    offset_cache = {}
    signatures = Counter()
    for candidate in candidates:
        number = int(candidate['id'].rsplit('-', 1)[1])
        plateau_id = int(candidate_to_plateau[number])
        if plateau_id <= 0:
            raise ValueError(f'Candidat sans parent <50 m : {candidate["id"]}')
        count = int(counts[plateau_id])
        centroid_row = row_sums[plateau_id] / count
        centroid_col = col_sums[plateau_id] / count
        latitude = metadata['north'] - (centroid_row + 0.5) * metadata['pixelSizeLatDeg']
        pixel_area = (6371.0088 ** 2 * math.radians(metadata['pixelSizeLonDeg'])
                      * math.radians(metadata['pixelSizeLatDeg']) * math.cos(math.radians(latitude)))
        bounds_slice = slices[plateau_id - 1]
        north_south_km = (bounds_slice[0].stop - bounds_slice[0].start) * metadata['pixelSizeLatDeg'] * 111.195
        east_west_km = ((bounds_slice[1].stop - bounds_slice[1].start) * metadata['pixelSizeLonDeg']
                        * 111.195 * math.cos(math.radians(latitude)))
        candidate['plateau50Id'] = f'PLATEAU50-{plateau_id:06d}'
        candidate['plateau50Cells'] = count
        candidate['plateau50AreaKm2'] = count * pixel_area
        candidate['plateau50ExtentKm'] = max(north_south_km, east_west_km)
        candidate['plateau50CandidateCount'] = int(plateau_candidate_counts[plateau_id])
        candidate['plateau50ShallowCoreCount'] = int(shallow_counts[plateau_id])
        candidate['plateau50DirectMeasurementPercent'] = direct[plateau_id] / count * 100

        band = round(candidate['centroid']['lat'] * 2) / 2
        if band not in offset_cache:
            offset_cache[band] = {
                'inner': annulus_offsets(band, args.context_step, metadata['pixelSizeLatDeg'], 5, 25),
                'outer': annulus_offsets(band, args.context_step, metadata['pixelSizeLatDeg'], 25, 50),
            }
        row = round((metadata['north'] - candidate['centroid']['lat']) /
                    (metadata['pixelSizeLatDeg'] * args.context_step) - 0.75)
        col = round((candidate['centroid']['lon'] - metadata['west']) /
                    (metadata['pixelSizeLonDeg'] * args.context_step) - 0.75)
        inner = sample_context(context, row, col, *offset_cache[band]['inner'])
        outer = sample_context(context, row, col, *offset_cache[band]['outer'])
        candidate['context5to25Km'] = inner
        candidate['context25to50Km'] = outer
        candidate['plateauContext5to25KmPercent'] = inner['moderateWater50mPercent']
        candidate['plateauContext25to50KmPercent'] = outer['moderateWater50mPercent']
        candidate['plateauProminencePercent'] = outer['moderateWater50mPercent']
        candidate['deepWater200m5to25KmPercent'] = inner['deepWater200mPercent']
        candidate['deepWater200m25to50KmPercent'] = outer['deepWater200mPercent']
        candidate['landContext5to25KmPercent'] = inner['landPercent']
        candidate['landContext25to50KmPercent'] = outer['landPercent']
        candidate['structuralSignature'] = signature(candidate)
        signatures[candidate['structuralSignature']] += 1
        plateau_records[plateau_id]['candidateIds'].append(candidate['id'])
        plateau_records[plateau_id]['candidateSignatures'][candidate['structuralSignature']] = (
            plateau_records[plateau_id]['candidateSignatures'].get(candidate['structuralSignature'], 0) + 1)

    output_json = generated / 'bathymetrie-05-candidats-structures-wgs84.json'
    output_csv = generated / 'bathymetrie-05-candidats-structures-wgs84.csv'
    plateaus_json = generated / 'bathymetrie-05-plateaux-50m.json'
    plateaus_csv = generated / 'bathymetrie-05-plateaux-50m.csv'
    output_json.write_text(json.dumps({'version': 1, 'candidates': candidates}, ensure_ascii=False, indent=2) + '\n',
                           encoding='utf-8', newline='\n')
    fields = ['id', 'latitude', 'longitude', 'classification', 'structuralSignature',
              'plateau50Id', 'plateau50AreaKm2', 'plateau50ExtentKm', 'plateau50CandidateCount',
              'plateau50ShallowCoreCount', 'plateau50DirectMeasurementPercent',
              'plateauContext5to25KmPercent', 'plateauContext25to50KmPercent',
              'deepWater200m5to25KmPercent', 'deepWater200m25to50KmPercent',
              'landContext5to25KmPercent', 'landContext25to50KmPercent',
              'cells', 'areaApproxKm2', 'shallowestThresholdM', 'directMeasurementPercent',
              'scientificConfidenceScore', 'documentaryPriorityScore']
    with output_csv.open('w', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields); writer.writeheader()
        for item in candidates:
            writer.writerow({'id': item['id'], 'latitude': item['centroid']['lat'],
                             'longitude': item['centroid']['lon'],
                             **{key: item.get(key) for key in fields if key not in ('id', 'latitude', 'longitude')}})

    plateaus = sorted(plateau_records.values(), key=lambda item: (-item['areaApproxKm2'], item['id']))
    plateaus_json.write_text(json.dumps({'version': 1, 'plateaus': plateaus}, ensure_ascii=False, indent=2) + '\n',
                             encoding='utf-8', newline='\n')
    plateau_fields = ['id', 'latitude', 'longitude', 'structureClass', 'cells', 'areaApproxKm2',
                      'extentKm', 'directMeasurementPercent', 'candidateCount', 'shallowCoreCount']
    with plateaus_csv.open('w', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=plateau_fields); writer.writeheader()
        for item in plateaus:
            writer.writerow({'id': item['id'], 'latitude': item['centroid']['lat'],
                             'longitude': item['centroid']['lon'],
                             **{key: item.get(key) for key in plateau_fields if key not in ('id', 'latitude', 'longitude')}})

    render_svg(classes, context, candidates, acquisition, generated / 'bathymetrie-05-structures-50m.svg')
    pedro = [item for item in candidates
             if ((item['centroid']['lat'] - 17.0) * 111) ** 2
             + ((item['centroid']['lon'] + 77.8) * 106) ** 2 < 60 ** 2]
    pedro.sort(key=lambda item: (((item['centroid']['lat'] - 17.0) * 111) ** 2
                                 + ((item['centroid']['lon'] + 77.8) * 106) ** 2))
    summary = {
        'version': 1, 'plateauThresholdM': 50, 'plateauComponents': plateau_count,
        'plateausWithShallowCandidates': len(plateaus),
        'candidateCount': len(candidates), 'candidateParentConflicts': conflicts,
        'contextSampling': {'step': args.context_step, 'approxResolutionKm': 0.463 * args.context_step,
                            'innerAnnulusKm': [5, 25], 'outerAnnulusKm': [25, 50]},
        'signatures': dict(sorted(signatures.items())),
        'pedroBankCalibration': pedro[:100],
        'artifacts': {'json': str(output_json), 'csv': str(output_csv),
                      'plateausJson': str(plateaus_json), 'plateausCsv': str(plateaus_csv),
                      'svg': str(generated / 'bathymetrie-05-structures-50m.svg'),
                      'contextRaster': str(context_path)},
        'classificationNotice': 'Signatures heuristiques à calibrer ; aucune suppression automatique.',
    }
    args.summary.parent.mkdir(parents=True, exist_ok=True)
    args.summary.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    (generated / 'bathymetrie-globale-structures-50m.json').write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')

    close_memmap(labels12); close_memmap(labels50); close_memmap(context); close_memmap(classes)
    del labels12, labels50, context, classes; gc.collect()
    labels12_path.unlink(missing_ok=True); labels50_path.unlink(missing_ok=True)
    print(json.dumps({key: value for key, value in summary.items() if key != 'pedroBankCalibration'},
                     ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
