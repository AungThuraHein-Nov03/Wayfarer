import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const styles=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');

test('Heroic Inspiration checkboxes share aligned labels on both character and combat pages',()=>{
 const labels=[...main.matchAll(/<label class="inspiration-toggle"><input type="checkbox" data-check-field="inspiration" /g)];
 assert.equal(labels.length,2);
 assert.match(styles,/\.inspiration-toggle\s*\{[^}]*display:\s*inline-flex;[^}]*align-items:\s*center;/);
 assert.match(styles,/\.inspiration-toggle input\[type="checkbox"\]\s*\{[^}]*margin:\s*0;/);
 assert.match(main,/if\(el\.dataset\.checkField\)\{edit\(el\.dataset\.checkField,el\.checked\);render\(\);\}/);
});
