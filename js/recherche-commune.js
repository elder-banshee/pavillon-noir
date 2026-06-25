// recherche-commune.js — Moteur de recherche partagé
// Utilisé par carte.js (recherche générale) et navigation-jaillot.js (calculateur).
// Doit être chargé avant ces deux fichiers.

(function () {
  'use strict';

  // ── Cache de normalisation ────────────────────────────────────────────────
  const _cache = new Map();

  /**
   * Normalise une chaîne pour la comparaison :
   * - minuscules
   * - suppression des diacritiques
   * - tirets et espaces supprimés ← "Basse-Terre" == "Basseterre" == "Basse Terre"
   *                                   "Saint-G" == "Saint G", "Vera Cruz" == "Veracruz"
   */
  function normaliser(str) {
    const cle = String(str ?? '');
    const cached = _cache.get(cle);
    if (cached !== undefined) return cached;
    const valeur = cle
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[-\s]+/g, '');
    _cache.set(cle, valeur);
    return valeur;
  }

  // ── Utilitaires HTML ──────────────────────────────────────────────────────

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function surlignerMatch(texte, qLow) {
    const str = String(texte ?? '');
    const texteLow = normaliser(str);
    const idx = texteLow.indexOf(qLow);
    if (idx === -1) return escapeHtml(str);
    return escapeHtml(str.slice(0, idx))
      + `<mark class="carte-recherche-highlight">${escapeHtml(str.slice(idx, idx + qLow.length))}</mark>`
      + escapeHtml(str.slice(idx + qLow.length));
  }

  // ── rechercheVilles ───────────────────────────────────────────────────────

  /**
   * Recherche unifiée dans VILLES (et optionnellement JURIDICTIONS).
   *
   * @param {string} q          Texte saisi par l'utilisateur.
   * @param {object} options
   *   filtre   : 'tout'   → villes + juridictions (recherche générale)
   *              'navig'  → uniquement villes navigables (port, ou rade explicite)
   *   limite   : nombre max de résultats (défaut 12 pour 'tout', 8 pour 'navig')
   *   mj       : boolean — mode MJ actif (défaut false)
   *   annee    : number  — année de jeu (défaut Infinity)
   *
   * @returns {Array} Tableau de résultats enrichis :
   *   { type, item, id, nom, matchTag, territoire, parenthese }
   *   - type       : 'ville' | 'juridiction'
   *   - item       : l'objet source (ville ou juridiction)
   *   - id         : item.id
   *   - nom        : nom affiché
   *   - matchTag   : tag qui a matché (peut différer de nom si alias)
   *   - territoire : item.territoire (villes) ou null
   *   - parenthese : HTML de la parenthèse homonyme, ou ''
   */
  function rechercheVilles(q, options) {
    const {
      filtre = 'tout',
      limite = filtre === 'navig' ? 8 : 12,
      mj     = (typeof modeMJ !== 'undefined' ? modeMJ : false),
      annee  = (typeof anneeActive !== 'undefined'
                  ? anneeActive
                  : (typeof CARTE_ANNEE_REFERENCE !== 'undefined'
                      ? CARTE_ANNEE_REFERENCE
                      : Infinity)),
    } = options || {};

    const qLow = normaliser(q);
    if (!qLow) return [];

    const resultats = [];

    // ── Juridictions (filtre 'tout' seulement) ────────────────────────────
    if (filtre === 'tout' && typeof JURIDICTIONS !== 'undefined') {
      JURIDICTIONS.forEach(j => {
        if (j.visible_mj && !mj) return;
        const nomMatch = normaliser(j.nom).includes(qLow);
        let matchTag = nomMatch ? j.nom : null;
        if (!matchTag && j.tags) {
          for (const tag of j.tags) {
            if (normaliser(tag).includes(qLow)) { matchTag = tag; break; }
          }
        }
        if (matchTag) resultats.push({ type: 'juridiction', item: j, nom: j.nom, matchTag });
      });
    }

    // ── Villes ────────────────────────────────────────────────────────────
    if (typeof VILLES !== 'undefined') {
      VILLES.forEach(ville => {
        // Filtre commun : coordonnées obligatoires
        if (!ville.coords) return;

        // Filtre 'navig' : port OU rade explicite valide
        if (filtre === 'navig') {
          const rade = ville.rade;
          const radeValide = Array.isArray(rade) && rade.length >= 2
            && Number.isFinite(rade[0]) && Number.isFinite(rade[1]);
          if (ville.type !== 'port' && !radeValide) return;
        }

        // Filtre rang (visible_mj, rang 3)
        if (ville.visible_mj && !mj) return;
        if (String(ville.rang ?? '1') === '3' && !mj) return;

        // Filtre temporel
        if (ville.visible_de && annee < ville.visible_de) return;

        // Matching — nom et label toujours testés, tags sont des alias supplémentaires
        const tags = [ville.nom, ville.label, ...(ville.tags || [])].filter(Boolean);
        let matchTag = null;
        for (const tag of tags) {
          if (normaliser(tag).includes(qLow)) { matchTag = tag; break; }
        }
        if (!matchTag) return;

        resultats.push({ type: 'ville', item: ville, nom: ville.nom, matchTag });
      });
    }

    if (!resultats.length) return [];

    // ── Tri ───────────────────────────────────────────────────────────────
    resultats.sort((a, b) => {
      const scorer = r => {
        const nomLow = normaliser(r.nom);
        const tagLow = normaliser(r.matchTag);
        const estVille = r.type === 'ville';
        if (nomLow.startsWith(qLow)) return estVille ? 0 : 1;
        if (nomLow.includes(qLow))   return estVille ? 2 : 3;
        if (tagLow.startsWith(qLow)) return estVille ? 4 : 5;
        return estVille ? 6 : 7;
      };
      const ra = scorer(a), rb = scorer(b);
      if (ra !== rb) return ra - rb;
      return normaliser(a.nom).localeCompare(normaliser(b.nom), 'fr');
    });

    // ── Tranche + détection homonymes ─────────────────────────────────────
    const tranche = resultats.slice(0, limite);
    const tousNoms = tranche.map(r => normaliser(r.item.nom));
    const nomsAmbigus = new Set(
      tousNoms.filter((n, i) => tousNoms.indexOf(n) !== i || tousNoms.lastIndexOf(n) !== i)
    );

    // ── Enrichissement : territoire + parenthèse ──────────────────────────
    return tranche.map(r => {
      const { type, item, nom, matchTag } = r;
      let parenthese = '';

      if (type === 'ville' && nomsAmbigus.has(normaliser(item.nom))) {
        const jur = typeof JURIDICTIONS !== 'undefined'
          ? JURIDICTIONS.find(j => j.id === item.territoire)
          : null;
        const jurNom = jur ? (jur.label || jur.nom) : null;
        if (jurNom) {
          parenthese = ` <span class="carte-recherche-suggestion-territoire">(${jurNom})</span>`;
        }
      }

      return {
        type,
        item,
        id:          item.id,
        nom,
        matchTag,
        territoire:  item.territoire || null,
        parenthese,
      };
    });
  }

  // ── texteFantome ──────────────────────────────────────────────────────────

  /**
   * Calcule le texte à afficher dans le champ fantôme après une saisie.
   *
   * @param {Array}  resultats  Résultats retournés par rechercheVilles()
   * @param {string} q          Texte saisi par l'utilisateur (non normalisé)
   * @returns {string} Texte fantôme, ou '' si aucun résultat
   *
   * Comportement :
   * - Priorité au premier résultat dont nom ou matchTag commence par q (normalisé) :
   *   → complétion suffixe naturelle "Nass" + "au" = "Nassau"
   * - Sinon (ex : "basse-t" → "Basseterre", aucun startsWith) :
   *   → nom complet du premier résultat affiché dans le volet
   */
  function texteFantome(resultats, q) {
    if (!resultats.length) return '';
    const qLow = normaliser(q);
    // Chercher un candidat dont nom ou matchTag commence par q normalisé
    const candidat = resultats.find(({ nom, matchTag }) =>
      normaliser(nom).startsWith(qLow) || normaliser(matchTag).startsWith(qLow)
    );
    if (candidat) {
      const cible = normaliser(candidat.nom).startsWith(qLow) ? candidat.nom : candidat.matchTag;
      // Complétion suffixe uniquement si q est un préfixe littéral de cible
      // ET que q ne contient ni tiret ni espace (formes identiques, suffixe fiable).
      // Sinon (ex: "basse-t"→"Basse-Terre", "vera cruz"→"Veracruz") : nom complet.
      const qSansDecoration = q.replace(/[-\s]/g, '');
      const suffixePossible = cible.toLowerCase().startsWith(q.toLowerCase())
        && qSansDecoration === q;
      if (suffixePossible) return q + cible.slice(q.length);
      return '';
    }
    // Pas de startsWith littéral : pas de fantôme, le volet suffit
    return '';
  }

  // ── Export ────────────────────────────────────────────────────────────────
  window.RC = { normaliser, escapeHtml, surlignerMatch, rechercheVilles, texteFantome };

})();
