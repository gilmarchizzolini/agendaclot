const CACHE_NAME = "clot-agenda-v11";
const STATIC_ASSETS = [
  "./manifest.json",
  "./logo.png",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key.startsWith("clot-agenda-") && key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  // A navegação SEMPRE tenta a versão mais recente do GitHub Pages.
  // O cache entra apenas como fallback em modo offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Arquivos estáticos: cache-first com atualização em segundo plano.
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        }).catch(() => cached);

        return cached || network;
      })
    );
  }
});
