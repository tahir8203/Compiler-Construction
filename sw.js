/* Offline support for the Compiler Construction portal. Bump VERSION with the ?v= number in index.html. */
const VERSION = 'cc-v16';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'assets/styles.css?v=16', 'assets/portal.css?v=16',
  'assets/sessions/part1.js?v=16', 'assets/sessions/part2.js?v=16', 'assets/sessions/part3.js?v=16', 'assets/sessions/part4.js?v=16',
  'assets/demos.js?v=16', 'assets/tools.js?v=16', 'assets/portal-data.js?v=16', 'assets/portal.js?v=16', 'assets/app.js?v=16',
  'assets/instructor.jpg', 'assets/icons/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); const same = url.origin === location.origin;
  if (!same && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
  const isPage = req.mode === 'navigate' || (same && /\/(index\.html)?$/.test(url.pathname));
  if (isPage) { // network first so updates arrive; fall back to the cached copy when offline
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })));
});
