import test from 'node:test';import assert from 'node:assert/strict';
import {makeCharacter} from '../src/model.js';
import {prepareNotes,filteredNotes,linkNotes,unlinkNote,removeNote} from '../src/notebook.js';
const fixture=()=>{const c=makeCharacter('Hawk');c.notes=[{id:'a',title:'Old note',body:'First clue',tag:'NPC',updated:'2026-10-01',pinned:false},{id:'b',title:'Quest',body:'Find a ring',tag:'Quest',updated:'2026-10-02',pinned:true}];return c;};
test('old notes gain optional fields without losing contents',()=>{const c=fixture();prepareNotes(c);assert.equal(c.notes[0].body,'First clue');assert.equal(c.notes[0].category,'NPC');assert.deepEqual(c.notes[0].links,[]);});
test('filtering search categories sorting and pins',()=>{const c=fixture();assert.equal(filteredNotes(c,{category:'NPC'}).length,1);assert.equal(filteredNotes(c,{search:'ring'})[0].id,'b');assert.equal(filteredNotes(c)[0].id,'b');});
test('note linking rejects self links and removed note references are cleaned',()=>{const c=fixture();assert.equal(linkNotes(c,'a','a'),false);assert.equal(linkNotes(c,'a','b'),true);assert.equal(linkNotes(c,'a','b'),true);assert.deepEqual(c.notes[0].links,['b']);assert.equal(unlinkNote(c,'a','b'),true);assert.deepEqual(c.notes[0].links,[]);linkNotes(c,'a','b');removeNote(c,'b');assert.deepEqual(c.notes[0].links,[]);});
test('different character notebooks are independent',()=>{const a=fixture(),b=makeCharacter('Iris');prepareNotes(b);assert.equal(b.notes.length,0);assert.equal(a.notes.length,2);});
