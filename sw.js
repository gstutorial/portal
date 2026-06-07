// GS Portal Service Worker v2
const CACHE = 'gs-portal-v2';
const PRECACHE = [
  './', './index.html', './dashboard.html', './config.js', './manifest.json', './logo.png',
  './apps/tuition-manager/index.html',
  './apps/user-management/index.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  clients.claim();
});

self.addEventListener('fetch', e => {
  // Never cache API calls (Google Apps Script)
  if (e.request.url.includes('script.google.com')) return;
  // Network-first for HTML pages, cache-first for assets
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
