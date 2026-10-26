import {ABILITIES,SKILLS,mod,signed,skillModifier} from './model.js';
import {ensureStructured} from './structured.js';
import {prepareNotes} from './notebook.js';
import {matchingSpells,spellLevel} from './spellbook.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const value=v=>String(v??'').trim()||'—';
const field=(label,v)=>'<div class="print-field"><small>'+esc(label)+'</small><span>'+esc(value(v))+'</span></div>';
const block=(heading,body)=>'<section class="print-group"><h2>'+esc(heading)+'</h2>'+body+'</section>';
const text=(v)=>'<div class="print-prose">'+esc(value(v))+'</div>';
const tag=(label,v)=>'<span class="print-tag">'+esc(label)+': '+esc(value(v))+'</span>';
const arr=v=>Array.isArray(v)?v:[];

function entries(c,key){
 ensureStructured(c);
 const items=arr(c.structured[key]);
 return items.length?items.map(row=>'<article class="print-entry"><strong>'+esc(value(row.name))+'</strong><div class="print-entry-details">'+Object.entries(row).filter(([k,v])=>!['id','name','prepared','concentration'].includes(k)&&String(v??'').trim()).map(([k,v])=>tag(k,v)).join('')+'</div></article>').join(''):'<p class="print-empty">No entries recorded</p>';
}
function identity(c){
 const portrait=typeof c.portrait==='string'&&/^data:image\/(png|jpeg|webp|gif);base64,/i.test(c.portrait)?'<img class="print-portrait" alt="" src="'+esc(c.portrait)+'"/>':'';
 return '<div class="print-identity">'+portrait+'<div class="print-identity-body"><div class="print-character-name">'+esc(value(c.name))+'</div><div class="print-identity-fields">'+field('Class / Subclass',c.className)+field('Level',c.level)+field('Species',c.species)+field('Background',c.background)+'</div></div></div>';
}
function sheet(c){
 const stats='<div class="print-abilities">'+ABILITIES.map(a=>'<div><strong>'+esc(a)+'</strong><b>'+esc(signed(mod(c.abilities[a])))+'</b><small>'+esc(c.abilities[a])+'</small></div>').join('')+'</div>';
 const skills='<p class="print-muted">Proficiency bonus '+esc(signed(Number(c.proficiencyBonus||0)))+'</p><div class="print-skills">'+SKILLS.map(([name,a])=>'<div><span>'+esc(name)+'</span><strong>'+esc(signed(skillModifier(c,name,a)))+'</strong><small>'+ (c.expertise?.[name]?'Expert':c.skillProficiencies?.[name]?'Proficient':'') +'</small></div>').join('')+'</div>';
 const saves='<div class="print-saves">'+ABILITIES.map(a=>field(a+(c.savingThrows?.[a]?' ★':''),signed(mod(c.abilities[a])+(c.savingThrows?.[a]?Number(c.proficiencyBonus||0):0)))).join('')+'</div>';
 const left=block('Ability Scores',stats)+block('Skills',skills)+block('Proficiencies & Languages',field('Languages',c.languages)+field('Armor & Weapon Training',c.training)+field('Tools',c.tools))+block('Character Details',field('Age',c.age)+field('Appearance',c.appearance)+field('Pronouns',c.pronouns))+block('Character Story',field('Personality & Ideals',c.personality)+field('Backstory',c.backstory));
 const right=block('At a Glance','<div class="print-stat-grid">'+field('AC',c.ac)+field('HP',String(c.hp?.current??0)+' / '+String(c.hp?.max??0))+field('Temp HP',c.hp?.temp)+field('Speed',c.speed)+field('Alignment',c.alignment)+field('Heroic Inspiration',c.inspiration?'Yes':'No')+'</div>')+block('Saving Throws',saves)+block('Features & Resources',entries(c,'features')+(c.features?text(c.features):''))+block('Feats',entries(c,'feats'));
 return identity(c)+'<div class="print-columns"><div>'+left+'</div><div>'+right+'</div></div>';
}
function combat(c){
 const hp=block('Combat & Health','<div class="print-stat-grid">'+field('Armor Class',c.ac)+field('Current / Max HP',String(c.hp?.current??0)+' / '+String(c.hp?.max??0))+field('Temp HP',c.hp?.temp)+field('Initiative',c.initiativeOverride)+field('Speed',c.speed)+field('Hit Dice',c.hitDice)+'</div>'+field('Conditions',c.conditions));
 const details=block('Death Saves, Exhaustion & Hit Dice',field('Successes',c.deathSaves?.success)+field('Failures',c.deathSaves?.failure)+field('Exhaustion',c.exhaustion)+field('Hit Dice Pool',c.hitDiceTracker?String(c.hitDiceTracker.remaining)+' / '+String(c.hitDiceTracker.total)+' '+value(c.hitDiceTracker.die):'')); 
 return '<div class="print-columns"><div>'+hp+details+'</div><div>'+block('Attacks & Actions',entries(c,'attacks')+(c.attacks?text(c.attacks):''))+block('Features & Resources',entries(c,'features'))+block('Feats',entries(c,'feats'))+'</div></div>';
}
function spells(c){
 ensureStructured(c);
 const slots=c.spellSlotTracker||{};
 const slotTable='<div class="print-slots">'+Array.from({length:9},(_,i)=>{const l=i+1,s=slots[l]||{max:0,remaining:0};return '<span>Level '+l+'</span><b>'+esc(s.remaining)+' / '+esc(s.max)+'</b>';}).join('')+'</div>';
 const spellList=matchingSpells(c,'','all').map(s=>{const level=spellLevel(s.level);return '<article class="print-entry"><strong>'+esc(value(s.name))+'</strong> <small>'+(level===null?esc(value(s.level)):level===0?'Cantrip':'Level '+level)+'</small><div class="print-entry-details">'+[s.prepared?'Prepared':'',s.concentration?'Concentration':'',s.casting?'Casting: '+s.casting:'',s.range?'Range: '+s.range:'',s.duration?'Duration: '+s.duration:''].filter(Boolean).map(v=>'<span class="print-tag">'+esc(v)+'</span>').join('')+'</div>'+(s.notes?text(s.notes):'')+'</article>';}).join('');
 return '<div class="print-columns"><div>'+block('Spell Slots',slotTable)+block('Spellcasting Notes',text(c.spellSlots))+'</div><div>'+block('Spells',spellList||'<p class="print-empty">No spells recorded</p>')+(c.spells?block('Additional Spell Notes',text(c.spells)):'')+'</div></div>';
}
function inventory(c){
 return '<div class="print-columns"><div>'+block('Inventory',entries(c,'inventory')+(c.inventory?text(c.inventory):''))+'</div><div>'+block('Equipped Items',text(c.equipment))+block('Currency',text(c.currency))+'</div></div>';
}
function notebook(c){
 prepareNotes(c);
 return '<div class="print-notes">'+c.notes.map(n=>'<article class="print-note"><h2>'+esc(value(n.title))+'</h2><p class="print-muted">'+[n.category,n.session?'Session '+n.session:'',n.date,n.tag].filter(Boolean).map(esc).join(' · ')+'</p>'+text(n.body)+'</article>').join('')+'</div>';
}
export function renderPrintView(c,tab){
 const title=({sheet:'Character Sheet',combat:'Combat & Resources',spells:'Spellbook',inventory:'Inventory & Equipment',notes:'Field Journal'})[tab]||'Character Sheet';
 const content=tab==='combat'?combat(c):tab==='spells'?spells(c):tab==='inventory'?inventory(c):tab==='notes'?notebook(c):sheet(c);
 return '<div class="print-document"><header class="print-header"><div><span>✦ WAYFARER · CHARACTER & CHRONICLE</span><h1>'+esc(title)+'</h1></div><strong>'+esc(value(c.name))+'</strong></header>'+content+'</div>';
}
