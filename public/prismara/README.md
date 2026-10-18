# Prismara — Lagoon Adventures

A standalone, multi-file educational game inspired by Atollingo’s ink, teal, mint, coral, and sand palette. Original island illustration; no Atollingo artwork is copied.

Run `npm start` in this folder, then visit http://127.0.0.1:4187. You can also open `index.html` directly. No build or installation is needed. The game bundles its Tailwind runtime and Font Awesome solid icons; gameplay makes no external requests.

## Play

Explore four islands with 12 levels each. Every level contains five freshly generated puzzles, for 240 island questions. Solve shape sequences, combine shape and outline cycles, and find when lantern pulses meet. Collect 48 light shards to unlock four lighthouse channels with five puzzles each: 260 questions in a full campaign.

Each level awards one shard only after all five answers are correct. Its one-to-three-star rating reflects the most help used on a question in that run. Levels unlock sequentially, in three difficulty bands. Replaying a completed level generates new problems and preserves the best star score. Existing completed level IDs and achievements are retained. Age selection is an explorer preference, not a different puzzle set.

Tap **Surprise puzzle** on an island's level selector for unlimited random practice at an unlocked difficulty. Correct answers lead to another problem; practice does not award duplicate shards or campaign stars. Level selection is paged, keeping text large and screens free of scrolling.

Generated questions use seeded random generators with bounded shape cycles and signal periods. The first shared signal beat is always within the displayed timeline. Questions, answers, and hints derive from the same data, and consecutive questions for the same level do not repeat. Completed levels save; leaving an unfinished level starts a fresh five-question run when you return.

Use the animated signal simulator or manually scrub its timeline. The pocket field guide explains each mechanic. Shape labels complement colors; all answers work by click, touch, or keyboard. Menu settings include read-aloud, reduced motion, and high contrast. The OS reduced-motion preference is also respected.

Every screen fits the viewport without page or panel scrolling. Child-facing screens use readable sans-serif text, large buttons, and short instructions. The archipelago map connects the islands, and district arrows reveal their level locations. Longer explanations and grown-up information use Previous/Next pages. Text and controls are never scaled down to fit.

## Explore the maps

Tap one of the four islands on the archipelago map to sail there, or visit the central lighthouse. Each island has its own coastline, palette, landmarks, and three district maps. The districts contain 48 individually named level destinations in total. Select an unlocked place to see its landmark and start its five puzzles. Completing a level returns you to the island map; paths show completed and locked destinations. Arrow buttons move between districts without scrolling. Keyboard and reduced-motion travel are supported.

The home map includes a large Age group selector for ages 5–7, 8–10, and 11–12. The explorer preference is saved and restored on your next visit; it is also available in the menu.

Recent puzzle fingerprints are saved in this browser to avoid repeated problems across visits. The signal generator now draws from a larger pool of valid rhythms. As with any bounded puzzle bank, old practice questions can be recycled after available combinations have been used; immediate repeats are excluded.

Progress, lighthouse channels, achievements, and preferences save in this browser. Reset removes only Prismara’s own keys. This standalone prototype does not sync with Atollingo student accounts.

## Files

- `index.html`: shell and accessible helper controls
- `js/missions.js`: base mission templates, lighthouse channels, and achievement data
- `js/generator.js`: 48 level definitions, seeded puzzle generation, answer and hint derivation
- `js/adventure.js`: five-question sessions, rewards, level paging, and unlimited practice
- `js/maps.js` and `css/maps.css`: archipelago travel, island districts, named level landmarks, locks, and biome palettes
- `assets/maps/`: 12 original district SVGs with different coasts and scenery
- `js/game.js`: puzzle validation, progression, feedback, dashboard
- `js/lagoon.js`: coastal hub, timeline visualization, accessibility and persistence improvements
- `js/kids.js` and `css/kids.css`: large-type child-facing screens, simplified copy, island paging, visual puzzle choices
- `js/audio.js`: synthesized sounds and optional speech
- `css/`: base animation styles, coastal theme, local icon styles
- `js/viewport.js` and `css/viewport.css`: viewport layout and readable dialog pagination
- `assets/lagoon.svg`: original island map
- `webfonts/`: Font Awesome solid font
- `tests/verify.cjs`: browser flow verification; requires Playwright and an installed Chromium browser
- `tests/generator.cjs`: 4,800 generated problem checks for variety, valid answers, and bounded visual complexity
- `tests/campaign.cjs`: full 260-question campaign, legacy progress migration, rewards, reload persistence, and unlimited practice
- `tests/maps.cjs`: unique map artwork/locations, travel, district locks, keyboard entry, and target geometry
- `tests/viewport.cjs`: all-screen viewport checks, including portrait and landscape phones

Third-party runtime: Tailwind CSS 3.4.17 (MIT). Icons: Font Awesome Free 6.4.0 (font SIL OFL 1.1, code MIT). See https://tailwindcss.com and https://fontawesome.com/license/free.

GitHub placement: `public/prismara/` in OceanHub; served at `/prismara/index.html` by the existing static asset pipeline. No Cloudflare configuration or account integration changes are required.
