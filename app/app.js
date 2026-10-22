/* ============================================================
   ARTECH — Guía del Museo (APP)  ·  lógica
   Datos reales bilingües desde ../assets/cars.json (96 autos).
   Sin build, sin backend. Vanilla JS.
   ============================================================ */
'use strict';

const ASSET = '../assets';
const CARIMG = (slug, file) => `${ASSET}/cars/${slug}/${file}`;

const state = {
  lang: localStorage.getItem('artech_lang') || 'es',
  cars: [],
  tab: 'home',
  search: '',
  brand: 'all',
  era: 'all',
  favs: JSON.parse(localStorage.getItem('artech_favs') || '[]'),
  context: [],       // lista de slugs para prev/next en la ficha
  back: null         // callback de "volver"
};

/* ---------- i18n de la interfaz (los datos traen su propio ES/EN) ---------- */
const I = {
  es: {
    tagline: 'Historia viva del automóvil', enter: 'Entrar',
    splashHint: 'Guía interactiva del museo · Lima',
    tabHome: 'Inicio', tabCollection: 'Colección', tabTour: 'Recorrido', tabCarta: 'Carta', tabInfo: 'Info',
    expEyebrow: 'VIVE EL MUSEO', expTitle: 'Experiencias', expLead: 'Elige cómo quieres recorrer la colección.',
    expMin: 'min', expFrom: 'desde', expPerPerson: 'por persona', expGuests: 'personas',
    expBook: 'Reservar por WhatsApp', expAll: 'Ver experiencias',
    cartaEyebrow: 'RESTAURANTE · CAFÉ · BAR', cartaTitle: 'La carta', cartaLead: 'Cocina de autor dentro del museo — una pausa que también es parte del recorrido.',
    cartaTable: 'Consultar por una mesa', cartaPrices: 'Consulta precios y disponibilidad con nuestro equipo.', cartaSee: 'Ver la carta',
    wkEyebrow: 'TALLERES AFILIADOS', wkTitle: 'Dónde nacen las restauraciones', wkLead: 'Los talleres detrás de la colección. Estrellas ARTECH por cinco criterios.',
    wkPrincipal: 'Taller principal', wkWorks: 'Restauraciones', wkSee: 'Ver talleres',
    galleryTitle: 'El museo', visitTitle: 'Planifica tu visita', visitLead: 'Chorrillos, Lima — Perú · 9:00–19:00',
    heroKicker: 'ARTECH · GUÍA DEL VISITANTE',
    heroTitle: 'Historia viva del automóvil',
    heroSub: 'Recorre la colección auto por auto: su historia, su ficha técnica y su lugar en la evolución del automóvil.',
    featured: 'Destacados', seeAll: 'Ver todo',
    statCars: 'Autos', statBrands: 'Marcas', statDecades: 'Décadas',
    tourCtaTitle: 'Comienza tu recorrido', tourCtaSub: 'Un itinerario guiado por épocas, parada por parada.',
    tourCtaBtn: 'Iniciar recorrido',
    tExplore: 'Explora', collection: 'Colección', tour: 'Recorrido', restaurant: 'Restaurante', info: 'Info',
    tileColSub: 'Los 96 autos', tileTourSub: 'Guiado por épocas', tileRestSub: 'Café · Bar', tileInfoSub: 'Horarios y mapa',
    searchPh: 'Buscar por nombre, marca o año…',
    allBrands: 'Todas', results: 'resultados', noResults: 'No hay autos que coincidan.',
    tourTitle: 'Recorrido guiado', tourLead: 'Elige una época y avanza parada por parada. En cada auto verás su historia y podrás abrir la ficha completa.',
    stop: 'Parada', of: 'de', prev: 'Anterior', next: 'Siguiente', finish: 'Terminar', seeFull: 'Ver ficha completa',
    history: 'Historia', techsheet: 'Ficha técnica', gallery: 'Galería',
    addFav: 'Guardar en favoritos', remFav: 'En favoritos',
    prevCar: 'Anterior', nextCar: 'Siguiente',
    infoTitle: 'Información', hours: 'Horarios', location: 'Ubicación', visit: 'Tu visita',
    open: 'Mar – Dom', openHrs: '9:00 – 19:00', monday: 'Lunes', closed: 'Cerrado',
    addr: 'Chorrillos, Lima — Perú', tickets: 'Entradas', ticketsVal: 'Reserva por WhatsApp',
    restTitle: 'Restaurante · Café · Bar', restTxt: 'Cocina de autor dentro del museo. Haz una pausa entre salas.',
    howTitle: 'Cómo usar la app', howTxt: 'Explora la colección, sigue el recorrido guiado por épocas y guarda tus autos favoritos. Añádela a tu pantalla de inicio para abrirla como una app.',
    waBtn: 'Reservar por WhatsApp', foot: 'ARTECH · Guía del museo — versión demo. Uso interno.',
    favsEmpty: 'Aún no has guardado autos. Toca la estrella en cualquier ficha.',
    installTitle: 'Instala la app', installSub: 'Añádela a tu pantalla de inicio',
    installBtn: 'Instalar', installInfoTitle: 'Llévate la app', installed: '✓ App instalada',
    installInfoTxt: 'Instálala en tu teléfono o tablet para abrirla a pantalla completa, como una app, y usarla también sin conexión.',
    installInfoBtn: 'Instalar app',
    iosTitle: 'Instalar en tu iPhone/iPad',
    iosStep1: 'Toca el botón Compartir abajo en Safari.',
    iosStep2: 'Elige “Añadir a pantalla de inicio”.',
    iosStep3: 'Toca Añadir. ¡Listo!'
  },
  en: {
    tagline: 'The living history of the automobile', enter: 'Enter',
    splashHint: 'Interactive museum guide · Lima',
    tabHome: 'Home', tabCollection: 'Collection', tabTour: 'Tour', tabCarta: 'Menu', tabInfo: 'Info',
    expEyebrow: 'LIVE THE MUSEUM', expTitle: 'Experiences', expLead: 'Choose how you want to explore the collection.',
    expMin: 'min', expFrom: 'from', expPerPerson: 'per person', expGuests: 'guests',
    expBook: 'Book via WhatsApp', expAll: 'See experiences',
    cartaEyebrow: 'RESTAURANT · CAFÉ · BAR', cartaTitle: 'The menu', cartaLead: 'Signature cuisine inside the museum — a pause that becomes part of the journey.',
    cartaTable: 'Enquire about a table', cartaPrices: 'Ask our team about prices and availability.', cartaSee: 'See the menu',
    wkEyebrow: 'AFFILIATED WORKSHOPS', wkTitle: 'Where the restorations are born', wkLead: 'The workshops behind the collection. ARTECH stars across five criteria.',
    wkPrincipal: 'Main workshop', wkWorks: 'Restorations', wkSee: 'See workshops',
    galleryTitle: 'The museum', visitTitle: 'Plan your visit', visitLead: 'Chorrillos, Lima — Peru · 9:00–19:00',
    heroKicker: 'ARTECH · VISITOR GUIDE',
    heroTitle: 'The living history of the automobile',
    heroSub: 'Explore the collection car by car: its history, its spec sheet and its place in automotive evolution.',
    featured: 'Featured', seeAll: 'See all',
    statCars: 'Cars', statBrands: 'Brands', statDecades: 'Decades',
    tourCtaTitle: 'Begin your tour', tourCtaSub: 'A guided itinerary through the eras, stop by stop.',
    tourCtaBtn: 'Start the tour',
    tExplore: 'Explore', collection: 'Collection', tour: 'Tour', restaurant: 'Restaurant', info: 'Info',
    tileColSub: 'All 96 cars', tileTourSub: 'Guided by era', tileRestSub: 'Café · Bar', tileInfoSub: 'Hours & map',
    searchPh: 'Search by name, brand or year…',
    allBrands: 'All', results: 'results', noResults: 'No cars match your search.',
    tourTitle: 'Guided tour', tourLead: 'Pick an era and move stop by stop. For each car you get its story and can open the full sheet.',
    stop: 'Stop', of: 'of', prev: 'Back', next: 'Next', finish: 'Finish', seeFull: 'See full sheet',
    history: 'History', techsheet: 'Spec sheet', gallery: 'Gallery',
    addFav: 'Save to favorites', remFav: 'Saved',
    prevCar: 'Previous', nextCar: 'Next',
    infoTitle: 'Information', hours: 'Hours', location: 'Location', visit: 'Your visit',
    open: 'Tue – Sun', openHrs: '9:00 – 19:00', monday: 'Monday', closed: 'Closed',
    addr: 'Chorrillos, Lima — Peru', tickets: 'Tickets', ticketsVal: 'Book via WhatsApp',
    restTitle: 'Restaurant · Café · Bar', restTxt: 'Signature cuisine inside the museum. Take a break between halls.',
    howTitle: 'How to use the app', howTxt: 'Browse the collection, follow the era-by-era guided tour and save your favorite cars. Add it to your home screen to open it like an app.',
    waBtn: 'Book via WhatsApp', foot: 'ARTECH · Museum guide — demo build. Internal use.',
    favsEmpty: 'No saved cars yet. Tap the star on any car.',
    installTitle: 'Install the app', installSub: 'Add it to your home screen',
    installBtn: 'Install', installInfoTitle: 'Take the app with you', installed: '✓ App installed',
    installInfoTxt: 'Install it on your phone or tablet to open it full-screen, like an app, and use it offline too.',
    installInfoBtn: 'Install app',
    iosTitle: 'Install on your iPhone/iPad',
    iosStep1: 'Tap the Share button at the bottom of Safari.',
    iosStep2: 'Choose “Add to Home Screen”.',
    iosStep3: 'Tap Add. Done!'
  }
};
const t = (k) => (I[state.lang][k] ?? k);

