#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { TextDecoder } = require('util');

const ROOT = path.resolve(__dirname, '..');
const STRICT_EOL = process.argv.includes('--strict-eol');
const MAX_EXAMPLES = 8;

const TEXT_EXTENSIONS = new Set([
  '.css', '.csv', '.html', '.js', '.json', '.md', '.old', '.ps1',
  '.svg', '.txt', '.xml', '.yaml', '.yml',
]);

const TEXT_FILENAMES = new Set([
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
]);

const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
]);

const decoder = new TextDecoder('utf-8', { fatal: true });

function isTextCandidate(rel) {
  const base = path.basename(rel);
  return TEXT_FILENAMES.has(base) || TEXT_EXTENSIONS.has(path.extname(base).toLowerCase());
}

function listFiles(dir = ROOT, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      files.push(...listFiles(path.join(dir, entry.name), path.join(prefix, entry.name)));
      continue;
    }
    if (entry.isFile()) {
      files.push(path.join(prefix, entry.name).replace(/\\/g, '/'));
    }
  }
  return files;
}

function suspiciousLines(text) {
  const suspicious = [
    /\u00c3[\u0080-\u00bf]/, // UTF-8 accent bytes misread as Windows-1252.
    /\u00c2[\u0080-\u00bf\u00a0-\u00bf]/, // Misread spacing/punctuation bytes.
    /\u00e2[\u0080-\u009f\u2018-\u201d\u2020-\u2022\u20ac]/, // Misread dashes, bullets, box lines, quotes.
    /[\u0080-\u009f]/, // C1 controls left by Latin-1 mojibake.
    /\ufffd/, // replacement character: data already lost.
  ];

  const hits = [];
  const lines = text.split(/\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].replace(/\r$/, '');
    if (suspicious.some((pattern) => pattern.test(line))) {
      hits.push({ line: i + 1, text: line.trim().slice(0, 160) });
      if (hits.length >= MAX_EXAMPLES) break;
    }
  }
  return hits;
}

function auditFile(rel) {
  const abs = path.join(ROOT, rel);
  const bytes = fs.readFileSync(abs);
  const issues = [];

  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    issues.push({ level: 'error', message: 'UTF-8 BOM' });
  }
  if ((bytes[0] === 0xff && bytes[1] === 0xfe) || (bytes[0] === 0xfe && bytes[1] === 0xff)) {
    issues.push({ level: 'error', message: 'UTF-16 BOM' });
  }

  let text = '';
  try {
    text = decoder.decode(bytes);
  } catch (error) {
    const match = /position (\d+)/.exec(String(error.message));
    const pos = match ? Number(match[1]) : 0;
    issues.push({ level: 'error', message: `invalid UTF-8 near byte ${pos}` });
    text = bytes.toString('utf8');
  }

  const crlf = (text.match(/\r\n/g) || []).length;
  const crOnly = (text.match(/\r(?!\n)/g) || []).length;
  if (crlf || crOnly) {
    issues.push({
      level: STRICT_EOL ? 'error' : 'warn',
      message: `non-LF line endings: CRLF=${crlf}, CR-only=${crOnly}`,
    });
  }

  const mojibake = suspiciousLines(text);
  if (mojibake.length) {
    issues.push({ level: 'error', message: `probable mojibake (${mojibake.length}+ line(s))`, examples: mojibake });
  }

  const finalByte = bytes[bytes.length - 1];
  if (bytes.length && finalByte !== 10) {
    issues.push({ level: STRICT_EOL ? 'error' : 'warn', message: 'missing final newline' });
  }

  return issues;
}

let errorCount = 0;
let warnCount = 0;

for (const rel of listFiles().filter(isTextCandidate)) {
  const issues = auditFile(rel);
  if (!issues.length) continue;

  console.log(`\n${rel}`);
  for (const issue of issues) {
    if (issue.level === 'error') errorCount += 1;
    else warnCount += 1;
    console.log(`  ${issue.level.toUpperCase()}: ${issue.message}`);
    if (issue.examples) {
      for (const example of issue.examples) {
        console.log(`    L${example.line}: ${example.text}`);
      }
    }
  }
}

if (errorCount || warnCount) {
  console.log(`\nAudit texte: ${errorCount} erreur(s), ${warnCount} avertissement(s).`);
} else {
  console.log('Audit texte: OK.');
}

process.exit(errorCount ? 1 : 0);
