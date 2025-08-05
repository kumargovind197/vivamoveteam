// Basic service worker for PWA

const CACHE_NAME = 'viva-move-cache-v1';
const urlsToCache = [
  '/',
  '/styles/globals.css',
  '/app/page.tsx',
  // Add other important assets here
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
