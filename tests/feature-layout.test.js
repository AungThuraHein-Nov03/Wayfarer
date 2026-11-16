import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/feature-groups.css',import.meta.url),'utf8');

test('Features & Resources has a closed-by-default top-level dropdown on both tabs',()=>{
 assert.match(source,/const featureSectionOpen=\{sheet:false,combat:false\}/);
 assert.match(source,/function collapsibleFeatureSection\(c,body\)/);
 assert.match(source,/<details class="panel feature-section"/);
 assert.match(source,/function groupedFeatures\(c\)\{ensureStructured\(c\);return collapsibleFeatureSection\(c,/);
 assert.match(source,/if\(key==='features'\)return groupedFeatures\(c\)/);
 assert.match(source,/featureSectionOpen\[tab\]=!featureHeader\.parentElement\.open/);
 assert.match(css,/\.feature-section > \.feature-section-summary\{/);
 assert.match(css,/\.feature-section > \.feature-section-body\{/);
});

test('Feats and grouped feature cards share a single aligned chevron',()=>{
 assert.match(css,/\.feature-card>summary::marker\{content:''/);
 assert.match(css,/\.feature-card>summary::-webkit-details-marker\{display:none\}/);
 assert.match(css,/\.feature-card-chevron::before\{/);
 assert.match(css,/\.feature-card\[open\] \.feature-card-chevron::before\{/);
 assert.match(source,/function compactFeatureSection\(c,key\)/);
 const renderer=readFileSync(new URL('../src/feature-cards.js',import.meta.url),'utf8');
 assert.match(renderer,/class="feature-card-chevron" aria-hidden="true"/);
});
