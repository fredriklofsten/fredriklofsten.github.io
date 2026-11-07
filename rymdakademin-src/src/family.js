/* ===================== Profiler, spara-kod, rapport för vuxna, inställningar ===================== */
const APPVER='2026.11.07';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function wIdx(){try{localStorage.setItem(PKEY,JSON.stringify(PIDX));}catch(e){}}
function readProfile(id){if(id===PIDX.cur)return S;try{return JSON.parse(localStorage.getItem('rymdakademin-p-'+id)||'{}');}catch(e){return {};}}
function switchProfile(id){save();PIDX.cur=id;wIdx();location.hash='hem';location.reload();}
function copyText(t,okMsg){const done=()=>toast(okMsg||'Kopierat!');
  const fb=()=>{const ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}ta.remove();ok?done():showText('Kopiera texten',t);};
  if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(done,fb);else fb();}
function showText(title,t){let m=$('textpop');if(!m){m=document.createElement('div');m.id='textpop';m.className='textpop';document.body.appendChild(m);
    m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-close]'))m.hidden=true;});}
  m.innerHTML=`<div class="tp-box" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h3>${esc(title)}</h3><p class="lead">Markera allt och kopiera.</p><textarea readonly>${esc(t)}</textarea><button class="primary" data-close>Stäng</button></div>`;m.hidden=false;
  const ta=m.querySelector('textarea');ta.focus();ta.select();}

/* ---------- Flera profiler ---------- */
let delArm=null;
function renderProfiles(){const box=$('profiles-box');if(!box)return;
  box.innerHTML=`<h3 style="margin-top:0">Profiler på den här enheten</h3><p class="lead">Syskon eller klasskompisar kan ha var sin profil med egna framsteg.</p><div class="plist">${PIDX.list.map(p=>{const d=readProfile(p.id),pr=d.profile||{},me=p.id===PIDX.cur;
    return `<div class="prow">${astro('happy','',Object.assign({},AVDEF,pr.av||{}))}<b>${esc(pr.name||p.name||'Ny profil')}<br><small class="lead">${pr.level?LV[pr.level].name:'Ingen nivå än'} · ${d.xp||0} XP</small></b>${me?'<span class="cur">Aktiv</span>':`<button class="ghost" data-pswitch="${p.id}">Byt hit</button><button class="ghost" data-pdel="${p.id}" aria-label="Ta bort profil">${delArm===p.id?'Säker?':'Ta bort'}</button>`}</div>`;}).join('')}</div>
   <button class="primary" id="p-new">+ Ny profil</button>`;renderTransfer();}
document.addEventListener('click',e=>{
  const sw=e.target.closest('[data-pswitch]');if(sw){switchProfile(sw.dataset.pswitch);return;}
  const dl=e.target.closest('[data-pdel]');if(dl){const id=dl.dataset.pdel;if(delArm!==id){delArm=id;renderProfiles();return;}
    PIDX.list=PIDX.list.filter(p=>p.id!==id);try{localStorage.removeItem('rymdakademin-p-'+id);}catch(_){}wIdx();delArm=null;renderProfiles();toast('Profilen är borttagen.');return;}
  if(e.target.closest('#p-new')){save();const id='p'+Date.now().toString(36);PIDX.list.push({id,name:''});PIDX.cur=id;wIdx();location.hash='hem';location.reload();}});

/* ---------- Spara och flytta framsteg med en kod ---------- */
function exportCode(){const d=Object.assign({},S);delete d.qSeen;delete d.greeted;return 'RYMD1.'+btoa(unescape(encodeURIComponent(JSON.stringify(d))));}
function importCode(c){c=(c||'').replace(/\s+/g,'');if(!c.startsWith('RYMD1.'))throw new Error('Koden ska börja med RYMD1.');
  const d=JSON.parse(decodeURIComponent(escape(atob(c.slice(6)))));if(typeof d!=='object'||typeof d.xp!=='number')throw new Error('Koden ser inte ut att vara från Rymdakademin.');return d;}
