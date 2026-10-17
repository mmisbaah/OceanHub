// Pure, seeded generators: each puzzle has a bounded, computable answer.
const PrismaraGenerator=(()=>{
 const ROUNDS=5,LEVELS=12;
 const hash=value=>{let h=2166136261;for(const c of String(value))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
 function random(seed){let a=hash(seed);return()=>{a+=0x6D2B79F5;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 const lcm=values=>values.reduce((a,b)=>a*b/gcd(a,b),1);
 const pick=(rng,items)=>items[Math.floor(rng()*items.length)];
 function shuffle(rng,items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
 const shapeKeys=['circle','square','triangle','diamond'];
 const shapeName=k=>k[0].toUpperCase()+k.slice(1);
 const patterns={1:['AB','AAB','ABB'],2:['ABC','AABB','ABBC','ABAC'],3:['ABCD','ABBA','AABC','ABCB','ABCC']};
 function generate(spec,seed){
  const rng=random(seed),d=spec.difficulty||Math.ceil((spec.level||1)/4);
  const mission={id:spec.id,title:spec.title,type:spec.type,difficulty:d,seed:String(seed)};
  if(spec.type==='sequence'){
   const pattern=pick(rng,patterns[d]),symbols=shuffle(rng,shapeKeys);
   mission.basePattern=[...pattern].map(c=>symbols[c.charCodeAt(0)-65]);
   const min=Math.max(4,pattern.length+2);mission.preFilled=min+Math.floor(rng()*(8-min));
   mission.rule=pattern+' repeating group';
   mission.hint='Repeat this group: '+mission.basePattern.map(shapeName).join(', ')+'. Start again after the last shape.';
  }else if(spec.type==='bridge'){
   const count=d===1?2:d===2?3:pick(rng,[3,4]);
   mission.shapeCycle=shuffle(rng,shapeKeys).slice(0,count);
   const styles=shuffle(rng,['solid','dashed','dotted']);
   mission.strokeCycle=d===1?styles.slice(0,2):pick(rng,[styles,[styles[0],styles[0],styles[1]],[styles[0],styles[1],styles[0]]]);
   const min=Math.max(count,mission.strokeCycle.length)+1;mission.targetIndex=min+Math.floor(rng()*(7-min));
   mission.rule='Shape and outline cycles';
   mission.hint='Shapes: '+mission.shapeCycle.map(shapeName).join(', ')+'. Outlines: '+mission.strokeCycle.join(', ')+'. Each group repeats on its own.';
  }else if(spec.type==='signal'){
   const pairs=[],triples=[];const limit=d===1?8:12;
   for(let a=2;a<=limit;a++)for(let b=a+1;b<=limit;b++)if(lcm([a,b])<=24)pairs.push([a,b]);
   for(let a=2;a<=12;a++)for(let b=a+1;b<=12;b++)for(let c=b+1;c<=12;c++)if(lcm([a,b,c])<=24)triples.push([a,b,c]);
   const periods=shuffle(rng,pick(rng,d===3?triples:pairs));
   const colors=['#FDCB6E','#00CEC9','#FF7675'];
   mission.signals=periods.map((period,i)=>({name:String.fromCharCode(65+i),period,color:colors[i]}));
   mission.maxBeats=Math.min(24,Math.max(12,lcm(periods)+Math.floor(rng()*3)));
   mission.rule=periods.length+' lantern rhythms';
   mission.hint=mission.signals.map(s=>'Light '+s.name+' blinks every '+s.period+' beats.').join(' ')+' Move the beat until every light blinks. Find the first shared beat after zero.';
  }else throw Error('Unknown puzzle type: '+spec.type);
  return mission;
 }
 function answer(m){if(m.type==='sequence')return m.basePattern[m.preFilled%m.basePattern.length];if(m.type==='bridge')return{shape:m.shapeCycle[m.targetIndex%m.shapeCycle.length],stroke:m.strokeCycle[m.targetIndex%m.strokeCycle.length]};return lcm(m.signals.map(s=>s.period));}
 function fingerprint(m){return JSON.stringify([m.type,m.basePattern,m.preFilled,m.shapeCycle,m.strokeCycle,m.targetIndex,m.signals?.map(s=>s.period)]);}
 function freshSeed(){if(globalThis.crypto?.getRandomValues){const n=new Uint32Array(2);crypto.getRandomValues(n);return n.join('-');}return Date.now()+'-'+Math.random();}
 function next(spec,seed,round,previous,history=[]){const blocked=new Set([...history,previous]);for(let n=0;n<1000;n++){const m=generate(spec,seed+':'+round+':'+n);if(!blocked.has(fingerprint(m)))return m;}if(history.length)return next(spec,seed,round,previous,history.slice(Math.max(1,Math.ceil(history.length/4))));throw Error('Could not generate a different puzzle');}
 return{ROUNDS,LEVELS,generate,answer,fingerprint,next,freshSeed,lcm,random};
})();
for(const [zoneKey,zone]of Object.entries(MISSIONS)){
 const prefix={pathways:'p',gardens:'g',bridge:'b',signal:'s'}[zoneKey];
 const type=zone.missions[0].type;
 for(let i=0;i<PrismaraGenerator.LEVELS;i++){
  if(!zone.missions[i])zone.missions.push({id:prefix+(i+1),title:'Level '+(i+1),type});
  Object.assign(zone.missions[i],{level:i+1,difficulty:Math.ceil((i+1)/4),rounds:PrismaraGenerator.ROUNDS});
 }
}
const CAMPAIGN_LEVELS=Object.values(MISSIONS).reduce((n,z)=>n+z.missions.length,0);
