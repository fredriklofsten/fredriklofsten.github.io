/* ===================== Svåra ord ===================== */
const GLPAT={'Krater':'krater(?:n)?|kratrar(?:na)?','Nebulosa':'nebulosa(?:n)?|nebulosor(?:na)?','Neutronstjärna':'neutronstjärna(?:n)?|neutronstjärnor(?:na)?','Supernova':'supernova(?:n)?|supernovor',
 'Svart hål':'svart(?:a)? hål(?:et|en)?','Vit dvärg':'vit(?:a)? dvärg(?:en|ar)?','Gasjätte':'gasjätte(?:n|ar|arna)?','Isjätte':'isjätte(?:n|ar|arna)?','Stjärnbild':'stjärnbild(?:en|er|erna)?',
 'Ljusår':'ljusår(?:et|en)?','Måne':'måne(?:n)?|månar(?:na)?','Planet':'planet(?:en|er|erna|ens)?','Stjärna':'stjärna(?:n)?|stjärnor(?:na)?','Atmosfär':'atmosfär(?:en|er)?',
 'Händelsehorisont':'händelsehorisont(?:en)?','Komet':'komet(?:en|er|erna|ens)?','Meteor':'meteor(?:en|er|erna)?','Meteorit':'meteorit(?:en|er|erna)?','Dvärgplanet':'dvärgplanet(?:en|er|erna)?',
 'Galax':'galax(?:en|er|erna|ens)?','Rymdsond':'rymdsond(?:en|er|erna)?','Pulsar':'pulsar(?:en|er)?','Teleskop':'teleskop(?:et|en)?','Ekliptika':'ekliptika(?:n)?','Omloppstid':'omloppstid(?:en)?',
 'Tyngdkraft':'tyngdkraft(?:en)?','Solsystem':'solsystem(?:et|ets)?','Asteroid':'asteroid(?:en|er|erna)?','Cirkumpolär':'cirkumpolär(?:a)?','Teleskop':'teleskop(?:et|en)?'};
const COMMON=new Set(['Planet','Stjärna','Måne','Komet','Galax','Asteroid','Bana','Teleskop']); // vanliga ord: länkas inte
const GL=[];const seenW=new Set();
for(const [w,d,p] of GLOSSARY){if(seenW.has(w)||COMMON.has(w))continue;seenW.add(w);const src=p||GLPAT[w]||w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:en|et|n|t|er|erna|ar|arna|or|orna)?';GL.push({w,d,src,re:new RegExp('^(?:'+src+')$','iu')});}
const GLRE=new RegExp('(?<![\\p{L}\\p{N}])(?:'+GL.map(g=>g.src).sort((a,b)=>b.length-a.length).join('|')+')(?![\\p{L}\\p{N}])','giu');
const GLSEL='.facts li>span,.deep p,.tag,.did p,.daily p,.face p,.feedback p,.tl .ev p,.const-info p,.step p,.why p,.sky-card p,.result p,.lead,.q-body h3,.face h3';
const GLSKIP='button,a,.term,h1,h2,.say,.opt,svg,.tabs,.stat,.chips-row,#v-ordlista,input,label,.readout,.tasks';
function linkTerms(el){if(el.dataset.gl)return;el.dataset.gl=1;const used=new Set(),walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const n of nodes){if(n.parentElement.closest(GLSKIP))continue;const t=n.nodeValue;GLRE.lastIndex=0;let m,last=0,frag=null;
    while((m=GLRE.exec(t))){const g=GL.find(x=>x.re.test(m[0]));if(!g||used.has(g.w))continue;used.add(g.w);frag=frag||document.createDocumentFragment();
      frag.append(t.slice(last,m.index));const b=document.createElement('button');b.type='button';b.className='term';b.dataset.term=g.w;b.textContent=m[0];b.setAttribute('aria-label',m[0]+', visa förklaring');frag.append(b);last=m.index+m[0].length;}
    if(frag){frag.append(t.slice(last));n.replaceWith(frag);}}}
let glQueued=false;
function scanTerms(){glQueued=false;document.querySelectorAll('.app :is('+GLSEL+'):not([data-gl])').forEach(el=>{if(!el.closest('#v-ordlista'))linkTerms(el);});}
new MutationObserver(()=>{if(!glQueued){glQueued=true;requestAnimationFrame(scanTerms);}}).observe(document.querySelector('.app'),{childList:true,subtree:true});
function closeTerm(){const p=$('termpop');if(!p.hidden){p.hidden=true;document.querySelectorAll('.term.on').forEach(t=>t.classList.remove('on'));}}
function openTerm(btn){const g=GL.find(x=>x.w===btn.dataset.term);if(!g)return;const p=$('termpop');document.querySelectorAll('.term.on').forEach(t=>t.classList.remove('on'));btn.classList.add('on');
  $('tp-word').textContent=g.w;$('tp-def').textContent=g.d;$('tp-say').innerHTML=sayBtn(g.w+'. '+g.d);p.hidden=false;
  const r=btn.getBoundingClientRect(),w=Math.min(320,innerWidth-24);p.style.width=w+'px';p.style.left=clamp(r.left+r.width/2-w/2,12,innerWidth-w-12)+'px';
  const h=p.offsetHeight;p.style.top=(r.bottom+10+h>innerHeight-8?Math.max(8,r.top-10-h):r.bottom+10)+'px';p.classList.remove('pop');void p.offsetWidth;p.classList.add('pop');SFX.click();
  if(!S.terms.includes(g.w)){S.terms.push(g.w);save();bump('terms');if(S.terms.length%5===0)addXP(5,btn);checkBadges();}}
document.addEventListener('click',e=>{const t=e.target.closest('.term');if(t){e.stopPropagation();e.preventDefault();openTerm(t);return;}
  if(!e.target.closest('#termpop'))closeTerm();},true);
$('tp-close').addEventListener('click',closeTerm);
addEventListener('keydown',e=>{if(e.key==='Escape')closeTerm();});
addEventListener('scroll',closeTerm,{passive:true});
addEventListener('hashchange',closeTerm);