let impArm=false;
function renderTransfer(){const box=$('transfer-box');if(!box)return;
  box.innerHTML=`<h3 style="margin-top:0">Spara eller flytta dina framsteg</h3><p class="lead">Skapa en kod och spara den, till exempel i ett mejl till dig själv. Klistra in koden på en annan telefon eller dator för att fortsätta där.</p>
   <div class="xfer"><div class="row" style="justify-content:flex-start;margin:8px 0"><button class="primary" id="x-make">Skapa kod</button><button class="ghost" id="x-copy" hidden>Kopiera koden</button></div><textarea id="x-out" readonly hidden aria-label="Din kod"></textarea>
   <label for="x-in" style="display:block;margin-top:14px"><b>Har du en kod?</b> Klistra in den här:</label><textarea id="x-in" placeholder="RYMD1...."></textarea>
   <div class="row" style="justify-content:flex-start;margin-top:8px"><button class="ghost" id="x-load">${impArm?'Ja, ersätt framstegen i den här profilen':'Läs in koden'}</button><span class="lead" id="x-msg"></span></div></div>`;}
document.addEventListener('click',e=>{
  if(e.target.closest('#x-make')){const o=$('x-out');o.value=exportCode();o.hidden=false;$('x-copy').hidden=false;o.select();return;}
  if(e.target.closest('#x-copy')){copyText($('x-out').value,'Koden är kopierad. Spara den på ett säkert ställe.');return;}
  if(e.target.closest('#x-load')){const v=$('x-in').value;let d;try{d=importCode(v);}catch(err){$('x-msg').textContent='Det gick inte: '+err.message;impArm=false;return;}
    if(!impArm){impArm=true;const keep=v;renderTransfer();$('x-in').value=keep;$('x-msg').textContent=`Koden gäller ${d.profile&&d.profile.name?d.profile.name:'en profil'} med ${d.xp} XP. Tryck igen för att läsa in.`;return;}
    impArm=false;S=Object.assign(JSON.parse(SDEF),d);save();toast('Framstegen är inlästa!');setTimeout(()=>{location.hash='hem';location.reload();},700);}});

/* ---------- Rapport för förälder eller lärare ---------- */
const CATNAME=c=>(CATS.find(x=>x[0]===c)||[0,c==='missar'?'Dina missar':c])[1];
function pct(s){return s&&s.a?Math.round(100*s.c/s.a):null;}
function reportData(){const pr=S.profile||{},cats=CATS.filter(c=>c[0]!=='alla').map(c=>c[0]);
  const read=cats.map(c=>{const ks=ORDER.filter(k=>catOf(k)===c);return {c,ks,n:ks.filter(k=>S.learned.includes(k)).length};});
  const quiz=cats.map(c=>({c,s:S.stats[c]})).filter(x=>x.s&&x.s.a);
  const weak=quiz.filter(x=>x.s.a>=4&&pct(x.s)<70).sort((a,b)=>pct(a.s)-pct(b.s));
  const missed=S.missed.map(id=>ITEMS.find(i=>i.id===id)).filter(Boolean);
  const unread=read.filter(r=>r.n<r.ks.length&&r.n===0).map(r=>r.c);
  return {pr,read,quiz,weak,missed,unread,steps:PATH.filter(p=>S.path[p[0]]).length};}
