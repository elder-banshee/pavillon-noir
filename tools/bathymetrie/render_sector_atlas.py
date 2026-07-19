#!/usr/bin/env python3
"""Génère l'atlas sectoriel WGS84 et la table de décision des structures."""

from __future__ import annotations

import argparse
import csv
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.spatial import cKDTree

from audit_warp_copernicus import DEFAULT_SOURCE, DEFAULT_TARGET, source_nodes, target_nodes
from classify_gebco_bahamas import CLASS_DEFINITIONS


TOOL_DIR = Path(__file__).resolve().parent
DEFAULT_CONFIG = TOOL_DIR / 'bathymetrie-globale.json'

SECTORS = [
    {
        'id': '01-golfe-floride-atlantique', 'label': 'Golfe du Mexique, Floride et façade atlantique',
        'bbox': [-100, 23, -55, 35],
        'toponyms': [
            ('Nouvelle-Orléans', -90.07, 29.95), ('Tampa', -82.46, 27.95),
            ('Floride', -81.7, 27.3), ('Florida Keys', -81.1, 24.7),
            ('Cap Hatteras', -75.5, 35.0), ('Bermudes', -64.75, 32.3),
        ],
    },
    {
        'id': '02-yucatan-campeche', 'label': 'Yucatán et banc de Campeche',
        'bbox': [-100, 17, -84, 24],
        'toponyms': [
            ('Campeche', -90.53, 19.85), ('Mérida', -89.62, 20.97),
            ('Arrecife Alacranes', -89.7, 22.45), ('Cayos Arcas', -91.95, 20.2),
            ('Canal du Yucatán', -85.8, 21.5), ('Cozumel', -86.92, 20.43),
        ],
    },
    {
        'id': '03-honduras-nicaragua', 'label': 'Belize, Honduras, Mosquitia et Nicaragua Rise',
        'bbox': [-90, 10, -78, 19],
        'toponyms': [
            ('Belize', -88.2, 17.5), ('Turneffe', -87.85, 17.3),
            ('Lighthouse Reef', -87.5, 17.2), ("Glover's Reef", -87.8, 16.75),
            ('Mosquitia', -83.0, 15.0), ('Quita Sueño', -81.1, 14.4),
            ('Roncador', -80.07, 13.57), ('Serrana', -80.35, 14.3),
            ('Serranilla', -79.84, 15.8),
        ],
    },
    {
        'id': '04-bahamas', 'label': 'Bahamas, Cay Sal et Turks-et-Caicos',
        'bbox': [-82, 20, -70, 30],
        'toponyms': [
            ('Grand Bahama', -78.5, 26.65), ('Abacos', -77.2, 26.3),
            ('Nassau', -77.35, 25.05), ('Andros', -77.9, 24.5),
            ('Exumas', -76.2, 24.0), ('Cay Sal', -80.0, 23.75),
            ('Turks-et-Caicos', -71.8, 21.75), ('Canal Providence', -78.7, 25.3),
        ],
    },
    {
        'id': '05-cuba-jamaique-caimans', 'label': 'Cuba, Jamaïque, Caïmans et Pedro Bank',
        'bbox': [-86, 15, -73, 24],
        'toponyms': [
            ('La Havane', -82.37, 23.13), ('Cuba', -79.5, 21.8),
            ('Isle of Youth', -82.85, 21.65), ('Jamaïque', -77.3, 18.1),
            ('Pedro Bank', -77.8, 17.0), ('Morant Cays', -75.98, 17.4),
            ('Grand Cayman', -81.25, 19.32), ('Misteriosa', -83.5, 18.3),
        ],
    },
    {
        'id': '06-porto-rico-vierges', 'label': 'Hispaniola, Porto Rico et Îles Vierges',
        'bbox': [-75, 16, -55, 23],
        'toponyms': [
            ('Hispaniola', -70.7, 19.0), ('Passage de la Mona', -68.0, 18.3),
            ('Porto Rico', -66.5, 18.2), ('Saint-Thomas', -64.93, 18.34),
            ('Îles Vierges', -64.6, 18.25), ('Anegada', -64.37, 18.73),
            ('Sainte-Croix', -64.75, 17.75),
        ],
    },
    {
        'id': '07-petites-antilles-grenadines', 'label': 'Petites Antilles et Grenadines',
        'bbox': [-64.5, 10, -55, 19],
        'toponyms': [
            ('Guadeloupe', -61.55, 16.25), ('Martinique', -61.0, 14.65),
            ('Sainte-Lucie', -60.98, 13.9), ('Saint-Vincent', -61.2, 13.25),
            ('Grenadines', -61.25, 12.6), ('Grenade', -61.68, 12.12),
            ('Barbade', -59.55, 13.18), ('Trinité', -61.25, 10.5),
        ],
    },
    {
        'id': '08-caraibes-sud', 'label': 'Caraïbes méridionales et côte de Tierra Firme',
        'bbox': [-83, 5, -55, 14.5],
        'toponyms': [
            ('Cartagène', -75.48, 10.4), ('Santa Marta', -74.2, 11.25),
            ('Golfe de Darién', -77.0, 9.0), ('Curaçao', -68.95, 12.17),
            ('Aruba', -70.03, 12.52), ('Margarita', -63.9, 10.98),
            ('Orénoque', -61.0, 9.0), ('Trinité', -61.25, 10.5),
        ],
    },
    {
        'id': '09-pacifique', 'label': 'Façade pacifique de la carte Jaillot',
        'bbox': [-100, 5, -77, 17],
        'toponyms': [
            ('Acapulco', -99.9, 16.85), ('Tehuantepec', -95.0, 15.5),
            ('Guatemala', -91.0, 14.0), ('Salvador', -89.2, 13.5),
            ('Nicaragua', -86.2, 12.0), ('Costa Rica', -84.0, 9.5),
            ('Panama', -79.5, 8.8), ('Golfe de Panama', -79.0, 7.8),
        ],
    },
]

