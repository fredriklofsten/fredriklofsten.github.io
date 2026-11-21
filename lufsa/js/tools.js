// ================= VERKTYG =================
const CFG=window.LUFSA_CONFIG||{};
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("Kunde inte ladda – kräver internet första gången"));document.head.appendChild(s)})}

// ---- Kameraöversättning (textläsning i telefonen) ----
let ocrText="";
$("#ocrImg").onchange=async e=>{const f=e.target.files[0];if(!f)return;e.target.value="";
  const prev=$("#ocrPrev");prev.src=URL.createObjectURL(f);prev.style.display="block";
  $("#ocrText").style.display="none";$("#ocrActs").style.display="none";$("#ocrStatus").textContent="Laddar läsverktyget…";
  try{if(!window.Tesseract)await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");
    const img=await shrink(f,1600,.9);
    const r=await Tesseract.recognize(img,$("#ocrLang").value,{logger:m=>{if(m.status==="recognizing text")$("#ocrStatus").textContent=`Läser texten… ${Math.round(m.progress*100)} %`;else if(m.status)$("#ocrStatus").textContent="Förbereder…"}});
    ocrText=(r.data.text||"").trim();
    if(!ocrText){$("#ocrStatus").textContent="Hittade ingen text. Prova närmare, rakare och med bättre ljus.";return}
    $("#ocrStatus").textContent="Klart! Rätta texten om något blev fel, tryck sedan Översätt.";
    $("#ocrText").value=ocrText;$("#ocrText").style.display="";$("#ocrActs").style.display="";updOcrLink();
  }catch(err){$("#ocrStatus").textContent=err.message||"Något gick fel"}};
function updOcrLink(){$("#ocrGo").href="https://translate.google.com/?sl=auto&tl=sv&op=translate&text="+encodeURIComponent($("#ocrText").value.slice(0,4500))}
$("#ocrText").oninput=updOcrLink;
$("#ocrCopy").onclick=()=>copyText($("#ocrText").value);

// ---- Inreseregler: checklista per land ----
const ENTRY=[["pass","Passet gäller minst 6 månader efter hemresan"],["visum","Visum / e-visum kollat (och sökt i tid)"],["vaccin","Vaccin och malariaskydd kollat med vårdcentral eller vaccinationsmottagning"],
 ["forsak","Reseförsäkringen gäller i landet (och för aktiviteterna du ska göra)"],["utresa","Bevis på utresa – biljett vidare eller hem"],["registrering","Digitalt inresekort/registrering ifyllt om landet kräver det"],["ud","Läst UD:s reseinformation för landet"]];
function renderEntry(){
  const countries=[];[...S.stops].sort((a,b)=>(a.date||"9").localeCompare(b.date||"9")).forEach(s=>{const c=(s.country||"").trim();if(c&&!countries.some(x=>norm(x.c)===norm(c)))countries.push({c,date:s.date})});
  S.entry=S.entry||{};
  $("#entryList").innerHTML=countries.map(({c,date})=>{const st=S.entry[norm(c)]||{};const done=ENTRY.filter(([k])=>st[k]).length;
    const days=date?daysBetween(today(),date):null;
    return `<details class="card" ${done<ENTRY.length&&days!=null&&days>=0&&days<30?"open":""}><summary style="cursor:pointer;display:flex;justify-content:space-between;align-items:center"><b style="font-size:17px">${esc(c)}</b><span class="tag ${done===ENTRY.length?"":"warn"}">${done}/${ENTRY.length}${days!=null&&days>=0?" · om "+days+" d":""}</span></summary>
    ${ENTRY.map(([k,l])=>`<label class="check"><input type="checkbox" data-ent="${esc(norm(c))}" data-k="${k}" ${st[k]?"checked":""}><span>${l}</span></label>`).join("")}
    <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap"><a class="btnlike" target="_blank" rel="noopener" href="https://www.google.com/search?q=${encodeURIComponent("UD reseinformation "+c)}">Sök UD om ${esc(c)} ↗</a>
    ${aiReady()?`<button class="ghost sm" data-askentry="${esc(c)}" style="flex:0">✦ Fråga guiden</button>`:""}</div></details>`}).join("")
   ||`<div class="empty"><div class="e">🛂</div>Lägg till stopp med land under Karta så får du en checklista per land.</div>`;
}
$("#entryList").onchange=e=>{const i=e.target.closest("[data-ent]");if(!i)return;S.entry=S.entry||{};const c=i.dataset.ent;S.entry[c]={...(S.entry[c]||{}),[i.dataset.k]:i.checked};save();renderEntry()};
$("#entryList").onclick=e=>{const b=e.target.closest("[data-askentry]");if(b){openAI(`Vilka inreseregler gäller för en svensk medborgare som reser till ${b.dataset.askentry}? Visum, pass, vaccin och annat viktigt. Säg tydligt att jag ska dubbelkolla hos UD och ambassaden.`)}};

