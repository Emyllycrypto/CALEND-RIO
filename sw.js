const CACHE_NAME = 'calendario-retro-v1';
const ARQUIVOS_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './morango.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_CACHE))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resposta) => resposta || fetch(e.request))
  );
});