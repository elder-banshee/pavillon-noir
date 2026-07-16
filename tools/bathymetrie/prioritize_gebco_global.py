#!/usr/bin/env python3
"""Extrait et priorise les candidats bathymétriques globaux en WGS84."""

from __future__ import annotations

import argparse
import csv
import gc
import json
import math
import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

from audit_gebco_bahamas import TID_LABELS, geotiff_metadata
from classify_gebco_bahamas import DIRECT_TID


Image.MAX_IMAGE_PIXELS = None
TOOL_DIR = Path(__file__).resolve().parent
DEFAULT_CONFIG = TOOL_DIR / 'bathymetrie-globale.json'
DEFAULT_AUDIT = TOOL_DIR / 'output' / 'global' / 'bathymetrie-globale-audit.json'
DEFAULT_SUMMARY = TOOL_DIR / 'output' / 'global' / 'bathymetrie-globale-priorisation.json'


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=DEFAULT_CONFIG)
    parser.add_argument('--audit', type=Path, default=DEFAULT_AUDIT)
    parser.add_argument('--summary', type=Path, default=DEFAULT_SUMMARY)
    parser.add_argument('--chunk-rows', type=int, default=240)
    parser.add_argument('--recover-summary', action='store_true',
                        help='Reconstruit le résumé depuis le JSON candidats existant.')
    return parser.parse_args()


def add_ring_samples(labels, bathy_ext, center_start, top, threshold, offset, sums, counts):
    rows, width = labels.shape
    center = bathy_ext[center_start:center_start + rows]

    def accumulate(target_labels, neighbours):
        valid = (target_labels > 0) & (neighbours < 0) & (neighbours <= -threshold)
        if not valid.any():
            return
        ids = target_labels[valid]
        depths = -neighbours[valid].astype(np.float64)
        sums[:] += np.bincount(ids, weights=depths, minlength=len(sums))
        counts[:] += np.bincount(ids, minlength=len(counts))

    if top >= offset:
        accumulate(labels, bathy_ext[center_start - offset:center_start - offset + rows])
    if center_start + rows + offset <= bathy_ext.shape[0]:
        accumulate(labels, bathy_ext[center_start + offset:center_start + offset + rows])
    if width > offset:
        accumulate(labels[:, offset:], center[:, :-offset])
        accumulate(labels[:, :-offset], center[:, offset:])


def score_candidate(candidate):
    direct = candidate['directMeasurementPercent']
    cells = candidate['cells']
    near = max(0.0, candidate['nearContrastM'] or 0.0)
    wide = max(0.0, candidate['wideContrastM'] or 0.0)
    persistence = candidate['persistenceLevels']
    source_mixed = candidate['mixedSourceTidPercent']
    scientific = (
        min(42, direct * 0.42)
        + min(18, math.log10(cells + 1) * 4.5)
        + min(14, math.log1p(near) / math.log(101) * 14)
        + min(16, math.log1p(wide) / math.log(501) * 16)
        + persistence * 2
        - min(10, source_mixed * 0.15)
    )
    affected = candidate['affectedCategories']
    documentary = (
        scientific * 0.45
        + (16 if candidate['classification'] == 'detache' else 4)
        + min(14, math.log10(candidate['areaApproxKm2'] + 1) * 4)
        + min(16, math.log1p(wide) / math.log(501) * 16)
        + affected * 3
    )
    candidate['scientificConfidenceScore'] = round(max(0, min(100, scientific)), 2)
    candidate['documentaryPriorityScore'] = round(max(0, min(100, documentary)), 2)


