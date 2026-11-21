// ================= SOCIALT =================
const TIPCATS=[["🛏️","Boende"],["🍜","Mat"],["🆓","Gratis"],["🚌","Transport"],["💎","Dold pärla"],["⚠️","Varning"]];
const STYLES=["Budget","Fest","Natur","Kultur","Mat","Lugnt","Äventyr","Vandring","Strand","Digital nomad"];
const EMOJIS=["🧭","🎒","🐢","🦊","🌴","🏔️","🌊","🐒","🦜","🌵"];
const JOBKINDS=[["🛏️","Jobba mot säng"],["🌱","Volontär"],["💶","Betalt"],["🍇","Säsong/farm"],["💻","Distans"]];
const HOSRATES=[["safety","🛡️ Trygghet"],["solo","👩 Bra för ensamresande kvinnor"],["clean","🧽 Renlighet"],["noise","😴 Lugnt att sova"],["social","🍻 Socialt"]];
const STAMPS=[
 ["start","🧭","Första steget",s=>s.stops>=1],["countries3","🌍","3 länder",s=>s.countries>=3],["countries6","🗺️","6 länder",s=>s.countries>=6],
 ["nights30","🌙","30 nätter",s=>s.nights>=30],["nights100","🏕️","100 nätter",s=>s.nights>=100],["post1","📸","Första bilden",s=>s.posts>=1],
 ["tips5","💡","Tipsare",s=>s.tips>=5],["hang1","🍻","Sällskaplig",s=>s.hangs>=1],["hostel3","🛏️","Hostelkritiker",s=>s.hostels>=3],["helper","❤️","10 gillanden",s=>s.likesGot>=10]];
let sg="flode",tipCity="",tipCatF="",tipCat="Mat",postBlob=null,cmtTarget=null,hosCity="",jobKind="Jobba mot säng",jobKindF="",hosDraft={};
const norm=s=>String(s||"").trim().toLowerCase();
const dShort=d=>new Date(d).toLocaleDateString("sv-SE",{day:"numeric",month:"short"});
const ago=t=>{const ts=new Date(t).getTime();const m=Math.round((Date.now()-ts)/6e4);if(m<1)return"nyss";if(m<60)return m+" min";const h=Math.round(m/60);if(h<24)return h+" h";const d=Math.round(h/24);return d<30?d+" d":new Date(ts).toLocaleDateString("sv-SE")};
const hidden=()=>S.hidden||[];
const D=()=>DB.data;
const visible=t=>D()[t].filter(r=>!hidden().includes(r.user_id));
const me=()=>DB.uid;
const myProfile=()=>DB.me();

function myStats(){
  const countries=new Set(S.stops.map(s=>norm(s.country)).filter(Boolean)).size;
  const nights=S.stops.filter(s=>s.date&&s.date<=today()).reduce((a,s)=>a+Math.min(s.nights,Math.max(0,daysBetween(s.date,today()))),0);
  const mine=t=>D()[t].filter(r=>r.user_id===me());
  const myPosts=new Set(mine("posts").map(p=>p.id));
  return {stops:S.stops.length,countries,nights,cities:new Set(S.stops.map(s=>norm(s.city))).size,
    posts:myPosts.size,tips:mine("tips").length,hangs:mine("hangs").length+mine("joins").length,hostels:mine("hostels").length,
    likesGot:D().likes.filter(l=>myPosts.has(l.post_id)).length};
}
// håll den publika profilen i synk med rutten och stämplarna
let syncing=false;
function syncPublic(){const p=myProfile();if(!p||syncing)return;
  const st=myStats();const cur=stopFor(today());
  const route=p.share_route?S.stops.filter(s=>s.date).map(s=>({city:s.city,country:s.country,date:s.date,nights:s.nights})):[];
  const now=p.share_route&&cur?{city:cur.city,country:cur.country}:null;
  const stamps=STAMPS.filter(x=>x[3](st)).map(x=>x[0]);
  const stats={countries:st.countries,nights:st.nights,cities:st.cities};
  if(JSON.stringify([route,now,stamps,stats])!==JSON.stringify([p.route,p.now,p.stamps,p.stats])){syncing=true;DB.saveProfile({...p,route,now,stamps,stats}).finally(()=>syncing=false)}}
saveHooks.push(syncPublic);

