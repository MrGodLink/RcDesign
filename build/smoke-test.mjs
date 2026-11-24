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

// Regression check: loading the script must be enough on its own (the
// README promises "a page only needs a single <script> tag") — this
// must hold *before* any explicit RcDesign.init() call below.
assert(!!window.document.getElementById('rc-design-style'), 'stylesheet auto-injects on load, with no init() call');
assert(window.document.getElementById('rc-design-style').textContent.length > 1000, 'auto-injected stylesheet is non-trivial');
assert(window.document.documentElement.hasAttribute('data-rc-style'), 'a default style is auto-applied on load, with no init() call');

assert(typeof RcDesign === 'object', 'window.RcDesign is exposed');
assert(RcDesign.author === 'Raffaele Catapano', 'author metadata present');
assert(RcDesign.github === 'https://github.com/MrGodLink', 'github metadata present');
assert(Array.isArray(RcDesign.styles) && RcDesign.styles.length === 10, 'exactly 10 styles: ' + RcDesign.styles.join(','));

RcDesign.init({ style: 'claymorphism' });
assert(window.document.documentElement.getAttribute('data-rc-style') === 'claymorphism', 'init() sets data-rc-style');
assert(window.document.getElementById('rc-design-style').textContent.length > 1000, 'stylesheet was injected and is non-trivial');

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

const sw = window.document.querySelector('.rc-switch');
sw.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
assert(sw.getAttribute('aria-checked') === 'true', 'toggle switch flips on click');

const chip = window.document.querySelector('.rc-chip');
chip.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
assert(chip.getAttribute('aria-pressed') === 'true', 'chip toggles pressed state on click');

const opener = window.document.querySelector('[data-rc-open]');
opener.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
assert(window.document.getElementById('m1').hasAttribute('open'), 'modal trigger opens the dialog');

RcDesign.toast('hello from the smoke test');
assert(window.document.querySelector('.rc-toast').textContent === 'hello from the smoke test', 'toast() renders a message');

console.log('\nAll smoke tests passed.');
