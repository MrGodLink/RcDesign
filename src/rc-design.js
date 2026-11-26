/*!
 * RcDesign — a single-file engine for 10 UI design styles:
 * Skeuomorphism, Neumorphism, Glassmorphism, Claymorphism, Brutalism,
 * Minimalism, Maximalism, Liquid Glass, Bento Grid, Spatial UI.
 *
 * Author: Raffaele Catapano — https://github.com/MrGodLink
 * Repository: https://github.com/MrGodLink/RcDesign
 * License: MIT — see LICENSE in the repository root.
 *
 * This file is the MAINTAINED source. The file shipped for consumption
 * (rc_design.js at the repo root, loadable as an external <script>) is a
 * minified/obfuscated build of this source, produced by build/build.mjs.
 * Edit here, then run `npm run build` to regenerate the distributed file.
 */
(function (global) {
  'use strict';

  var VERSION = '1.1.0';

  var STYLES = [
    'skeuomorphism', 'neumorphism', 'glassmorphism', 'claymorphism',
    'brutalism', 'minimalism', 'maximalism', 'liquid-glass',
    'bento-grid', 'spatial-ui'
  ];

  var ICONS = {
    home: 'M3 11l9-8 9 8M5 10v10h14V10',
    heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
    plus: 'M12 5v14M5 12h14',
    user: 'M12 8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20a7 7 0 0 1 14 0',
    bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0'
  };

  var styleInjected = false;
  var tiltBound = [];

  /* Replaced by build/build.mjs with the minified contents of
     rc-design.css, so the distributed rc_design.js works standalone
     as a single external <script>. Empty in this readable source —
     link src/rc-design.css by hand while developing against src/. */
  var CSS_TEXT = '';

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function iconMarkup(name) {
    var d = ICONS[name];
    if (!d) return '';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>';
  }

  function injectStyle() {
    if (styleInjected) return;
    if (!CSS_TEXT) { styleInjected = true; return; }
    if (document.getElementById('rc-design-style')) { styleInjected = true; return; }
    var tag = document.createElement('style');
    tag.id = 'rc-design-style';
    tag.textContent = CSS_TEXT;
    document.head.appendChild(tag);
    styleInjected = true;
  }

  function isValidStyle(name) {
    return STYLES.indexOf(name) !== -1;
  }

  function use(name, root) {
    if (!isValidStyle(name)) {
      throw new Error('RcDesign: unknown style "' + name + '". Valid styles: ' + STYLES.join(', '));
    }
    var el = root || document.documentElement;
    el.setAttribute('data-rc-style', name);
    return el;
  }

  function setColorMode(mode, root) {
    var el = root || document.documentElement;
    if (mode === 'light' || mode === 'dark') el.setAttribute('data-theme', mode);
    else el.removeAttribute('data-theme');
    return el;
  }

  /* ---- nav: active marker + keyboard roving focus ------------------- */

  function setupNav(nav) {
    if (nav.__rcReady) return;
    nav.__rcReady = true;
    var links = qsa('a', nav);
    links.forEach(function (a) {
      if (!a.querySelector('svg') && a.dataset.icon) {
        a.insertAdjacentHTML('afterbegin', iconMarkup(a.dataset.icon));
      }
    });
    var mark = document.createElement('div');
    mark.className = 'rc-nav__mark';
    nav.insertBefore(mark, nav.firstChild);

    function activate(index) {
      links.forEach(function (a, i) {
        if (i === index) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
      nav.style.setProperty('--rc-i', String(index));
    }

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        activate(i);
      });
      a.addEventListener('keydown', function (e) {
        var delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!delta) return;
        e.preventDefault();
        var next = (i + delta + links.length) % links.length;
        links[next].focus();
      });
    });

    var startIndex = links.findIndex(function (a) { return a.hasAttribute('aria-current'); });
    activate(startIndex === -1 ? 0 : startIndex);
  }

  /* ---- segmented control --------------------------------------------- */

  function setupSeg(seg) {
    if (seg.__rcReady) return;
    seg.__rcReady = true;
    var buttons = qsa('button', seg);
    function pick(target) {
      buttons.forEach(function (b) {
        var on = b === target;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      target.focus();
    }
    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b); });
      b.addEventListener('keydown', function (e) {
        var delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!delta) return;
        e.preventDefault();
        pick(buttons[(i + delta + buttons.length) % buttons.length]);
      });
    });
  }

  /* ---- toggle switch & chips ------------------------------------------ */

  function setupSwitch(sw) {
    if (sw.__rcReady) return;
    sw.__rcReady = true;
    if (!sw.hasAttribute('role')) sw.setAttribute('role', 'switch');
    if (!sw.hasAttribute('aria-checked')) sw.setAttribute('aria-checked', 'false');
    if (!sw.querySelector('i')) sw.appendChild(document.createElement('i'));
    sw.addEventListener('click', function () {
      sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') !== 'true');
    });
  }

  function setupChip(chip) {
    if (chip.__rcReady) return;
    chip.__rcReady = true;
    if (!chip.hasAttribute('aria-pressed')) chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', function () {
      chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') !== 'true');
    });
  }

  /* ---- modal ------------------------------------------------------------ */

  function setupModalTriggers(root) {
    qsa('[data-rc-open]', root).forEach(function (btn) {
      if (btn.__rcReady) return;
      btn.__rcReady = true;
      btn.addEventListener('click', function () {
        var dlg = document.getElementById(btn.getAttribute('data-rc-open'));
        if (dlg && dlg.showModal) dlg.showModal();
      });
    });
    qsa('dialog.rc-modal', root).forEach(function (dlg) {
      if (dlg.__rcReady) return;
      dlg.__rcReady = true;
      qsa('[data-rc-close]', dlg).forEach(function (b) {
        b.addEventListener('click', function () { dlg.close(); });
      });
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg) dlg.close();
      });
    });
  }

  /* ---- toast -------------------------------------------------------------- */

  function toast(text, opts) {
    opts = opts || {};
    var holder = document.getElementById('rc-toasts');
    if (!holder) {
      holder = document.createElement('div');
      holder.id = 'rc-toasts';
      holder.setAttribute('role', 'status');
      holder.setAttribute('aria-live', 'polite');
      document.body.appendChild(holder);
    }
    var el = document.createElement('div');
    el.className = 'rc-toast';
    el.textContent = text;
    holder.appendChild(el);
    var ms = opts.duration || 2800;
    setTimeout(function () { el.remove(); }, ms);
    return el;
  }

  /* ---- spatial tilt (pointer-driven 3D) ------------------------------------ */

  function setupTilt(el) {
    if (el.__rcReady || tiltBound.indexOf(el) !== -1) return;
    el.__rcReady = true;
    tiltBound.push(el);
    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rc-ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
      el.style.setProperty('--rc-rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', function () {
      el.style.removeProperty('--rc-rx');
      el.style.removeProperty('--rc-ry');
    });
  }

  /* ---- scan / refresh: wire up any matching elements in `root` -------------- */

  function refresh(root) {
    qsa('.rc-nav', root).forEach(setupNav);
    qsa('.rc-seg', root).forEach(setupSeg);
    qsa('.rc-switch', root).forEach(setupSwitch);
    qsa('.rc-chip', root).forEach(setupChip);
    qsa('.rc-tilt', root).forEach(setupTilt);
    setupModalTriggers(root);
  }

  /* ---- public init ------------------------------------------------------------ */

  function init(opts) {
    opts = opts || {};
    if (opts.inject !== false) injectStyle();
    var root = opts.root || document.documentElement;
    if (opts.style) use(opts.style, root);
    else if (!root.hasAttribute('data-rc-style')) use(STYLES[0], root);
    if (opts.theme) setColorMode(opts.theme, root);
    refresh(document);
    return global.RcDesign;
  }

  var RcDesign = {
    version: VERSION,
    styles: STYLES.slice(),
    author: 'Raffaele Catapano',
    github: 'https://github.com/MrGodLink',
    repository: 'https://github.com/MrGodLink/RcDesign',
    init: init,
    use: use,
    setColorMode: setColorMode,
    refresh: refresh,
    toast: toast
  };

  global.RcDesign = RcDesign;

  /* Loading the script is meant to be enough on its own (see README:
     "a page only needs a single <script> tag") — inject the stylesheet
     and apply a default style immediately, before any explicit init()
     call. init()/use() remain how a page picks a *specific* style,
     scopes it to a container, or re-scans after injecting new markup. */
  function autoStart() {
    injectStyle();
    if (!document.documentElement.hasAttribute('data-rc-style')) {
      use(STYLES[0], document.documentElement);
    }
    refresh(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoStart);
  } else {
    autoStart();
  }

}(typeof window !== 'undefined' ? window : this));
