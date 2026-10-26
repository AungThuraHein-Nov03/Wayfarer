# Wayfarer — Personal Release Guide

Wayfarer is a local-first, manual-first D&D 2024 character sheet and campaign notebook, separate from all other projects in E:\Projects.

## Public website and deployment

The project is configured for GitHub Pages. See [PUBLISHING.md](PUBLISHING.md) for creating the public repository, deploying the site and transferring browser-local characters from localhost. Publishing the source does **not** upload your existing local character saves.

## Getting started

Run `npm install` once, then `npm run dev` in `E:\Projects\Wayfarer`. Open the URL printed by Vite. Use `npm test` for unit tests, `npm run build` to produce the standalone static bundle in `dist/`.

## Features

- Character Sheet: attributes, calculated modifiers, skills, saving throws, feats, and story.
- Combat: HP, temporary HP damage absorption, death saves, exhaustion, hit dice, resources.
- Spellbook: two-page parchment grimoire, spell slots, Prepared/Concentration flags, expandable grouped and searchable spells.
- Inventory: weapons, equipment, currency and belongings.
- Notebook: categories, search, Markdown preview, pins, one-way and reciprocal note links.

Wayfarer intentionally avoids automatic class progression, rest rules, and full rules-engine behavior. Homebrew and derived values stay editable.

## Back up before you experiment

Click **Export** and keep the downloaded JSON outside the browser profile. Export periodically. **Import** replaces the *entire* local character library only after confirmation; export existing data first. Verify characters, spells and notes after importing.

Character data lives in browser `localStorage`, specific to the browser and precise URL/origin. Clearing site data, changing browsers or opening another host may make the library appear missing. Saved JSON backups are the recovery path. Large portrait pictures can fill local storage; use small images.

## Printing

Select the desired tab and press **Print** in the header, then choose your printer or **Save as PDF**. Wayfarer generates a separate, compact print layout using the saved data (not the live editable form): the Character Sheet uses two balanced columns, descriptions are included in full, and the Notebook prints complete notes. Only the currently selected tab is printed. In Chrome/Edge, turn off **Headers and footers** in More settings to remove the date, URL, and page number. Preview before saving; long journals and spell descriptions may span pages.

## Known limitations

- A single hit-dice pool is tracked; multiclass die types can be recorded in the manual field.
- Spell slot limits, preparation and concentration are all manual.
- Notebook Markdown preview supports simple headings, lists, bold, italics and inline code, not arbitrary HTML.
- No cloud sync or accounts; local browser storage is not a substitute for exports.
- Full cross-browser accessibility, print layout and end-to-end interaction testing still require manual acceptance on target devices.
- The app does not bundle copyrighted sourcebook text.

## Personal release checklist

- [x] Automated tests and production build.
- [x] Character sheet, notebook, spellbook, backup flow user-tested during development.
- [x] Print action and print layout implemented.
- [ ] Confirm print preview/PDF output visually in the intended browser.
- [ ] Cross-browser end-to-end and accessibility audit.
