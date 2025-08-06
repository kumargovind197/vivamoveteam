// This is a basic service worker file.
// It's the foundation for enabling push notifications.

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'ViVa move';
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // This can be customized to open a specific URL
  event.waitUntil(clients.openWindow('/'));
});
