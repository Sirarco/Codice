const CACHE_NAME = 'codice-cache-v1';

// Instalación: No guardamos nada en caché por ahora para facilitar tus cambios
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});