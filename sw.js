self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Handle share target
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  // Handle share target requests
  if (url.pathname === '/share-handler' && event.request.method === 'GET') {
    event.respondWith(
      fetch('/share-handler.html').then(response => {
        return response;
      }).catch(() => {
        // Fallback to main page if share handler fails
        return fetch('/');
      })
    );
    return;
  }

  // Handle CORS for downloads
  if (event.request.url.includes('vkrdownloader.xyz')) {
    event.respondWith(
      fetch(event.request).then(response => {
        // Add CORS headers for downloads
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      }).catch(error => {
        console.error('Fetch error:', error);
        return new Response('Network error', { status: 500 });
      })
    );
    return;
  }

  // Default fetch handling
  event.respondWith(fetch(event.request));
});

// Handle notifications for download progress
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'DOWNLOAD_PROGRESS') {
    self.registration.showNotification('RKO Downloader', {
      body: event.data.message,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'download-progress',
      renotify: true,
      silent: false,
      data: {
        progress: event.data.progress
      }
    });
  }
});
const CACHE_NAME = 'rko-downloader-v1';
const urlsToCache = [
  './',
  './index.html',
  './dark.html',
  './style.css',
  './dark.css',
  './javascript.js',
  './logo.png',
  './manifest.webmanifest'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
