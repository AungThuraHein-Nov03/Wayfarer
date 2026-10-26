import {ABILITIES,SKILLS,mod,signed,skillModifier} from './model.js';

// A blank number input is a temporary editing state, not a new saved score.
// This lets users backspace through "10" and type "8" or "20" normally.
export function parseNumberDraft(raw) {
 const value=String(raw??'').trim();
 if(!value)return null;
 const number=Number(value);
 return Number.isFinite(number)?number:null;
}

// Update calculated labels in place instead of replacing the active input.
// Rebuilding the sheet on each keystroke makes number inputs lose their caret.
export function refreshScoreLabels(root,character){
 const modifiers=root.querySelectorAll('.ability .modifier');
 ABILITIES.forEach((ability,index)=>{
  if(modifiers[index])modifiers[index].textContent=signed(mod(character.abilities[ability]));
 });
 const skillTotals=root.querySelectorAll('.skill-total');
 SKILLS.forEach(([skill,ability],index)=>{
  if(skillTotals[index])skillTotals[index].textContent=signed(skillModifier(character,skill,ability));
 });
 const saveTotals=root.querySelectorAll('.saving-list label span');
 ABILITIES.forEach((ability,index)=>{
  if(saveTotals[index])saveTotals[index].textContent=signed(mod(character.abilities[ability])+(character.savingThrows[ability]?Number(character.proficiencyBonus||0):0));
 });
}
