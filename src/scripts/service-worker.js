const CACHE_NAME = 'restaurant-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/index.js',
  // Tambahkan file fallback untuk offline page jika dibutuhkan
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching all necessary assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Mengaktifkan cache hanya untuk file statik, tidak untuk API
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('restaurant-api.dicoding.dev')) {
    // Fetch langsung dari jaringan untuk API, tidak disimpan di cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return new Response(
            JSON.stringify({ error: 'Data tidak tersedia saat offline.' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
  } else {
    // Cek cache untuk file statik, jika tidak ada fetch dari jaringan
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // Tambahkan fallback offline untuk halaman HTML jika diperlukan
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
    );
  }
});

// Menangani pembaruan cache dengan menghapus cache lama saat ada versi baru
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
