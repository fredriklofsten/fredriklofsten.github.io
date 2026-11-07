/* ===================== Appen ===================== */
const $=id=>document.getElementById(id);
const nf=(v,d=1)=>v.toLocaleString('sv-SE',{maximumFractionDigits:d});

function nova(mood='happy',cls=''){return astro(mood,cls);}
const ROCKET=`<svg class="rocket" viewBox="0 0 40 40" aria-hidden="true"><path d="M6 20c-3 0-5 2-5 2s2 2 5 2" fill="#ffc94a"/><path d="M8 14h4l-2 6 2 6H8z" fill="#ff7aa8"/><path d="M10 13c8-3 18-2 26 7-8 9-18 10-26 7z" fill="#eef0ff"/><circle cx="25" cy="20" r="3.4" fill="#262c78" stroke="#8ef0ff" stroke-width="1.4"/><path d="M14 13l4-6 4 5zM14 27l4 6 4-5z" fill="#ff7aa8"/></svg>`;

/* ---------- Tillstånd ---------- */
const LEVELS=['Rymdkadett','Månpilot','Astronaut','Rymdkapten','Kometjägare','Galaxutforskare','Stjärnamiral'];
const PER=80;
let S={xp:0,learned:[],box:{},badges:[],consts:[],cardsKnown:0,perfect:false,hardGood:false,weighed:false,lightNeptune:false,mapYear:false,timeline:false,sound:true,music:false,weight:35,deep:[],skyTasks:[],skyQuiz:false,terms:[],path:{},missed:[],qSeen:[],profile:null,greeted:'',daily:null,streak:0,lastDay:'',bestStreak:0,lite:false,stats:{},rounds:[],fsize:1,readable:false,remind:null};
const PKEY='rymdakademin-profiles',SDEF=JSON.stringify(S);let PIDX=null;try{PIDX=JSON.parse(localStorage.getItem(PKEY)||'null');}catch(e){}
if(!PIDX||!PIDX.list||!PIDX.list.length){PIDX={cur:'p1',list:[{id:'p1',name:''}]};try{const old=localStorage.getItem('rymdakademin-v1');if(old){localStorage.setItem('rymdakademin-p-p1',old);try{PIDX.list[0].name=(JSON.parse(old).profile||{}).name||'';}catch(_){}}localStorage.setItem(PKEY,JSON.stringify(PIDX));}catch(e){}}
const SKEY=()=>'rymdakademin-p-'+PIDX.cur;
try{const r=localStorage.getItem(SKEY());if(r)S=Object.assign(S,JSON.parse(r));}catch(e){}
S.learned=S.learned.filter(k=>B[k]);if(!Array.isArray(S.deep))S.deep=[];if(!Array.isArray(S.skyTasks))S.skyTasks=[];if(!Array.isArray(S.terms))S.terms=[];if(!S.path||typeof S.path!=='object')S.path={};if(!Array.isArray(S.missed))S.missed=[];if(!Array.isArray(S.qSeen))S.qSeen=[];
function save(){try{localStorage.setItem(SKEY(),JSON.stringify(S));const me=PIDX.list.find(p=>p.id===PIDX.cur),n=(S.profile&&S.profile.name)||'';if(me&&me.name!==n){me.name=n;localStorage.setItem(PKEY,JSON.stringify(PIDX));}}catch(e){}}
const lvl=()=>Math.min(LEVELS.length-1,Math.floor(S.xp/PER));
function renderHUD(){const L=lvl();$('lvl').textContent=LEVELS[L];$('xp').textContent=S.xp+' XP';$('bar').style.width=(L===LEVELS.length-1?100:(S.xp%PER)/PER*100)+'%';}
function addXP(n,el){const before=lvl();S.xp+=n;save();renderHUD();burst(el);if(lvl()>before){toast('Ny nivå: du är nu '+LEVELS[lvl()]+'!');SFX.badge();buddySay(`Wow, ${pname()}! Du är nu ${LEVELS[lvl()]}!`,'wow',5000);}checkBadges();}
function burst(el){if(!el||reduce)return;const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(let i=0;i<10;i++){const s=document.createElement('span');s.className='spark';s.textContent='★';const a=TAU*i/10,d=50+Math.random()*40;
    s.style.left=cx+'px';s.style.top=cy+'px';s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),950);}}
const TQ=[];let tBusy=false;
function toast(m){TQ.push(m);if(!tBusy)nextToast();}
function nextToast(){const m=TQ.shift();if(!m){tBusy=false;return;}tBusy=true;const t=$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>{t.classList.remove('show');setTimeout(nextToast,400);},2500);}


/* ---------- Uppläsning ----------
   1) Telefonens egen röst (Web Speech) om den finns och har svenska.
   2) Annars, eller om den inte startar: inbyggd svensk talsyntes (eSpeak, laddas från tts.js). */
const TTS={ok:'speechSynthesis' in window,voice:null,voices:0,btn:null,nativeBad:false,src:null,gen:0,loading:null};
function pickVoice(){try{const vs=speechSynthesis.getVoices();TTS.voices=vs.length;TTS.voice=vs.find(v=>/^sv[-_]SE/i.test(v.lang))||vs.find(v=>/^sv/i.test(v.lang))||null;}catch(e){}}
if(TTS.ok){pickVoice();try{speechSynthesis.addEventListener('voiceschanged',pickVoice);}catch(e){}}
const SPK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
function sayBtn(text,label='Läs upp'){return `<button class="say" type="button" data-say="${encodeURIComponent(text.replace(/<[^>]+>/g,''))}" data-label="${label}" aria-label="${label}">${SPK}<span>${label}</span></button>`;}
function setLbl(t){if(TTS.btn){const s=TTS.btn.querySelector('span');if(s)s.textContent=t;}}
function resetSay(){if(TTS.btn){TTS.btn.classList.remove('talking');setLbl(TTS.btn.dataset.label);}TTS.btn=null;}
function stopSpeech(){TTS.gen++;try{if(TTS.ok)speechSynthesis.cancel();}catch(e){}if(TTS.src){try{TTS.src.onended=null;TTS.src.stop();}catch(e){}TTS.src=null;}resetSay();}
function loadEspeak(){if(window.MeSpeak)return Promise.resolve();if(TTS.loading)return TTS.loading;
  TTS.loading=new Promise((res,rej)=>{const s=document.createElement('script');s.src='tts.js';s.onload=()=>window.MeSpeak?res():rej(new Error('no engine'));s.onerror=()=>{TTS.loading=null;rej(new Error('load'));};document.head.appendChild(s);});return TTS.loading;}
function speak(text,btn){const same=TTS.btn===btn;stopSpeech();if(same)return;
  TTS.btn=btn;btn.classList.add('talking');setLbl('Stoppa');const g=TTS.gen;
  try{const a=ac();if(a&&a.state==='suspended')a.resume();}catch(e){}
  const parts=(text.replace(/−/g,'minus ').replace(/°/g,' grader').replace(/%/g,' procent').match(/[^.!?]+[.!?]*/g)||[text]).map(p=>p.trim()).filter(Boolean);
  if(!TTS.voice)pickVoice();
  const useNative=TTS.ok&&!TTS.nativeBad&&(TTS.voice||TTS.voices===0);
  if(useNative)nativeSpeak(parts,g,()=>{TTS.nativeBad=true;espeakSpeak(parts,g);});else espeakSpeak(parts,g);}
function nativeSpeak(parts,g,fail){let started=false,failed=false;const bail=()=>{if(failed||TTS.gen!==g)return;failed=true;try{speechSynthesis.cancel();}catch(e){}fail();};
  try{speechSynthesis.resume();}catch(e){}
  parts.forEach((p,i)=>{const u=new SpeechSynthesisUtterance(p);u.lang='sv-SE';if(TTS.voice)u.voice=TTS.voice;u.rate=.95;
    u.onstart=()=>{started=true;};if(i===parts.length-1)u.onend=()=>{if(TTS.gen===g&&!failed)resetSay();};
    u.onerror=ev=>{if(TTS.gen!==g)return;if(!started&&ev.error!=='interrupted'&&ev.error!=='canceled')bail();else if(i===parts.length-1)resetSay();};
    try{speechSynthesis.speak(u);}catch(e){bail();}});
  setTimeout(()=>{if(TTS.gen===g&&!started&&!speechSynthesis.speaking)bail();},1800);}
function espeakSpeak(parts,g){if(!window.MeSpeak)setLbl('Laddar röst…');
  loadEspeak().then(()=>{if(TTS.gen!==g)return;setLbl('Stoppa');playPart(parts,0,g);})
    .catch(()=>{if(TTS.gen!==g)return;resetSay();toast('Uppläsningen kunde inte starta. Prova att ladda om sidan.');});}
