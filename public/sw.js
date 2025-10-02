const CACHE_NAME = "ccat-vocab-v1";
const urlsToCache = ["/", "/manifest.json", "/icons/icon.svg", "/favicon.ico"];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - handle navigation and caching
self.addEventListener("fetch", (event) => {
  // Handle navigation requests (SPA routing)
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/").then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Handle other requests with caching
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
