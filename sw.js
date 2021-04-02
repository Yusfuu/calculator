const version = '1.0.0';
const cacheName = `calc-${version}`;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/css/style.css',
        '/app.js',
        '/lib/vanilla.js',
        '/lib/math.js',
        '/lib/plotly.js',
        '/icon/favicon.ico',
      ])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});