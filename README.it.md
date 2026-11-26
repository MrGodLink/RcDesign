# RcDesign

[English](./README.md) | **Italiano**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [![Version](https://img.shields.io/badge/version-1.1.0-green)](#) [![Platform](https://img.shields.io/badge/platform-Browser%20%7C%20JS%20%2B%20CSS-blue)](#) [![GitHub stars](https://img.shields.io/github/stars/MrGodLink/RcDesign?style=social)](https://github.com/MrGodLink/RcDesign/stargazers) [![Claude Skill](https://img.shields.io/badge/Claude-Skill-d97757)](#) [![AI Agent](https://img.shields.io/badge/AI-Agent-purple)](#)

**Un motore solo, dieci stili di design UI, zero modifiche al markup.** Skeuomorphism, Neumorphism, Glassmorphism, Claymorphism, Brutalism, Minimalism, Maximalism, Liquid Glass, Bento Grid e Spatial UI — cambi l'aspetto di tutta la pagina con un solo attributo.

**[▶ Demo live](https://mrgodlink.github.io/RcDesign/)** — tutti e dieci gli stili, da provare subito nel browser. Nessuna installazione.

---

## Panoramica

|                                       | Dove                      | Cosa cambia                                                          |
| ------------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| **Motore** (`rc_design.js` + `.css`) | Qualsiasi pagina HTML        | Lo stile visivo di bottoni, card, nav, toggle, modali e toast         |
| **Skill** (`skills/rc-design/`)      | Claude Code e claude.ai      | Insegna a Claude quando e come usare RcDesign invece di scrivere nuovo CSS |

## Caratteristiche

- **Dieci stili, un solo set di componenti** — bottoni, card, una nav
  bar, un toggle, un segmented control, chip, un tooltip, un modale, un
  toast, un layout a bento grid e un effetto di inclinazione 3D guidato
  dal puntatore: tutto costruito una volta sola.
- **Un attributo per cambiare tutto** — `data-rc-style="brutalism"` su
  `<html>` o su qualsiasi contenitore; il markup sottostante non cambia mai.
- **Autonomo** — `rc_design.js` inietta da solo il proprio foglio di
  stile, quindi alla pagina basta un unico `<script>`.
- **Dark mode inclusa** — ogni stile segue l'impostazione del sistema
  operativo di chi visita la pagina, oppure si può forzare con
  `RcDesign.setColorMode('dark' | 'light')`.
- **Accessibile di default** — `<dialog>` nativo, `role`/`aria-*` su ogni
  controllo, navigazione da tastiera su nav bar e segmented control, e
  `prefers-reduced-motion` disattiva gli effetti di inclinazione,
  pressione e transizione.
- **Distribuito** — (vedi [Come funziona](#come-funziona)).

## Requisiti

- Qualsiasi browser recente (Chrome, Edge, Firefox, Safari) — il motore
  usa `backdrop-filter`, custom property CSS, `<dialog>` e
  `prefers-color-scheme`.
- Per ricompilare dal sorgente o lanciare il test: Node.js 18+. Per usare
  la libreria su una pagina non serve nient'altro.

## Installazione

```
git clone https://github.com/MrGodLink/RcDesign.git
```

### 1. CDN, un solo script (consigliato)

```html
<script src="https://cdn.jsdelivr.net/gh/MrGodLink/RcDesign/rc_design.js" defer></script>
```

In produzione blocca una versione, così un push futuro su questo
repository non cambia una pagina già pubblicata:

```html
<script src="https://cdn.jsdelivr.net/gh/MrGodLink/RcDesign@1.1.0/rc_design.js" defer></script>
```

> **Perché jsDelivr e non `raw.githubusercontent.com`?** GitHub serve i
> file raw come `text/plain` con `X-Content-Type-Options: nosniff`, e
> ogni browser moderno rifiuta di eseguirli come `<script src>`. La CDN
> GitHub di jsDelivr serve il content-type JavaScript corretto ed è il
> modo standard per caricare in un browser uno script ospitato su
> GitHub. L'URL raw di GitHub resta comunque valido per scaricare il
> file o importarne il sorgente, solo non come `<script src>`.

### 2. Download e hosting in proprio

Copia `rc_design.js` (e `rc_design.css`, solo se imposti
`init({ inject:false })` e vuoi collegarlo tu con `<link>`) nel tuo
progetto.

### 3. Plugin / skill per Claude Code

Questo repository è esso stesso un plugin per Claude Code:
`.claude-plugin/plugin.json` punta a `skills/rc-design/SKILL.md`, che
insegna a Claude quando e come ricorrere a RcDesign — e quale stile si
adatta a quale richiesta — invece di scrivere da zero nuovo CSS per uno
dei dieci stili sopra.

## Utilizzo

```html
<html data-rc-style="claymorphism">
```

```js
RcDesign.styles;                     // i 10 id di stile validi
RcDesign.use('liquid-glass');        // cambia stile a tutta la pagina
RcDesign.use('spatial-ui', panel);   // oppure limitalo a un contenitore
RcDesign.setColorMode('dark');       // 'light' | 'dark' | ometti per automatico
RcDesign.toast('Salvato nella tua libreria');
RcDesign.refresh(containerEl);       // ricollega il markup aggiunto dopo il caricamento
```

| Stile              | Aspetto                                                                     |
| ------------------- | ------------------------------------------------------------------------------ |
| `skeuomorphism`     | Tattile, smussato, luce calda da materiale reale — bottoni che sembrano premibili. |
| `neumorphism`       | Morbido, monocromatico, estrusione dello stesso colore con doppia ombra chiara/scura. |
| `glassmorphism`     | Pannelli piatti smerigliati su uno sfondo colorato, statici.                 |
| `claymorphism`      | Gonfio, morbido, pastello — i controlli si schiacciano quando premuti.      |
| `brutalism`         | Lastre piatte, ombre nette e sfalsate, zero sfocatura, colore acceso.       |
| `minimalism`        | Quasi monocromatico, bordi sottilissimi, ombra quasi assente.               |
| `maximalism`        | Denso, saturo, decorato, carattere display vistoso.                         |
| `liquid-glass`      | Vetro dinamico che devia la luce, forme a pillola, un riflesso che segue il puntatore. |
| `bento-grid`        | Riquadri morbidi e modulari di dimensioni miste su una tela chiara.         |
| `spatial-ui`        | Finestre di vetro sovrapposte con vera profondità 3D e parallasse.          |

Il markup dei componenti (bottoni, nav, card, toggle, segmented control,
chip, tooltip, modale, bento grid, tilt) è documentato per intero in
[`skills/rc-design/SKILL.md`](./skills/rc-design/SKILL.md) (in inglese).

### Personalizzazione

| Cosa                                      | Dove                                              |
| ------------------------------------------- | ---------------------------------------------------- |
| Token di design di uno stile esistente      | `src/rc-design.css`, il blocco `[data-rc-style="…"]` corrispondente |
| Aggiungere un undicesimo stile              | Stesso file — aggiungi un nuovo blocco di token, il CSS condiviso dei componenti lo legge già |
| Icone disponibili per `data-icon="…"`       | Oggetto `ICONS` in `src/rc-design.js`                |
| Impostazioni di build/offuscamento          | `build/build.mjs`                                    |

## Usalo con l'AI

RcDesign dà a un assistente AI un vocabolario di design già pronto: le pagine generate non si assomigliano più tutte e non devi chiedere CSS personalizzato ogni volta. Incolla questo prompt in Claude, ChatGPT, Cursor o in qualsiasi assistente di programmazione e sostituisci le parti tra parentesi quadre:

```text
Crea una pagina web responsive per [descrivi il tuo progetto].

Usa RcDesign per TUTTI i componenti UI: non scrivere CSS personalizzato per
pulsanti, card, navigazione, toggle, modali o toast.

1. Caricalo con un solo tag nel <head>:
   <script src="https://cdn.jsdelivr.net/gh/MrGodLink/RcDesign/rc_design.js" defer></script>
2. Imposta lo stile su <html>, ad esempio <html data-rc-style="[stile]">.
   Stili validi: skeuomorphism, neumorphism, glassmorphism, claymorphism, brutalism, minimalism, maximalism, liquid-glass, bento-grid, spatial-ui.
3. Usa queste classi: rc-btn (+ rc-btn--acc, rc-btn--hi, rc-btn--block),
   rc-card, rc-nav, rc-switch, rc-seg, rc-chip, rc-tip, rc-modal,
   rc-bento / rc-bento__item (data-span="1x1|2x1|1x2|2x2"), rc-tilt.
4. Mostra i messaggi con RcDesign.toast('testo'). Cambia stile a runtime
   con RcDesign.use('id-stile').
5. Riferimento: https://github.com/MrGodLink/RcDesign
```

Consiglio: chiedi la stessa pagina in più stili ("ora rendila in `brutalism`"): cambia solo il valore di `data-rc-style`, il markup resta identico.

**Claude Code / claude.ai:** questo repository è anche una skill (`skills/rc-design/`), quindi Claude può scegliere RcDesign da solo quando chiedi uno dei dieci stili per nome.

## Come funziona

RcDesign è un **motore a token**, non dieci fogli di stile separati.
Tutti e dieci gli stili sono lo *stesso* CSS strutturale — le regole per
`.rc-btn`, `.rc-card`, `.rc-nav` e così via — che legge lo stesso insieme
di circa 20 custom property (`--rc-bg`, `--rc-surf`, `--rc-ink`,
`--rc-acc`, `--rc-radius`, `--rc-shadow`, `--rc-shadow-in`,
`--rc-border`, `--rc-blur`, `--rc-gloss`, `--rc-font-d`, `--rc-font-b`,
…). Uno stile non è altro che un blocco che imposta quelle ~20 proprietà
a valori diversi sotto `[data-rc-style="nome"]` — questo è tutto il
trucco dietro "un motore, dieci stili": `brutalism` imposta un'ombra
piatta e raggio zero, `claymorphism` imposta una doppia ombra interna e
un raggio grande, `liquid-glass` imposta una sfocatura e un raggio a
pillola, e lo stesso identico `.rc-btn` diventa una lastra dura, una
pallina gommosa o una pillola smerigliata solo in base a quale blocco è
attivo.

A runtime, `rc_design.js`:

1. Inietta un proprio tag `<style>` al primo utilizzo (il CSS è incluso
   nel JS come stringa, quindi basta un `<script>`).
2. Imposta `data-rc-style` su `<html>` (o sul contenitore passato a
   `use()`) — è tutto ciò che il cambio di stile fa davvero: il resto lo
   fa la cascata del browser.
3. Scansiona il documento una volta alla ricerca di `.rc-nav`, `.rc-seg`,
   `.rc-switch`, `.rc-chip`, `.rc-tilt` e `[data-rc-open]`/
   `[data-rc-close]`, collegando click, tastiera e stato ARIA su
   ciascuno — il marcatore dell'elemento attivo nella nav è un piccolo
   elemento la cui posizione è guidata da una custom property `--rc-i`
   impostata al click o con le frecce. `RcDesign.refresh(root)` scansiona
   di nuovo ciò che è stato aggiunto in seguito.
4. Gli elementi `.rc-tilt` ricevono listener `pointermove`/`pointerleave`
   che impostano `--rc-rx`/`--rc-ry` (angoli di rotazione) dalla
   posizione del puntatore; il CSS li trasforma in un
   `perspective()`/`rotateX()`/`rotateY()`. È il meccanismo dietro
   l'inclinazione di `spatial-ui` e `liquid-glass`, e funziona sotto
   qualsiasi stile.


```
npm install
npm run build   # rigenera rc_design.js / rc_design.css da src/
npm test        # test funzionale sulla build rigenerata
```

## Struttura

```
RcDesign/
├── rc_design.js            Build distribuita — carica questo file come <script>.
├── rc_design.css           Build distribuita — foglio di stile autonomo opzionale.
├── src/
│   ├── rc-design.js        Sorgente leggibile e mantenuto.
│   └── rc-design.css       Sorgente leggibile e mantenuto.
├── examples/
│   └── demo.html           Tutti e dieci gli stili con uno switcher dal vivo.
├── skills/
│   └── rc-design/
│       └── SKILL.md        Skill per Claude Code: quando/come usare RcDesign.
├── .claude-plugin/
│   └── plugin.json         Metadata del plugin (autore, repo, posizione della skill).
├── LICENSE
├── README.md
└── README.it.md
```

## Limiti

- Gli stili basati su `backdrop-filter`/sfocatura (`glassmorphism`,
  `liquid-glass`, `spatial-ui`) ripiegano su una superficie piena dove il
  browser non lo supporta — la pagina funziona comunque, solo senza
  l'effetto smerigliato.
- L'effetto di inclinazione reagisce solo a `pointerType: "mouse"`; è
  intenzionalmente inerte al tocco, e del tutto disattivato con
  `prefers-reduced-motion`.
- `rc_design.js`/`.css` distribuiti sono un output di build, non vanno
  modificati a mano — modifica `src/` ed esegui `npm run build`.
- Non testato in modo estensivo su ogni combinazione di browser/sistema
  operativo: segnalazioni e issue sono benvenute.

## Privacy e uso responsabile

- RcDesign non fa richieste di rete proprie oltre al caricamento dello
  script/foglio di stile stesso: nessuna analytics, nessun tracciamento,
  nessuna chiamata esterna.
- È un progetto indipendente, non affiliato né approvato da Anthropic,
  Apple, o da alcuno dei movimenti di design che cita come stile.

## Crediti

Creato da **Raffaele Catapano** — [github.com/MrGodLink](https://github.com/MrGodLink)

Se riutilizzi, modifichi o ridistribuisci questo progetto, mantieni
l'avviso di copyright e cita l'autore originale, come richiesto dalla
licenza MIT.

Segnalazioni di bug e idee sono benvenute nell'
[issue tracker](https://github.com/MrGodLink/RcDesign/issues).

## Licenza

Rilasciato con licenza MIT — vedi [LICENSE](./LICENSE).