function prof(id){return D().profiles[id]||{}}
function nameOf(id){return prof(id).nick||"Resenär"}
function avHtml(id,cls=""){const m=prof(id);return `<div class="av ${cls}" data-person="${esc(id)}">${m.avatar?`<img src="${esc(m.avatar)}" alt="">`:esc(m.emoji||"🎒")}</div>`}
function needProfile(){if(!myProfile()){openProfile();return true}return false}
const countBy=(t,f,v)=>D()[t].filter(r=>r[f]===v).length;
const mineHas=(t,f,v)=>D()[t].some(r=>r[f]===v&&r.user_id===me());
function delBtn(t,r){return r.user_id===me()?`<button class="x" data-del="${t}" data-id="${esc(r.id)}" title="Ta bort">🗑</button>`:`<button class="x" data-hide="${esc(r.user_id)}" title="Dölj den här personen">⋯</button>`}

// ---- render ----
function renderSocial(){
  document.querySelectorAll("#seg button").forEach(b=>b.classList.toggle("on",b.dataset.sg===sg));
  document.querySelectorAll(".sg").forEach(x=>x.style.display=x.id==="sg-"+sg?"":"none");
  const p=myProfile();
  $("#localBanner").style.display=DB.mode==="local"?"":"none";
  $("#profileNudge").style.display=p?"none":"";
  $("#postBox").style.display=p?"":"none";
  $("#meBtn").innerHTML=p?(p.avatar?`<img src="${esc(p.avatar)}">`:esc(p.emoji)):"👤";
  if(p){$("#postAv").innerHTML=p.avatar?`<img src="${esc(p.avatar)}">`:esc(p.emoji);const c=stopFor(today());$("#postCity").textContent=c?"📍 "+c.city:""}
  $("#lfc").checked=!!p?.lfc;
  ({flode:renderFeed,tips:renderTips,sallskap:renderMatches,hang:renderHang,hostels:renderHostels,jobb:renderJobs})[sg]();
}
function renderFeed(){
  const posts=visible("posts").sort((a,b)=>b.created_at.localeCompare(a.created_at)).slice(0,80);
  $("#feed").innerHTML=posts.map(p=>{const likes=countBy("likes","post_id",p.id),liked=mineHas("likes","post_id",p.id),nc=visible("comments").filter(c=>c.post_id===p.id).length;
    return `<div class="card post"><div class="who">${avHtml(p.user_id)}<div style="flex:1"><b data-person="${esc(p.user_id)}">${esc(nameOf(p.user_id))}</b><span class="muted">${p.city?"📍 "+esc(p.city)+" · ":""}${ago(p.created_at)}</span></div>${delBtn("posts",p)}</div>
    ${p.img?`<img class="img" loading="lazy" src="${esc(p.img)}" alt="">`:""}${p.text?`<div style="margin-top:8px;white-space:pre-wrap">${esc(p.text)}</div>`:""}
    <div class="acts"><button class="${liked?"on":""}" data-like="${esc(p.id)}">${liked?"❤️":"🤍"} ${likes||""}</button><button data-cmt="${esc(p.id)}">💬 ${nc||""}</button></div></div>`}).join("")
   ||`<div class="empty"><div class="e">📸</div>Inga inlägg än. Bli först med att dela ett ögonblick från resan!</div>`;
}
function cityChips(list,cur,attr){const cities=[...new Set(list.map(t=>t.city).filter(Boolean))];if(cur&&!cities.some(c=>norm(c)===norm(cur)))cities.unshift(cur);
  return [`<button class="chip ${!cur?"on":""}" data-${attr}="">Alla</button>`,...cities.map(c=>`<button class="chip ${norm(c)===norm(cur)?"on":""}" data-${attr}="${esc(c)}">${esc(c)}</button>`)].join("")}
