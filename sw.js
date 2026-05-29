// Force the new service worker to activate immediately upon installation
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Intercept all network requests and force them to bypass the cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request, { cache: "no-store" }).catch(() => {
            return new Response("Offline. Please check your internet connection.");
        })
    );
});
