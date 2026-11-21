
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const kr=n=>Math.round(n).toLocaleString("sv-SE")+" kr";
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("on"),1800)}

const CATS=[["🛏️","Boende"],["🍜","Mat"],["🚌","Transport"],["🎟️","Aktivitet"],["🍺","Nöje"],["🧴","Övrigt"]];
const DEF_RATES={EUR:11.0,USD:10.0,GBP:13.0,THB:0.30,VND:0.0004,IDR:0.00063,MYR:2.3,PHP:0.18,INR:0.115,JPY:0.066,AUD:6.5,NZD:6.0,MXN:0.55,COP:0.0026,PEN:2.8,BRL:1.8,ARS:0.01};
const TEMPLATES={
 "Bas":[["Ryggsäck 40 l",1200],["Pass + kopior",100],["Mobil + laddare",300],["Powerbank",250],["Universaladapter",120],["Hänglås",80],["Snabbtorkande handduk",250],["Tandborste + tandkräm",80],["Första hjälpen",200],["Vattenflaska",150]],
 "Tropik":[["T-shirt ×3",450],["Shorts ×2",350],["Badkläder",150],["Sandaler",400],["Solkräm",200],["Myggmedel",120],["Tunn regnjacka",250],["Keps",80]],
 "Kallt":[["Dunjacka",450],["Ullunderställ",350],["Fleece",400],["Mössa + vantar",150],["Vandringskängor",1100],["Ullsockor ×3",240]],
 "Trek":[["Vandringskängor",1100],["Pannlampa",90],["Vattenrening",60],["Sovsäckslakan",200],["Stavar",450],["Regnskydd säck",100]],
 "Stad":[["Jeans",600],["Snygg tröja",300],["Sneakers",700],["Liten dagsväska",250]]
};
const PHRASES={
 sv:["Hej","Tack","Hur mycket kostar det?","Var är toaletten?","Kan du sänka priset?","Ingen is, tack","Hjälp!","Jag behöver en läkare"],
 "Spanska":["Hola","Gracias","¿Cuánto cuesta?","¿Dónde está el baño?","¿Me puede hacer un descuento?","Sin hielo, por favor","¡Ayuda!","Necesito un médico"],
 "Portugisiska":["Olá","Obrigado","Quanto custa?","Onde fica o banheiro?","Pode fazer um desconto?","Sem gelo, por favor","Socorro!","Preciso de um médico"],
 "Franska":["Bonjour","Merci","Combien ça coûte ?","Où sont les toilettes ?","Vous pouvez faire une réduction ?","Sans glaçons, s'il vous plaît","Au secours !","J'ai besoin d'un médecin"],
 "Thai":["สวัสดี","ขอบคุณ","ราคาเท่าไหร่","ห้องน้ำอยู่ที่ไหน","ลดได้ไหม","ไม่ใส่น้ำแข็ง","ช่วยด้วย","ฉันต้องการหมอ"],
 "Vietnamesiska":["Xin chào","Cảm ơn","Bao nhiêu tiền?","Nhà vệ sinh ở đâu?","Bớt được không?","Không đá","Cứu tôi với!","Tôi cần bác sĩ"],
 "Indonesiska":["Halo","Terima kasih","Berapa harganya?","Di mana toilet?","Bisa kurang?","Tanpa es, ya","Tolong!","Saya perlu dokter"]
};
const MOODS=["😩","😐","🙂","😄","🤩"];

let S={places:[],hidden:[],entry:{},trip:{budget:0,start:"",end:""},rates:{...DEF_RATES},cur:"THB",expenses:[],buddies:[],stops:[],pack:[],goal:7,journal:[],nod:{},ci:null,lang:"Spanska",updatedAt:0};
let cat="Mat", mood=2, payer="me", parts=["me"];

