#!/usr/bin/env python3
"""Produit les polygones bathymétriques lissés en WGS84 puis sur Jaillot.

Cette passe vise le besoin de gameplay : quelques enveloppes lisibles par seuil
de tirant d'eau. Elle ne dépend pas de la taxonomie expérimentale des plateaux.
Les eaux intérieures non reliées à l'océan sont exclues avant vectorisation.
"""

from __future__ import annotations

import argparse
import json
import math
import shutil
from collections import Counter
from pathlib import Path

import contourpy
import numpy as np
from PIL import Image, ImageColor, ImageDraw
from scipy import ndimage
from scipy.spatial import cKDTree
from shapely.geometry import LineString

from audit_warp_copernicus import DEFAULT_SOURCE, DEFAULT_TARGET, source_nodes, target_nodes
from warp_gebco_bahamas_to_jaillot import domain_mesh, triangle_index, barycentric


TOOL_DIR = Path(__file__).resolve().parent
REPO = TOOL_DIR.parents[1]
DEFAULT_CONFIG = TOOL_DIR / 'bathymetrie-globale.json'
DEFAULT_JAILLOT = REPO / 'medias' / 'cartes' / 'jaillot-1708.jpg'
COLORS = ['#fde047', '#fb923c', '#f87171', '#ec4899', '#a78bfa']
ATLANTIC_DOMAINS = ['bahamas', 'florida', 'atlantic', 'caribbean', 'gulf_mexico']
FAMILY_DOMAINS = {'atlantic': ATLANTIC_DOMAINS, 'pacific': ['pacific']}


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=DEFAULT_CONFIG)
    parser.add_argument('--source-svg', type=Path, default=DEFAULT_SOURCE)
    parser.add_argument('--target-svg', type=Path, default=DEFAULT_TARGET)
    parser.add_argument('--jaillot', type=Path, default=DEFAULT_JAILLOT)
    parser.add_argument('--downsample', type=int, default=2)
    parser.add_argument('--min-cells', type=int, default=3,
                        help='Surface minimale après sous-échantillonnage.')
    parser.add_argument('--smooth-iterations', type=int, default=1)
    parser.add_argument('--simplify-cells', type=float, default=0.8)
    parser.add_argument('--warp-max-segment-deg', type=float, default=0.08)
    parser.add_argument('--jaillot-simplify-px', type=float, default=1.5)
    return parser.parse_args()


def fmt(value, digits=2):
    return f'{value:.{digits}f}'.rstrip('0').rstrip('.')


def downsample_classes(classes, levels, factor, chunk_rows=128):
    height, width = classes.shape
    if height % factor or width % factor:
        raise ValueError('Les dimensions du raster doivent être divisibles par le facteur.')
    out_height, out_width = height // factor, width // factor
    sea = np.zeros((out_height, out_width), dtype=bool)
    masks = [np.zeros_like(sea) for _ in levels]
    for out_top in range(0, out_height, chunk_rows):
        out_bottom = min(out_height, out_top + chunk_rows)
        block = np.asarray(classes[out_top * factor:out_bottom * factor])
        block = block.reshape(out_bottom - out_top, factor, out_width, factor)
        sea[out_top:out_bottom] = np.any(block != 0, axis=(1, 3))
        for index, level in enumerate(levels, start=1):
            shallow = (block >= 1) & (block <= index)
            masks[index - 1][out_top:out_bottom] = np.any(shallow, axis=(1, 3))
    return sea, masks


def ocean_connected_mask(sea):
    labels, component_count = ndimage.label(
        sea, structure=ndimage.generate_binary_structure(2, 1),
    )
    border = np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1]))
    ocean_ids = np.unique(border[border > 0])
    ocean = np.isin(labels, ocean_ids)
    return ocean, {
        'waterComponents': int(component_count),
        'oceanComponents': int(len(ocean_ids)),
        'interiorWaterCellsExcluded': int((sea & ~ocean).sum()),
    }


