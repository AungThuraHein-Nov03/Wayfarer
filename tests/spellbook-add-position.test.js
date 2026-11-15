import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Add Spell is available above the growing spell list, not at the bottom',()=>{
  const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  const start=source.indexOf('function spellCollection(c)');
  const end=source.indexOf('function structuredSection(c,key)',start);
  assert.ok(start>=0&&end>start,'spell collection renderer exists');
  const spellUI=source.slice(start,end);
  const add='<button class="spell-add-button" data-action="add-row" data-section="spells">+ Add spell</button>';
  assert.equal(spellUI.split(add).length-1,1,'Add Spell button appears once');
  assert.ok(spellUI.indexOf(add)<spellUI.indexOf('class="spell-filters"'));
  assert.ok(spellUI.indexOf(add)<spellUI.indexOf('class="spell-entry-list"'));
  assert.ok(source.includes("case 'add-row':{const row=addRow(c,el.dataset.section)"));
});
