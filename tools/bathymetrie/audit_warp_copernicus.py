#!/usr/bin/env python3
"""Audite le maillage de transfert Copernicus/WGS84 vers Jaillot.

Le SVG quiver porte les coordonnées WGS84 de chaque ``copernicus_q_*``.
Le SVG marionnette conserve ces identifiants sur les nœuds déplacés dans le
repère Jaillot. Ce script apparie les deux jeux, recoud les doublons des
sous-domaines et produit des contrôles SVG et un rapport JSON.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path


REPO = Path(__file__).resolve().parents[2]
DEFAULT_GENERATION = REPO.parent / 'Accessoires site pavillon noir' / 'Outils generation'
DEFAULT_SOURCE = DEFAULT_GENERATION / 'Sources' / 'courants-copernicus-quiver.svg'
DEFAULT_TARGET = DEFAULT_GENERATION / 'Sources' / 'courants-marionnette.svg'
DEFAULT_OUTPUT = Path(__file__).resolve().parent / 'output' / 'warp-copernicus'

SVG_NS = 'http://www.w3.org/2000/svg'
SOURCE_RE = re.compile(r'copernicus_q_\d+')
ROW_COL_RE = re.compile(r'_r(\d+)_c(\d+)_')
TOKEN_RE = re.compile(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?')
DOMAIN_ORDER = ['gulf_mexico', 'caribbean', 'bahamas', 'florida', 'atlantic', 'pacific']
DOMAIN_COLORS = {
    'gulf_mexico': '#16a34a', 'caribbean': '#0d9488', 'bahamas': '#0284c7',
    'florida': '#7c3aed', 'atlantic': '#1d4ed8', 'pacific': '#db2777',
}


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-svg', type=Path, default=DEFAULT_SOURCE)
    parser.add_argument('--target-svg', type=Path, default=DEFAULT_TARGET)
    parser.add_argument('--output-dir', type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def qname(name):
    return f'{{{SVG_NS}}}{name}'


def fmt(value, digits=3):
    return f'{value:.{digits}f}'.rstrip('0').rstrip('.')


def path_points(path_data):
    """Extrait les points utiles des paths Illustrator usuels."""
    tokens = TOKEN_RE.findall(path_data or '')
    points, index, command = [], 0, None
    x = y = 0.0
    start = (0.0, 0.0)

    def is_command(value):
        return len(value) == 1 and value.isalpha()

    def number():
        nonlocal index
        value = float(tokens[index])
        index += 1
        return value

    while index < len(tokens):
        if is_command(tokens[index]):
            command = tokens[index]
            index += 1
        if command is None:
            break
        lower, relative = command.lower(), command.islower()
        if lower == 'z':
            x, y = start
            points.append((x, y))
            command = None
        elif lower == 'm':
            while index + 1 < len(tokens) and not is_command(tokens[index]):
                nx, ny = number(), number()
                x, y = (x + nx, y + ny) if relative else (nx, ny)
                start = (x, y)
                points.append((x, y))
                command = 'l' if relative else 'L'
                lower = 'l'
        elif lower == 'l':
            while index + 1 < len(tokens) and not is_command(tokens[index]):
                nx, ny = number(), number()
                x, y = (x + nx, y + ny) if relative else (nx, ny)
                points.append((x, y))
        elif lower == 'h':
            while index < len(tokens) and not is_command(tokens[index]):
                nx = number()
                x = x + nx if relative else nx
                points.append((x, y))
        elif lower == 'v':
            while index < len(tokens) and not is_command(tokens[index]):
                ny = number()
                y = y + ny if relative else ny
                points.append((x, y))
        elif lower in ('c', 's', 'q'):
            count = 6 if lower == 'c' else 4
            while index + count - 1 < len(tokens) and not is_command(tokens[index]):
                values = [number() for _ in range(count)]
                coords = [(values[i], values[i + 1]) for i in range(0, count, 2)]
                base_x, base_y = x, y
                for px, py in coords:
                    points.append((base_x + px, base_y + py) if relative else (px, py))
                ex, ey = coords[-1]
                x, y = (base_x + ex, base_y + ey) if relative else (ex, ey)
        elif lower == 't':
            while index + 1 < len(tokens) and not is_command(tokens[index]):
                nx, ny = number(), number()
                x, y = (x + nx, y + ny) if relative else (nx, ny)
                points.append((x, y))
        elif lower == 'a':
            while index + 6 < len(tokens) and not is_command(tokens[index]):
                values = [number() for _ in range(7)]
                ex, ey = values[5], values[6]
                x, y = (x + ex, y + ey) if relative else (ex, ey)
                points.append((x, y))
        else:
            break
    return points


def node_center(element):
    if element.tag == qname('circle'):
        return float(element.attrib['cx']), float(element.attrib['cy'])
    points = path_points(element.attrib.get('d', ''))
    if not points:
        return None
    xs, ys = [p[0] for p in points], [p[1] for p in points]
    return (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2


def source_nodes(path):
    root = ET.parse(path).getroot()
    nodes = {}
    duplicates = []
    for element in root.iter():
        element_id = element.attrib.get('id', '')
        match = SOURCE_RE.fullmatch(element_id)
        if not match or 'data-lat' not in element.attrib or 'data-lon' not in element.attrib:
            continue
        item = {
            'id': element_id,
            'lat': float(element.attrib['data-lat']),
            'lon': float(element.attrib['data-lon']),
        }
        if element_id in nodes:
            duplicates.append(element_id)
        nodes[element_id] = item
    return nodes, sorted(set(duplicates))


def domain_from_stack(stack):
    for value in reversed(stack):
        for domain in DOMAIN_ORDER:
            if value in (domain, f'{domain}_nodes', f'{domain}_arrows'):
                return domain
    return None


def target_nodes(path):
    root = ET.parse(path).getroot()
    versions = defaultdict(list)
    cropped = []

    def walk(element, stack):
        element_id = element.attrib.get('id', '')
        next_stack = stack + ([element_id] if element_id else [])
        match = SOURCE_RE.search(element_id)
        if match and element_id.startswith('node_'):
            source_id = match.group(0)
            domain = domain_from_stack(next_stack)
            row_col = ROW_COL_RE.search(element_id)
            is_cropped = any('cropped' in token.lower() for token in next_stack)
            center = node_center(element)
            if is_cropped:
                cropped.append(source_id)
            elif domain and center:
                versions[source_id].append({
                    'id': source_id, 'elementId': element_id, 'domain': domain,
                    'row': int(row_col.group(1)) if row_col else None,
                    'col': int(row_col.group(2)) if row_col else None,
                    'x': center[0], 'y': center[1],
                })
        for child in list(element):
            walk(child, next_stack)

    walk(root, [])
    stitched = {}
    for source_id, items in versions.items():
        stitched[source_id] = {
            'id': source_id,
            'x': sum(item['x'] for item in items) / len(items),
            'y': sum(item['y'] for item in items) / len(items),
            'row': next((item['row'] for item in items if item['row'] is not None), None),
            'col': next((item['col'] for item in items if item['col'] is not None), None),
            'domains': sorted({item['domain'] for item in items}, key=DOMAIN_ORDER.index),
            'versions': len(items),
            'spreadPx': max(math.hypot(
                item['x'] - sum(v['x'] for v in items) / len(items),
                item['y'] - sum(v['y'] for v in items) / len(items),
            ) for item in items),
        }
    return stitched, versions, sorted(set(cropped))


def bounds(items, x_key, y_key):
    xs, ys = [item[x_key] for item in items], [item[y_key] for item in items]
    return [min(xs), min(ys), max(xs), max(ys)] if xs else None


def signed_area(a, b, c, x_key, y_key):
    return ((b[x_key] - a[x_key]) * (c[y_key] - a[y_key])
            - (b[y_key] - a[y_key]) * (c[x_key] - a[x_key])) / 2


def mesh_topology(pairs):
    """Reconstruit les quads row/col complets et contrôle leurs triangles."""
    quads, triangles = [], []
    for domain in DOMAIN_ORDER:
        domain_items = [item for item in pairs if item.get('domain') == domain]
        by_rc = {(item['row'], item['col']): item for item in domain_items
                 if item['row'] is not None and item['col'] is not None}
        for (row, col), top_left in sorted(by_rc.items()):
            top_right = by_rc.get((row, col + 1))
            bottom_left = by_rc.get((row + 1, col))
            bottom_right = by_rc.get((row + 1, col + 1))
            if not all((top_right, bottom_left, bottom_right)):
                continue
            quads.append({'row': row, 'col': col, 'domain': domain})
            for index, (a, b, c) in enumerate(((top_left, top_right, bottom_right), (top_left, bottom_right, bottom_left))):
                source_area = signed_area(a, b, c, 'lon', 'lat')
                target_area = signed_area(a, b, c, 'x', 'y')
                # Latitude croît vers le haut, alors que Y Jaillot croît vers le bas.
                orientation_ok = source_area * target_area < 0
                triangles.append({
                    'id': f'{domain}_r{row}_c{col}_t{index}', 'row': row, 'col': col,
                    'domain': domain, 'sourceAreaDeg2': source_area, 'targetAreaPx2': target_area,
                    'orientationOk': orientation_ok,
                    'degenerate': abs(source_area) < 1e-10 or abs(target_area) < 1,
                    'points': [[item['x'], item['y']] for item in (a, b, c)],
                })
    return quads, triangles


def scaled(value, low, high, extent):
    return 0 if high == low else (value - low) / (high - low) * extent


def svg_document(width, height, body, title):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}px" height="{height}px" viewBox="0 0 {width} {height}">
  <title>{title}</title>
  <rect width="100%" height="100%" fill="#07111f"/>
{body}
</svg>
'''


def source_preview(pairs, output):
    width, height, pad = 1400, 900, 45
    bbox = bounds(pairs, 'lon', 'lat')
    min_lon, min_lat, max_lon, max_lat = bbox
    parts = ['  <g id="source_mesh" fill="none" stroke="#38bdf8" stroke-width="0.7">']
    xy = {}
    for item in pairs:
        x = pad + scaled(item['lon'], min_lon, max_lon, width - 2 * pad)
        y = pad + scaled(max_lat - item['lat'], 0, max_lat - min_lat, height - 2 * pad)
        xy[item['id']] = (x, y)
    # Les indices row/col sont réutilisés dans plusieurs sous-domaines : ne
    # jamais chercher un voisin dans l'index global, sous peine de relier par
    # erreur le Pacifique à la mer des Caraïbes dans cette preview.
    for domain in DOMAIN_ORDER:
        domain_items = [item for item in pairs if domain in item['domains']]
        by_rc = {(item['row'], item['col']): item for item in domain_items
                 if item['row'] is not None and item['col'] is not None}
        for (row, col), item in by_rc.items():
            for neighbour in ((row, col + 1), (row + 1, col)):
                other = by_rc.get(neighbour)
                if other:
                    x1, y1 = xy[item['id']]
                    x2, y2 = xy[other['id']]
                    parts.append(f'    <path d="M {fmt(x1)} {fmt(y1)} L {fmt(x2)} {fmt(y2)}" data-domain="{domain}"/>')
    parts.append('  </g>')
    parts.append('  <g id="source_nodes">')
    for item in pairs:
        x, y = xy[item['id']]
        domain = item['domains'][0]
        parts.append(f'    <circle id="source_{item["id"]}" cx="{fmt(x)}" cy="{fmt(y)}" r="1.5" fill="{DOMAIN_COLORS[domain]}" data-lat="{item["lat"]}" data-lon="{item["lon"]}" data-domain="{domain}"/>')
    parts.append('  </g>')
    parts.append(f'  <text x="45" y="28" fill="#e2e8f0" font-family="sans-serif" font-size="18">Maillage source WGS84 — {len(pairs)} nœuds appariés</text>')
    output.write_text(svg_document(width, height, '\n'.join(parts), 'Warp Copernicus — source WGS84'), encoding='utf-8', newline='\n')


def target_preview(pairs, domain_pairs, triangles, output):
    parts = ['  <g id="jaillot_mesh" fill="none" stroke="#38bdf8" stroke-width="0.7" opacity="0.72">']
    for domain in DOMAIN_ORDER:
        by_rc = {(p['row'], p['col']): p for p in domain_pairs if p['domain'] == domain and p['row'] is not None and p['col'] is not None}
        for (row, col), item in by_rc.items():
            for neighbour in ((row, col + 1), (row + 1, col)):
                other = by_rc.get(neighbour)
                if other:
                    parts.append(f'    <path d="M {fmt(item["x"])} {fmt(item["y"])} L {fmt(other["x"])} {fmt(other["y"])}" data-domain="{domain}"/>')
    parts.append('  </g>')
    parts.append('  <g id="topology_anomalies" fill="#ef4444" stroke="#fecaca" stroke-width="1" opacity="0.75">')
    for triangle in triangles:
        if triangle['orientationOk'] and not triangle['degenerate']:
            continue
        points = ' '.join(f'{fmt(x)},{fmt(y)}' for x, y in triangle['points'])
        parts.append(f'    <polygon id="anomaly_{triangle["id"]}" points="{points}" data-domain="{triangle["domain"]}" data-degenerate="{str(triangle["degenerate"]).lower()}"/>')
    parts.append('  </g>')
    parts.append('  <g id="jaillot_nodes">')
    for item in pairs:
        domain = item['domains'][0]
        radius = 3.2 if item['versions'] > 1 else 1.8
        parts.append(f'    <circle id="jaillot_{item["id"]}" cx="{fmt(item["x"])}" cy="{fmt(item["y"])}" r="{radius}" fill="{DOMAIN_COLORS[domain]}" data-domain="{domain}" data-versions="{item["versions"]}" data-spread-px="{fmt(item["spreadPx"])}"/>')
    parts.append('  </g>')
    parts.append(f'  <text x="35" y="35" fill="#e2e8f0" font-family="sans-serif" font-size="22">Maillage déformé Jaillot — {len(pairs)} nœuds appariés</text>')
    output.write_text(svg_document(8500, 5320, '\n'.join(parts), 'Warp Copernicus — cible Jaillot'), encoding='utf-8', newline='\n')


def correspondence_preview(pairs, output):
    width, height, half, pad = 1800, 900, 900, 40
    geo = bounds(pairs, 'lon', 'lat')
    jai = bounds(pairs, 'x', 'y')
    parts = ['  <g id="correspondences" fill="none" stroke="#64748b" stroke-width="0.35" opacity="0.28">']
    coordinates = []
    for item in pairs:
        sx = pad + scaled(item['lon'], geo[0], geo[2], half - 2 * pad)
        sy = pad + scaled(geo[3] - item['lat'], 0, geo[3] - geo[1], height - 2 * pad)
        tx = half + pad + scaled(item['x'], jai[0], jai[2], half - 2 * pad)
        ty = pad + scaled(item['y'], jai[1], jai[3], height - 2 * pad)
        coordinates.append((item, sx, sy, tx, ty))
        parts.append(f'    <path id="link_{item["id"]}" d="M {fmt(sx)} {fmt(sy)} L {fmt(tx)} {fmt(ty)}" data-domain="{item["domains"][0]}"/>')
    parts.append('  </g>')
    parts.append('  <g id="paired_nodes">')
    for item, sx, sy, tx, ty in coordinates:
        color = DOMAIN_COLORS[item['domains'][0]]
        parts.append(f'    <circle cx="{fmt(sx)}" cy="{fmt(sy)}" r="1.4" fill="{color}"/><circle cx="{fmt(tx)}" cy="{fmt(ty)}" r="1.4" fill="{color}"/>')
    parts.append('  </g>')
    parts.append('  <path d="M 900 0 V 900" stroke="#e2e8f0" stroke-width="1" opacity="0.45"/>')
    parts.append('  <text x="40" y="28" fill="#e2e8f0" font-family="sans-serif" font-size="18">WGS84 / Copernicus source</text>')
    parts.append('  <text x="940" y="28" fill="#e2e8f0" font-family="sans-serif" font-size="18">Jaillot déformée</text>')
    output.write_text(svg_document(width, height, '\n'.join(parts), 'Warp Copernicus — correspondances'), encoding='utf-8', newline='\n')


def main():
    args = arguments()
    for path in (args.source_svg, args.target_svg):
        if not path.is_file():
            raise FileNotFoundError(path)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    source, source_duplicates = source_nodes(args.source_svg)
    target, versions, cropped = target_nodes(args.target_svg)
    common = sorted(set(source) & set(target))
    pairs = [{**source[item_id], **target[item_id]} for item_id in common]
    domain_pairs = []
    for source_id in common:
        for version in versions[source_id]:
            domain_pairs.append({**source[source_id], **version})
    quads, triangles = mesh_topology(domain_pairs)
    per_domain = Counter(domain for item in pairs for domain in item['domains'])
    stitched = [item for item in pairs if item['versions'] > 1]
    missing_source = sorted(set(target) - set(source))
    missing_target = sorted(set(source) - set(target))

    source_preview(pairs, args.output_dir / 'warp-01-source-copernicus.svg')
    target_preview(pairs, domain_pairs, triangles, args.output_dir / 'warp-02-jaillot.svg')
    correspondence_preview(pairs, args.output_dir / 'warp-03-correspondances.svg')

    report = {
        'version': 1,
        'sourceSvg': str(args.source_svg),
        'targetSvg': str(args.target_svg),
        'counts': {
            'sourceNodes': len(source), 'targetNodesStitched': len(target),
            'pairedNodes': len(common), 'sourceDuplicates': len(source_duplicates),
            'missingInSource': len(missing_source), 'missingInTarget': len(missing_target),
            'croppedSourceIds': len(cropped), 'stitchedNodes': len(stitched),
        },
        'domains': dict(sorted(per_domain.items())),
        'bounds': {
            'wgs84': {'minLon': bounds(pairs, 'lon', 'lat')[0], 'minLat': bounds(pairs, 'lon', 'lat')[1], 'maxLon': bounds(pairs, 'lon', 'lat')[2], 'maxLat': bounds(pairs, 'lon', 'lat')[3]},
            'jaillot': {'minX': bounds(pairs, 'x', 'y')[0], 'minY': bounds(pairs, 'x', 'y')[1], 'maxX': bounds(pairs, 'x', 'y')[2], 'maxY': bounds(pairs, 'x', 'y')[3]},
        },
        'stitching': {
            'maxSpreadPx': max((item['spreadPx'] for item in stitched), default=0),
            'meanSpreadPx': sum(item['spreadPx'] for item in stitched) / len(stitched) if stitched else 0,
            'over10Px': sum(item['spreadPx'] > 10 for item in stitched),
        },
        'topology': {
            'strategy': 'mailles indépendantes par sous-domaine; couture après projection',
            'completeQuads': len(quads),
            'triangles': len(triangles),
            'degenerateTriangles': sum(item['degenerate'] for item in triangles),
            'orientationMismatches': sum(not item['orientationOk'] for item in triangles),
            'anomalies': [item for item in triangles if item['degenerate'] or not item['orientationOk']],
        },
        'sourceDuplicateIds': source_duplicates,
        'missingInSource': missing_source,
        'missingInTarget': missing_target,
        'croppedSourceIds': cropped,
        'pairedNodes': pairs,
    }
    (args.output_dir / 'warp-audit.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n'
    )
    print(json.dumps({**report['counts'], **report['stitching'],
                      **{key: value for key, value in report['topology'].items() if key != 'anomalies'},
                      'output': str(args.output_dir)}, ensure_ascii=False, indent=2))
    return 0 if not missing_source else 2


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f'Erreur : {error}', file=sys.stderr)
        raise
