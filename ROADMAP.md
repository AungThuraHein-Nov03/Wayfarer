# Wayfarer — Development Roadmap

**Project:** `E:\Projects\Wayfarer`  
**Purpose:** An offline-first, interactive, fillable D&D character sheet with a character-linked adventurer's notebook.  
**Scope boundary:** Not a character builder, VTT, rules compendium, or full rules engine. The existing projects in `E:\Projects` are off-limits.  
**Automation policy:** Only ability modifiers and skill/saving-throw proficiency arithmetic initially. Add automation later only where manual operation proves cumbersome; preserve manual overrides.

## Guiding Principles

1. **Fillable first.** All meaningful character fields are editable without demanding a class, species, or rules database.
2. **Character-linked notes.** Switching characters switches notebooks. Quick notes remain available from the sheet.
3. **Local-first and portable.** Data lives in local browser storage, with explicit JSON export/import and backward-compatible migrations as schemas evolve.
4. **Never lose a campaign.** Confirm destructive actions, validate imports, display storage errors, and recommend backups. Browser storage can be erased; it is not a durable backup.
5. **Readable at the table.** Use familiar D&D sheet groupings, keyboard accessibility, fast editing, and legible combat information.
6. **Separate project.** Do not modify D&D 3.0, D&D Beyond 2.0, AI-DND-VTT, or CascadeProtocol.

## Milestones

### V0.1 — Foundation (accepted by user; production build verified)
- [x] Standalone Vite web app and dark fantasy starter layout
- [x] Multiple characters: create, select, delete
- [x] Identity and portrait fields
- [x] Six ability scores with calculated ability modifiers
- [x] Eighteen skills with proficiency/expertise toggles and modifiers
- [x] Saving throw proficiency toggles and calculated modifiers
- [x] Editable HP, AC, speed, hit dice, inspiration, death saves, conditions
- [x] Basic free-form attacks, features, spellbook, equipment, inventory, and story
- [x] Per-character notes with category, pin, search, and quick-note drawer
- [x] Local autosave and JSON export/import
- [x] Four core model tests pass
- [x] Install dependencies and verify a production build
- [x] User reports initial character-sheet smoke checks working (not independently automated in a browser)
- [ ] Address usability or data-safety issues discovered in smoke testing

**Exit criteria:** A user can create two different characters, edit the sheet, keep independent notes, refresh without losing data, export a backup, and import it successfully.

### V0.2 — The Complete Fillable Sheet (next feature milestone)
- [x] Structured manual attack rows: name, bonus, damage, damage type, range, notes
- [x] Structured manual features and resource descriptions, with editable uses/recharge text
- [x] Structured inventory entries: name, quantity, weight/description; existing money field
- [x] Structured manual spell entries: name, level, casting time, range, duration, notes; manual slot notes
- [x] Tool, language, armor, and weapon proficiencies (free-form fields)
- [x] Additional age/appearance/pronoun fields; existing personality and backstory areas
- [x] Add/edit/delete entries with standard form controls (browser accessibility review pending)
- [x] Preserve all V0.1 free-text content in expandable legacy notes
- [x] Unit tests for structured entries and legacy preservation (7 tests total); browser tests pending

**Exit criteria:** All ordinary fields of a paper D&D sheet are practical to fill and revise without text-wall workarounds or unrequested character rules.

### V0.3 — The Adventurer's Notebook
- [x] Session, NPC, quest, location, discovery, loot, and general note categories with flexible labels
- [x] Session number/date, search, filtering, sorting, and pinned entries
- [x] Lightweight Markdown preview (headings, lists, emphasis, inline code) with HTML escaping; raw text remains editable
- [x] Fast note capture while viewing any sheet section (existing quick-note drawer)
- [ ] More keyboard shortcuts, dialog focus management, and browser-level resilience/accessibility verification remain
- [x] Optional links between notes; no mandatory campaign database
- [ ] Browser editor and backup round-trip tests remain; unit tests cover note isolation, filtering, links, safe formatting

