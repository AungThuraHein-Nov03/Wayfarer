import test from 'node:test';import assert from 'node:assert/strict';import {formatNote} from '../src/note-format.js';
test('headings emphasis and lists render as safe HTML',()=>{const html=formatNote('# Clues\n**Aldric** met *Pyreth*\n- key\n- map');assert.match(html,/<h1>Clues<\/h1>/);assert.match(html,/<strong>Aldric<\/strong>/);assert.match(html,/<em>Pyreth<\/em>/);assert.match(html,/<ul><li>key<\/li><li>map<\/li><\/ul>/);});
test('HTML and script payloads are escaped before formatting',()=>{const html=formatNote('<img src=x onerror=alert(1)>\n**<script>alert(2)</script>**');assert.doesNotMatch(html,/<script>|<img/);assert.match(html,/&lt;script&gt;/);});
test('legacy plain-text entries remain readable',()=>assert.match(formatNote('Original journal entry'),/Original journal entry/));
