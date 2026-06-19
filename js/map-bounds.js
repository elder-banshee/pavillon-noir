// map-bounds.js — Limites géographiques utiles de la carte Jaillot
// Coordonnées en pixels Jaillot (8500 × 5320).
//
// Ce polygone délimite la zone navigable de la carte, en excluant
// les titres, frises décoratives et marges non géographiques.
// Toute case hors de ce polygone est traitée comme non navigable.
//
// Usage dans navigation-jaillot.js :
//   if (!pointInMapBounds(x, y)) { /* case exclue */ }

const MAP_BOUNDS_POLYGON = [
  [193, 367], [4274, 373], [8355, 397],
  [8349, 5030], [4262, 5027], [4251, 5024],
  [172, 5013],
];

// Test d'inclusion point-dans-polygone (algorithme ray-casting)
function pointInMapBounds(x, y) {
  const poly = MAP_BOUNDS_POLYGON;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

if (typeof window !== 'undefined') {
  window.MAP_BOUNDS_POLYGON = MAP_BOUNDS_POLYGON;
  window.pointInMapBounds   = pointInMapBounds;
}
