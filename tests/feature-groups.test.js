import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCharacter} from '../src/model.js';
import {addRow} from '../src/structured.js';
import {FEATURE_GROUPS,featureGroup,featuresInGroup,setFeatureGroup} from '../src/feature-groups.js';
import {renderPrintView} from '../src/print-view.js';
import {backupJSON,restoreBackup} from '../src/backup.js';

test('old features remain unsorted and are never automatically reclassified',()=>{
 const c=makeCharacter();const old=addRow(c,'features','legacy');old.name='Action Surge';old.uses='1';old.notes='Do another action';
 assert.equal(featureGroup(old),'uncategorized');
 assert.deepEqual(featuresInGroup(c,'uncategorized'),[old]);
 assert.equal(FEATURE_GROUPS.length,4);
});
test('features can move between active, passive, resources without content loss',()=>{
 const c=makeCharacter();const row=addRow(c,'features','one');row.name='Second Wind';row.notes='Regain HP';row.uses='2';
 assert.equal(setFeatureGroup(c,'one','resource'),true);
 assert.equal(featuresInGroup(c,'resource').length,1);
 assert.equal(setFeatureGroup(c,'one','passive'),true);
 assert.equal(setFeatureGroup(c,'one','nope'),false);
 assert.equal(row.name,'Second Wind');assert.equal(row.notes,'Regain HP');assert.equal(row.uses,'2');
 assert.match(renderPrintView(c,'sheet'),/Passive Features/);
 assert.match(renderPrintView(c,'combat'),/Second Wind/);
});
test('feature categories survive JSON backup and restore',()=>{
 const c=makeCharacter();const row=addRow(c,'features','two');row.name='Rage';setFeatureGroup(c,'two','active');
 const lib={characters:[c],selectedId:c.id};const storage={setItem(){},getItem(){return null}};
 const restored=restoreBackup(backupJSON(lib),lib,storage).characters[0];
 assert.equal(restored.structured.features[0].category,'active');
 assert.equal(featureGroup(restored.structured.features[0]),'active');
});
