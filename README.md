# Wayfarer

![Wayfarer banner: a gold compass rose on a dark green map](assets/wayfarer-banner.svg)

**Character & Chronicle** · A fillable D&D 2024 character sheet and campaign notebook that saves in your browser. Keep a character's numbers, spells, belongings, and story together, with room for homebrew and your own rulings.

**[Open the app](https://aungthurahein-nov03.github.io/Wayfarer/)** · [Run locally](#run-locally) · [Protect your saves](#saving-and-backups) · [Development roadmap](ROADMAP.md)

## At the table

| Space | What you can do |
| --- | --- |
| **Character Sheet** | Keep multiple characters with separate notebooks. Fill in ability scores, skills, saving throws, proficiencies, feats, portrait, and backstory. Modifiers and proficiency totals update from your entries. |
| **Combat** | Record attacks and resources, adjust HP with temporary HP absorption, and mark death saves, exhaustion, and a single hit-dice pool. |
| **Spellbook** | Add and search custom spells, filter by level, mark prepared and concentration spells, and track slots with limits you set yourself. |
| **Inventory** | Record equipment, individual items, quantities, descriptions, and currency. |
| **Notebook** | Capture quick notes from any tab, then search, categorize, pin, preview basic Markdown, and link related entries. |

Wayfarer leaves class progression, rest effects, and spellcasting rulings to the player. Fields stay editable so the sheet can accommodate homebrew.

## Run locally

The deployment workflow uses Node.js 22. From the project directory:

```sh
npm ci
npm run dev
```

Open the address printed by Vite. The development server binds to `127.0.0.1`.

```sh
npm test
npm run build
```

The production build goes to `dist/`. The [publishing guide](PUBLISHING.md) covers the GitHub Pages workflow.

## Saving and backups

> **Keep an exported backup.** Wayfarer autosaves to your browser's `localStorage`, which belongs to that browser and website address. A localhost save does not automatically appear on the published site.

Choose **Export** to download the entire character library as JSON. To move it, open Wayfarer at the new address and choose **Import**. The file is validated before you confirm, but importing **replaces the entire library** at the new address. Export that library first if you might need it. Clearing site data or losing a browser profile can erase local saves; your exported JSON is the recovery copy.

Portrait uploads must be under 1 MB. Even smaller images use browser storage, so keep them compact.

## Print a sheet or journal

Select a tab and choose **Print** in the header. Wayfarer prepares a separate print view for the current character and selected tab; use your browser's **Save as PDF** option if you want a file. Preview long notes and spell descriptions, which may span pages.

## Under the hood

Wayfarer is a static JavaScript app built with Vite. The UI, data model, backup handling, journal, trackers, and print view live in `src/`; automated checks live in `tests/`. GitHub Actions runs `npm ci`, `npm test`, and `npm run build` before deploying `dist/` to GitHub Pages. Character data has no account, server, database, or cloud sync.

### Current limits

- Spell preparation, concentration, slots, and hit dice are manual. The optional hit-dice counter supports one die type; multiclass details can go in the free-text field.
- Journal preview supports basic headings, lists, emphasis, and inline code, rather than full Markdown or HTML.
- Cross-browser accessibility, end-to-end interaction, and visual print/PDF acceptance still need checking. The [roadmap](ROADMAP.md) has the detailed status.
- No sourcebook text is bundled.