// ---- lagring (i telefonen) ----
function loadLocal(){try{const r=localStorage.getItem("lufsa");if(r)S={...S,...JSON.parse(r)}}catch(e){}}
let saveHooks=[];
function save(){S.updatedAt=Date.now();try{localStorage.setItem("lufsa",JSON.stringify(S))}catch(e){toast("Lagringen i telefonen är full")}saveHooks.forEach(f=>{try{f()}catch(e){}})}
// ---- beräkningar ----
const sek=e=>e.cur==="SEK"?e.amount:e.amount*(S.rates[e.cur]??0);
const partsOf=e=>e.parts||["me"];
function myShare(e){const p=partsOf(e);return p.includes("me")?sek(e)/p.length:0}
function daysBetween(a,b){return Math.round((new Date(b)-new Date(a))/864e5)}
function stopFor(date){let s=null;[...S.stops].sort((a,b)=>a.date.localeCompare(b.date)).forEach(x=>{if(x.date&&x.date<=date)s=x});return s}
function stats(){
  const spent=S.expenses.reduce((a,e)=>a+myShare(e),0);
  const left=(S.trip.budget||0)-spent;
  const start=S.trip.start||(S.expenses.length?S.expenses.map(e=>e.date).sort()[0]:today());
  const day=Math.max(1,daysBetween(start,today())+1);
  const last7=S.expenses.filter(e=>daysBetween(e.date,today())<7).reduce((a,e)=>a+myShare(e),0);
  const first=S.expenses.length?S.expenses.map(e=>e.date).sort()[0]:today();const span=Math.max(1,Math.min(7,daysBetween(first,today())+1));
  const avg=S.expenses.length?(last7/span||spent/Math.max(1,daysBetween(first,today())+1)):0;
  const plannedLeft=S.trip.end?Math.max(0,daysBetween(today(),S.trip.end)):null;
  const target=plannedLeft?left/Math.max(1,plannedLeft):null;
  const todaySpent=S.expenses.filter(e=>e.date===today()).reduce((a,e)=>a+myShare(e),0);
  return {spent,left,day,avg,plannedLeft,target,todaySpent};
}

// ---- HEM ----
function renderHem(){
  const t=S.trip, st=stats();
  $("#tBudget").value=t.budget||"";$("#tStart").value=t.start||"";$("#tEnd").value=t.end||"";
  const hero=$("#heroCard");
  if(!t.budget){$("#runway").textContent="–";$("#runwaySub").textContent="Ställ in din resa nedan för att komma igång.";}
  else if(!st.avg){$("#runway").textContent="∞";$("#runwaySub").textContent="Lägg in din första utgift så räknar jag ut hur länge du kan resa.";}
  else{
    const d=Math.floor(st.left/st.avg);
    $("#runway").textContent=d+" dagar";
    let sub=`i din nuvarande takt (${kr(st.avg)}/dag senaste veckan)`;
    if(st.plannedLeft!=null){const diff=d-st.plannedLeft;
      sub+= diff>=0?` · ${diff} dagar extra jämfört med planen 🎉`:` · ${-diff} dagar kort – sänk till ${kr(st.target)}/dag`;
      hero.style.background=diff>=0?"var(--green)":"#9a3b31";}
    $("#runwaySub").textContent=sub;
  }
  $("#stLeft").textContent=t.budget?kr(st.left):"–";
  $("#stToday").textContent=kr(st.todaySpent)+(st.target?" / "+kr(st.target):"");
  $("#stAvg").textContent=st.avg?kr(st.avg):"–";
  $("#stDay").textContent=t.start?st.day:"–";
  const td=S.journal.find(j=>j.date===today());
  if(td){mood=td.mood;$("#jText").value=td.text}
  $("#moods").innerHTML=MOODS.map((m,i)=>`<button class="mood ${i===mood?"on":""}" data-m="${i}">${m}</button>`).join("");
  $("#jList").innerHTML=[...S.journal].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10).map(j=>{
    const s=stopFor(j.date);return `<li><span style="font-size:22px">${MOODS[j.mood]}</span><div class="grow"><div class="s">${j.date}${s?" · "+esc(s.city):""}</div><div>${esc(j.text)}</div></div></li>`}).join("")||"";
}
$("#moods").onclick=e=>{const b=e.target.closest("[data-m]");if(!b)return;mood=+b.dataset.m;document.querySelectorAll(".mood").forEach(x=>x.classList.toggle("on",+x.dataset.m===mood))};
$("#jSave").onclick=()=>{const text=$("#jText").value.trim();if(!text)return toast("Skriv en rad först");
  S.journal=S.journal.filter(j=>j.date!==today());S.journal.push({date:today(),mood,text});save();renderHem();toast("Dagen sparad ✓")};