function renderReport(){const d=reportData(),box=$('report'),pr=d.pr;
  const bar=(label,v,max,txt)=>{const p=max?Math.round(100*v/max):0;return `<div class="rep-bar"><span>${label}</span><span class="bar"><i class="${p<50?'low':p<75?'mid':''}" style="width:${p}%"></i></span><b>${txt}</b></div>`;};
  const totA=Object.values(S.stats).reduce((a,s)=>a+s.a,0),totC=Object.values(S.stats).reduce((a,s)=>a+s.c,0);
  const tips=[];if(d.weak.length)tips.push(`Öva mer på ${d.weak.slice(0,2).map(w=>CATNAME(w.c).toLowerCase()).join(' och ')}. Läs faktan igen och gör sedan ett quiz med bara det ämnet.`);
  if(d.missed.length)tips.push(`Det finns ${d.missed.length} frågor som blivit fel. Knappen "Öva på dina missar" under Öva tar fram just dem.`);
  if(d.unread.length)tips.push(`Inte påbörjat än: ${d.unread.map(c=>CATNAME(c).toLowerCase()).join(', ')}.`);
  if(!totA)tips.push('Inga quizsvar är sparade än. Statistiken börjar räknas när man svarar på quiz eller lärvägstest.');
  if(!tips.length)tips.push('Det går riktigt bra! Prova en svårare nivå i quizet eller fördjupningarna.');
  box.innerHTML=`<div class="rep-grid">
   <div class="rep-card"><h3>${esc(pr.name||'Profil utan namn')}${pr.age?', '+esc(pr.age)+' år':''}</h3><div class="rep-kpis">
    <div><small>Nivå</small><b>${LVc().name}</b></div><div><small>Rang</small><b>${LEVELS[lvl()]}</b></div><div><small>XP</small><b>${S.xp}</b></div>
    <div><small>Utforskat</small><b>${S.learned.length}/${ORDER.length}</b></div><div><small>Lärvägen</small><b>${d.steps}/${PATH.length} steg</b></div><div><small>Märken</small><b>${S.badges.length}/${BADGES.length}</b></div>
    <div><small>Quizsvar rätt</small><b>${totA?Math.round(100*totC/totA)+' %':'–'}</b></div><div><small>Dagar i rad</small><b>${S.streak||0} (bäst ${S.bestStreak||0})</b></div><div><small>Fördjupningar lästa</small><b>${S.deep.length}</b></div></div></div>
   <div class="rep-card"><h3>Vad behöver övas?</h3><ul class="rep-list">${tips.map(t=>`<li>${t}</li>`).join('')}</ul>
    ${d.missed.length?`<h3 style="margin-top:14px;font-size:1rem">Frågor som blivit fel</h3><ul class="rep-list">${d.missed.slice(0,10).map(i=>`<li>${esc(i.q)}<br><small>Rätt svar: ${esc(i.a)}</small></li>`).join('')}</ul>`:''}</div>
   <div class="rep-card"><h3>Quizresultat per ämne</h3>${d.quiz.length?d.quiz.map(x=>bar(CATNAME(x.c),x.s.c,x.s.a,`${pct(x.s)} % av ${x.s.a}`)).join(''):'<p class="lead">Inga svar sparade än.</p>'}</div>
   <div class="rep-card"><h3>Senaste quizomgångar</h3>${S.rounds.length?`<ul class="rep-list">${S.rounds.slice(-8).reverse().map(r=>`<li>${new Date(r.t).toLocaleDateString('sv-SE',{day:'numeric',month:'short'})}: <b>${r.s} av ${r.n}</b> rätt <small>(${CATNAME(r.topic)}, ${{latt:'lätt',mix:'blandat',svar:'svår'}[r.lv]||'blandat'})</small></li>`).join('')}</ul>`:'<p class="lead">Inga omgångar än.</p>'}</div>
   <div class="rep-card"><h3>Vad har lästs?</h3>${d.read.map(r=>bar(CATNAME(r.c),r.n,r.ks.length,`${r.n}/${r.ks.length}`)+`<div class="rep-tags">${r.ks.map(k=>`<span class="${S.learned.includes(k)?'':'no'}">${S.learned.includes(k)?'✓ ':''}${B[k].short||B[k].name}</span>`).join('')}</div>`).join('')}</div>
   <div class="row" style="justify-content:flex-start"><button class="primary" id="rep-copy">Kopiera som text</button><button class="ghost" id="rep-print">Skriv ut</button></div></div>`;}
function reportText(){const d=reportData(),pr=d.pr,L=[];
  L.push(`Rymdakademin – framsteg för ${pr.name||'profil utan namn'}${pr.age?' ('+pr.age+' år)':''}`,`Datum: ${new Date().toLocaleDateString('sv-SE')}`,`Nivå: ${LVc().name} · ${S.xp} XP · ${LEVELS[lvl()]}`,
   `Utforskat: ${S.learned.length}/${ORDER.length} · Lärvägen: ${d.steps}/${PATH.length} steg · Märken: ${S.badges.length}/${BADGES.length}`,'','Läst per område:');
  d.read.forEach(r=>L.push(`- ${CATNAME(r.c)}: ${r.n}/${r.ks.length}`));L.push('','Quiz per ämne:');
  if(d.quiz.length)d.quiz.forEach(x=>L.push(`- ${CATNAME(x.c)}: ${pct(x.s)} % rätt av ${x.s.a} svar`));else L.push('- Inga svar sparade än');
  if(d.missed.length){L.push('','Frågor som blivit fel:');d.missed.slice(0,10).forEach(i=>L.push(`- ${i.q} (rätt: ${i.a})`));}
  return L.join('\n');}
