// recherche-commune.js — Moteur de recherche et champs d'autocomplétion partagés
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
        if (!ville.coords) return;
        if (filtre === 'navig') {
          const rade = ville.rade;
          const radeValide = Array.isArray(rade) && rade.length >= 2
            && Number.isFinite(rade[0]) && Number.isFinite(rade[1]);
          if (ville.type !== 'port' && !radeValide) return;
        }
        if (ville.visible_mj && !mj) return;
        if (String(ville.rang ?? '1') === '3' && !mj) return;
        if (ville.visible_de && annee < ville.visible_de) return;

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
      return { type, item, id: item.id, nom, matchTag, territoire: item.territoire || null, parenthese };
    });
  }

  // ── texteFantome ──────────────────────────────────────────────────────────

  /**
   * Calcule le suffixe à afficher dans le champ fantôme.
   * Retourne le suffixe seul (ex : "au" pour "Nass" → "Nassau"),
   * ou '' si aucune complétion n'est possible.
   */
  function texteFantome(resultats, q) {
    if (!resultats.length) return '';
    const qLow = normaliser(q);
    const candidat = resultats.find(({ nom, matchTag }) =>
      normaliser(nom).startsWith(qLow) || normaliser(matchTag).startsWith(qLow)
    );
    if (candidat) {
      const cible = normaliser(candidat.nom).startsWith(qLow) ? candidat.nom : candidat.matchTag;
      // Suffixe possible uniquement si q est un préfixe littéral de cible.
      // Les espaces sont autorisés ("La " → "La Havane"), les tirets non
      // ("basse-t" → "Basse-Terre" serait ambigu).
      const suffixePossible = cible.toLowerCase().startsWith(q.toLowerCase())
        && !q.includes('-');
      if (suffixePossible) return cible.slice(q.length);
    }
    return '';
  }

  // ── initFantome ───────────────────────────────────────────────────────────

  /**
   * Initialise le fantôme d'autocomplétion pour un champ de saisie.
   * Retourne { afficher(suffixe), vider() }.
   *
   * Position calculée via measureText — exactement après le dernier caractère saisi.
   * CSS attendu sur l'élément fantôme : position absolute, display flex, align-items center.
   */
  function initFantome(input, fantome) {
    if (!input || !fantome) return { afficher: () => {}, vider: () => {} };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    function largeurTexte() {
      const style = getComputedStyle(input);
      ctx.font = style.font;
      const texte = input.value || '';
      const espacement = parseFloat(style.letterSpacing);
      const extra = Number.isFinite(espacement) ? Math.max(0, texte.length - 1) * espacement : 0;
      // measureText ignore les espaces finaux — mesurés séparément via différence
      const espacesFin = texte.match(/\s+$/)?.[0] || '';
      const largeurEspaces = espacesFin.length > 0
        ? ctx.measureText('x' + espacesFin).width - ctx.measureText('x').width
        : 0;
      return ctx.measureText(texte).width + extra + largeurEspaces;
    }

    function afficher(suffixe) {
      fantome.textContent = suffixe || '';
      if (!suffixe) { fantome.style.left = ''; return; }
      const style = getComputedStyle(input);
      const bordure = parseFloat(style.borderLeftWidth) || 0;
      const padding = parseFloat(style.paddingLeft) || 0;
      fantome.style.left = `${bordure + padding + largeurTexte()}px`;
    }

    function vider() {
      fantome.textContent = '';
      fantome.style.left = '';
    }

    return { afficher, vider };
  }

  // ── initChampRecherche ────────────────────────────────────────────────────

  /**
   * Initialise un champ d'autocomplétion complet : rendu suggestions, fantôme,
   * navigation clavier (Tab/→, ↑↓, Entrée, Échap), mousedown.
   *
   * @param {HTMLInputElement} input
   * @param {HTMLElement}      fantome
   * @param {HTMLUListElement} suggestions
   * @param {object}           opts
   *
   *   obtenirResultats(q)         → Array RC  — requête de recherche
   *   rendreItem(r, qLow)         → string    — HTML d'un <li> (avec data-id, data-nom, data-matchtag)
   *   onChoisir(li, valeur, gh)   — appelé sur clic / Tab / Entrée sur une suggestion
   *                                  li     : l'élément <li> choisi
   *                                  valeur : nom complet reconstruit (q + suffixe ou li.dataset.nom)
   *                                  gh     : handle fantôme { afficher, vider }
   *   onEntreeSansMatch(q, gh)    — appelé sur Entrée sans suggestion active (optionnel)
   *   onEchap(gh)                 — appelé sur Échap (optionnel)
   *   onPositionner()             — hook après rendu suggestions (optionnel, ex : téléportation modale)
   *   onBlur(gh)                  — hook sur blur de l'input (optionnel)
   *   msgAucunResultat            — texte du message "aucun résultat" (défaut : 'Aucun résultat')
   */
  function initChampRecherche(input, fantome, suggestions, opts) {
    const {
      obtenirResultats,
      rendreItem,
      onChoisir,
      onEntreeSansMatch = () => {},
      onEchap           = () => {},
      onPositionner     = () => {},
      onBlur            = () => {},
      // Tab / → : par défaut valide (choisit la suggestion — comportement calculateur).
      // Passer onTab: 'completer' pour ne faire que compléter le texte sans valider.
      onTab             = 'valider',
      msgAucunResultat  = 'Aucun résultat',
    } = opts;

    const gh = initFantome(input, fantome);
    let suggestionActive  = null;
    let suggestionFantomeId = null;

    // ── Utilitaires internes ──────────────────────────────────────────────

    function vider() {
      suggestions.innerHTML = '';
      gh.vider();
      input.setAttribute('aria-expanded', 'false');
      suggestionActive    = null;
      suggestionFantomeId = null;
    }

    function choisir(li) {
      if (!li) return;
      const valeur = li.dataset.nom || '';
      onChoisir(li, valeur, gh);
      vider();
    }

    function liFantome() {
      return suggestionFantomeId
        ? [...suggestions.querySelectorAll('.carte-recherche-suggestion')]
            .find(li => li.dataset.id === suggestionFantomeId)
        : null;
    }

    // ── Rendu ─────────────────────────────────────────────────────────────

    function rendu(q) {
      const qLow = normaliser(q);
      if (!qLow) { vider(); return; }

      const resultats = obtenirResultats(q);
      suggestionFantomeId = null;

      if (!resultats.length) {
        suggestions.innerHTML = `<li class="carte-recherche-vide">${escapeHtml(msgAucunResultat)}</li>`;
        onPositionner();
        gh.vider();
        input.setAttribute('aria-expanded', 'true');
        return;
      }

      input.setAttribute('aria-expanded', 'true');
      suggestions.innerHTML = resultats.map(r => rendreItem(r, qLow)).join('');
      onPositionner();

      // Fantôme
      const suffixe = texteFantome(resultats, q);
      const nomComplet = suffixe ? normaliser(q + suffixe) : null;
      const candidat = nomComplet
        ? resultats.find(r => normaliser(r.nom) === nomComplet || normaliser(r.matchTag) === nomComplet)
        : null;
      suggestionFantomeId = candidat?.item?.id || null;
      gh.afficher(suffixe);

      suggestions.querySelectorAll('.carte-recherche-suggestion').forEach(li => {
        li.addEventListener('click', () => choisir(li));
      });
    }

    // ── Événements ────────────────────────────────────────────────────────

    input.addEventListener('input', () => rendu(input.value));

    suggestions.addEventListener('mousedown', e => e.preventDefault());

    input.addEventListener('keydown', e => {
      // Tab / → : compléter ou valider selon onTab
      if ((e.key === 'Tab' || e.key === 'ArrowRight') && fantome.textContent) {
        e.preventDefault();
        if (onTab === 'completer') {
          // Complétion seule : écrire le nom complet dans l'input, garder les suggestions ouvertes
          input.value = input.value + fantome.textContent;
          gh.vider();
          return;
        }
        // Comportement par défaut : valider (choisir la suggestion)
        const cible = suggestionActive || liFantome();
        if (cible) { choisir(cible); return; }
        const nomComplet = input.value + fantome.textContent;
        input.value = nomComplet;
        gh.vider();
        suggestions.innerHTML = '';
        return;
      }

      const items = [...suggestions.querySelectorAll('.carte-recherche-suggestion')];
      let idx = suggestionActive ? items.indexOf(suggestionActive) : -1;

      // Entrée
      if (e.key === 'Enter') {
        e.preventDefault();
        const cible = suggestionActive
          || suggestions.querySelector('.carte-recherche-suggestion--active')
          || liFantome()
          || items[0];
        if (cible) { choisir(cible); return; }
        onEntreeSansMatch(input.value.trim(), gh);
        vider();
        return;
      }

      if (!items.length) return;

      // ↑↓ navigation
      function naviguer(delta) {
        if (suggestionActive) suggestionActive.classList.remove('carte-recherche-suggestion--active');
        idx = (idx + delta + items.length) % items.length;
        suggestionActive = items[idx];
        suggestionActive.classList.add('carte-recherche-suggestion--active');
        suggestionActive.scrollIntoView({ block: 'nearest' });
        const q = input.value.trim();
        const nomSel = items[idx].dataset.nom || '';
        gh.afficher(normaliser(nomSel).startsWith(normaliser(q)) ? nomSel.slice(q.length) : '');
      }

      if (e.key === 'ArrowDown') { e.preventDefault(); naviguer(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); naviguer(-1); }
      else if (e.key === 'Escape') { onEchap(gh); vider(); }
    });

    if (onBlur !== (() => {})) {
      input.addEventListener('blur', () => setTimeout(() => onBlur(gh), 120));
    }

    return { gh, vider, rendu };
  }

  // ── Export ────────────────────────────────────────────────────────────────
  window.RC = {
    normaliser,
    escapeHtml,
    surlignerMatch,
    rechercheVilles,
    texteFantome,
    initFantome,
    initChampRecherche,
  };

})();
