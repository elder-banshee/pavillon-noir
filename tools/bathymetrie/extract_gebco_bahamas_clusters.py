#!/usr/bin/env python3
"""Extrait les amas bathymétriques cumulatifs GEBCO du prototype Bahamas."""

from __future__ import annotations

import argparse
import base64
import io
import json
import sys
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

from audit_gebco_bahamas import DEFAULT_BATHY, DEFAULT_TID, SAFE_THRESHOLDS, TID_LABELS, geotiff_metadata
from classify_gebco_bahamas import DIRECT_TID, OBSERVATION_TID


DEFAULT_OUTPUT = Path(__file__).resolve().parent / 'output' / 'gebco-bahamas'
COLORS = ['#fde047', '#fb923c', '#f87171', '#ec4899', '#a78bfa']


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bathymetry', type=Path, default=DEFAULT_BATHY)
    parser.add_argument('--tid', type=Path, default=DEFAULT_TID)
    parser.add_argument('--output-dir', type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument('--vector-min-cells', type=int, default=4)
    return parser.parse_args()


def pixel_area_rows(metadata):
    radius_km = 6371.0088
    dlon = np.deg2rad(metadata['pixelSizeLonDeg'])
    dlat = np.deg2rad(metadata['pixelSizeLatDeg'])
    rows = np.arange(metadata['height'])
    latitudes = metadata['north'] - (rows + 0.5) * metadata['pixelSizeLatDeg']
    return radius_km ** 2 * dlon * dlat * np.cos(np.deg2rad(latitudes))


def cell_edges(mask, row_offset, col_offset):
    """Retourne les cycles exacts de bord d'un masque binaire local."""
    edges = defaultdict(list)
    height, width = mask.shape
    for row, col in np.argwhere(mask):
        x, y = int(col + col_offset), int(row + row_offset)
        if row == 0 or not mask[row - 1, col]: edges[(x, y)].append((x + 1, y))
        if col == width - 1 or not mask[row, col + 1]: edges[(x + 1, y)].append((x + 1, y + 1))
        if row == height - 1 or not mask[row + 1, col]: edges[(x + 1, y + 1)].append((x, y + 1))
        if col == 0 or not mask[row, col - 1]: edges[(x, y + 1)].append((x, y))
    paths = []
    while edges:
        start = next(iter(edges))
        current, path = start, [start]
        while True:
            targets = edges.get(current)
            if not targets:
                break
            nxt = targets.pop()
            if not targets:
                del edges[current]
            path.append(nxt)
            current = nxt
            if current == start:
                break
        if len(path) >= 4:
            paths.append(simplify_collinear(path))
    return paths


def simplify_collinear(points):
    if len(points) <= 4:
        return points
    closed = points[0] == points[-1]
    core = points[:-1] if closed else points
    output = []
    for index, point in enumerate(core):
        previous = core[index - 1]
        following = core[(index + 1) % len(core)]
        if (point[0] - previous[0]) * (following[1] - point[1]) == (point[1] - previous[1]) * (following[0] - point[0]):
            continue
        output.append(point)
    if closed and output:
        output.append(output[0])
    return output


def svg_path(paths):
    chunks = []
    for path in paths:
        if not path:
            continue
        chunks.append(f'M {path[0][0]} {path[0][1]} ' + ' '.join(f'L {x} {y}' for x, y in path[1:]) + ' Z')
    return ' '.join(chunks)


def preview_uri(values, threshold):
    rgb = np.full((*values.shape, 3), (5, 18, 45), dtype=np.uint8)
    rgb[values >= 0] = (112, 98, 68)
    rgb[(values < 0) & (values > -threshold)] = (235, 73, 73)
    image = Image.fromarray(rgb, 'RGB')
    image.thumbnail((1080, 960), Image.Resampling.NEAREST)
    buffer = io.BytesIO(); image.save(buffer, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')


def extract_level(values, tid, metadata, threshold, level_index, vector_min_cells):
    mask = (values < 0) & (values > -threshold)
    # Connexité par côté : un simple contact diagonal ne constitue pas une passe continue.
    labels, count = ndimage.label(mask, structure=ndimage.generate_binary_structure(2, 1))
    slices = ndimage.find_objects(labels)
    land_neighbourhood = ndimage.binary_dilation(values >= 0, iterations=1)
    areas = pixel_area_rows(metadata)
    clusters, vector_paths = [], []
    for label_id, bounds_slice in enumerate(slices, start=1):
        if bounds_slice is None:
            continue
        local_labels = labels[bounds_slice]
        local = local_labels == label_id
        rows, cols = np.nonzero(local)
        global_rows = rows + bounds_slice[0].start
        global_cols = cols + bounds_slice[1].start
        cell_count = int(local.sum())
        depths = -values[global_rows, global_cols].astype(np.float64)
        tids = tid[global_rows, global_cols]
        coastal = bool(land_neighbourhood[global_rows, global_cols].any())
        direct = int(np.isin(tids, list(DIRECT_TID)).sum())
        observed = int(np.isin(tids, list(OBSERVATION_TID)).sum())
        min_row, max_row = int(global_rows.min()), int(global_rows.max())
        min_col, max_col = int(global_cols.min()), int(global_cols.max())
        centroid_row = float(global_rows.mean())
        centroid_col = float(global_cols.mean())
        cluster_id = f'BHS-T{level_index + 1}-{label_id:05d}'
        item = {
            'id': cluster_id, 'thresholdM': threshold, 'cells': cell_count,
            'areaApproxKm2': float(areas[global_rows].sum()),
            'coastal': coastal, 'classification': 'cotier' if coastal else 'detache',
            'shallowestDepthM': float(depths.min()), 'deepestDepthM': float(depths.max()),
            'meanDepthM': float(depths.mean()), 'medianDepthM': float(np.median(depths)),
            'directMeasurementPercent': direct / cell_count * 100,
            'observedIncludingSatellitePercent': observed / cell_count * 100,
            'centroid': {
                'lon': metadata['west'] + (centroid_col + 0.5) * metadata['pixelSizeLonDeg'],
                'lat': metadata['north'] - (centroid_row + 0.5) * metadata['pixelSizeLatDeg'],
            },
            'bbox': {
                'west': metadata['west'] + min_col * metadata['pixelSizeLonDeg'],
                'north': metadata['north'] - min_row * metadata['pixelSizeLatDeg'],
                'east': metadata['west'] + (max_col + 1) * metadata['pixelSizeLonDeg'],
                'south': metadata['north'] - (max_row + 1) * metadata['pixelSizeLatDeg'],
            },
            'tid': [{'code': int(code), 'label': TID_LABELS.get(int(code), 'Code non documenté'),
                     'cells': int(cells), 'percent': int(cells) / cell_count * 100}
                    for code, cells in sorted(Counter(int(v) for v in tids).items())],
            'vectorized': cell_count >= vector_min_cells,
        }
        clusters.append(item)
        if item['vectorized']:
            paths = cell_edges(local, bounds_slice[0].start, bounds_slice[1].start)
            vector_paths.append({'id': cluster_id, 'cells': cell_count, 'coastal': coastal, 'd': svg_path(paths)})
    clusters.sort(key=lambda item: (-item['cells'], item['id']))
    return clusters, vector_paths, int(count)


def build_svg(values, levels, metadata, output):
    width, panel_width, panel_height = 2240, 1040, 924
    height = 90 + len(levels) * 1020
    groups = []
    for index, level in enumerate(levels):
        y = 75 + index * 1020
        uri = preview_uri(values, level['thresholdM'])
        paths = []
        for item in level['vectorPaths']:
            stroke = '#22d3ee' if item['coastal'] else '#f8fafc'
            paths.append(f'<path id="{item["id"]}" d="{item["d"]}" fill="none" stroke="{stroke}" stroke-width="1.25" vector-effect="non-scaling-stroke" data-cells="{item["cells"]}" data-classification="{"cotier" if item["coastal"] else "detache"}"/>')
        summary = level['summary']
        groups.append(f'''
  <g id="seuil_{index + 1}" data-threshold-m="{level['thresholdM']}">
    <text x="60" y="{y - 18}" class="title">Seuil {str(level['thresholdM']).replace('.', ',')} m — {summary['clusters']} amas</text>
    <image x="60" y="{y}" width="{panel_width}" height="{panel_height}" preserveAspectRatio="none" href="{uri}"/>
    <g id="contours_{index + 1}" transform="translate(60 {y}) scale({panel_width / metadata['width']} {panel_height / metadata['height']})">{''.join(paths)}</g>
    <text x="1160" y="{y + 40}" class="label">Amas détachés : {summary['detached']} · côtiers : {summary['coastal']}</text>
    <text x="1160" y="{y + 75}" class="small">≥ 4 cellules : {summary['vectorized']} · 1 cellule : {summary['singleCell']}</text>
    <text x="1160" y="{y + 110}" class="small">Plus grand amas : {summary['largestCells']:,} cellules · {summary['largestAreaKm2']:,.0f} km²</text>
    <text x="1160" y="{y + 145}" class="small">Contours cyan : côtiers · blancs : détachés · rouge : masque complet</text>
  </g>''')
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}px" height="{height}px" viewBox="0 0 {width} {height}">
  <title>GEBCO 2026 Bahamas — amas bathymétriques</title>
  <style>.title{{font:700 25px sans-serif;fill:#e2e8f0}}.label{{font:600 18px sans-serif;fill:#e2e8f0}}.small{{font:14px sans-serif;fill:#cbd5e1}}</style>
  <rect width="100%" height="100%" fill="#07111f"/>
  {''.join(groups)}
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def main():
    args = arguments(); args.output_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(args.bathymetry) as bathy_image, Image.open(args.tid) as tid_image:
        metadata = geotiff_metadata(bathy_image)
        values = np.asarray(bathy_image, dtype=np.int32)
        tid = np.asarray(tid_image, dtype=np.uint8)
    levels = []
    for index, threshold in enumerate(SAFE_THRESHOLDS):
        clusters, paths, raw_count = extract_level(values, tid, metadata, threshold, index, args.vector_min_cells)
        summary = {
            'clusters': raw_count, 'coastal': sum(item['coastal'] for item in clusters),
            'detached': sum(not item['coastal'] for item in clusters),
            'vectorized': sum(item['vectorized'] for item in clusters),
            'singleCell': sum(item['cells'] == 1 for item in clusters),
            'largestCells': clusters[0]['cells'] if clusters else 0,
            'largestAreaKm2': clusters[0]['areaApproxKm2'] if clusters else 0,
        }
        levels.append({'thresholdM': threshold, 'summary': summary, 'clusters': clusters, 'vectorPaths': paths})
    build_svg(values, levels, metadata, args.output_dir / 'bathymetrie-03-amas.svg')
    report = {
        'version': 1, 'connectivity': '4-neighbours',
        'coastalRule': 'au moins une cellule de l’amas adjacente par côté ou coin à elevation >= 0',
        'vectorMinCells': args.vector_min_cells,
        'levels': [{key: value for key, value in level.items() if key != 'vectorPaths'} for level in levels],
    }
    (args.output_dir / 'bathymetrie-03-amas.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps([{'thresholdM': level['thresholdM'], **level['summary']} for level in levels], ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    try: raise SystemExit(main())
    except Exception as error:
        print(f'Erreur : {error}', file=sys.stderr); raise
