import test from 'node:test';
import assert from 'node:assert/strict';
import {safeCharacterFilename,exportFilename} from '../src/export-filename.js';
import {makeCharacter} from '../src/model.js';
import {backupJSON} from '../src/backup.js';
import {readFileSync} from 'node:fs';

const date=new Date(2026,10,15,23,30);
test('export uses the selected character name and local calendar date',()=>{
  const one=makeCharacter('Pyreth Fernshade'),two=makeCharacter('Benedict Dawnshield');
  const library={characters:[one,two],selectedId:two.id};
  assert.equal(exportFilename(library,date),'Benedict Dawnshield - 2026-11-15.json');
  library.selectedId=one.id;
  assert.equal(exportFilename(library,date),'Pyreth Fernshade - 2026-11-15.json');
  assert.equal(JSON.parse(backupJSON(library)).characters.length,2,'backup still contains all characters');
});
test('invalid Windows filename characters, reserved names and empty names are handled safely',()=>{
  assert.equal(safeCharacterFilename('Ada / the: Brave? *Mage*'),'Ada the Brave Mage');
  assert.equal(safeCharacterFilename('   ...   '),'Adventurer');
  assert.equal(safeCharacterFilename('con'),'Character con');
  assert.equal(safeCharacterFilename('LPT2'),'Character LPT2');
  assert.equal(safeCharacterFilename('Renethal. '),'Renethal');
  assert.equal(safeCharacterFilename('x'.repeat(400)).length,80);
  assert.equal(safeCharacterFilename('Fey\nPrincess'),'Fey Princess');
  assert.equal(exportFilename({characters:[],selectedId:'none'},date),'Adventurer - 2026-11-15.json');
});
test('the Export action uses the filename helper without changing JSON export',()=>{
  const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  assert.match(main,/link\.download=exportFilename\(library\)/);
  assert.match(main,/new Blob\(\[backupJSON\(library\)\]/);
});
