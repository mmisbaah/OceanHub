// Scale whole screens only when their responsive layout still needs more room.
// No content is cut off and no wheel/touch interception is needed.
(()=>{
 const main=document.getElementById('app-container');
 const modal=document.getElementById('modal-content');
 let queued=false;
 const observed=new WeakSet();
 const resize=new ResizeObserver(()=>schedule());
 function observe(el){if(!observed.has(el)){resize.observe(el);observed.add(el);}}
 function fit(){
  queued=false;
  let stage=main.firstElementChild;
  if(!stage?.classList.contains('viewport-stage')){
   stage=document.createElement('div');stage.className='viewport-stage';
   stage.append(...main.childNodes);main.append(stage);observe(stage);
  }
  const style=getComputedStyle(main);
  const available=main.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
  // offsetHeight is unaffected by the current transform.
  const natural=Math.max(stage.offsetHeight,stage.scrollHeight);
  const scale=Math.min(1,Math.max(0,available-4)/Math.max(1,natural));
  stage.style.transform=`scale(${scale})`;
  if(!document.getElementById('modal-overlay').classList.contains('hidden')){
   const bounds=window.visualViewport;
   const height=bounds?.height||innerHeight;
   const width=bounds?.width||innerWidth;
   const modalScale=Math.min(1,(height-28)/Math.max(1,modal.scrollHeight),(width-28)/Math.max(1,modal.offsetWidth));
   modal.style.transform=`scale(${modalScale})`;
  }
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(fit);}}
 new MutationObserver(schedule).observe(main,{childList:true,subtree:true,characterData:true});
 new MutationObserver(schedule).observe(modal,{childList:true,subtree:true,characterData:true});
 new MutationObserver(schedule).observe(document.getElementById('modal-overlay'),{attributes:true,attributeFilter:['class']});
 [main,modal,document.querySelector('header'),document.querySelector('footer')].forEach(observe);
 window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);
 window.addEventListener('load',schedule);document.fonts.ready.then(schedule);schedule();
})();
