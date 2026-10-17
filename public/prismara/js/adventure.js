// Multi-question level sessions. Completed legacy level IDs remain valid.
PrismaraGame.prototype.updateHUD=function(){document.getElementById('global-stars').textContent=this.totalStars()+' / '+CAMPAIGN_LEVELS*3;document.getElementById('global-streak').textContent=this.state.streak;};
PrismaraGame.prototype.beginPuzzleRound=function(run){
 this.lastGenerated=this.lastGenerated||{};const key=run.zone+':'+run.spec.id;
 const mission=PrismaraGenerator.next(run.spec,run.seed,run.round,run.previous||this.lastGenerated[key]);
 run.previous=PrismaraGenerator.fingerprint(mission);this.lastGenerated[key]=run.previous;mission.title=run.practice?'Surprise puzzle':`Puzzle ${run.round+1} of ${PrismaraGenerator.ROUNDS}`;
 this.currentMission={zone:run.zone,missionId:run.spec.id,mission,hintsUsed:0,placed:null,inLighthouse:!!run.lighthouse,lighthouseChannel:run.channel,run};
 document.getElementById('hint-btn').classList.remove('hidden');this.renderPuzzle();
};
PrismaraGame.prototype.startMission=function(zone,id){
 const spec=MISSIONS[zone]?.missions.find(m=>m.id===id);if(!spec)return;
 audioSystem.playClick();this.state.activeZone=zone;
 this.beginPuzzleRound({zone,spec,seed:PrismaraGenerator.freshSeed(),round:0,stars:3,practice:false});
};
PrismaraGame.prototype.startLighthouseChannel=function(index){
 if(!Object.keys(MISSIONS).every(z=>this.zoneComplete(z)))return;
 const channel=LIGHTHOUSE_CHANNELS[index];if(!channel)return;
 this.beginPuzzleRound({zone:'lighthouse',spec:{...channel,title:channel.name,difficulty:3},seed:PrismaraGenerator.freshSeed(),round:0,stars:3,lighthouse:true,channel:index});
};
PrismaraGame.prototype.startPractice=function(zone){
 const unlocked=MISSIONS[zone].missions.filter((m,i,a)=>i===0||this.state.progress[zone][a[i-1].id]);
 const spec=unlocked[Math.floor(Math.random()*unlocked.length)];
 this.beginPuzzleRound({zone,spec,seed:PrismaraGenerator.freshSeed(),round:0,stars:3,practice:true});
};
PrismaraGame.prototype.handleSuccess=function(zone,mission,message){
 const current=this.currentMission;if(current.answered)return;current.answered=true;
 const run=current.run;if(!run)return;
 audioSystem.playSuccess();this.celebrate();this.state.streak++;this.updateHUD();
 run.stars=Math.min(run.stars,Math.max(1,3-current.hintsUsed));
 if(run.practice){this.showModal('You found it!',`<p>${message}</p><p>Ready for a new surprise?</p>`,true,()=>{run.round++;this.beginPuzzleRound(run);});return;}
 const finished=run.round+1===PrismaraGenerator.ROUNDS;
 let next;
 if(finished){
  if(run.lighthouse){this.lighthouseDone[run.channel]=true;try{localStorage.setItem('prismara_beacon',JSON.stringify(this.lighthouseDone));}catch{}next=()=>this.openLighthouse();}
  else{this.completeMission(zone,run.spec.id,run.stars);const levels=MISSIONS[zone].missions;const index=levels.findIndex(m=>m.id===run.spec.id);next=()=>index+1<levels.length?this.startMission(zone,levels[index+1].id):this.openZone(zone);}
 }else next=()=>{run.round++;this.beginPuzzleRound(run);};
 this.showModal(finished?(run.lighthouse?'Light connected!':'Level complete!'):'You found it!',`<p>${message}</p><p>${finished?`All ${PrismaraGenerator.ROUNDS} puzzles solved! ${'★'.repeat(run.stars)}`:`${run.round+1} of ${PrismaraGenerator.ROUNDS} puzzles solved.`}</p>`,true,next);
};
PrismaraGame.prototype.openZone=function(zoneKey,page){
 audioSystem.playClick();this.state.activeZone=zoneKey;this.currentMission=null;document.getElementById('hint-btn').classList.add('hidden');
 const island=KID_ISLANDS.find(i=>i.key===zoneKey),zone=MISSIONS[zoneKey],progress=this.state.progress[zoneKey];
 const first=zone.missions.findIndex(m=>!progress[m.id]);
 const pages=Math.ceil(zone.missions.length/2);page=page===undefined?Math.floor(Math.max(0,first)/2):Math.max(0,Math.min(pages-1,page));
 this.setPrompt('Each level has five puzzles. Pick a level.');
 const levels=zone.missions.slice(page*2,page*2+2);
 document.getElementById('app-container').innerHTML=`<section class="kid-screen kid-zone kid-levels">${kidHeading(island.name,'game.goHome()')}<div class="kid-missions">${levels.map((m,j)=>{const i=page*2+j,score=progress[m.id],locked=i>0&&!progress[zone.missions[i-1].id];return `<button class="kid-mission" ${locked?'disabled':''} onclick="game.startMission('${zoneKey}','${m.id}')"><span class="kid-mission-number">${i+1}</span><span><strong>Level ${i+1}</strong><small>${locked?'Finish the level before':score?'★'.repeat(score)+' · Play again':'5 new puzzles'}</small></span><b aria-hidden="true">${locked?'🔒':'→'}</b></button>`;}).join('')}</div><nav class="kid-pager" aria-label="Level pages"><button ${page===0?'disabled':''} onclick="game.openZone('${zoneKey}',${page-1})" aria-label="Previous levels">←</button><span>${page*2+1}–${Math.min(zone.missions.length,page*2+2)} of ${zone.missions.length}</span><button ${page===pages-1?'disabled':''} onclick="game.openZone('${zoneKey}',${page+1})" aria-label="Next levels">→</button></nav><button class="kid-practice" onclick="game.startPractice('${zoneKey}')">✦ Surprise puzzle</button></section>`;
};
// Dynamic totals also cover saved games made before more levels were added.
const campaignHub=PrismaraGame.prototype.renderHub;
PrismaraGame.prototype.renderHub=function(){campaignHub.call(this);const i=this.islandPage||0;const text=document.querySelector('.kid-progress');if(!text)return;const island=KID_ISLANDS[i];if(i===4){const done=Object.values(this.state.progress).reduce((n,z)=>n+Object.keys(z).length,0);text.textContent=done+' of '+CAMPAIGN_LEVELS+' light shards';}else text.textContent=Object.keys(this.state.progress[island.key]).length+' of '+MISSIONS[island.key].missions.length+' levels finished';};
const campaignLighthouse=PrismaraGame.prototype.openLighthouse;
PrismaraGame.prototype.openLighthouse=function(){campaignLighthouse.call(this);const ready=Object.keys(MISSIONS).every(z=>this.zoneComplete(z));const instruction=document.querySelector('.kid-lighthouse>.kid-instruction');if(!ready){instruction.textContent='Finish all '+CAMPAIGN_LEVELS+' levels to unlock.';this.setPrompt('Finish the island levels to unlock the lighthouse.');}else{document.querySelectorAll('.kid-channels button').forEach(b=>b.disabled=false);}const tip=document.querySelector('.kid-lighthouse>p:last-child');if(tip&&tip!==instruction)tip.textContent='Five puzzles connect each light.';};
PrismaraGame.prototype.openCodex=function(){this.showModal('How to play',`<p><b>1. Pick an island and a level.</b><br>Each island has ${PrismaraGenerator.LEVELS} levels.</p><p><b>2. Solve five puzzles.</b><br>Every play gives you fresh patterns!</p><p><b>3. Ask for help.</b><br>Hint and Listen are always here.</p><p><b>4. Collect ${CAMPAIGN_LEVELS} light shards.</b><br>Then solve the lighthouse puzzles.</p><p><b>Want extra practice?</b><br>Tap Surprise puzzle for endless new problems.</p>`,false);};
