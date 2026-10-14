/* V3-01 shell: logo intro, full-screen menu and user-started video. */
(function () {
  'use strict';
  const $=id=>document.getElementById(id);
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const spanish=()=>document.documentElement.lang==='es';
  const text=(es,en)=>spanish()?es:en;
  const header=$('header'),panel=$('v3MenuPanel'),nav=$('navlinks'),burger=$('burger');
  const image=$('v3MenuPhoto'),caption=$('v3MenuCaption');
  const background=[$('main-content'),document.querySelector('footer')].filter(Boolean);
  let menuOpen=false,savedInert=[],imageVersion=0,imageFade;
  let selectedLink=nav.querySelector('a');
  function label(){burger.setAttribute('aria-label',menuOpen?text('Cerrar menú','Close menu'):text('Abrir menú','Open menu'));}
  function setMenu(open,restore=false){
    if(open===menuOpen){label();return;}
    menuOpen=open;
    if(open){
      savedInert=background.map(el=>el.inert);background.forEach(el=>el.inert=true);
      panel.hidden=false;nav.inert=false;nav.classList.add('open');
      header.setAttribute('role','dialog');header.setAttribute('aria-modal','true');header.setAttribute('aria-label',text('Menú principal','Main menu'));
      document.body.classList.add('nav-open');header.classList.add('nav-open');
      selectedLink=nav.querySelector('a.current')||nav.querySelector('a');
      preview(selectedLink,false);selectedLink.focus({preventScroll:true});
    }else{
      panel.hidden=true;nav.inert=true;nav.classList.remove('open');
      header.removeAttribute('role');header.removeAttribute('aria-modal');header.removeAttribute('aria-label');
      document.body.classList.remove('nav-open');header.classList.remove('nav-open');
      background.forEach((el,i)=>el.inert=savedInert[i]||false);
      imageVersion++;imageFade?.cancel();image.style.opacity='';
      if(restore)burger.focus({preventScroll:true});
    }
    burger.setAttribute('aria-expanded',String(open));label();
    dispatchEvent(new Event('artech:menu'));
  }
  async function preview(link,animate=true){
    if(!link?.dataset.menuPhoto)return;
    selectedLink=link;caption.textContent=link.textContent.trim();
    const src=link.dataset.menuPhoto;
    const run=++imageVersion;imageFade?.cancel();image.style.opacity='';
    if(image.getAttribute('src')===src)return;
    const preloaded=new Image();preloaded.src=src;
    try{await preloaded.decode();}catch(_){return;}
    if(run!==imageVersion||!menuOpen)return;
    if(!animate||preference.matches){image.src=src;return;}
    imageFade=image.animate([{opacity:1},{opacity:0}],{duration:170,fill:'forwards'});
    try{await imageFade.finished;}catch(_){return;}
    if(run!==imageVersion||!menuOpen)return;
    image.src=src;imageFade.cancel();
    imageFade=image.animate([{opacity:0},{opacity:1}],{duration:350,easing:'ease-out'});
    imageFade.finished.catch(()=>{});
  }
  burger.addEventListener('click',()=>setMenu(!menuOpen,true));
  nav.querySelectorAll('a').forEach(link=>{
    link.addEventListener('pointerenter',()=>{if(menuOpen)preview(link);});
    link.addEventListener('focus',()=>{if(menuOpen)preview(link);});
    link.addEventListener('click',()=>setMenu(false));
  });
  header.querySelector('.logo').addEventListener('click',()=>setMenu(false));
  document.addEventListener('keydown',event=>{
    if(!menuOpen)return;
    if(event.key==='Escape'){event.preventDefault();setMenu(false,true);return;}
    if(event.key!=='Tab')return;
    const controls=[...header.querySelectorAll('a,button')].filter(el=>el.getClientRects().length&&!el.disabled&&getComputedStyle(el).visibility!=='hidden');
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  addEventListener('hashchange',()=>setMenu(false));
  addEventListener('artech:lang',()=>{label();if(menuOpen){header.setAttribute('aria-label',text('Menú principal','Main menu'));caption.textContent=selectedLink.textContent.trim();}});
  label();
  // Preserve real links; fade through black when changing to another page.
  const curtain=document.createElement('div');curtain.className='v3-route-curtain';curtain.hidden=true;curtain.setAttribute('aria-hidden','true');document.body.append(curtain);
  let routeVersion=0,routeFade,pendingHash=null;
  function uncover(version){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(version!==routeVersion)return;
      if(preference.matches){curtain.hidden=true;curtain.style.opacity='';return;}
      routeFade?.cancel();curtain.style.opacity='1';
      routeFade=curtain.animate([{opacity:1},{opacity:0}],{duration:380,easing:'linear',fill:'forwards'});
      routeFade.finished.then(()=>{if(version===routeVersion){curtain.hidden=true;curtain.style.opacity='';routeFade.cancel();}}).catch(()=>{});
    }));
  }
  document.addEventListener('click',async event=>{
    const link=event.target.closest('a[href]'),hash=link?.getAttribute('href');
    if(!link||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download')||!/^#(?:p-|top$)/.test(hash)||hash===location.hash||preference.matches)return;
    event.preventDefault();
    const version=++routeVersion;pendingHash=hash;routeFade?.cancel();curtain.hidden=false;curtain.style.opacity='0';
    routeFade=curtain.animate([{opacity:0},{opacity:1}],{duration:220,easing:'linear',fill:'forwards'});
    try{await routeFade.finished;}catch(_){return;}
    if(version===routeVersion&&pendingHash===hash)location.hash=hash;
  },true);
  addEventListener('hashchange',()=>{
    const expected=pendingHash===location.hash;pendingHash=null;
    if(!expected){routeVersion++;routeFade?.cancel();}
    if(preference.matches){curtain.hidden=true;curtain.style.opacity='';return;}
    curtain.hidden=false;curtain.style.opacity='1';uncover(routeVersion);
  });
  preference.addEventListener('change',()=>{
    if(!preference.matches)return;
    const target=pendingHash;pendingHash=null;routeVersion++;routeFade?.cancel();curtain.hidden=true;curtain.style.opacity='';
    if(target)location.hash=target;
  });
  const video=$('heroVid'),toggle=$('homeVideoToggle'),status=$('v3VideoStatus');
  let mediaVersion=0;
  function syncVideo(){
    toggle.classList.toggle('is-playing',!video.paused);
    toggle.setAttribute('aria-pressed',String(!video.paused));
    toggle.setAttribute('aria-label',text(video.paused?'Reproducir video':'Pausar video',video.paused?'Play video':'Pause video'));
    video.closest('figure').classList.toggle('video-visible',video.readyState>=2&&!!video.getAttribute('src'));
  }
  toggle.addEventListener('click',async()=>{
    const run=++mediaVersion;status.hidden=true;
    if(!video.paused){video.dataset.userPaused='1';video.pause();syncVideo();return;}
    video.dataset.userPaused='0';
    if(!video.getAttribute('src')){video.dataset.on='1';video.src=video.dataset.src;video.load();}
    toggle.setAttribute('aria-busy','true');
    try{await video.play();if(video.dataset.userPaused==='1'||document.body.classList.contains('page-open')||document.hidden)video.pause();}
    catch(_){if(run!==mediaVersion)return;video.dataset.userPaused='1';status.textContent=text('No se pudo iniciar el video. Puedes volver a intentarlo.','The video could not start. You can try again.');status.hidden=false;}
    finally{if(run===mediaVersion)toggle.removeAttribute('aria-busy');syncVideo();}
  });
  ['play','pause','loadeddata','emptied'].forEach(type=>video.addEventListener(type,syncVideo));
  video.addEventListener('error',()=>{video.dataset.userPaused='1';video.closest('figure').classList.remove('video-visible');status.textContent=text('Video no disponible.','Video unavailable.');status.hidden=false;});
  addEventListener('artech:lang',syncVideo);
  addEventListener('artech:route',()=>{if(document.body.classList.contains('page-open')){mediaVersion++;toggle.removeAttribute('aria-busy');video.pause();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){mediaVersion++;toggle.removeAttribute('aria-busy');video.pause();}});
  syncVideo();
  // The intro never loads a video, hides a deep link or repeats within a tab.
  const intro=$('preloader'),skip=$('plSkip'),inner=intro.querySelector('.pl-inner');
  let introDone=false,timer,logoAnimation,exitAnimation;
  function reveal(immediate=false){
    if(introDone)return;
    introDone=true;clearTimeout(timer);logoAnimation?.cancel();
    const finish=()=>{
      intro.hidden=true;intro.style.opacity='';inner.style.opacity='';document.documentElement.classList.remove('pl-lock');
      background.forEach(el=>el.inert=false);header.inert=false;
      window.Artech.storage('sessionStorage','artech_intro_v3_seen','1');
      if(document.activeElement===skip){const heading=document.querySelector('.subpage.active h1,.subpage.active h2')||$('top').querySelector('h1');heading.tabIndex=-1;heading.focus({preventScroll:true});}
      window.ArtechMotion?.refresh();
    };
    if(immediate||preference.matches||intro.hidden){finish();return;}
    inner.style.opacity='0';exitAnimation=intro.animate([{opacity:1},{opacity:0}],{duration:450,easing:'linear'});
    exitAnimation.finished.then(finish).catch(finish);
  }
  const entrance=window.Artech.parseHash(location.hash).key==='top';
  if(!entrance||preference.matches||window.Artech.storage('sessionStorage','artech_intro_v3_seen')==='1')reveal(true);
  else{
    intro.hidden=false;document.documentElement.classList.add('pl-lock');background.forEach(el=>el.inert=true);header.inert=true;skip.focus({preventScroll:true});
    logoAnimation=inner.animate([{opacity:0,offset:0},{opacity:0,offset:.1},{opacity:1,offset:.32},{opacity:1,offset:.74},{opacity:0,offset:1}],{duration:3100,easing:'linear',fill:'forwards'});
    timer=setTimeout(()=>reveal(),3150);
  }
  skip.addEventListener('click',()=>reveal(true));
  document.addEventListener('keydown',event=>{if(introDone)return;if(event.key==='Escape'){event.preventDefault();reveal(true);}if(event.key==='Tab'){event.preventDefault();skip.focus();}});
  addEventListener('hashchange',()=>{if(!introDone)reveal(true);});
  preference.addEventListener('change',()=>{if(preference.matches){if(!introDone)reveal(true);else exitAnimation?.finish();video.dataset.userPaused='1';video.pause();}});
  window.ArtechShell=Object.freeze({closeMenu:()=>setMenu(false),get menuOpen(){return menuOpen;}});
})();
