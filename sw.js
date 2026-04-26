const CACHE_NAME = 'pnt-ficha-v43';

// Os arquivos em si não mudam com o salvamento do usuário local
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './img/icon_PNT.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Ativa imediatamente sem esperar a proxima aba abrir
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            // Deleta o cache velho
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assimila todas as paginas abertas atualmente
  );
});

// Cache First, fallback to Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se achar, ou faz fetch
        return response || fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            // Opcional: Adicionar novos items requisitados no cache. (No caso é só index e foto)
            // cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        });
      }).catch(() => {
        // Se a internet e o cache falharem e for o HTML puro
        return caches.match('./index.html');
      })
  );
});
