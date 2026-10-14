/* Editorial interiors. Facts and menu entries use existing catalogue/content.
 * Missing portraits and food photographs are not substituted with invented ones. */
(function () {
  'use strict';
  const {escapeHTML:E,parseHash,whatsappURL}=window.Artech;
  const $=id=>document.getElementById(id);
  const es=()=>document.documentElement.lang==='es';
  const L=(a,b)=>es()?a:b;
  const T=o=>o?.[es()?'es':'en']||o?.en||'';
  function translate(){
    document.querySelectorAll('.editorial-page [data-es][data-en]').forEach(el=>el.textContent=el.dataset[es()?'es':'en']);
    document.querySelectorAll('.editorial-page [data-es-alt]').forEach(el=>el.alt=el.dataset[es()?'esAlt':'enAlt']);
  }
  const levelImages=['assets/cars/sin-placa-15/cover.jpg','assets/cars/cxj-330/d1.jpg','assets/interior.png'];
  function renderExperiences(){
    const host=$('xpList');if(!host)return;
    host.innerHTML=EXPERIENCIAS.map((item,index)=>`<article class="editorial-level editorial-scene ${index===2?'editorial-private':''}"><div class="wrap"><div class="level-copy"><span class="level-number">${item.n}</span><p class="editorial-kicker">${E(L('NIVEL','LEVEL'))} ${item.n}</p><h2>${E(T(item.t))}</h2><p>${E(T(item.d))}</p><dl class="level-facts"><div><dt>${E(L('Duración','Duration'))}</dt><dd>${E(T(item.dur))}</dd></div><div><dt>${E(L('Precio','Price'))}</dt><dd>${E(T(item.pre))}</dd></div>${item.gr?`<div><dt>${E(L('Grupo','Group'))}</dt><dd>${E(T(item.gr))}</dd></div>`:''}</dl>${item.inc?`<ul class="level-inclusions">${item.inc.map(include=>`<li>${E(T(include))}</li>`).join('')}</ul>`:''}${item.extra?`<p class="level-extra">${E(T(item.extra.v))}</p>`:''}<a class="${index===0?'editorial-link':'editorial-button'}" href="#p-tickets/${['collection','vip','private'][index]}">${E(L('ELEGIR ESTA EXPERIENCIA','CHOOSE THIS EXPERIENCE'))} ↗</a></div><figure class="level-photograph"><img src="${levelImages[index]}" alt="${E(L(['Auburn 852','Detalle Ferrari','Tapicería de la colección'][index],['Auburn 852','Ferrari detail','Collection upholstery'][index]))}" loading="lazy"><figcaption>${E(L(['LA COLECCIÓN','DETRÁS DE LA PIEZA','UNA VISITA PARA TU GRUPO'][index],['THE COLLECTION','BEHIND THE PIECE','A VISIT FOR YOUR GROUP'][index]))}</figcaption></figure></div></article>`).join('');
    mountScenes();
  }
  const stops=[
    {es:'Arranque',en:'The start',noteEs:'Para empezar',noteEn:'To begin',names:['Cebiche al Estilo ARTECH','Tartare de Atún','Tequeños de Queso Cajamarquino']},
    {es:'En ruta',en:'The journey',noteEs:'Para quedarse',noteEn:'To stay',names:['Panceta Laqueada en Salsa Miso y Chaufa','Atún en Costra de Pimienta','Bife Americano a la Parrilla']},
    {es:'Meta',en:'The finish',noteEs:'Para cerrar',noteEn:'To finish',names:['Soufflé de Chocolate','Suspiro de Lúcuma','Crocante de Manzana']}
  ];
  function renderMenuRoute(){
    const items=CAFE_MENU.flatMap(category=>category.items);
    $('menuRoute').innerHTML=stops.map((stop,index)=>`<section class="menu-stop"><p class="editorial-kicker">0${index+1} / ${E(L(stop.noteEs,stop.noteEn))}</p><h3>${E(L(stop.es,stop.en))}</h3>${stop.names.map(name=>{const item=items.find(i=>i.n===name);if(!item)return '';const translated=CAFE_EN[name];return `<div class="menu-dish"><h4>${E(es()?item.n:translated?.n||item.n)}</h4>${(es()?item.d:translated?.d)?`<p>${E(es()?item.d:translated.d)}</p>`:''}</div>`;}).join('')}</section>`).join('');
    $('restaurantRequest').href=whatsappURL(L('Hola ARTECH, quisiera solicitar una mesa en el restaurante. ¿Podrían confirmar horario, disponibilidad y condiciones?','Hi ARTECH, I would like to request a table at the restaurant. Could you confirm the time, availability and conditions?'));
  }
  function renderHistory(){
    const cars=typeof CARS!=='undefined'?CARS:[];
    const dated=cars.filter(car=>Number.isFinite(parseInt(car.year,10))).sort((a,b)=>parseInt(a.year,10)-parseInt(b.year,10));
    const middle=cars.find(car=>car.slug==='maserati-300s');
    const selected=[dated[0],middle,dated.at(-1)].filter(Boolean);
    const labels=[L('El origen del recorrido','The journey’s beginning'),L('Diseño y competición','Design and competition'),L('Una época contemporánea','A contemporary era')];
    $('historyMilestones').innerHTML=selected.map((car,index)=>`<a href="#p-vehicle/${encodeURIComponent(car.slug)}"><img src="assets/cars/${car.slug}/cover.jpg" alt="${E(car.name)}" loading="lazy"><strong>${E(car.year)}</strong><h3>${E(car.name)}</h3><p>${E(labels[index])} ↗</p></a>`).join('');
    $('historyCount').textContent=cars.length?L(`${cars.length} PIEZAS.\nUNA HISTORIA ABIERTA.`,`${cars.length} PIECES.\nAN OPEN STORY.`):L('UNA HISTORIA\nQUE CONTINÚA.','A STORY\nTHAT CONTINUES.');
  }
  function mountScenes(){ window.ArtechMotion?.refresh(); }
  let lastCollectionScroll=0,previousRoute='';
  function renderFeatured(){window.ArtechCollection?.refreshFeatured();}
  function updateResults(count,total,filtered){
    $('collectionResults').textContent=L(`${count} de ${total} piezas`,`${count} of ${total} pieces`);
    $('collectionClear').disabled=!filtered;
  }
  function renderVehicle(car){
    if(!car)return;
    const index=CARS.indexOf(car),previous=CARS[(index-1+CARS.length)%CARS.length],next=CARS[(index+1)%CARS.length];
    $('vehiclePrev').href='#p-vehicle/'+encodeURIComponent(previous.slug);$('vehicleNext').href='#p-vehicle/'+encodeURIComponent(next.slug);
    $('vehiclePrev').setAttribute('aria-label',L('Pieza anterior: ','Previous vehicle: ')+previous.name);$('vehicleNext').setAttribute('aria-label',L('Pieza siguiente: ','Next vehicle: ')+next.name);
    $('vehicleChapter').textContent=L('LA COLECCIÓN / PIEZA ','THE COLLECTION / PIECE ')+String(index+1).padStart(2,'0')+' / '+CARS.length;
    const photos=Array.isArray(car.shots)?car.shots.length:0;
    $('vehicleGalleryHeading').hidden=!photos;$('vehicleGalleryHeading').parentElement.hidden=!photos;
    $('vehiclePhotoCount').textContent=L(`${photos} fotografías · Pulsa para ampliar`,`${photos} photographs · Select to enlarge`);
    window.ArtechCollection?.renderVehicle(car);
    mountScenes();
  }
  document.addEventListener('click',event=>{if(event.target.closest('#carGrid a,#collectionFeatureLink'))lastCollectionScroll=scrollY;});
  function collectionReturn(){
    const {key}=parseHash(location.hash);
    if(key==='p-collection'&&previousRoute==='p-vehicle')requestAnimationFrame(()=>{if(parseHash(location.hash).key==='p-collection')scrollTo({top:lastCollectionScroll,behavior:'instant'});});
    previousRoute=key;
  }
  function pageState(){if(parseHash(location.hash).key!=='p-collection')$('collectionFilmVideo').pause();document.body.classList.toggle('editorial-open',!!document.querySelector('.subpage.active.editorial-page'));}
  function sectionRoute(){
    const {key,id}=parseHash(location.hash);
    if(!['p-experience','p-cafe','p-history','p-collection'].includes(key)||!id)return;
    const root={ 'p-experience':$('page-experience'),'p-cafe':$('page-cafe'),'p-history':$('page-history'),'p-collection':$('page-collection')}[key];
    const section=root.querySelector(`[data-section="${CSS.escape(id)}"]`);
    section?.scrollIntoView({behavior:'instant',block:'start'});
  }
  function refresh(){pageState();translate();renderExperiences();renderMenuRoute();renderHistory();renderFeatured();if(typeof currentSlug!=='undefined'&&currentSlug)renderVehicle(CARS.find(car=>car.slug===currentSlug));window._pcApply?.();mountScenes();sectionRoute();}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)$('collectionFilmVideo').pause();});
  window.ArtechEditorial={renderExperiences,renderVehicle,updateResults,refresh};
  addEventListener('artech:lang',refresh);
  addEventListener('artech:route',()=>{pageState();translate();sectionRoute();collectionReturn();mountScenes();});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{renderFeatured();mountScenes();});
  refresh();
})();