/* ---------- ÉPOCAS (derivadas del año) ---------- */
const ERAS = [
  { id: 'prewar', es: 'Era de Preguerra', en: 'Pre-War Era', min: 0, max: 1945,
    banner: `${ASSET}/history.png`,
    descEs: 'Los pioneros: carrocerías artesanales y la génesis del automóvil moderno.',
    descEn: 'The pioneers: hand-built bodies and the genesis of the modern automobile.' },
  { id: 'classic', es: 'Clásicos Dorados', en: 'Golden Classics', min: 1946, max: 1970,
    banner: `${ASSET}/col-auburn.png`,
    descEs: 'La posguerra y la edad de oro del diseño: elegancia, cromo y potencia.',
    descEn: 'Post-war and the golden age of design: elegance, chrome and power.' },
  { id: 'modern', es: 'Clásicos Modernos', en: 'Modern Classics', min: 1971, max: 1999,
    banner: `${ASSET}/mustang.png`,
    descEs: 'Deportivos y superdeportivos que definieron a una generación.',
    descEn: 'Sports and supercars that defined a generation.' },
  { id: 'contemporary', es: 'Íconos Contemporáneos', en: 'Contemporary Icons', min: 2000, max: 9999,
    banner: `${ASSET}/experiences.png`,
    descEs: 'La era moderna: tecnología, prestaciones extremas y nuevos íconos.',
    descEn: 'The modern era: technology, extreme performance and new icons.' }
];
const yearNum = (c) => parseInt(String(c.year).replace(/\D/g, ''), 10) || 0;
const eraOf = (c) => ERAS.find(e => yearNum(c) >= e.min && yearNum(c) <= e.max) || ERAS[1];