let tipCityInit=false,hosCityInit=false;
function renderTips(){
  const tips=visible("tips");const cur=stopFor(today());
  if(!tipCityInit&&cur){tipCity=cur.city;tipCityInit=true}
  $("#tipCities").innerHTML=cityChips(tips,tipCity,"tc");
  $("#tipCatsF").innerHTML=[`<button class="chip ${!tipCatF?"on":""}" data-tf="">Allt</button>`,...TIPCATS.map(([i,n])=>`<button class="chip ${tipCatF===n?"on":""}" data-tf="${n}">${i} ${n}</button>`)].join("");
  $("#tipCats").innerHTML=TIPCATS.map(([i,n])=>`<button class="chip ${tipCat===n?"on":""}" data-tk="${n}">${i} ${n}</button>`).join("");
  if(!$("#tipCity").value&&cur)$("#tipCity").value=cur.city;
  const list=tips.filter(t=>(!tipCity||norm(t.city)===norm(tipCity))&&(!tipCatF||t.cat===tipCatF)).map(t=>({...t,v:countBy("votes","tip_id",t.id)})).sort((a,b)=>b.v-a.v||b.created_at.localeCompare(a.created_at));
  $("#tipList").innerHTML=list.map(t=>{const c=TIPCATS.find(x=>x[1]===t.cat)||TIPCATS[0];const on=mineHas("votes","tip_id",t.id);
    return `<div class="card tip"><button class="vote ${on?"on":""}" data-vote="${esc(t.id)}">▲<span>${t.v}</span></button><div style="flex:1;min-width:0">
    <div><span class="tag ${t.cat==="Varning"?"warn":""}">${c[0]} ${esc(t.cat)}</span><span class="tag">📍 ${esc(t.city)}</span>${t.price?`<span class="tag">💰 ${esc(t.price)}</span>`:""}</div>
    <div style="margin:6px 0;white-space:pre-wrap">${esc(t.text)}</div>
    <div class="row" style="gap:6px">${avHtml(t.user_id,"sm")}<span class="muted" style="flex:1">${esc(nameOf(t.user_id))} · ${ago(t.created_at)}</span>${delBtn("tips",t)}</div></div></div>`}).join("")
   ||`<div class="empty"><div class="e">💡</div>${tipCity?"Inga tips för "+esc(tipCity)+" än.":"Inga tips än."} Dela det du önskar att du visste när du kom hit!</div>`;
}
function overlaps(route){const mine=S.stops.filter(s=>s.date);const hits=[];
  (route||[]).forEach(r=>mine.forEach(m=>{if(norm(r.city)!==norm(m.city))return;
    const a1=new Date(m.date),a2=new Date(a1.getTime()+m.nights*864e5),b1=new Date(r.date),b2=new Date(b1.getTime()+r.nights*864e5);
    const s=new Date(Math.max(a1,b1)),e=new Date(Math.min(a2,b2));
    if(e>s)hits.push({city:m.city,from:s.toISOString().slice(0,10),to:e.toISOString().slice(0,10)});
    else if(Math.abs(daysBetween(a1,b1))<21)hits.push({city:m.city,near:true,date:r.date})}));return hits}