$("#tSave").onclick=()=>{S.trip={budget:+$("#tBudget").value||0,start:$("#tStart").value,end:$("#tEnd").value};save();renderHem();toast("Resan sparad ✓")};

// ---- PENGAR ----
function renderPengar(){
  const codes=["SEK",...Object.keys(S.rates)];
  $("#eCur").innerHTML=codes.map(c=>`<option ${c===S.cur?"selected":""}>${c}</option>`).join("");
  $("#eCats").innerHTML=CATS.map(([i,n])=>`<button class="chip ${n===cat?"on":""}" data-c="${n}">${i} ${n}</button>`).join("");
  conv();
  // split
  if(S.buddies.length){
    $("#splitBox").innerHTML=`<label>Vem betalade?</label><div class="chips" id="payer">${[["me","Jag"],...S.buddies.map(b=>[b.id,b.name])].map(([id,n])=>`<button class="chip ${payer===id?"on":""}" data-p="${id}">${esc(n)}</button>`).join("")}</div>
    <label>Vilka var med? (delas lika)</label><div class="chips" id="splitW">${[["me","Jag"],...S.buddies.map(b=>[b.id,b.name])].map(([id,n])=>`<button class="chip ${parts.includes(id)?"on":""}" data-s="${id}">${esc(n)}</button>`).join("")}</div>`;
  } else $("#splitBox").innerHTML="";
  // bars
  const tot={};S.expenses.forEach(e=>tot[e.cat]=(tot[e.cat]||0)+myShare(e));
  const max=Math.max(1,...Object.values(tot));const sum=Object.values(tot).reduce((a,b)=>a+b,0);
  $("#catBars").innerHTML=sum?CATS.filter(([,n])=>tot[n]).sort((a,b)=>tot[b[1]]-tot[a[1]]).map(([i,n])=>`<div style="margin:8px 0"><div class="row" style="justify-content:space-between"><span>${i} ${n}</span><b style="flex:0;white-space:nowrap">${kr(tot[n])} · ${Math.round(tot[n]/sum*100)}%</b></div><div class="bar" style="margin-top:4px"><i style="width:${tot[n]/max*100}%"></i></div></div>`).join(""):`<p class="muted">Inga utgifter än.</p>`;
  // buddies
  $("#bList").innerHTML=S.buddies.map(b=>`<span class="chip">${esc(b.name)} <a href="#" data-rb="${b.id}" style="color:var(--mut);text-decoration:none">✕</a></span>`).join("");
  $("#settle").innerHTML=settle();
  // list
  $("#eList").innerHTML=[...S.expenses].sort((a,b)=>b.ts-a.ts).slice(0,40).map(e=>{
    const c=CATS.find(x=>x[1]===e.cat)||CATS[5];const who=e.payer&&e.payer!=="me"?(S.buddies.find(b=>b.id===e.payer)?.name||"?")+" betalade":"";
    return `<li><span style="font-size:22px">${c[0]}</span><div class="grow"><div class="t">${esc(e.note||e.cat)}</div><div class="s">${e.date}${e.stop?" · "+esc(e.stop):""}${partsOf(e).length>1?" · delad "+partsOf(e).length+" pers":""}${who?" · "+esc(who):""}</div></div><div style="text-align:right"><b>${kr(myShare(e))}</b><div class="s">${e.amount} ${e.cur}</div></div><button class="x" data-re="${e.id}">✕</button></li>`}).join("")||`<li class="muted">Inga utgifter än.</li>`;
  $("#rList").innerHTML=Object.entries(S.rates).map(([c,v])=>`<li><b style="width:50px;flex:0">${c}</b><input data-rate="${c}" type="number" inputmode="decimal" value="${v}" style="flex:1"><button class="x" data-rr="${c}">✕</button></li>`).join("");
}
function conv(){const a=+$("#eAmt").value,c=$("#eCur").value;$("#eConv").textContent=a?`≈ ${kr(a*(c==="SEK"?1:S.rates[c]||0))}`:""}
function settle(){
  if(!S.buddies.length)return"";
  const bal={me:0};S.buddies.forEach(b=>bal[b.id]=0);
  S.expenses.forEach(e=>{const pp=partsOf(e),pay=e.payer||"me";if(pp.length===1&&pp[0]===pay)return;const share=sek(e)/pp.length;
    pp.forEach(p=>{if(p in bal)bal[p]-=share});if(pay in bal)bal[pay]+=sek(e)});
  const nm=id=>id==="me"?"Du":(S.buddies.find(b=>b.id===id)?.name||"?");
  const deb=Object.entries(bal).filter(([,v])=>v<-1).map(([k,v])=>[k,-v]),cred=Object.entries(bal).filter(([,v])=>v>1);
  const out=[];let i=0,j=0;while(i<deb.length&&j<cred.length){const m=Math.min(deb[i][1],cred[j][1]);out.push(`${esc(nm(deb[i][0]))} → ${esc(nm(cred[j][0]))}: <b>${kr(m)}</b>`);deb[i][1]-=m;cred[j][1]-=m;if(deb[i][1]<1)i++;if(cred[j][1]<1)j++}
  return `<div class="card ok" style="margin:10px 0 0;border:none"><h3>Att göra upp</h3>${out.length?out.map(x=>`<div style="margin:4px 0">${x}</div>`).join(""):'<div class="muted">Ni är kvitt ✓</div>'}</div>`;
}
$("#eAmt").oninput=conv;$("#eCur").onchange=()=>{S.cur=$("#eCur").value;conv();save()};
$("#eCats").onclick=e=>{const b=e.target.closest("[data-c]");if(b){cat=b.dataset.c;renderPengar()}};
$("#splitBox").onclick=e=>{const p=e.target.closest("[data-p]"),s=e.target.closest("[data-s]");
  if(p){payer=p.dataset.p;renderPengar()}
  if(s){const id=s.dataset.s;parts=parts.includes(id)?parts.filter(x=>x!==id):[...parts,id];if(!parts.length)parts=[id];renderPengar()}};
