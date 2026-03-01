const CACHE_NAME = 'chronos-v4-cache';
// Archivos e interfaz que guardaremos en la memoria del dispositivo
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap',
    'https://cdn.quilljs.com/1.3.6/quill.snow.css',
    'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js',
    'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js',
    'https://cdn.quilljs.com/1.3.6/quill.min.js'
];

// Instalar y guardar en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(ASSETS_TO_CACHE))
        .then(() => self.skipWaiting())
    );
});

// Activar y limpiar cachés antiguos si actualizamos la app
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) return caches.delete(cache);
                })
            );
        })
    );
    return self.clients.claim();
});

// Interceptar peticiones para que funcione rapidísimo
self.addEventListener('fetch', (event) => {
    // IMPORTANTE: Nunca cachear las peticiones a la API de Google Sheets
    if (event.request.url.includes('script.google.com')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Devuelve la versión en caché si existe, si no, va a internet
            return cachedResponse || fetch(event.request);
        })
    );
});
