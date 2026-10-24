// Readable fixed-size text; longer dialogs use pages instead of scaling.
(()=>{
 const main=document.getElementById('app-container');
 const modal=document.getElementById('modal-content');
 let queued=false;
 const states=new WeakMap();
 function paginate(){
  const body=modal.querySelector('.kid-modal-body');if(!body||document.getElementById('modal-overlay').classList.contains('hidden'))return;
  let state=states.get(body);
  if(!state){let root=body;if(body.children.length===1&&body.firstElementChild.className.includes('space-y-'))root=body.firstElementChild;
   const nav=document.createElement('nav');nav.className='kid-modal-pages';nav.setAttribute('aria-label','Help pages');nav.innerHTML='<button aria-label="Previous help page">←</button><span></span><button aria-label="Next help page">→</button>';body.after(nav);
   state={root,nav,page:0,pages:[]};states.set(body,state);nav.children[0].onclick=()=>{state.page--;show(state);};nav.children[2].onclick=()=>{state.page++;show(state);};
  }
  const {root,nav}=state;nav.hidden=false;
  let nodes=[...root.children];nodes.forEach(n=>n.hidden=false);
  const view=window.visualViewport?.height||innerHeight;
  const fixed=modal.offsetHeight-body.offsetHeight;
  const budget=Math.max(70,view-36-fixed-8);
  for(let i=0;i<nodes.length;i++){
   const node=nodes[i];if(node.offsetHeight>budget&&node.children.length>1&&!['P','BUTTON'].includes(node.tagName)){
    const children=[...node.children];node.replaceWith(...children);nodes.splice(i,1,...children);i--;
   }
  }
  nodes.forEach(n=>n.hidden=true);let page=[];state.pages=[];
  for(const node of nodes){node.hidden=false;page.push(node);if(modal.offsetHeight>view-36&&page.length>1){node.hidden=true;page.pop();state.pages.push(page);page.forEach(n=>n.hidden=true);page=[node];node.hidden=false;}}
  if(page.length)state.pages.push(page);state.nodes=nodes;state.page=Math.max(0,Math.min(state.page,state.pages.length-1));show(state);
 }
 function show(state){const {nodes,pages,page,nav}=state;nodes.forEach(n=>n.hidden=true);pages[page]?.forEach(n=>n.hidden=false);nav.hidden=pages.length<=1;nav.children[0].disabled=page===0;nav.children[2].disabled=page>=pages.length-1;const label=`${page+1} of ${pages.length}`;if(nav.children[1].textContent!==label)nav.children[1].textContent=label;}
 function fit(){
  queued=false;
  let stage=main.firstElementChild;
  if(!stage?.classList.contains('viewport-stage')){
   stage=document.createElement('div');stage.className='viewport-stage';
   stage.append(...main.childNodes);main.append(stage);
  }
  stage.style.transform='none';modal.style.transform='none';paginate();
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(fit);}}
 new MutationObserver(schedule).observe(main,{childList:true,subtree:true});
 new MutationObserver(schedule).observe(modal,{childList:true,subtree:true});
 new MutationObserver(schedule).observe(document.getElementById('modal-overlay'),{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);
 window.addEventListener('load',schedule);document.fonts.ready.then(schedule);schedule();
})();
