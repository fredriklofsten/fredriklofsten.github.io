/* Rymdakademin: sparar hela appen så att den fungerar utan internet */
const CACHE='rymdakademin-v1';
const FILES=[
"./",
"fonts/fredoka-latin-500-normal.woff2",
"fonts/fredoka-latin-600-normal.woff2",
"fonts/fredoka-latin-700-normal.woff2",
"fonts/nunito-latin-400-normal.woff2",
"fonts/nunito-latin-600-normal.woff2",
"fonts/nunito-latin-800-normal.woff2",
"icons/icon-180.png",
"icons/icon-192.png",
"icons/icon-512.png",
"icons/icon-maskable-512.png",
"index.html",
"lib/CopyShader.js",
"lib/EffectComposer.js",
"lib/LuminosityHighPassShader.js",
"lib/OrbitControls.js",
"lib/RenderPass.js",
"lib/ShaderPass.js",
"lib/UnrealBloomPass.js",
"lib/three.min.js",
"manifest.webmanifest",
"tts.js"
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;}).catch(()=>caches.match('index.html'))));});
