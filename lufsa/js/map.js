// ================= KARTA =================
const PLACEKINDS=[["🛏️","Boende"],["🍜","Mat"],["🚌","Station"],["⭐","Sevärdhet"],["🏧","Bankomat"],["🏥","Vård"],["📍","Annat"]];
let map=null,layer=null,meMarker=null,pickMode=false,pickLL=null,plKind="Boende",myPos=null;

function getPos(){return new Promise((res,rej)=>{if(!navigator.geolocation)return rej(new Error("Platstjänster saknas"));
  navigator.geolocation.getCurrentPosition(p=>{myPos={lat:+p.coords.latitude.toFixed(5),lng:+p.coords.longitude.toFixed(5),acc:Math.round(p.coords.accuracy)};res(myPos)},
    e=>rej(new Error(e.code===1?"Du behöver tillåta platsåtkomst":"Kunde inte hitta din position")),{enableHighAccuracy:true,timeout:15000,maximumAge:60000})})}

// stad -> koordinater (OpenStreetMap Nominatim, max 1 fråga per sekund)
let geoQueue=Promise.resolve();
function geocodeStop(st){geoQueue=geoQueue.then(async()=>{
  if(st.lat||!navigator.onLine)return;
  try{const q=encodeURIComponent([st.city,st.country].filter(Boolean).join(", "));
    const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=sv&q=${q}`,{headers:{"Accept":"application/json"}});
    const j=await r.json();if(j[0]){const s=S.stops.find(x=>x.id===st.id);if(s){s.lat=+(+j[0].lat).toFixed(4);s.lng=+(+j[0].lon).toFixed(4);save();renderMap()}}
    else $("#geoNote").textContent=`Hittade inte "${st.city}" på kartan – kontrollera stavningen.`;
  }catch(e){}
  await new Promise(r=>setTimeout(r,1100))})}
function geocodeMissing(){S.stops.filter(s=>!s.lat).forEach(geocodeStop)}

function initMap(){if(map||!window.L)return;
  map=L.map("map",{zoomControl:true,attributionControl:true}).setView([15,100],3);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  layer=L.layerGroup().addTo(map);
  map.on("click",e=>{if(!pickMode)return;pickMode=false;$("#mAddPlace").classList.remove("sun");pickLL=e.latlng;openPlaceModal()});
  renderMap(true);
}
function pin(html,cls){return L.divIcon({className:"",html:`<div class="pinlbl ${cls||""}">${html}</div>`,iconSize:null})}
function renderMap(fit){if(!map)return;layer.clearLayers();
  const arr=[...S.stops].sort((a,b)=>(a.date||"9").localeCompare(b.date||"9"));const cur=stopFor(today());
  const pts=arr.filter(s=>s.lat).map(s=>[s.lat,s.lng]);
  if(pts.length>1)L.polyline(pts,{color:"#2f7d5f",weight:3,dashArray:"6 8"}).addTo(layer);
  arr.forEach((s,i)=>{if(!s.lat)return;L.marker([s.lat,s.lng],{icon:pin(`${i+1}. ${esc(s.city)}`,cur&&cur.id===s.id?"now":"")}).addTo(layer).bindPopup(`<b>${esc(s.city)}</b><br>${s.date||""} · ${s.nights} nätter`)});
  (S.places||[]).forEach(p=>{const k=PLACEKINDS.find(x=>x[1]===p.kind)||PLACEKINDS[6];
    L.marker([p.lat,p.lng],{icon:L.divIcon({className:"",html:`<div style="font-size:24px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3))">${k[0]}</div>`,iconSize:[28,28],iconAnchor:[14,24]})}).addTo(layer)
     .bindPopup(`<b>${esc(p.name)}</b>${p.note?"<br>"+esc(p.note):""}<br><a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener">Vägbeskrivning ↗</a>`)});
  if(myPos){meMarker=L.circleMarker([myPos.lat,myPos.lng],{radius:8,color:"#fff",weight:3,fillColor:"#3d7ea6",fillOpacity:1}).addTo(layer)}
  const all=[...pts,...(S.places||[]).map(p=>[p.lat,p.lng])];
  if(fit&&all.length)map.fitBounds(all,{padding:[40,40],maxZoom:12});
}
function flyTo(id){const s=S.stops.find(x=>x.id===id);if(s&&s.lat&&map){window.scrollTo({top:0,behavior:"smooth"});map.flyTo([s.lat,s.lng],12)}}
function renderPlaces(){
  $("#placeList").innerHTML=(S.places||[]).map(p=>{const k=PLACEKINDS.find(x=>x[1]===p.kind)||PLACEKINDS[6];
    return `<li><span style="font-size:22px">${k[0]}</span><div class="grow"><div class="t">${esc(p.name)}</div><div class="s">${esc(p.kind)}${p.note?" · "+esc(p.note):""}</div></div>
    <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener" class="btnlike" style="padding:6px 10px">Gå dit</a>
    <button class="x" data-flyp="${p.id}">⌖</button><button class="x" data-rp="${p.id}">✕</button></li>`}).join("")||`<li class="muted">Tryck på "Spara plats" och sedan på kartan – t.ex. ditt hostel, så hittar du tillbaka utan internet.</li>`;
}
$("#placeList").onclick=e=>{const r=e.target.closest("[data-rp]"),f=e.target.closest("[data-flyp]");
  if(r){S.places=S.places.filter(p=>p.id!==r.dataset.rp);save();renderPlaces();renderMap()}
  if(f){const p=S.places.find(x=>x.id===f.dataset.flyp);if(p&&map){window.scrollTo({top:0,behavior:"smooth"});map.flyTo([p.lat,p.lng],16)}}};
function openPlaceModal(){$("#plName").value="";$("#plNote").value="";renderPlKinds();$("#placeModal").classList.add("on");setTimeout(()=>$("#plName").focus(),100)}
function renderPlKinds(){$("#plKinds").innerHTML=PLACEKINDS.map(([i,n])=>`<button class="chip ${plKind===n?"on":""}" data-pk="${n}">${i} ${n}</button>`).join("")}
$("#plKinds").onclick=e=>{const b=e.target.closest("[data-pk]");if(b){plKind=b.dataset.pk;renderPlKinds()}};
$("#plSave").onclick=()=>{const name=$("#plName").value.trim();if(!name||!pickLL)return toast("Ge platsen ett namn");
  S.places=[...(S.places||[]),{id:uid(),name:name.slice(0,60),kind:plKind,note:$("#plNote").value.trim().slice(0,120),lat:+pickLL.lat.toFixed(5),lng:+pickLL.lng.toFixed(5)}];
  save();$("#placeModal").classList.remove("on");renderPlaces();renderMap();toast("Plats sparad ⭐")};
$("#mAddPlace").onclick=()=>{if(!map)return;
  if(myPos&&confirmHere()){return}
  pickMode=!pickMode;$("#mAddPlace").classList.toggle("sun",pickMode);if(pickMode)toast("Tryck på kartan där platsen ligger")};
function confirmHere(){showConfirm("Spara platsen där du står just nu? (Nej = välj på kartan)",()=>{pickLL={lat:myPos.lat,lng:myPos.lng};openPlaceModal()});
  const no=document.querySelector("#personBody [data-close]");if(no){no.textContent="Välj på kartan";no.onclick=()=>{$("#personModal").classList.remove("on");pickMode=true;$("#mAddPlace").classList.add("sun");toast("Tryck på kartan där platsen ligger")}}return true}
$("#mLocate").onclick=async()=>{try{const p=await getPos();renderMap();map&&map.flyTo([p.lat,p.lng],15)}catch(e){toast(e.message)}};

// offline: kartbitar du tittat på sparas automatiskt av appen. Knappen sparar dessutom området du ser (i liten skala).
$("#mOffline").onclick=async()=>{if(!map)return;const z=map.getZoom();if(z<11)return toast("Zooma in på staden först");
  const tiles=[];const b=map.getBounds();
  for(let zz=z;zz<=Math.min(z+2,17);zz++){const nw=map.project(b.getNorthWest(),zz).divideBy(256).floor(),se=map.project(b.getSouthEast(),zz).divideBy(256).floor();
    for(let x=nw.x;x<=se.x;x++)for(let y=nw.y;y<=se.y;y++)tiles.push(`https://tile.openstreetmap.org/${zz}/${x}/${y}.png`)}
  const list=tiles.slice(0,120);let n=0;$("#offlineInfo").textContent=`Sparar ${list.length} kartbitar…`;
  for(const u of list){try{await fetch(u,{mode:"cors"});n++}catch(e){}if(n%10===0)$("#offlineInfo").textContent=`Sparar… ${n}/${list.length}`;await new Promise(r=>setTimeout(r,60))}
  $("#offlineInfo").textContent=`✓ ${n} kartbitar sparade för det här området. Allt du har tittat på i kartan finns också kvar utan internet.`;};