function renderMatches(){
  const mine=new Set(myProfile()?.style||[]);const cur=stopFor(today());
  const list=Object.entries(D().profiles).filter(([id])=>id!==me()&&!hidden().includes(id)).map(([id,m])=>{
    const ov=overlaps(m.route);const shared=(m.style||[]).filter(x=>mine.has(x));
    const here=cur&&m.now&&norm(m.now.city)===norm(cur.city);
    const score=ov.filter(o=>!o.near).length*5+ov.filter(o=>o.near).length*2+shared.length+(here?6:0)+(m.lfc?3:0);
    return {id,m,ov,shared,here,score}}).filter(x=>x.score>0||x.m.lfc).sort((a,b)=>b.score-a.score);
  $("#matches").innerHTML=list.map(({id,m,ov,shared,here})=>`<div class="card ${ov.length||here?"match":""}"><div class="row">${avHtml(id)}<div style="flex:1"><b data-person="${esc(id)}">${esc(nameOf(id))}</b><div class="muted">${m.from?"från "+esc(m.from)+" · ":""}${m.now?"📍 "+esc(m.now.city):""}</div></div>${m.lfc?'<span class="tag" style="flex:0;white-space:nowrap">Söker sällskap</span>':""}</div>
    ${here?`<div style="margin-top:8px">🟢 <b>Är i ${esc(m.now.city)} just nu</b> – precis som du</div>`:""}
    ${ov.filter(o=>!o.near).map(o=>`<div style="margin-top:6px">🗓️ Ni är båda i <b>${esc(o.city)}</b> ${dShort(o.from)} – ${dShort(o.to)}</div>`).join("")}
    ${ov.filter(o=>o.near).slice(0,2).map(o=>`<div class="muted" style="margin-top:4px">↔️ Nästan samtidigt i ${esc(o.city)} (${dShort(o.date)})</div>`).join("")}
    ${shared.length?`<div style="margin-top:6px">${shared.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div>`:""}
    ${m.bio?`<p class="muted" style="margin-top:6px">${esc(m.bio)}</p>`:""}
    <div class="row" style="margin-top:10px"><button class="ghost sm" data-person="${esc(id)}">Se profil</button><button class="sm" data-invite="${esc(ov[0]?.city||m.now?.city||"")}">Föreslå häng</button></div></div>`).join("")
   ||`<div class="empty"><div class="e">🤝</div>Inga matchningar än. Lägg in din rutt under Karta och slå på "Jag söker sällskap" – då dyker du upp för andra som korsar din väg.</div>`;
}
function renderHang(){
  const cur=stopFor(today());if(!$("#hCity").value&&cur)$("#hCity").value=cur.city;
  const cutoff=Date.now()-3*36e5;
  const list=visible("hangs").filter(h=>new Date(h.when_at).getTime()>cutoff).sort((a,b)=>a.when_at.localeCompare(b.when_at));
  $("#hangList").innerHTML=list.map(h=>{const going=D().joins.filter(j=>j.hang_id===h.id).map(j=>j.user_id);
    const mineGoing=going.includes(me());const isHere=cur&&norm(cur.city)===norm(h.city);
    return `<div class="card ${isHere?"match":""}"><div class="row"><div style="flex:1"><b>${esc(h.what)}</b><div class="muted">📍 ${esc(h.city)} · ${new Date(h.when_at).toLocaleString("sv-SE",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div></div>${delBtn("hangs",h)}</div>
    <div class="row" style="margin-top:8px;gap:6px">${avHtml(h.user_id,"sm")}<span class="muted" style="flex:1">Bjuder: ${esc(nameOf(h.user_id))}</span></div>
    <div class="row" style="margin-top:8px"><div class="faces" style="flex:1">${going.slice(0,6).map(id=>avHtml(id,"sm")).join("")}${going.length?`<span class="muted" style="margin-left:14px;align-self:center">${going.length} hakar på</span>`:""}</div>
    ${h.user_id!==me()?`<button class="sm ${mineGoing?"ghost":""}" data-join="${esc(h.id)}" style="flex:0;white-space:nowrap">${mineGoing?"Hoppa av":"Jag hänger med!"}</button>`:""}</div></div>`}).join("")
   ||`<div class="empty"><div class="e">🍻</div>Inga häng planerade. Starta ett – någon i samma stad letar säkert efter sällskap också.</div>`;
}
function stars(key,val){return `<span class="stars">${[1,2,3,4,5].map(n=>`<button class="${n<=val?"on":""}" data-star="${key}" data-n="${n}">★</button>`).join("")}</span>`}
function renderHostels(){
  const rows=visible("hostels");const cur=stopFor(today());
  if(!hosCityInit&&cur){hosCity=cur.city;hosCityInit=true}
  if(!$("#hosCity").value&&cur)$("#hosCity").value=cur.city;
  $("#hosCities").innerHTML=cityChips(rows,hosCity,"hc");
  $("#hosRates").innerHTML=HOSRATES.map(([k,l])=>`<div class="rate"><span>${l}</span>${stars(k,hosDraft[k]||0)}</div>`).join("");
  const groups={};rows.filter(r=>!hosCity||norm(r.city)===norm(hosCity)).forEach(r=>{const k=norm(r.name)+"|"+norm(r.city);(groups[k]=groups[k]||[]).push(r)});
  const avg=(g,k)=>{const v=g.map(r=>r[k]).filter(Boolean);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0};
  const list=Object.values(groups).map(g=>({g,score:avg(g,"safety")*.35+avg(g,"solo")*.2+avg(g,"clean")*.15+avg(g,"noise")*.15+avg(g,"social")*.15})).sort((a,b)=>b.score-a.score);
  $("#hosList").innerHTML=list.map(({g,score})=>{const r0=g[0];const lock=g.filter(r=>r.lockers).length;
    return `<div class="card"><div class="row"><div style="flex:1"><b>${esc(r0.name)}</b><div class="muted">📍 ${esc(r0.city)} · ${g.length} betyg</div></div><div class="score" style="flex:0">${score.toFixed(1).replace(".",",")}</div></div>
    ${HOSRATES.map(([k,l])=>{const a=avg(g,k);return a?`<div class="rate"><span class="muted">${l}</span><span>${"★".repeat(Math.round(a))}<span style="color:#d5cbb6">${"★".repeat(5-Math.round(a))}</span></span></div>`:""}).join("")}
    <div style="margin:4px 0">${lock>g.length/2?'<span class="tag">🔒 Låsbara skåp</span>':'<span class="tag warn">🔓 Skåp osäkert</span>'}</div>
    ${g.filter(r=>r.text).slice(-3).reverse().map(r=>`<div class="row" style="gap:8px;margin-top:8px;align-items:flex-start">${avHtml(r.user_id,"sm")}<div style="flex:1"><div>${esc(r.text)}</div><div class="muted">${esc(nameOf(r.user_id))} · ${ago(r.created_at)}</div></div>${delBtn("hostels",r)}</div>`).join("")}</div>`}).join("")
   ||`<div class="empty"><div class="e">🛏️</div>Inga hostelbetyg${hosCity?" för "+esc(hosCity):""} än. Bo du på ett just nu? Betygsätt det nedan.</div>`;
}
function renderJobs(){
  $("#jobKinds").innerHTML=JOBKINDS.map(([i,n])=>`<button class="chip ${jobKind===n?"on":""}" data-jk="${n}">${i} ${n}</button>`).join("");
  $("#jobKindsF").innerHTML=[`<button class="chip ${!jobKindF?"on":""}" data-jf="">Allt</button>`,...JOBKINDS.map(([i,n])=>`<button class="chip ${jobKindF===n?"on":""}" data-jf="${n}">${i} ${n}</button>`)].join("");
  const list=visible("jobs").filter(j=>!jobKindF||j.kind===jobKindF).sort((a,b)=>b.created_at.localeCompare(a.created_at));
  $("#jobList").innerHTML=list.map(j=>{const k=JOBKINDS.find(x=>x[1]===j.kind)||JOBKINDS[0];return `<div class="card"><div class="row"><div style="flex:1"><b>${esc(j.title)}</b><div class="muted">📍 ${esc(j.place)}</div></div>${delBtn("jobs",j)}</div>
    <div style="margin:6px 0"><span class="tag">${k[0]} ${esc(j.kind)}</span></div>
    ${j.offer?`<div>🎁 ${esc(j.offer)}</div>`:""}${j.how?`<div style="margin-top:4px">✉️ ${esc(j.how)}</div>`:""}
    <div class="row" style="gap:6px;margin-top:8px">${avHtml(j.user_id,"sm")}<span class="muted">Tipsat av ${esc(nameOf(j.user_id))} · ${ago(j.created_at)}</span></div></div>`}).join("")
   ||`<div class="empty"><div class="e">🧰</div>Inga jobb tipsade än. Vet du ett hostel som söker folk? Dela det nedan.</div>`;
}

// ---- handlingar ----
async function act(fn,okMsg){try{await fn();okMsg&&toast(okMsg)}catch(e){toast(e?.message&&e.message.length<60?e.message:"Något gick fel – försök igen")}}
$("#seg").onclick=e=>{const b=e.target.closest("[data-sg]");if(b){sg=b.dataset.sg;renderSocial();b.scrollIntoView({inline:"center",block:"nearest"})}};
$("#nudgeBtn").onclick=()=>openProfile();
$("#tipCities").onclick=e=>{const b=e.target.closest("[data-tc]");if(b){tipCity=b.dataset.tc;renderTips()}};
$("#tipCatsF").onclick=e=>{const b=e.target.closest("[data-tf]");if(b){tipCatF=b.dataset.tf;renderTips()}};
$("#tipCats").onclick=e=>{const b=e.target.closest("[data-tk]");if(b){tipCat=b.dataset.tk;renderTips()}};
$("#hosCities").onclick=e=>{const b=e.target.closest("[data-hc]");if(b){hosCity=b.dataset.hc;renderHostels()}};
$("#hosRates").onclick=e=>{const b=e.target.closest("[data-star]");if(b){hosDraft[b.dataset.star]=+b.dataset.n;renderHostels()}};
$("#jobKinds").onclick=e=>{const b=e.target.closest("[data-jk]");if(b){jobKind=b.dataset.jk;renderJobs()}};
$("#jobKindsF").onclick=e=>{const b=e.target.closest("[data-jf]");if(b){jobKindF=b.dataset.jf;renderJobs()}};
$("#tipAdd").onclick=()=>{if(needProfile())return;const text=$("#tipText").value.trim(),city=$("#tipCity").value.trim();if(!text||!city)return toast("Fyll i stad och tips");
  act(async()=>{await DB.add("tips",{city,cat:tipCat,text:text.slice(0,600),price:$("#tipPrice").value.trim().slice(0,30)});$("#tipText").value="";$("#tipPrice").value="";tipCity=city},"Tack för tipset! 💡")};
$("#hAdd").onclick=()=>{if(needProfile())return;const city=$("#hCity").value.trim(),when=$("#hWhen").value,what=$("#hWhat").value.trim();if(!city||!when||!what)return toast("Fyll i stad, tid och vad");
  act(async()=>{await DB.add("hangs",{city,when_at:new Date(when).toISOString(),what:what.slice(0,140)});$("#hWhat").value=""},"Inbjudan ute! 🍻")};
$("#hosAdd").onclick=()=>{if(needProfile())return;const name=$("#hosName").value.trim(),city=$("#hosCity").value.trim();if(!name||!city)return toast("Fyll i hostel och stad");
  if(!hosDraft.safety)return toast("Betygsätt åtminstone tryggheten");
  act(async()=>{await DB.add("hostels",{name:name.slice(0,80),city,...hosDraft,lockers:$("#hosLock").checked,text:$("#hosText").value.trim().slice(0,500)});hosDraft={};$("#hosName").value="";$("#hosText").value="";$("#hosLock").checked=false;hosCity=city},"Tack för betyget! 🛏️")};
$("#jobAdd").onclick=()=>{if(needProfile())return;const title=$("#jobTitle").value.trim(),place=$("#jobPlace").value.trim();if(!title||!place)return toast("Fyll i vad och var");
  act(async()=>{await DB.add("jobs",{title:title.slice(0,100),place:place.slice(0,80),kind:jobKind,offer:$("#jobOffer").value.trim().slice(0,200),how:$("#jobHow").value.trim().slice(0,200)});["jobTitle","jobPlace","jobOffer","jobHow"].forEach(i=>$("#"+i).value="")},"Tack för tipset! 🧰")};
$("#lfc").onchange=e=>{if(needProfile()){e.target.checked=false;return}act(()=>DB.saveProfile({...myProfile(),lfc:e.target.checked}))};

async function shrink(file,max=1280,q=.82){const url=URL.createObjectURL(file);try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
  const k=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
  c.getContext("2d").drawImage(img,0,0,c.width,c.height);return await new Promise(r=>c.toBlob(r,"image/jpeg",q))}finally{URL.revokeObjectURL(url)}}
