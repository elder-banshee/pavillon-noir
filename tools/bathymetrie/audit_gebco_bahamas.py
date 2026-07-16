#!/usr/bin/env python3
"""Audite les GeoTIFF GEBCO 2026 et TID du prototype Bahamas.

Le script dépend uniquement de Pillow et NumPy. Il vérifie l'alignement des
deux rasters, conserve les codes TID bruts et produit un SVG de contrôle avec
deux aperçus raster embarqués (bathymétrie et provenance TID).
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


REPO = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE_DIR = (REPO.parent / 'Accessoires site pavillon noir' /
                      'Outils generation' / 'Bathymétrie' / 'Sources' /
                      'GEBCO_2026_Bahamas')
DEFAULT_BATHY = DEFAULT_SOURCE_DIR / 'gebco_2026_n28.0_s20.0_w-81.0_e-72.0_geotiff.tif'
DEFAULT_TID = DEFAULT_SOURCE_DIR / 'gebco_2026_tid_n28.0_s20.0_w-81.0_e-72.0_geotiff.tif'
DEFAULT_OUTPUT = Path(__file__).resolve().parent / 'output' / 'gebco-bahamas'

SAFE_THRESHOLDS = [1.8, 3.6, 6.0, 8.4, 12.0]
TID_LABELS = {
    0: 'Terre',
    10: 'Monofaisceau',
    11: 'Multifaisceau',
    12: 'Sismique',
    13: 'Sonde isolée',
    14: 'Sonde ENC',
    15: 'Lidar',
    16: 'Profondeur mesurée par capteur optique',
    17: 'Combinaison de méthodes de mesure directes',
    40: 'Prédiction guidée par gravimétrie satellitaire',
    41: 'Prédiction gravimétrique',
    42: 'Grille source inconnue',
    43: 'Grille source mesurée',
    44: 'Grille multi-sources interpolée',
    70: 'Grille pré-générée à sources mixtes',
}
TID_COLORS = {
    0: (71, 85, 105), 10: (34, 197, 94), 11: (16, 185, 129),
    12: (132, 204, 22), 13: (250, 204, 21), 14: (245, 158, 11),
    15: (6, 182, 212), 16: (14, 165, 233), 17: (59, 130, 246),
    40: (239, 68, 68), 41: (190, 24, 93), 42: (168, 85, 247),
    43: (20, 184, 166), 44: (249, 115, 22),
}


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bathymetry', type=Path, default=DEFAULT_BATHY)
    parser.add_argument('--tid', type=Path, default=DEFAULT_TID)
    parser.add_argument('--output-dir', type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def geotiff_metadata(image):
    tags = image.tag_v2
    scale = tuple(float(value) for value in tags.get(33550, ()))
    tiepoint = tuple(float(value) for value in tags.get(33922, ()))
    geo_keys = tuple(int(value) for value in tags.get(34735, ()))
    nodata_raw = tags.get(42113)
    nodata = int(nodata_raw) if nodata_raw is not None else None
    width, height = image.size
    if len(scale) < 2 or len(tiepoint) < 6:
        raise ValueError('Balises GeoTIFF ModelPixelScale/ModelTiepoint manquantes.')
    west, north = tiepoint[3], tiepoint[4]
    east, south = west + width * scale[0], north - height * scale[1]
    epsg = None
    if len(geo_keys) >= 4:
        key_count = geo_keys[3]
        for index in range(key_count):
            offset = 4 + index * 4
            key_id, location, count, value = geo_keys[offset:offset + 4]
            if key_id == 2048 and location == 0 and count == 1:
                epsg = value
    return {
        'width': width, 'height': height,
        'pixelSizeLonDeg': scale[0], 'pixelSizeLatDeg': scale[1],
        'intervalArcSeconds': scale[0] * 3600,
        'west': west, 'south': south, 'east': east, 'north': north,
        'firstPixelCenterLon': west + scale[0] / 2,
        'firstPixelCenterLat': north - scale[1] / 2,
        'epsg': epsg, 'nodata': nodata,
    }


def bathymetry_rgb(values, nodata):
    rgb = np.zeros((*values.shape, 3), dtype=np.uint8)
    valid = values != nodata
    sea = valid & (values < 0)
    land = valid & (values >= 0)
    depth = np.clip(-values.astype(np.float64), 0, 6000)
    # Échelle logarithmique : cyan sur les hauts-fonds, bleu nuit en fosse.
    t = np.log1p(depth) / math.log1p(6000)
    shallow = np.array([77, 224, 215], dtype=np.float64)
    deep = np.array([3, 19, 63], dtype=np.float64)
    rgb[sea] = (shallow[None, :] * (1 - t[sea, None]) + deep[None, :] * t[sea, None]).astype(np.uint8)
    elevation = np.clip(values.astype(np.float64), 0, 1800) / 1800
    low = np.array([185, 163, 112], dtype=np.float64)
    high = np.array([239, 230, 200], dtype=np.float64)
    rgb[land] = (low[None, :] * (1 - elevation[land, None]) + high[None, :] * elevation[land, None]).astype(np.uint8)
    rgb[~valid] = (255, 0, 255)
    return rgb


def tid_rgb(values, nodata):
    rgb = np.full((*values.shape, 3), (17, 24, 39), dtype=np.uint8)
    for code in np.unique(values):
        if int(code) == nodata:
            rgb[values == code] = (255, 0, 255)
        else:
            rgb[values == code] = TID_COLORS.get(int(code), (255, 255, 255))
    return rgb


def png_data_uri(rgb):
    image = Image.fromarray(rgb, mode='RGB')
    image.thumbnail((1080, 960), Image.Resampling.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')


def svg_control(bathy, tid, bathy_meta, tid_counts, output):
    bathy_uri = png_data_uri(bathymetry_rgb(bathy, bathy_meta['nodata']))
    tid_uri = png_data_uri(tid_rgb(tid, 127))
    legend = []
    y = 1035
    for code, count in sorted(tid_counts.items()):
        color = TID_COLORS.get(code, (255, 255, 255))
        pct = count / tid.size * 100
        label = TID_LABELS.get(code, f'Code {code}')
        legend.append(
            f'<rect x="1160" y="{y - 13}" width="18" height="18" fill="rgb{color}"/>'
            f'<text x="1188" y="{y}" class="small">{code} — {label}: {count:,} ({pct:.2f} %)</text>'
        )
        y += 25
    threshold_lines = []
    ty = 1035
    for threshold in SAFE_THRESHOLDS:
        mask = (bathy < 0) & (bathy > -threshold)
        threshold_lines.append(
            f'<text x="60" y="{ty}" class="small">0–{str(threshold).replace(".", ",")} m : {int(mask.sum()):,} cellules</text>'
        )
        ty += 25
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2240px" height="1260px" viewBox="0 0 2240 1260">
  <title>GEBCO 2026 Bahamas — contrôle source et TID</title>
  <style>.title{{font:700 28px sans-serif;fill:#e2e8f0}}.label{{font:600 18px sans-serif;fill:#e2e8f0}}.small{{font:14px sans-serif;fill:#cbd5e1}}</style>
  <rect width="2240" height="1260" fill="#07111f"/>
  <g id="bathymetrie_source">
    <text x="60" y="42" class="title">GEBCO 2026 — Bahamas — grille source</text>
    <text x="60" y="76" class="label">Bathymétrie (échelle logarithmique)</text>
    <image x="60" y="95" width="1040" height="924" preserveAspectRatio="none" href="{bathy_uri}"/>
  </g>
  <g id="tid_source">
    <text x="1160" y="76" class="label">TID — provenance des cellules</text>
    <image x="1160" y="95" width="1040" height="924" preserveAspectRatio="none" href="{tid_uri}"/>
  </g>
  <g id="seuils_navigation">{''.join(threshold_lines)}</g>
  <g id="legende_tid">{''.join(legend)}</g>
  <g id="metadonnees">
    <text x="60" y="1190" class="small">EPSG:{bathy_meta['epsg']} · 2160 × 1920 · pas {bathy_meta['intervalArcSeconds']:.0f}″ · emprise {bathy_meta['west']} / {bathy_meta['south']} / {bathy_meta['east']} / {bathy_meta['north']}</text>
    <text x="60" y="1218" class="small">Valeurs bathymétriques : {int(bathy.min())} à {int(bathy.max())} m · Pixel-centre enregistré · seuils sûrs avec marge sous quille de 20 %</text>
  </g>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')


def main():
    args = arguments()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(args.bathymetry) as bathy_image, Image.open(args.tid) as tid_image:
        bathy_meta = geotiff_metadata(bathy_image)
        tid_meta = geotiff_metadata(tid_image)
        bathy = np.asarray(bathy_image, dtype=np.int32)
        tid = np.asarray(tid_image, dtype=np.uint8)

    alignment_keys = ['width', 'height', 'pixelSizeLonDeg', 'pixelSizeLatDeg',
                      'west', 'south', 'east', 'north', 'epsg']
    mismatches = [key for key in alignment_keys if bathy_meta[key] != tid_meta[key]]
    if bathy.shape != tid.shape:
        mismatches.append('arrayShape')

    bathy_valid = bathy != bathy_meta['nodata']
    tid_valid = tid != tid_meta['nodata']
    tid_counts = Counter(int(value) for value in tid[tid_valid])
    thresholds = {}
    for threshold in SAFE_THRESHOLDS:
        mask = bathy_valid & (bathy < 0) & (bathy > -threshold)
        thresholds[str(threshold)] = {'cells': int(mask.sum()), 'percentOfRaster': float(mask.mean() * 100)}

    report = {
        'version': 1,
        'bathymetryFile': str(args.bathymetry), 'tidFile': str(args.tid),
        'bathymetry': {
            **bathy_meta, 'dtype': str(bathy.dtype), 'shape': list(bathy.shape),
            'minM': int(bathy[bathy_valid].min()), 'maxM': int(bathy[bathy_valid].max()),
            'nodataCells': int((~bathy_valid).sum()),
            'seaCells': int((bathy_valid & (bathy < 0)).sum()),
            'landCells': int((bathy_valid & (bathy >= 0)).sum()),
        },
        'tid': {
            **tid_meta, 'dtype': str(tid.dtype), 'shape': list(tid.shape),
            'nodataCells': int((~tid_valid).sum()),
            'codes': [{'code': code, 'label': TID_LABELS.get(code, 'Code non documenté'),
                       'cells': count, 'percent': count / tid.size * 100}
                      for code, count in sorted(tid_counts.items())],
        },
        'alignment': {'ok': not mismatches, 'mismatches': mismatches},
        'coastlineCrosscheck': {
            'tidLandWithNegativeBathymetry': int(((tid == 0) & (bathy < 0)).sum()),
            'tidLandWithZeroBathymetry': int(((tid == 0) & (bathy == 0)).sum()),
            'tidLandWithPositiveBathymetry': int(((tid == 0) & (bathy > 0)).sum()),
            'nonLandTidWithNonNegativeBathymetry': int(((tid != 0) & (bathy >= 0)).sum()),
            'interpretation': ('Le masque terre fonctionnel est défini par elevation >= 0. '
                               'Les cellules TID non nulles à faible altitude positive sont '
                               'conservées comme information de provenance, sans redéfinir le littoral.'),
        },
        'safeDepthThresholdsM': thresholds,
    }
    svg_control(bathy, tid, bathy_meta, tid_counts, args.output_dir / 'bathymetrie-01-source.svg')
    (args.output_dir / 'bathymetrie-01-source-audit.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n'
    )
    print(json.dumps({
        'alignment': report['alignment'], 'bathymetry': report['bathymetry'],
        'tidCodes': report['tid']['codes'], 'safeDepthThresholdsM': thresholds,
        'output': str(args.output_dir),
    }, ensure_ascii=False, indent=2))
    return 0 if not mismatches else 2


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f'Erreur : {error}', file=sys.stderr)
        raise
