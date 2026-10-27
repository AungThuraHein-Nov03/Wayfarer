export const ABILITIES = ['STR','DEX','CON','INT','WIS','CHA'];
export const SKILLS = [
 ['Acrobatics','DEX'],['Animal Handling','WIS'],['Arcana','INT'],['Athletics','STR'],['Deception','CHA'],['History','INT'],['Insight','WIS'],['Intimidation','CHA'],['Investigation','INT'],['Medicine','WIS'],['Nature','INT'],['Perception','WIS'],['Performance','CHA'],['Persuasion','CHA'],['Religion','INT'],['Sleight of Hand','DEX'],['Stealth','DEX'],['Survival','WIS']
];
export const mod = score => Math.floor((Number(score)-10)/2);
export const signed = value => (value >= 0 ? '+' : '') + value;
export function makeCharacter(name='New Adventurer') { return {id:crypto.randomUUID(),name,pronouns:'',className:'',level:1,species:'',size:'',background:'',alignment:'',passivePerceptionAdjustment:0,spellcastingAbility:'',spellSaveDCOverride:'',spellAttackOverride:'',coins:{CP:'',SP:'',EP:'',GP:'',PP:''},portrait:'',abilities:Object.fromEntries(ABILITIES.map(k=>[k,10])),proficiencyBonus:2,skillProficiencies:{},expertise:{},savingThrows:{},hp:{current:10,max:10,temp:0},ac:10,initiativeOverride:'',speed:'30 ft',hitDice:'',inspiration:false,deathSaves:{success:0,failure:0},attacks:'',features:'',spells:'',inventory:'',equipment:'',currency:'',personality:'',backstory:'',conditions:'',notes:[],createdAt:new Date().toISOString()}; }
export const skillModifier=(c,name,ability)=>mod(c.abilities[ability])+(c.expertise[name]?2:c.skillProficiencies[name]?1:0)*Number(c.proficiencyBonus||0);
export function loadLibrary(storage=localStorage){try{const raw=JSON.parse(storage.getItem('wayfarer.library.v1'));if(raw&&Array.isArray(raw.characters)&&typeof raw.selectedId==='string')return raw;}catch{}const starter=makeCharacter();return {characters:[starter],selectedId:starter.id};}
export function saveLibrary(data,storage=localStorage){storage.setItem('wayfarer.library.v1',JSON.stringify(data));}
