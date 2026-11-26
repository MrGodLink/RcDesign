import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html = `<!doctype html><html><body>
  <nav class="rc-nav"><a href="#a" data-icon="home" aria-current="page">Home</a><a href="#b" data-icon="heart">Likes</a></nav>
  <button class="rc-switch" aria-label="Notif"></button>
  <div class="rc-seg"><button role="radio" aria-checked="true">A</button><button role="radio" aria-checked="false">B</button></div>
  <button class="rc-chip" aria-pressed="false">Chip</button>
  <button data-rc-open="m1">Open</button>
  <dialog class="rc-modal" id="m1"><div class="rc-dlg"><button data-rc-close>Close</button></div></dialog>
</body></html>`;

const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;

// dialog.showModal() isn't implemented in jsdom; stub it so init()/triggers don't throw.
window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
window.matchMedia = window.matchMedia || function () { return { matches: false }; };

const code = readFileSync(new URL('../rc_design.js', import.meta.url), 'utf8');
window.eval(code);

const RcDesign = window.RcDesign;
const assert = (cond, msg) => { if (!cond) throw new Error('FAIL: ' + msg); console.log('OK  ', msg); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  // Regression check: loading the script must be enough on its own (the
  // README promises "a page only needs a single <script> tag") — this
  // must hold *before* any explicit RcDesign.init() call below.
  assert(!!window.document.getElementById('rc-design-style'), 'stylesheet auto-injects on load, with no init() call');
  assert(window.document.getElementById('rc-design-style').textContent.length > 1000, 'auto-injected stylesheet is non-trivial');
  assert(window.document.documentElement.hasAttribute('data-rc-style'), 'a default style is auto-applied on load, with no init() call');
  assert(window.document.documentElement.getAttribute('data-rc-style') === 'skeuomorphism', 'default auto-applied style is the first one (skeuomorphism)');
  assert(RcDesign.version === '1.1.0', 'version metadata is 1.1.0');

  assert(typeof RcDesign === 'object', 'window.RcDesign is exposed');
  assert(RcDesign.author === 'Raffaele Catapano', 'author metadata present');
  assert(RcDesign.github === 'https://github.com/MrGodLink', 'github metadata present');
  assert(Array.isArray(RcDesign.styles) && RcDesign.styles.length === 10, 'exactly 10 styles: ' + RcDesign.styles.join(','));

  // The distributed file must keep the real token names (no renaming):
  // --rc-radius is the public customization surface documented in the README.
  assert(/--rc-radius:/.test(window.document.getElementById('rc-design-style').textContent), 'distributed CSS keeps the public --rc-radius token (no renaming)');

  RcDesign.init({ style: 'claymorphism' });
  assert(window.document.documentElement.getAttribute('data-rc-style') === 'claymorphism', 'init() sets data-rc-style');
  assert(window.document.getElementById('rc-design-style').textContent.length > 1000, 'stylesheet was injected and is non-trivial');

  // init() is idempotent: re-running it must not create a second <style> tag.
  const stylesBefore = window.document.querySelectorAll('style#rc-design-style').length;
  RcDesign.init({ style: 'minimalism' });
  const stylesAfter = window.document.querySelectorAll('style#rc-design-style').length;
  assert(stylesBefore === 1 && stylesAfter === 1, 'init() is idempotent — no duplicate style tags');

  RcDesign.use('brutalism');
  assert(window.document.documentElement.getAttribute('data-rc-style') === 'brutalism', 'use() switches style');

  try { RcDesign.use('not-a-style'); assert(false, 'should have thrown'); }
  catch (e) { assert(/unknown style/.test(e.message), 'use() rejects an invalid style name'); }

  const nav = window.document.querySelector('.rc-nav');
  assert(nav.querySelector('.rc-nav__mark'), 'nav marker element was inserted');
  assert(nav.querySelectorAll('svg').length === 2, 'nav icons were inserted');
  const links = nav.querySelectorAll('a');
  links[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(links[1].getAttribute('aria-current') === 'page', 'clicking a nav link activates it');
  assert(!links[0].hasAttribute('aria-current'), 'clicking a nav link deactivates the previous one');
  assert(nav.style.getPropertyValue('--rc-i') === '1', 'nav marker --rc-i tracks the active index');

  // Keyboard roving focus on the nav: ArrowRight on the first link focuses the second.
  links[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true })); // back to index 0
  links[0].focus();
  links[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert(window.document.activeElement === links[1], 'ArrowRight on the first nav link moves focus to the second');

  const sw = window.document.querySelector('.rc-switch');
  sw.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(sw.getAttribute('aria-checked') === 'true', 'toggle switch flips on click');

  const chip = window.document.querySelector('.rc-chip');
  chip.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(chip.getAttribute('aria-pressed') === 'true', 'chip toggles pressed state on click');

  // Segmented control: click selects, ArrowRight moves selection right (keyboard).
  const seg = window.document.querySelector('.rc-seg');
  const segBtns = seg.querySelectorAll('button');
  segBtns[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(segBtns[0].getAttribute('aria-checked') === 'true', 'seg click selects the first button');
  segBtns[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert(segBtns[1].getAttribute('aria-checked') === 'true', 'ArrowRight on the seg moves selection right');

  const opener = window.document.querySelector('[data-rc-open]');
  opener.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(window.document.getElementById('m1').hasAttribute('open'), 'modal trigger opens the dialog');

  RcDesign.toast('hello from the smoke test');
  assert(window.document.querySelector('.rc-toast').textContent === 'hello from the smoke test', 'toast() renders a message');

  // Toast removes itself after its duration (fade is skipped because matchMedia
  // is stubbed to {matches:false}, so the --out path runs and removes after 220ms).
  const t = RcDesign.toast('bye', { duration: 10 });
  assert(window.document.body.contains(t), 'toast is in the DOM right after creation');
  await sleep(400);
  assert(!window.document.body.contains(t), 'toast removes itself after its duration');

  // setColorMode is a document-level API: it always targets documentElement.
  RcDesign.setColorMode('dark');
  assert(window.document.documentElement.getAttribute('data-theme') === 'dark', 'setColorMode("dark") sets data-theme=dark on the document');
  RcDesign.setColorMode('light');
  assert(window.document.documentElement.getAttribute('data-theme') === 'light', 'setColorMode("light") sets data-theme=light');
  RcDesign.setColorMode('auto');
  assert(!window.document.documentElement.hasAttribute('data-theme'), 'setColorMode with a non light/dark value clears data-theme (auto)');

  // refresh() wires up markup injected after init.
  const laterChip = window.document.createElement('div');
  laterChip.className = 'rc-chip';
  window.document.body.appendChild(laterChip);
  RcDesign.refresh(window.document);
  laterChip.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(laterChip.getAttribute('aria-pressed') === 'true', 'refresh() wires up markup added after init');

  // Tilt: pointermove drives --rc-rx/--rc-ry AND the specular --rc-mx/--rc-my.
  const tilt = window.document.createElement('div');
  tilt.className = 'rc-tilt';
  window.document.body.appendChild(tilt);
  tilt.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100 }; };
  RcDesign.refresh(window.document);
  const pmove = new window.MouseEvent('pointermove', { bubbles: true, clientX: 75, clientY: 25 });
  pmove.pointerType = 'mouse';
  tilt.dispatchEvent(pmove);
  assert(tilt.style.getPropertyValue('--rc-rx') !== '', 'tilt sets --rc-rx from the pointer position');
  assert(tilt.style.getPropertyValue('--rc-mx') !== '', 'tilt sets --rc-mx so the specular highlight follows the pointer');
  assert(tilt.style.getPropertyValue('--rc-mx') === '75.0%', 'tilt --rc-mx is the pointer x as a percentage');
  tilt.dispatchEvent(new window.MouseEvent('pointerleave', { bubbles: true }));
  assert(tilt.style.getPropertyValue('--rc-mx') === '', 'tilt clears --rc-mx on pointerleave');

  console.log('\nAll smoke tests passed.');
}

main().catch((err) => { console.error(err); process.exit(1); });
