    'use strict';

    // Modales et outils avancés de rattachement/scission de contours.

    // ═══════════════════════════════════════════════════════════
    // OUTIL SCINDER
    // ═══════════════════════════════════════════════════════════
    let splitFirstPt = null;  // { ptIdx, marker } — premier point sélectionné
    let splitHandles = [];   // L.CircleMarker[] affichés en mode split

    const HANDLE_SPLIT_IDLE = { radius: 5, color: 'rgba(220,140,255,0.7)', weight: 1.5, fillColor: 'rgba(14,12,9,0.9)', fillOpacity: 1 };
    const HANDLE_SPLIT_FIRST = { radius: 7, color: '#e0a0ff', weight: 2.5, fillColor: 'rgba(200,100,255,0.35)', fillOpacity: 1 };

    function renderSplitHandles() {
      clearSplitHandles();
      if (currentTool !== 'split' || !selectedZoneId) return;
      const contour = zonesEdit[selectedZoneId][selectedContourIdx];
      contour.forEach((pt, ptIdx) => {
        const isFirst = splitFirstPt && splitFirstPt.ptIdx === ptIdx;
        const style = isFirst ? HANDLE_SPLIT_FIRST : HANDLE_SPLIT_IDLE;
        const circle = L.circleMarker(pxToLatLng(pt[0], pt[1]), { ...style, interactive: true });
        circle._ptIdx = ptIdx;
        circle.on('mouseover', function () { if (!isFirst) this.setStyle({ ...HANDLE_SPLIT_IDLE, radius: 7, color: '#e0a0ff' }); });
        circle.on('mouseout', function () { if (!isFirst) this.setStyle(HANDLE_SPLIT_IDLE); });
        circle.on('click', function (e) {
          L.DomEvent.stopPropagation(e);
          onSplitClick(this._ptIdx);
        });
        circle.addTo(map);
        splitHandles.push(circle);
      });
    }

    function clearSplitHandles() {
      splitHandles.forEach(h => map.removeLayer(h));
      splitHandles = [];
    }

    function onSplitClick(ptIdx) {
      const contour = zonesEdit[selectedZoneId][selectedContourIdx];

      if (!splitFirstPt) {
        // Premier clic : mémoriser le point
        splitFirstPt = { ptIdx };
        renderSplitHandles(); // re-render pour surligner
        return;
      }

      const p1 = splitFirstPt.ptIdx;
      const p2 = ptIdx;
      splitFirstPt = null;

      if (p1 === p2) {
        // Cas B : point unique — chercher s'il est dupliqué dans le contour
        const occurrences = contour.reduce((acc, pt, i) => {
          if (pt[0] === contour[p1][0] && pt[1] === contour[p1][1]) acc.push(i);
          return acc;
        }, []);
        if (occurrences.length < 2) {
          renderSplitHandles();
          return;
        }
        // Scinder en deux boucles au point commun
        const i1 = occurrences[0], i2 = occurrences[1];
        const loopA = contour.slice(i1, i2 + 1);
        const loopB = [...contour.slice(i2), ...contour.slice(0, i1 + 1)];
        applySplit(loopA, loopB);
      } else {
        // Cas A : deux points distincts — couper entre p1 et p2
        if (p1 === p2) { renderSplitHandles(); return; }
        const [lo, hi] = p1 < p2 ? [p1, p2] : [p2, p1];
        const loopA = [...contour.slice(lo, hi + 1)];
        const loopB = [...contour.slice(hi), ...contour.slice(0, lo + 1)];
        applySplit(loopA, loopB);
      }
    }

    function applySplit(loopA, loopB) {
      if (loopA.length < 3 || loopB.length < 3) {
        alert('La découpe produirait un contour de moins de 3 points — opération annulée.');
        renderSplitHandles();
        return;
      }
      pushUndo('Scinder contour');
      // Remplacer le contour actif par loopA, insérer loopB juste après.
      // Le rôle ('exterior' | 'hole') du contour scindé est préservé sur les
      // deux moitiés — c'est justement pour survivre à ce genre de
      // réordonnancement qu'il est posé en dur plutôt que déduit de l'index.
      const splitRole = contourRole(selectedZoneId, selectedContourIdx);
      zonesEdit[selectedZoneId].splice(selectedContourIdx, 1, loopA, loopB);
      zonesMeta[selectedZoneId] ??= [];
      zonesMeta[selectedZoneId].splice(selectedContourIdx, 1,
        splitRole ? { role: splitRole } : null,
        splitRole ? { role: splitRole } : null);
      clearSplitHandles();
      selectedContourIdx = Math.min(selectedContourIdx, zonesEdit[selectedZoneId].length - 1);
      refresh(R.SELECTED_ZONE | R.PANEL | R.EXPORT);
      renderSplitHandles();
    }

    // ═══════════════════════════════════════════════════════════
    // POPUP — RATTACHEMENT D'UN CONTOUR À UNE JURIDICTION
    // ═══════════════════════════════════════════════════════════
    let _pendingDrawPoints = null; // points en attente de rattachement

    function openAttachModal(points) {
      _pendingDrawPoints = points;
      const overlay = document.getElementById('ze-overlay');
      const title = document.getElementById('ze-modal-title');
      const body = document.getElementById('ze-modal-body');
      title.textContent = 'Rattacher le contour';
      body.innerHTML = `
    <span class="ze-modal-label">Juridiction existante</span>
    <div style="position:relative">
      <input id="ze-attach-input" class="ze-modal-input" type="text"
             placeholder="Nom ou identifiant…" autocomplete="off" aria-autocomplete="list">
      <span id="ze-attach-fantome" style="position:absolute;top:0;left:0;height:100%;
            display:flex;align-items:center;pointer-events:none;
            font-family:Cinzel,serif;font-size:0.75rem;color:var(--text-dim);opacity:0.5;"></span>
    </div>
    <ul id="ze-attach-suggestions" class="ze-suggestions"></ul>
    <hr class="ze-modal-sep">
    <div class="ze-modal-actions">
      <button id="ze-btn-cancel"  class="ze-btn danger">Annuler</button>
      <button id="ze-btn-attach"  class="ze-btn primary" disabled>Rattacher</button>
      <button id="ze-btn-new-jur" class="ze-btn">Nouvelle juridiction</button>
    </div>
    <div class="ze-modal-hint">Le contour sera ajouté à la juridiction choisie.</div>
  `;
      overlay.style.display = 'flex';

      // Construire la source de données : IDs de ZONES_DATA
      const zonesSource = Object.keys(zonesEdit).sort().map(id => ({ id, nom: id }));

      const input = document.getElementById('ze-attach-input');
      const fantome = document.getElementById('ze-attach-fantome');
      const suggestions = document.getElementById('ze-attach-suggestions');
      const btnAttach = document.getElementById('ze-btn-attach');
      let selectedZoneResult = null;

      RC.initChampRecherche(input, fantome, suggestions, {
        obtenirResultats: q => {
          const qN = RC.normaliser(q);
          return zonesSource
            .filter(z => RC.normaliser(z.id).includes(qN))
            .slice(0, 10)
            .map(z => ({ type: 'zone', item: z, id: z.id, nom: z.id, matchTag: z.id }));
        },
        rendreItem: (r, qLow) => {
          const hl = RC.surlignerMatch(r.nom, qLow);
          return `<li class="carte-recherche-suggestion" data-id="${RC.escapeHtml(r.id)}" data-nom="${RC.escapeHtml(r.nom)}">${hl}</li>`;
        },
        onChoisir: (li) => {
          selectedZoneResult = li.dataset.id;
          input.value = selectedZoneResult;
          btnAttach.disabled = false;
        },
        onEntreeSansMatch: (q) => {
          // Sélection directe si q est un ID exact
          if (zonesEdit[q]) { selectedZoneResult = q; btnAttach.disabled = false; }
        },
        msgAucunResultat: 'Aucune juridiction trouvée',
      });

      input.addEventListener('input', () => {
        // Réactiver si l'utilisateur tape un ID exact
        selectedZoneResult = zonesEdit[input.value.trim()] ? input.value.trim() : null;
        btnAttach.disabled = !selectedZoneResult;
      });

      document.getElementById('ze-btn-attach').addEventListener('click', () => {
        if (!selectedZoneResult) return;
        closeModal();
        attachDrawTo(selectedZoneResult);
      });

      document.getElementById('ze-btn-cancel').addEventListener('click', () => {
        closeModal();
        _pendingDrawPoints = null;
        setTool('select');
      });

      document.getElementById('ze-btn-new-jur').addEventListener('click', () => {
        openNewJurModal();
      });

      input.focus();
    }

    function openNewJurModal() {
      const title = document.getElementById('ze-modal-title');
      const body = document.getElementById('ze-modal-body');
      title.textContent = 'Nouvelle juridiction';
      body.innerHTML = `
    <span class="ze-modal-label">Identifiant (id)</span>
    <input id="ze-new-id"  class="ze-modal-input" type="text" placeholder="ex: saint-domingue" autocomplete="off">
    <span class="ze-modal-label" style="margin-top:8px;">Nom affiché</span>
    <input id="ze-new-nom" class="ze-modal-input" type="text" placeholder="ex: Saint-Domingue" autocomplete="off">
    <div class="ze-modal-actions">
      <button id="ze-btn-back"   class="ze-btn">← Retour</button>
      <button id="ze-btn-create" class="ze-btn primary" disabled>Créer</button>
    </div>
    <div class="ze-modal-hint">L'entrée sera créée avec des valeurs démographiques à zéro.<br>Éditez-les ensuite dans <strong>Infos — Terres</strong>.</div>
  `;

      const idInput = document.getElementById('ze-new-id');
      const nomInput = document.getElementById('ze-new-nom');
      const btnCreate = document.getElementById('ze-btn-create');

      function validate() {
        const id = idInput.value.trim();
        const nom = nomInput.value.trim();
        const idOk = id.length > 0 && !zonesEdit[id];
        btnCreate.disabled = !(idOk && nom.length > 0);
        idInput.style.borderColor = id.length > 0
          ? (zonesEdit[id] ? 'rgba(200,80,80,0.6)' : 'rgba(80,180,120,0.5)')
          : '';
      }
      idInput.addEventListener('input', validate);
      nomInput.addEventListener('input', validate);

      document.getElementById('ze-btn-back').addEventListener('click', () => {
        openAttachModal(_pendingDrawPoints);
      });

      document.getElementById('ze-btn-create').addEventListener('click', () => {
        const id = idInput.value.trim();
        const nom = nomInput.value.trim();
        if (!id || !nom || zonesEdit[id]) return;
        closeModal();
        createAndAttach(id, nom);
      });

      idInput.focus();
    }

    function closeModal() {
      document.getElementById('ze-overlay').style.display = 'none';
    }

    function attachDrawTo(zoneId) {
      if (!_pendingDrawPoints || _pendingDrawPoints.length < 3) return;
      pushUndo('Ajouter contour');
      zonesEdit[zoneId].push(_pendingDrawPoints.map(p => [...p]));
      zonesMeta[zoneId] ??= [];
      zonesMeta[zoneId].push(isOceanBoundsId(zoneId) ? { role: 'hole' } : null);
      _pendingDrawPoints = null;
      setTool('select');
      selectEntity('zone', zoneId, { contourIdx: zonesEdit[zoneId].length - 1 });
    }

    function createAndAttach(id, nom) {
      if (!_pendingDrawPoints || _pendingDrawPoints.length < 3) return;
      pushUndo('Créer juridiction');
      // Géométrie
      zonesEdit[id] = [_pendingDrawPoints.map(p => [...p])];
      zonesMeta[id] = [null];
      zonesWorkingCopy.DATA[id] = zonesEdit[id];
      // Métadonnées — null sur tous les champs pour distinguer "pas encore renseigné"
      // du 0 explicite (territoire désert). La détection d'avertissement visuel
      // se base sur null, pas sur 0.
      zonesWorkingCopy.DEMO[id] = {
        colons: null, esclaves: null, indiens: null, indiens_asservis: null,
        population: null, superficie: null, score_densite: null, statut_autochtone: null,
      };
      _pendingDrawPoints = null;
      setTool('select');
      selectEntity('zone', id, { contourIdx: 0 });
    }
