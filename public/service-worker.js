// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || '/notification-icon.png',
        badge: data.badge || '/notification-badge.png',
        data: data.data || {},
        vibrate: [100, 50, 100],
        tag: data.tag || 'default',
        renotify: data.renotify || false
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (e) {
      // If parsing as JSON fails, try to use the data as is
      const options = {
        body: event.data.text(),
        icon: '/notification-icon.png',
        badge: '/notification-badge.png',
        vibrate: [100, 50, 100],
      };

      event.waitUntil(
        self.registration.showNotification('FamQnA Notification', options)
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Handle notification click
  const urlToOpen = event.notification.data && event.notification.data.url 
    ? event.notification.data.url
    : '/dashboard';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(function(clientList) {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window/tab is open with the URL, open new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close event
self.addEventListener('notificationclose', function(event) {
  console.log('Notification was closed', event);
});

// Cache assets for offline use
const CACHE_NAME = 'famqna-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/notification-icon.png',
  '/notification-badge.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  
  // Skip waiting for activation
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
  
  // Claim clients for immediate control
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Don't handle non-GET requests at all
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Don't handle third-party requests, especially Razorpay
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  
  if (!isSameOrigin) {
    // For third-party requests, let the browser handle them normally
    return;
  }
  
  // Don't cache API requests
  if (url.pathname.includes('/api/') || 
      url.pathname.includes('/.netlify/') || 
      url.pathname.includes('/graphql')) {
    return;
  }
  
  // Don't cache requests with query parameters
  if (url.search) {
    return;
  }
  
  // For static assets, use the cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Only cache successful responses for same-origin requests
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        ).catch(function(error) {
          console.error('Fetch failed:', error);
          // Just return the error, don't try to handle it specially
          throw error;
        });
      })
  );
});