function playPart(parts,i,g){if(TTS.gen!==g)return;if(i>=parts.length){resetSay();return;}
  let wav;try{wav=MeSpeak.speak(parts[i],{voice:'sv',speed:150,pitch:45,rawdata:'array'});}catch(e){wav=null;}
  if(!wav){playPart(parts,i+1,g);return;}
  const bytes=new Uint8Array(wav),a=ac();
  const next=()=>{if(TTS.gen===g){TTS.src=null;playPart(parts,i+1,g);}};
  if(a){a.decodeAudioData(bytes.buffer.slice(0)).then(buf=>{if(TTS.gen!==g)return;const s=a.createBufferSource();s.buffer=buf;s.connect(a.destination);s.onended=next;TTS.src=s;s.start();}).catch(()=>htmlAudio(bytes,next,g));}
  else htmlAudio(bytes,next,g);}
function htmlAudio(bytes,next,g){const url=URL.createObjectURL(new Blob([bytes],{type:'audio/wav'})),au=new Audio(url);
  TTS.src={stop:()=>{au.pause();URL.revokeObjectURL(url);}};au.onended=()=>{URL.revokeObjectURL(url);next();};au.play().catch(()=>{if(TTS.gen===g){resetSay();toast('Telefonen stoppade ljudet. Tryck på Läs upp en gång till.');}});}
document.addEventListener('click',e=>{const b=e.target.closest('.say');if(!b)return;e.stopPropagation();e.preventDefault();speak(decodeURIComponent(b.dataset.say),b);},true);
addEventListener('hashchange',()=>{if(TTS.btn)stopSpeech();});

/* ---------- Ljud ---------- */
let AC=null,MUS=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}}if(AC.state==='suspended')AC.resume();return AC;}
function tone(f,dur,type='sine',vol=.15,when=0,force=false){if(!S.sound&&!force)return;const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+when;
  o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.05);}
const SFX={right:()=>{tone(660,.18,'triangle');tone(990,.28,'triangle',.15,.1);},wrong:()=>{tone(240,.22,'square',.04);tone(180,.3,'square',.04,.12);},
  click:()=>tone(880,.05,'sine',.04),flip:()=>tone(520,.09,'sine',.06),star:()=>tone(1100+Math.random()*500,.18,'sine',.07),
  badge:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.35,'triangle',.12,i*.1))};
function startMusic(){const a=ac();if(!a||MUS)return;const m=a.createGain();m.gain.value=0;m.gain.linearRampToValueAtTime(.07,a.currentTime+3);
  const fl=a.createBiquadFilter();fl.type='lowpass';fl.frequency.value=800;fl.connect(m).connect(a.destination);
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=.04;lg.gain.value=380;lfo.connect(lg).connect(fl.frequency);lfo.start();
  const osc=[110,164.81,220,246.94,329.63].flatMap(f=>[-4,4].map(dt=>{const o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=f;o.detune.value=dt;g.gain.value=.16;o.connect(g).connect(fl);o.start();return o;}));
  const pent=[880,987.77,1108.73,1318.51,1479.98,1760];
  const timer=setInterval(()=>{if(Math.random()<.6)tone(pent[Math.floor(Math.random()*pent.length)],1.6,'sine',.025,0,true);},1400);
  MUS={m,osc,lfo,timer};}
function stopMusic(){if(!MUS||!AC)return;const {m,osc,lfo,timer}=MUS;clearInterval(timer);m.gain.cancelScheduledValues(AC.currentTime);m.gain.setValueAtTime(m.gain.value,AC.currentTime);m.gain.linearRampToValueAtTime(0,AC.currentTime+1.2);
  setTimeout(()=>{osc.forEach(o=>o.stop());lfo.stop();},1400);MUS=null;}
function renderSound(){$('snd').setAttribute('aria-pressed',S.sound);$('mus').setAttribute('aria-pressed',S.music);}
$('lite').addEventListener('click',()=>{S.lite=!S.lite;save();$('lite').setAttribute('aria-pressed',S.lite);for(const o of LIVE)o.drawn=false;if(!S.lite)requestAnimationFrame(skyDraw);toast(S.lite?'Spara batteri: planeterna står still.':'Animationerna är på igen.');});
$('snd').addEventListener('click',()=>{S.sound=!S.sound;save();renderSound();SFX.click();});
$('mus').addEventListener('click',()=>{S.music=!S.music;save();renderSound();S.music?startMusic():stopMusic();});
document.addEventListener('click',function once(){document.removeEventListener('click',once,true);if(S.music)startMusic();},true);

/* ---------- Märken ---------- */
const allCat=c=>ORDER.filter(k=>catOf(k)===c).every(k=>S.learned.includes(k));
const BADGES=[
 ['forsta','earth','Första steget','Utforska din första himlakropp',()=>S.learned.length>=1],
 ['planet','jupiter','Planetexpert','Utforska alla åtta planeter',()=>allCat('planet')],
 ['mane','moon','Månlandare','Utforska alla månar',()=>allCat('mane')],
 ['stjarna','sirius','Stjärnskådare','Utforska alla stjärnor',()=>allCat('stjarna')],
 ['dverg','pluto','Asteroidgruvarbetare','Utforska alla dvärgplaneter och asteroider',()=>allCat('dverg')],
 ['komet','halley','Kometjägare','Utforska alla kometer',()=>allCat('komet')],
 ['djup','blackhole','Djuprymdsresenär','Utforska allt i djuprymden',()=>allCat('djup')],
 ['allt','milkyway','Allvetare','Utforska allt i appen',()=>S.learned.length>=ORDER.length],
 ['perfekt','saturn','Perfekt landning','Få alla rätt på ett quiz',()=>S.perfect],
 ['geni','betelgeuse','Rymdgeni','Få minst 8 rätt på svår nivå',()=>S.hardGood],
 ['kort','venus','Kortmästare','Klara 30 minneskort',()=>S.cardsKnown>=30],
 ['vag','mars','Rymdvägare','Väg dig på andra himlakroppar',()=>S.weighed],
 ['stjarnbild','polaris','Stjärnbildsmakare','Rita alla stjärnbilder',()=>CONST.every(c=>S.consts.includes(c.id))],
 ['ljus','sun','Ljusets fart','Skicka en ljusstråle ända till Neptunus',()=>S.lightNeptune],
 ['karta','neptune','Banräknare','Låt ett helt jordår gå på kartan',()=>S.mapYear],
 ['tid','europa','Tidsresenär','Läs rymdresornas historia',()=>S.timeline],
 ['forskare','titan','Forskare','Läs 10 fördjupningar',()=>S.deep.length>=10],
 ['superforskare','crab','Superforskare','Läs alla fördjupningar',()=>ORDER.every(k=>S.deep.includes(k))&&CONST.every(c=>S.deep.includes('c:'+c.id))&&TIMELINE.every((t,i)=>S.deep.includes('t:'+i))],
 ['ordbok','europa','Ordkunnig','Slå upp 15 svåra ord',()=>S.terms.length>=15],
 ['navigator','polaris','Stjärnnavigatör','Klara stjärnkartans uppdrag och lärkoll',()=>S.skyQuiz&&TASKS.every(t=>S.skyTasks.includes(t[0]))],
 ['larvag','earth','Lärvägsmästare','Gå hela lärvägen',()=>PATH.every(p=>S.path[p[0]])],
 ['streak3','sun','Tre dagar i rad','Klara dagens uppdrag tre dagar i rad',()=>(S.bestStreak||0)>=3],
 ['streak7','saturn','En hel vecka','Klara dagens uppdrag sju dagar i rad',()=>(S.bestStreak||0)>=7],
 ['amiral','andromeda','Stjärnamiral','Nå den högsta nivån',()=>lvl()>=LEVELS.length-1]
];
function checkBadges(){let n=0;for(const b of BADGES){if(!S.badges.includes(b[0])&&b[4]()){S.badges.push(b[0]);n++;toast('Nytt märke: '+b[2]+'!');}}
  if(n){save();SFX.badge();if(cur==='marken')renderBadges();}}
function renderBadges(){$('badge-lead').textContent=`Du har ${S.badges.length} av ${BADGES.length} märken.`;
  $('badges').innerHTML=BADGES.map(b=>{const got=S.badges.includes(b[0]);return `<div class="badge ${got?'':'locked'}"><div class="medal">${art(b[1])}</div><b>${b[2]}</b><small>${b[3]}</small>${got?'<span class="got">Klart</span>':''}</div>`;}).join('');}