def vectorize_mask(mask, min_cells, smooth_iterations, simplify_cells):
    structure = ndimage.generate_binary_structure(2, 1)
    if smooth_iterations:
        mask = ndimage.binary_closing(mask, structure=structure,
                                      iterations=smooth_iterations)
    labels, component_count = ndimage.label(mask, structure=structure)
    sizes = np.bincount(labels.ravel())
    keep = sizes >= min_cells
    keep[0] = False
    filtered = keep[labels]
    kept_components = int(keep.sum())
    padded = np.pad(filtered.astype(np.uint8), 1)
    contours = contourpy.contour_generator(
        z=padded, name='serial', corner_mask=False,
    ).lines(0.5)
    paths = []
    for contour in contours:
        # contourpy travaille sur les centres de cellules du tableau rembourré.
        points = [(float(x - 0.5), float(y - 0.5)) for x, y in contour]
        if points[0] != points[-1]:
            points.append(points[0])
        simplified = LineString(points).simplify(simplify_cells, preserve_topology=False)
        result = [(float(x), float(y)) for x, y in simplified.coords]
        if len(result) >= 4:
            if result[0] != result[-1]:
                result.append(result[0])
            paths.append(result)
    return paths, {
        'componentsBeforeMinimum': int(component_count),
        'componentsExported': kept_components,
        'componentsDiscarded': int(component_count - kept_components),
        'ringsExported': len(paths),
        'cellsExported': int(filtered.sum()),
    }


def grid_to_wgs84(path, acquisition, factor):
    pixel_lon = (acquisition['east'] - acquisition['west']) / acquisition['expectedWidth']
    pixel_lat = (acquisition['north'] - acquisition['south']) / acquisition['expectedHeight']
    return [
        (acquisition['west'] + x * factor * pixel_lon,
         acquisition['north'] - y * factor * pixel_lat)
        for x, y in path
    ]


def build_warp(args):
    source, _ = source_nodes(args.source_svg)
    _, versions, _ = target_nodes(args.target_svg)
    indexes = {}
    mesh_report = {}
    for family, domains in FAMILY_DOMAINS.items():
        indexes[family] = {}
        for domain in domains:
            nodes, triangles, rejected = domain_mesh(source, versions, domain)
            indexes[family][domain] = triangle_index(triangles)
            mesh_report[domain] = {
                'nodes': len(nodes), 'triangles': len(triangles), 'rejected': rejected,
            }
    family_controls = {'atlantic': {}, 'pacific': {}}
    for source_id, items in versions.items():
        if source_id not in source:
            continue
        for family, domains in FAMILY_DOMAINS.items():
            targets = [item for item in items if item['domain'] in domains]
            if not targets:
                continue
            family_controls[family][source_id] = {
                'lon': source[source_id]['lon'], 'lat': source[source_id]['lat'],
                'x': sum(item['x'] for item in targets) / len(targets),
                'y': sum(item['y'] for item in targets) / len(targets),
            }
    fallbacks = {}
    for family, controls_by_id in family_controls.items():
        controls = list(controls_by_id.values())
        coordinates = np.asarray([(item['lon'], item['lat']) for item in controls])
        fallbacks[family] = {
            'tree': cKDTree(coordinates), 'controls': controls,
        }
    return indexes, fallbacks, mesh_report


