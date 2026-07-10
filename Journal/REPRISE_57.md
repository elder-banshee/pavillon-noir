# REPRISE_57 - Audit encodage, mojibake et garde-fous texte

## Contexte

Session ouverte pendant la refonte Navigation, pour traiter un chantier parallèle récurrent : fichiers français accentués corrompus par mojibake, fins de ligne hétérogènes et incertitude sur les outils qui introduisent ces problèmes.

Dépôt de travail : `C:\AI\Site Pavillon Noir\pavillon-noir`

## Diagnostic

- `.editorconfig` et `.gitattributes` existaient déjà et demandaient UTF-8 + LF.
- Aucun fichier texte audité n'était en UTF-16 ni en UTF-8 invalide.
- Les corruptions détectées relevaient surtout de mojibake UTF-8 relu comme Windows-1252 / Latin-1 :
  - exemples reformulés pour ne pas déclencher l'audit : séquences correspondant à é, É, tiret cadratin, filet horizontal et point médian ;
  - quelques caractères de remplacement Unicode déjà irréversibles.
- La console Windows peut afficher des accents ou caractères Unicode de façon trompeuse : ne pas la prendre seule comme preuve de corruption.
- Beaucoup de fichiers suivis par le dépôt restent en CRLF dans la copie de travail, malgré `eol=lf`. Ce point a été laissé comme chantier séparé pour éviter une diff massive pendant la refonte.

## Corrections effectuées

- Réparation ciblée de mojibake dans :
  - `js/carte.js`
  - `tools/zone-editor.html`
  - `css/carte.css`
  - `js/navigation-jaillot.js`
- Conservation des accents français : les corrections remplacent les formes corrompues par du français accentué, pas par de l'ASCII appauvri.
- Ajout de `tools/audit-text-integrity.js` :
  - détecte UTF-8 invalide, BOM UTF-8/UTF-16, mojibake probable, caractères de remplacement Unicode, fins de ligne non LF, absence de newline final ;
  - sort avec erreur seulement pour les problèmes d'encodage/mojibake ;
  - `--strict-eol` permet de rendre les fins de ligne bloquantes.
- Ajout de `.vscode/settings.json` :
  - `files.encoding = utf8`
  - `files.autoGuessEncoding = false`
  - `files.eol = \n`
  - newline final et trim whitespace, sauf Markdown.
- Ajout d'une section `Encodage et fins de ligne` dans `AGENTS.md`.

## Vérifications

Commandes exécutées :

```powershell
node .\tools\audit-text-integrity.js
node --check .\tools\audit-text-integrity.js
node --check .\js\carte.js
node --check .\js\navigation-jaillot.js
node --check .\js\carte-mobile.js
node -e "const fs=require('fs'); const html=fs.readFileSync('./tools/zone-editor.html','utf8'); const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].trim()).filter(Boolean); if(!scripts.length) throw new Error('script inline introuvable'); new Function(scripts[scripts.length-1]); console.log('zone-editor inline script syntax OK');"
git diff --check
```

Résultats :

- Audit texte : `0 erreur(s), 61 avertissement(s)`.
- Les avertissements restants concernent uniquement des fins de ligne CRLF / newlines finaux manquants dans des fichiers non traités pendant cette tranche.
- Les checks JavaScript passent.
- Le script inline de `tools/zone-editor.html` passe.
- `git diff --check` passe.

## Prévention recommandée

- Lancer `node .\tools\audit-text-integrity.js` avant les commits sensibles.
- Lancer `node .\tools\audit-text-integrity.js --strict-eol` quand une tranche dédiée de normalisation LF sera acceptée.
- Dans PowerShell, éviter les écritures implicites avec `Out-File` / `Set-Content` sans `-Encoding utf8`.
- Dans Python, toujours ouvrir les fichiers texte du dépôt avec `encoding='utf-8'` et écrire avec `newline='\n'` quand on réécrit un fichier entier.
- Dans VS Code, ne pas réouvrir un fichier détecté comme Windows-1252/ANSI ; les réglages ajoutés doivent limiter ce risque.
- Ne pas corriger les symptômes en supprimant les accents : le projet reste en français accentué.