SIGNATURE_COLORS = {
    'plateau_structurant': '#22c55e', 'bord_de_plateau': '#06b6d4',
    'atoll_ou_banc_detache': '#facc15', 'pinnacle_isole': '#f97316',
    'indetermine': '#ef4444',
}


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=DEFAULT_CONFIG)
    return parser.parse_args()


def crop_indices(bbox, acquisition, shape):
    west, south, east, north = bbox
    rows, cols = shape
    col0 = max(0, math.floor((west - acquisition['west']) / (acquisition['east'] - acquisition['west']) * cols))
    col1 = min(cols, math.ceil((east - acquisition['west']) / (acquisition['east'] - acquisition['west']) * cols))
    row0 = max(0, math.floor((acquisition['north'] - north) / (acquisition['north'] - acquisition['south']) * rows))
    row1 = min(rows, math.ceil((acquisition['north'] - south) / (acquisition['north'] - acquisition['south']) * rows))
    return row0, row1, col0, col1


def build_family_trees():
    source, _ = source_nodes(DEFAULT_SOURCE)
    _, versions, _ = target_nodes(DEFAULT_TARGET)
    points = {'atlantic': [], 'pacific': []}
    for source_id, items in versions.items():
        if source_id not in source:
            continue
        families = {'pacific' if item['domain'] == 'pacific' else 'atlantic' for item in items}
        for family in families:
            points[family].append((source[source_id]['lon'], source[source_id]['lat']))
    return {family: cKDTree(np.asarray(coords)) for family, coords in points.items()}


def warp_family(plateau, trees):
    point = [plateau['centroid']['lon'], plateau['centroid']['lat']]
    distances = {family: float(tree.query(point, k=1)[0]) for family, tree in trees.items()}
    return min(distances, key=distances.get)


def sector_for_plateau(plateau, trees):
    lon, lat = plateau['centroid']['lon'], plateau['centroid']['lat']
    if warp_family(plateau, trees) == 'pacific':
        west, south, east, north = next(item['bbox'] for item in SECTORS if item['id'] == '09-pacifique')
        if west <= lon <= east and south <= lat <= north:
            return '09-pacifique'
    matches = []
    for sector in SECTORS:
        if sector['id'] == '09-pacifique':
            continue
        west, south, east, north = sector['bbox']
        if west <= lon <= east and south <= lat <= north:
            area = (east - west) * (north - south)
            matches.append((area, sector['id']))
    return min(matches)[1] if matches else 'hors-atlas'


