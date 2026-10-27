import {mod,skillModifier} from './model.js';
export const CURRENCIES=['CP','SP','EP','GP','PP'];
export const SPELLCASTING_ABILITIES=['','STR','DEX','CON','INT','WIS','CHA'];
export function passivePerception(c){return 10+skillModifier(c,'Perception','WIS')+(Number(c.passivePerceptionAdjustment)||0);}
export function spellcastingStats(c){
 const ability=SPELLCASTING_ABILITIES.includes(c.spellcastingAbility)?c.spellcastingAbility:'';
 const modifier=ability?mod(c.abilities[ability]):0;
 const proficiency=Number(c.proficiencyBonus)||0;
 const attack=proficiency+modifier;
 const dc=8+attack;
 return {ability,attack:c.spellAttackOverride===''||c.spellAttackOverride==null?attack:Number(c.spellAttackOverride),dc:c.spellSaveDCOverride===''||c.spellSaveDCOverride==null?dc:Number(c.spellSaveDCOverride)};
}
export function currencyOf(c,key){return c.coins&&Object.hasOwn(c.coins,key)?c.coins[key]:'';}
