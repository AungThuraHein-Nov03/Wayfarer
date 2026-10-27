import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCharacter} from '../src/model.js';
import {addRow} from '../src/structured.js';
import {updateSpellFlag} from '../src/spellbook.js';
import {passivePerception,spellcastingStats,currencyOf} from '../src/sheet-stats.js';
import {backupJSON,restoreBackup} from '../src/backup.js';
import {renderPrintView} from '../src/print-view.js';

test('passive perception includes proficiency, expertise and manual adjustment',()=>{
 const c=makeCharacter();c.abilities.WIS=18;c.proficiencyBonus=3;
 assert.equal(passivePerception(c),14);
 c.skillProficiencies.Perception=true;assert.equal(passivePerception(c),17);
 c.expertise.Perception=true;c.passivePerceptionAdjustment=5;
 assert.equal(passivePerception(c),25);
});
test('spellcasting DC and attack derive from chosen ability and support independent manual overrides',()=>{
 const c=makeCharacter();c.abilities.WIS=18;c.proficiencyBonus=3;c.spellcastingAbility='WIS';
 assert.deepEqual(spellcastingStats(c),{ability:'WIS',attack:7,dc:15});
 c.spellSaveDCOverride=20;c.spellAttackOverride=11;
 assert.deepEqual(spellcastingStats(c),{ability:'WIS',attack:11,dc:20});
 c.spellSaveDCOverride='';c.spellAttackOverride='';
 assert.equal(spellcastingStats(c).dc,15);
});
test('ritual and material flags are saved and printable',()=>{
 const c=makeCharacter();const row=addRow(c,'spells','magic');row.name='Detect Magic';
 assert.equal(updateSpellFlag(c,'magic','ritual',true),true);
 assert.equal(updateSpellFlag(c,'magic','material',true),true);
 assert.equal(updateSpellFlag(c,'magic','unknown',true),false);
 const printed=renderPrintView(c,'spells');
 assert.match(printed,/Ritual/);assert.match(printed,/Material/);
});
test('currency and size survive backups while old freeform notes are preserved',()=>{
 const c=makeCharacter();c.size='Small';c.coins={CP:3,SP:8,EP:1,GP:120,PP:2};c.currency='Old coin tally';
 const lib={characters:[c],selectedId:c.id};
 const storage={data:new Map(),getItem(k){return this.data.get(k)??null},setItem(k,v){this.data.set(k,v)}};
 const restored=restoreBackup(backupJSON(lib),lib,storage).characters[0];
 assert.equal(restored.size,'Small');assert.equal(currencyOf(restored,'GP'),120);
 assert.equal(restored.currency,'Old coin tally');
 assert.match(renderPrintView(restored,'inventory'),/120/);
 const legacy=makeCharacter();delete legacy.coins;assert.equal(currencyOf(legacy,'GP'),'');
});