def make_background(class_crop, context_crop):
    colors = {item['id']: np.array(item['color'], dtype=np.float64) for item in CLASS_DEFINITIONS}
    rgb = np.zeros((*class_crop.shape, 3), dtype=np.uint8)
    for class_id, color in colors.items():
        rgb[class_crop == class_id] = color.astype(np.uint8)
    # Le parent morphologique 0–50 m apparaît turquoise translucide ; les
    # cœurs de 0–12 m gardent leurs couleurs par classe au-dessus.
    # Les classes 1 à 5 (<12 m) doivent garder leur couleur propre. Le
    # turquoise complète seulement le contexte structurel entre 12 et 50 m,
    # inclus dans la classe 6 « 12 m et plus ».
    moderate = (context_crop == 1) & (class_crop == 6)
    turquoise = np.array([20, 184, 166], dtype=np.float64)
    blend = rgb[moderate].astype(np.float64) * 0.35 + turquoise * 0.65
    rgb[moderate] = blend.astype(np.uint8)
    return rgb


def render_sector(sector, acquisition, class_preview, context, candidates, plateaus, output):
    bbox = sector['bbox']; west, south, east, north = bbox
    class_indices = crop_indices(bbox, acquisition, class_preview.shape)
    context_indices = crop_indices(bbox, acquisition, context.shape)
    class_crop = np.asarray(class_preview[class_indices[0]:class_indices[1], class_indices[2]:class_indices[3]])
    context_crop = np.asarray(context[context_indices[0]:context_indices[1], context_indices[2]:context_indices[3]])
    if context_crop.shape != class_crop.shape:
        context_crop = np.asarray(Image.fromarray(context_crop).resize((class_crop.shape[1], class_crop.shape[0]), Image.Resampling.NEAREST))
    canvas_w, canvas_h = 1900, 1200
    map_x, map_y, map_w, map_h = 55, 80, 1450, 1060
    background = make_background(class_crop, context_crop)
    background_name = f'{output.stem}-fond.png'
    # Profil Illustrator : l'image liée occupe le canevas entier et commence à
    # l'origine. La carte est déjà placée dans le PNG à ses coordonnées finales,
    # ce qui ne laisse à l'importeur aucun transform ni décalage à interpréter.
    map_image = Image.fromarray(background, mode='RGB').resize(
        (map_w, map_h), Image.Resampling.NEAREST,
    )
    background_image = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    background_image.paste(map_image, (map_x, map_y))
    background_image.save(
        output.parent / background_name, format='PNG', optimize=True, dpi=(96, 96),
    )

    def xy(lon, lat):
        return (map_x + (lon - west) / (east - west) * map_w,
                map_y + (north - lat) / (north - south) * map_h)

    in_candidates = [item for item in candidates if west <= item['centroid']['lon'] <= east and south <= item['centroid']['lat'] <= north]
    in_plateaus = [item for item in plateaus if west <= item['centroid']['lon'] <= east and south <= item['centroid']['lat'] <= north]
    candidate_groups = {key: [] for key in SIGNATURE_COLORS}
    for item in reversed(in_candidates):
        x, y = xy(item['centroid']['lon'], item['centroid']['lat'])
        radius = max(1.2, min(6.0, 1 + math.log10(item['cells'] + 1) * 1.4))
        signature = item['structuralSignature']
        candidate_groups[signature].append(
            f'<circle id="{item["id"]}" cx="{x:.2f}" cy="{y:.2f}" r="{radius:.2f}" '
            f'fill="{SIGNATURE_COLORS[signature]}" fill-opacity="0.72" stroke="#07111f" stroke-width="0.5" '
            f'data-plateau="{item["plateau50Id"]}" data-threshold="{item["shallowestThresholdM"]}" '
            f'data-confidence="{item["scientificConfidenceScore"]}"/>'
        )

    plateau_shapes, plateau_labels = [], []
    label_candidates = sorted(in_plateaus,
                              key=lambda item: (-(item['areaApproxKm2'] * math.log2(item['candidateCount'] + 1)), item['id']))
    occupied = []
    for item in label_candidates[:100]:
        bx1, by1 = xy(item['bbox']['west'], item['bbox']['north'])
        bx2, by2 = xy(item['bbox']['east'], item['bbox']['south'])
        plateau_shapes.append(
            f'<rect id="bbox_{item["id"]}" x="{bx1:.2f}" y="{by1:.2f}" width="{max(1,bx2-bx1):.2f}" '
            f'height="{max(1,by2-by1):.2f}" data-area-km2="{item["areaApproxKm2"]:.2f}" '
            f'data-candidates="{item["candidateCount"]}"/>'
        )
        x, y = xy(item['centroid']['lon'], item['centroid']['lat'])
        if len(plateau_labels) >= 32 or any((x - ox) ** 2 + (y - oy) ** 2 < 48 ** 2 for ox, oy in occupied):
            continue
        occupied.append((x, y))
        label = (f'{item["id"]} '
                 f'({item["areaApproxKm2"]:.0f} km² · {item["candidateCount"]} cœurs)')
        plateau_labels.append(
            f'<text x="{x + 6:.2f}" y="{y - 7:.2f}" font-family="Courier New" font-size="9" '
            f'fill="none" stroke="#07111f" stroke-width="2.4">{label}</text>'
            f'<text x="{x + 6:.2f}" y="{y - 7:.2f}" font-family="Courier New" font-size="9" '
            f'fill="#f8fafc" stroke="none">{label}</text>'
        )

    toponyms = []
    for label, lon, lat in sector['toponyms']:
        if not (west <= lon <= east and south <= lat <= north):
            continue
        x, y = xy(lon, lat)
        toponyms.append(
            f'<circle cx="{x:.2f}" cy="{y:.2f}" r="3" fill="#fef3c7" stroke="#07111f" stroke-width="1"/>'
            f'<text x="{x+7:.2f}" y="{y+4:.2f}" font-family="Arial" font-size="12" '
            f'fill="none" stroke="#07111f" stroke-width="2.8">{label}</text>'
            f'<text x="{x+7:.2f}" y="{y+4:.2f}" font-family="Arial" font-size="12" '
            f'fill="#fef3c7" stroke="none">{label}</text>'
        )
    layer_labels = {
        'plateau_structurant': 'Cœurs — plateau structurant',
        'bord_de_plateau': 'Cœurs — bord de plateau',
        'atoll_ou_banc_detache': 'Cœurs — atoll ou banc détaché',
        'pinnacle_isole': 'Cœurs — pinnacle isolé',
        'indetermine': 'Cœurs — indéterminé',
    }
    layers = ''.join(
        f'<g id="{key}" inkscape:groupmode="layer" inkscape:label="{layer_labels[key]}">{"".join(values)}</g>'
        for key, values in candidate_groups.items()
    )
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" width="{canvas_w}px" height="{canvas_h}px" viewBox="0 0 {canvas_w} {canvas_h}">
  <title>{sector['label']} — atlas bathymétrique</title>
  <g id="fond_interface" inkscape:groupmode="layer" inkscape:label="Fond de planche"><rect width="100%" height="100%" fill="#07111f"/></g>
  <g id="titre" inkscape:groupmode="layer" inkscape:label="Titre"><text x="55" y="42" font-family="Arial" font-size="27" font-weight="bold" fill="#e2e8f0" stroke="none">{sector['label']}</text></g>
  <g id="bathymetrie" inkscape:groupmode="layer" inkscape:label="Bathymétrie 0–50 m (PNG lié)"><image x="0" y="0" width="{canvas_w}" height="{canvas_h}" preserveAspectRatio="xMinYMin meet" xlink:href="{background_name}"/></g>
  <g id="emprises_plateaux" inkscape:groupmode="layer" inkscape:label="Emprises des plateaux" fill="none" stroke="#e2e8f0" stroke-width="0.7" stroke-dasharray="5 4" opacity="0.45">{''.join(plateau_shapes)}</g>
  {layers}
  <g id="etiquettes_plateaux" inkscape:groupmode="layer" inkscape:label="Étiquettes des plateaux">{''.join(plateau_labels)}</g>
  <g id="toponymes" inkscape:groupmode="layer" inkscape:label="Toponymes">{''.join(toponyms)}</g>
  <g id="legende" inkscape:groupmode="layer" inkscape:label="Légende et statistiques" font-family="Arial" font-size="13" fill="#cbd5e1" stroke="none">
    <text x="1535" y="105" font-family="Arial" font-size="13" fill="#cbd5e1">Fond turquoise : mer 0–50 m</text>
    <text x="1535" y="135" font-family="Arial" font-size="13" fill="#cbd5e1">Bandes colorées : seuils sûrs 0–12 m</text>
    <text x="1535" y="180" font-family="Arial" font-size="13" fill="#cbd5e1">● vert : plateau structurant</text>
    <text x="1535" y="208" font-family="Arial" font-size="13" fill="#cbd5e1">● cyan : bord de plateau</text>
    <text x="1535" y="236" font-family="Arial" font-size="13" fill="#cbd5e1">● jaune : atoll/banc détaché</text>
    <text x="1535" y="264" font-family="Arial" font-size="13" fill="#cbd5e1">● orange : pinnacle isolé</text>
    <text x="1535" y="292" font-family="Arial" font-size="13" fill="#cbd5e1">● rouge : indéterminé</text>
    <text x="1535" y="342" font-family="Arial" font-size="13" fill="#cbd5e1">Pointillés : bbox des structures majeures</text>
    <text x="1535" y="370" font-family="Arial" font-size="13" fill="#cbd5e1">Étiquettes : plateau · aire · cœurs &lt;12 m</text>
    <text x="1535" y="430" font-family="Arial" font-size="13" fill="#cbd5e1">Structures dans la planche : {len(in_plateaus):,}</text>
    <text x="1535" y="458" font-family="Arial" font-size="13" fill="#cbd5e1">Cœurs dans la planche : {len(in_candidates):,}</text>
    <text x="1535" y="520" font-family="Arial" font-size="13" fill="#cbd5e1">Emprise WGS84 :</text>
    <text x="1535" y="548" font-family="Arial" font-size="13" fill="#cbd5e1">{west} / {south} / {east} / {north}</text>
  </g>
