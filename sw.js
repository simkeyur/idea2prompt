const CACHE_NAME = 'idea2prompt-cache-v1';
const OFFLINE_URLS = ['index.html', './'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (cachedResponse) =>
        cachedResponse || fetch(event.request).catch(() => caches.match('index.html'))
    )
  );
});
