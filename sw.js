self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  self.skipWaiting();
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/logo.png',
        '/generated-icon.png',
        '/manifest.webmanifest',
        '/sw.js',
        '/share-handler.html'
      ]).catch(error => {
        console.error('Cache addAll failed:', error);
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(error => {
      console.error('Fetch or cache match error:', error);
      return new Response('Network error', { status: 500 });
    })
  );

  const url = new URL(event.request.url);

  if (url.pathname === '/share-handler' && event.request.method === 'GET') {
    event.respondWith(
      fetch('/share-handler.html').then(response => {
        return response;
      }).catch(() => {
        return fetch('/');
      })
    );
    return;
  }

  if (event.request.url.includes('vkrdownloader.xyz')) {
    event.respondWith(
      fetch(event.request).then(response => {
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
});

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
