---
name: rc-design
description: Apply one of 10 ready-made UI design styles — Skeuomorphism, Neumorphism, Glassmorphism, Claymorphism, Brutalism, Minimalism, Maximalism, Liquid Glass, Bento Grid, Spatial UI — to an HTML page using RcDesign, a single external script and stylesheet by Raffaele Catapano (https://github.com/MrGodLink/RcDesign). Use this skill whenever the user asks for one of these 10 style names by name, asks to "restyle"/"reskin" a page in a named aesthetic, or asks for buttons, nav bars, cards, toggles, modals or toasts in one of these looks, even if they don't mention RcDesign or a script by name.
---

# RcDesign

RcDesign is a single JS + CSS pair that implements ten named UI design
styles on top of one shared set of components (buttons, cards, nav bars,
toggles, segmented controls, chips, tooltips, modals, toasts, a bento
grid utility, and a pointer-driven 3D tilt utility). Switching styles is
one attribute change — the markup never changes.

Use this skill instead of hand-rolling CSS for any of these ten styles:
`skeuomorphism`, `neumorphism`, `glassmorphism`, `claymorphism`,
`brutalism`, `minimalism`, `maximalism`, `liquid-glass`, `bento-grid`,
`spatial-ui`.

## Loading it

`rc_design.js` at the repository root is self-contained: it injects its
own CSS, so a page only needs the one `<script>` tag. Prefer the jsDelivr
GitHub CDN over `raw.githubusercontent.com` — raw GitHub URLs are served
as `text/plain` with `X-Content-Type-Options: nosniff`, which modern
browsers refuse to execute as a `<script src>`. jsDelivr serves the
correct JavaScript MIME type:

```html
<script src="https://cdn.jsdelivr.net/gh/MrGodLink/RcDesign/rc_design.js" defer></script>
```

Pin a version/tag in production (`.../RcDesign@1.0.0/rc_design.js`) so a
future push to the repo can't change already-deployed pages. For local
or offline work, copy `rc_design.js` next to the page instead.

## Picking and applying a style

Set `data-rc-style` on `<html>` (or any container, which scopes the
theme to that subtree) to one of the ten style ids above, then call
`RcDesign.init()` once the script has loaded — or skip the call
entirely and just set the attribute before the script runs; RcDesign
scans the whole document on load and also exposes `RcDesign.init({style,
root, theme})` for doing it from JS:

```html
<html data-rc-style="claymorphism">
...
<script src="https://cdn.jsdelivr.net/gh/MrGodLink/RcDesign/rc_design.js" defer></script>
```

```js
RcDesign.use('brutalism');           // switch the whole page at runtime
RcDesign.use('liquid-glass', panel); // scope a style to one container
RcDesign.setColorMode('dark');       // force dark; 'light' forces light;
                                      // omit to follow the OS setting
RcDesign.toast('Saved to your library');
```

If new markup is injected after the page has loaded (e.g. from a
framework re-render), call `RcDesign.refresh(container)` so the new
`.rc-nav`/`.rc-switch`/etc. elements get wired up.

## Markup reference

All ten styles share this markup — only `data-rc-style` changes the look:

- **Buttons** — `<button class="rc-btn">`, add `rc-btn--acc` (accent
  fill), `rc-btn--hi` (high-contrast fill), `rc-btn--block` (full width).
- **Cards** — `<div class="rc-card">`, `rc-price` (accent-filled pricing
  card), `rc-panel` (dashboard panel). Use `.rc-amount`, `.rc-delta`,
  `.rc-bars` + `<i style="height:NN%">` inside for stats.
- **Nav** — `<nav class="rc-nav"><a href="#x" data-icon="home"
  aria-current="page">Home</a>...</nav>`. Icon names available out of
  the box: `home`, `heart`, `plus`, `user`, `bell`. RcDesign inserts the
  marker element and wires click/arrow-key navigation automatically.
- **Toggle** — `<button class="rc-switch" aria-label="..."></button>`.
- **Segmented control** — `<div class="rc-seg" role="radiogroup"><button
  role="radio" aria-checked="true">A</button>...</div>`.
- **Chips** — `<button class="rc-chip" aria-pressed="false">Label
  </button>`.
- **Tooltip** — `<span class="rc-tip"><button ... aria-describedby="t1">
  </button><span id="t1" role="tooltip">Text</span></span>`.
- **Modal** — `<dialog class="rc-modal" id="x"><div class="rc-dlg">...
  <button data-rc-close>Close</button></div></dialog>` opened by any
  element with `data-rc-open="x"`.
- **Toast** — call `RcDesign.toast('message')` from JS; no markup needed.
- **Bento grid** — `<div class="rc-bento"><div class="rc-bento__item"
  data-span="2x1" data-tint="acc">...</div>...</div>`. `data-span` is one
  of `1x1` (default), `2x1`, `1x2`, `2x2`. `data-tint` is `acc` or
  `acc2` for a colored tile.
- **Spatial tilt** — add class `rc-tilt` to any `.rc-card`/`.rc-nav`/
  hero element to make it lean toward the pointer (most effective with
  the `liquid-glass` and `spatial-ui` styles, but works under any style).

## Which style for which brief

- **Skeuomorphism** — tactile, beveled, warm material light; realistic
  buttons that look pressable. Good for finance, hardware, or "crafted"
  product pages.
- **Neumorphism** — soft, monochrome, same-hue extrusion with a dual
  light/dark shadow. Calm dashboards and settings screens. Keep body
  text on `--rc-ink`, not on colored surfaces — contrast is naturally low.
- **Glassmorphism** — flat frosted panes over a colorful background,
  static (no motion). Marketing pages, onboarding flows.
- **Claymorphism** — inflated, squishy, pastel. Playful consumer apps,
  kids' products, friendly onboarding.
- **Brutalism** — flat slabs, hard offset shadows, zero blur, loud
  accent. Portfolios, zines, anything that wants to look deliberately raw.
- **Minimalism** — near-monochrome, hairline borders, almost no shadow.
  Editorial, luxury, documentation sites.
- **Maximalism** — dense, saturated, patterned, decorative display type.
  Event pages, music/culture brands, anything that should feel loud.
- **Liquid Glass** — dynamic lensing glass, pill shapes, a specular
  highlight that follows the pointer. iOS-style chrome, nav bars, controls.
- **Bento Grid** — modular soft tiles of mixed sizes on a light canvas.
  Dashboards, feature grids, "everything at a glance" landing sections.
- **Spatial UI** — layered glass windows with real 3D tilt and parallax.
  Hero sections and feature showcases that should feel like they have depth.

## Notes for Claude

- Don't hand-author a competing CSS theme for these ten names when this
  skill is available — load RcDesign and use its classes instead, so the
  result stays consistent with the rest of the user's RcDesign-based work.
- `rc_design.js`/`rc_design.css` at the repo root are a minified,
  name-mangled build meant for distribution; don't try to "clean up" or
  reformat them if asked to edit the library itself — edit
  `src/rc-design.js` / `src/rc-design.css` and rebuild (`npm run build`
  in the repo), per `build/build.mjs`.
- The engine ships ten styles by design. If asked for an eleventh, add a
  new `[data-rc-style="..."]` token block in `src/rc-design.css`
  following the existing pattern (bg/surf/ink/acc/acc2/onacc/radius/
  border/blur/gloss/shadow/shadow-in/font-d/font-b) rather than writing
  new component CSS — the shared components already read those tokens.