$("#eAdd").onclick=()=>{const amount=+$("#eAmt").value;if(!amount)return toast("Skriv ett belopp");
  const st=stopFor(today());
  const e={id:uid(),ts:Date.now(),date:today(),amount,cur:$("#eCur").value,cat,note:$("#eNote").value.trim(),stop:st?.city||"",payer,parts:[...parts]};
  S.expenses.push(e);$("#eAmt").value="";$("#eNote").value="";parts=["me"];payer="me";save();renderPengar();renderHem();toast("Tillagd ✓")};
$("#eList").onclick=e=>{const b=e.target.closest("[data-re]");if(b){S.expenses=S.expenses.filter(x=>x.id!==b.dataset.re);save();renderPengar();renderHem()}};
$("#bAdd").onclick=()=>{const n=$("#bName").value.trim();if(!n)return;S.buddies.push({id:uid(),name:n});$("#bName").value="";save();renderPengar()};
$("#bList").onclick=e=>{const b=e.target.closest("[data-rb]");if(b){e.preventDefault();S.buddies=S.buddies.filter(x=>x.id!==b.dataset.rb);parts=parts.filter(x=>x!==b.dataset.rb);if(!parts.length)parts=["me"];if(payer===b.dataset.rb)payer="me";save();renderPengar()}};
$("#rList").onchange=e=>{const i=e.target.closest("[data-rate]");if(i){S.rates[i.dataset.rate]=+i.value;save();renderHem()}};
$("#rList").onclick=e=>{const b=e.target.closest("[data-rr]");if(b){delete S.rates[b.dataset.rr];save();renderPengar()}};
$("#rAdd").onclick=()=>{const c=$("#rCode").value.trim().toUpperCase(),v=+$("#rVal").value;if(!c||!v)return;S.rates[c]=v;$("#rCode").value="";$("#rVal").value="";save();renderPengar()};

