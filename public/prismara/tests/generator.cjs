const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');const context=vm.createContext({console});
vm.runInContext(fs.readFileSync(path.join(root,'js/missions.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'js/generator.js'),'utf8')+'\n globalThis.factory=PrismaraGenerator;globalThis.levels=MISSIONS;',context);
const gen=context.factory,levels=context.levels;let count=0;
assert.equal(Object.values(levels).reduce((n,z)=>n+z.missions.length,0),48);
for(const zone of Object.values(levels)){assert.equal(zone.missions.length,12);for(const spec of zone.missions){const unique=new Set();for(let i=0;i<100;i++){
 const puzzle=gen.generate(spec,'sample-'+i),answer=gen.answer(puzzle);assert.equal(JSON.stringify(puzzle),JSON.stringify(gen.generate(spec,'sample-'+i)),'seed must be deterministic');
 unique.add(gen.fingerprint(puzzle));assert.ok(puzzle.hint.length>10);
 if(puzzle.type==='sequence'){assert.ok(puzzle.preFilled<=7&&puzzle.preFilled>=puzzle.basePattern.length+1);assert.ok(puzzle.basePattern.includes(answer));assert.ok(new Set(puzzle.basePattern).size>=2);}
 else if(puzzle.type==='bridge'){assert.ok(puzzle.targetIndex<=6);assert.ok(puzzle.targetIndex>=Math.max(puzzle.shapeCycle.length,puzzle.strokeCycle.length));assert.ok(puzzle.shapeCycle.includes(answer.shape));assert.ok(puzzle.strokeCycle.includes(answer.stroke));}
 else{assert.ok(Number.isInteger(answer)&&answer>0&&answer<=puzzle.maxBeats);assert.ok(puzzle.maxBeats<=24);for(let beat=1;beat<answer;beat++)assert.ok(puzzle.signals.some(s=>beat%s.period!==0),'answer must be the FIRST shared beat');for(const s of puzzle.signals)assert.equal(answer%s.period,0);}
 const next=gen.next(spec,'test',i,gen.fingerprint(puzzle));assert.notEqual(gen.fingerprint(next),gen.fingerprint(puzzle));count++;
 }assert.ok(unique.size>=8,'level should produce varied puzzles');}}
console.log('PASS '+count+' generated puzzles: deterministic seeds, varied patterns, bounded layouts, valid hints and answers, first-positive-beat solutions, no consecutive duplicates.');
