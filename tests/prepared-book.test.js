import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCharacter} from '../src/model.js';
import {addRow} from '../src/structured.js';
import {BOOKMARK_LEVELS,preparedSpellsForLevel,renderPreparedPages,renderPreparedBook} from '../src/prepared-book.js';

const characterWithSpells=()=>{
 const c=makeCharacter('Lyra');
 const cantrip=addRow(c,'spells','c1');cantrip.name='Mage Hand';cantrip.level='Cantrip';cantrip.prepared=true;cantrip.notes='Reach 30 ft.';
 const hidden=addRow(c,'spells','c2');hidden.name='Guidance';hidden.level='Cantrip';hidden.prepared=false;
 const first=addRow(c,'spells','l1');first.name='Magic Missile';first.level='1st';first.prepared=true;first.casting='Action';
 const second=addRow(c,'spells','l2');second.name='Shield';second.level='1';second.prepared=true;second.concentration=true;
 const third=addRow(c,'spells','l3');third.name='Fireball';third.level='3';third.prepared=true;
 const custom=addRow(c,'spells','other');custom.name='Moonspell';custom.level='Unknown';custom.prepared=true;
 return c;
};
test('quick grimoire starts with prepared cantrips and excludes unprepared spells',()=>{
 const c=characterWithSpells();
 assert.deepEqual(preparedSpellsForLevel(c,'0').map(s=>s.name),['Mage Hand']);
 assert.deepEqual(preparedSpellsForLevel(c,'1').map(s=>s.name),['Magic Missile','Shield']);
 assert.deepEqual(preparedSpellsForLevel(c,'3').map(s=>s.name),['Fireball']);
 assert.deepEqual(preparedSpellsForLevel(c,'2'),[]);
 assert.deepEqual(preparedSpellsForLevel(c,'other').map(s=>s.name),['Moonspell']);
 assert.deepEqual(preparedSpellsForLevel(c,'bad'),[]);
 const markup=renderPreparedBook(c);
 assert.match(markup,/Mage Hand/);
 assert.doesNotMatch(markup,/Guidance|Magic Missile|Fireball/);
 assert.match(markup,/data-book-level="0" aria-current="page"/);
 assert.equal(BOOKMARK_LEVELS.length,11);
});
test('bookmarks render only their chosen level and keep the page structure',()=>{
 const c=characterWithSpells();
 const one=renderPreparedPages(c,'1');
 assert.match(one,/Magic Missile/);
 assert.match(one,/Shield/);
 assert.doesNotMatch(one,/Mage Hand|Fireball/);
 assert.equal((one.match(/class="prepared-book-page"/g)||[]).length,2);
 const empty=renderPreparedPages(c,'9');
 assert.match(empty,/No prepared spells at this level/);
});
test('the grimoire escapes user-authored spell names and descriptions',()=>{
 const c=makeCharacter('Hero <script>');
 const row=addRow(c,'spells','x');
 row.prepared=true;row.level='0';row.name='<img src=x onerror=alert(1)>';row.notes='<script>alert(1)</script>\nMore';
 const html=renderPreparedBook(c);
 assert.doesNotMatch(html,/<script>|<img src=x/);
 assert.match(html,/&lt;script&gt;/);
 assert.match(html,/&lt;img src=x/);
});
test('quick Spell Book controls are available on both sheet and combat and switch pages only',()=>{
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(source,/tab==='sheet'\|\|tab==='combat'\?'<button type="button" class="prepared-book-launch"/);
 assert.match(source,/>Spell Book<\/button>/,'quick access uses text without the large book icon');
 assert.match(source,/pages\.innerHTML=renderPreparedPages\(character\(\),quickBookLevel\)/);
 assert.match(source,/case 'open-prepared-book':openPreparedBook\(el\)/);
 assert.match(source,/case 'close-prepared-book':closePreparedBook\(\)/);
});