// ---- RUTT ----
function renderRutt(){
  const t=today();const arr=[...S.stops].sort((a,b)=>(a.date||"9").localeCompare(b.date||"9"));const cur=stopFor(t);
  $("#stops").innerHTML=arr.map(s=>{
    const cost=S.expenses.filter(e=>e.stop===s.city).reduce((a,e)=>a+myShare(e),0);
    const end=s.date?new Date(new Date(s.date).getTime()+s.nights*864e5).toISOString().slice(0,10):"";
    const cls=cur&&cur.id===s.id?"now":(end&&end<t?"past":"");
    return `<div class="stop ${cls}"><div class="row" style="justify-content:space-between"><div style="flex:1" data-fly="${s.id}"><b>${esc(s.city)}</b> <span class="muted">${esc(s.country)}</span>${cls==="now"?' <span class="pill" style="background:var(--sun);color:#1d2a24">Du är här</span>':""}</div><button class="x" data-rs="${s.id}" style="flex:0">✕</button></div>
    <div class="s muted">${s.date||"Inget datum"} · ${s.nights} nätter${cost?` · ${kr(cost)} (${kr(cost/Math.max(1,s.nights))}/natt)`:""}</div></div>`}).join("")||`<p class="muted">Lägg till ditt första stopp nedan.</p>`;
}
$("#sAdd").onclick=()=>{const city=$("#sCity").value.trim();if(!city)return toast("Skriv en plats");
  const st={id:uid(),city,country:$("#sCountry").value.trim(),date:$("#sDate").value,nights:+$("#sNights").value||1};S.stops.push(st);if(window.geocodeStop)geocodeStop(st);
  $("#sCity").value="";$("#sCountry").value="";save();renderRutt();window.renderMap&&renderMap();toast("Stopp tillagt ✓")};
$("#stops").onclick=e=>{const b=e.target.closest("[data-rs]");if(b){S.stops=S.stops.filter(x=>x.id!==b.dataset.rs);save();renderRutt();window.renderMap&&renderMap();return}const f=e.target.closest("[data-fly]");if(f&&window.flyTo)flyTo(f.dataset.fly)};