// ---- Dela position ----
$("#locShare").onclick=async()=>{$("#locOut").textContent="Hämtar din position…";
  try{const p=await getPos();const link=`https://maps.google.com/?q=${p.lat},${p.lng}`;const text=`Här är jag just nu (${new Date().toLocaleTimeString("sv-SE",{hour:"2-digit",minute:"2-digit"})}): ${link}`;
    $("#locOut").innerHTML=`<div style="margin:6px 0">${esc(text)}</div><div class="row" style="gap:6px"><a href="sms:?&body=${encodeURIComponent(text)}" class="btnlike" style="text-align:center">SMS</a><a href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener" class="btnlike" style="text-align:center">WhatsApp</a><button class="ghost sm" id="locCopy">Kopiera</button></div>`;
    $("#locCopy").onclick=()=>copyText(text);
    if(navigator.share){try{await navigator.share({text})}catch(e){}}
  }catch(e){$("#locOut").textContent=e.message}};

// ---- Notiser ----
let swReg=null;
async function notify(title,body){try{if(!("Notification" in window)||Notification.permission!=="granted")return;
  if(swReg)await swReg.showNotification(title,{body,icon:"icon-192.png",badge:"icon-192.png",vibrate:[200,100,200]});else new Notification(title,{body,icon:"icon-192.png"})}catch(e){}}
function renderNotif(){const st=!("Notification" in window)?"unsupported":Notification.permission;
  $("#notifState").textContent=st==="granted"?"✓ Notiser är på":st==="denied"?"Notiser är blockerade i webbläsarens inställningar":st==="unsupported"?"Den här webbläsaren stödjer inte notiser – installera appen på hemskärmen först":"";
  $("#notifBtn").style.display=st==="default"?"":"none"}
$("#notifBtn").onclick=async()=>{try{await Notification.requestPermission()}catch(e){}renderNotif();notify("Lufsa","Notiser är på 🎒")};
function scheduleHangReminder(hangId){const h=DB.data.hangs.find(x=>x.id===hangId);if(!h)return;S.reminders=[...(S.reminders||[]).filter(r=>r.id!==hangId),{id:hangId,at:new Date(h.when_at).getTime()-60*6e4,title:h.what,city:h.city}];save()}
setInterval(()=>{const now=Date.now();let ch=false;(S.reminders||[]).forEach(r=>{if(!r.done&&now>=r.at){r.done=true;ch=true;notify("Häng om en timme 🍻",`${r.title} i ${r.city}`)}});
  if(ch){S.reminders=S.reminders.filter(r=>now-r.at<864e5);save()}},30000);

