// service-worker.js — Tropical Roots Plant Manager PWA
var CACHE_VERSION='2.4.0';
var CACHE_NAME='trm-pm-v'+CACHE_VERSION;

var PRECACHE=[
  '/PlantManager.html',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/site.webmanifest'
];

// Install: precache app shell
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(c){return c.addAll(PRECACHE)})
    .then(function(){return self.skipWaiting()})
  );
});

// Activate: purge old caches
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){
        return n.startsWith('trm-pm-')&&n!==CACHE_NAME;
      }).map(function(n){return caches.delete(n)}));
    }).then(function(){return self.clients.claim()})
  );
});

// Fetch strategy
self.addEventListener('fetch',function(e){
  var url=new URL(e.request.url);

  // Google Fonts: stale-while-revalidate
  if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(CACHE_NAME).then(function(cache){
      return cache.match(e.request).then(function(cached){
        var fetched=fetch(e.request).then(function(r){
          if(r.ok) cache.put(e.request,r.clone());
          return r;
        }).catch(function(){return cached});
        return cached||fetched;
      });
    }));
    return;
  }

  // Hero image from tropicalrootsmaui.com: cache on first load
  if(url.hostname==='tropicalrootsmaui.com'&&url.pathname.indexOf('/img/')===0){
    e.respondWith(caches.open(CACHE_NAME).then(function(cache){
      return cache.match(e.request).then(function(cached){
        if(cached) return cached;
        return fetch(e.request).then(function(r){
          if(r.ok) cache.put(e.request,r.clone());
          return r;
        });
      });
    }));
    return;
  }

  // Same-origin: cache-first
  if(url.origin===self.location.origin){
    e.respondWith(
      caches.match(e.request).then(function(cached){
        return cached||fetch(e.request).then(function(r){
          if(r.ok){var cl=r.clone();caches.open(CACHE_NAME).then(function(c){c.put(e.request,cl)})}
          return r;
        });
      })
    );
    return;
  }

  // External APIs (weather, firebase): network only
  e.respondWith(fetch(e.request));
});
