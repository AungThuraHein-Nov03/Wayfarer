import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCharacter} from '../src/model.js';
import {parseNumberDraft,refreshScoreLabels} from '../src/live-scores.js';

test('clearing a number while editing does not save an accidental zero',()=>{
 assert.equal(parseNumberDraft(''),null);
 assert.equal(parseNumberDraft('  '),null);
 assert.equal(parseNumberDraft('1e'),null);
 assert.equal(parseNumberDraft('NaN'),null);
 assert.equal(parseNumberDraft('0'),0);
 assert.equal(parseNumberDraft('1'),1);
 assert.equal(parseNumberDraft('20'),20);
});
test('ability changes refresh modifier, skill and save labels in place',()=>{
 const c=makeCharacter('Pyreth');
 c.abilities.DEX=20;
 c.proficiencyBonus=3;
 c.skillProficiencies.Acrobatics=true;
 c.savingThrows.DEX=true;
 const lists={
  '.ability .modifier':Array.from({length:6},()=>({textContent:'old'})),
  '.skill-total':Array.from({length:18},()=>({textContent:'old'})),
  '.saving-list label span':Array.from({length:6},()=>({textContent:'old'}))
 };
 const originalAbilityInput={value:'20',selectionStart:1};
 const root={querySelectorAll:selector=>lists[selector]};
 refreshScoreLabels(root,c);
 assert.equal(lists['.ability .modifier'][1].textContent,'+5');
 assert.equal(lists['.skill-total'][0].textContent,'+8');
 assert.equal(lists['.saving-list label span'][1].textContent,'+8');
 assert.equal(originalAbilityInput.value,'20');
 assert.equal(originalAbilityInput.selectionStart,1);
 c.abilities.DEX=8;
 refreshScoreLabels(root,c);
 assert.equal(lists['.ability .modifier'][1].textContent,'-1');
 assert.equal(lists['.skill-total'][0].textContent,'+2');
 assert.equal(lists['.saving-list label span'][1].textContent,'+2');
});