// ---- Resefilm ----
let filmFiles=[];
$("#filmImgs").onchange=e=>{filmFiles=[...e.target.files].slice(0,30);$("#filmCount").textContent=filmFiles.length?`${filmFiles.length} bilder valda${e.target.files.length>30?" (max 30)":""}`:"";e.target.value=""};
async function loadImg(src){return await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
function cover(ctx,img,W,H,k){const s=Math.max(W/img.width,H/img.height)*k;const w=img.width*s,h=img.height*s;ctx.drawImage(img,(W-w)/2,(H-h)/2,w,h)}
function wrap(ctx,text,x,y,max,lh){const words=String(text).split(" ");let line="";for(const w of words){const t=line?line+" "+w:w;if(ctx.measureText(t).width>max&&line){ctx.fillText(line,x,y);y+=lh;line=w}else line=t}if(line)ctx.fillText(line,x,y);return y}
$("#filmMake").onclick=async()=>{
  const cv=$("#filmCanvas"),ctx=cv.getContext("2d"),W=cv.width,H=cv.height;
  if(!cv.captureStream||!window.MediaRecorder)return toast("Din webbläsare kan inte spela in film – prova Chrome");
  const imgs=[];for(const f of filmFiles){try{const b=await shrink(f,1280,.9);imgs.push(await loadImg(URL.createObjectURL(b)))}catch(e){}}
  const route=[...S.stops].sort((a,b)=>(a.date||"9").localeCompare(b.date||"9"));
  const title=$("#filmTitle").value.trim()||"Min resa";const st=myStats();
  const lines=[...S.journal].sort((a,b)=>a.date.localeCompare(b.date));
  const scenes=[{d:3000,draw:t=>{ctx.fillStyle="#1f5c45";ctx.fillRect(0,0,W,H);ctx.fillStyle="rgba(255,255,255,.12)";ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(W*.35,H*.62);ctx.lineTo(W*.55,H*.78);ctx.lineTo(W*.78,H*.55);ctx.lineTo(W,H);ctx.fill();
      ctx.globalAlpha=Math.min(1,t*2.5);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 72px 'Bricolage Grotesque',sans-serif";wrap(ctx,title,W/2,H*.36,W-100,82);
      ctx.font="500 32px Inter,sans-serif";ctx.fillStyle="#f2a541";ctx.fillText(`${st.countries} länder · ${st.cities} platser · ${st.nights} nätter`,W/2,H*.5);ctx.globalAlpha=1}}];
  if(route.length)scenes.push({d:Math.max(3000,route.length*700),draw:t=>{ctx.fillStyle="#f4efe6";ctx.fillRect(0,0,W,H);ctx.textAlign="left";ctx.fillStyle="#1f5c45";ctx.font="800 54px 'Bricolage Grotesque',sans-serif";ctx.fillText("Rutten",70,150);
      const n=route.length,gap=Math.min(110,(H-320)/n),shown=Math.min(n,t*n*1.15);
      ctx.strokeStyle="#2f7d5f";ctx.lineWidth=5;ctx.setLineDash([12,14]);ctx.beginPath();ctx.moveTo(100,230);ctx.lineTo(100,230+gap*Math.max(0,shown-1));ctx.stroke();ctx.setLineDash([]);
      route.forEach((s,i)=>{if(i>=shown)return;const y=230+gap*i;ctx.fillStyle=i===Math.floor(shown)-1?"#f2a541":"#2f7d5f";ctx.beginPath();ctx.arc(100,y,14,0,7);ctx.fill();
        ctx.fillStyle="#1d2a24";ctx.font="700 38px Inter,sans-serif";ctx.fillText(s.city,140,y+12);ctx.fillStyle="#6b7a72";ctx.font="400 26px Inter,sans-serif";ctx.fillText(`${s.country||""} · ${s.nights} nätter`,140+ctx.measureText("").width,y+46)})}});
  imgs.forEach((img,i)=>{const cap=lines.length?lines[Math.floor(i*lines.length/Math.max(1,imgs.length))]:null;
    scenes.push({d:2600,draw:t=>{ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);cover(ctx,img,W,H,1+t*.08);
      if(cap){const g=ctx.createLinearGradient(0,H*.68,0,H);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.7)");ctx.fillStyle=g;ctx.fillRect(0,H*.6,W,H*.4);
        ctx.globalAlpha=Math.min(1,t*3);ctx.fillStyle="#fff";ctx.textAlign="left";ctx.font="500 34px Inter,sans-serif";wrap(ctx,"“"+cap.text+"”",50,H-170,W-100,44);ctx.font="400 24px Inter,sans-serif";ctx.fillStyle="#f2a541";ctx.fillText(cap.date,50,H-50);ctx.globalAlpha=1}}})});
  scenes.push({d:2200,draw:t=>{ctx.fillStyle="#1f5c45";ctx.fillRect(0,0,W,H);ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="800 96px 'Bricolage Grotesque',sans-serif";ctx.fillText("Lufsa",W/2,H/2);ctx.font="500 30px Inter,sans-serif";ctx.fillStyle="#f2a541";ctx.fillText("Till nästa äventyr 🎒",W/2,H/2+70)}});
  if(!imgs.length&&!route.length)return toast("Välj bilder eller lägg in en rutt först");
  cv.style.display="block";$("#filmOut").innerHTML="";const btn=$("#filmMake");btn.disabled=true;btn.textContent="Spelar in…";
  const mime=["video/mp4;codecs=avc1","video/webm;codecs=vp9","video/webm"].find(m=>MediaRecorder.isTypeSupported(m))||"";
  const rec=new MediaRecorder(cv.captureStream(30),mime?{mimeType:mime,videoBitsPerSecond:4e6}:{});const chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
  const total=scenes.reduce((a,s)=>a+s.d,0);
  rec.start();const t0=performance.now();
  await new Promise(done=>{function frame(){const el=performance.now()-t0;if(el>=total){done();return}let acc=0;for(const s of scenes){if(el<acc+s.d){s.draw((el-acc)/s.d);break}acc+=s.d}
    btn.textContent=`Spelar in… ${Math.round(el/total*100)} %`;requestAnimationFrame(frame)}frame()});
  rec.stop();await new Promise(r=>rec.onstop=r);
  const type=(mime||"video/webm").split(";")[0],ext=type.includes("mp4")?"mp4":"webm";const blob=new Blob(chunks,{type});const url=URL.createObjectURL(blob);
  cv.style.display="none";btn.disabled=false;btn.textContent="🎬 Skapa film igen";
  $("#filmOut").innerHTML=`<video src="${url}" controls playsinline></video><div class="row" style="margin-top:8px"><a href="${url}" download="lufsa-resefilm.${ext}"><button style="width:100%">⬇️ Spara filmen</button></a>${navigator.canShare?`<button class="ghost" id="filmShare">Dela</button>`:""}</div>`;
  const sh=$("#filmShare");if(sh)sh.onclick=async()=>{const file=new File([blob],`lufsa-resefilm.${ext}`,{type});if(navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title})}catch(e){}}else toast("Dela stöds inte här – spara filmen istället")};
};

