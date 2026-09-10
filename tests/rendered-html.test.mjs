import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {pathToFileURL} from 'node:url';
const workerUrl=new URL('../dist/server/index.js',import.meta.url);
const {default:worker}=await import(workerUrl.href);
for(const path of ['/','/learn','/library','/parent','/teacher','/diagnostic','/join','/about-our-content','/bridge'])test(`renders ${path} from the production Worker`,async()=>{
 const response=await worker.fetch(new Request(`http://localhost${path}`,{headers:{accept:'text/html'}}),{ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},{waitUntil(){},passThroughOnException(){}});
 assert.equal(response.status,200);assert.match(response.headers.get('content-type')||'',/text\/html/);const html=await response.text();assert.doesNotMatch(html,/Internal Server Error|ReferenceError|is not defined/);if(path==='/')assert.match(html,/My learning/);if(path==='/teacher')assert.match(html,/Teacher|teacher|TEACHER/);if(path==='/about-our-content')assert.match(html,/educator review pending/);
});
test('catalog indexes existing resources with unique IDs and valid links',async()=>{const rows=JSON.parse(await readFile(new URL('../src/data/worksheetCatalog.json',import.meta.url),'utf8'));assert.equal(rows.length,4200);assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);for(const row of rows){const url=new URL(row.href);assert.equal(url.hostname,'worksheets.atollingo.com');assert.ok(url.searchParams.has('item'));assert.ok(row.frameworkLevel>=1&&row.frameworkLevel<=7)}});