$("#postImg").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{postBlob=await shrink(f,DB.imgMax||1280,.75);$("#postPrev").innerHTML=`<img class="img" style="width:100%;border-radius:14px;margin-top:8px" src="${URL.createObjectURL(postBlob)}"><button class="ghost sm" id="postRm">Ta bort bild</button>`;$("#postRm").onclick=()=>{postBlob=null;$("#postPrev").innerHTML=""}}catch(err){toast("Kunde inte läsa bilden")}e.target.value=""};
$("#postSend").onclick=async()=>{if(needProfile())return;const text=$("#postText").value.trim();if(!text&&!postBlob)return toast("Skriv något eller välj en bild");
  const btn=$("#postSend");btn.disabled=true;btn.textContent="Delar…";
  await act(async()=>{const img=postBlob?await DB.upload(postBlob):"";const c=stopFor(today());await DB.add("posts",{text:text.slice(0,1000),img,city:c?.city||""});
    $("#postText").value="";postBlob=null;$("#postPrev").innerHTML=""},"Delat! 📸");btn.disabled=false;btn.textContent="Dela"};

document.addEventListener("click",e=>{
  const like=e.target.closest("[data-like]");if(like){if(needProfile())return;act(()=>DB.toggle("likes",{post_id:like.dataset.like}));return}
  const vote=e.target.closest("[data-vote]");if(vote){if(needProfile())return;act(()=>DB.toggle("votes",{tip_id:vote.dataset.vote}));return}
  const join=e.target.closest("[data-join]");if(join){if(needProfile())return;act(async()=>{const on=await DB.toggle("joins",{hang_id:join.dataset.join});if(on)scheduleHangReminder(join.dataset.join)},null);return}
  const cmt=e.target.closest("[data-cmt]");if(cmt){cmtTarget=cmt.dataset.cmt;renderCmts();$("#cmtModal").classList.add("on");return}
  const inv=e.target.closest("[data-invite]");if(inv){closeAll();sg="hang";go("socialt");$("#hCity").value=inv.dataset.invite||"";renderSocial();$("#hWhat").focus();return}
  const del=e.target.closest("[data-del]");if(del){showConfirm("Ta bort det här?",()=>act(()=>DB.remove(del.dataset.del,del.dataset.id),"Borttaget"));return}
  const hide=e.target.closest("[data-hide]");if(hide){const id=hide.dataset.hide;showConfirm(`Dölja allt från ${nameOf(id)}? Du kan ångra under Mer → Inställningar.`,()=>{S.hidden=[...hidden(),id];save();closeAll();renderSocial();renderMer();toast("Personen är dold")});return}
  const p=e.target.closest("[data-person]");if(p&&D().profiles[p.dataset.person]){openPerson(p.dataset.person);return}
  const cl=e.target.closest("[data-close]");if(cl){$("#"+cl.dataset.close).classList.remove("on");return}
});
function closeAll(){document.querySelectorAll(".modal").forEach(m=>m.classList.remove("on"))}
function showConfirm(text,ok){$("#personBody").innerHTML=`<p style="margin:6px 0 14px">${esc(text)}</p><div class="row"><button class="ghost" data-close="personModal">Avbryt</button><button id="cfOk">Ja</button></div>`;$("#personModal").classList.add("on");$("#cfOk").onclick=()=>{$("#personModal").classList.remove("on");ok()}}

