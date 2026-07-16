#!/usr/bin/env python3
"""Transpose les contours GEBCO Bahamas vers Jaillot via le maillage Copernicus."""

from __future__ import annotations

import argparse
import json
import math
import sys
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.spatial import Delaunay

from audit_gebco_bahamas import DEFAULT_BATHY, SAFE_THRESHOLDS, geotiff_metadata
from audit_warp_copernicus import DEFAULT_SOURCE, DEFAULT_TARGET, DOMAIN_COLORS, source_nodes, target_nodes
from extract_gebco_bahamas_clusters import cell_edges


DEFAULT_OUTPUT = Path(__file__).resolve().parent / 'output' / 'gebco-bahamas'
COLORS = ['#fde047', '#fb923c', '#f87171', '#ec4899', '#a78bfa']


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bathymetry', type=Path, default=DEFAULT_BATHY)
    parser.add_argument('--source-svg', type=Path, default=DEFAULT_SOURCE)
    parser.add_argument('--target-svg', type=Path, default=DEFAULT_TARGET)
    parser.add_argument('--output-dir', type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument('--vector-min-cells', type=int, default=4)
    return parser.parse_args()


ATLANTIC_DOMAINS = ['bahamas', 'florida', 'atlantic', 'caribbean', 'gulf_mexico']


def domain_mesh(source, versions, domain):
    nodes = {}
    for source_id, items in versions.items():
        candidates = [item for item in items if item['domain'] == domain]
        if not candidates or source_id not in source:
            continue
        item = candidates[0]
        nodes[(item['row'], item['col'])] = {
            'id': source_id, 'row': item['row'], 'col': item['col'],
            'lon': source[source_id]['lon'], 'lat': source[source_id]['lat'],
            'x': item['x'], 'y': item['y'],
        }
    node_list = list(nodes.values())
    coordinates = np.asarray([[item['lon'], item['lat']] for item in node_list])
    delaunay = Delaunay(coordinates)
    triangles, rejected = [], Counter()
    for index, simplex in enumerate(delaunay.simplices):
        points = tuple(node_list[int(i)] for i in simplex)
        source_area = ((points[1]['lon'] - points[0]['lon']) * (points[2]['lat'] - points[0]['lat'])
                       - (points[1]['lat'] - points[0]['lat']) * (points[2]['lon'] - points[0]['lon']))
        target_area = ((points[1]['x'] - points[0]['x']) * (points[2]['y'] - points[0]['y'])
                       - (points[1]['y'] - points[0]['y']) * (points[2]['x'] - points[0]['x']))
        max_edge = max(math.hypot(a['lon'] - b['lon'], a['lat'] - b['lat'])
                       for a, b in ((points[0], points[1]), (points[1], points[2]), (points[2], points[0])))
        # Y Jaillot croît vers le bas : les orientations source/cible doivent être opposées.
        if source_area * target_area >= 0:
            rejected['orientation'] += 1; continue
        # Évite de fermer artificiellement de très vastes lacunes hors du domaine.
        if max_edge > 1.5:
            rejected['edgeOver1_5Deg'] += 1; continue
        lons = [p['lon'] for p in points]; lats = [p['lat'] for p in points]
        triangles.append({'id': f'{domain}_delaunay_{index}', 'points': points,
                          'bbox': (min(lons), min(lats), max(lons), max(lats))})
    return nodes, triangles, dict(rejected)


def triangle_index(triangles, cell_deg=0.5):
    index = defaultdict(list)
    for triangle in triangles:
        west, south, east, north = triangle['bbox']
        for gx in range(math.floor(west / cell_deg), math.floor(east / cell_deg) + 1):
            for gy in range(math.floor(south / cell_deg), math.floor(north / cell_deg) + 1):
                index[(gx, gy)].append(triangle)
    return index, cell_deg


def barycentric(lon, lat, triangle, epsilon=1e-9):
    a, b, c = triangle['points']
    denominator = ((b['lat'] - c['lat']) * (a['lon'] - c['lon'])
                   + (c['lon'] - b['lon']) * (a['lat'] - c['lat']))
    if abs(denominator) < 1e-14:
        return None
    wa = ((b['lat'] - c['lat']) * (lon - c['lon'])
          + (c['lon'] - b['lon']) * (lat - c['lat'])) / denominator
    wb = ((c['lat'] - a['lat']) * (lon - c['lon'])
          + (a['lon'] - c['lon']) * (lat - c['lat'])) / denominator
    wc = 1 - wa - wb
    if min(wa, wb, wc) < -epsilon or max(wa, wb, wc) > 1 + epsilon:
        return None
    return wa, wb, wc


def warp_point(lon, lat, domain_indexes):
    domain_results = []
    for domain in ATLANTIC_DOMAINS:
        index, cell_deg = domain_indexes[domain]
        candidates = index.get((math.floor(lon / cell_deg), math.floor(lat / cell_deg)), [])
        matches = []
        for triangle in candidates:
            west, south, east, north = triangle['bbox']
            if lon < west - 1e-9 or lon > east + 1e-9 or lat < south - 1e-9 or lat > north + 1e-9:
                continue
            weights = barycentric(lon, lat, triangle)
            if weights is not None:
                a, b, c = triangle['points']; wa, wb, wc = weights
                matches.append((wa * a['x'] + wb * b['x'] + wc * c['x'],
                                wa * a['y'] + wb * b['y'] + wc * c['y']))
        if matches:
            domain_results.append({
                'domain': domain,
                'x': sum(m[0] for m in matches) / len(matches),
                'y': sum(m[1] for m in matches) / len(matches),
                'triangleMatches': len(matches),
            })
    if not domain_results:
        return None, []
    # Ordre de priorité explicite pour le prototype régional. Une géométrie
    # publiée sera ensuite découpée/cousue aux frontières de domaines ; ici on
    # mesure aussi les divergences d'overlap au lieu de les masquer.
    return (domain_results[0]['x'], domain_results[0]['y']), domain_results


def raster_to_wgs84(point, metadata):
    col, row = point
    return (metadata['west'] + col * metadata['pixelSizeLonDeg'],
            metadata['north'] - row * metadata['pixelSizeLatDeg'])


def fmt(value):
    return f'{value:.2f}'.rstrip('0').rstrip('.')


def path_data(paths):
    chunks = []
    for path in paths:
        if len(path) < 4:
            continue
        chunks.append(f'M {fmt(path[0][0])} {fmt(path[0][1])} '
                      + ' '.join(f'L {fmt(x)} {fmt(y)}' for x, y in path[1:]) + ' Z')
    return ' '.join(chunks)


def extract_and_warp(values, metadata, domain_indexes, threshold, level_index, min_cells):
    mask = (values < 0) & (values > -threshold)
    labels, _ = ndimage.label(mask, structure=ndimage.generate_binary_structure(2, 1))
    slices = ndimage.find_objects(labels)
    objects, counters = [], defaultdict(int)
    missing_examples = []
    for label_id, bounds_slice in enumerate(slices, start=1):
        if bounds_slice is None:
            continue
        local = labels[bounds_slice] == label_id
        cells = int(local.sum())
        if cells < min_cells:
            continue
        source_paths = cell_edges(local, bounds_slice[0].start, bounds_slice[1].start)
        warped_paths = []
        object_missing = 0
        for source_path in source_paths:
            warped = []
            for raster_point in source_path:
                lon, lat = raster_to_wgs84(raster_point, metadata)
                result, domain_results = warp_point(lon, lat, domain_indexes)
                counters['vertices'] += 1
                if len(domain_results) > 1:
                    counters['overlapVertices'] += 1
                    spread = max(math.hypot(item['x'] - domain_results[0]['x'], item['y'] - domain_results[0]['y'])
                                 for item in domain_results[1:])
                    if spread > 10: counters['overlapSpreadOver10Px'] += 1
                if result is None:
                    counters['missingVertices'] += 1; object_missing += 1
                    if len(missing_examples) < 50: missing_examples.append({'lon': lon, 'lat': lat})
                else:
                    warped.append(result)
            if object_missing == 0 and len(warped) >= 4:
                warped_paths.append(warped)
        if object_missing:
            counters['partialObjects'] += 1
        elif warped_paths:
            counters['completeObjects'] += 1
            objects.append({'id': f'BHS-J-T{level_index + 1}-{label_id:05d}', 'cells': cells,
                            'paths': warped_paths})
    return objects, dict(counters), missing_examples


def build_svg(domain_nodes, domain_triangles, levels, output):
    mesh_paths = []
    for domain in ATLANTIC_DOMAINS:
        for triangle in domain_triangles[domain]:
            pts = triangle['points']
            mesh_paths.append(f'<path d="M {fmt(pts[0]["x"])} {fmt(pts[0]["y"])} L {fmt(pts[1]["x"])} {fmt(pts[1]["y"])} L {fmt(pts[2]["x"])} {fmt(pts[2]["y"])} Z" data-domain="{domain}"/>')
    layers = []
    for index, level in enumerate(levels):
        shapes = [f'<path id="{item["id"]}" d="{path_data(item["paths"])}" data-cells="{item["cells"]}"/>' for item in level['objects']]
        display = 'inline' if index == len(levels) - 1 else 'none'
        layers.append(f'''<g id="bathymetrie_seuil_{index + 1}" style="display:{display}" fill="{COLORS[index]}" fill-opacity="0.30" stroke="{COLORS[index]}" stroke-width="1.5" fill-rule="evenodd" data-threshold-m="{level['thresholdM']}">{''.join(shapes)}</g>''')
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="8500px" height="5320px" viewBox="0 0 8500 5320">
  <title>GEBCO 2026 Bahamas — contours transposés sur Jaillot</title>
  <rect width="8500" height="5320" fill="#07111f"/>
  <g id="jaillot_reference" opacity="0.72"><image href="../../../medias/cartes/jaillot-1708.jpg" x="0" y="0" width="8500" height="5320" preserveAspectRatio="none"/></g>
  <g id="maillages_atlantiques" fill="none" stroke="{DOMAIN_COLORS['bahamas']}" stroke-width="0.7" opacity="0.32">{''.join(mesh_paths)}</g>
  {''.join(layers)}
  <g id="noeuds_domaines" fill="#38bdf8">{''.join(f'<circle cx="{fmt(item["x"])}" cy="{fmt(item["y"])}" r="1.5" data-domain="{domain}"/>' for domain in ATLANTIC_DOMAINS for item in domain_nodes[domain].values())}</g>
  <text x="190" y="345" fill="#e2e8f0" font-family="sans-serif" font-size="30">GEBCO Bahamas → Jaillot · seuil 12 m affiché par défaut</text>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def main():
    args = arguments(); args.output_dir.mkdir(parents=True, exist_ok=True)
    source, source_duplicates = source_nodes(args.source_svg)
    _, versions, _ = target_nodes(args.target_svg)
    domain_nodes, domain_triangles, domain_rejected, domain_indexes = {}, {}, {}, {}
    for domain in ATLANTIC_DOMAINS:
        domain_nodes[domain], domain_triangles[domain], domain_rejected[domain] = domain_mesh(source, versions, domain)
        domain_indexes[domain] = triangle_index(domain_triangles[domain])
    with Image.open(args.bathymetry) as image:
        metadata = geotiff_metadata(image); values = np.asarray(image, dtype=np.int32)
    levels = []
    for index, threshold in enumerate(SAFE_THRESHOLDS):
        objects, counters, missing = extract_and_warp(values, metadata, domain_indexes, threshold, index, args.vector_min_cells)
        levels.append({'thresholdM': threshold, 'objects': objects, 'audit': counters,
                       'missingVertexExamples': missing})
    build_svg(domain_nodes, domain_triangles, levels, args.output_dir / 'bathymetrie-04-jaillot-brut.svg')
    report = {
        'version': 3, 'domains': ATLANTIC_DOMAINS, 'excludedDomains': ['pacific'],
        'domainPriority': ATLANTIC_DOMAINS,
        'interpolation': 'barycentrique sur triangulation Delaunay des contrôles homologues, sans communication Pacifique',
        'mesh': {domain: {'nodes': len(domain_nodes[domain]), 'triangles': len(domain_triangles[domain]),
                          'rejected': domain_rejected[domain]}
                 for domain in ATLANTIC_DOMAINS},
        'sourceDuplicates': len(source_duplicates),
        'levels': [{**{key: value for key, value in level.items() if key != 'objects'},
                    'exportedObjects': len(level['objects'])} for level in levels],
    }
    (args.output_dir / 'bathymetrie-04-jaillot-brut.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps(report, ensure_ascii=False, indent=2)); return 0


if __name__ == '__main__':
    try: raise SystemExit(main())
    except Exception as error:
        print(f'Erreur : {error}', file=sys.stderr); raise
