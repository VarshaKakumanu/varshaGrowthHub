/* Network-first: visitors always get the latest version when online,
   and cached pages when offline. Bump CACHE when you add or rename files. */
const CACHE = "rooting-careers-v1";
const FILES = [
  "./", "index.html", "track.html", "roadmap.html", "mentors.html", "community.html", "about.html", "contact.html",
  "assets/css/site.css",
  "assets/js/config.js", "assets/js/layout.js", "assets/js/home.js", "assets/js/track.js", "assets/js/roadmap.js", "assets/js/mentors.js", "assets/js/contact.js", "assets/js/fx.js", "assets/js/vendor/motion.js",
  "manifest.json", "favicon.png", "favicon.svg", "apple-touch-icon.png", "assets/img/logo.png", "assets/img/logo.svg", "icon-192.png", "icon-512.png"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch:true}).then(m => m || caches.match("index.html"))));
});