/* ---------- Flikar ---------- */
const IC={
 utforska:'<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10.5" ry="3.5" transform="rotate(-20 12 12)"/>',
 karta:'<circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/>',
 skala:'<circle cx="6" cy="15" r="3"/><circle cx="16" cy="12" r="6"/>',
 kort:'<rect x="3" y="6" width="14" height="14" rx="3"/><path d="M7 3h11a3 3 0 0 1 3 3v11"/>',
 quiz:'<path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"/>',
 vag:'<path d="M4 20h16M6 20l2-12h8l2 12"/><circle cx="12" cy="13" r="3"/>',
 stjarnbilder:'<circle cx="4" cy="17" r="1.6"/><circle cx="10" cy="8" r="1.6"/><circle cx="16" cy="13" r="1.6"/><circle cx="20" cy="4" r="1.6"/><path d="M5.2 15.8 9 9.3M11.3 9l3.4 3M17 11.6l2.2-6"/>',
 stjarnkarta:'<circle cx="12" cy="12" r="9.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="14.5" cy="13.5" r="1" fill="currentColor"/><circle cx="12" cy="8" r=".8" fill="currentColor"/>',
 larvag:'<path d="M5 20c0-6 14-4 14-10S9 6 9 4"/><circle cx="5" cy="20" r="1.6" fill="currentColor"/><circle cx="9" cy="4" r="1.6" fill="currentColor"/>',
 forklaringar:'<circle cx="8" cy="12" r="4"/><path d="M8 8a4 4 0 0 1 0 8z" fill="currentColor"/><circle cx="18" cy="12" r="2.5"/><path d="M2 12h1M13 12h2"/>',
 tidslinje:'<path d="M3 12h18"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/>',
 ordlista:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
 rapport:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 marken:'<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>'};