</svg>
'''
    output.write_text(svg, encoding='utf-8', newline='\n')
    return {'sector': sector['id'], 'plateaus': len(in_plateaus), 'candidates': len(in_candidates),
            'labels': len(plateau_labels)}


def write_decisions(plateaus, trees, output):
    fields = [
        'plateau50Id', 'familleWarp', 'secteurPrincipal', 'secteursAtlas', 'latitude', 'longitude', 'surfaceKm2', 'etendueKm',
        'pctMesuresDirectes', 'nombreCoeurs', 'nombreCoeursSous6m', 'classeStructurelle',
        'decision', 'zoneDocumentaireId', 'labelPropose', 'statutRecherche',
        'visibiliteNav', 'natureFond', 'secondeSource', 'notes',
    ]
    with output.open('w', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields); writer.writeheader()
        for item in sorted(plateaus, key=lambda value: (sector_for_plateau(value, trees), -value['areaApproxKm2'], value['id'])):
            family = warp_family(item, trees)
            lon, lat = item['centroid']['lon'], item['centroid']['lat']
            atlas_sectors = [sector['id'] for sector in SECTORS
                             if sector['bbox'][0] <= lon <= sector['bbox'][2]
                             and sector['bbox'][1] <= lat <= sector['bbox'][3]]
            writer.writerow({
                'plateau50Id': item['id'], 'familleWarp': family,
                'secteurPrincipal': sector_for_plateau(item, trees),
                'secteursAtlas': '|'.join(atlas_sectors),
                'latitude': item['centroid']['lat'], 'longitude': item['centroid']['lon'],
                'surfaceKm2': item['areaApproxKm2'], 'etendueKm': item['extentKm'],
                'pctMesuresDirectes': item['directMeasurementPercent'],
                'nombreCoeurs': item['candidateCount'], 'nombreCoeursSous6m': item['shallowCoreCount'],
                'classeStructurelle': item['structureClass'], 'decision': '', 'zoneDocumentaireId': '',
                'labelPropose': '', 'statutRecherche': 'a_examiner', 'visibiliteNav': '',
                'natureFond': '', 'secondeSource': '', 'notes': '',
            })


def main():
    args = arguments()
    config = json.loads(args.config.read_text(encoding='utf-8'))
    acquisition = config['acquisition']; generated = Path(config['generatedDirectory'])
    output_dir = generated / 'bathymetrie-06-atlas-secteurs'; output_dir.mkdir(parents=True, exist_ok=True)
    width, height = acquisition['expectedWidth'], acquisition['expectedHeight']
    classes = np.memmap(generated / 'gebco-2026-jaillot-classes.u8', dtype=np.uint8,
                        mode='r', shape=(height, width))
    class_preview = np.asarray(classes[1::2, 1::2])
    context = np.memmap(generated / 'gebco-2026-jaillot-context-50-200.u8', dtype=np.uint8,
                        mode='r', shape=(height // 2, width // 2))
    candidates = json.loads((generated / 'bathymetrie-05-candidats-structures-wgs84.json').read_text(encoding='utf-8'))['candidates']
    plateaus = json.loads((generated / 'bathymetrie-05-plateaux-50m.json').read_text(encoding='utf-8'))['plateaus']
    trees = build_family_trees()
    reports = []
    for sector in SECTORS:
        reports.append(render_sector(sector, acquisition, class_preview, context, candidates, plateaus,
                                     output_dir / f"{sector['id']}.svg"))
    write_decisions(plateaus, trees, output_dir / 'decisions-structures.csv')
    manifest = {
        'version': 1, 'sectors': reports, 'plateausInDecisionTable': len(plateaus),
        'candidateCount': len(candidates), 'decisionValues': [
            'zone_principale', 'rattacher', 'sous_zone', 'pinnacle',
            'conserver_physique', 'suspect', 'hors_scope',
        ],
        'notice': ('Les emprises se chevauchent volontairement. Le Pacifique est affecté par proximité '
                   'aux contrôles Copernicus ; la famille Atlantique choisit ensuite la plus petite planche.'),
    }
    (output_dir / 'atlas-manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    cards = ''.join(
        f'<article><h2>{sector["label"]}</h2><p><a href="{sector["id"]}.svg">Ouvrir le SVG seul</a></p>'
        f'<object data="{sector["id"]}.svg" type="image/svg+xml"></object></article>'
        for sector in SECTORS
    )
    index_html = f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Atlas bathymétrique sectoriel</title>
<style>body{{margin:0;padding:24px;background:#07111f;color:#e2e8f0;font:16px system-ui,sans-serif}}h1{{margin-top:0}}main{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}}article{{background:#0f1d33;padding:14px;border-radius:8px}}h2{{font-size:18px;margin:0 0 6px}}a{{color:#67e8f9}}object{{display:block;width:100%;aspect-ratio:19/12;background:#07111f}}code{{color:#fde68a}}@media(max-width:1000px){{main{{grid-template-columns:1fr}}}}</style></head>
<body><h1>Atlas bathymétrique sectoriel — GEBCO 2026</h1>
<p>Les neuf planches se chevauchent volontairement. La table éditable est <a href="decisions-structures.csv"><code>decisions-structures.csv</code></a>.</p>
<main>{cards}</main></body></html>'''
    (output_dir / 'atlas-index.html').write_text(index_html, encoding='utf-8', newline='\n')
    guide = '''# Atlas sectoriel — mode d'emploi

Les planches sont en WGS84. Le turquoise représente les structures marines
entre 0 et 50 m ; les bandes jaune/orange/rose/violet/bleu représentent les
seuils de navigation sûre jusqu'à 12 m.

Chaque SVG utilise un fichier PNG compagnon nommé `*-fond.png`. Pour ouvrir
une planche dans Illustrator, conserver le SVG et son PNG dans le même dossier.
Le PNG RGBA occupe tout le canevas (`1900 × 1200 px`, 96 ppp), commence en
`(0,0)` et contient déjà la carte dans le rectangle `(55,80)–(1505,1140)`.
Illustrator n'a ainsi aucun placement ni étirement de raster à interpréter.
Les textes n'utilisent aucune feuille CSS : police, taille, fond et contour
sont inscrits directement sur chaque objet.
Les groupes SVG sont déclarés comme calques nommés afin de pouvoir masquer
séparément le fond bathymétrique, les emprises, les cinq signatures, les
étiquettes, les toponymes et la légende.

Dans `decisions-structures.csv`, renseigner `decision` avec l'une des valeurs :

- `zone_principale`
- `rattacher`
- `sous_zone`
- `pinnacle`
- `conserver_physique`
- `suspect`
- `hors_scope`

Plusieurs `plateau50Id` peuvent partager le même `zoneDocumentaireId` sans
fusionner leurs géométries physiques. `secteursAtlas` indique toutes les
planches où le centroïde est visible ; `secteurPrincipal` sert au classement.
'''
    (output_dir / 'README.md').write_text(guide, encoding='utf-8', newline='\n')
    print(json.dumps(manifest, ensure_ascii=False, indent=2)); return 0


if __name__ == '__main__':
    raise SystemExit(main())
