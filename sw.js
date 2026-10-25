self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: 'Boucherie Premium',
      body: event.data ? event.data.text() : 'Nouvelle notification'
    };
  }

  const title = data.title || 'Boucherie Premium';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || 'Tu as une nouvelle notification.',
      icon: './icon-192.png',
      badge: './icon-192.png',
      data: {
        url: data.url || './'
      }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification.data?.url || './';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});