/* ---------- helpers de render ---------- */
const el = (id) => document.getElementById(id);
function ph(label, src, cls = '') {
  const img = src ? `<img src="${src}" alt="" loading="lazy" onerror="this.remove()">` : '';
  return `<div class="ph ${cls}"><span class="ph-label">${label}</span>${img}</div>`;
}
const dOf = (c) => state.lang === 'en' ? (c.desc || c.desc_es || '') : (c.desc_es || c.desc || '');
const specsOf = (c) => (state.lang === 'en' ? c.specs : (c.specs_es || c.specs)) || {};
const SPEC_LABELS = {
  es: { tipo: 'Tipo', motor: 'Motor', cil: 'Cilindrada', hp: 'Potencia', trans: 'Transmisión', frenos: 'Frenos', vel: 'Velocidad máx.' },
  en: { tipo: 'Type', motor: 'Engine', cil: 'Displacement', hp: 'Power', trans: 'Transmission', frenos: 'Brakes', vel: 'Top speed' }
};
const L = (es, en) => (state.lang === 'en' ? (en ?? es) : es);
const waURL = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
// barra de puntuación 1–3 por criterio (estrellas ARTECH)
function dots(n) {
  return `<span class="dots">${[1,2,3].map(i => `<i class="${i<=n?'on':''}"></i>`).join('')}</span>`;
}

/* ============================================================
   ARRANQUE
   ============================================================ */
async function boot() {
  applyStaticI18n();
  el('splashStart').addEventListener('click', hideSplash);
  el('btnLang').addEventListener('click', toggleLang);
  el('btnBack').addEventListener('click', () => { if (state.back) state.back(); });
  el('lbClose').addEventListener('click', () => el('lightbox').hidden = true);
  el('lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') el('lightbox').hidden = true; });
  document.querySelectorAll('.tab').forEach(b =>
    b.addEventListener('click', () => switchTab(b.dataset.tab)));

  try {
    // local (en scope del service worker, cacheable offline); respaldo al global
    let res = await fetch('cars.json').catch(() => null);
    if (!res || !res.ok) res = await fetch(`${ASSET}/cars.json`);
    const data = await res.json();
    state.cars = Array.isArray(data) ? data : (data.cars || Object.values(data));
  } catch (e) {
    state.cars = [];
    console.error('No se pudo cargar cars.json', e);
  }
  initPWA();
  // auto-cierra el splash tras unos segundos si no tocan
  setTimeout(hideSplash, 4200);
  switchTab('home');
}

function hideSplash() {
  const s = el('splash');
  if (s.classList.contains('hide')) return;
  s.classList.add('hide');
  el('app').hidden = false;
  setTimeout(() => s.remove(), 550);
}

function applyStaticI18n() {
  document.querySelectorAll('[data-i]').forEach(n => { n.textContent = t(n.dataset.i); });
  el('btnLang').textContent = state.lang === 'es' ? 'EN' : 'ES';
  document.documentElement.lang = state.lang;
}

function toggleLang() {
  state.lang = state.lang === 'es' ? 'en' : 'es';
  localStorage.setItem('artech_lang', state.lang);
  applyStaticI18n();
  switchTab(state.tab, true); // re-render de la vista actual
}

/* ============================================================
   NAVEGACIÓN
   ============================================================ */
function switchTab(tab, keep) {
  state.tab = tab;
  state.back = null;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('tab-on', b.dataset.tab === tab));
  el('btnBack').hidden = true;
  el('tbBrand').hidden = false;
  el('tbTitle').hidden = true;
  el('tabbar').style.display = '';
  if (!keep) window.scrollTo(0, 0);
  const v = el('view');
  if (tab === 'home') v.innerHTML = viewHome();
  else if (tab === 'collection') v.innerHTML = viewCollection();
  else if (tab === 'tour') v.innerHTML = viewTour();
  else if (tab === 'carta') v.innerHTML = viewCarta();
  else if (tab === 'info') v.innerHTML = viewInfo();
  bindView(tab);
}