def path_family(path, fallbacks):
    sample = np.asarray(path[::max(1, len(path) // 32)])
    lon, lat = float(sample[:, 0].mean()), float(sample[:, 1].mean())
    distances = {family: float(data['tree'].query((lon, lat), k=1)[0])
                 for family, data in fallbacks.items()}
    return min(distances, key=distances.get)


def warp_point(lon, lat, family, indexes, fallbacks, fallback_max_deg=1.25):
    for domain in FAMILY_DOMAINS[family]:
        index, cell_deg = indexes[family][domain]
        candidates = index.get((math.floor(lon / cell_deg), math.floor(lat / cell_deg)), [])
        matches = []
        for triangle in candidates:
            west, south, east, north = triangle['bbox']
            if not (west - 1e-9 <= lon <= east + 1e-9
                    and south - 1e-9 <= lat <= north + 1e-9):
                continue
            weights = barycentric(lon, lat, triangle)
            if weights is None:
                continue
            a, b, c = triangle['points']; wa, wb, wc = weights
            matches.append((wa * a['x'] + wb * b['x'] + wc * c['x'],
                            wa * a['y'] + wb * b['y'] + wc * c['y']))
        if matches:
            return ((sum(item[0] for item in matches) / len(matches),
                     sum(item[1] for item in matches) / len(matches)), 'triangle')
    # Les mailles Copernicus sont volontairement trouées près des terres. Pour
    # les contours bathymétriques côtiers, une interpolation IDW locale recopie
    # la déformation des contrôles voisins sans relier Atlantique et Pacifique.
    data = fallbacks[family]
    count = min(8, len(data['controls']))
    distances, indices = data['tree'].query((lon, lat), k=count)
    distances = np.atleast_1d(distances); indices = np.atleast_1d(indices)
    if float(distances[0]) > fallback_max_deg:
        return None, 'missing'
    if distances[0] < 1e-12:
        item = data['controls'][int(indices[0])]
        return (item['x'], item['y']), 'control'
    weights = 1 / np.maximum(distances, 1e-6) ** 2
    controls = [data['controls'][int(index)] for index in indices]
    total = float(weights.sum())
    return ((sum(float(weight) * item['x'] for weight, item in zip(weights, controls)) / total,
             sum(float(weight) * item['y'] for weight, item in zip(weights, controls)) / total),
            'fallback')


def densify(path, max_segment_deg):
    output = []
    for start, end in zip(path, path[1:]):
        if not output:
            output.append(start)
        distance = math.hypot(end[0] - start[0], end[1] - start[1])
        steps = max(1, math.ceil(distance / max_segment_deg))
        for step in range(1, steps + 1):
            ratio = step / steps
            output.append((start[0] + (end[0] - start[0]) * ratio,
                           start[1] + (end[1] - start[1]) * ratio))
    return output


def warp_paths(paths, indexes, fallbacks, max_segment_deg, simplify_px):
    output = {'atlantic': [], 'pacific': []}
    audit = Counter()
    for path in paths:
        family = path_family(path, fallbacks)
        dense = densify(path, max_segment_deg)
        warped = []
        for lon, lat in dense:
            point, mode = warp_point(lon, lat, family, indexes, fallbacks)
            if point is None:
                audit[f'{family}MissingVertices'] += 1
            else:
                warped.append(point)
                audit[f'{family}{mode.capitalize()}Vertices'] += 1
        if len(warped) != len(dense):
            audit[f'{family}DiscardedRings'] += 1
            continue
        simplified = LineString(warped).simplify(simplify_px, preserve_topology=False)
        result = [(float(x), float(y)) for x, y in simplified.coords]
        if len(result) >= 4:
            if result[0] != result[-1]:
                result.append(result[0])
            output[family].append(result)
            audit[f'{family}ExportedRings'] += 1
            audit[f'{family}ExportedVertices'] += len(result)
        else:
            audit[f'{family}CollapsedRings'] += 1
    return output, dict(audit)


def path_data(paths, transform=lambda point: point, digits=2):
    chunks = []
    for path in paths:
        points = [transform(point) for point in path]
        if len(points) < 4:
            continue
        chunks.append('M ' + ' L '.join(f'{fmt(x, digits)} {fmt(y, digits)}'
                                        for x, y in points) + ' Z')
    return ' '.join(chunks)


def layer_svg(levels, transform, digits, stroke_width, path_source):
    parts = []
    for level in reversed(levels):
        color = level['color']; threshold = level['thresholdM']
        family_paths = []
        paths_by_family = (level['warped'] if path_source == 'warped'
                           else {'all': level['wgs84Paths']})
        for family, paths in paths_by_family.items():
            data = path_data(paths, transform=transform, digits=digits)
            family_paths.append(
                f'<path id="seuil_{str(threshold).replace(".", "_")}_{family}" '
                f'd="{data}" fill="{color}" fill-opacity="0.48" stroke="{color}" '
                f'stroke-width="{stroke_width}" stroke-linejoin="round" '
                f'fill-rule="evenodd" data-family="{family}"/>'
            )
        parts.append(
            f'<g id="seuil_{str(threshold).replace(".", "_")}" '
            f'inkscape:groupmode="layer" inkscape:label="Profondeur sûre insuffisante — {threshold} m">'
            + ''.join(family_paths) + '</g>'
        )
    return '\n'.join(parts)


def legend(x, y, thresholds):
    lines = [
        f'<rect x="{x}" y="{y}" width="430" height="230" rx="8" fill="#07111f" fill-opacity="0.86"/>',
        f'<text x="{x + 24}" y="{y + 34}" font-family="Arial" font-size="20" font-weight="bold" fill="#f8fafc">Seuils bathymétriques lissés</text>',
    ]
    for index, (threshold, color) in enumerate(zip(thresholds, COLORS)):
        yy = y + 68 + index * 28
        lines.append(f'<rect x="{x + 24}" y="{yy - 15}" width="22" height="16" fill="{color}"/>')
        lines.append(f'<text x="{x + 58}" y="{yy}" font-family="Arial" font-size="16" fill="#e2e8f0">fonds insuffisants pour {threshold} m</text>')
    lines.append(f'<text x="{x + 24}" y="{y + 216}" font-family="Arial" font-size="13" fill="#cbd5e1">Eaux intérieures exclues · contours simplifiés</text>')
    return ''.join(lines)


def write_wgs84_svg(levels, acquisition, output):
    width, height = 1800, 1200
    def transform(point):
        lon, lat = point
        return ((lon - acquisition['west']) / (acquisition['east'] - acquisition['west']) * width,
                (acquisition['north'] - lat) / (acquisition['north'] - acquisition['south']) * height)
    layers = layer_svg(levels, transform, 2, 0.8, 'wgs84')
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" width="{width}px" height="{height}px" viewBox="0 0 {width} {height}">
  <title>GEBCO 2026 — seuils bathymétriques lissés — WGS84</title>
  <g id="reference_wgs84" inkscape:groupmode="layer" inkscape:label="Référence WGS84"><image x="0" y="0" width="{width}" height="{height}" xlink:href="bathymetrie-07-wgs84-reference.png"/></g>
  {layers}
  <g id="legende" inkscape:groupmode="layer" inkscape:label="Légende">{legend(1340, 30, [item['thresholdM'] for item in levels])}</g>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def write_jaillot_svg(levels, output):
    layers = layer_svg(levels, lambda point: point, 1, 2.0, 'warped')
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" width="8500px" height="5320px" viewBox="0 0 8500 5320">
  <title>GEBCO 2026 — seuils bathymétriques lissés — Jaillot</title>
  <g id="jaillot_reference" inkscape:groupmode="layer" inkscape:label="Carte Jaillot 1708"><image x="0" y="0" width="8500" height="5320" xlink:href="bathymetrie-08-jaillot-reference.jpg"/></g>
  {layers}
  <g id="legende" inkscape:groupmode="layer" inkscape:label="Légende">{legend(7920, 120, [item['thresholdM'] for item in levels])}</g>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def write_wgs84_reference(sea, ocean, output):
    rgb = np.empty((*sea.shape, 3), dtype=np.uint8)
    rgb[:] = (139, 128, 102)
    rgb[ocean] = (11, 35, 64)
    rgb[sea & ~ocean] = (91, 75, 99)
    image = Image.fromarray(rgb, mode='RGB').resize((1800, 1200), Image.Resampling.NEAREST)
    image.save(output, format='PNG', optimize=True, dpi=(96, 96))


def write_preview(levels, base_path, output, transform, size, path_source):
    base = Image.open(base_path).convert('RGBA').resize(size, Image.Resampling.LANCZOS)
    overlay = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, mode='RGBA')
    for level in reversed(levels):
        color = ImageColor.getrgb(level['color'])
        paths_by_family = (level['warped'] if path_source == 'warped'
                           else {'all': level['wgs84Paths']})
        for paths in paths_by_family.values():
            for path in paths:
                points = [transform(point) for point in path]
                if len(points) >= 4:
                    draw.polygon(points, fill=(*color, 105), outline=(*color, 230), width=1)
    Image.alpha_composite(base, overlay).convert('RGB').save(
        output, format='PNG', optimize=True, dpi=(96, 96),
    )


def main():
    args = arguments()
    config = json.loads(args.config.read_text(encoding='utf-8'))
    acquisition = config['acquisition']
    generated = Path(config['generatedDirectory'])
    output_dir = generated / 'bathymetrie-07-seuils-lisses'
    output_dir.mkdir(parents=True, exist_ok=True)
    height, width = acquisition['expectedHeight'], acquisition['expectedWidth']
    classes = np.memmap(generated / 'gebco-2026-jaillot-classes.u8', dtype=np.uint8,
                        mode='r', shape=(height, width))
    thresholds = config['safeDepthThresholdsM']
    sea, raw_masks = downsample_classes(classes, thresholds, args.downsample)
    ocean, ocean_report = ocean_connected_mask(sea)
    write_wgs84_reference(sea, ocean, output_dir / 'bathymetrie-07-wgs84-reference.png')
    indexes, fallbacks, mesh_report = build_warp(args)

    levels = []
    for index, (threshold, raw_mask) in enumerate(zip(thresholds, raw_masks)):
        paths_grid, vector_report = vectorize_mask(
            raw_mask & ocean, args.min_cells, args.smooth_iterations,
            args.simplify_cells,
        )
        paths_wgs84 = [grid_to_wgs84(path, acquisition, args.downsample)
                       for path in paths_grid]
        warped, warp_report = warp_paths(
            paths_wgs84, indexes, fallbacks, args.warp_max_segment_deg,
            args.jaillot_simplify_px,
        )
        levels.append({
            'thresholdM': threshold, 'color': COLORS[index],
            'wgs84Paths': paths_wgs84, 'warped': warped,
            'vectorAudit': vector_report, 'warpAudit': warp_report,
        })
        print(f'{threshold} m : {vector_report["ringsExported"]} anneaux WGS84, '
              f'{sum(len(items) for items in warped.values())} anneaux Jaillot', flush=True)

    wgs_reference = output_dir / 'bathymetrie-07-wgs84-reference.png'
    write_wgs84_svg(levels, acquisition, output_dir / 'bathymetrie-07-seuils-lisses-wgs84.svg')
    write_preview(
        levels, wgs_reference, output_dir / 'bathymetrie-07-apercu-wgs84.png',
        lambda point: (
            (point[0] - acquisition['west']) / (acquisition['east'] - acquisition['west']) * 1800,
            (acquisition['north'] - point[1]) / (acquisition['north'] - acquisition['south']) * 1200,
        ),
        (1800, 1200), 'wgs84',
    )
    shutil.copyfile(args.jaillot, output_dir / 'bathymetrie-08-jaillot-reference.jpg')
    write_jaillot_svg(levels, output_dir / 'bathymetrie-08-seuils-lisses-jaillot.svg')
    write_preview(
        levels, args.jaillot, output_dir / 'bathymetrie-08-apercu-jaillot.png',
        lambda point: (point[0] * 0.2, point[1] * 0.2),
        (1700, 1064), 'warped',
    )
    report = {
        'version': 1,
        'purpose': "Enveloppes générales de restriction par seuil de tirant d'eau",
        'source': str(generated / 'gebco-2026-jaillot-classes.u8'),
        'outputDirectory': str(output_dir),
        'parameters': {
            'downsample': args.downsample, 'minCells': args.min_cells,
            'smoothIterations': args.smooth_iterations,
            'simplifyCells': args.simplify_cells,
            'warpMaxSegmentDeg': args.warp_max_segment_deg,
            'jaillotSimplifyPx': args.jaillot_simplify_px,
        },
        'oceanConnectivity': ocean_report,
        'mesh': mesh_report,
        'levels': [
            {key: value for key, value in level.items()
             if key not in {'wgs84Paths', 'warped'}}
            for level in levels
        ],
        'exceptionRule': ('Les plateaux 0–50 m ne servent pas à la règle générale. '
                          'Ils pourront fournir quelques enveloppes historiques exceptionnelles.'),
    }
    (output_dir / 'bathymetrie-07-08-rapport.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8', newline='\n',
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
