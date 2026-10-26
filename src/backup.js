// Validate a backup before it can replace the current local library.
// Older Wayfarer exports without a schemaVersion remain supported.
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const text=v=>typeof v==='string';
export function validateBackup(data){
 if(!object(data)||!Array.isArray(data.characters)||data.characters.length<1||data.characters.length>1000)throw Error('Backup must contain 1–1000 characters.');
 if(data.schemaVersion!==undefined&&data.schemaVersion!==1)throw Error('Unsupported backup version.');
 if(!text(data.selectedId))throw Error('Missing selected character.');
 const ids=new Set();
 for(const c of data.characters){
  if(!object(c)||!text(c.id)||!c.id||ids.has(c.id)||!text(c.name)||!object(c.abilities)||!object(c.hp)||!Array.isArray(c.notes))throw Error('Invalid or duplicate character data.');
  ids.add(c.id);
  for(const stat of ['STR','DEX','CON','INT','WIS','CHA'])if(!Number.isFinite(c.abilities[stat]))throw Error('Invalid ability score.');
  for(const stat of ['current','max','temp'])if(!Number.isFinite(Number(c.hp[stat])))throw Error('Invalid hit points.');
  if(c.notes.length>10000)throw Error('Too many notes in character.');
  const noteIds=new Set();
  for(const n of c.notes){
   if(!object(n)||!text(n.id)||!n.id||noteIds.has(n.id)||!text(n.title)||!text(n.body)||!text(n.tag||'')||!text(n.updated)||n.links!==undefined&&(!Array.isArray(n.links)||n.links.some(l=>!text(l))))throw Error('Invalid journal entry.');
   noteIds.add(n.id);
  }
  if(c.structured!==undefined){
   if(!object(c.structured))throw Error('Invalid structured entries.');
   for(const entries of Object.values(c.structured)){
    if(!Array.isArray(entries)||entries.some(r=>!object(r)||!text(r.id)||!r.id))throw Error('Invalid sheet entry.');
   }
  }
  if(c.spellSlotTracker!==undefined){
   if(!object(c.spellSlotTracker))throw Error('Invalid spell slots.');
   for(const [level,slot] of Object.entries(c.spellSlotTracker)){
    if(!/^[1-9]$/.test(level)||!object(slot)||!Number.isInteger(slot.max)||!Number.isInteger(slot.remaining)||slot.max<0||slot.max>30||slot.remaining<0||slot.remaining>slot.max)throw Error('Invalid spell slot values.');
   }
  }
  if(c.portrait!==undefined&&(!text(c.portrait)||c.portrait&&!/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(c.portrait)))throw Error('Unsupported portrait content.');
 }
 if(!ids.has(data.selectedId))throw Error('Selected character is not present.');
 return data;
}
export function backupJSON(library){validateBackup(library);return JSON.stringify({...library,schemaVersion:1},null,2);}
export function restoreBackup(json,current,storage){const candidate=validateBackup(JSON.parse(json));const previous=storage.getItem('wayfarer.library.v1');try{storage.setItem('wayfarer.library.v1',JSON.stringify({characters:candidate.characters,selectedId:candidate.selectedId}));}catch(error){if(previous!==null){try{storage.setItem('wayfarer.library.v1',previous);}catch{}}throw error;}return {characters:candidate.characters,selectedId:candidate.selectedId};}