function setHeader(title) {
  el('btnBack').hidden = false;
  el('tbBrand').hidden = true;
  el('tbTitle').hidden = false;
  el('tbTitle').textContent = title;
}

/* ============================================================
   HOME
   ============================================================ */
function viewHome() {
  const feat = state.cars.filter(c => c.featured_order)
    .sort((a, b) => a.featured_order - b.featured_order).slice(0, 8);
  const featCards = feat.map(c => `
    <button class="feat-card" data-slug="${c.slug}">
      ${ph('FOTO', CARIMG(c.slug, 'cover.jpg'))}
      <div class="feat-scrim">
        <span class="feat-year">${c.year}</span>
        <span class="feat-name">${c.name}</span>
        <span class="feat-brand">${c.brand}</span>
      </div>
    </button>`).join('');

  const brands = new Set(state.cars.map(c => c.brand)).size;
  const years = state.cars.map(yearNum).filter(Boolean);
  const decades = Math.round((Math.max(...years) - Math.min(...years)) / 10);

  // Experiencias (3 tiers)
  const expCards = EXPERIENCES.map(e => `
    <button class="exp-card" data-exp="${e.id}">
      ${ph('FOTO', e.img)}
      <div class="exp-scrim">
        <span class="exp-price">S/ ${e.price}</span>
        <span class="exp-name">${e[state.lang].name}</span>
        <span class="exp-meta">${e.min} ${t('expMin')} · ${e[state.lang].info}</span>
      </div>
    </button>`).join('');

  // Galería del museo (fotos reales)
  const gal = IMG.gallery.slice(0, 10).map(src =>
    `<button class="gal-shot" data-lb="${src}">${ph('FOTO', src)}</button>`).join('');

  return `
  <section class="hero-cine">
    ${ph('IMAGEN — PORTADA', IMG.heroPool[0])}
    <div class="hero-cine-scrim">
      <p class="hero-kicker">${t('heroKicker')}</p>
      <h1 class="hero-cine-title">${t('heroTitle')}</h1>
      <p class="hero-cine-sub">${t('heroSub')}</p>
      <div class="hero-cine-cta">
        <button class="btn-gold" data-goto="tour">${t('tourCtaBtn')}</button>
        <button class="btn-ghost-s" data-goto="collection">${t('seeAll')} →</button>
      </div>
    </div>
  </section>

  <div class="stats stats-float">
    <div class="stat"><b>${state.cars.length}</b><span>${t('statCars')}</span></div>
    <div class="stat"><b>${brands}</b><span>${t('statBrands')}</span></div>
    <div class="stat"><b>${decades}</b><span>${t('statDecades')}</span></div>
  </div>

  <div class="section-head"><div><p class="eyebrow">${t('expEyebrow')}</p><h2>${t('expTitle')}</h2></div>
    <button class="see" data-goto="experiences">${t('seeAll')}</button></div>
  <div class="rail">${expCards}</div>

  <div class="section-head"><div><p class="eyebrow">${t('heroKicker')}</p><h2>${t('featured')}</h2></div>
    <button class="see" data-goto="collection">${t('seeAll')}</button></div>
  <div class="rail">${featCards}</div>

  <button class="feature-band" data-goto="carta">
    ${ph('FOTO', IMG.restaurantWide)}
    <div class="band-scrim">
      <p class="eyebrow">${t('cartaEyebrow')}</p>
      <h3>${t('cartaTitle')}</h3>
      <span class="band-go">${t('cartaSee')} →</span>
    </div>
  </button>

  <div class="section-head"><div><p class="eyebrow">ARTECH</p><h2>${t('galleryTitle')}</h2></div></div>
  <div class="rail rail-gal">${gal}</div>

  <button class="feature-band" data-goto="talleres">
    ${ph('FOTO', IMG.workshopWide)}
    <div class="band-scrim">
      <p class="eyebrow">${t('wkEyebrow')}</p>
      <h3>${t('wkTitle')}</h3>
      <span class="band-go">${t('wkSee')} →</span>
    </div>
  </button>

  <div class="visit-cta">
    <p class="eyebrow">${t('visitTitle')}</p>
    <h3>${t('heroTitle')}</h3>
    <p class="visit-lead">${t('visitLead')}</p>
    <div class="visit-actions">
      <a class="btn-gold" href="${waURL(L('Hola, quisiera información para visitar el museo ARTECH.','Hello, I would like information to visit the ARTECH museum.'))}" target="_blank" rel="noopener">${t('expBook')}</a>
      <button class="btn-ghost-s" data-goto="info">${t('info')} →</button>
    </div>
  </div>`;
}

/* ============================================================
   EXPERIENCIAS
   ============================================================ */
