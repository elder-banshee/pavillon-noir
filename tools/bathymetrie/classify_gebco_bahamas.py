#!/usr/bin/env python3
"""Classe la bathymétrie GEBCO Bahamas selon les seuils de navigation sûre."""

from __future__ import annotations

import argparse
import base64
import io
import json
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image

from audit_gebco_bahamas import (
    DEFAULT_BATHY, DEFAULT_TID, SAFE_THRESHOLDS, TID_LABELS, geotiff_metadata,
)


DEFAULT_OUTPUT = Path(__file__).resolve().parent / 'output' / 'gebco-bahamas'

# Classes exclusives : terre, puis profondeur sûre insuffisante pour la
# catégorie indiquée, puis eaux de 12 m ou davantage.
CLASS_DEFINITIONS = [
    {'id': 0, 'key': 'terre', 'label': 'Terre', 'color': (128, 112, 82)},
    {'id': 1, 'key': 'moins_1_8', 'label': '0–1,8 m', 'color': (255, 238, 124)},
    {'id': 2, 'key': '1_8_3_6', 'label': '1,8–3,6 m', 'color': (253, 186, 90)},
    {'id': 3, 'key': '3_6_6', 'label': '3,6–6 m', 'color': (251, 128, 114)},
    {'id': 4, 'key': '6_8_4', 'label': '6–8,4 m', 'color': (244, 100, 158)},
    {'id': 5, 'key': '8_4_12', 'label': '8,4–12 m', 'color': (167, 139, 250)},
    {'id': 6, 'key': '12_plus', 'label': '12 m et plus', 'color': (30, 64, 175)},
]
DIRECT_TID = {10, 11, 12, 13, 14, 15, 16, 17}
OBSERVATION_TID = DIRECT_TID


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bathymetry', type=Path, default=DEFAULT_BATHY)
    parser.add_argument('--tid', type=Path, default=DEFAULT_TID)
    parser.add_argument('--output-dir', type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def classify(values):
    classes = np.full(values.shape, 6, dtype=np.uint8)
    classes[values >= 0] = 0
    sea = values < 0
    depth = -values.astype(np.float64)
    classes[sea & (depth < SAFE_THRESHOLDS[0])] = 1
    for class_id, (lower, upper) in enumerate(zip(SAFE_THRESHOLDS[:-1], SAFE_THRESHOLDS[1:]), start=2):
        classes[sea & (depth >= lower) & (depth < upper)] = class_id
    return classes


def raster_uri(rgb):
    image = Image.fromarray(rgb, mode='RGB')
    image.thumbnail((1080, 960), Image.Resampling.NEAREST)
    buffer = io.BytesIO()
    image.save(buffer, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')


def classes_rgb(classes):
    rgb = np.zeros((*classes.shape, 3), dtype=np.uint8)
    for definition in CLASS_DEFINITIONS:
        rgb[classes == definition['id']] = definition['color']
    return rgb


def cumulative_rgb(values, threshold):
    rgb = np.full((*values.shape, 3), (7, 21, 45), dtype=np.uint8)
    rgb[values >= 0] = (105, 94, 70)
    unsafe = (values < 0) & (values > -threshold)
    rgb[unsafe] = (250, 92, 92)
    return rgb


def statistics(classes, tid, metadata):
    pixel_area_rows = []
    radius_km = 6371.0088
    dlon = np.deg2rad(metadata['pixelSizeLonDeg'])
    dlat = np.deg2rad(metadata['pixelSizeLatDeg'])
    for row in range(metadata['height']):
        latitude = metadata['north'] - (row + 0.5) * metadata['pixelSizeLatDeg']
        pixel_area_rows.append(radius_km ** 2 * dlon * dlat * np.cos(np.deg2rad(latitude)))
    row_areas = np.asarray(pixel_area_rows)[:, None]
    output = []
    for definition in CLASS_DEFINITIONS:
        mask = classes == definition['id']
        count = int(mask.sum())
        tid_counts = Counter(int(value) for value in tid[mask])
        direct = int(np.isin(tid, list(DIRECT_TID))[mask].sum())
        observed = int(np.isin(tid, list(OBSERVATION_TID))[mask].sum())
        output.append({
            **definition,
            'cells': count,
            'percentOfRaster': count / classes.size * 100,
            'areaApproxKm2': float((mask * row_areas).sum()),
            'directMeasurementCells': direct,
            'directMeasurementPercent': direct / count * 100 if count else 0,
            'observedIncludingSatelliteCells': observed,
            'observedIncludingSatellitePercent': observed / count * 100 if count else 0,
            'tid': [{'code': code, 'label': TID_LABELS.get(code, 'Code non documenté'),
                     'cells': cells, 'percent': cells / count * 100 if count else 0}
                    for code, cells in sorted(tid_counts.items())],
        })
    return output


def build_svg(values, classes, stats, metadata, output):
    main_uri = raster_uri(classes_rgb(classes))
    panels = []
    for index, threshold in enumerate(SAFE_THRESHOLDS):
        x = 60 + (index % 3) * 710
        y = 1150 + (index // 3) * 660
        uri = raster_uri(cumulative_rgb(values, threshold))
        panels.append(f'''
  <g id="cumulatif_cat_{index + 1}" data-threshold-m="{threshold}">
    <text x="{x}" y="{y - 16}" class="label">Catégorie {index + 1} — profondeur sûre {str(threshold).replace('.', ',')} m</text>
    <image x="{x}" y="{y}" width="650" height="578" preserveAspectRatio="none" href="{uri}"/>
  </g>''')
    legend = []
    y = 120
    for item in stats:
        color = tuple(item['color'])
        legend.append(
            f'<rect x="1170" y="{y - 16}" width="22" height="22" fill="rgb{color}"/>'
            f'<text x="1204" y="{y}" class="small">{item["label"]} — {item["cells"]:,} cellules · '
            f'{item["areaApproxKm2"]:,.0f} km² · mesure directe {item["directMeasurementPercent"]:.1f} %</text>'
        )
        y += 36
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2240px" height="2470px" viewBox="0 0 2240 2470">
  <title>GEBCO 2026 Bahamas — classes de navigation sûre</title>
  <style>.title{{font:700 28px sans-serif;fill:#e2e8f0}}.label{{font:600 18px sans-serif;fill:#e2e8f0}}.small{{font:14px sans-serif;fill:#cbd5e1}}</style>
  <rect width="2240" height="2470" fill="#07111f"/>
  <g id="classes_exclusives">
    <text x="60" y="42" class="title">GEBCO 2026 — Bahamas — classes bathymétriques exclusives</text>
    <image x="60" y="75" width="1040" height="924" preserveAspectRatio="none" href="{main_uri}"/>
  </g>
  <g id="legende_classes">{''.join(legend)}</g>
  <g id="note">
    <text x="1170" y="410" class="small">Les profondeurs GEBCO sont entières : les seuils décimaux sont néanmoins conservés.</text>
    <text x="1170" y="438" class="small">Rouge dans les panneaux cumulatifs = marge sous quille insuffisante.</text>
    <text x="1170" y="466" class="small">Le TID reste une provenance, pas une correction de profondeur.</text>
  </g>
  <text x="60" y="1095" class="title">Masques cumulatifs par catégorie</text>
  {''.join(panels)}
  <text x="60" y="2435" class="small">EPSG:{metadata['epsg']} · pas {metadata['intervalArcSeconds']:.0f}″ · marge sous quille 20 % · emprise {metadata['west']} / {metadata['south']} / {metadata['east']} / {metadata['north']}</text>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def main():
    args = arguments()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(args.bathymetry) as bathy_image, Image.open(args.tid) as tid_image:
        metadata = geotiff_metadata(bathy_image)
        tid_metadata = geotiff_metadata(tid_image)
        values = np.asarray(bathy_image, dtype=np.int32)
        tid = np.asarray(tid_image, dtype=np.uint8)
    if values.shape != tid.shape or any(metadata[key] != tid_metadata[key] for key in
                                       ('width', 'height', 'west', 'south', 'east', 'north', 'epsg')):
        raise ValueError('Bathymétrie et TID non alignés.')
    classes = classify(values)
    stats = statistics(classes, tid, metadata)
    build_svg(values, classes, stats, metadata, args.output_dir / 'bathymetrie-02-classes.svg')
    report = {
        'version': 1,
        'thresholdsSafeDepthM': SAFE_THRESHOLDS,
        'classificationRule': 'terre si elevation >= 0; sinon bandes exclusives par profondeur positive',
        'directTidCodes': sorted(DIRECT_TID),
        'observedIncludingSatelliteTidCodes': sorted(OBSERVATION_TID),
        'classes': stats,
    }
    (args.output_dir / 'bathymetrie-02-classes.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n'
    )
    print(json.dumps({'classes': stats, 'output': str(args.output_dir)}, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f'Erreur : {error}', file=sys.stderr)
        raise
