import {matchingSpells,spellLevel} from './spellbook.js';

export const BOOKMARK_LEVELS=[
  ['0','Cantrips'],
  ...Array.from({length:9},(_,index)=>[String(index+1),['1st','2nd','3rd'][index]||`${index+1}th`]),
  ['other','Other']
];

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function preparedSpellsForLevel(character,level='0'){
  const key=String(level);
  if(!BOOKMARK_LEVELS.some(([value])=>value===key))return [];
  return matchingSpells(character,'',key).filter(spell=>spell.prepared===true);
}

const spellCard=spell=>{
  const tags=[
    ['Level',spellLevel(spell.level)===0?'Cantrip':spellLevel(spell.level)===null?(spell.level||'Custom'):String(spellLevel(spell.level))],
    spell.casting&&['Casting',spell.casting],
    spell.range&&['Range',spell.range],
    spell.duration&&['Duration',spell.duration]
  ].filter(Boolean).map(([label,value])=>`<span><b>${esc(label)}:</b> ${esc(value)}</span>`).join('');
  const flags=[
    spell.concentration&&'Concentration',
    spell.ritual&&'Ritual',
    spell.material&&'Material components'
  ].filter(Boolean).map(label=>`<span class="prepared-spell-flag">${label}</span>`).join('');
  return `<article class="prepared-spell-card">
    <h3>${esc(spell.name||'Unnamed spell')}</h3>
    ${tags?`<div class="prepared-spell-facts">${tags}</div>`:''}
    ${flags?`<div class="prepared-spell-flags">${flags}</div>`:''}
    ${spell.notes?`<p class="prepared-spell-description">${esc(spell.notes)}</p>`:''}
  </article>`;
};

export function searchPreparedSpells(character,query=''){
  const search=String(query??'').trim().toLocaleLowerCase();
  return search?matchingSpells(character,'','all').filter(spell=>spell.prepared===true&&String(spell.name??'').toLocaleLowerCase().includes(search)):[];
}

export function renderPreparedPages(character,level='0',query=''){
  const searching=Boolean(String(query??'').trim());
  const spells=searching?searchPreparedSpells(character,query):preparedSpellsForLevel(character,level);
  const levelLabel=searching?'Search Results':BOOKMARK_LEVELS.find(([key])=>key===String(level))?.[1]||'Cantrips';
  const midpoint=Math.ceil(spells.length/2);
  const left=spells.slice(0,midpoint);
  const right=spells.slice(midpoint);
  return `<section class="prepared-book-page" aria-label="Left page">
    <div class="prepared-page-ornament" aria-hidden="true">✦ ✧ ✦</div>
    <h2>${esc(levelLabel)}</h2>
    <p class="prepared-page-subtitle">${spells.length} prepared ${spells.length===1?'spell':'spells'}</p>
    <div class="prepared-page-scroll" tabindex="0" aria-label="Spell entries on this page">${spells.length?left.map(spellCard).join(''):`<p class="prepared-book-empty">${searching?'No prepared spells match your search.':'No prepared spells at this level. Mark spells as Prepared in the main Spellbook to see them here.'}</p>`}</div>
    <span class="prepared-page-footer">WAYFARER · GRIMOIRE</span>
  </section>
  <section class="prepared-book-page" aria-label="Right page">
    <div class="prepared-page-ornament" aria-hidden="true">✦ ✧ ✦</div>
    <h2>${spells.length?'Arcane Records':'Awaiting Discovery'}</h2>
    <p class="prepared-page-subtitle">${spells.length?'Prepared for the adventure ahead':'Your next spell awaits'}</p>
    <div class="prepared-page-scroll" tabindex="0" aria-label="Spell entries on this page">${right.length?right.map(spellCard).join(''):`<p class="prepared-book-empty">${spells.length?'Turn to another bookmark to view spells of a different level.':'The grimoire will fill as you prepare your spells.'}</p>`}</div>
    <span class="prepared-page-footer">CHARACTER & CHRONICLE</span>
  </section>`;
}

export function renderPreparedBook(character,level='0'){
  const selected=BOOKMARK_LEVELS.some(([key])=>key===String(level))?String(level):'0';
  return `<div class="prepared-book-overlay" data-book-overlay>
    <div class="prepared-book-dialog" role="dialog" aria-modal="true" aria-labelledby="prepared-book-title" tabindex="-1">
      <div class="prepared-book-header">
        <div class="prepared-book-heading"><span class="prepared-book-eyebrow">THE ADVENTURER'S POCKET GRIMOIRE</span><h2 id="prepared-book-title">${esc(character.name||'Adventurer')}'s Spell Book</h2></div>
        <input type="search" class="prepared-book-search" data-book-search aria-label="Search prepared spells" placeholder="Search prepared spells…" autocomplete="off"/>
        <button type="button" class="prepared-book-close" data-action="close-prepared-book" aria-label="Close Spell Book">✕ Close</button>
      </div>
      <div class="prepared-book-stage">
        <div class="prepared-book-pages" data-book-pages>${renderPreparedPages(character,selected)}</div>
        <nav class="prepared-book-bookmarks" aria-label="Spell level bookmarks">
          ${BOOKMARK_LEVELS.map(([key,label])=>`<button type="button" class="prepared-book-bookmark ${selected===key?'active':''}" data-book-level="${key}" aria-current="${selected===key?'page':'false'}" aria-label="View ${esc(label)} spells">${esc(label)}</button>`).join('')}
        </nav>
      </div>
    </div>
  </div>`;
}
