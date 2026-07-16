#!/usr/bin/env python3
"""Audite et classe le sous-ensemble GEBCO 2026 couvrant toute la Jaillot.

Le raster est lu par bandes pour ne jamais matérialiser simultanément les
77,76 millions de valeurs de bathymétrie et de TID en mémoire. La sortie
scientifique principale est un raster brut uint8 de classes exclusives.
"""

from __future__ import annotations

import argparse
import base64
import io
import json
import math
import sys
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image

from audit_gebco_bahamas import TID_COLORS, TID_LABELS, bathymetry_rgb, geotiff_metadata, tid_rgb
from classify_gebco_bahamas import CLASS_DEFINITIONS, DIRECT_TID, OBSERVATION_TID, classify, classes_rgb


Image.MAX_IMAGE_PIXELS = None
TOOL_DIR = Path(__file__).resolve().parent
DEFAULT_CONFIG = TOOL_DIR / 'bathymetrie-globale.json'
DEFAULT_REPORT = TOOL_DIR / 'output' / 'global' / 'bathymetrie-globale-audit.json'


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=DEFAULT_CONFIG)
    parser.add_argument('--report', type=Path, default=DEFAULT_REPORT)
    parser.add_argument('--chunk-rows', type=int, default=240)
    parser.add_argument('--preview-step', type=int, default=10)
    return parser.parse_args()