function renderCmts(){const list=visible("comments").filter(c=>c.post_id===cmtTarget).sort((a,b)=>a.created_at.localeCompare(b.created_at));
  $("#cmtList").innerHTML=list.map(c=>`<div class="row" style="align-items:flex-start;margin:8px 0;gap:8px">${avHtml(c.user_id,"sm")}<div style="flex:1;background:#f1ece1;border-radius:12px;padding:8px 10px"><b style="font-size:13px">${esc(nameOf(c.user_id))}</b> <span class="muted">${ago(c.created_at)}</span><div>${esc(c.text)}</div></div>${c.user_id===me()?`<button class="x" data-del="comments" data-id="${esc(c.id)}" style="flex:0">🗑</button>`:""}</div>`).join("")||`<p class="muted">Inga kommentarer än.</p>`}
$("#cmtSend").onclick=()=>{if(needProfile())return;const t=$("#cmtIn").value.trim();if(!t)return;act(async()=>{await DB.add("comments",{post_id:cmtTarget,text:t.slice(0,300)});$("#cmtIn").value=""})};

// ---- profil ----
let prDraft=null;
const DEF_PROFILE=()=>({nick:"",emoji:"🎒",avatar:"",from:"",bio:"",style:[],langs:"",contact:"",share_route:true,lfc:false,route:[],now:null,stats:{},stamps:[]});
function openProfile(){prDraft=JSON.parse(JSON.stringify(myProfile()||DEF_PROFILE()));renderProfile();$("#profModal").classList.add("on")}
function renderProfile(){const d=prDraft;
  $("#profAv").innerHTML=d.avatar?`<img src="${esc(d.avatar)}">`:esc(d.emoji);
  $("#emojiPick").innerHTML=EMOJIS.map(x=>`<button class="chip ${!d.avatar&&d.emoji===x?"on":""}" data-em="${x}" style="padding:4px 8px;font-size:18px">${x}</button>`).join("");
  $("#prNick").value=d.nick||"";$("#prFrom").value=d.from||"";$("#prBio").value=d.bio||"";$("#prLangs").value=d.langs||"";$("#prContact").value=d.contact||"";
  $("#prShare").checked=d.share_route!==false;$("#prLfc").checked=!!d.lfc;
  $("#prStyle").innerHTML=STYLES.map(s=>`<button class="chip ${d.style.includes(s)?"on":""}" data-st="${s}">${s}</button>`).join("");
  const st=myStats();$("#myStamps").innerHTML=STAMPS.map(x=>`<div class="stamp ${x[3](st)?"got":""}"><span>${x[1]}</span>${x[2]}</div>`).join("");
}
function readProfileForm(){Object.assign(prDraft,{nick:$("#prNick").value.trim().slice(0,30),from:$("#prFrom").value.trim().slice(0,40),bio:$("#prBio").value.trim().slice(0,240),langs:$("#prLangs").value.trim().slice(0,80),contact:$("#prContact").value.trim().slice(0,80),share_route:$("#prShare").checked,lfc:$("#prLfc").checked})}
$("#emojiPick").onclick=e=>{const b=e.target.closest("[data-em]");if(b){readProfileForm();prDraft.emoji=b.dataset.em;prDraft.avatar="";renderProfile()}};
$("#prStyle").onclick=e=>{const b=e.target.closest("[data-st]");if(b){readProfileForm();const s=b.dataset.st;prDraft.style=prDraft.style.includes(s)?prDraft.style.filter(x=>x!==s):[...prDraft.style,s];renderProfile()}};
$("#profImg").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{readProfileForm();const b=await shrink(f,300,.8);prDraft.avatar=await DB.upload(b);renderProfile()}catch(err){toast("Kunde inte ladda upp bilden")}e.target.value=""};
$("#prSave").onclick=()=>{readProfileForm();if(!prDraft.nick)return toast("Välj ett smeknamn");
  act(async()=>{await DB.saveProfile(prDraft);$("#profModal").classList.remove("on");syncPublic()},"Profil sparad ✓")};
