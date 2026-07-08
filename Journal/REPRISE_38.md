# REPRISE_38 - Pavillon Noir - Session 38

## Etat general

Session consacree a la stabilisation du prototype Desktop du calculateur de route dans la carte Jaillot, puis au diagnostic du probleme recurrent de sandbox Windows ACL dans Codex.

Le calculateur de route est toujours un prototype joueur, mais les tests utilisateur indiquent qu'il est globalement robuste sur les routes de reference. Les corrections de cette session ont donc ete ciblees sur des problemes visuels et d'integration :

- lissage de route pouvant visuellement couper une terre ;
- suggestion fantome des champs A/B du calculateur ;
- desactivation du calculateur pendant le mode isolation ;
- preparation d'une recreation propre du projet Codex a cause de l'erreur ACL.

Important : un fichier `AGENTS.md` a ete ajoute a la racine `C:\AI\Site Pavillon Noir` pour guider les futurs threads Codex. Il indique que le depot est dans `pavillon-noir` et que l'historique de reprise est dans `Prompts`.

---

## Corrections effectuees

### 1. Lissage visuel des routes

Fichier concerne :

```text
pavillon-noir\js\navigation-jaillot.js
```

Probleme observe :

- certaines routes contournaient correctement les obstacles au niveau du calcul brut ;
- mais le lissage quadratique pouvait faire passer le trait bleu dans une petite ile ou un cap, surtout au milieu d'un trajet.

Correction :

- le lissage est maintenant accepte virage par virage ;
- chaque courbe proposee est echantillonnee en petits segments ;
- si un segment d'affichage n'est pas navigable avec `margePx: 0`, le virage reste anguleux ;
- le calcul de route n'est pas modifie, seul l'affichage lisse est securise.

Symboles utiles a rechercher :

```js
segmentsAffichageNavigables
pointsAffichageRoute
```

### 2. Suggestion fantome des champs A/B

Fichiers concernes :

```text
pavillon-noir\js\navigation-jaillot.js
pavillon-noir\css\carte.css
```

Problemes observes :

- le fantome etait decale verticalement par rapport au texte saisi ;
- il affichait le nom complet propose, par exemple `Nassau`, au lieu d'afficher seulement le suffixe apres la saisie ;
- il pouvait valider le premier resultat du volet de propositions plutot que la premiere completion exacte par prefixe de nom.

Correction :

- pour une saisie `nas`, le fantome affiche seulement le suffixe `sau` ;
- le suffixe est positionne horizontalement apres la largeur mesuree du texte saisi ;
- la completion fantome cherche le premier port dont le nom commence par la saisie normalisee ;
- Tab, fleche droite et Entree ciblent cette completion fantome quand elle existe ;
- ajustement visuel final : `transform: translateY(1.5px)` dans le style du fantome du calculateur.

Symboles utiles a rechercher :

```js
completionFantomePort
resultatCompletionFantomePort
afficherFantome
largeurTexteSaisi
```

CSS utile :

```css
.nav-jaillot .carte-recherche-fantome
```

### 3. Desactivation du calculateur en mode isolation

Fichier concerne :

```text
pavillon-noir\js\carte.js
```

Demande utilisateur :

- en mode isolation, suite a une recherche "Localiser territoire", le calculateur doit etre desactive et grise comme les autres outils du panneau gauche ;
- le titre "Calculateur d'itineraire" ne doit pas etre grise, par coherence avec le titre "Localiser un territoire".

Correction :

- ajout de `setCalculateurRouteDisabled(disabled)` ;
- appelee dans `zoomerVille`, `isolerTerritoire` et `_restaurerModeNormal` ;
- les champs et boutons sont desactives ;
- les suggestions et fantomes sont nettoyes ;
- le titre du calculateur reste normal ;
- les champs ne recoivent plus de grise supplementaire par conteneur, pour eviter une opacite trop sombre ;
- les boutons, lettres A/B et zone resultat sont traites separement.

Symboles utiles a rechercher :

```js
setCalculateurRouteDisabled
```

### 4. Fichier d'orientation pour nouveau projet Codex

Fichier ajoute :

```text
AGENTS.md
```

Emplacement :

```text
C:\AI\Site Pavillon Noir\AGENTS.md
```

But :

- guider un nouveau projet Codex ouvert sur le dossier parent ;
- rappeler que le depot Git est dans `pavillon-noir` ;
- rappeler que les reprises sont dans `Prompts` ;
- indiquer les commandes de verification de base ;
- signaler que l'erreur ACL doit etre traitee comme un probleme d'environnement.

---

## Verifications realisees