def main():
    args = arguments()
    config = json.loads(args.config.read_text(encoding='utf-8'))
    audit = json.loads(args.audit.read_text(encoding='utf-8'))
    acquisition = config['acquisition']
    source_dir = Path(acquisition['sourceDirectory'])
    generated_dir = Path(config['generatedDirectory'])
    output_json = generated_dir / 'bathymetrie-04-candidats-wgs84.json'
    output_csv = generated_dir / 'bathymetrie-04-candidats-wgs84.csv'
    if args.recover_summary:
        candidates = json.loads(output_json.read_text(encoding='utf-8'))['candidates']
        recovered_levels = {}
        for level in range(1, 6):
            recovered_levels[str(level)] = {
                'thresholdM': config['safeDepthThresholdsM'][level - 1],
                'components': int(sum(item['nestedComponents'][str(level)] for item in candidates)),
                'cells': int(sum(item['nestedCells'][str(level)] for item in candidates)),
            }
        summary = {
            'version': 1, 'levels': recovered_levels, 'candidates12m': len(candidates),
            'highDocumentaryPriority': int(sum(item['documentaryPriorityScore'] >= 70 for item in candidates)),
            'highScientificConfidence': int(sum(item['scientificConfidenceScore'] >= 70 for item in candidates)),
            'topCandidates': candidates[:100],
            'artifacts': {'json': str(output_json), 'csv': str(output_csv)},
            'scoreNotice': 'Scores heuristiques destinés au tri humain, jamais à la suppression automatique.',
            'recoveredFromCandidates': True,
        }
        args.summary.parent.mkdir(parents=True, exist_ok=True)
        args.summary.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
        (generated_dir / 'bathymetrie-globale-priorisation.json').write_text(
            json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
        print(json.dumps({key: value for key, value in summary.items() if key != 'topCandidates'}, ensure_ascii=False, indent=2))
        return 0
    bathy_path = source_dir / acquisition['bathymetryFilename']
    tid_path = source_dir / acquisition['tidFilename']
    classes_path = Path(audit['artifacts']['classesRaster'])
    width, height = acquisition['expectedWidth'], acquisition['expectedHeight']
    classes = np.memmap(classes_path, dtype=np.uint8, mode='r', shape=(height, width))
    thresholds = config['safeDepthThresholdsM']
    scratch_a = generated_dir / 'labels-a.i32'
    scratch_b = generated_dir / 'labels-b.i32'
    all_levels = {}
    parent_path = None
    parent_level = None

    with Image.open(bathy_path) as bathy_image, Image.open(tid_path) as tid_image:
        metadata = geotiff_metadata(bathy_image)
        for level_index in range(5, 0, -1):
            threshold = thresholds[level_index - 1]
            current_path = scratch_a if parent_path != scratch_a else scratch_b
            labels = np.memmap(current_path, dtype=np.int32, mode='w+', shape=(height, width))
            mask = np.memmap(generated_dir / 'mask-scratch.u8', dtype=np.uint8, mode='w+', shape=(height, width))
            for top in range(0, height, args.chunk_rows):
                bottom = min(height, top + args.chunk_rows)
                block = classes[top:bottom]
                mask[top:bottom] = ((block >= 1) & (block <= level_index)).astype(np.uint8)
            mask.flush()
            component_count = int(ndimage.label(mask, structure=ndimage.generate_binary_structure(2, 1), output=labels))
            labels.flush()
            del mask

            size = component_count + 1
            counts = np.zeros(size, dtype=np.int64)
            depth_sums = np.zeros(size, dtype=np.float64)
            direct_counts = np.zeros(size, dtype=np.int64)
            tid70_counts = np.zeros(size, dtype=np.int64)
            row_sums = np.zeros(size, dtype=np.float64)
            col_sums = np.zeros(size, dtype=np.float64)
            coastal = np.zeros(size, dtype=bool)
            near_sums = np.zeros(size, dtype=np.float64)
            near_counts = np.zeros(size, dtype=np.int64)
            wide_sums = np.zeros(size, dtype=np.float64)
            wide_counts = np.zeros(size, dtype=np.int64)
            parent_ids = np.zeros(size, dtype=np.int32)
            parent_conflicts = 0
            parent_labels = (np.memmap(parent_path, dtype=np.int32, mode='r', shape=(height, width))
                             if parent_path else None)

            for top in range(0, height, args.chunk_rows):
                bottom = min(height, top + args.chunk_rows)
                ext_top, ext_bottom = max(0, top - 12), min(height, bottom + 12)
                bathy_ext = np.asarray(bathy_image.crop((0, ext_top, width, ext_bottom)), dtype=np.int32)
                bathy = bathy_ext[top - ext_top:top - ext_top + (bottom - top)]
                tid = np.asarray(tid_image.crop((0, top, width, bottom)), dtype=np.uint8)
                block_labels = np.asarray(labels[top:bottom])
                flat_labels = block_labels.ravel()
                counts += np.bincount(flat_labels, minlength=size)
                sea_depth = np.maximum(0, -bathy.astype(np.int32)).ravel()
                depth_sums += np.bincount(flat_labels, weights=sea_depth, minlength=size)
                direct_counts += np.bincount(flat_labels,
                                             weights=np.isin(tid, list(DIRECT_TID)).ravel(), minlength=size).astype(np.int64)
                tid70_counts += np.bincount(flat_labels, weights=(tid == 70).ravel(), minlength=size).astype(np.int64)
                row_values = np.repeat(np.arange(top, bottom, dtype=np.float64), width)
                col_values = np.tile(np.arange(width, dtype=np.float64), bottom - top)
                row_sums += np.bincount(flat_labels, weights=row_values, minlength=size)
                col_sums += np.bincount(flat_labels, weights=col_values, minlength=size)
                land_ext = bathy_ext >= 0
                near_land = ndimage.binary_dilation(land_ext, structure=np.ones((3, 3), dtype=bool))
                coastal_ids = np.unique(block_labels[(block_labels > 0) & near_land[top - ext_top:top - ext_top + (bottom - top)]])
                coastal[coastal_ids] = True
                add_ring_samples(block_labels, bathy_ext, top - ext_top, top, threshold, 1, near_sums, near_counts)
                add_ring_samples(block_labels, bathy_ext, top - ext_top, top, threshold, 12, wide_sums, wide_counts)
                if parent_labels is not None:
                    parent_block = np.asarray(parent_labels[top:bottom])
                    positive = flat_labels > 0
                    current_values = flat_labels[positive]
                    parent_values = parent_block.ravel()[positive]
                    unique, first = np.unique(current_values, return_index=True)
                    proposed = parent_values[first]
                    existing = parent_ids[unique]
                    parent_conflicts += int(((existing != 0) & (existing != proposed)).sum())
                    unset = existing == 0
                    parent_ids[unique[unset]] = proposed[unset]
                if bottom == height or bottom % 1200 == 0:
                    print(f'Seuil {threshold} m : agrégation {bottom}/{height}', flush=True)

            slices = ndimage.find_objects(labels)
            records = {}
            for component_id in range(1, size):
                count = int(counts[component_id])
                if not count:
                    continue
                centroid_row = row_sums[component_id] / count
                centroid_col = col_sums[component_id] / count
                latitude = metadata['north'] - (centroid_row + 0.5) * metadata['pixelSizeLatDeg']
                longitude = metadata['west'] + (centroid_col + 0.5) * metadata['pixelSizeLonDeg']
                pixel_area = (6371.0088 ** 2 * math.radians(metadata['pixelSizeLonDeg'])
                              * math.radians(metadata['pixelSizeLatDeg']) * math.cos(math.radians(latitude)))
                item_id = f'GLOBAL-T{level_index}-{component_id:06d}'
                parent_id = int(parent_ids[component_id]) if parent_labels is not None else 0
                mean_depth = depth_sums[component_id] / count
                near_mean = near_sums[component_id] / near_counts[component_id] if near_counts[component_id] else None
                wide_mean = wide_sums[component_id] / wide_counts[component_id] if wide_counts[component_id] else None
                bounds_slice = slices[component_id - 1]
                record = {
                    'id': item_id, 'level': level_index, 'thresholdM': threshold,
                    'cells': count, 'areaApproxKm2': count * pixel_area,
                    'classification': 'cotier' if coastal[component_id] else 'detache',
                    'centroid': {'lat': latitude, 'lon': longitude},
                    'bbox': {
                        'west': metadata['west'] + bounds_slice[1].start * metadata['pixelSizeLonDeg'],
                        'east': metadata['west'] + bounds_slice[1].stop * metadata['pixelSizeLonDeg'],
                        'north': metadata['north'] - bounds_slice[0].start * metadata['pixelSizeLatDeg'],
                        'south': metadata['north'] - bounds_slice[0].stop * metadata['pixelSizeLatDeg'],
                    },
                    'meanDepthM': mean_depth,
                    'nearRingMeanDepthM': near_mean,
                    'nearContrastM': near_mean - mean_depth if near_mean is not None else None,
                    'wideDirectionalMeanDepthM': wide_mean,
                    'wideContrastM': wide_mean - mean_depth if wide_mean is not None else None,
                    'directMeasurementPercent': direct_counts[component_id] / count * 100,
                    'mixedSourceTidPercent': tid70_counts[component_id] / count * 100,
                    'parentId': (f'GLOBAL-T{parent_level}-{parent_id:06d}' if parent_id else None),
                }
                if parent_id:
                    parent_record = all_levels[parent_level][parent_id]
                    record['rootId'] = parent_record['rootId']
                else:
                    record['rootId'] = item_id
                records[component_id] = record
            all_levels[level_index] = records
            print(f'Seuil {threshold} m : {len(records)} composantes, conflits parent={parent_conflicts}', flush=True)
            if parent_labels is not None:
                # Sous Windows, toutes les vues dérivées doivent être libérées
                # avant de supprimer le fichier memmap parent.
                del parent_block, parent_values, current_values
                parent_labels._mmap.close()
                del parent_labels
                gc.collect()
                Path(parent_path).unlink(missing_ok=True)
            # Le raster courant sera rouvert en lecture comme parent au niveau
            # suivant. Fermer ici son mapping évite de conserver un handle
            # Windows jusqu'à la fin du processus.
            del block_labels, flat_labels
            labels._mmap.close()
            del labels
            gc.collect()
            parent_path = current_path
            parent_level = level_index

    Path(parent_path).unlink(missing_ok=True)
    (generated_dir / 'mask-scratch.u8').unlink(missing_ok=True)

    roots = all_levels[5]
    for root in roots.values():
        root['nestedComponents'] = {str(level): 0 for level in range(1, 6)}
        root['nestedCells'] = {str(level): 0 for level in range(1, 6)}
        root['shallowestThresholdM'] = 12.0
    for level, records in all_levels.items():
        for record in records.values():
            root_number = int(record['rootId'].rsplit('-', 1)[1])
            root = roots[root_number]
            root['nestedComponents'][str(level)] += 1
            root['nestedCells'][str(level)] += record['cells']
            root['shallowestThresholdM'] = min(root['shallowestThresholdM'], record['thresholdM'])
    threshold_to_categories = {1.8: 5, 3.6: 4, 6.0: 3, 8.4: 2, 12.0: 1}
    candidates = []
    for root in roots.values():
        root['persistenceLevels'] = sum(root['nestedComponents'][str(level)] > 0 for level in range(1, 6))
        root['affectedCategories'] = threshold_to_categories[root['shallowestThresholdM']]
        score_candidate(root)
        candidates.append(root)
    candidates.sort(key=lambda item: (-item['documentaryPriorityScore'], -item['scientificConfidenceScore'], item['id']))

    output_json.write_text(json.dumps({'version': 1, 'candidates': candidates}, ensure_ascii=False, indent=2) + '\n',
                           encoding='utf-8', newline='\n')
    fields = ['id', 'latitude', 'longitude', 'classification', 'cells', 'areaApproxKm2',
              'shallowestThresholdM', 'affectedCategories', 'meanDepthM', 'nearContrastM',
              'wideContrastM', 'directMeasurementPercent', 'persistenceLevels',
              'scientificConfidenceScore', 'documentaryPriorityScore']
    with output_csv.open('w', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        for item in candidates:
            writer.writerow({
                'id': item['id'], 'latitude': item['centroid']['lat'], 'longitude': item['centroid']['lon'],
                **{key: item.get(key) for key in fields if key not in ('id', 'latitude', 'longitude')},
            })

    summary = {
        'version': 1,
        'levels': {str(level): {'thresholdM': thresholds[level - 1], 'components': len(records),
                                'singleCell': sum(item['cells'] == 1 for item in records.values()),
                                'detached': sum(item['classification'] == 'detache' for item in records.values())}
                   for level, records in sorted(all_levels.items())},
        'candidates12m': len(candidates),
        'highDocumentaryPriority': int(sum(item['documentaryPriorityScore'] >= 70 for item in candidates)),
        'highScientificConfidence': int(sum(item['scientificConfidenceScore'] >= 70 for item in candidates)),
        'topCandidates': candidates[:100],
        'artifacts': {'json': str(output_json), 'csv': str(output_csv)},
        'scoreNotice': 'Scores heuristiques destinés au tri humain, jamais à la suppression automatique.',
    }
    args.summary.parent.mkdir(parents=True, exist_ok=True)
    args.summary.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    (generated_dir / 'bathymetrie-globale-priorisation.json').write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps({key: value for key, value in summary.items() if key != 'topCandidates'}, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f'Erreur : {error}', file=sys.stderr)
        raise