$("#meBtn").onclick=()=>openProfile();

function openPerson(id){const m=prof(id);
  const st=STAMPS.filter(x=>(m.stamps||[]).includes(x[0]));const posts=visible("posts").filter(p=>p.user_id===id&&p.img).slice(-6).reverse();
  const route=[...(m.route||[])].sort((a,b)=>a.date.localeCompare(b.date));const ov=id!==me()?overlaps(route).filter(o=>!o.near):[];
  $("#personBody").innerHTML=`<div class="row" style="justify-content:space-between">${avHtml(id,"big")}<button class="x" data-close="personModal" style="flex:0">✕</button></div>
  <h2 style="margin-top:8px">${esc(nameOf(id))}</h2><div class="muted">${m.from?"Från "+esc(m.from):""}${m.now?" · 📍 "+esc(m.now.city):""}</div>
  ${m.lfc?'<span class="tag" style="margin-top:6px">🤝 Söker sällskap</span>':""}
  ${m.bio?`<p style="margin:10px 0">${esc(m.bio)}</p>`:""}
  ${(m.style||[]).map(s=>`<span class="tag">${esc(s)}</span>`).join("")}
  <div class="grid2" style="margin:12px 0"><div class="stat"><small>Länder</small><b>${m.stats?.countries||0}</b></div><div class="stat"><small>Nätter på resande fot</small><b>${m.stats?.nights||0}</b></div></div>
  ${ov.length?`<div class="card match" style="margin:8px 0">${ov.map(o=>`🗓️ Ni är båda i <b>${esc(o.city)}</b> ${dShort(o.from)} – ${dShort(o.to)}`).join("<br>")}</div>`:""}
  ${m.langs?`<div class="muted">🗣️ ${esc(m.langs)}</div>`:""}${m.contact?`<div style="margin-top:4px">📇 ${esc(m.contact)}</div>`:""}
  ${route.length?`<h3 style="margin-top:12px">Rutt</h3><div class="muted">${route.map(r=>esc(r.city)).join(" → ")}</div>`:""}
  ${st.length?`<h3 style="margin-top:12px">Pass-stämplar</h3><div class="stamps">${st.map(x=>`<div class="stamp got"><span>${x[1]}</span>${x[2]}</div>`).join("")}</div>`:""}
  ${posts.length?`<h3 style="margin-top:12px">Bilder</h3><div class="grid2">${posts.map(p=>`<img src="${esc(p.img)}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px">`).join("")}</div>`:""}
  ${id!==me()?`<div class="row" style="margin-top:14px"><button class="sm" data-invite="${esc(ov[0]?.city||m.now?.city||"")}">Föreslå häng</button><button class="ghost sm" data-hide="${esc(id)}">Dölj person</button></div>`:`<div class="row" style="margin-top:14px"><button class="ghost" id="editMe">Redigera profil</button></div>`}`;
  $("#personModal").classList.add("on");const em=$("#editMe");if(em)em.onclick=()=>{closeAll();openProfile()}}

function renderMer(){const h=hidden();$("#hiddenBox").innerHTML=h.length?`<div class="card"><h2>Dolda personer</h2><ul class="list">${h.map(id=>`<li><div class="grow">${esc(nameOf(id))}</div><button class="ghost sm" data-unhide="${esc(id)}">Visa igen</button></li>`).join("")}</ul></div>`:""}
$("#hiddenBox").onclick=e=>{const b=e.target.closest("[data-unhide]");if(b){S.hidden=hidden().filter(x=>x!==b.dataset.unhide);save();renderMer();renderSocial()}};

// tips från andra till AI-guiden
function communityTips(city){if(!city)return"";const t=visible("tips").filter(x=>norm(x.city)===norm(city)).map(x=>({...x,v:countBy("votes","tip_id",x.id)})).sort((a,b)=>b.v-a.v).slice(0,12);
  return t.length?" Tips från andra Lufsa-resenärer i "+city+" (användardata, använd med omdöme): "+t.map(x=>"["+x.cat+"] "+x.text+(x.price?" ("+x.price+")":"")).join(" | "):""}