function viewExperiences() {
  const cards = EXPERIENCES.map(e => {
    const msg = L(`Hola, quisiera reservar la ${e.es.name} (S/ ${e.price} por persona) en ARTECH.`,
                  `Hello, I'd like to book the ${e.en.name} (S/ ${e.price} per person) at ARTECH.`);
    return `
    <article class="xp">
      <div class="xp-media">${ph('FOTO', e.img)}<span class="xp-price">S/ ${e.price}</span></div>
      <div class="xp-body">
        <h3>${e[state.lang].name}</h3>
        <p class="xp-meta">${e.min} ${t('expMin')} · ${e.guests > 1 ? e.guests + '+ ' + t('expGuests') : t('expPerPerson')}</p>
        <p class="xp-info">${e[state.lang].info}</p>
        <a class="btn-gold xp-book" href="${waURL(msg)}" target="_blank" rel="noopener">${t('expBook')}</a>
      </div>
    </article>`;
  }).join('');
  return `
  <section class="sub-hero">${ph('FOTO', IMG.exp.vip)}
    <div class="sub-hero-scrim"><p class="eyebrow">${t('expEyebrow')}</p><h1>${t('expTitle')}</h1><p>${t('expLead')}</p></div>
  </section>
  <div class="xp-list">${cards}</div>`;
}

/* ============================================================
   TALLERES
   ============================================================ */
function viewTalleres() {
  const crit = (p) => `<div class="wk-crit">${CRITERIOS.map(c =>
    `<div class="wk-crit-row"><span>${c[state.lang]}</span>${dots(p[c.k]||0)}</div>`).join('')}</div>`;

  const principal = `
    <article class="wk wk-main">
      <div class="wk-media">${ph('FOTO', WORKSHOP_PRINCIPAL.img)}<span class="wk-badge">${t('wkPrincipal')}</span></div>
      <div class="wk-body">
        <h3>${WORKSHOP_PRINCIPAL.n}</h3>
        <p class="wk-spec">${WORKSHOP_PRINCIPAL[state.lang].e} · ${WORKSHOP_PRINCIPAL.z}</p>
        <p class="wk-desc">${WORKSHOP_PRINCIPAL[state.lang].d}</p>
        ${crit(WORKSHOP_PRINCIPAL.p)}
        <p class="eyebrow wk-works-h">${t('wkWorks')}</p>
        <div class="wk-works">${WORKSHOP_PRINCIPAL.obras.map(o => `<span class="wk-chip">${o}</span>`).join('')}</div>
      </div>
    </article>`;

  const allies = WORKSHOPS.map(w => `
    <article class="wk">
      <div class="wk-media">${ph('FOTO', w.img)}</div>
      <div class="wk-body">
        <h3>${w.n}</h3>
        <p class="wk-spec">${w[state.lang].e} · ${w.z}</p>
        ${crit(w.p)}
      </div>
    </article>`).join('');

  return `
  <section class="sub-hero">${ph('FOTO', IMG.workshopMechanics)}
    <div class="sub-hero-scrim"><p class="eyebrow">${t('wkEyebrow')}</p><h1>${t('wkTitle')}</h1><p>${t('wkLead')}</p></div>
  </section>
  <div class="wk-list">${principal}${allies}</div>`;
}

/* ============================================================
   CARTA (restaurante)
   ============================================================ */
function viewCarta() {
  const cats = CAFE_MENU.map((cat, ci) => {
    const items = cat.items.map(it => {
      const en = CAFE_EN[it.n] || {};
      const nm = L(it.n, en.n || it.n);
      const ds = L(it.d || '', en.d || '');
      return `<div class="cm-item"><div class="cm-in">${nm}</div>${ds ? `<div class="cm-id">${ds}</div>` : ''}</div>`;
    }).join('');
    const dishKey = CAFE_CAT_IMG[ci] || 'dish-bife';
    return `
    <div class="cm-block${ci === 0 ? ' open' : ''}">
      <button class="cm-cat" type="button" aria-expanded="${ci === 0}">
        <span class="cm-name">${cat.t[state.lang]}</span>
        <span class="cm-right"><span class="cm-count">${cat.items.length}</span>
        <svg class="cm-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
      </button>
      <div class="cm-items"><div class="cm-dish">${ph('FOTO', `${ASSET}/media/b06/${dishKey}.webp`)}</div><div class="cm-list">${items}</div></div>
    </div>`;
  }).join('');

  return `
  <section class="sub-hero sub-hero-tall">${ph('FOTO', IMG.restaurant)}
    <div class="sub-hero-scrim">
      <p class="eyebrow">${t('cartaEyebrow')}</p>
      <h1>${t('cartaTitle')}</h1>
      <p>${t('cartaLead')}</p>
    </div>
  </section>
  <div class="cm-wrap">${cats}</div>
  <div class="cm-foot">
    <p>${t('cartaPrices')}</p>
    <a class="btn-gold" href="${waURL(L('Hola, me gustaría consultar por una mesa en el restaurante ARTECH.','Hello, I would like to enquire about a table at the ARTECH restaurant.'))}" target="_blank" rel="noopener">${t('cartaTable')}</a>
  </div>`;
}

/* abre una sub-página (experiencias/talleres) con botón volver */
function openSub(view, title) {
  state.back = () => switchTab('home');
  setHeader(title);
  el('tabbar').style.display = 'none';
  window.scrollTo(0, 0);
  el('view').innerHTML = view === 'experiences' ? viewExperiences() : viewTalleres();
  // bind lightbox/goto dentro de la subpágina
  el('view').querySelectorAll('[data-lb]').forEach(b => b.onclick = () => openLightbox(b.dataset.lb));
}

