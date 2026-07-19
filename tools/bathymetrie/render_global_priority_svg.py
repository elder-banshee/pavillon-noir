#!/usr/bin/env python3
"""Produit la carte SVG de contraste et priorité des candidats WGS84."""

from __future__ import annotations

import argparse
import base64
import io
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image

from classify_gebco_bahamas import classes_rgb


TOOL_DIR = Path(__file__).resolve().parent
DEFAULT_CONFIG = TOOL_DIR / 'bathymetrie-globale.json'


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=DEFAULT_CONFIG)
    return parser.parse_args()


def png_uri(rgb):
    image = Image.fromarray(rgb, mode='RGB')
    buffer = io.BytesIO(); image.save(buffer, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')


def main():
    args = arguments()
    config = json.loads(args.config.read_text(encoding='utf-8'))
    acquisition = config['acquisition']
    generated = Path(config['generatedDirectory'])
    width, height = acquisition['expectedWidth'], acquisition['expectedHeight']
    classes = np.memmap(generated / 'gebco-2026-jaillot-classes.u8', dtype=np.uint8,
                        mode='r', shape=(height, width))
    preview = np.asarray(classes[5::10, 5::10])
    candidates = json.loads((generated / 'bathymetrie-04-candidats-wgs84.json').read_text(encoding='utf-8'))['candidates']
    map_x, map_y, map_w, map_h = 60, 80, 1800, 1200
    west, south = acquisition['west'], acquisition['south']
    east, north = acquisition['east'], acquisition['north']

    def position(item):
        lon, lat = item['centroid']['lon'], item['centroid']['lat']
        return (map_x + (lon - west) / (east - west) * map_w,
                map_y + (north - lat) / (north - south) * map_h)

    groups = {'high': [], 'medium': [], 'low': [], 'suspect': []}
    for item in reversed(candidates):
        confidence = item['scientificConfidenceScore']
        priority = item['documentaryPriorityScore']
        if confidence < 40:
            group, color = 'suspect', '#ef4444'
        elif priority >= 70:
            group, color = 'high', '#22c55e'
        elif priority >= 50:
            group, color = 'medium', '#facc15'
        else:
            group, color = 'low', '#94a3b8'
        x, y = position(item)
        radius = max(1.0, min(6.5, 1 + math.log10(item['areaApproxKm2'] + 1) * 1.35))
        groups[group].append(
            f'<circle id="{item["id"]}" cx="{x:.2f}" cy="{y:.2f}" r="{radius:.2f}" '
            f'fill="{color}" fill-opacity="0.68" stroke="#0f172a" stroke-width="0.45" '
            f'data-priority="{priority}" data-confidence="{confidence}" data-cells="{item["cells"]}" '
            f'data-threshold="{item["shallowestThresholdM"]}" data-classification="{item["classification"]}"/>'
        )
    labels = []
    occupied = []
    for item in candidates[:40]:
        x, y = position(item)
        if any((x - ox) ** 2 + (y - oy) ** 2 < 34 ** 2 for ox, oy in occupied):
            continue
        occupied.append((x, y))
        labels.append(f'<text x="{x + 7:.2f}" y="{y - 7:.2f}" class="id">{item["id"]}</text>')
    domain_boxes = []
    for domain, bbox in config['logicalRegions'].items():
        x1 = map_x + (bbox['west'] - west) / (east - west) * map_w
        x2 = map_x + (bbox['east'] - west) / (east - west) * map_w
        y1 = map_y + (north - bbox['north']) / (north - south) * map_h
        y2 = map_y + (north - bbox['south']) / (north - south) * map_h
        domain_boxes.append(f'<rect x="{x1:.2f}" y="{y1:.2f}" width="{x2-x1:.2f}" height="{y2-y1:.2f}"/><text x="{x1+5:.2f}" y="{y1+17:.2f}" class="domain">{domain}</text>')
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2240px" height="1360px" viewBox="0 0 2240 1360">
  <title>GEBCO 2026 — contraste et priorisation WGS84</title>
  <style>.title{{font:700 28px sans-serif;fill:#e2e8f0}}.small{{font:14px sans-serif;fill:#cbd5e1}}.id{{font:10px monospace;fill:#f8fafc;paint-order:stroke;stroke:#07111f;stroke-width:2px}}.domain{{font:13px sans-serif;fill:#67e8f9}}</style>
  <rect width="2240" height="1360" fill="#07111f"/>
  <text x="60" y="42" class="title">Contraste et priorisation — inventaire canonique WGS84</text>
  <g id="classes_reference"><image x="{map_x}" y="{map_y}" width="{map_w}" height="{map_h}" preserveAspectRatio="none" opacity="0.64" href="{png_uri(classes_rgb(preview))}"/></g>
  <g id="domaines_logiques" fill="none" stroke="#22d3ee" stroke-width="1" stroke-dasharray="8 6" opacity="0.48">{''.join(domain_boxes)}</g>
  <g id="priorite_faible">{''.join(groups['low'])}</g>
  <g id="priorite_moyenne">{''.join(groups['medium'])}</g>
  <g id="priorite_haute">{''.join(groups['high'])}</g>
  <g id="confiance_suspecte">{''.join(groups['suspect'])}</g>
  <g id="etiquettes_top">{''.join(labels)}</g>
  <g id="legende">
    <text x="1900" y="120" class="small">● vert : priorité documentaire ≥ 70</text>
    <text x="1900" y="150" class="small">● jaune : priorité 50–69,99</text>
    <text x="1900" y="180" class="small">● gris : priorité &lt; 50</text>
    <text x="1900" y="210" class="small">● rouge : confiance scientifique &lt; 40</text>
    <text x="1900" y="260" class="small">Rayon : surface logarithmique</text>
    <text x="1900" y="290" class="small">Étiquettes : premiers candidats sans chevauchement</text>
    <text x="1900" y="340" class="small">Les scores trient ; ils ne suppriment rien.</text>
  </g>
</svg>
'''
    output = generated / 'bathymetrie-04-contraste.svg'
    output.write_text(svg, encoding='utf-8', newline='\n')
    print(json.dumps({'output': str(output), 'candidates': len(candidates),
                      'high': len(groups['high']), 'medium': len(groups['medium']),
                      'low': len(groups['low']), 'suspect': len(groups['suspect'])},
                     ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
