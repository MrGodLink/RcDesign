# RcDesign

**English** | [Italiano](./README.it.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [![Version](https://img.shields.io/badge/version-1.0.0-green)](#) [![Platform](https://img.shields.io/badge/platform-Browser%20%7C%20JS%20%2B%20CSS-blue)](#) [![GitHub stars](https://img.shields.io/github/stars/MrGodLink/RcDesign?style=social)](https://github.com/MrGodLink/RcDesign/stargazers)

**One engine, ten UI design styles, zero markup changes.** Skeuomorphism, Neumorphism, Glassmorphism, Claymorphism, Brutalism, Minimalism, Maximalism, Liquid Glass, Bento Grid and Spatial UI — switch the whole look of a page with one attribute.

---

## Overview

|                                       | Where                   | What it changes                                                      |
| ------------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| **Engine** (`rc_design.js` + `.css`) | Any HTML page             | The visual style of buttons, cards, nav, toggles, modals and toasts  |
| **Skill** (`skills/rc-design/`)      | Claude Code and claude.ai | Teaches Claude when and how to use RcDesign instead of writing new CSS |

## Features

- **Ten styles, one set of components** — buttons, cards, a nav bar, a
  toggle switch, a segmented control, chips, a tooltip, a modal, a toast,
  a bento grid layout and a pointer-driven 3D tilt effect, all built once.
- **One attribute to switch everything** — `data-rc-style="brutalism"`
  on `<html>` or on any container; the markup underneath never changes.
- **Self-contained** — `rc_design.js` injects its own stylesheet, so a
  page only needs a single `<script>` tag.
- **Dark mode included** — every style follows the visitor's OS setting,
  or can be forced with `RcDesign.setColorMode('dark' | 'light')`.
- **Accessible by default** — real `<dialog>`, `role`/`aria-*` on every
  control, keyboard navigation on nav bars and segmented controls, and
  `prefers-reduced-motion` turns off tilt/press/transition effects.
- **Distributed** — (see [How it works](#how-it-works)).

## Requirements

- Any current browser (Chrome, Edge, Firefox, Safari) — the engine uses
  `backdrop-filter`, CSS custom properties, `<dialog>` and
  `prefers-color-scheme`.
- To rebuild from source or run the test: Node.js 18+. Nothing is
  required to just use the library on a page.

## Installation

```
git clone https://github.com/MrGodLink/RcDesign.git
```

### 1. CDN, one script tag (recommended)

```html
<script src="https://cdn.jsdelivr.net/gh/MrGodLink/RcDesign/rc_design.js" defer></script>
```

Pin a version in production so a future push to this repo can't change a
page that already shipped:

```html
<script src="https://cdn.jsdelivr.net/gh/MrGodLink/RcDesign@1.0.0/rc_design.js" defer></script>
```

> **Why jsDelivr and not `raw.githubusercontent.com`?** GitHub serves raw
> files as `text/plain` with `X-Content-Type-Options: nosniff`, which
> every modern browser refuses to execute as a `<script src>`. jsDelivr's
> GitHub CDN serves the correct JavaScript content type and is the
> standard way to load a GitHub-hosted script in a browser. The raw
> GitHub URL still works for downloading the file or importing its
> source, just not as a browser `<script src>`.

### 2. Download and self-host

Copy `rc_design.js` (and `rc_design.css`, only if you set
`init({ inject:false })` and want to `<link>` it yourself) into your
project.

### 3. Claude Code plugin / skill

This repository is itself a Claude Code plugin: `.claude-plugin/plugin.json`
points to `skills/rc-design/SKILL.md`, which teaches Claude when and how
to reach for RcDesign — and which style fits which brief — instead of
hand-rolling new CSS for one of the ten looks above.

## Usage

```html
<html data-rc-style="claymorphism">
```

```js
RcDesign.styles;                     // the 10 valid style ids
RcDesign.use('liquid-glass');        // switch the whole page at runtime
RcDesign.use('spatial-ui', panel);   // or scope it to one container
RcDesign.setColorMode('dark');       // 'light' | 'dark' | omit for auto
RcDesign.toast('Saved to your library');
RcDesign.refresh(containerEl);       // wire up markup injected after load
```

| Style             | Look                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| `skeuomorphism`    | Tactile, beveled, warm material light — buttons that look pressable.        |
| `neumorphism`      | Soft, monochrome, same-hue extrusion with a dual light/dark shadow.         |
| `glassmorphism`    | Flat frosted panes over a colorful background, static.                      |
| `claymorphism`     | Inflated, squishy, pastel — controls squish when pressed.                   |
| `brutalism`        | Flat slabs, hard offset shadows, zero blur, loud accent.                    |
| `minimalism`       | Near-monochrome, hairline borders, almost no shadow.                        |
| `maximalism`       | Dense, saturated, patterned, decorative display type.                       |
| `liquid-glass`     | Dynamic lensing glass, pill shapes, a specular highlight that follows the pointer. |
| `bento-grid`       | Modular soft tiles of mixed sizes on a light canvas.                        |
| `spatial-ui`       | Layered glass windows with real 3D tilt and parallax.                       |

Component markup (buttons, nav, cards, toggle, segmented control, chips,
tooltip, modal, bento grid, tilt) is documented in full in
[`skills/rc-design/SKILL.md`](./skills/rc-design/SKILL.md).

### Customization

| What                                  | Where                                        |
| -------------------------------------- | ---------------------------------------------- |
| Design tokens for an existing style    | `src/rc-design.css`, the matching `[data-rc-style="…"]` block |
| Add an eleventh style                  | Same file — add a new token block, the shared component CSS already reads it |
| Icons available to `data-icon="…"`     | `ICONS` object in `src/rc-design.js`          |
| Build/obfuscation settings             | `build/build.mjs`                             |

## How it works

RcDesign is a **token engine**, not ten separate stylesheets. All ten
styles are the *same* structural CSS — the rules for `.rc-btn`, `.rc-card`,
`.rc-nav` and so on — reading the same set of ~20 custom properties
(`--rc-bg`, `--rc-surf`, `--rc-ink`, `--rc-acc`, `--rc-radius`,
`--rc-shadow`, `--rc-shadow-in`, `--rc-border`, `--rc-blur`, `--rc-gloss`,
`--rc-font-d`, `--rc-font-b`, …). A style is nothing more than one block
that sets those ~20 properties to different values under
`[data-rc-style="name"]` — that's the whole trick behind "one engine, ten
styles": `brutalism` sets a flat shadow and zero border-radius,
`claymorphism` sets a dual inset shadow and a large radius, `liquid-glass`
sets a blur and a pill radius, and the exact same `.rc-btn` renders as a
hard slab, a squishy blob or a frosted pill depending only on which block
is active.

At runtime, `rc_design.js`:

1. Injects its own `<style>` tag on first use (the CSS is embedded in the
   JS as a string, so one `<script>` tag is enough).
2. Sets `data-rc-style` on `<html>` (or the container you pass to `use()`),
   which is all the switching actually is — the browser's own cascade
   does the rest.
3. Scans the document once for `.rc-nav`, `.rc-seg`, `.rc-switch`,
   `.rc-chip`, `.rc-tilt` and `[data-rc-open]`/`[data-rc-close]`, and
   wires up click/keyboard behaviour and ARIA state on each — the nav's
   active-item marker is one small helper element whose position is
   driven by a `--rc-i` custom property set on click or arrow-key press.
   `RcDesign.refresh(root)` re-scans for anything added later.
4. `.rc-tilt` elements get `pointermove`/`pointerleave` listeners that set
   `--rc-rx`/`--rc-ry` (rotation angles) from the pointer position; the
   CSS turns those into a `perspective()`/`rotateX()`/`rotateY()`
   transform. This is the mechanic behind the `spatial-ui` and
   `liquid-glass` tilt effect, and it works under any style.

```
npm install
npm run build   # regenerate rc_design.js / rc_design.css from src/
npm test        # functional smoke test against the regenerated build
```

## Architecture

```
RcDesign/
├── rc_design.js            Distributed build — load this one file as a <script>.
├── rc_design.css           Distributed build — optional standalone stylesheet.
├── src/
│   ├── rc-design.js        Readable, maintained source.
│   └── rc-design.css       Readable, maintained source.
├── examples/
│   └── demo.html           All ten styles with a live switcher.
├── skills/
│   └── rc-design/
│       └── SKILL.md        Claude Code skill: when/how to use RcDesign.
├── .claude-plugin/
│   └── plugin.json         Plugin metadata (author, repo, skill location).
├── LICENSE
├── README.md
└── README.it.md
```

## Limitations

- `backdrop-filter`/blur-based styles (`glassmorphism`, `liquid-glass`,
  `spatial-ui`) fall back to a solid surface where the browser doesn't
  support it — the page still works, just without the frosted look.
- The pointer-tilt effect only reacts to `pointerType: "mouse"`; it is
  intentionally inert on touch, and disabled entirely under
  `prefers-reduced-motion`.
- The distributed `rc_design.js`/`.css` are a build output, not meant to
  be hand-edited — edit `src/` and run `npm run build`.
- Not extensively tested across every browser/OS combination: feedback
  and issues are welcome.

## Privacy and responsible use

- RcDesign makes no network requests of its own beyond loading the
  script/stylesheet itself: no analytics, no tracking, no calls home.
- This is an independent project, not affiliated with or endorsed by
  Anthropic, Apple, or any design movement it names stylistically.

## Credits

Created by **Raffaele Catapano** — [github.com/MrGodLink](https://github.com/MrGodLink)

If you reuse, modify or redistribute this project, please keep the
copyright notice and credit the original author, as required by the MIT
License.

Bug reports and ideas are welcome in the
[issue tracker](https://github.com/MrGodLink/RcDesign/issues).

## License

Released under the MIT License — see [LICENSE](./LICENSE).