const VIEWS=[['hem','Hem'],['utforska','Utforska'],['larvag','Lärväg'],['ova','Öva'],['mer','Mer'],['karta','Solsystemet just nu'],['skala','Storlek och avstånd'],['forklaringar','Förklaringar'],['kort','Minneskort'],['quiz','Quiz'],['vag','Rymdvågen'],['stjarnbilder','Stjärnbilder'],['stjarnkarta','Stjärnkartan'],['tidslinje','Tidslinje'],['ordlista','Ordlista'],['marken','Märken'],['profil','Din profil'],['rapport','För vuxna: framsteg'],['rymd3d','3D-rymdresa']];
Object.assign(IC,{hem:'<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',ova:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',rymd3d:'<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',profil:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',mer:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'});
const NAV=[['hem','Hem'],['larvag','Lär dig'],['utforska','Utforska'],['ova','Öva'],['mer','Mer']];
const PARENT={quiz:'ova',kort:'ova',karta:'mer',skala:'mer',forklaringar:'mer',vag:'mer',stjarnbilder:'mer',stjarnkarta:'mer',tidslinje:'mer',ordlista:'mer',marken:'mer',profil:'mer',rapport:'mer',rymd3d:'mer'};
const DESC={larvag:'Lektioner i ordning, med test efter varje steg',utforska:'Fakta om himlakroppar, raketer och rymdfart',quiz:'Testa dig själv, ensam eller mot en kompis',kort:'Plugga med smart repetition',karta:'Se var planeterna är just nu',skala:'Hur stora och hur långt bort?',forklaringar:'Månens faser och årstiderna, animerat',vag:'Vad väger du på Mars eller månen?',stjarnbilder:'Rita stjärnbilder genom att trycka på stjärnor',stjarnkarta:'Lär dig läsa natthimlen',tidslinje:'Rymdresornas historia',ordlista:'Svåra ord förklarade enkelt',marken:'Dina belöningar',profil:'Namn, nivå, astronaut, byt profil och spara-kod',rapport:'Vad har lästs, quizresultat och vad behöver övas',rymd3d:'Flyg runt bland planeter, stjärnor och galaxen'};
const vlabel=v=>VIEWS.find(x=>x[0]===v)[1];
const icon=v=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[v]}</svg>`;
const tile=(v,extra='')=>`<button class="tile" data-nav="${v}"><span class="ticon">${icon(v)}</span><span class="ttext"><b>${vlabel(v)}</b><small>${extra||DESC[v]}</small></span><span class="tarrow" aria-hidden="true">›</span></button>`;
$('bnav').innerHTML=NAV.map(([v,l])=>`<button id="n-${v}" data-nav="${v}" aria-current="false">${icon(v)}<span>${l}</span></button>`).join('');
let cur='';
function go(v){SFX.click();try{location.hash=v;}catch(_){}show(v);}
function show(v){if(!VIEWS.some(x=>x[0]===v))v='hem';const prev=cur;cur=v;
  VIEWS.forEach(([n])=>$('v-'+n).classList.toggle('on',n===v));
  const top=PARENT[v]||v;NAV.forEach(([n])=>$('n-'+n).setAttribute('aria-current',n===top?'page':'false'));
  const cr=$('crumb');if(PARENT[v]){cr.hidden=false;cr.innerHTML=`<button data-nav="${PARENT[v]}">‹ ${vlabel(PARENT[v])}</button><span>${vlabel(v)}</span>`;}else cr.hidden=true;
  if(v==='hem')renderHome();if(v==='profil'){renderProfile();renderProfiles();}if(v==='rapport')renderReport();if(v==='rymd3d')start3D();if(v==='ova')renderOva();if(v==='mer')renderMer();
  if(v==='karta')startMap();if(v==='marken')renderBadges();if(v==='skala')renderScale();if(v==='stjarnkarta')requestAnimationFrame(drawSky);if(v==='larvag'){checkPathKarta();renderPath();}if(v==='forklaringar')startExplain();
  if(v==='tidslinje'&&!S.timeline){S.timeline=true;save();checkBadges();}
  if(prev&&prev!==v)window.scrollTo({top:0});}
document.addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(!b)return;e.preventDefault();const v=b.dataset.nav;
  if(b.dataset.qtopic){QS.topic=b.dataset.qtopic;Q.stage='setup';}if(b.dataset.qplayers){QS.players=+b.dataset.qplayers;Q.stage='setup';}if(v==='quiz'&&Q.stage==='setup')renderSetup();
  closeSettings();go(v);});
function renderHome(){const L=lvl(),nxt=PATH.findIndex(p=>!S.path[p[0]]),fresh=S.xp===0;
  $('hello').innerHTML=`<div><small>${fresh?'Välkommen till':'Välkommen tillbaka till'} Rymdakademin</small><h2>Hej ${pname()}!</h2>
    <div class="hstats"><span>Nivå: <b>${LVc().name}</b></span><span><b>${LEVELS[L]}</b></span><span><b>${S.xp}</b> XP</span><span><b>${S.learned.length}</b>/${ORDER.length} utforskade</span><span><b>${S.badges.length}</b> märken</span></div><button class="linkbtn" data-nav="profil" style="margin-top:10px">Ändra profil och astronaut</button></div><div class="hello-ava">${astro('wave')}</div>`;
  $('continue').innerHTML=nxt<0?`<div class="cont"><div><small>Lärvägen</small><h3>Du har klarat hela lärvägen!</h3><p>Prova quizet på svår nivå eller utmana en kompis.</p></div><button class="primary" data-nav="ova">Öva</button></div>`
    :`<div class="cont"><div><small>${fresh?'Börja här':'Fortsätt där du var'}</small><h3>Steg ${nxt+1}: ${PATH[nxt][1]}</h3><p>${fresh?'Lärvägen tar dig genom rymden steg för steg.':'Läs, gör testet och lås upp nästa steg.'}</p></div><button class="primary" data-nav="larvag">${fresh?'Starta':'Fortsätt'}</button></div>`;
  $('home-tiles').innerHTML=tile('rymd3d')+tile('utforska')+tile('quiz')+tile('stjarnkarta');
  renderMission();}
function renderOva(){const due=ITEMS.filter(it=>(S.box[it.id]||{due:0}).due<=Date.now()).length;
  $('ova-tiles').innerHTML=tile('quiz','Välj ämne och nivå. 10 frågor per omgång.')+tile('kort',due+' kort är redo att övas på nu')
    +(S.missed.length?`<button class="tile miss" data-nav="quiz" data-qtopic="missar"><span class="ticon">${icon('ova')}</span><span class="ttext"><b>Öva på dina missar</b><small>${S.missed.length} frågor du har svarat fel på</small></span><span class="tarrow">›</span></button>`:'')
    +`<button class="tile" data-nav="quiz" data-qplayers="2"><span class="ticon">${icon('quiz')}</span><span class="ttext"><b>Tävla mot en kompis</b><small>Turas om på samma telefon</small></span><span class="tarrow">›</span></button>`;}
function renderMer(){const g=(h,vs)=>`<h3 class="ghead">${h}</h3><div class="tiles">${vs.map(v=>tile(v)).join('')}</div>`;
  $('mer-tiles').innerHTML=g('Lär dig mer',['forklaringar','stjarnkarta','stjarnbilder','tidslinje','ordlista'])+g('Upptäck',['rymd3d','karta','skala','vag'])+g('Du och dina framsteg',['profil','marken','rapport']);}
/* Inställningar */
function closeSettings(){$('settings').hidden=true;$('gear').setAttribute('aria-expanded','false');}
$('gear').addEventListener('click',e=>{e.stopPropagation();const p=$('settings'),o=p.hidden;p.hidden=!o;$('gear').setAttribute('aria-expanded',o);SFX.click();});
document.addEventListener('click',e=>{if(!e.target.closest('#settings')&&!e.target.closest('#gear'))closeSettings();});
addEventListener('hashchange',()=>show(location.hash.slice(1)));

/* ---------- Utforska ---------- */
let sel='earth',filter='alla';
function renderDaily(){const pool=ORDER.flatMap(k=>[...B[k].facts,B[k].did].map(f=>[k,f])),d=new Date(),n=d.getFullYear()*372+d.getMonth()*31+d.getDate(),[k,f]=pool[(n*7919)%pool.length];
  $('daily').innerHTML=`${art(k)}<div><small>Dagens rymdfakta · ${d.toLocaleDateString('sv-SE',{day:'numeric',month:'long'})}</small><p>${f}</p><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="linkbtn" data-go="${k}">Läs mer om ${B[k].name}</button>${sayBtn(f)}</div></div>`;}
$('daily').addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)select(g.dataset.go);});
function renderFilters(){$('filters').innerHTML=CATS.map(([c,l])=>`<button data-c="${c}" aria-pressed="${c===filter}">${l}</button>`).join('');}
$('filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;filter=b.dataset.c;renderFilters();const list=ORDER.filter(k=>filter==='alla'||catOf(k)===filter);if(!list.includes(sel))sel=list[0];renderStrip();renderDetail();});
function renderStrip(){const q=($('bsearch').value||'').trim().toLowerCase();const list=ORDER.filter(k=>(filter==='alla'||catOf(k)===filter)&&(!q||(B[k].name+' '+(B[k].short||'')+' '+B[k].type).toLowerCase().includes(q)));
  $('strip').innerHTML=(list.length?'':'<p class="lead" style="padding:8px">Inget matchar. Prova ett annat ord.</p>')+list.map(k=>`<button class="body-btn" data-k="${k}" aria-current="${k===sel}">${art(k)}<span>${B[k].short||B[k].name}</span>${S.learned.includes(k)?'<b class="done" aria-label="utforskad">★</b>':''}</button>`).join('');
  $('learned-count').textContent=S.learned.length+' av '+ORDER.length+' utforskade';}
function renderDetail(){const p=B[sel],i=ORDER.indexOf(sel),done=S.learned.includes(sel),prev=ORDER[(i-1+ORDER.length)%ORDER.length],next=ORDER[(i+1)%ORDER.length];
  $('detail').innerHTML=`<article class="detail pop"><div><div class="hero"><div class="float" style="width:100%;display:grid;place-items:center">${art(sel,'big')}</div>${PHOTO[sel]?`<figure class="photo" id="photo" hidden><img alt="Foto av ${p.name}" loading="lazy" src="img/${sel}.jpg"><figcaption>Bild: ${PHOTO[sel][1]}</figcaption></figure><button class="photo-btn" id="photo-btn" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><span>Riktigt foto</span></button>`:''}</div>
    <div class="nav-arrows"><button data-go="${prev}" aria-label="Föregående: ${B[prev].name}">‹ ${B[prev].short||B[prev].name}</button><button data-go="${next}" aria-label="Nästa: ${B[next].name}">${B[next].short||B[next].name} ›</button></div></div>
    <div class="info"><div class="title-row"><div><p class="kicker">${p.type}</p><h2>${p.name}</h2></div>${sayBtn(`${p.name}. ${bodyTag(sel)} ${p.stats.slice(0,LVc().stats).map(([l,v])=>l+': '+v+'.').join(' ')} ${bodyFacts(sel).join(' ')} Visste du? ${p.did} ${SEE[sel]?'Så ser du den: '+SEE[sel]:''}`)}</div><p class="tag">${bodyTag(sel)}</p>
      <p class="gl-hint"><span class="term-demo">Prickiga ord</span> går att trycka på. Då ser du vad de betyder.</p>
      <div class="stats">${p.stats.slice(0,LVc().stats).map(([l,v])=>`<div class="stat"><small>${l}</small><b>${v}</b></div>`).join('')}</div>
      <ul class="facts">${bodyFacts(sel).map(f=>`<li><span>${f}</span></li>`).join('')}</ul>
      ${SEE[sel]?`<div class="see"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 14 12-7 2 4-12 7z"/><path d="m15 7 2-1 2 4-2 1M9 17l-2 4M11 16l2 5"/></svg><div><b>Så ser du den</b><p>${SEE[sel]}</p></div></div>`:''}
      <div class="did">${nova()}<div><b>Visste du?</b><p>${p.did}</p></div></div>
      ${DEEP[sel]?`<button class="deep-btn" id="deep-btn" aria-expanded="${LVc().deepAuto?'true':'false'}" aria-controls="deep"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/></svg><span>Fördjupad fakta${S.deep.includes(sel)?'':' · +5 XP'}</span></button>
      <div class="deep" id="deep" ${LVc().deepAuto?'':'hidden'}><div class="deep-top">${sayBtn('Fördjupad fakta om '+p.name+'. '+DEEP[sel].map(([h,t])=>h+'. '+t).join(' '))}</div>${DEEP[sel].map(([h,t],i)=>`<section><span class="dnum">${i+1}</span><div><h3>${h}</h3><p>${t}</p></div></section>`).join('')}</div>`:''}
      <button class="primary" id="learn" ${done?'disabled':''}>${done?'★ Utforskad':'Jag har lärt mig om '+(p.short||p.name)+' · +10 XP'}</button></div></article>`;}
function select(k){sel=k;if(filter!=='alla'&&catOf(k)!==filter){filter='alla';renderFilters();}renderStrip();renderDetail();if(cur!=='utforska'){try{location.hash='utforska';}catch(_){}show('utforska');}
  const b=document.querySelector(`.body-btn[data-k="${k}"]`);b&&b.scrollIntoView({inline:'center',block:'nearest',behavior:reduce?'auto':'smooth'});}
$('bsearch').addEventListener('input',()=>{renderStrip();const f=document.querySelector('.body-btn');if(f&&$('bsearch').value.trim())select(f.dataset.k);});
$('strip').addEventListener('click',e=>{const b=e.target.closest('.body-btn');if(b){SFX.click();select(b.dataset.k);}});
$('detail').addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){SFX.click();select(g.dataset.go);return;}
  const pb=e.target.closest('#photo-btn');if(pb){const f=$('photo'),on=f.hidden;f.hidden=!on;pb.setAttribute('aria-pressed',on);pb.querySelector('span').textContent=on?'Visa teckning':'Riktigt foto';SFX.click();return;}
  const db=e.target.closest('#deep-btn');if(db){const d=$('deep'),open=d.hidden;d.hidden=!open;db.setAttribute('aria-expanded',open);SFX.flip();
    if(open){d.classList.add('pop');if(!S.deep.includes(sel)){S.deep.push(sel);db.querySelector('span').textContent='Fördjupad fakta';addXP(5,db);bump('deep');}}return;}
  if(e.target.closest('#learn')&&!S.learned.includes(sel)){S.learned.push(sel);SFX.right();addXP(10,$('learn'));bump('learned');renderStrip();renderDetail();}});

/* ---------- Karta ---------- */
const J2000=Date.UTC(2000,0,1,12);
const L0={mercury:252.25,venus:181.98,earth:100.46,mars:355.45,ceres:153,jupiter:34.4,saturn:49.94,uranus:313.23,neptune:304.88};
const MAPB=['mercury','venus','earth','mars','ceres','jupiter','saturn','uranus','neptune','pluto','halley'];
const MCOL={mercury:'#a39a92',venus:'#e8c27c',earth:'#3f8ae0',mars:'#d0603a',ceres:'#8a8580',jupiter:'#d8b08a',saturn:'#e8d29a',uranus:'#9fe3e3',neptune:'#4f74e0',pluto:'#d8c0a0',halley:'#dff2ff'};
const MSZ={mercury:2.6,venus:4,earth:4.2,mars:3.3,ceres:2,jupiter:8.5,saturn:7.2,uranus:5.4,neptune:5.4,pluto:2.2,halley:2.2};
const MAP={t:0,play:!reduce,names:true,last:null,running:false,hits:[],belt:(()=>{const r=seeded(99);return Array.from({length:260},()=>({a:2.15+r()*1.15,ph:r()*TAU,o:.25+r()*.5}));})()};
function kepler(M,e){M=((M%TAU)+TAU)%TAU;let E=e>.8?PI:M;for(let i=0;i<40;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return 2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2));}
function bodyPos(k,days){const o=ORB[k];
  if(k==='pluto'){const nu=kepler((238.93-224.07)*PI/180+TAU*days/o[1],o[2]);return{r:o[0]*(1-o[2]**2)/(1+o[2]*Math.cos(nu)),ang:224.07*PI/180+nu};}
  if(k==='halley'){const tp=(Date.UTC(1986,1,9)-J2000)/864e5,nu=kepler(TAU*(days-tp)/o[1],o[2]);return{r:o[0]*(1-o[2]**2)/(1+o[2]*Math.cos(nu)),ang:169.7*PI/180-nu};}
  return{r:o[0],ang:L0[k]*PI/180+TAU*days/o[1]};}
const speedDays=()=>Math.max(1,Math.round(Math.pow(10,$('map-speed').value/100*3)));
function startMap(){if(MAP.running)return;MAP.running=true;MAP.last=null;requestAnimationFrame(mapFrame);}
function mapFrame(now){if(cur!=='karta'){MAP.running=false;return;}
  if(MAP.last!==null&&MAP.play)MAP.t+=(now-MAP.last)/1000*speedDays();MAP.last=now;drawMap();requestAnimationFrame(mapFrame);}
function drawMap(){const cv=$('map'),W=Math.round(cv.clientWidth*DPR);if(!W)return;if(cv.width!==W){cv.width=cv.height=W;}
  const c=cv.getContext('2d'),cx=W/2,R0=16*DPR,Rm=W/2-14*DPR,mr=MAP.inner?(r=>R0+(Rm-R0)*r/1.75):(r=>R0+(Rm-R0)*Math.log(1+r*3)/Math.log(151)),days=(Date.now()-J2000)/864e5+MAP.t;
  c.clearRect(0,0,W,W);c.lineWidth=DPR;
  for(const k of MAPB){c.strokeStyle=k==='halley'?'rgba(160,210,255,.25)':'rgba(255,255,255,.13)';c.setLineDash(k==='halley'||k==='pluto'?[3*DPR,4*DPR]:[]);c.beginPath();
    if(k==='pluto'||k==='halley'){const o=ORB[k];for(let i=0;i<=200;i++){const nu=i/200*TAU,r=o[0]*(1-o[2]**2)/(1+o[2]*Math.cos(nu)),ang=(k==='pluto'?224.07*PI/180+nu:169.7*PI/180-nu),x=cx+mr(r)*Math.cos(ang),y=cx-mr(r)*Math.sin(ang);i?c.lineTo(x,y):c.moveTo(x,y);}}
    else c.arc(cx,cx,mr(ORB[k][0]),0,TAU);c.stroke();}
  c.setLineDash([]);
  for(const a of MAP.belt){const ang=a.ph+TAU*days/(365.25*Math.pow(a.a,1.5)),r=mr(a.a);c.fillStyle=`rgba(200,190,180,${a.o})`;c.fillRect(cx+r*Math.cos(ang),cx-r*Math.sin(ang),1.2*DPR,1.2*DPR);}
  const sg=c.createRadialGradient(cx,cx,0,cx,cx,R0*1.6);sg.addColorStop(0,'#fff6c8');sg.addColorStop(.35,'#ffc94a');sg.addColorStop(.6,'rgba(255,150,40,.5)');sg.addColorStop(1,'rgba(255,150,40,0)');c.fillStyle=sg;c.beginPath();c.arc(cx,cx,R0*1.6,0,TAU);c.fill();
  MAP.hits=[];const labs=[];c.font=`800 ${11*DPR}px Nunito,sans-serif`;c.textAlign='center';
  for(const k of MAPB){const {r,ang}=bodyPos(k,days),d=mr(r);if(d>W*.75)continue;const x=cx+d*Math.cos(ang),y=cx-d*Math.sin(ang),s=MSZ[k]*DPR;
    if(k==='halley'&&r<8){const L=Math.min(70,45/r)*DPR,ux=Math.cos(ang),uy=-Math.sin(ang);const g=c.createLinearGradient(x,y,x+ux*L,y+uy*L);g.addColorStop(0,'rgba(200,230,255,.9)');g.addColorStop(1,'rgba(200,230,255,0)');c.strokeStyle=g;c.lineWidth=2.4*DPR;c.beginPath();c.moveTo(x,y);c.lineTo(x+ux*L,y+uy*L);c.stroke();c.lineWidth=DPR;}
    if(k==='saturn'){c.strokeStyle='rgba(232,210,154,.85)';c.lineWidth=1.6*DPR;c.beginPath();c.ellipse(x,y,s*2,s*.7,-.35,0,TAU);c.stroke();c.lineWidth=DPR;}
    const g=c.createRadialGradient(x-s*.35,y-s*.35,s*.1,x,y,s);g.addColorStop(0,'#fff');g.addColorStop(.25,MCOL[k]);g.addColorStop(1,'rgba(0,0,0,.6)');c.fillStyle=g;c.beginPath();c.arc(x,y,s,0,TAU);c.fill();
    if(k==='earth'){const ma=TAU*days/27.32,mx=x+9*DPR*Math.cos(ma),my=y-9*DPR*Math.sin(ma);c.fillStyle='#d8d8e0';c.beginPath();c.arc(mx,my,1.3*DPR,0,TAU);c.fill();}
    if(MAP.names&&k!=='ceres')labs.push([B[k].short||B[k].name,x,y,s]);
    MAP.hits.push([k,x,y]);}
  const placed=[],hh=12*DPR;c.textBaseline='middle';
  for(const [t,x,y,s] of labs){const w=c.measureText(t).width+4*DPR,g=5*DPR;
    const cand=[[x,y-s-g-hh/2],[x,y+s+g+hh/2],[x+s+g+w/2,y],[x-s-g-w/2,y],[x,y-s-g-hh*1.6],[x,y+s+g+hh*1.6]];
    let best=cand[0];for(const p of cand){const bx=[p[0]-w/2,p[1]-hh/2,p[0]+w/2,p[1]+hh/2];if(!placed.some(q=>bx[0]<q[2]&&bx[2]>q[0]&&bx[1]<q[3]&&bx[3]>q[1])){best=p;break;}}
    placed.push([best[0]-w/2,best[1]-hh/2,best[0]+w/2,best[1]+hh/2]);
    c.fillStyle='rgba(10,13,43,.55)';c.fillRect(best[0]-w/2,best[1]-hh/2,w,hh);c.fillStyle='rgba(238,240,255,.92)';c.fillText(t,best[0],best[1]);}
  c.textBaseline='alphabetic';
  const date=new Date(Date.now()+MAP.t*864e5);
  $('map-read').innerHTML=`<span>Datum: <b>${date.toLocaleDateString('sv-SE',{year:'numeric',month:'long',day:'numeric'})}</b></span><span>Jordår som gått: <b>${nf(MAP.t/365.25,1)}</b></span>`;
  if(Math.abs(MAP.t)>=365.25&&!S.mapYear){S.mapYear=true;save();checkBadges();}}
function updSpeedLbl(){$('map-speed-lbl').textContent=`1 sekund = ${nf(speedDays(),0)} dygn`;}
$('map-speed').addEventListener('input',updSpeedLbl);
$('map-play').addEventListener('click',()=>{MAP.play=!MAP.play;$('map-play').textContent=MAP.play?'Pausa':'Spela';SFX.click();});
$('map-today').addEventListener('click',()=>{MAP.t=0;SFX.click();drawMap();});
$('map-zoom').addEventListener('click',e=>{MAP.inner=!MAP.inner;e.currentTarget.setAttribute('aria-pressed',MAP.inner);e.currentTarget.textContent=MAP.inner?'Visa hela solsystemet':'Zooma in: inre planeter';SFX.click();drawMap();});
$('map-names').addEventListener('click',e=>{MAP.names=!MAP.names;e.currentTarget.setAttribute('aria-pressed',MAP.names);e.currentTarget.textContent='Namn: '+(MAP.names?'på':'av');drawMap();});
$('map').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)*DPR,y=(e.clientY-r.top)*DPR;let best=null,bd=22*DPR;
  for(const [k,hx,hy] of MAP.hits){const d=Math.hypot(hx-x,hy-y);if(d<bd){bd=d;best=k;}}if(best){SFX.click();select(best);}});

/* ---------- Skala ---------- */
let scaleBuilt=false;
function renderScale(){if(scaleBuilt)return;scaleBuilt=true;
  const SZ=['mercury','venus','earth','moon','mars','ceres','pluto','jupiter','saturn','uranus','neptune'],JUP=230;
  $('scale-row').innerHTML=`<div class="sun-edge">Solen är 109 jordar bred och får inte plats!</div>`+SZ.map(k=>{const D=DIAM[k]/DIAM.jupiter*JUP,W=(D/(2*R3[k].rf)).toFixed(1);
    return `<div class="scale-item">${art(k,'',`width:${W}px;height:${W}px`)}<b>${B[k].name}</b><small>${nf(DIAM[k],0)} km</small></div>`;}).join('');
  const PX=60,DK=['mercury','venus','earth','mars','ceres','jupiter','saturn','uranus','neptune','pluto'];
  $('dist-inner').style.width=(60+40*PX+80)+'px';
  $('dist-inner').innerHTML=`<div class="dist-line"></div><div class="dist-sun"></div>`+DK.map(k=>`<div class="dist-mark" style="left:${60+ORB[k][0]*PX}px">${art(k)}<b>${B[k].short||B[k].name}</b><small>${nf(ORB[k][0],2)} AU</small></div>`).join('')+`<div class="photon" id="photon"></div>`;
  const fmtKm=au=>{const km=au*149.6e6;return km>=1e9?nf(km/1e9,1)+' miljarder km':nf(km/1e6,0)+' milj. km';};
  $('dist-table').innerHTML=`<caption style="text-align:left;color:var(--muted);font-size:.82rem;padding:8px 0">1 AU är avståndet mellan jorden och solen, ungefär 150 miljoner km.</caption><thead><tr><th>Himlakropp</th><th>Avstånd till solen</th><th>AU</th><th>Ljusets restid</th></tr></thead><tbody>`+
    DK.map(k=>`<tr><td>${B[k].name}</td><td>${fmtKm(ORB[k][0])}</td><td>${nf(ORB[k][0],2)}</td><td>${fmtT(ORB[k][0]*499)}</td></tr>`).join('')+'</tbody>';}
function fmtT(s){s=Math.round(s);if(s<60)return s+' s';if(s<3600)return Math.floor(s/60)+' min '+(s%60)+' s';return Math.floor(s/3600)+' h '+Math.floor(s%3600/60)+' min';}
$('scale-mode').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const m=b.dataset.m;[...$('scale-mode').children].forEach(x=>x.setAttribute('aria-pressed',x===b));$('scale-size').hidden=m!=='size';$('scale-dist').hidden=m!=='dist';SFX.click();});
let LT={on:false,start:0,speed:100,last:''};
$('light-speed').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;LT.speed=+b.dataset.s;[...$('light-speed').children].forEach(x=>x.setAttribute('aria-pressed',x===b));if(LT.on){LT.start=performance.now()-LT.sim/LT.speed*1000;}});
$('light-go').addEventListener('click',()=>{if(LT.on){LT.on=false;$('light-go').textContent='Skicka en ljusstråle';return;}
  LT.on=true;LT.sim=0;LT.start=performance.now();LT.last='';$('light-go').textContent='Stoppa';$('photon').classList.add('on');SFX.star();requestAnimationFrame(lightFrame);});
function lightFrame(now){if(!LT.on)return;LT.sim=(now-LT.start)/1000*LT.speed;const au=LT.sim/499,PX=60;$('photon').style.left=(60+au*PX)+'px';
  const tr=$('dist-track');tr.scrollLeft=60+au*PX-tr.clientWidth*.45;
  const passed=['mercury','venus','earth','mars','ceres','jupiter','saturn','uranus','neptune','pluto'].filter(k=>ORB[k][0]<=au).pop();
  if(passed&&passed!==LT.last){LT.last=passed;SFX.star();if(passed==='neptune'&&!S.lightNeptune){S.lightNeptune=true;save();checkBadges();}}
  $('light-read').innerHTML=`<span>Ljuset har färdats i <b>${fmtT(LT.sim)}</b></span><span>${passed?'Har passerat: <b>'+B[passed].name+'</b>':'På väg mot Merkurius'}</span>`;
  if(au>=ORB.pluto[0]){LT.on=false;$('light-go').textContent='Skicka en ljusstråle igen';return;}
  requestAnimationFrame(lightFrame);}

/* ---------- Våg ---------- */
function renderWeight(){const kg=Math.max(1,Math.min(250,+$('kg').value||S.weight));
  $('wrows').innerHTML=GRAV.map(([k,g])=>{const w=kg*g,j=.5/g,sun=k==='sun';
    return `<div class="wrow">${art(k)}<b>${B[k].name}</b><div class="wbar"><i style="width:${Math.min(100,g/2.53*100)}%"></i></div><div class="wval"><b>${nf(w,w<10?1:0)} kg</b><small>${sun?'ingen yta att hoppa på':'hopp: '+nf(j,j<1?2:1)+' m'}</small></div></div>`;}).join('');}
$('kg').value=S.weight;
$('kg').addEventListener('input',()=>{const v=+$('kg').value;if(v>0){S.weight=v;S.weighed=true;save();checkBadges();}renderWeight();});

/* ---------- Stjärnbilder ---------- */
let CI=0,CS={pos:0,pen:null,lines:[],done:false};
function renderConstPick(){$('const-pick').innerHTML=CONST.map((c,i)=>`<button data-i="${i}" aria-pressed="${i===CI}">${S.consts.includes(c.id)?'★ ':''}${c.name}</button>`).join('');}
function startConst(i){CI=i;CS={pos:0,pen:null,lines:[],done:false};renderConstPick();renderConst();}
function renderConst(){const c=CONST[CI],r=seeded(CI*17+5);let bg='';for(let i=0;i<70;i++)bg+=`<circle cx="${(r()*110-5).toFixed(1)}" cy="${(r()*110-5).toFixed(1)}" r="${(r()*.35+.1).toFixed(2)}" fill="#fff" opacity="${(.2+r()*.5).toFixed(2)}"/>`;
  const target=CS.done?-1:c.path[CS.pos],touched=new Set(CS.lines.flat());if(CS.pen!==null)touched.add(CS.pen);
  const col=n=>n==='Betelgeuse'?'#ffb08a':n==='Rigel'?'#bcd4ff':n==='Polstjärnan'?'#fff0b8':'#ffffff';
  const lines=CS.lines.map(([a,b])=>`<line class="cline" x1="${c.stars[a][0]}" y1="${c.stars[a][1]}" x2="${c.stars[b][0]}" y2="${c.stars[b][1]}" pathLength="100"/>`).join('');
  const stars=c.stars.map((s,i)=>`<g><circle cx="${s[0]}" cy="${s[1]}" r="${s[2]*1.6}" fill="${col(s[3])}" opacity=".18"/><circle cx="${s[0]}" cy="${s[1]}" r="${s[2]*.62}" fill="${col(s[3])}"/>
    ${i===target?`<circle class="target-ring" cx="${s[0]}" cy="${s[1]}" r="4"/>`:''}${(touched.has(i)||CS.done)&&s[3]?`<text x="${s[0]}" y="${s[1]+6}" text-anchor="middle" font-size="3.2" font-weight="800" fill="#a6acdf" font-family="Nunito,sans-serif">${s[3]}</text>`:''}
    <circle class="star-hit" data-i="${i}" cx="${s[0]}" cy="${s[1]}" r="6.5" fill="transparent" tabindex="0" role="button" aria-label="${s[3]||'Stjärna'}${i===target?' (nästa)':''}"/></g>`).join('');
  $('const-board').innerHTML=`<svg viewBox="-5 -5 110 110" aria-label="Stjärnbilden ${c.name}">${bg}${lines}${stars}</svg>`;
  const total=c.path.filter((v,i)=>v!==-1&&i>0&&c.path[i-1]!==-1).length;
  $('const-info').innerHTML=CS.done?`<div class="const-info pop">${nova()}<div><b style="font-family:var(--display);font-size:1.15rem;color:var(--mint)">Du ritade ${c.name}!</b><p>${c.fact}</p><button class="linkbtn" id="c-again" style="margin-top:6px">Rita igen</button></div></div>`
    :`<p class="lead">Streck: <b style="color:var(--ink)">${CS.lines.length} av ${total}</b>. Tryck på stjärnan med den gula ringen.</p>`;
  const key='c:'+c.id,seen=S.deep.includes(key);
  $('const-info').insertAdjacentHTML('beforeend',`<button class="deep-btn" id="cdeep-btn" aria-expanded="${CS.deepOpen?'true':'false'}" aria-controls="cdeep" style="margin-top:12px;width:100%"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/></svg><span>Fördjupad fakta om ${c.name}${seen?'':' · +5 XP'}</span></button>
    <div class="deep" id="cdeep" style="margin-top:10px" ${CS.deepOpen?'':'hidden'}><div class="deep-top">${sayBtn(c.name+'. '+c.fact+' '+c.deep.map(([h,t])=>h+'. '+t).join(' '))}</div>${c.deep.map(([h,t],i)=>`<section><span class="dnum">${i+1}</span><div><h3>${h}</h3><p>${t}</p></div></section>`).join('')}</div>`);}
function tapStar(i){const c=CONST[CI];if(CS.done)return;
  if(i!==c.path[CS.pos]){tone(200,.12,'sine',.05);return;}
  SFX.star();if(CS.pen!==null)CS.lines.push([CS.pen,i]);CS.pen=i;CS.pos++;while(c.path[CS.pos]===-1){CS.pen=null;CS.pos++;}
  if(CS.pos>=c.path.length){CS.done=true;renderConst();if(!S.consts.includes(c.id)){S.consts.push(c.id);addXP(15,$('const-board'));renderConstPick();}else SFX.right();return;}
  renderConst();const n=document.querySelector(`#const-board [data-i="${c.path[CS.pos]}"]`);}
$('const-pick').addEventListener('click',e=>{const b=e.target.closest('button');if(b){SFX.click();startConst(+b.dataset.i);}});
$('const-board').addEventListener('click',e=>{const h=e.target.closest('[data-i]');if(h)tapStar(+h.dataset.i);});
$('const-board').addEventListener('keydown',e=>{const h=e.target.closest('[data-i]');if(h&&(e.key==='Enter'||e.key===' ')){e.preventDefault();tapStar(+h.dataset.i);}});
$('const-info').addEventListener('click',e=>{if(e.target.closest('#c-again'))startConst(CI);
  const b=e.target.closest('#cdeep-btn');if(b){const d=$('cdeep'),open=d.hidden;d.hidden=!open;CS.deepOpen=open;b.setAttribute('aria-expanded',open);SFX.flip();
    const key='c:'+CONST[CI].id;if(open&&!S.deep.includes(key)){S.deep.push(key);b.querySelector('span').textContent='Fördjupad fakta om '+CONST[CI].name;addXP(5,b);}}});

/* ---------- Tidslinje och ordlista ---------- */
$('tl').innerHTML=TIMELINE.map(([y,t,d,m],i)=>`<li><span class="yr">${y}</span><div class="ev ${/Fuglesang|Wandt/.test(t)?'se':''}"><div class="title-row"><b>${t}</b>${sayBtn(y+'. '+t+'. '+d+(m?' '+m:''))}</div><p>${d}</p>${m?`<details data-i="${i}"><summary>Fördjupad fakta</summary><p class="more">${m}</p></details>`:''}</div></li>`).join('');
$('tl').addEventListener('toggle',e=>{const dt=e.target;if(!dt.open)return;SFX.flip();const key='t:'+dt.dataset.i;if(!S.deep.includes(key)){S.deep.push(key);addXP(2,dt.querySelector('summary'));}},true);
function renderGloss(){const q=$('gsearch').value.trim().toLowerCase();const list=[...new Map(GLOSSARY.map(g=>[g[0],g])).values()].sort((x,y)=>x[0].localeCompare(y[0],'sv')).filter(([w,d])=>!q||w.toLowerCase().includes(q)||d.toLowerCase().includes(q));
  $('gloss').innerHTML=list.length?list.map(([w,d])=>`<div class="${S.terms.includes(w)?'seen':''}"><dt class="title-row">${w}${sayBtn(w+'. '+d)}</dt><dd>${d}</dd></div>`).join(''):`<p class="lead">Inget ord matchar "${q.replace(/[<>&"]/g,'')}". Prova ett annat ord.</p>`;}
$('gsearch').addEventListener('input',renderGloss);

/* ---------- Minneskort (smart repetition) ---------- */
const INT=[0,10/1440,1,3,7,16];
const QT=[['alla','Allt'],['planet','Planeter'],['mane','Månar'],['stjarna','Stjärnor'],['dverg','Dvärgplaneter & asteroider'],['komet','Kometer'],['djup','Djuprymden']];
let fcTopic='alla',queue=[];
const boxOf=id=>S.box[id]||{b:0,due:0};
const itemById=id=>ITEMS.find(it=>it.id===id);
const fcPool=()=>ITEMS.filter(it=>!it.gen&&!(LVc().easyCards&&it.hard)&&(fcTopic==='alla'||catOf(it.k)===fcTopic));
function renderFcTopic(){$('fc-topic').innerHTML=QT.map(([c,l])=>`<button data-c="${c}" aria-pressed="${c===fcTopic}">${l}</button>`).join('');}
$('fc-topic').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;fcTopic=b.dataset.c;renderFcTopic();buildQueue();});
function buildQueue(){const now=Date.now();queue=shuffle(fcPool().filter(it=>boxOf(it.id).due<=now)).sort((a,b)=>boxOf(a.id).b-boxOf(b.id).b).map(it=>it.id);renderFC();}
function renderFC(){$('fc-left').textContent=queue.length;const box=$('fc');
  if(!queue.length){const pool=fcPool(),cnt=[0,0,0,0,0,0];pool.forEach(it=>cnt[boxOf(it.id).b]++);const next=Math.min(...pool.map(it=>boxOf(it.id).due));
    box.innerHTML=`<div class="card result pop">${nova('happy')}<h2>Alla kort är klara för nu!</h2><p class="lead">${isFinite(next)&&next>Date.now()?'Nästa kort är redo om '+fmtWait(next-Date.now())+'.':''}</p>
      <div class="leit">${cnt.map((n,i)=>`<span>Låda ${i+1}: ${n}</span>`).join('')}</div><button class="primary" id="fc-all">Öva på alla kort ändå</button></div>`;return;}
  const c=itemById(queue[0]),b=boxOf(c.id).b;
  box.innerHTML=`<div class="flip pop" id="flip" tabindex="0" role="button" aria-label="Vänd kortet"><div class="inner">
      <div class="face front"><div class="boxes" aria-label="Låda ${b+1} av 6">Låda ${b+1} ${[0,1,2,3,4,5].map(i=>`<i class="${i<=b?'on':''}"></i>`).join('')}</div>${art(c.k)}<h3>${c.q}</h3><span class="hint">Tryck för att se svaret</span>${sayBtn(c.q)}</div>
      <div class="face back"><span class="hint">Svar</span><div class="ans">${c.a}</div><p>${c.ex}</p>${sayBtn(c.a+'. '+c.ex)}</div></div></div>
    <div class="row" style="margin-top:16px"><button class="ghost" id="fc-more" disabled>Öva mer</button><button class="primary" id="fc-know" disabled>Jag kunde den! · +5 XP</button></div>`;}
