#!/usr/bin/env node
/*!
 * RcDesign build script
 * Author: Raffaele Catapano — https://github.com/MrGodLink
 *
 * Turns the readable sources in /src into the two files that are meant
 * to be distributed and loaded by consumers, at the repository root:
 *
 *   rc_design.css  — minified CSS with internal theme-token custom
 *                     properties renamed to short, cryptic names.
 *   rc_design.js   — the engine, with that same obfuscated CSS embedded
 *                     inline, then minified and name-mangled so the
 *                     file is a single self-contained <script src="">.
 *
 * Only the ~24 CSS custom properties that are purely internal to the
 * stylesheet (the per-theme design tokens) are renamed. The three
 * properties JS writes directly at runtime (--rc-i, --rc-rx, --rc-ry)
 * and every public class/attribute used in markup (.rc-btn, .rc-nav,
 * [data-rc-style], [data-rc-open], ...) are left untouched, because
 * consumers write those in their own HTML and renaming them would
 * break the library's published API rather than just its internals.
 *
 * Run: npm run build
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import CleanCSS from 'clean-css';
import { minify } from 'terser';
import JavaScriptObfuscator from 'javascript-obfuscator';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

const SRC_CSS = path.join(root, 'src', 'rc-design.css');
const SRC_JS = path.join(root, 'src', 'rc-design.js');
const OUT_CSS = path.join(root, 'rc_design.css');
const OUT_JS = path.join(root, 'rc_design.js');

const BANNER =
  '/*! RcDesign v1.0.0 | (c) 2026 Raffaele Catapano | ' +
  'https://github.com/MrGodLink/RcDesign | MIT License */';

// Custom properties that are a live contract between the CSS and the
// JS runtime (JS calls element.style.setProperty on these). Never
// rename these, in either build output.
const RESERVED_PROPS = new Set(['--rc-i', '--rc-rx', '--rc-ry']);

/** Find every --rc-* custom property token used in the stylesheet. */
function collectTokens(cssText) {
  const found = new Set();
  const re = /--rc-[a-z0-9-]+/g;
  let m;
  while ((m = re.exec(cssText))) {
    if (!RESERVED_PROPS.has(m[0])) found.add(m[0]);
  }
  return Array.from(found);
}

/** Deterministic short, cryptic replacement names: --a, --b, ... --z, --aa, --ab, ... */
function shortName(index) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let n = index;
  let s = '';
  do {
    s = letters[n % 26] + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return '--rc-' + s;
}

function obfuscateTokens(cssText) {
  const tokens = collectTokens(cssText).sort((a, b) => b.length - a.length);
  const map = new Map();
  tokens.forEach((t, i) => map.set(t, shortName(i)));
  let out = cssText;
  // Longest-first avoids "--rc-acc" clobbering inside "--rc-acc2".
  for (const t of tokens) {
    const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![a-z0-9-])', 'g');
    out = out.replace(re, map.get(t));
  }
  return out;
}

async function main() {
  const rawCss = readFileSync(SRC_CSS, 'utf8');
  const obfuscatedCss = obfuscateTokens(rawCss);

  const minifiedCssResult = new CleanCSS({
    level: { 1: { specialComments: 0 }, 2: { all: true } }
  }).minify(obfuscatedCss);
  if (minifiedCssResult.errors.length) {
    throw new Error('CSS build failed: ' + minifiedCssResult.errors.join('; '));
  }
  const minifiedCss = minifiedCssResult.styles;

  writeFileSync(OUT_CSS, BANNER + '\n' + minifiedCss + '\n', 'utf8');
  console.log('Wrote', path.relative(root, OUT_CSS), `(${minifiedCss.length} bytes)`);

  const rawJs = readFileSync(SRC_JS, 'utf8');
  const cssForJs = JSON.stringify(minifiedCss);
  const combinedJs = rawJs.replace(
    /var CSS_TEXT = '';/,
    'var CSS_TEXT = ' + cssForJs + ';'
  );

  const terserResult = await minify(combinedJs, {
    compress: { passes: 2 },
    mangle: { toplevel: false, reserved: ['RcDesign'] },
    format: { comments: false }
  });
  if (!terserResult.code) throw new Error('Terser produced no output');

  const obfuscated = JavaScriptObfuscator.obfuscate(terserResult.code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.6,
    deadCodeInjection: false,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: false,
    debugProtection: false,
    numbersToExpressions: true,
    simplify: true,
    splitStrings: false,
    unicodeEscapeSequence: false
  });

  writeFileSync(OUT_JS, BANNER + '\n' + obfuscated.getObfuscatedCode() + '\n', 'utf8');
  console.log('Wrote', path.relative(root, OUT_JS), `(${obfuscated.getObfuscatedCode().length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
