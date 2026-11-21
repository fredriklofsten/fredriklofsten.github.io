// ================= START & NAVIGERING =================
const VIEWS=["hem","socialt","karta","pengar","mer"];
let merTab="verktyg";
function go(v){if(!VIEWS.includes(v))v="hem";document.querySelectorAll(".view").forEach(x=>x.classList.toggle("on",x.id==="v-"+v));
  document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.dataset.v===v));if(location.hash.slice(1)!==v)history.replaceState(null,"","#"+v);window.scrollTo(0,0);
  if(v==="karta"){initMap();setTimeout(()=>map&&map.invalidateSize(),50)}
  if(v==="socialt")renderSocial();if(v==="hem")renderHem();
  $("#fab").style.display=aiReady()&&v!=="mer"?"block":"none"}
window.addEventListener("hashchange",()=>go(location.hash.slice(1)));
function showMer(t){merTab=t;document.querySelectorAll("#merSeg button").forEach(b=>b.classList.toggle("on",b.dataset.ms===t));
  document.querySelectorAll(".ms").forEach(x=>x.style.display=x.id==="ms-"+t?"":"none");
  if(t==="verktyg")closeSub();if(t==="inst"){renderNotif();renderInstall();renderMer()}}
$("#merSeg").onclick=e=>{const b=e.target.closest("[data-ms]");if(b)showMer(b.dataset.ms)};
function closeSub(){document.querySelectorAll("#ms-verktyg .sub").forEach(x=>x.style.display="none");document.querySelectorAll("#ms-verktyg .tool").forEach(x=>x.style.display="")}
$("#ms-verktyg").addEventListener("click",e=>{const o=e.target.closest("[data-open]");if(o){document.querySelectorAll("#ms-verktyg .tool").forEach(x=>x.style.display="none");$("#"+o.dataset.open).style.display="";if(o.dataset.open==="tool-entry")renderEntry();window.scrollTo(0,0);return}
  if(e.target.closest("[data-back]"))closeSub()});

// små påminnelser på startsidan
function renderAlerts(){const out=[];const cur=stopFor(today());
  if(S.ci)out.push(`<div class="card ok" style="border:none"><b>🛟 Trygghetstimer aktiv</b><div class="muted">Tillbaka senast ${esc(S.ci.time)}</div></div>`);
  const nxt=[...S.stops].filter(s=>s.date>today()).sort((a,b)=>a.date.localeCompare(b.date))[0];
  if(nxt&&nxt.country&&(!cur||norm(cur.country)!==norm(nxt.country))&&daysBetween(today(),nxt.date)<=30){const st=(S.entry||{})[norm(nxt.country)]||{};const done=ENTRY.filter(([k])=>st[k]).length;
    if(done<ENTRY.length)out.push(`<div class="card tool" id="alEntry"><div class="ic">🛂</div><div class="grow"><b>${esc(nxt.country)} om ${daysBetween(today(),nxt.date)} dagar</b><div class="muted">Inreselistan: ${done}/${ENTRY.length} klart</div></div><span>›</span></div>`)}
  const mine=DB.data.joins.filter(j=>j.user_id===DB.uid).map(j=>j.hang_id);const up=DB.data.hangs.filter(h=>(mine.includes(h.id)||h.user_id===DB.uid)&&new Date(h.when_at)>Date.now()).sort((a,b)=>a.when_at.localeCompare(b.when_at))[0];
  if(up)out.push(`<div class="card tool" id="alHang"><div class="ic">🍻</div><div class="grow"><b>${esc(up.what)}</b><div class="muted">${esc(up.city)} · ${new Date(up.when_at).toLocaleString("sv-SE",{weekday:"short",hour:"2-digit",minute:"2-digit"})}</div></div><span>›</span></div>`);
  $("#homeAlerts").innerHTML=out.join("");
  const a=$("#alEntry");if(a)a.onclick=()=>{go("mer");showMer("verktyg");document.querySelector('[data-open="tool-entry"]').click()};
  const h=$("#alHang");if(h)h.onclick=()=>{sg="hang";go("socialt")}}
const _renderHem=renderHem;renderHem=function(){_renderHem();renderAlerts()};

function renderAll(){renderHem();renderPengar();renderRutt();renderPacka();renderTrygg();renderPlaces();renderSocial();renderMer();renderMap()}
saveHooks.push(()=>{renderPlaces()});

(async()=>{
  loadLocal();
  await DB.init();
  DB.onChange(()=>{renderSocial();renderAlerts()});
  $("#syncPill").textContent=DB.mode==="local"?"🧪 Testläge":"☁︎ Synkad";
  renderAll();go(location.hash.slice(1)||"hem");showMer("verktyg");
  geocodeMissing();
  if("serviceWorker" in navigator){try{swReg=await navigator.serviceWorker.register("sw.js")}catch(e){}}
})();