function fmtWait(ms){const m=Math.round(ms/6e4);if(m<60)return m+' min';const h=Math.round(m/60);if(h<36)return h+' timmar';return Math.round(h/24)+' dygn';}
function flip(){const f=$('flip');if(!f)return;f.classList.toggle('flipped');SFX.flip();$('fc-more').disabled=false;$('fc-know').disabled=false;}
$('fc').addEventListener('click',e=>{
  if(e.target.closest('#flip'))flip();
  else if(e.target.closest('#fc-more')){const id=queue.shift();S.box[id]={b:0,due:0};save();queue.splice(Math.min(3,queue.length),0,id);renderFC();}
  else if(e.target.closest('#fc-know')){const id=queue.shift(),b=Math.min(5,boxOf(id).b+1);S.box[id]={b,due:Date.now()+INT[b]*864e5};S.cardsKnown++;SFX.right();addXP(5,e.target.closest('#fc-know'));bump('cards');renderFC();}
  else if(e.target.closest('#fc-all')){queue=shuffle(fcPool()).map(it=>it.id);renderFC();}});
$('fc').addEventListener('keydown',e=>{if(e.target.id==='flip'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();flip();}});

/* ---------- Quiz ---------- */
const ROUND=10;const RN=()=>LVc().round;let QS={topic:'alla',level:null,players:1};const Q={list:[],i:0,score:0,stage:'setup'};
function quizPool(t,l){if(t==='missar')return shuffle(ITEMS.filter(it=>S.missed.includes(it.id)));const lv=LVc();let base=ITEMS.filter(it=>t==='alla'||catOf(it.k)===t);if(lv.gen===false)base=base.filter(i=>!i.gen);if(lv.gen==='rev')base=base.filter(i=>!(i.gen&&i.hard));if(l==='mix')return shuffle(base);const easy=base.filter(it=>!it.hard),hard=base.filter(it=>it.hard);
  if(l==='latt')return easy.length>=4?shuffle(easy):shuffle(base);return shuffle(hard).concat(shuffle(easy));}