// ---- PACKA ----
function renderPacka(){
  const g=S.pack.reduce((a,p)=>a+(+p.g||0),0);const goal=S.goal*1000;
  $("#pWeight").textContent=(g/1000).toFixed(1).replace(".",",")+" kg";
  $("#pGoal").textContent=g>goal?`${((g-goal)/1000).toFixed(1).replace(".",",")} kg över målet`:`${((goal-g)/1000).toFixed(1).replace(".",",")} kg kvar till målet`;
  $("#pBar").style.width=Math.min(100,g/goal*100)+"%";$("#pBar").style.background=g>goal?"var(--red)":"var(--green2)";
  const packed=S.pack.filter(p=>p.done).length;$("#pPacked").textContent=S.pack.length?`${packed} av ${S.pack.length} saker packade`:"";
  $("#pGoals").innerHTML=[[7,"7 kg – handbagage"],[10,"10 kg"],[15,"15 kg"]].map(([v,n])=>`<button class="chip ${S.goal===v?"on":""}" data-g="${v}">${n}</button>`).join("");
  $("#pTemplates").innerHTML=Object.keys(TEMPLATES).map(k=>`<button class="chip" data-t="${k}">+ ${k}</button>`).join("");
  const heavy=[...S.pack].sort((a,b)=>b.g-a.g);
  $("#pList").innerHTML=heavy.map(p=>`<li><input type="checkbox" data-pc="${p.id}" ${p.done?"checked":""} style="width:22px;height:22px;flex:0"><div class="grow"><div class="t" style="${p.done?"text-decoration:line-through;color:var(--mut)":""}">${esc(p.n)}</div><div class="s">${p.g} g${p.g>=goal*0.1?" · tung – behövs den?":""}</div></div><button class="x" data-pr="${p.id}">✕</button></li>`).join("")||`<li class="muted">Välj en mall ovan eller lägg till själv.</li>`;
}
$("#pGoals").onclick=e=>{const b=e.target.closest("[data-g]");if(b){S.goal=+b.dataset.g;save();renderPacka()}};
$("#pTemplates").onclick=e=>{const b=e.target.closest("[data-t]");if(!b)return;let n=0;TEMPLATES[b.dataset.t].forEach(([name,g])=>{if(!S.pack.some(p=>p.n===name)){S.pack.push({id:uid(),n:name,g,done:false});n++}});save();renderPacka();toast(`${n} saker tillagda`)};
$("#pList").onclick=e=>{const c=e.target.closest("[data-pc]"),r=e.target.closest("[data-pr]");
  if(c){const p=S.pack.find(x=>x.id===c.dataset.pc);p.done=c.checked;save();renderPacka()}
  if(r){S.pack=S.pack.filter(x=>x.id!==r.dataset.pr);save();renderPacka()}};
$("#pAdd").onclick=()=>{const n=$("#pName").value.trim();if(!n)return;S.pack.push({id:uid(),n,g:+$("#pGram").value||0,done:false});$("#pName").value="";$("#pGram").value="";save();renderPacka()};

// ---- TRYGG ----
function renderTrygg(){
  const n=S.nod||{};[["nName","name"],["nBlood","blood"],["nAll","all"],["nIce","ice"],["nIns","ins"],["nInsTel","insTel"]].forEach(([i,k])=>$("#"+i).value=n[k]||"");
  $("#lang").innerHTML=Object.keys(PHRASES).filter(k=>k!=="sv").map(k=>`<button class="chip ${S.lang===k?"on":""}" data-l="${k}">${k}</button>`).join("");
  $("#phrases").innerHTML=PHRASES[S.lang].map((p,i)=>`<li data-ph="${i}" style="cursor:pointer"><div class="grow"><div class="t">${esc(p)}</div><div class="s">${esc(PHRASES.sv[i])}</div></div><span>⤢</span></li>`).join("");
  renderCI();
}
function renderCI(){
  const c=S.ci;if(!c){$("#ciActive").innerHTML="";$("#ciForm").style.display="";$("#ciCard").classList.remove("warn");return}
  $("#ciForm").style.display="none";
  const due=new Date(c.due),late=Date.now()>due;
  const msg=`Hej! Det är ${S.nod?.name||"jag"}. Jag skulle varit tillbaka kl ${c.time} från: ${c.where||"en utflykt"} men har inte checkat in. Kan du försöka nå mig?`+(c.pos?` Min senaste position: https://maps.google.com/?q=${c.pos.lat},${c.pos.lng}`:"");
  $("#ciCard").classList.toggle("warn",late);
  $("#ciActive").innerHTML=late?`<h3 style="margin-top:8px">⚠️ Du har inte checkat in!</h3><p>Är du okej? Checka in – eller skicka larmet till din kontakt.</p>
   <div class="row" style="margin:10px 0"><button class="sun" id="ciDone">Jag är okej ✓</button></div>
   <p style="font-size:13px">SMS till ${esc(c.phone)}:</p><p style="font-size:13px;background:rgba(255,255,255,.15);padding:8px;border-radius:10px;margin:4px 0">${esc(msg)}</p>
   <div class="row"><a href="sms:${esc(c.phone)}?body=${encodeURIComponent(msg)}"><button class="ghost" style="width:100%">Öppna SMS</button></a><button class="ghost" id="ciCopy">Kopiera</button></div>`
  :`<div class="card ok" style="border:none;margin:8px 0"><b>Timer aktiv</b><div class="muted">Tillbaka senast ${c.time} · ${esc(c.where||"")}</div><div class="big" style="font-size:30px;margin-top:4px" id="ciLeft"></div></div><div class="row"><button id="ciDone">Jag är tillbaka ✓</button></div>`;
  const d=$("#ciDone");if(d)d.onclick=()=>{S.ci=null;save();renderCI();toast("Skönt att du är tillbaka!")};
  const cp=$("#ciCopy");if(cp)cp.onclick=()=>copyText(msg);
  tickCI();
}
function tickCI(){const c=S.ci,el=$("#ciLeft");if(!c||!el)return;const ms=new Date(c.due)-Date.now();if(ms<=0){renderCI();return}
  const h=Math.floor(ms/36e5),m=Math.floor(ms%36e5/6e4);el.textContent=`${h} h ${m} min kvar`}
