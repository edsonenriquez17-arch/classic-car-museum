/* ARTECH — Service Worker (PWA offline)
   Scope: /classic-car-museum/app/
   - Precache del "app shell" + datos (cars.json) para que la app abra sin conexión.
   - Imágenes del museo (../assets/cars/...) quedan fuera de scope: se sirven en
     línea y el navegador las cachea; si faltan, la app muestra placeholders.
*/
const VERSION = 'artech-app-v4';
const CORE = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './content.js',
  './cars.json',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navegación: devuelve el shell (cache-first con red de respaldo)
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then((cached) => cached || fetch(req))
    );
    return;
  }

  // cars.json: red primero (datos frescos), cae a caché sin conexión
  if (url.pathname.endsWith('/cars.json')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Resto en scope: cache-first, y guarda en runtime lo nuevo
  e.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached)
    )
  );
});
