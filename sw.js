const CACHE_NAME = 'ortoapp-cache-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn-icons-png.flaticon.com/512/3063/3063189.png'
];

// Instalar y guardar en caché los archivos base
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Archivos cacheados correctamente.');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activar y limpiar cachés antiguos (útil si actualizas la app)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Limpiando caché antiguo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones (Modo Offline)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Devuelve lo cacheado si no hay internet, sino hace la petición a la red
            return cachedResponse || fetch(event.request);
        })
    );
});
