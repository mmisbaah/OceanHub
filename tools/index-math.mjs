import fs from 'node:fs';
import {allLessons} from '../../MathLagoon/Math Lagoon Maldives/content/lessons/index.ts';
import {curriculumObjectives} from '../../MathLagoon/Math Lagoon Maldives/content/curriculum/objectives.ts';
const mathSkills=Object.fromEntries(curriculumObjectives.map(o=>[`MATH_${o.id}`,o.statement]));
const mathSkillResources=Object.fromEntries(curriculumObjectives.map(o=>{const lesson=allLessons.find(l=>l.objectiveIds.includes(o.id));return [`MATH_${o.id}`,{href:`https://lagoon.mathlagoon.com/lessons/${lesson.id}`,title:o.statement}]}));
fs.writeFileSync('src/data/mathSkills.js',`export const mathSkills=${JSON.stringify(mathSkills)};\nexport const mathSkillResources=${JSON.stringify(mathSkillResources)};\n`);
const resources=allLessons.map(l=>({id:`math-${l.id}`,title:l.title,subject:'Mathematics',gradeLevel:l.grade,frameworkLevel:Math.min(7,l.grade+1),curriculumOutcomeCode:`MATH_${l.objectiveIds[0]}`,language:'English',activityType:'Lesson',estimatedMinutes:l.estimatedMinutes||10,isPrintable:false,offlineAvailable:false,strand:l.topicId,keyStage:l.grade<=3?'Key Stage 1':'Key Stage 2',topics:[l.topicId,...l.objectiveIds.map(id=>mathSkills[`MATH_${id}`])],href:`https://lagoon.mathlagoon.com/lessons/${l.id}`,reviewStatus:'Existing MathLagoon content; internal objective mapping'}));
fs.writeFileSync('src/data/mathCatalog.js',`export const mathCatalog=${JSON.stringify(resources)};\n`);
console.log(`Indexed ${resources.length} maths lessons and ${curriculumObjectives.length} objectives.`);