def data_uri(rgb):
    image = Image.fromarray(rgb, mode='RGB')
    buffer = io.BytesIO()
    image.save(buffer, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')


def write_source_svg(bathy_preview, tid_preview, metadata, tid_counts, output):
    bathy_uri = data_uri(bathymetry_rgb(bathy_preview, metadata['nodata']))
    tid_uri = data_uri(tid_rgb(tid_preview, 127))
    legend = []
    y = 845
    total = sum(tid_counts.values())
    for code, count in sorted(tid_counts.items()):
        color = TID_COLORS.get(code, (255, 255, 255))
        label = TID_LABELS.get(code, f'Code {code}')
        legend.append(
            f'<rect x="1160" y="{y - 14}" width="19" height="19" fill="rgb{color}"/>'
            f'<text x="1190" y="{y}" class="small">{code} — {label}: {count:,} ({count / total * 100:.2f} %)</text>'
        )
        y += 25
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2240px" height="1190px" viewBox="0 0 2240 1190">
  <title>GEBCO 2026 — emprise Jaillot globale — source et TID</title>
  <style>.title{{font:700 28px sans-serif;fill:#e2e8f0}}.label{{font:600 18px sans-serif;fill:#e2e8f0}}.small{{font:14px sans-serif;fill:#cbd5e1}}</style>
  <rect width="2240" height="1190" fill="#07111f"/>
  <text x="60" y="42" class="title">GEBCO 2026 — emprise Jaillot globale</text>
  <g id="bathymetrie_source"><text x="60" y="76" class="label">Bathymétrie</text><image x="60" y="95" width="1040" height="693" preserveAspectRatio="none" href="{bathy_uri}"/></g>
  <g id="tid_source"><text x="1160" y="76" class="label">TID — provenance</text><image x="1160" y="95" width="1040" height="693" preserveAspectRatio="none" href="{tid_uri}"/></g>
  <g id="legende_tid">{''.join(legend)}</g>
  <text x="60" y="1145" class="small">EPSG:{metadata['epsg']} · {metadata['width']} × {metadata['height']} · pas {metadata['intervalArcSeconds']:.0f}″ · emprise {metadata['west']} / {metadata['south']} / {metadata['east']} / {metadata['north']}</text>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def write_classes_svg(class_preview, stats, metadata, output):
    uri = data_uri(classes_rgb(class_preview))
    legend = []
    y = 145
    for item in stats:
        color = tuple(item['color'])
        legend.append(
            f'<rect x="1160" y="{y - 16}" width="22" height="22" fill="rgb{color}"/>'
            f'<text x="1195" y="{y}" class="small">{item["label"]} — {item["cells"]:,} cellules · '
            f'{item["areaApproxKm2"]:,.0f} km² · mesure directe {item["directMeasurementPercent"]:.1f} %</text>'
        )
        y += 40
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2240px" height="950px" viewBox="0 0 2240 950">
  <title>GEBCO 2026 — classes bathymétriques globales</title>
  <style>.title{{font:700 28px sans-serif;fill:#e2e8f0}}.small{{font:14px sans-serif;fill:#cbd5e1}}</style>
  <rect width="2240" height="950" fill="#07111f"/>
  <text x="60" y="42" class="title">Classes de navigation sûre — emprise Jaillot globale</text>
  <g id="classes_exclusives"><image x="60" y="75" width="1040" height="693" preserveAspectRatio="none" href="{uri}"/></g>
  <g id="legende_classes">{''.join(legend)}</g>
  <text x="60" y="900" class="small">Seuils sûrs 1,8 / 3,6 / 6 / 8,4 / 12 m · raster uint8 canonique conservé hors dépôt</text>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def main():
    args = arguments()
    config = json.loads(args.config.read_text(encoding='utf-8'))
    acquisition = config['acquisition']
    source_dir = Path(acquisition['sourceDirectory'])
    generated_dir = Path(config['generatedDirectory'])
    generated_dir.mkdir(parents=True, exist_ok=True)
    bathy_path = source_dir / acquisition['bathymetryFilename']
    tid_path = source_dir / acquisition['tidFilename']
    if not bathy_path.is_file() or not tid_path.is_file():
        raise FileNotFoundError('Sources globales absentes ; lancer check_gebco_global_sources.py.')

    with Image.open(bathy_path) as bathy_image, Image.open(tid_path) as tid_image:
        metadata = geotiff_metadata(bathy_image)
        tid_metadata = geotiff_metadata(tid_image)
        if any(abs(metadata[key] - tid_metadata[key]) > 1e-9 for key in
               ('width', 'height', 'west', 'south', 'east', 'north', 'epsg')):
            raise ValueError('Bathymétrie et TID non alignés.')

        width, height = metadata['width'], metadata['height']
        classes_path = generated_dir / 'gebco-2026-jaillot-classes.u8'
        class_raster = np.memmap(classes_path, dtype=np.uint8, mode='w+', shape=(height, width))
        class_counts = np.zeros(len(CLASS_DEFINITIONS), dtype=np.int64)
        class_areas = np.zeros(len(CLASS_DEFINITIONS), dtype=np.float64)
        joint_tid = np.zeros((len(CLASS_DEFINITIONS), 128), dtype=np.int64)
        tid_counts = Counter()
        min_value, max_value = None, None
        nodata_cells = sea_cells = land_cells = 0
        preview_bathy, preview_tid, preview_classes = [], [], []
        sample_columns = np.arange(args.preview_step // 2, width, args.preview_step)
        radius_km = 6371.0088
        dlon = math.radians(metadata['pixelSizeLonDeg'])
        dlat = math.radians(metadata['pixelSizeLatDeg'])

        for top in range(0, height, args.chunk_rows):
            bottom = min(height, top + args.chunk_rows)
            bathy = np.asarray(bathy_image.crop((0, top, width, bottom)), dtype=np.int32)
            tid = np.asarray(tid_image.crop((0, top, width, bottom)), dtype=np.uint8)
            classes = classify(bathy)
            class_raster[top:bottom] = classes
            valid = bathy != metadata['nodata']
            if valid.any():
                local_min, local_max = int(bathy[valid].min()), int(bathy[valid].max())
                min_value = local_min if min_value is None else min(min_value, local_min)
                max_value = local_max if max_value is None else max(max_value, local_max)
            nodata_cells += int((~valid).sum())
            sea_cells += int((valid & (bathy < 0)).sum())
            land_cells += int((valid & (bathy >= 0)).sum())
            tid_values, tid_local_counts = np.unique(tid, return_counts=True)
            tid_counts.update({int(code): int(count) for code, count in zip(tid_values, tid_local_counts) if int(code) != tid_metadata['nodata']})
            class_counts += np.bincount(classes.ravel(), minlength=len(CLASS_DEFINITIONS))
            combined = classes.astype(np.int16) * 128 + tid.astype(np.int16)
            joint_tid += np.bincount(combined.ravel(), minlength=len(CLASS_DEFINITIONS) * 128).reshape(len(CLASS_DEFINITIONS), 128)
            rows = np.arange(top, bottom)
            latitudes = metadata['north'] - (rows + 0.5) * metadata['pixelSizeLatDeg']
            row_areas = radius_km ** 2 * dlon * dlat * np.cos(np.deg2rad(latitudes))
            for class_id in range(len(CLASS_DEFINITIONS)):
                class_areas[class_id] += float(((classes == class_id).sum(axis=1) * row_areas).sum())
            sample_rows_global = np.arange(top + ((args.preview_step // 2 - top) % args.preview_step), bottom, args.preview_step)
            if len(sample_rows_global):
                local_rows = sample_rows_global - top
                preview_bathy.append(bathy[np.ix_(local_rows, sample_columns)])
                preview_tid.append(tid[np.ix_(local_rows, sample_columns)])
                preview_classes.append(classes[np.ix_(local_rows, sample_columns)])
            print(f'Bandes traitées : {bottom}/{height}', flush=True)

        class_raster.flush()

    stats = []
    for definition in CLASS_DEFINITIONS:
        class_id = definition['id']
        cells = int(class_counts[class_id])
        direct = int(joint_tid[class_id, list(DIRECT_TID)].sum())
        observed = int(joint_tid[class_id, list(OBSERVATION_TID)].sum())
        stats.append({
            **definition, 'cells': cells, 'percentOfRaster': cells / (width * height) * 100,
            'areaApproxKm2': float(class_areas[class_id]),
            'directMeasurementCells': direct,
            'directMeasurementPercent': direct / cells * 100 if cells else 0,
            'observedIncludingSatelliteCells': observed,
            'observedIncludingSatellitePercent': observed / cells * 100 if cells else 0,
            'tid': [{'code': code, 'label': TID_LABELS.get(code, 'Code non documenté'),
                     'cells': int(joint_tid[class_id, code]),
                     'percent': int(joint_tid[class_id, code]) / cells * 100 if cells else 0}
                    for code in range(128) if joint_tid[class_id, code]],
        })

    bathy_preview = np.vstack(preview_bathy)
    tid_preview = np.vstack(preview_tid)
    class_preview = np.vstack(preview_classes)
    source_svg = generated_dir / 'bathymetrie-01-source-globale.svg'
    classes_svg = generated_dir / 'bathymetrie-02-classes-globales.svg'
    write_source_svg(bathy_preview, tid_preview, metadata, tid_counts, source_svg)
    write_classes_svg(class_preview, stats, metadata, classes_svg)
    report = {
        'version': 1, 'dataset': config['dataset'], 'metadata': metadata,
        'bathymetry': {'minM': min_value, 'maxM': max_value, 'nodataCells': nodata_cells,
                       'seaCells': sea_cells, 'landCells': land_cells},
        'tid': [{'code': code, 'label': TID_LABELS.get(code, 'Code non documenté'),
                 'cells': count, 'percent': count / (width * height) * 100}
                for code, count in sorted(tid_counts.items())],
        'classes': stats,
        'artifacts': {'classesRaster': str(classes_path), 'sourceSvg': str(source_svg),
                      'classesSvg': str(classes_svg), 'classesRasterFormat': 'uint8 row-major'},
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    (generated_dir / 'bathymetrie-globale-audit.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps({'bathymetry': report['bathymetry'], 'tid': report['tid'],
                      'classes': stats, 'artifacts': report['artifacts']}, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f'Erreur : {error}', file=sys.stderr)
        raise
