// This is a basic service worker file.
// It's the foundation for enabling push notifications.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // No caching needed for this simple version
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Claim clients immediately
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // This service worker doesn't intercept fetch requests.
  // It's only here to enable the PWA installation and push notification foundation.
  // We'll add push notification logic here later.
  return; 
});
