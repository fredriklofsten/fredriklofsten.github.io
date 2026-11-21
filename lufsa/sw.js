// Lufsa offline: appen, biblioteken och kartbitar du tittat på sparas i telefonen.
const V="lufsa-v1";
const SHELL=["./","index.html","style.css","config.js","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png",
 "js/core.js","js/data.js","js/social.js","js/map.js","js/tools.js","js/main.js",
 "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css","https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"];
const TILE_CACHE="lufsa-tiles",TILE_MAX=3000;
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==TILE_CACHE&&k.startsWith("lufsa")).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function trimTiles(){const c=await caches.open(TILE_CACHE);const ks=await c.keys();if(ks.length>TILE_MAX)for(const k of ks.slice(0,ks.length-TILE_MAX))await c.delete(k)}
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  if(u.hostname==="tile.openstreetmap.org"){e.respondWith(caches.open(TILE_CACHE).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;
    try{const r=await fetch(e.request);if(r.ok||r.type==="opaque"){c.put(e.request,r.clone());trimTiles()}return r}catch(err){return new Response("",{status:504})}}));return}
  if(u.hostname.includes("nominatim")||u.hostname.includes("supabase"))return;
  // appen: nätet först, sparad kopia om du är offline
  e.respondWith(fetch(e.request).then(r=>{if(r.ok&&(u.origin===location.origin||u.hostname==="unpkg.com"||u.hostname.includes("fonts")||u.hostname.includes("jsdelivr"))){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request).then(h=>h||(e.request.mode==="navigate"?caches.match("index.html"):new Response("",{status:504})))))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(cs=>cs.length?cs[0].focus():self.clients.openWindow("./")))});
