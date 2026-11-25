const CACHE="form-fitness-v13";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon.svg","./assets/form-hero.png","./src/main.js","./src/data.js","./src/foods.js","./src/store.js","./src/styles.css","./src/sync.js","./src/supabase-config.js","./src/exercise-demos.js","./movement-library/","./movement-library/index.html","./movement-library/main.js","./movement-library/styles.css"];
const APP_ASSET=/\.(?:html|m?js|css)(?:\?.*)?$/i;
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("form-fitness-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
  const request=event.request,isAppAsset=request.mode==="navigate"||APP_ASSET.test(new URL(request.url).pathname);
  if(isAppAsset){
    event.respondWith(fetch(request,{cache:"no-cache"}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request).then(cached=>cached||caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match("./index.html"))));
});