function renderSetup(){if(!QS.level)QS.level=LVc().qlevel;if(QS.topic==='missar'&&!S.missed.length)QS.topic='alla';const n=t=>ITEMS.filter(it=>t==='alla'||catOf(it.k)===t).length;
  $('quiz').innerHTML=`<div class="setup pop"><div class="vhead"><h2>Välj din rymdresa</h2><p class="lead">Varje rätt svar ger 10 XP. En omgång har upp till ${RN()} frågor på din nivå, ${LVc().name}.</p></div>
    <div><h3>Ämne</h3><div class="chips-row" id="q-topic" style="margin-top:6px">${S.missed.length?`<button data-c="missar" aria-pressed="${QS.topic==='missar'}" class="miss-chip">Öva på dina missar (${S.missed.length})</button>`:''}${QT.map(([c,l])=>`<button data-c="${c}" aria-pressed="${c===QS.topic}">${l} (${n(c)})</button>`).join('')}</div></div>
    <div><h3>Spelare</h3><div class="chips-row" style="margin-top:6px"><button data-p="1" aria-pressed="${QS.players===1}">En spelare</button><button data-p="2" aria-pressed="${QS.players===2}">Två spelare: tävla mot en kompis</button></div></div>
    <div><h3>Nivå</h3><div class="levels" id="q-level" style="margin-top:6px"><button data-l="latt" aria-pressed="${QS.level==='latt'}"><b>Lätt</b><small>Grundfrågor om hur rymden fungerar</small></button><button data-l="mix" aria-pressed="${QS.level==='mix'}"><b>Blandad</b><small>Både lätta och svåra frågor</small></button><button data-l="svar" aria-pressed="${QS.level==='svar'}"><b>Svår</b><small>Siffror, årtal och upptäckter</small></button></div></div>
    <p class="lead" id="q-fresh">${(()=>{const p=quizPool(QS.topic,QS.level),s=new Set(S.qSeen),f=p.filter(i=>!s.has(i.id)).length;return f?`${f} frågor du inte har fått än i det här valet. Varje omgång får du nya frågor.`:'Du har fått alla frågor här. Nästa omgång börjar om med frågorna i ny ordning.';})()}</p>
    <button class="primary" id="q-start">Starta rymdresan</button></div>`;}
