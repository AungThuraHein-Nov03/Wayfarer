import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import viteConfig from '../vite.config.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Vite builds links relative to the GitHub Pages project directory',()=>{
 assert.equal(viteConfig.base, './');
 assert.match(read('index.html'),/src\/main\.js/);
});
test('GitHub Pages workflow builds and tests, then deploys dist',()=>{
 const yaml=read('.github/workflows/deploy.yml');
 for(const required of ['branches:', 'main','npm ci','npm test','npm run build','actions/upload-pages-artifact@v4','actions/deploy-pages@v4','path: dist','id-token: write']){
   assert.ok(yaml.includes(required), 'Missing deployment setting: '+required);
 }
});
test('repository ignore patterns keep user backups and generated builds out of Git',()=>{
 const ignore=read('.gitignore');
 for(const required of ['node_modules/','dist/','.env','wayfarer-backup-*.json','backups/']){
   assert.ok(ignore.includes(required), 'Missing ignore rule: '+required);
 }
});
