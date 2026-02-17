const CACHE_NAME = 'al-urafa-v3'; // Change to v3 to force an update
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './content.js', // MUST be here
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});