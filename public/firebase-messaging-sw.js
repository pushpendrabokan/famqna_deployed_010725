// Firebase Cloud Messaging Service Worker

// Service worker version
const SW_VERSION = '1.0.2';
console.log('[firebase-messaging-sw.js] Service Worker version:', SW_VERSION);

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

let messaging = null;
let firebaseInitialized = false;

// Log that the service worker has loaded
console.log('[firebase-messaging-sw.js] Service Worker loaded');

// The configuration will be set by the main app during service worker registration
self.addEventListener('message', (event) => {
  // Log all messages for debugging
  console.log('[firebase-messaging-sw.js] Message received:', event.data?.type || 'unknown type');
  
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    try {
      // Log that we're going to initialize Firebase
      console.log('[firebase-messaging-sw.js] Received Firebase config, initializing...');
      
      // Initialize Firebase with the configuration from the main app
      const firebaseConfig = event.data.config;
      
      // Check if we have a valid config
      if (!firebaseConfig || !firebaseConfig.apiKey) {
        console.error('[firebase-messaging-sw.js] Invalid Firebase config received');
        return;
      }
      
      if (!firebase.apps.length) {
        // Log the configuration (redact sensitive info)
        console.log('[firebase-messaging-sw.js] Config:', {
          ...firebaseConfig,
          apiKey: firebaseConfig.apiKey ? 'REDACTED' : 'MISSING',
          appId: firebaseConfig.appId ? 'REDACTED' : 'MISSING',
          vapidKey: firebaseConfig.vapidKey ? 'REDACTED' : 'MISSING'
        });
        
        firebase.initializeApp(firebaseConfig);
        firebaseInitialized = true;
        console.log('[firebase-messaging-sw.js] Firebase initialized successfully');
        
        // Initialize messaging after Firebase is configured
        messaging = firebase.messaging();
        console.log('[firebase-messaging-sw.js] Firebase Messaging initialized');
        
        // Set up background message handler
        messaging.onBackgroundMessage((payload) => {
          console.log('[firebase-messaging-sw.js] Received background message:', payload);
          
          // Extract notification details
          const notificationTitle = payload.notification?.title || 'New Notification';
          const notificationOptions = {
            body: payload.notification?.body || 'You have a new notification',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: payload.data?.tag || `notification-${Date.now()}`,
            data: payload.data || {},
            vibrate: [100, 50, 100],
            renotify: true,
            requireInteraction: true,
            actions: [
              {
                action: 'open',
                title: 'Open'
              }
            ]
          };
          
          console.log('[firebase-messaging-sw.js] Showing notification:', {
            title: notificationTitle,
            options: notificationOptions
          });

          // Show the notification
          return self.registration.showNotification(notificationTitle, notificationOptions)
            .then(() => {
              console.log('[firebase-messaging-sw.js] Notification shown successfully');
            })
            .catch(error => {
              console.error('[firebase-messaging-sw.js] Error showing notification:', error);
            });
        });
        
        // Tell the main thread that we're ready
        const clientsPromise = self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        });
        
        clientsPromise.then((clients) => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_INITIALIZED',
              success: true
            });
          });
        });
        
        console.log('[firebase-messaging-sw.js] Background message handler set up');
      } else {
        console.log('[firebase-messaging-sw.js] Firebase already initialized');
      }
    } catch (error) {
      console.error('[firebase-messaging-sw.js] Error initializing Firebase:', error);
      
      // Tell the main thread about the error
      const clientsPromise = self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });
      
      clientsPromise.then((clients) => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ERROR',
            error: error.message
          });
        });
      });
    }
  } else if (event.data && event.data.type === 'PING') {
    // Respond to ping to check if service worker is active
    console.log('[firebase-messaging-sw.js] Received ping, sending pong');
    
    const clientsPromise = self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });
    
    clientsPromise.then((clients) => {
      clients.forEach(client => {
        client.postMessage({
          type: 'PONG',
          initialized: firebaseInitialized,
          timestamp: Date.now()
        });
      });
    });
  }
});

// Handle push event directly
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received', event);
  
  if (!event.data) {
    console.log('[firebase-messaging-sw.js] Push event has no data');
    return;
  }
  
  try {
    // Try to parse the data
    const payload = event.data.json();
    console.log('[firebase-messaging-sw.js] Push data:', payload);
    
    // Create notification
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new notification',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: payload.data?.tag || `notification-${Date.now()}`,
      data: payload.data || {},
      vibrate: [100, 50, 100],
      renotify: true,
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Open'
        }
      ]
    };
    
    console.log('[firebase-messaging-sw.js] Showing notification from push event:', {
      title: notificationTitle,
      options: notificationOptions
    });
    
    // Show notification
    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error handling push event:', error);
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event.notification.tag);
  event.notification.close();
  
  // Handle notification click
  const urlToOpen = event.notification.data && event.notification.data.url 
    ? event.notification.data.url
    : '/dashboard';
    
  console.log('[firebase-messaging-sw.js] Opening URL:', urlToOpen);

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((clientList) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          console.log('[firebase-messaging-sw.js] Focusing existing client:', client.url);
          return client.focus();
        }
      }
      // If no window/tab is open with the URL, open new one
      if (clients.openWindow) {
        console.log('[firebase-messaging-sw.js] Opening new window for URL:', urlToOpen);
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// This service worker should not handle fetch requests - it's only for push notifications
// We don't register any fetch event handlers to avoid conflict with the main service worker

// Log that the service worker installation is complete
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  // Take control of all clients as soon as the service worker activates
  event.waitUntil(clients.claim());
});