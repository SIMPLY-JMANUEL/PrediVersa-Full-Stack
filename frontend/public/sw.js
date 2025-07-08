const CACHE_NAME = 'prediversa-v1.0.0';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Estrategia de cache
self.addEventListener('fetch', (event) => {
  // Solo cachear requests GET
  if (event.request.method !== 'GET') return;

  // Ignorar requests de extensiones de navegador
  if (event.request.url.includes('extension')) return;

  // Ignorar requests con esquemas diferentes a http/https
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retornar respuesta cacheada
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }

        // Clonar request porque es un stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Verificar si es una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar response porque es un stream
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              // Solo cachear recursos específicos
              if (shouldCache(event.request.url)) {
                console.log('[SW] Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch((error) => {
          console.log('[SW] Fetch failed:', error);
          
          // Retornar página offline para navegación
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
          
          // Retornar imagen placeholder para imágenes
          if (event.request.destination === 'image') {
            return caches.match('/offline-image.png');
          }
          
          throw error;
        });
      })
  );
});

// Función para determinar qué cachear
function shouldCache(url) {
  // Cachear recursos estáticos
  if (url.includes('/static/')) return true;
  
  // Cachear API responses específicas
  if (url.includes('/api/profile') || url.includes('/api/courses')) return true;
  
  // Cachear páginas principales
  if (url.match(/\/(dashboard|profile|courses)$/)) return true;
  
  return false;
}

// Background Sync para requests fallidos
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    
    event.waitUntil(
      // Reenviar requests en cola
      sendQueuedRequests()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de PrediVersa',
    icon: '/logo192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: '/icons/view.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('PrediVersa', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    // Abrir la aplicación
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
    return;
  } else {
    // Click en el cuerpo de la notificación
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Manejar sharing
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHARE_TARGET') {
    console.log('[SW] Handling share target');
    
    // Procesar archivos compartidos
    const { files, title, text, url } = event.data;
    
    // Almacenar temporalmente para procesamiento
    self.postMessage({
      type: 'SHARE_RECEIVED',
      data: { files, title, text, url }
    });
  }
});

// Función para enviar requests en cola (para Background Sync)
async function sendQueuedRequests() {
  try {
    const cache = await caches.open('failed-requests');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
        console.log('[SW] Queued request sent successfully');
      } catch (error) {
        console.log('[SW] Failed to send queued request:', error);
      }
    }
  } catch (error) {
    console.log('[SW] Error processing queued requests:', error);
  }
}

// Estrategia de actualización de cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      })
    );
  }
});

// Limpieza de cache antigua
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
