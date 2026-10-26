import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCharacter} from '../src/model.js';
import {addRow} from '../src/structured.js';
import {renderPrintView} from '../src/print-view.js';

test('character print displays both columns and saved scores, not empty form placeholders',()=>{
 const c=makeCharacter('Pyreth');
 c.abilities.DEX=24;c.hp={current:5,max:10,temp:0};c.className='Ranger / Fey Wanderer';
 const html=renderPrintView(c,'sheet');
 assert.match(html,/class="print-columns"/);
 assert.match(html,/Ability Scores/);
 assert.match(html,/Features &amp; Resources/);
 assert.match(html,/Saving Throws/);
 assert.match(html,/Ranger \/ Fey Wanderer/);
 assert.match(html,/5 \/ 10/);
 assert.doesNotMatch(html,/Choose File|No entries yet\. Add one below|placeholder=/);
});
test('features, feats and notes print their full content even when collapsed on screen',()=>{
 const c=makeCharacter('Alex');
 addRow(c,'features','f1').name='Action Surge';
 c.structured.features[0].notes='Full rule details';
 addRow(c,'feats','ft1').name='Alert';
 c.notes=[{id:'n1',title:'Temple',body:'A long secret\nSecond paragraph.',tag:'Location',updated:'2026-10-26'}];
 const sheet=renderPrintView(c,'sheet');
 const journal=renderPrintView(c,'notes');
 assert.match(sheet,/Full rule details/);
 assert.match(sheet,/Alert/);
 assert.match(journal,/A long secret\nSecond paragraph/);
 assert.match(journal,/Temple/);
});
test('print view safely escapes user-created text and preserves spell data',()=>{
 const c=makeCharacter('Hawk <script>');
 const s=addRow(c,'spells','s1');s.name='Fireball';s.level='3';s.prepared=true;s.notes='<img src=x onerror=alert(1)>';
 const html=renderPrintView(c,'spells');
 assert.match(html,/Fireball/);
 assert.match(html,/Prepared/);
 assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
 assert.doesNotMatch(html,/<script>|<img src=x/);
});
test('combat and inventory print routes include relevant saved content',()=>{
 const c=makeCharacter('Benedict');
 c.conditions='Poisoned';
 c.currency='20 gp';
 addRow(c,'inventory','i1').name='Hearthbreaker';
 assert.match(renderPrintView(c,'combat'),/Poisoned/);
 assert.match(renderPrintView(c,'inventory'),/20 gp/);
 assert.match(renderPrintView(c,'inventory'),/Hearthbreaker/);
});