function freshFirst(pool,n){const seen=new Set(S.qSeen);let fresh=pool.filter(it=>!seen.has(it.id));
  if(fresh.length<n){const ids=new Set(pool.map(i=>i.id));S.qSeen=S.qSeen.filter(id=>!ids.has(id));const rest=pool.filter(it=>!fresh.includes(it));fresh=fresh.concat(rest);}
  const pick=fresh.slice(0,n);S.qSeen.push(...pick.map(i=>i.id));if(S.qSeen.length>2000)S.qSeen=S.qSeen.slice(-2000);save();return pick;}
function startQuiz(){const pool=quizPool(QS.topic,QS.level);let n=Math.min(RN(),pool.length);if(QS.players===2&&n%2)n--;Q.scores=[0,0];Q.list=shuffle(freshFirst(pool,n)).map(it=>({...it,opts:shuffle([it.a,...shuffle(it.w).slice(0,LVc().opts-1)])}));Q.i=0;Q.score=0;Q.logged=0;Q.stage='play';renderQuiz();}
function track(pos){return `<div class="track"><span class="path"></span>${art('earth')}<div style="position:absolute;left:52px;right:52px;top:0;bottom:0">${ROCKET.replace('class="rocket"',`class="rocket" style="left:${pos*100}%"`)}</div>${art('moon')}</div>`;}
function renderQuiz(fb){const box=$('quiz'),N=Q.list.length;
  if(Q.stage==='setup')return renderSetup();
  if(Q.i>=N&&QS.players===2){const [a1,a2]=Q.scores,w=a1===a2?'Oavgjort!':`Spelare ${a1>a2?1:2} vinner!`;SFX.badge();
    box.innerHTML=`${track(1)}<div class="result pop" style="margin-top:16px">${nova('happy')}<h2>${w}</h2><div class="duel"><div class="p1"><small>Spelare 1</small><b>${a1}</b></div><div class="p2"><small>Spelare 2</small><b>${a2}</b></div></div><p>Varje spelare fick ${N/2} frågor.</p><div class="row"><button class="ghost" id="q-setup">Byt inställningar</button><button class="primary" id="q-again">Spela igen</button></div></div>`;return;}
  if(Q.i>=N){const r=Q.score/N,st=r>=.9?3:r>=.6?2:r>=.3?1:0,msg=['Bra försök! Utforska lite mer och testa igen.','Bra start! Du är på väg mot stjärnorna.','Grymt! Du kan mycket om rymden.','Perfekt landning! Du är en riktig rymdexpert.'][st];
    if(!Q.logged){Q.logged=1;S.rounds.push({t:Date.now(),s:Q.score,n:N,topic:QS.topic,lv:QS.level});if(S.rounds.length>30)S.rounds.splice(0,S.rounds.length-30);save();}if(Q.score===N&&N>=5&&!S.perfect){S.perfect=true;save();}if(QS.level==='svar'&&Q.score>=8&&!S.hardGood){S.hardGood=true;save();}checkBadges();
    box.innerHTML=`${track(1)}<div class="result pop" style="margin-top:16px">${nova(st?'happy':'sad')}<div class="stars" aria-label="${st} av 3 stjärnor">${[0,1,2].map(i=>`<span class="${i<st?'':'off'}">★</span>`).join('')}</div><h2>${Q.score} av ${N} rätt</h2><p>${msg}</p>
      <div class="row"><button class="ghost" id="q-setup">Byt ämne eller nivå</button><button class="primary" id="q-again">Ny rymdresa</button></div></div>`;
    if(st===3)SFX.badge();return;}
  const c=Q.list[Q.i];
  box.innerHTML=`${track(Q.i/N)}<div style="display:flex;flex-direction:column;gap:14px;margin-top:16px" class="${fb?'':'pop'}">
    ${QS.players===2?`<div class="turn p${Q.i%2+1}"><b>Spelare ${Q.i%2+1}:s tur</b><span>Spelare 1: ${Q.scores[0]} · Spelare 2: ${Q.scores[1]}</span></div>`:''}<div class="q-head"><span>Fråga ${Q.i+1} av ${N} · ${QS.topic==='missar'?'Dina missar':QS.level==='svar'?'Svår':QS.level==='mix'?'Blandad':'Lätt'}</span><span>${Q.score} rätt</span></div>
    <div class="q-body">${art(c.k)}<div><h3>${c.q}</h3><div style="margin-top:8px">${sayBtn(c.q+' Svarsalternativ: '+c.opts.join(', ')+'.')}</div></div></div>
    <div class="opts">${c.opts.map(o=>{let cl='';if(fb){if(o===c.a)cl='right';else if(o===fb.pick)cl='wrong';}return `<button class="opt ${cl}" data-o="${encodeURIComponent(o)}" ${fb?'disabled':''}>${o}</button>`;}).join('')}</div>
    ${fb?`<div class="feedback ${fb.ok?'ok':'no'} pop">${nova(fb.ok?'happy':'sad')}<div><b>${fb.ok?'Rätt! +10 XP':'Inte riktigt. Svaret är: '+c.a}</b><p>${c.ex}</p><div style="margin-top:6px">${sayBtn((fb.ok?'Rätt! ':'Svaret är '+c.a+'. ')+c.ex)}</div></div></div><button class="primary" id="q-next">${Q.i+1<N?'Nästa fråga':'Se resultat'}</button>`:''}</div>`;
  if(fb)$('q-next').focus({preventScroll:true});}