setInterval(()=>{tickCI();if(S.ci&&Date.now()>new Date(S.ci.due)&&!$("#ciCard").classList.contains("warn")){renderCI();go("mer");window.showMer&&showMer("trygg");window.notify&&notify("Du har inte checkat in","Är du okej? Öppna Lufsa och checka in.")}},20000);
$("#ciStart").onclick=()=>{const time=$("#ciTime").value,phone=$("#ciPhone").value.trim();if(!time||!phone)return toast("Fyll i tid och nummer");
  const d=new Date();const [h,m]=time.split(":");d.setHours(+h,+m,0,0);if(d<new Date())d.setDate(d.getDate()+1);
  S.ci={due:d.toISOString(),time,phone,where:$("#ciWhere").value.trim()};save();renderCI();toast("Timer startad");if(window.getPos)getPos().then(p=>{if(S.ci){S.ci.pos=p;save()}}).catch(()=>{})};
$("#lang").onclick=e=>{const b=e.target.closest("[data-l]");if(b){S.lang=b.dataset.l;save();renderTrygg()}};
$("#phrases").onclick=e=>{const li=e.target.closest("[data-ph]");if(!li)return;const i=+li.dataset.ph;showFull(PHRASES[S.lang][i],PHRASES.sv[i])};
function showFull(a,b){$("#fullPhr").textContent=a;$("#fullSv").textContent=b;$("#full").classList.add("on")}
$("#fullClose").onclick=()=>$("#full").classList.remove("on");
$("#nSave").onclick=()=>{S.nod={name:$("#nName").value,blood:$("#nBlood").value,all:$("#nAll").value,ice:$("#nIce").value,ins:$("#nIns").value,insTel:$("#nInsTel").value};save();toast("Nödkort sparat ✓")};
$("#nShow").onclick=()=>{const n=S.nod||{};$("#fullPhr").innerHTML=`<div style="font-size:28px;color:var(--red)">EMERGENCY / NÖDKORT</div><div style="font-size:30px;margin-top:10px">${esc(n.name||"")}</div>`;
  $("#fullSv").innerHTML=`<div style="font-size:20px;color:var(--ink);line-height:1.7;text-align:left">${n.blood?`<b>Blood type:</b> ${esc(n.blood)}<br>`:""}${n.all?`<b>Allergies / medication:</b> ${esc(n.all)}<br>`:""}${n.ice?`<b>Emergency contact:</b> ${esc(n.ice)}<br>`:""}${n.ins?`<b>Insurance:</b> ${esc(n.ins)} ${esc(n.insTel||"")}`:""}</div>`;$("#full").classList.add("on")};


function copyText(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast("Kopierat ✓")).catch(()=>{const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");toast("Kopierat ✓")}catch(e){toast("Kunde inte kopiera")}a.remove()})}