/* ============================================================
   COLECCIÓN
   ============================================================ */
function filteredCars() {
  const q = state.search.trim().toLowerCase();
  return state.cars.filter(c => {
    if (state.brand !== 'all' && c.brand !== state.brand) return false;
    if (state.era !== 'all' && eraOf(c).id !== state.era) return false;
    if (q && !`${c.name} ${c.brand} ${c.model} ${c.year}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function viewCollection() {
  const brands = ['all', ...[...new Set(state.cars.map(c => c.brand))].sort()];
  const list = filteredCars();
  return `
  <div class="col-tools">
    <div class="search">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input id="q" type="search" placeholder="${t('searchPh')}" value="${state.search.replace(/"/g,'&quot;')}">
    </div>
    <div class="chips" id="brandChips">
      ${brands.map(b => `<button class="chip ${state.brand===b?'chip-on':''}" data-brand="${b}">${b==='all'?t('allBrands'):b}</button>`).join('')}
    </div>
  </div>
  <div class="col-count">${list.length} ${t('results')}</div>
  <div class="grid" id="grid">
    ${list.length ? list.map(cardHTML).join('') : `<p class="empty" style="grid-column:1/-1">${t('noResults')}</p>`}
  </div>`;
}

function cardHTML(c) {
  const on = state.favs.includes(c.slug) ? 'on' : '';
  return `
  <button class="car-card" data-slug="${c.slug}">
    <div class="cc-media">
      <span class="cc-fav ${on}" data-fav="${c.slug}">★</span>
      ${ph('FOTO', CARIMG(c.slug, 'thumb.jpg'))}
    </div>
    <div class="cc-body">
      <div class="cc-year">${c.year}</div>
      <div class="cc-name">${c.name}</div>
      <div class="cc-brand">${c.brand}</div>
    </div>
  </button>`;
}

/* ============================================================
   RECORRIDO
   ============================================================ */
function viewTour() {
  const cards = ERAS.map((e, i) => {
    const n = state.cars.filter(c => eraOf(c).id === e.id).length;
    return `
    <button class="era-card" data-era="${e.id}">
      ${ph('IMAGEN — ' + (state.lang==='en'?e.en:e.es).toUpperCase(), e.banner)}
      <div class="era-scrim">
        <span class="era-num">${String(i+1).padStart(2,'0')}</span>
        <span class="era-name">${state.lang==='en'?e.en:e.es}</span>
        <span class="era-meta">${e.min===0?'– '+e.max:e.min+' – '+(e.max===9999?''+t('open').slice(0,0)+'hoy':e.max)} · ${n} ${t('statCars').toLowerCase()}</span>
        <span class="era-go">${t('tourCtaBtn')} →</span>
      </div>
    </button>`;
  }).join('');
  return `
  <section class="tour-intro">
    <h2>${t('tourTitle')}</h2>
    <p>${t('tourLead')}</p>
  </section>
  <div class="era-list">${cards}</div>`;
}

function startTour(eraId) {
  const cars = state.cars.filter(c => eraOf(c).id === eraId).sort((a,b)=>yearNum(a)-yearNum(b));
  if (!cars.length) return;
  state.context = cars.map(c => c.slug);
  renderStep(eraId, 0);
}

function renderStep(eraId, idx) {
  const era = ERAS.find(e => e.id === eraId);
  const cars = state.context.map(s => state.cars.find(c => c.slug === s));
  const c = cars[idx];
  const total = cars.length;
  setHeader(state.lang==='en'?era.en:era.es);
  el('tabbar').style.display = 'none';
  state.back = () => switchTab('tour');
  window.scrollTo(0,0);

  el('view').innerHTML = `
  <div class="stepper">
    <div class="step-progress">${cars.map((_,i)=>`<span class="dot ${i<=idx?'on':''}"></span>`).join('')}</div>
    <div class="step-media" data-slug="${c.slug}">
      ${ph('FOTO', CARIMG(c.slug, 'cover.jpg'))}
      <span class="step-tag">${t('stop')} ${idx+1} ${t('of')} ${total}</span>
    </div>
    <div class="step-body">
      <div class="step-year">${c.year}</div>
      <div class="step-name">${c.name}</div>
      <div class="step-brand">${c.brand} · ${c.model || ''}</div>
      <p class="step-desc">${dOf(c)}</p>
    </div>
    <button class="step-full" data-slug="${c.slug}">${t('seeFull')}</button>
    <div class="step-nav">
      <button class="prev" ${idx===0?'disabled':''}>← ${t('prev')}</button>
      <button class="next">${idx===total-1?t('finish'):t('next')+' →'}</button>
    </div>
  </div>`;

  el('view').querySelector('.prev').onclick = () => { if (idx>0) renderStep(eraId, idx-1); };
  el('view').querySelector('.next').onclick = () => { idx===total-1 ? switchTab('tour') : renderStep(eraId, idx+1); };
  el('view').querySelector('.step-full').onclick = () => openCar(c.slug, state.context, () => renderStep(eraId, idx));
  el('view').querySelector('.step-media').onclick = () => openLightbox(CARIMG(c.slug, 'cover.jpg'));
}

/* ============================================================
   FICHA DE AUTO
   ============================================================ */
function openCar(slug, context, back) {
  const c = state.cars.find(x => x.slug === slug);
  if (!c) return;
  state.context = context && context.length ? context : filteredCars().map(x => x.slug);
  const idx = state.context.indexOf(slug);
  state.back = back || (() => switchTab(state.tab, true));
  setHeader(c.brand);
  el('tabbar').style.display = 'none';
  window.scrollTo(0,0);

  const specs = specsOf(c);
  const lbls = SPEC_LABELS[state.lang];
  const specHTML = Object.entries(specs).filter(([,v]) => v)
    .map(([k,v]) => `<div class="spec"><div class="spec-k">${lbls[k]||k}</div><div class="spec-v">${v}</div></div>`).join('');
  const shots = ['cover.jpg', ...(c.shots || [])];
  const gal = shots.map(f => ph('FOTO', CARIMG(c.slug, f))).join('');
  const favOn = state.favs.includes(slug);
  const prev = idx > 0 ? state.cars.find(x=>x.slug===state.context[idx-1]) : null;
  const next = idx < state.context.length-1 ? state.cars.find(x=>x.slug===state.context[idx+1]) : null;

  el('view').innerHTML = `
  <div class="detail">
    <div class="dt-cover" data-shot="cover.jpg">
      ${ph('FOTO DE PORTADA', CARIMG(c.slug, 'cover.jpg'))}
      <div class="dt-cover-scrim"></div>
      ${c.plate ? `<span class="dt-plate">${c.plate}</span>` : ''}
    </div>
    <div class="dt-head">
      <div class="dt-year">${c.year}</div>
      <h1 class="dt-name">${c.name}</h1>
      <div class="dt-model">${c.brand} · ${c.model || ''}</div>
    </div>

    <div class="dt-section-title">${t('history')}</div>
    <p class="dt-desc">${dOf(c)}</p>

    ${specHTML ? `<div class="dt-section-title">${t('techsheet')}</div><div class="specs">${specHTML}</div>` : ''}

    <div class="dt-section-title">${t('gallery')}</div>
    <div class="gallery" id="gal">${gal}</div>

    <button class="dt-favbtn ${favOn?'on':''}" id="favBtn">
      <span>★</span> <span>${favOn?t('remFav'):t('addFav')}</span>
    </button>

    <div class="dt-adjacent">
      ${prev ? `<button data-slug="${prev.slug}"><span class="lbl">← ${t('prevCar')}</span><span class="nm">${prev.name}</span></button>` : '<span style="flex:1"></span>'}
      ${next ? `<button class="right" data-slug="${next.slug}"><span class="lbl">${t('nextCar')} →</span><span class="nm">${next.name}</span></button>` : '<span style="flex:1"></span>'}
    </div>
  </div>`;

  // bind
  el('favBtn').onclick = () => { toggleFav(slug); openCar(slug, state.context, back); };
  el('view').querySelector('.dt-cover').onclick = () => openLightbox(CARIMG(c.slug, 'cover.jpg'));
  el('gal').querySelectorAll('.ph').forEach((node, i) =>
    node.onclick = () => openLightbox(CARIMG(c.slug, shots[i])));
  el('view').querySelectorAll('.dt-adjacent [data-slug]').forEach(b =>
    b.onclick = () => openCar(b.dataset.slug, state.context, back));
}

function toggleFav(slug) {
  const i = state.favs.indexOf(slug);
  if (i >= 0) state.favs.splice(i,1); else state.favs.push(slug);
  localStorage.setItem('artech_favs', JSON.stringify(state.favs));
}

/* ============================================================
   INFO
   ============================================================ */
function viewInfo() {
  const wa = 'https://wa.me/51992432455';
  return `
  <div class="info-wrap">
    <div class="info-banner">${ph('FOTO', IMG.gallery[0])}</div>

    <div class="info-card">
      <h3><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>${t('hours')}</h3>
      <div class="info-row"><span>${t('open')}</span><span>${t('openHrs')}</span></div>
      <div class="info-row"><span>${t('monday')}</span><span>${t('closed')}</span></div>
    </div>

    <div class="info-card">
      <h3><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>${t('location')}</h3>
      <p>${t('addr')}</p>
      <div class="info-row" style="margin-top:8px"><span>${t('tickets')}</span><span>${t('ticketsVal')}</span></div>
      <a class="wa-btn" href="${wa}" target="_blank" rel="noopener">${t('waBtn')}</a>
    </div>

    <button class="info-card info-card-btn" id="restCard" data-goto="carta">
      <h3><svg viewBox="0 0 24 24"><path d="M6 3v8a3 3 0 0 0 6 0V3M9 3v18M18 3c-1.5 1-2 3-2 6s.5 4 2 5v7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>${t('restTitle')}</h3>
      <p>${t('restTxt')}</p>
      <div class="info-banner" style="margin-top:12px">${ph('FOTO', IMG.restaurantWide)}</div>
      <span class="info-go">${t('cartaSee')} →</span>
    </button>

    <div class="info-card">
      <h3><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5M12 8h.01" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>${t('howTitle')}</h3>
      <p>${t('howTxt')}</p>
    </div>

    <div class="info-card" id="installCard">
      <h3><svg viewBox="0 0 24 24"><path d="M12 3v12M12 15l-4-4M12 15l4-4M5 19h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('installInfoTitle')}</h3>
      <p>${t('installInfoTxt')}</p>
      <button class="info-install" id="infoInstallBtn">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 3v12M12 15l-4-4M12 15l4-4M5 19h14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
        ${isStandalone() ? t('installed') : t('installInfoBtn')}
      </button>
    </div>

    <p class="info-foot">${t('foot')}</p>
  </div>`;
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(src) {
  const lb = el('lightbox'), img = el('lbImg');
  img.onerror = () => { lb.hidden = true; };
  img.src = src;
  lb.hidden = false;
}

/* ============================================================
   BIND por vista
   ============================================================ */
function bindView(tab) {
  const v = el('view');

  // navegación por data-goto
  v.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => {
    const g = b.dataset.goto;
    if (g === 'experiences') openSub('experiences', t('expTitle'));
    else if (g === 'talleres') openSub('talleres', t('wkTitle'));
    else if (g === 'info-rest') switchTab('carta');
    else switchTab(g);
  });

  // tarjetas de experiencia (home) → página experiencias
  v.querySelectorAll('[data-exp]').forEach(b => b.onclick = () => openSub('experiences', t('expTitle')));

  // galería (lightbox)
  v.querySelectorAll('[data-lb]').forEach(b => b.onclick = () => openLightbox(b.dataset.lb));

  // acordeón de la carta
  v.querySelectorAll('.cm-cat').forEach(b => b.onclick = () => {
    const open = b.closest('.cm-block').classList.toggle('open');
    b.setAttribute('aria-expanded', String(open));
  });

  // tarjetas de auto (home rail + colección)
  v.querySelectorAll('[data-slug]').forEach(b => {
    if (b.classList.contains('feat-card') || b.classList.contains('car-card'))
      b.onclick = (e) => { if (e.target.closest('[data-fav]')) return; openCar(b.dataset.slug); };
  });

  // favoritos en las tarjetas
  v.querySelectorAll('[data-fav]').forEach(s => s.onclick = (e) => {
    e.stopPropagation();
    toggleFav(s.dataset.fav);
    s.classList.toggle('on');
  });

  if (tab === 'collection') {
    const q = el('q');
    if (q) q.oninput = () => {
      state.search = q.value;
      const list = filteredCars();
      el('grid').innerHTML = list.length ? list.map(cardHTML).join('')
        : `<p class="empty" style="grid-column:1/-1">${t('noResults')}</p>`;
      document.querySelector('.col-count').textContent = `${list.length} ${t('results')}`;
      bindGrid();
    };
    v.querySelectorAll('[data-brand]').forEach(c => c.onclick = () => {
      state.brand = c.dataset.brand;
      switchTab('collection', true);
    });
  }

  if (tab === 'tour') {
    v.querySelectorAll('[data-era]').forEach(b => b.onclick = () => startTour(b.dataset.era));
  }

  if (tab === 'info') {
    const ib = el('infoInstallBtn');
    if (ib && !isStandalone()) ib.onclick = triggerInstall;
  }
}

function bindGrid() {
  const v = el('view');
  v.querySelectorAll('.car-card[data-slug]').forEach(b =>
    b.onclick = (e) => { if (e.target.closest('[data-fav]')) return; openCar(b.dataset.slug); });
  v.querySelectorAll('[data-fav]').forEach(s => s.onclick = (e) => {
    e.stopPropagation(); toggleFav(s.dataset.fav); s.classList.toggle('on');
  });
}

/* ============================================================
   PWA — instalar / offline
   ============================================================ */
let deferredPrompt = null;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

function initPWA() {
  // 1) Service worker (offline + instalable)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW no registrado', e));
  }

  const bar = el('installBar');
  const dismissed = localStorage.getItem('artech_install_dismiss') === '1';

  // 2) Android/Chrome: capturamos el evento nativo
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!isStandalone() && !dismissed) bar.hidden = false;
  });

  // 3) iOS Safari: no hay evento → mostramos el banner que abre instrucciones
  if (isIOS() && !isStandalone() && !dismissed) {
    setTimeout(() => { bar.hidden = false; }, 2600);
  }

  window.addEventListener('appinstalled', () => { bar.hidden = true; deferredPrompt = null; });

  el('installBtn').addEventListener('click', triggerInstall);
  el('installClose').addEventListener('click', () => {
    bar.hidden = true;
    localStorage.setItem('artech_install_dismiss', '1');
  });
  el('iosClose').addEventListener('click', () => { el('iosSheet').hidden = true; });
  el('iosSheet').addEventListener('click', (e) => { if (e.target.id === 'iosSheet') el('iosSheet').hidden = true; });
}

function triggerInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(() => { deferredPrompt = null; el('installBar').hidden = true; });
  } else if (isIOS()) {
    el('iosSheet').hidden = false;
  } else {
    // ya instalada o no disponible el prompt → instrucciones genéricas
    el('iosSheet').hidden = false;
  }
}

document.addEventListener('DOMContentLoaded', boot);
