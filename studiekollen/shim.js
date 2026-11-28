/* Studiekollen – fristående version. Lokal databas i telefonen + automatisk hämtning av krypterad data. */
window.SK_STANDALONE=true;
(function(){
const K='skdb1',MANAGED=['uppgifter','kalender','kurser','quiz','kort'];
let D={};try{D=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){D={}}
D._rh=D._rh||{};D._lm=D._lm||{};
const subs={};
const persist=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){}};
const snap=c=>({docs:Object.entries(D[c]||{}).map(([id,data])=>({id,data}))});
const fire=c=>(subs[c]||[]).forEach(f=>{try{f(snap(c))}catch(e){}});
const touch=(c,id)=>{(D._lm[c]=D._lm[c]||{})[id]=Date.now()};
const coll=c=>({
  onSnapshot(f){(subs[c]=subs[c]||[]).push(f);setTimeout(()=>f(snap(c)),0);return()=>{}},
  doc(id){return{
    async set(d){(D[c]=D[c]||{})[id]=JSON.parse(JSON.stringify(d));touch(c,id);persist();fire(c)},
    async update(d){D[c]=D[c]||{};D[c][id]=Object.assign({},D[c][id]||{},JSON.parse(JSON.stringify(d)));touch(c,id);persist();fire(c)},
    async delete(){if(D[c])delete D[c][id];touch(c,id);persist();fire(c)}}}
});
/* videor ligger i appens egen mapp */
const VMAP={'/_blob/1a8600e65030ff4d136f3c39d6b00846':'video/prov2.mp4','/_blob/ca681b190540c07970d862d705e26cb3':'video/prov2.jpg','/_blob/de6c2f6711c809a39f5b941d3aa09afd':'video/byggfysik.mp4','/_blob/abe93bda3a57c11abed51f996e502ec4':'video/byggfysik.jpg'};
const fixV=v=>{if(!v)return v;const o=Object.assign({},v);if(VMAP[o.url])o.url=VMAP[o.url];else if(typeof o.url==='string'&&o.url.startsWith('/_blob/'))return null;if(VMAP[o.poster])o.poster=VMAP[o.poster];else if(typeof o.poster==='string'&&o.poster.startsWith('/_blob/'))o.poster='';return o};
const h=o=>{const s=JSON.stringify(o);let x=5381;for(let i=0;i<s.length;i++)x=((x<<5)+x+s.charCodeAt(i))|0;return x};
/* behåll bockar från telefonen */
const keepTicks=(r,l)=>{if(!l)return r;r=JSON.parse(JSON.stringify(r));if(l.klar)r.klar=true;
  const done=new Set((l.steg||[]).filter(s=>s.klar).map(s=>String(s.t).replace(/^(mån|tis|ons|tor|fre|lör|sön)\s+\d{1,2}\/\d{1,2}[^:]*:\s*/i,'')));
  (r.steg||[]).forEach(s=>{if(done.has(String(s.t).replace(/^(mån|tis|ons|tor|fre|lör|sön)\s+\d{1,2}\/\d{1,2}[^:]*:\s*/i,'')))s.klar=true});return r};
function merge(o,full){const cs=o.coll||{},changed=new Set();
  for(const c of Object.keys(cs)){const arr=cs[c]||[];const R={};for(const r of arr){if(!r||r.id==null)continue;const {id,...d}=r;if(c==='uppgifter'&&d.video)d.video=fixV(d.video);R[id]=d}
    D[c]=D[c]||{};
    if(!MANAGED.includes(c)){ /* lokala saker (quiz-repetition, känslor, LIA): ta bara det som saknas */
      for(const [id,d] of Object.entries(R))if(!(id in D[c])||full){D[c][id]=d;changed.add(c)}continue}
    const rh=D._rh[c]=D._rh[c]||{},lm=(D._lm[c]=D._lm[c]||{}),seen=D._seenAt||0;
    for(const [id,d] of Object.entries(R)){const nh=h(d),l=D[c][id];
      if(l&&!full&&rh[id]===nh&&(lm[id]||0)>seen)continue;            /* oförändrat på servern, ändrat i telefonen: behåll telefonens */
      const v=c==='uppgifter'&&!full?keepTicks(d,l):d;
      if(JSON.stringify(v)!==JSON.stringify(l)){D[c][id]=v;changed.add(c)}rh[id]=nh}
    for(const id of Object.keys(D[c]))if(!(id in R)&&(id in rh||full)){delete D[c][id];delete rh[id];changed.add(c)}}
  if(o.namn){try{if(!localStorage.getItem('sk-namn'))localStorage.setItem('sk-namn',o.namn)}catch(e){}}
  D._seenAt=Date.now();D._remote=o.exporterad||'';persist();changed.forEach(fire);return changed.size}
/* krypterad fil från kvällshämtningen */
const b64=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((s.length+3)%4)),c=>c.charCodeAt(0));
function key(){let k='';const m=/[#&]k=([A-Za-z0-9_-]{40,})/.exec(location.hash);
  if(m){k=m[1];try{localStorage.setItem('sk-key',k)}catch(e){}history.replaceState(null,'',location.pathname)}
  if(!k){try{k=localStorage.getItem('sk-key')||''}catch(e){}}return k}
let pulling=null;
async function pull(){const k=key();if(!k||!crypto.subtle)return{ok:false,why:'nokey'};
  try{const r=await fetch('data.enc.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return{ok:false,why:'net'};const e=await r.json();
    const ck=await crypto.subtle.importKey('raw',b64(k),'AES-GCM',false,['decrypt']);
    const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(e.iv)},ck,b64(e.ct));
    const o=JSON.parse(new TextDecoder().decode(pt));if(o.exporterad&&o.exporterad===D._remote&&D._seenAt)return{ok:true,n:0,at:o.exporterad};
    const n=merge(o,false);return{ok:true,n,at:o.exporterad}}
  catch(e){return{ok:false,why:e&&e.name==='OperationError'?'badkey':'net'}}}
window.SKDB={
  importAll(o){merge(o,true)},
  pull(){return pulling=pulling||pull().finally(()=>{pulling=null})},
  hasKey(){return !!key()},
  info(){return{at:D._remote||'',seen:D._seenAt||0,tasks:Object.keys(D.uppgifter||{}).length}}
};
/* uppläsning med telefonens egen svenska röst */
const tts=('speechSynthesis' in window)?{async speak(lines){speechSynthesis.cancel();const v=speechSynthesis.getVoices().find(v=>/^sv/i.test(v.lang));
  for(const l of lines){const u=new SpeechSynthesisUtterance(l.text);u.lang='sv-SE';if(v)u.voice=v;u.rate=.95;speechSynthesis.speak(u)}}}:null;
window.claude={use:async n=>n==='db'?{collection:coll}:n==='tts'?tts:null};
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
