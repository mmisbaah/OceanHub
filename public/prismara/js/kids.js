// Child-facing screens use short copy, large type, and one decision at a time.
const KID_ISLANDS=[
 {key:'pathways',name:'Shell Beach',symbol:'◉',line:'Find the missing shape.'},
 {key:'gardens',name:'Coral Garden',symbol:'✿',line:'Help the patterns grow.'},
 {key:'bridge',name:'Tide Bridges',symbol:'⌁',line:'Match shapes and outlines.'},
 {key:'signal',name:'Lantern Lab',symbol:'☼',line:'Make the lights blink together.'},
 {key:'lighthouse',name:'Lighthouse',symbol:'♜',line:'Bring light to the lagoon!'}
];
function kidShape(key,stroke='solid'){
 if(!key)return '<span class="kid-tile unknown" aria-label="Missing shape">?</span>';
 const paths={circle:'<circle cx="30" cy="30" r="20"/>',square:'<rect x="11" y="11" width="38" height="38" rx="3"/>',triangle:'<path d="M30 8 53 50H7Z"/>',diamond:'<path d="m30 5 25 25-25 25L5 30Z"/>'};
 return `<span class="kid-tile" style="border-style:${stroke}" role="img" aria-label="${SHAPES[key].name}, ${stroke} outline"><svg viewBox="0 0 60 60" aria-hidden="true" fill="${SHAPES[key].color}" stroke="#123e52" stroke-width="2">${paths[key]}</svg></span>`;
}
function kidHeading(title,back='game.backFromMission()'){return `<div class="kid-heading"><button class="kid-back" onclick="${back}" aria-label="Back">← Back</button><h2>${title}</h2></div>`;}
PrismaraGame.prototype.renderHub=function(){
 this.currentMission=null;this.state.activeZone='hub';document.getElementById('hint-btn').classList.add('hidden');
 const index=this.islandPage||0,island=KID_ISLANDS[index];
 const shards=Object.values(this.state.progress).reduce((n,z)=>n+Object.keys(z).length,0);
 const done=index===4?this.lighthouseDone.filter(Boolean).length:Object.keys(this.state.progress[island.key]).length;
 this.setPrompt('Choose an island. Tap Play to begin!');
 document.getElementById('app-container').innerHTML=`<section class="kid-screen kid-hub"><div class="kid-heading"><h2>Pick an island</h2><button class="kid-back" onclick="game.openCodex()" aria-label="How to play">? Help</button></div><div class="kid-island island-${index}"><span class="kid-island-art" aria-hidden="true">${island.symbol}</span><div class="kid-island-info"><h3>${island.name}</h3><p>${island.line}</p><p class="kid-progress">${index===4?`${shards} of 12 light shards`:`${done} of 3 puzzles finished`}</p><button class="kid-primary" onclick="${index===4?'game.openLighthouse()':`game.openZone('${island.key}')`}">${index===4?'Visit lighthouse':'Play'} <span aria-hidden="true">→</span></button></div></div><nav class="kid-pager" aria-label="Choose island"><button onclick="game.changeIsland(-1)" aria-label="Previous island">←</button><span>${index+1} of 5</span><button onclick="game.changeIsland(1)" aria-label="Next island">→</button></nav></section>`;
};
PrismaraGame.prototype.changeIsland=function(step){this.islandPage=((this.islandPage||0)+step+5)%5;audioSystem.playClick();this.renderHub();};
PrismaraGame.prototype.openZone=function(zoneKey){
 audioSystem.playClick();this.state.activeZone=zoneKey;this.currentMission=null;document.getElementById('hint-btn').classList.add('hidden');
 const island=KID_ISLANDS.find(i=>i.key===zoneKey),zone=MISSIONS[zoneKey];
 this.setPrompt('Pick a puzzle. Finish one to unlock the next.');
 document.getElementById('app-container').innerHTML=`<section class="kid-screen kid-zone">${kidHeading(island.name,'game.goHome()')}<p class="kid-instruction">Pick a puzzle</p><div class="kid-missions">${zone.missions.map((m,i)=>{const score=this.state.progress[zoneKey][m.id];const locked=i>0&&!this.state.progress[zoneKey][zone.missions[i-1].id];return `<button class="kid-mission" ${locked?'disabled':''} onclick="game.startMission('${zoneKey}','${m.id}')"><span class="kid-mission-number">${i+1}</span><span><strong>${m.title}</strong><small>${locked?'Finish the puzzle above':score?'★'.repeat(score):'Ready to play'}</small></span><b aria-hidden="true">${locked?'🔒':'→'}</b></button>`;}).join('')}</div></section>`;
};
PrismaraGame.prototype.renderSequencePuzzle=function(){
 const {mission:m,placed}=this.currentMission;
 this.setPrompt('What comes next? Pick a shape.');
 const sequence=this.generateSequence(m.basePattern,m.preFilled);
 const options=this.currentMission.options||(this.currentMission.options=this.getSequenceOptions(m.basePattern[m.preFilled%m.basePattern.length],m.basePattern.length));
 document.getElementById('app-container').innerHTML=`<section class="kid-screen kid-puzzle kid-sequence">${kidHeading(m.title)}<p class="kid-instruction">What comes next?</p><div class="kid-puzzle-layout"><div id="puzzle-canvas" class="kid-pattern">${sequence.map(k=>kidShape(k)).join('')}<span id="answer-slot">${kidShape(placed)}</span></div><div class="kid-answers">${options.map(k=>`<button class="kid-answer ${placed===k?'chosen':''}" aria-pressed="${placed===k}" onclick="game.pickSequence('${k}')">${kidShape(k)}<span>${SHAPES[k].name}</span></button>`).join('')}</div></div><button id="submit-btn" class="kid-primary" onclick="game.verifySequence()" ${placed?'':'disabled'}>Check pattern ✓</button></section>`;
};
PrismaraGame.prototype.renderBridgePuzzle=function(){
 const {mission:m,selShape,selStroke}=this.currentMission;
 this.setPrompt('Pick a shape and an outline.');
 document.getElementById('app-container').innerHTML=`<section class="kid-screen kid-puzzle kid-bridge">${kidHeading(m.title)}<div class="kid-instruction-row"><p class="kid-instruction">Match both rules.</p><button class="kid-back" onclick="game.showBridgeRules()">See rules</button></div><div class="kid-puzzle-layout"><div id="puzzle-canvas" class="kid-pattern">${Array.from({length:m.targetIndex},(_,i)=>kidShape(m.shapeCycle[i%m.shapeCycle.length],m.strokeCycle[i%m.strokeCycle.length])).join('')}<span id="answer-slot">${kidShape(selShape,selStroke||'solid')}</span></div><div class="kid-bridge-choices"><fieldset><legend>1. Pick a shape</legend><div class="kid-shape-choices">${m.shapeCycle.map(k=>`<button aria-pressed="${selShape===k}" onclick="game.pickBridgeShape('${k}')">${kidShape(k)}<span>${SHAPES[k].name}</span></button>`).join('')}</div></fieldset><fieldset><legend>2. Pick an outline</legend><div class="kid-stroke-choices">${[...new Set(m.strokeCycle)].map(s=>`<button aria-pressed="${selStroke===s}" onclick="game.pickBridgeStroke('${s}')"><span class="stroke-sample" style="border-top-style:${s}" aria-hidden="true"></span>${s[0].toUpperCase()+s.slice(1)}</button>`).join('')}</div></fieldset></div></div><button id="submit-btn" class="kid-primary" onclick="game.verifyBridge()" ${selShape&&selStroke?'':'disabled'}>Check bridge ✓</button></section>`;
};
PrismaraGame.prototype.showBridgeRules=function(){const m=this.currentMission.mission;this.showModal('Two repeating rules',`<p><b>Shapes repeat:</b><br>${m.shapeCycle.map(k=>SHAPES[k].name).join(' → ')}</p><p><b>Outlines repeat:</b><br>${m.strokeCycle.join(' → ')}</p>`,false);};
PrismaraGame.prototype.renderSignalPuzzle=function(){
 const m=this.currentMission.mission;
 this.setPrompt('When will all the lights blink together?');
 document.getElementById('app-container').innerHTML=`<section class="kid-screen kid-puzzle kid-signal">${kidHeading(m.title)}<p class="kid-instruction">When do all lights blink together?</p><div class="kid-puzzle-layout"><div id="puzzle-canvas" class="kid-signals">${m.signals.map((s,i)=>`<div class="kid-signal-row"><strong>Light ${s.name}: every ${s.period} beats</strong><div class="kid-beats" style="--beats:${m.maxBeats}" aria-label="Light ${s.name} pulses every ${s.period} beats">${Array.from({length:m.maxBeats},(_,b)=>`<span data-beat="${b+1}" class="${(b+1)%s.period===0?'pulse':''}" style="--pulse:${s.color}"></span>`).join('')}</div></div>`).join('')}<div class="kid-playback"><button id="run-signals" class="kid-back">▶ Run lights</button><output id="beat-readout">Beat 0</output></div><label class="kid-scrub">Move the beat<input id="beat-scrubber" type="range" min="0" max="${m.maxBeats}" value="0"></label></div><div class="kid-signal-answer"><label for="signal-input">First shared beat</label><input id="signal-input" aria-label="First shared beat" type="number" inputmode="numeric" min="1" max="${m.maxBeats}" step="1" placeholder="?"><button class="kid-primary" onclick="game.verifySignal()">Test lights ✓</button></div></div></section>`;
 const box=document.getElementById('puzzle-canvas');let beat=0,timer=null;
 const paint=()=>{if(!box.isConnected){clearInterval(timer);return;}box.querySelectorAll('[data-beat]').forEach(e=>e.classList.toggle('beat-active',Number(e.dataset.beat)===beat));box.querySelector('#beat-readout').textContent='Beat '+beat;box.querySelector('#beat-scrubber').value=beat;};
 box.querySelector('#run-signals').onclick=()=>{if(timer){clearInterval(timer);timer=null;box.querySelector('#run-signals').textContent='▶ Run lights';}else{box.querySelector('#run-signals').textContent='Ⅱ Pause lights';timer=setInterval(()=>{beat=beat%m.maxBeats+1;paint();},650);}};
 box.querySelector('#beat-scrubber').oninput=e=>{beat=Number(e.target.value);paint();};document.getElementById('signal-input').onkeydown=e=>{if(e.key==='Enter')this.verifySignal();};
};
PrismaraGame.prototype.openLighthouse=function(){
 this.currentMission=null;this.state.activeZone='lighthouse';document.getElementById('hint-btn').classList.add('hidden');
 const ready=Object.keys(MISSIONS).every(z=>this.zoneComplete(z));const done=this.lighthouseDone.filter(Boolean).length;
 this.setPrompt(ready?'Choose a light to connect.':'Finish all 12 island puzzles first.');
 document.getElementById('app-container').innerHTML=`<section class="kid-screen kid-lighthouse">${kidHeading('Lighthouse','game.goHome()')}<p class="kid-instruction">${ready?`${done} of 4 lights connected`:'Finish all 12 puzzles to unlock.'}</p><div class="kid-channels">${LIGHTHOUSE_CHANNELS.map((ch,i)=>`<button onclick="game.startLighthouseChannel(${i})" ${!ready||this.lighthouseDone[i]?'disabled':''}><span aria-hidden="true">${this.lighthouseDone[i]?'✓':'☼'}</span>Light ${i+1}</button>`).join('')}</div>${done===4?'<button class="kid-primary" onclick="game.grandFinale()">Light the beacon! ☀</button>':'<p class="kid-instruction">One puzzle. One little light.</p>'}</section>`;
};
PrismaraGame.prototype.openCodex=function(){this.showModal('How to play',`<p><b>1. Pick an island.</b><br>Tap Play to see its puzzles.</p><p><b>2. Look for the pattern.</b><br>Choose your answer. Tap Check.</p><p><b>3. Ask for help.</b><br>Tap Hint or Listen at any time.</p><p><b>4. Collect 12 light shards.</b><br>Then visit the lighthouse!</p>`,false);};
// Reuse existing callback/focus behavior, but paginate explanations instead of shrinking text.
const kidOriginalModal=PrismaraGame.prototype.showModal;
PrismaraGame.prototype.showModal=function(...args){kidOriginalModal.apply(this,args);const modal=document.getElementById('modal-content');modal.classList.add('kid-modal');const body=modal.firstElementChild.children[2];body.classList.add('kid-modal-body');body.querySelectorAll('i.fa-star').forEach(e=>e.setAttribute('aria-hidden','true'));};
// Readable helper: short prompts and a dedicated, always available Listen action.
const originalPrompt=PrismaraGame.prototype.setPrompt;
PrismaraGame.prototype.setPrompt=function(text){originalPrompt.call(this,text);};
document.querySelector('footer button').innerHTML='🔊 Listen';
document.querySelector('footer button').setAttribute('aria-label','Listen to the instructions');
document.getElementById('tts-btn').setAttribute('aria-label','Toggle automatic read-aloud');
document.querySelector('header h1').classList.add('kid-brand');
const kidFailure=PrismaraGame.prototype.handleFailure;
PrismaraGame.prototype.handleFailure=function(){const type=this.currentMission?.mission.type;const message=type==='bridge'?'Try again. Check both rules.':type==='signal'?'Try again. Watch the lights.':'Try again. Look for a repeat.';kidFailure.call(this,message);};
// Rewards belong in the success card, where they cannot cover a puzzle title.
PrismaraGame.prototype.toastAchievement=function(key){const overlay=document.getElementById('modal-overlay');if(!overlay.classList.contains('hidden')){const body=overlay.querySelector('.kid-modal-body');if(body){const badge=document.createElement('p');badge.textContent='★ New badge: '+ACHIEVEMENTS[key].name;body.append(badge);}}};
const kidSettings=PrismaraGame.prototype.openSettings;
PrismaraGame.prototype.openSettings=function(){kidSettings.call(this);const root=document.querySelector('#modal-content .space-y-3');if(root)root.insertAdjacentHTML('beforeend',`<label class="kid-age-setting">Explorer age <select aria-label="Explorer age" onchange="game.state.ageBand=this.value;game.savePreferences()">${['5-7','8-10','11-12'].map(age=>`<option ${age===this.state.ageBand?'selected':''}>${age}</option>`).join('')}</select></label>`);};
