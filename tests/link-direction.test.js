import test from 'node:test';import assert from 'node:assert/strict';
import {makeCharacter} from '../src/model.js';import {prepareNotes,linkNotes,unlinkNote,backlinks} from '../src/notebook.js';
const pair=()=>{const c=makeCharacter();c.notes=[{id:'a',title:'A',links:[]},{id:'b',title:'B',links:[]}];return c;};
test('one-way link creates an incoming backlink without a reverse outgoing link',()=>{const c=pair();linkNotes(c,'a','b','one-way');assert.deepEqual(c.notes[0].links,['b']);assert.deepEqual(c.notes[1].links,[]);assert.deepEqual(backlinks(c,'b').map(n=>n.id),['a']);});
test('two-way link is reciprocal and removal cleans both directions',()=>{const c=pair();linkNotes(c,'a','b','two-way');assert.deepEqual(c.notes[0].links,['b']);assert.deepEqual(c.notes[1].links,['a']);assert.equal(c.notes[1].linkModes.a,'two-way');unlinkNote(c,'a','b');assert.deepEqual(c.notes[0].links,[]);assert.deepEqual(c.notes[1].links,[]);});
test('legacy one-way links remain one-way without metadata',()=>{const c=pair();c.notes[0].links=['b'];prepareNotes(c);assert.deepEqual(c.notes[1].links,[]);assert.deepEqual(backlinks(c,'b').map(n=>n.id),['a']);});