document.addEventListener('click',e=>{if(e.target.closest('#rep-copy'))copyText(reportText(),'Rapporten är kopierad.');if(e.target.closest('#rep-print'))window.print();});

/* ---------- Textstorlek och lättläst typsnitt ---------- */
function applyLook(){document.documentElement.style.fontSize=(100*(S.fsize||1))+'%';document.documentElement.classList.toggle('readable',!!S.readable);
  document.querySelectorAll('[data-fs]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.fs===(S.fsize||1)));$('readable').setAttribute('aria-pressed',!!S.readable);}
document.addEventListener('click',e=>{const f=e.target.closest('[data-fs]');if(f){S.fsize=+f.dataset.fs;save();applyLook();SFX.click();skySize&&skySize();return;}
  if(e.target.closest('#readable')){S.readable=!S.readable;save();applyLook();SFX.click();toast(S.readable?'Lättläst typsnitt är på.':'Vanligt typsnitt igen.');}});

/* ---------- Rapportera problem ---------- */
function diagText(){const n=navigator,gl=(()=>{try{const c=document.createElement('canvas');return c.getContext('webgl2')?'WebGL2':c.getContext('webgl')?'WebGL1':'saknas';}catch(e){return 'fel';}})();
  let ls='?';try{let t=0;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);t+=(localStorage.getItem(k)||'').length;}ls=Math.round(t/1024)+' kB';}catch(e){ls='blockerat';}
  const vs=window.speechSynthesis?speechSynthesis.getVoices():[];
  return ['Rymdakademin felrapport','Version: '+APPVER+(window.AndroidApp?' (Android-app)':matchMedia('(display-mode: standalone)').matches?' (hemskärm)':' (webbläsare)'),'Datum: '+new Date().toISOString(),
   'Enhet: '+n.userAgent,'Skärm: '+screen.width+'x'+screen.height+' @'+(window.devicePixelRatio||1)+'x, fönster '+innerWidth+'x'+innerHeight,'Språk: '+n.language,
   '3D: '+gl+(typeof S3!=='undefined'?(S3.ready?', igång':', ej startad'):''),'Uppläsning: '+(window.speechSynthesis?vs.length+' röster, svensk: '+(vs.some(v=>/^sv/i.test(v.lang))?'ja':'nej'):'ingen inbyggd (eSpeak används)'),
   'Lagring: '+ls+', '+PIDX.list.length+' profil(er)','Vy: '+cur+' · nivå '+LVc().name+' · spara batteri '+(S.lite?'på':'av'),
   'Senaste fel:',...(window.__errs&&__errs.length?__errs.slice(-6):['inga']),'','Beskriv problemet här:'].join('\n');}
$('report-bug').addEventListener('click',()=>{closeSettings();const t=diagText();copyText(t,'Felrapporten är kopierad. Klistra in den i ett mejl eller meddelande.');});

/* ---------- Påminnelse i Android-appen ---------- */
function renderRemind(){const b=$('remind-btn');if(!window.AndroidApp||!AndroidApp.setReminder){b.hidden=true;return;}b.hidden=false;b.setAttribute('aria-pressed',!!S.remind);
  b.querySelector('span').textContent=S.remind?'Påminnelse '+S.remind:'Påminnelse';}
$('remind-btn').addEventListener('click',()=>{const opts=[null,'16:00','17:00','18:00','19:00'],i=(opts.indexOf(S.remind)+1)%opts.length;S.remind=opts[i];save();
  try{if(S.remind){const [h,m]=S.remind.split(':').map(Number);AndroidApp.setReminder(h,m);toast('Påminnelse varje dag kl '+S.remind+'. Tryck igen för att byta tid.');}else{AndroidApp.cancelReminder();toast('Påminnelsen är avstängd.');}}catch(e){toast('Det gick inte att ställa in påminnelsen.');}
  renderRemind();});
