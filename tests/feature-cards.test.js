import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCharacter} from '../src/model.js';
import {addRow} from '../src/structured.js';
import {setFeatureGroup} from '../src/feature-groups.js';
import {featureTitle,featureMeta,renderFeatureReadView,renderFeatureCard} from '../src/feature-cards.js';
import {backupJSON,restoreBackup} from '../src/backup.js';

test('existing features expand into readable descriptions, not active editor inputs',()=>{
 const c=makeCharacter();const row=addRow(c,'features','feat-1');
 row.name='Pact of the Tome';row.uses='At will';row.recharge='None';row.notes='Read spells.\nUseful during rests.';
 row.category='passive';
 const html=renderFeatureCard('features',row,{group:'passive'});
 assert.match(html,/data-feature-kind="features"/);
 assert.match(html,/<div class="feature-readonly" data-feature-view>/);
 assert.match(html,/<div class="feature-edit-panel" data-feature-editor hidden>/);
 assert.match(html,/Read spells\.\nUseful during rests\./);
 assert.match(html,/At will/);
 assert.match(html,/Recharge/);
 assert.match(html,/Passive Features/);
 assert.match(html,/data-action="edit-feature"/);
 assert.match(html,/aria-label="Edit Pact of the Tome"/);
 assert.match(html,/data-action="done-feature"/);
 assert.match(html,/data-feature-group="feat-1"/);
 assert.match(html,/data-row-field="name"/);
 assert.match(html,/data-row-field="notes"/);
 assert.match(html,/data-action="remove-row"/);
});

test('feats display source and description, with editing hidden until requested',()=>{
 const c=makeCharacter();const row=addRow(c,'feats','feat-2');
 row.name='Sharpshooter';row.source='Level 4';row.notes='Ignore some cover.';
 const html=renderFeatureCard('feats',row);
 assert.match(html,/Source \/ Level/);
 assert.match(html,/Level 4/);
 assert.match(html,/Ignore some cover/);
 assert.doesNotMatch(html,/data-feature-group=/);
 assert.match(html,/data-feature-editor hidden/);
 assert.equal(featureTitle(row,'feats'),'Sharpshooter');
 assert.equal(featureMeta(row,'feats'),'Level 4');
});

test('empty data and legacy categories produce helpful, readable output',()=>{
 const c=makeCharacter();
 const row=addRow(c,'features','old');row.category='old-category';
 assert.equal(featureTitle(row,'features'),'Unnamed feature');
 assert.equal(featureMeta(row,'features'),'');
 assert.match(renderFeatureReadView('features',row),/Unsorted \/ Existing Features/);
 assert.match(renderFeatureReadView('features',row),/No description recorded yet/);
 assert.match(renderFeatureCard('feats',{id:'f',name:'',source:'',notes:''}),/Unnamed feat/);
 assert.equal(setFeatureGroup(c,'old','resource'),true);
 assert.match(renderFeatureReadView('features',row),/Resources/);
});

test('user-written HTML is escaped in both display and editing fields',()=>{
 const row={id:'x" onclick="alert(1)',name:'<img src=x onerror=alert(1)>',uses:'<b>3</b>',recharge:'',notes:'<script>alert(1)</script>\nPlain "text"',category:'active'};
 const html=renderFeatureCard('features',row,{group:'active'});
 assert.doesNotMatch(html,/<script>|<img src=x/);
 assert.match(html,/&lt;script&gt;/);
 assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
 assert.match(html,/id="x&quot; onclick=&quot;alert\(1\)"/);
 assert.match(html,/Plain &quot;text&quot;/);
 assert.match(html,/&lt;b&gt;3&lt;\/b&gt;/);
});

test('existing fields and category survive backup/restore',()=>{
 const c=makeCharacter();const row=addRow(c,'features','saved');row.name='Rage';row.notes='Resist some damage';row.uses='3';
 setFeatureGroup(c,row.id,'active');
 const feat=addRow(c,'feats','feat');feat.name='Alert';feat.notes='Initiative bonus';
 const lib={characters:[c],selectedId:c.id};
 const storage={setItem(){},getItem(){return null}};
 const restored=restoreBackup(backupJSON(lib),lib,storage).characters[0];
 assert.equal(restored.structured.features[0].notes,row.notes);
 assert.equal(restored.structured.features[0].category,'active');
 assert.equal(restored.structured.feats[0].notes,feat.notes);
 assert.match(renderFeatureReadView('features',restored.structured.features[0]),/Resist some damage/);
});

test('UI event flow explicitly switches viewing/editing and refreshes the display',()=>{
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(main,/case 'edit-feature':setFeatureEditMode\(el\.closest\('\.feature-card'\),true,true\)/);
 assert.match(main,/case 'done-feature':finishFeatureEdit\(el\.closest\('\.feature-card'\)\)/);
 assert.match(main,/view\.innerHTML=renderFeatureReadView\(key,row\)/);
 assert.match(main,/setFeatureEditMode\(item,true,true\)/);
 assert.match(main,/setFeatureEditMode\(created,true,true\)/);
 assert.match(main,/setFeatureEditMode\(group,true\)/);
});

test('edit controls use a true centered SVG icon on both features and feats',()=>{
 for(const key of ['features','feats']){
  const c=makeCharacter();
  const row=addRow(c,key,'edit-icon');
  row.name='Test '+key;
  const html=renderFeatureCard(key,row,{group:key==='features'?'active':null});
  assert.match(html,/class="feature-edit-button"/);
  assert.match(html,/class="feature-pencil-icon" width="16" height="16" viewBox="0 0 24 24"/);
  assert.match(html,/aria-hidden="true" focusable="false"/);
  assert.doesNotMatch(html,/>✎<\/button>/);
 }
 const css=readFileSync(new URL('../src/feature-groups.css',import.meta.url),'utf8');
 assert.match(css,/\.feature-edit-button\{[^}]*display:grid;place-items:center;/);
 assert.match(css,/\.feature-pencil-icon\{display:block;width:16px;height:16px;/);
});
