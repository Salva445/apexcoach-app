// ApexCoach offline support for the home-screen web app (not used inside the native apps).
// App files are served from the cache so the app opens without internet; the page itself is
// fetched fresh when online so updates arrive. Server calls (Supabase) are never cached.
const CACHE = "apexcoach-v1";
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./vendor/tailwind-play-3.4.17.js",
  "./vendor/supabase-js-2.118.0.js",
  "./vendor/fonts/fonts.css",
  "./vendor/fonts/outfit_v15_QGYvz_MVcBeNP4NJtEtq.woff2",
  "./vendor/fonts/outfit_v15_QGYvz_MVcBeNP4NJuktqQ4E.woff2",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Supabase, exercise photos: straight to the network

  // The page: network first (to get updates), cached copy when offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }
  // Libraries, fonts, icons: cache first
  event.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