// ---- AI-guiden (aktiveras när AI_URL finns) ----
const aiReady=()=>!!CFG.AI_URL;
let chat=[];
const QUICK=["3 gratis saker att göra här","Billigaste vägen till nästa stopp","Vanliga lurendrejerier här","Hjälp mig hålla budgeten","Vad ska en säng kosta här?"];
$("#aiQuick").innerHTML=QUICK.map(q=>`<button class="chip" data-q="${esc(q)}">${esc(q)}</button>`).join("");
$("#aiQuick").onclick=e=>{const b=e.target.closest("[data-q]");if(b){$("#aiIn").value=b.dataset.q;ask()}};
$("#fab").onclick=()=>openAI();
function openAI(q){$("#aiModal").classList.add("on");if(q){$("#aiIn").value=q;ask()}}
$("#aiSend").onclick=ask;$("#aiIn").onkeydown=e=>{if(e.key==="Enter")ask()};
function context(){const st=stats();const arr=[...S.stops].sort((a,b)=>(a.date||"").localeCompare(b.date||""));const cur=stopFor(today());const nxt=arr.find(s=>s.date>today());
  return `Datum: ${today()}. Nuvarande plats: ${cur?cur.city+", "+cur.country:"okänd"}. Nästa stopp: ${nxt?nxt.city+", "+nxt.country+" ("+nxt.date+")":"inget planerat"}. Rutt: ${arr.map(s=>s.city).join(" → ")||"ej angiven"}. Budget kvar: ${S.trip.budget?kr(st.left):"ej angiven"}. Snitt/dag: ${st.avg?kr(st.avg):"okänd"}. Dagsmål: ${st.target?kr(st.target):"okänt"}.`+communityTips(cur?.city)}
async function ask(){const q=$("#aiIn").value.trim();if(!q||!aiReady())return;$("#aiIn").value="";
  chat.push({role:"user",content:q});const box=$("#aiChat");
  box.insertAdjacentHTML("beforeend",`<div class="msg u">${esc(q)}</div><div class="msg a" id="pending">Tänker…</div>`);box.scrollTop=1e9;
  const el=$("#pending");el.removeAttribute("id");
  try{const r=await fetch(CFG.AI_URL,{method:"POST",headers:{"Content-Type":"application/json",...(DB.authHeader?DB.authHeader():{})},body:JSON.stringify({messages:chat,context:context()})});
    if(!r.ok)throw new Error();const j=await r.json();el.textContent=j.text;chat.push({role:"assistant",content:j.text})}
  catch(e){el.textContent="Guiden är inte tillgänglig just nu.";chat.pop()}box.scrollTop=1e9}

// ---- Installera ----
let installEvt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvt=e;renderInstall()});
function renderInstall(){const standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone;
  if(standalone){$("#installCard").style.display="none";return}
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  if(!installEvt){$("#installBtn").style.display="none";$("#installText").innerHTML=ios?"På iPhone: tryck på <b>Dela</b> (rutan med pilen) i Safari och välj <b>Lägg till på hemskärmen</b>.":"Öppna webbläsarens meny (⋮) och välj <b>Installera app</b> eller <b>Lägg till på startskärmen</b>."}
  else $("#installBtn").style.display=""}
$("#installBtn").onclick=async()=>{if(!installEvt)return;installEvt.prompt();await installEvt.userChoice;installEvt=null;renderInstall()};

// ---- Säkerhetskopia ----
$("#expBtn").onclick=()=>copyText(JSON.stringify({v:1,S,social:DB.mode==="local"?DB.data:null,uid:DB.uid}));
$("#impBtn").onclick=()=>{const t=$("#impText");if(t.style.display==="none"){t.style.display="";$("#impBtn").textContent="Återställ nu";return}
  try{const j=JSON.parse(t.value);if(!j.S)throw 0;S={...S,...j.S};save();
    if(j.social&&DB.mode==="local"){localStorage.setItem("lufsa_social",JSON.stringify(j.social));if(j.uid)localStorage.setItem("lufsa_uid",j.uid)}
    toast("Återställt ✓");setTimeout(()=>location.reload(),600)}catch(e){toast("Säkerhetskopian gick inte att läsa")}};
