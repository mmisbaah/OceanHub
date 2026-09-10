import fs from 'node:fs';
const bands=['tide','shallow','open','deep','voyage','navigator','horizon'];
const rows=[];
for(let level=1;level<=7;level++){
 const bank=JSON.parse(fs.readFileSync(`../AtollingoWorksheets/app/level${level}-bank.json`,'utf8'));
 for(const type of ['reading','cloze','detective','truefalse','scramble','sequence'])for(const [index,item]of (bank[type]||[]).entries())rows.push({id:`ws-${level}-${type}-${index}`,title:`${item.title} · ${type}`,subject:'English',gradeLevel:Math.min(5,Math.max(1,level-1)),frameworkLevel:level,curriculumOutcomeCode:`ENG_L${level}_${type.toUpperCase()}`,language:'English',activityType:type==='reading'?'Story':'Worksheet',estimatedMinutes:10,isPrintable:true,offlineAvailable:false,strand:type==='scramble'?'Writing & Representing':'Reading & Viewing',keyStage:level<=3?'Key Stage 1':'Key Stage 2',topics:[item.theme,...(item.focus||[]).slice(0,6)],href:`https://worksheets.atollingo.com/?band=${bands[level-1]}&activity=${type}&item=${index}`,source:'Atollingo Worksheets bank',reviewStatus:'Internal mapping; suggested grade, choose by framework level'});
}
fs.writeFileSync('src/data/worksheetCatalog.json',JSON.stringify(rows));
console.log(`Indexed ${rows.length} existing worksheet/story resources.`);