**Exit criteria:** Notes are easy to capture during live play and easy to retrieve a month later.

### V0.4 — Quality of Life, Selective Automation (in progress)
- [x] Quick HP damage/heal controls with temp HP absorption and manual current/max editing
- [x] Manual spell slot tracker for levels 1–9
- [x] Dedicated manually editable Feats list (also visible on Character Sheet)
Only implement capabilities backed by real playtesting needs.
- [ ] Decide whether passive skills, initiative, or other values genuinely merit optional calculation
- [x] Manually configured spell slot maximums/remaining, with click controls and no class progression automation
- [ ] Limited-use feature counters deferred pending design review
- [ ] Add override or manual mode wherever an automatic result can conflict with homebrew
- [ ] Avoid automatic class features, spell rules, equipment bonuses, character creation, or level-up logic by default
- [x] Unit tests for HP boundaries, temp HP absorption, spell-slot limits and persistence; browser acceptance pending

**Exit criteria:** Automation removes repetitive bookkeeping without fighting the player or imposing a ruleset.

### V0.4b — Functional Completeness Pass (implemented; browser acceptance pending)
- [x] Clickable death-save success/failure markers and reset, manual fields retained
- [x] Exhaustion counter (0–6), no automatic rule penalties
- [x] Optional hit dice pool with spend/restore, preserving existing multiclass/free-text details
- [x] Unit regression coverage for boundary values and saved state

### V0.5 — Polish and Accessibility
- [x] Compact topbar/identity, denser inputs/cards and responsive navigation; removed unwanted jump strip at user request
- [ ] Refine dark fantasy visual system: typography, card grouping, spacing, and contrast
- [ ] Full keyboard use, focus states, screen-reader labels, reduced-motion support
- [ ] Revisit character portrait cropping/storage limits
- [x] Dedicated saved-data print document and compact A4 stylesheet for all five tabs, avoiding editable controls and empty print pages (visual print-preview acceptance pending)
- [ ] Clear save/backup state and non-destructive UI feedback

**Exit criteria:** Comfortable during a real session and usable without relying on a mouse.

### V1.0 — Stable Personal Release
- [ ] End-to-end smoke tests of the complete workflow
- [x] Versioned JSON exports (schemaVersion 1), legacy backup compatibility and import validation; future schema migrations may require new code
- [x] Validate imported library, characters, notes, structured entries, slot counters, and portrait formats before replacement (more hardening may follow)
- [ ] No unwanted network dependencies for normal use
- [x] README includes setup, backups, printing, limitations and release checklist
- [ ] Package or deploy only if useful (static web app first; desktop wrapper optional)

**Exit criteria:** Wayfarer is dependable enough to hold an ongoing campaign character and notebook with recoverable backups.

## Current Known Risks / Checks

- **Build verified:** Production build and 37 automated tests passed on 2026-10-26 after the print layout fix.
- **Browser verification:** User accepted sheet, notebook, HP, slots, feats, and backup restoration. New death saves/exhaustion/hit dice controls await browser acceptance.
- **Storage fragility:** LocalStorage is origin/browser-specific and may be cleared; JSON exports are essential.
- **Compatibility:** V0.2 must preserve V0.1's free-text data when introducing structured rows.
- **Low automation:** Only basic arithmetic; keep other statistics editable.
- **Source content:** Do not bundle copyrighted non-SRD rules text.

## Suggested Immediate Next Actions

1. Install dependencies and run Wayfarer in a browser.
2. Complete the V0.1 acceptance checklist and fix any issues.
3. Implement V0.2 structured manual sheet fields with safe migration.
4. Expand the notebook in V0.3.
5. Let actual play determine V0.4 automation; polish after functionality stabilizes.

**Status as of 2026-10-26:** V1.0 is in personal release refinement. The user-supplied three-page PDF revealed a broken print layout: wasted space, stacked panels, and browser controls on paper. Dedicated two-column print rendering is implemented and regression-tested. Actual Chrome/Edge PDF preview still awaits comparison.
