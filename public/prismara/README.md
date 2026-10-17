# Prismara — Lagoon Adventures

A standalone, multi-file educational game inspired by Atollingo’s ink, teal, mint, coral, and sand palette. Original island illustration; no Atollingo artwork is copied.

Run `npm start` in this folder, then visit http://127.0.0.1:4187. You can also open `index.html` directly. No build or installation is needed. The game bundles its Tailwind runtime and Font Awesome solid icons; gameplay makes no external requests.

## Play

Explore four islands with three missions each. Finish repeating sequences, combine shape and outline cycles, and find the least common multiple of lantern pulses. Collect 12 shards to unlock four lighthouse challenges. Each normal mission awards up to three stars based on hints used. Missions unlock sequentially within each island; completed missions can be replayed. Age selection is an explorer preference, not a different puzzle set.

Use the animated signal simulator or manually scrub its timeline. The pocket field guide explains each mechanic. Shape labels complement colors; all answers work by click, touch, or keyboard. Menu settings include read-aloud, reduced motion, and high contrast. The OS reduced-motion preference is also respected.

Every screen fits the viewport without page or panel scrolling. Compact layouts adapt the hub and signal timelines; the complete puzzle or dialog scales down when needed so its controls remain visible. This also responds to viewport resizing and the mobile visual viewport.

Progress, lighthouse channels, achievements, and preferences save in this browser. Reset removes only Prismara’s own keys. This standalone prototype does not sync with Atollingo student accounts.

## Files

- `index.html`: shell and accessible helper controls
- `js/missions.js`: 16 stage definitions and achievement data
- `js/game.js`: puzzle validation, progression, feedback, dashboard
- `js/lagoon.js`: coastal hub, timeline visualization, accessibility and persistence improvements
- `js/audio.js`: synthesized sounds and optional speech
- `css/`: base animation styles, coastal theme, local icon styles
- `js/viewport.js` and `css/viewport.css`: responsive, scroll-free screen fitting
- `assets/lagoon.svg`: original island map
- `webfonts/`: Font Awesome solid font
- `tests/verify.cjs`: browser flow verification; requires Playwright and an installed Chromium browser
- `tests/viewport.cjs`: all-screen viewport checks, including portrait and landscape phones

Third-party runtime: Tailwind CSS 3.4.17 (MIT). Icons: Font Awesome Free 6.4.0 (font SIL OFL 1.1, code MIT). See https://tailwindcss.com and https://fontawesome.com/license/free.

GitHub placement: `public/prismara/` in OceanHub; served at `/prismara/index.html` by the existing static asset pipeline. No Cloudflare configuration or account integration changes are required.