Commandes passees avec succes pendant la session :

```powershell
cd "C:\AI\Site Pavillon Noir\pavillon-noir"
node --check .\js\carte.js
node --check .\js\navigation-jaillot.js
git diff --check
```

Etat Git observe au moment de la redaction :

```text
git status --short
```

ne renvoyait aucune modification, bien que les corrections soient presentes dans les fichiers selon `rg`.

Verification par recherche :

```powershell
rg -n "setCalculateurRouteDisabled|completionFantomePort|segmentsAffichageNavigables|translateY\(1\.5px\)" .\pavillon-noir\js\carte.js .\pavillon-noir\js\navigation-jaillot.js .\pavillon-noir\css\carte.css
```

a confirme la presence des corrections.

---

## Probleme ACL Codex / Windows

Erreur recurrente :

```text
windows sandbox: helper_unknown_error: apply deny-read ACLs
```

Symptomes observes :

- certaines commandes simples passent ;
- les lectures longues ou certains helpers sandboxes echouent ;
- les memes lectures fonctionnent hors sandbox apres autorisation ;
- le navigateur integre / Node REPL peut echouer avec la meme erreur ;
- le probleme suit plusieurs conversations du meme projet Codex.

Diagnostic de session :

- le depot et les fichiers ne semblent pas corrompus ;
- Python et Node repondent ;
- la lecture hors sandbox de `pavillon-noir\js\carte.js` fonctionne ;
- le probleme semble lie a l'etat local du projet Codex ou au helper sandbox Windows.

Decision utilisateur :

- archiver les clavardages utiles ;
- retirer le projet de Codex ;
- recreer un projet Codex propre sur le meme repertoire `C:\AI\Site Pavillon Noir`.

Point important :

- "Retirer le projet" doit etre compris comme retirer l'entree projet de Codex, pas supprimer le dossier Windows.
- Ne pas supprimer ni deplacer `C:\AI\Site Pavillon Noir`.

Test prioritaire dans le nouveau projet :

```powershell
Get-Content .\pavillon-noir\js\carte.js | Select-Object -First 20
```

Si cette commande passe sans demande d'autorisation, l'ancien projet Codex etait probablement corrompu.

Si l'erreur ACL reapparait dans un projet Codex neuf, examiner ensuite la configuration sandbox Windows :

- mode natif Windows `elevated` / `unelevated` ;
- commande eventuelle `/sandbox-add-read-dir C:\AI\Site Pavillon Noir` ;
- ou bascule de workflow vers WSL2 si la sandbox native Windows reste instable.

---

## Prochaines etapes recommandees

### Priorite 0 - Nouveau projet Codex propre

1. Retirer l'ancien projet de Codex apres archivage des conversations utiles.
2. Redemarrer Codex Desktop.
3. Creer un nouveau projet sur :

```text
C:\AI\Site Pavillon Noir
```

4. Verifier que `AGENTS.md` est lu ou, a defaut, le mentionner explicitement au demarrage.
5. Lancer le test ACL prioritaire.

### Priorite 1 - Validation navigateur Desktop

Tester manuellement :

- recherche "Localiser un territoire" puis mode isolation ;
- calculateur grise en isolation ;
- titre "Calculateur d'itineraire" non grise ;
- sortie d'isolation et reactivation du calculateur ;
- champs A/B avec saisie `nas` -> suffixe fantome `sau` ;
- Tab, fleche droite et Entree sur la completion ;
- routes de reference :
  - Nassau -> Puerto Espana ;
  - San Augustin -> Charles Town ;
  - Mobile -> La Nouvelle-Orleans ;
  - La Nouvelle-Orleans -> Mobile ;
  - Charles Town -> San Augustin.

### Priorite 2 - Suite du calculateur Desktop

Reprendre ensuite les priorites de `REPRISE_37.md` :

- rades et contours utiles ;
- obstacles maritimes ;
- distance et duree joueur ;
- vents, courants et couts de cases ;
- route moderne MJ plus tard.

---

## Commandes utiles au demarrage

Depuis le dossier parent :

```powershell
cd "C:\AI\Site Pavillon Noir"
Get-Content .\AGENTS.md
Get-Content .\Prompts\REPRISE_38.md
Get-Content .\pavillon-noir\js\carte.js | Select-Object -First 20
```

Puis :

```powershell
cd "C:\AI\Site Pavillon Noir\pavillon-noir"
git status --short
node --check .\js\carte.js
node --check .\js\navigation-jaillot.js
node --check .\js\carte-mobile.js
```

Si besoin de serveur local :

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

URL :

```text
http://127.0.0.1:8765/carte.html
```
