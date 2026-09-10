# Atollingo educational hub — phases 1–6

## Implemented

1. Learning dashboard: local onboarding, daily checklist, resume links, weak-skill practice, assignments, badges, and subject navigation.
2. One family identity: four profiles, isolated progress, grade/challenge matrix, validated backup export/import with a recoverable pre-import copy. Exact-origin messaging connects the four Atollingo apps and the main MathLagoon learning app. A first-party connection window supports browsers that partition embedded storage.
3. Grade 1 English: six seven-step modules covering the five requested areas, scored independent questions, guided hints, matching practice, and a five-question adaptive starter check.
4. Parent and teacher spaces: weekly summaries, home prompts, class rosters, assignments, join codes, portable class packs, imported student reports, skill matrices, and printable/offline workbooks with separate answer keys.
5. Resource library: 4,200 existing English worksheet/story entries, 50 MathLagoon lessons, new connected resources, and verified app collections. Search and filters cover subject, grade, framework level, language, activity type, strand, printing and offline availability. Existing worksheet URLs open the exact bank entry.
6. Accessibility and trust: read-aloud with voice fallbacks, text enlargement, high contrast, RTL support, native accessible dialogs, local problem reports, and an honest content/privacy page.

## Deliberate boundaries

- Parent and teacher spaces are browser-local, without remote accounts or live class synchronization. Class packs and child reports support transfer between devices.
- Math Explorer and the separate maths Worksheet Hub are linked services. The main MathLagoon learning app is integrated.
- OceanScience does not exist yet, as confirmed by the owner. Science and Dhivehi content remain marked as planned.
- English outcomes are internal draft mappings based on the supplied summary. No independent educator approval or official curriculum endorsement is claimed.
- Older app completions do not imply a measured mastery percentage. New English and MathLagoon objective results provide scored evidence.
- Offline downloads cover the new English workbooks; other resources are not labelled offline-ready without support.
- No browser interaction/visual QA was requested. Verification uses production builds, rendered-route tests, unit tests, and existing MathLagoon tests.

## Source layout

The hub uses `src/screens` rather than `src/pages` because Next/Vinext treats `src/pages` as live routes. App routes live in `app/`. Shared adapters are copied to each linked project under `atollingo/`.

## Publishing

The six existing projects are public. Build and save all six versions before asking the owner to publish. Publish the hub first so the connection endpoints exist, then the linked apps. Preserve all existing custom domains and access settings.

## Maintenance

- Rebuild the worksheet catalog with `node tools/index-resources.mjs` when banks change.
- Rebuild maths metadata with `node tools/index-math.mjs` when the local MathLagoon content changes.
- Run `node --test tests/learning.test.mjs` for profile, scoring, backup and state tests.
- After a production build, run `node --test tests/rendered-html.test.mjs` for route and catalog checks.
