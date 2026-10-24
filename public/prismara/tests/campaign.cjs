let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/Misba/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4187');await page.waitForSelector('.kid-screen');
 await page.getByRole('button',{name:'Sail to Shell Beach',exact:true}).click();await page.getByRole('button',{name:'Level 1: Pearl Landing',exact:true}).click();await page.getByRole('button',{name:'Start puzzles',exact:true}).click();
 assert.equal(await page.evaluate(()=>game.currentMission.run.round),0);
 // Seed migration with old completed IDs; expanded loading must retain them.
 await page.evaluate(()=>localStorage.setItem('prismara_progress_v2',JSON.stringify({pathways:{p1:2,p2:3},gardens:{g1:1},bridge:{},signal:{}})));
 await page.reload();await page.waitForSelector('.kid-screen');assert.equal(await page.evaluate(()=>game.state.progress.pathways.p2),3);assert.equal(await page.evaluate(()=>game.state.progress.gardens.g1),1);
 await page.evaluate(()=>{for(const key of Object.keys(MISSIONS))game.state.progress[key]={};game.saveProgress();game.goHome();localStorage.setItem('unrelated-app','keep');});
 const seen=new Set(); async function solveRound(){const sig=await page.evaluate(()=>({key:PrismaraGenerator.fingerprint(game.currentMission.mission),practice:game.currentMission.run.practice}));if(!sig.practice){assert.ok(!seen.has(sig.key),'Campaign puzzle repeated');seen.add(sig.key);}await page.evaluate(()=>{
  const m=game.currentMission.mission,a=PrismaraGenerator.answer(m);
  if(m.type==='sequence'){game.pickSequence(a);game.verifySequence();}
  else if(m.type==='bridge'){game.pickBridgeShape(a.shape);game.pickBridgeStroke(a.stroke);game.verifyBridge();}
  else{document.getElementById('signal-input').value=a+'.5';game.verifySignal();if(game.currentMission.answered)throw Error('Fraction accepted');document.getElementById('signal-input').value=a;game.verifySignal();}
 });await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'CONTINUE',exact:true}).click();await page.waitForTimeout(15);}
 let count=0;
 for(const zone of ['pathways','gardens','bridge','signal']){
  const ids=await page.evaluate(z=>MISSIONS[z].missions.map(m=>m.id),zone);assert.equal(ids.length,12);
  for(const id of ids){await page.evaluate(({zone,id})=>game.startMission(zone,id),{zone,id});let previous;
   for(let round=0;round<5;round++){
    const state=await page.evaluate(()=>({round:game.currentMission.run.round,fingerprint:PrismaraGenerator.fingerprint(game.currentMission.mission)}));assert.equal(state.round,round);assert.notEqual(state.fingerprint,previous);previous=state.fingerprint;
    assert.equal(await page.evaluate(({zone,id})=>game.state.progress[zone][id]||0,{zone,id}),0,'no shard before all five questions');
    await solveRound();count++;
   }
   assert.equal(await page.evaluate(({zone,id})=>game.state.progress[zone][id],{zone,id}),3);
  }
 }
 assert.equal(await page.evaluate(()=>game.totalStars()),144);console.log('PASS all 240 island questions with distinct problems');assert.match(await page.locator('#global-stars').innerText(),/144 \/ 144/);
 for(let channel=0;channel<4;channel++){
  await page.evaluate(i=>game.startLighthouseChannel(i),channel);
  for(let round=0;round<5;round++){assert.equal(await page.evaluate(i=>game.lighthouseDone[i],channel),false);await solveRound();count++;}
  assert.equal(await page.evaluate(i=>game.lighthouseDone[i],channel),true);
 }
 await page.reload();await page.waitForSelector('.kid-screen');assert.equal(await page.evaluate(()=>game.totalStars()),144);assert.equal(await page.evaluate(()=>game.lighthouseDone.every(Boolean)),true);assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-app')),'keep');
 await page.evaluate(()=>game.startPractice('signal'));const baseline=await page.evaluate(()=>game.totalStars());
 for(let n=0;n<8;n++)await solveRound();assert.equal(await page.evaluate(()=>game.totalStars()),baseline);assert.equal(await page.evaluate(()=>game.currentMission.run.practice),true);
 await page.getByRole('button',{name:'▶ Run lights'}).click();await page.waitForTimeout(750);assert.match(await page.locator('#beat-readout').innerText(),/Beat [1-9]/);await page.getByRole('button',{name:'Ⅱ Pause lights'}).click();
 await page.evaluate(()=>game.openSettings());await page.getByRole('button',{name:'Reduced motion: off'}).click();assert.equal(await page.evaluate(()=>document.body.classList.contains('motion-paused')),true);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS '+count+' campaign puzzles, 48 level rewards, 4 five-puzzle lighthouse channels, migration, saved progress, unlimited practice, fractional rejection, and animation.');
})().catch(e=>{console.error(e);process.exit(1)});

