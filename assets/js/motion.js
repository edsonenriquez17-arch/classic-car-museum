/* V3-01. Native sticky + scroll scrub. No external animation dependency.
 * Contract: [data-scene-deck] > .v3-stage > .v3-scene.
 * The unenhanced HTML is the complete, readable fallback.
 */
(function () {
  'use strict';
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const decks=new Map();
  let frame=0,needsMeasure=true,resizeTimer;
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
  const visible=root=>root.isConnected&&root.getClientRects().length>0;
  function clear(state){
    state.root.classList.remove('v3-enhanced');state.root.style.height='';state.root.style.removeProperty('--v3-stage-height');
    state.scenes.forEach(scene=>{scene.style.opacity='';scene.inert=false;scene.removeAttribute('aria-hidden');scene.classList.remove('is-active');});
  }
  function prepare(){
    needsMeasure=false;
    for(const [root,state] of decks){if(!visible(root)||preference.matches){clear(state);decks.delete(root);}}
    document.querySelectorAll('[data-scene-deck]').forEach(root=>{
      if(!visible(root))return;
      const stage=root.querySelector(':scope > .v3-stage');
      const scenes=stage?[...stage.querySelectorAll(':scope > .v3-scene')]:[];
      if(!stage||scenes.length<2)return;
      let state=decks.get(root);
      if(state&&(state.scenes.length!==scenes.length||state.stage!==stage)){clear(state);decks.delete(root);state=null;}
      if(preference.matches||innerHeight<560||(innerWidth<900&&innerHeight<680)){if(state){clear(state);decks.delete(root);}return;}
      if(!state){state={root,stage,scenes,start:0,step:0,index:-1};decks.set(root,state);}
      state.height=innerHeight;state.step=innerHeight*1.55;
      root.style.setProperty('--v3-stage-height',state.height+'px');root.style.height=(state.height+state.step*scenes.length)+'px';root.classList.add('v3-enhanced');
      state.start=root.getBoundingClientRect().top+scrollY;
      if(scenes.some(scene=>scene.scrollHeight>state.height+4)){clear(state);decks.delete(root);}
    });
  }
  function paint(state){
    const progress=(scrollY-state.start)/state.step;
    const index=Math.max(0,Math.min(state.scenes.length-1,Math.floor(progress)));
    const local=progress-index;state.index=index;
    state.scenes.forEach((scene,i)=>{
      let opacity=0;
      if(i===index){const entrance=i===0?1:smooth(local/.22),departure=1-smooth((local-.68)/.22);opacity=progress<0?(i===0?1:0):entrance*departure;}
      scene.style.opacity=opacity.toFixed(4);
      const active=i===index&&opacity>.02;scene.classList.toggle('is-active',active);scene.inert=!active;scene.setAttribute('aria-hidden',String(!active));
    });
    const video=state.root.querySelector('#heroVid');
    if(video){
      const on=index===0&&progress<.9&&progress>-.7&&!document.hidden;
      if(!on&&!video.paused){video.dataset.scenePaused='1';video.pause();}
      else if(on&&video.dataset.scenePaused==='1'&&video.dataset.userPaused!=='1'){delete video.dataset.scenePaused;video.play().catch(()=>{});}
    }
  }
  function onPaper(element){
    for(let node=element.parentElement;node;node=node.parentElement){
      const color=getComputedStyle(node).backgroundColor.match(/[\d.]+/g)?.map(Number);
      if(color&&color.length>=3&&(color.length===3||color[3]>.7))return color.slice(0,3).reduce((a,b)=>a+b,0)>450;
    }
    return false;
  }
  let lights=[];
  function measureLights(){
    lights=[];
    document.querySelectorAll('[data-motion="lines"],.v3-scene h1,.v3-scene h2,.editorial-page h1,.editorial-page h2,.visit-page h1,.visit-page h2,.home-levels h2').forEach(heading=>{
      const light=visible(heading)&&onPaper(heading);heading.classList.toggle('v3-letter-light',light);if(light)lights.push(heading);
    });
  }
  function render(){
    frame=0;if(needsMeasure){prepare();measureLights();}
    if(!document.body.classList.contains('nav-open'))for(const state of decks.values())paint(state);
    if(!preference.matches)for(const heading of lights){const p=clamp((innerHeight-heading.getBoundingClientRect().top)/(innerHeight+heading.offsetHeight));heading.style.setProperty('--v3-light-position',(100-p*100).toFixed(2)+'%');}
  }
  function schedule(measure=false){needsMeasure=needsMeasure||measure;if(!frame)frame=requestAnimationFrame(render);}
  function show(root,index){
    const state=decks.get(root);
    if(!state){root.querySelectorAll('.v3-scene')[index]?.scrollIntoView({behavior:'instant',block:'start'});return;}
    scrollTo({top:state.start+index*state.step+(index?state.step*.3:0),behavior:'instant'});paint(state);
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-next-scene]');if(!button)return;
    const root=button.closest('[data-scene-deck]'),scenes=[...root.querySelectorAll('.v3-scene')],index=scenes.indexOf(button.closest('.v3-scene'))+1;
    if(index<scenes.length){show(root,index);const heading=scenes[index].querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}
    else{const next=root.nextElementSibling;next?.scrollIntoView({behavior:'instant',block:'start'});const heading=next?.querySelector('h1,h2,a,button');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
  });
  addEventListener('scroll',()=>schedule(),{passive:true});
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>schedule(true),100);});
  ['artech:route','artech:lang','artech:menu'].forEach(name=>addEventListener(name,()=>schedule(true)));
  preference.addEventListener('change',()=>{for(const state of decks.values())clear(state);decks.clear();schedule(true);});
  document.fonts?.ready.then(()=>schedule(true));
  window.ArtechMotion=Object.freeze({refresh:()=>schedule(true),reveal(element){const root=element.closest('[data-scene-deck]');if(root){const scenes=[...root.querySelectorAll('.v3-scene')];show(root,scenes.indexOf(element.closest('.v3-scene')));}},get reduced(){return preference.matches;},get available(){return !preference.matches;}});
  schedule(true);
})();
