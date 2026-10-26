export const COLLECTIONS={
 attacks:{title:'Attacks & Actions',fields:[['name','Name'],['bonus','Attack bonus'],['damage','Damage'],['type','Damage type'],['range','Range'],['notes','Notes']]},
 features:{title:'Features & Resources',fields:[['name','Feature'],['uses','Uses / charges'],['recharge','Recharge'],['notes','Description']]},
 spells:{title:'Spellbook',fields:[['name','Spell'],['level','Level'],['casting','Casting time'],['range','Range'],['duration','Duration'],['notes','Details']]},
 feats:{title:'Feats',fields:[['name','Feat'],['source','Source / level'],['notes','Description']]},
 inventory:{title:'Inventory',fields:[['name','Item'],['quantity','Quantity'],['weight','Weight'],['notes','Notes']]}
};
export const LEGACY_FIELDS=['attacks','features','spells','inventory'];
export function ensureStructured(c){
 if(!c.structured||typeof c.structured!=='object'||Array.isArray(c.structured))c.structured={};
 for(const key of Object.keys(COLLECTIONS))if(!Array.isArray(c.structured[key]))c.structured[key]=[];
 for(const field of LEGACY_FIELDS)if(typeof c[field]!=='string')c[field]='';
 return c;
}
export function addRow(c,key,id=crypto.randomUUID()){
 ensureStructured(c);if(!COLLECTIONS[key])throw Error('Unknown section');
 const row={id};for(const [field] of COLLECTIONS[key].fields)row[field]='';
 c.structured[key].push(row);return row;
}
export function updateRow(c,key,id,field,value){
 ensureStructured(c);if(!COLLECTIONS[key]?.fields.some(([f])=>f===field))return false;
 const row=c.structured[key].find(r=>r.id===id);if(!row)return false;row[field]=String(value);return true;
}
export function removeRow(c,key,id){
 ensureStructured(c);if(!COLLECTIONS[key])return false;
 const before=c.structured[key].length;c.structured[key]=c.structured[key].filter(r=>r.id!==id);return c.structured[key].length!==before;
}
