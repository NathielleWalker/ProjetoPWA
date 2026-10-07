// Nome do cache - mude se atualizar o site
const CACHE_NAME = 'meu-pwa-v1';

// Arquivos que serão salvos para usar offline
const ARQUIVOS_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/Imagens/acessorio.png',
    '/Imagens/alimentacao.png',
    '/Imagens/banho_a.png',
    '/Imagens/brinquedo.png',
    '/Imagens/carrinho.png',
    '/Imagens/CONNECT PET (1).png',
    '/Imagens/consulta.png',
    '/Imagens/gato.png',
    '/Imagens/higiene.png',
    '/Imagens/tosa.png',
    '/Imagens/produtos/arranhador.jpg',
    '/Imagens/produtos/bola.jpg',
    '/Imagens/produtos/cama.jpg',
    '/Imagens/produtos/coleira.jpg',
    '/Imagens/produtos/comedouro.jpg',
    '/Imagens/produtos/imagens (1).jpg',
    '/Imagens/produtos/petisco.png',
    '/Imagens/produtos/racao.jpg',
    '/Imagens/produtos/shampoo1.jpg',
    '/Imagens/produtos/brinquedo.webp',
    '/Imagens/produtos/kithigiene.webp'
];

// Instala o Service Worker e salva os arquivos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Arquivos em cache');
                return cache.addAll(ARQUIVOS_CACHE);
            })
    );
});

// Busca os arquivos do cache (funciona offline)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se achou no cache, usa ele
                if (response) {
                    return response;
                }
                // Se não achou, busca da internet
                return fetch(event.request);
            })
    );
});

// Atualiza o cache quando o Service Worker é atualizado
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Limpando cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