$('quiz').addEventListener('click',e=>{const t=e.target.closest('[data-c]');if(t&&Q.stage==='setup'){QS.topic=t.dataset.c;SFX.click();renderSetup();return;}
  const pl=e.target.closest('[data-p]');if(pl&&Q.stage==='setup'){QS.players=+pl.dataset.p;SFX.click();renderSetup();return;}
  const l=e.target.closest('[data-l]');if(l){QS.level=l.dataset.l;SFX.click();renderSetup();return;}
  if(e.target.closest('#q-start')||e.target.closest('#q-again')){SFX.click();startQuiz();return;}
  if(e.target.closest('#q-setup')){Q.stage='setup';renderQuiz();return;}
  const o=e.target.closest('.opt');if(o&&!o.disabled){const c=Q.list[Q.i],pick=decodeURIComponent(o.dataset.o),ok=pick===c.a;if(ok){Q.score++;Q.scores[Q.i%2]++;}renderQuiz({pick,ok});if(ok){SFX.right();addXP(10,document.querySelector('.opt.right'));noteHit(c.id);bump('quiz');}else{SFX.wrong();noteMiss(c.id);}buddyOnAnswer(ok,c);return;}
  if(e.target.closest('#q-next')){Q.i++;renderQuiz();}});

/* ---------- Stjärnhimmel ---------- */
const sky=$('sky'),sctx=sky.getContext('2d');let SW,SH,stars=[],shoot=null;
function skySize(){SW=sky.width=innerWidth*DPR;SH=sky.height=innerHeight*DPR;
  stars=Array.from({length:Math.round(innerWidth*innerHeight/2200)},()=>({x:Math.random()*SW,y:Math.random()*SH,r:(Math.random()*1.2+.3)*DPR,p:Math.random()*6.28,s:Math.random()*.03+.008,c:Math.random()<.15?'255,201,74':Math.random()<.2?'255,170,210':'255,255,255'}));}
function skyDraw(t){sctx.clearRect(0,0,SW,SH);
  for(const s of stars){const a=reduce?.7:.35+.65*Math.abs(Math.sin(s.p+t*s.s*.06));sctx.fillStyle=`rgba(${s.c},${a})`;sctx.beginPath();sctx.arc(s.x,s.y,s.r,0,TAU);sctx.fill();}
  if(!reduce&&!S.lite){if(!shoot&&Math.random()<.004)shoot={x:Math.random()*SW*.7,y:Math.random()*SH*.4,l:0};
    if(shoot){shoot.l+=14*DPR;const x=shoot.x+shoot.l,y=shoot.y+shoot.l*.45,g=sctx.createLinearGradient(x-90*DPR,y-40*DPR,x,y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.9)');
      sctx.strokeStyle=g;sctx.lineWidth=2*DPR;sctx.beginPath();sctx.moveTo(x-90*DPR,y-40*DPR);sctx.lineTo(x,y);sctx.stroke();if(shoot.l>SW*.5)shoot=null;}
    requestAnimationFrame(skyDraw);}}
addEventListener('resize',()=>{skySize();if(reduce)skyDraw(0);});

