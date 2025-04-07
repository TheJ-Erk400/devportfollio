const CACHE_NAME = 'checkmate-cache-v1';
const STATIC_CACHE_NAME = 'checkmate-static-v1';
const DYNAMIC_CACHE_NAME = 'checkmate-dynamic-v1';
const OFFLINE_PAGE = './offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './styles/main.css',
  './manifest.json',
  './checkmatemain.png',
  './icons/checkmatemain.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.global.prod.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css',
  'https://cdn.auth0.com/js/auth0-spa-js/1.13/auth0-spa-js.production.js',
  'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js'
];

// Cache limiting function - keep size of dynamic cache under control
const limitCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > maxItems) {
        cache.delete(keys[0]).then(limitCacheSize(cacheName, maxItems));
      }
    });
  });
};

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE_NAME) // Just open to ensure it exists
    ])
    .then(() => self.skipWaiting()) // Ensures the newly installed worker takes control immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
          .map(key => {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
    .then(() => self.clients.claim()) // Take control of all clients immediately
  );
});

// Helper function to determine if request should be fetched from network
const shouldFetchFromNetwork = (request) => {
  // Don't cache API requests, instead always fetch fresh data
  if (request.url.includes('/api/')) {
    return true;
  }
  
  // For navigation requests, always try network first
  if (request.mode === 'navigate') {
    return true;
  }
  
  return false;
};

// Fetch event - respond with cache first, fallback to network
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // For API requests or navigation, use network-first strategy
  if (shouldFetchFromNetwork(request)) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // If it's not an API request, cache the result
          if (!request.url.includes('/api/')) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
            limitCacheSize(DYNAMIC_CACHE_NAME, 50);  // Limit to 50 items
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(request)
            .then(cacheResponse => {
              return cacheResponse || caches.match(OFFLINE_PAGE);
            });
        })
    );
  } else {
    // For other requests, use cache-first strategy
    event.respondWith(
      caches.match(request)
        .then(cacheResponse => {
          // Return cache hit or fetch from network
          return cacheResponse || fetch(request)
            .then(networkResponse => {
              // Cache the network response for future
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
              limitCacheSize(DYNAMIC_CACHE_NAME, 50);  // Limit to 50 items
              return networkResponse;
            })
            .catch(() => {
              // For image requests that fail, return a default image
              if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                return caches.match('./icons/placeholder-image.png');
              }
              // For failed page requests, show offline page
              if (request.mode === 'navigate') {
                return caches.match(OFFLINE_PAGE);
              }
              // Otherwise just fail
              return new Response('Network error', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-profile-data') {
    event.waitUntil(
      // Implement your sync logic here to send cached data when back online
      syncProfileData()
    );
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: './icons/icon-192x192.png',
    badge: './icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.actionUrl || './'
    },
    actions: [
      {
        action: 'open',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Sync function - implement to handle offline form submissions
function syncProfileData() {
  return new Promise((resolve, reject) => {
    // Here you would retrieve data from IndexedDB and send to server
    // When the device is back online
    
    // For now, just resolve the promise
    resolve();
  });
} 