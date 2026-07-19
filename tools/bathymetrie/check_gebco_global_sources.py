#!/usr/bin/env python3
"""Vérifie la présence et les métadonnées du sous-ensemble GEBCO global."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image

from audit_gebco_bahamas import geotiff_metadata


DEFAULT_CONFIG = Path(__file__).resolve().parent / 'bathymetrie-globale.json'


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=DEFAULT_CONFIG)
    parser.add_argument('--allow-missing', action='store_true')
    return parser.parse_args()


def main():
    args = arguments()
    config = json.loads(args.config.read_text(encoding='utf-8'))
    acquisition = config['acquisition']
    source_dir = Path(acquisition['sourceDirectory'])
    bathy = source_dir / acquisition['bathymetryFilename']
    tid = source_dir / acquisition['tidFilename']
    missing = [str(path) for path in (bathy, tid) if not path.is_file()]
    if missing:
        report = {
            'ready': False,
            'sourceDirectory': str(source_dir),
            'missing': missing,
            'nextAction': 'Télécharger et extraire les deux GeoTIFF décrits dans ACQUISITION_GLOBALE.md.',
        }
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 0 if args.allow_missing else 2

    with Image.open(bathy) as bathy_image, Image.open(tid) as tid_image:
        bathy_meta = geotiff_metadata(bathy_image)
        tid_meta = geotiff_metadata(tid_image)
        bathy_mode, tid_mode = bathy_image.mode, tid_image.mode

    expected = {
        'width': acquisition['expectedWidth'], 'height': acquisition['expectedHeight'],
        'west': acquisition['west'], 'south': acquisition['south'],
        'east': acquisition['east'], 'north': acquisition['north'],
        'epsg': 4326,
    }
    bathy_mismatches = {key: {'expected': value, 'actual': bathy_meta[key]}
                        for key, value in expected.items() if abs(bathy_meta[key] - value) > 1e-9}
    alignment_mismatches = {key: {'bathymetry': bathy_meta[key], 'tid': tid_meta[key]}
                            for key in expected if abs(bathy_meta[key] - tid_meta[key]) > 1e-9}
    ready = not bathy_mismatches and not alignment_mismatches
    print(json.dumps({
        'ready': ready, 'bathymetry': str(bathy), 'tid': str(tid),
        'bathymetryMode': bathy_mode, 'tidMode': tid_mode,
        'metadata': bathy_meta,
        'expectedMismatches': bathy_mismatches,
        'alignmentMismatches': alignment_mismatches,
    }, ensure_ascii=False, indent=2))
    return 0 if ready else 2


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f'Erreur : {error}', file=sys.stderr)
        raise
