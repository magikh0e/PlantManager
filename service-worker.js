// service-worker.js  -  Tropical Roots Plant Manager PWA
// Bump CACHE_VERSION on every release that ships a meaningful HTML/CSS/JS
// change. The activate handler purges every other trm-pm-* cache, so the
// old shell (and stale index.html) gets evicted on the next page load.
var CACHE_VERSION='2.24.0';
var CACHE_NAME='trm-pm-v'+CACHE_VERSION;

// Network-first fetches give the network ~3s before falling back to cache.
// Without this, slow/captive networks could keep the user staring at a
// blank screen instead of seeing the cached shell.
var NET_TIMEOUT_MS=3000;

// Static assets only — index.html is intentionally excluded from PRECACHE
// so it goes through the network-first path below and never gets stuck.
// Help + comparison pages ARE precached so they're readable offline (they
// still go through the network-first shell handler so live updates land).
var PRECACHE=[
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/img/PlantManagerLogo.webp',
  '/site.webmanifest',
  '/PlantManagerHelp.html',
  '/plant-manager-vs-grow-with-jane.html',
  '/privacy-policy.html',
  '/CHANGELOG.txt'
];

// Install: precache shell + take over immediately
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(c){return c.addAll(PRECACHE)})
    .then(function(){return self.skipWaiting()})
  );
});

// Activate: purge every old trm-pm-* cache and take control of open clients.
// The trm-share-target cache is deliberately NOT purged here — it might
// contain a freshly-shared photo waiting for the page to consume it.
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){
        return n.startsWith('trm-pm-')&&n!==CACHE_NAME;
      }).map(function(n){return caches.delete(n)}));
    }).then(function(){return self.clients.claim()})
  );
});

// Helper: return true for HTML navigation requests (the index.html shell
// + things like CHANGELOG.txt and PlantManagerHelp.html that the user
// expects to reflect the current deploy).
function isShellRequest(request,url){
  if(request.mode==='navigate') return true;
  if(url.origin!==self.location.origin) return false;
  var p=url.pathname;
  return p==='/'||p.endsWith('.html')||p.endsWith('.txt');
}

// Single fetch listener. The first branch handles the Web Share Target POST
// (manifest declares POST /?action=share-target as the share handler). The
// rest of the function is the normal fetch strategy.
self.addEventListener('fetch',function(e){
  var url=new URL(e.request.url);

  // Web Share Target: receive a shared photo from the OS share sheet.
  // The manifest POSTs the multipart form here. We stash the file in a
  // dedicated cache under a known key and 303-redirect to a GET so the
  // page can load and consume the stash on init.
  if(e.request.method==='POST'&&url.searchParams.get('action')==='share-target'){
    e.respondWith((async function(){
      try{
        var formData=await e.request.formData();
        var file=formData.get('photo');
        var title=formData.get('title')||'';
        var text=formData.get('text')||'';
        var cache=await caches.open('trm-share-target');
        if(file&&file.size>0){
          var headers=new Headers({'Content-Type':file.type||'application/octet-stream'});
          if(file.name) headers.set('X-Filename',encodeURIComponent(file.name));
          await cache.put('/_share/photo',new Response(file,{headers:headers}));
        }
        if(title||text){
          await cache.put('/_share/meta',new Response(JSON.stringify({title:title,text:text}),{headers:{'Content-Type':'application/json'}}));
        }
      }catch(err){
        // Swallow — we still want to redirect so the user lands somewhere.
      }
      return Response.redirect('/?action=share-target&consumed=1',303);
    })());
    return;
  }

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

  // App shell (index.html, CHANGELOG.txt, PlantManagerHelp.html, /):
  // network-first with a 3s timeout so deploys land on the next reload, but
  // a flaky/slow connection doesn't stall the page indefinitely. After the
  // timeout — or on any network error — we fall back to whatever is in the
  // cache, then ultimately to '/'.
  if(isShellRequest(e.request,url)){
    e.respondWith(
      Promise.race([
        fetch(e.request).then(function(r){
          if(r.ok){var cl=r.clone();caches.open(CACHE_NAME).then(function(c){c.put(e.request,cl)})}
          return r;
        }),
        new Promise(function(_,reject){setTimeout(function(){reject(new Error('SW network timeout'))},NET_TIMEOUT_MS)})
      ]).catch(function(){return caches.match(e.request).then(function(c){return c||caches.match('/')})})
    );
    return;
  }

  // Same-origin static assets (images, manifest, etc.): cache-first
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

// Allow the page to trigger an immediate update (called after WhatsNew etc).
self.addEventListener('message',function(e){
  if(e.data&&e.data.type==='SKIP_WAITING') self.skipWaiting();
});
