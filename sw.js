// Bump CACHE_VERSION whenever the file list changes. Page edits reach online users on their next visit anyway
// (navigations are network-first); the bump just clears stale copies of the other files.
const CACHE_VERSION = 'stride-rdl-v8';
const PRECACHE = ['./', './index.html', './workouts.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function store(req, res) {
  if (res && res.ok) {
    const copy = res.clone();
    caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages: network first so edits show up on the next visit. Each page is cached under its own URL, and
  // offline falls back to that cached copy, then to the index page.
  if (req.mode === 'navigate') {
    const isIndex = /\/(index\.html)?$/.test(url.pathname);
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(req, copy.clone());
              if (isIndex) cache.put('./index.html', copy);
            });
          }
          return res;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: true })
            .then((c) => c || caches.match('./index.html'))
            .then((c) => c || caches.match('./'))
        )
    );
    return;
  }

  // Everything else on this origin: cache first, then network (and remember it).
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => store(req, res)))
  );
});
