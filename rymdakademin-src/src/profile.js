/* ===================== Profil, nivåer och astronauten ===================== */
const LV={
 nyb:{name:'Nybörjare',ages:'ca 6–8 år',desc:'Korta texter, lätta frågor med tre svarsalternativ och mycket hjälp från astronauten.',facts:3,stats:2,opts:3,round:6,qlevel:'latt',gen:false,path:3,easyCards:true,talk:true},
 upp:{name:'Upptäckare',ages:'ca 9–12 år',desc:'Fler fakta, lätta frågor och lagom långa omgångar.',facts:5,stats:4,opts:4,round:8,qlevel:'latt',gen:'rev',path:4,talk:true},
 utf:{name:'Utforskare',ages:'ca 13–15 år',desc:'Alla fakta och en blandning av lätta och svåra frågor.',facts:7,stats:4,opts:4,round:10,qlevel:'mix',gen:true,path:4},
 exp:{name:'Expert',ages:'16 år och äldre',desc:'Allt innehåll, svåra frågor med siffror och årtal och fördjupningen öppen direkt.',facts:7,stats:4,opts:4,round:12,qlevel:'svar',gen:true,path:5,deepAuto:true}};
const LVK=['nyb','upp','utf','exp'];
const suggestLv=age=>age<=8?'nyb':age<=12?'upp':age<=15?'utf':'exp';
function LVc(){return LV[(S.profile&&S.profile.level)||'utf'];}
const pname=()=>(S.profile&&S.profile.name)||'rymdforskare';
const bname=()=>(S.profile&&S.profile.buddy)||'Nova';

/* ---------- Avatar ---------- */
const AV={suit:['#e9ecff','#ffb3c7','#a8f0d4','#ffd98a','#b9c6ff','#ff9f7a'],visor:['#262c78','#3b1f5c','#0f4a4a','#5a2a10','#1a1a1a'],glow:['#8ef0ff','#ffc94a','#ff7aa8','#5fe0b0','#ffffff'],
 acc:[['antenna','Antenn'],['star','Stjärna'],['flag','Svensk flagga'],['bow','Rosett'],['none','Inget']]};
const AVDEF={suit:'#e9ecff',visor:'#262c78',glow:'#8ef0ff',acc:'antenna'};
const avc=()=>Object.assign({},AVDEF,(S.profile&&S.profile.av)||{});
function shade(h,f){const c=hex(h).map(v=>Math.round(clamp(v*f,0,255)));return '#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');}
function astro(mood='happy',cls='',cfg){const a=cfg||avc(),s=a.suit,arm=shade(s,.9),g=a.glow;
  const mouth=mood==='sad'?'M35 44q5-4 10 0':mood==='wow'?'M38 42a2 2.4 0 1 0 4 0a2 2.4 0 1 0-4 0':'M34 41q6 6 12 0';
  const arms=mood==='wave'?`<rect x="8" y="40" width="12" height="20" rx="6" fill="${arm}" transform="rotate(-40 16 58)"/><rect x="58" y="58" width="12" height="18" rx="6" fill="${arm}" transform="rotate(25 64 60)"/>`
    :`<rect x="10" y="58" width="12" height="18" rx="6" fill="${arm}" transform="rotate(${mood==='sad'?10:-25} 16 60)"/><rect x="58" y="58" width="12" height="18" rx="6" fill="${arm}" transform="rotate(${mood==='sad'?-10:25} 64 60)"/>`;
  let acc='';
  if(a.acc==='antenna')acc=`<line x1="40" y1="10" x2="40" y2="3" stroke="${shade(s,.75)}" stroke-width="2.5"/><circle cx="40" cy="3" r="3.5" fill="${g}"/>`;
  if(a.acc==='star')acc=`<path d="M40-1l2.4 5 5.4.6-4 3.7 1.1 5.4L40 11l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" fill="#ffc94a"/>`;
  if(a.acc==='bow')acc=`<path d="M40 9 30 3v12zM40 9l10-6v12z" fill="#ff7aa8"/><circle cx="40" cy="9" r="3" fill="#ff4f8a"/>`;
  const chest=a.acc==='flag'?`<rect x="31" y="61" width="18" height="12" rx="2" fill="#006aa7"/><rect x="36" y="61" width="3.5" height="12" fill="#fecc00"/><rect x="31" y="65.3" width="18" height="3.4" fill="#fecc00"/>`
    :`<rect x="32" y="62" width="16" height="11" rx="3" fill="${g}" opacity=".85"/><circle cx="36" cy="67.5" r="1.8" fill="#fff"/><circle cx="44" cy="67.5" r="1.8" fill="${shade(g,.6)}"/>`;
  return `<svg class="nova astro ${cls}" viewBox="0 -4 80 94" aria-hidden="true">${acc}<rect x="20" y="54" width="40" height="32" rx="14" fill="${s}"/>${chest}${arms}
    <circle cx="40" cy="34" r="26" fill="${shade(s,1.05)}"/><circle cx="40" cy="34" r="26" fill="none" stroke="${shade(s,.8)}" stroke-width="2"/>
    <rect x="21" y="21" width="38" height="28" rx="14" fill="${a.visor}"/><ellipse cx="31" cy="28" rx="6" ry="3" fill="#fff" opacity=".45" transform="rotate(-20 31 28)"/>
    <circle cx="33" cy="35" r="2.8" fill="${g}"/><circle cx="47" cy="35" r="2.8" fill="${g}"/><path d="${mouth}" stroke="${g}" stroke-width="2.4" stroke-linecap="round" fill="${mood==='wow'?g:'none'}"/></svg>`;}

/* ---------- Profilformulär (används både i startguiden och på profilsidan) ---------- */
let draft=null;
function profileForm(where){const d=draft,sug=d.age?suggestLv(+d.age):null;
  const opt=(k,vals,lab)=>`<div class="avrow"><span>${lab}</span><div class="swatches">${vals.map(v=>`<button class="sw ${d.av[k]===v?'on':''}" style="background:${v}" data-av="${k}" data-v="${v}" aria-label="${lab} ${v}" aria-pressed="${d.av[k]===v}"></button>`).join('')}</div></div>`;
  return `<div class="pf">
   <div class="pf-sec"><h3>Om dig</h3>
    <div class="pf-grid"><label for="${where}-name">Vad heter du?<input id="${where}-name" data-f="name" value="${(d.name||'').replace(/"/g,'&quot;')}" maxlength="24" autocomplete="off" placeholder="Ditt förnamn"></label>
    <label for="${where}-age">Ålder<input id="${where}-age" data-f="age" type="number" inputmode="numeric" min="4" max="120" value="${d.age||''}" placeholder="Ålder"></label></div></div>
   <div class="pf-sec"><h3>Välj nivå</h3><p class="lead">Nivån styr hur mycket text du får och hur svåra frågorna blir. Du kan byta när du vill.</p>
    <div class="lvgrid">${LVK.map(k=>`<button class="lvcard ${d.level===k?'on':''}" data-lv="${k}" aria-pressed="${d.level===k}"><span class="lvbars">${[0,1,2,3].map(i=>`<i class="${i<=LVK.indexOf(k)?'f':''}"></i>`).join('')}</span><b>${LV[k].name}</b><small class="ages">${LV[k].ages}</small><small>${LV[k].desc}</small>${sug===k?'<span class="sugg">Passar din ålder</span>':''}</button>`).join('')}</div></div>
   <div class="pf-sec"><h3>Skapa din astronaut</h3><p class="lead">Astronauten följer med dig, peppar och förklarar när något är svårt.</p>
    <div class="avbuilder"><div class="avprev" id="${where}-prev">${astro('wave','big',d.av)}</div><div class="avopts">
     <label for="${where}-buddy">Astronautens namn<input id="${where}-buddy" data-f="buddy" value="${(d.buddy||'Nova').replace(/"/g,'&quot;')}" maxlength="16"></label>
     ${opt('suit',AV.suit,'Dräkt')}${opt('visor',AV.visor,'Visir')}${opt('glow',AV.glow,'Ögon och lampor')}
     <div class="avrow"><span>Pryl</span><div class="chips-row">${AV.acc.map(([v,l])=>`<button data-av="acc" data-v="${v}" aria-pressed="${d.av.acc===v}">${l}</button>`).join('')}</div></div></div></div></div></div>`;}
function startDraft(){const p=S.profile||{};draft={name:p.name||'',age:p.age||'',level:p.level||'',buddy:p.buddy||'Nova',av:Object.assign({},AVDEF,p.av||{})};}
function bindForm(root,where,onChange){
  root.addEventListener('input',e=>{const f=e.target.dataset.f;if(!f)return;draft[f]=e.target.value;
    if(f==='age'){const a=+e.target.value;if(a>=4&&(!draft.level||draft._auto)){draft.level=suggestLv(a);draft._auto=true;}refreshLv(root);}onChange&&onChange();});
  root.addEventListener('click',e=>{const l=e.target.closest('[data-lv]');if(l){draft.level=l.dataset.lv;draft._auto=false;SFX.click();refreshLv(root);onChange&&onChange();return;}
    const a=e.target.closest('[data-av]');if(a){draft.av[a.dataset.av]=a.dataset.v;SFX.click();
      root.querySelectorAll(`[data-av="${a.dataset.av}"]`).forEach(b=>{const on=b.dataset.v===a.dataset.v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
      root.querySelector(`#${where}-prev`).innerHTML=astro('wave','big',draft.av);onChange&&onChange();}});}
function refreshLv(root){const sug=draft.age?suggestLv(+draft.age):null;root.querySelectorAll('[data-lv]').forEach(b=>{const k=b.dataset.lv,on=draft.level===k;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);
  const s=b.querySelector('.sugg');if(sug===k&&!s)b.insertAdjacentHTML('beforeend','<span class="sugg">Passar din ålder</span>');if(sug!==k&&s)s.remove();});}
function commitDraft(){const old=S.profile&&S.profile.level;S.profile={name:(draft.name||'').trim(),age:+draft.age||null,level:draft.level||'utf',buddy:(draft.buddy||'Nova').trim()||'Nova',av:draft.av};
  if(old!==S.profile.level){QS.level=LVc().qlevel;}save();applyProfile();}
function applyProfile(){$('buddy').innerHTML=astro('happy');$('bp-name').textContent=bname();$('bp-ava').innerHTML=astro('happy');
  if(cur==='hem')renderHome();if(cur==='utforska')renderDetail();if(cur==='quiz'&&Q.stage==='setup')renderSetup();}

/* ---------- Startguide ---------- */
function openOnboarding(){startDraft();const o=$('onboard');o.hidden=false;
  o.innerHTML=`<div class="ob-card" role="dialog" aria-modal="true" aria-labelledby="ob-title"><div class="ob-head">${astro('wave','ob-ava',draft.av)}<div><h2 id="ob-title">Välkommen till Rymdakademin!</h2><p class="lead">Jag är din astronaut. Berätta lite om dig så anpassar jag allt efter dig.</p></div></div>
    ${profileForm('ob')}<div class="ob-foot"><button class="ghost" id="ob-skip">Hoppa över</button><button class="primary" id="ob-done">Klar, nu kör vi!</button></div></div>`;
  bindForm(o,'ob',()=>{o.querySelector('.ob-ava').outerHTML=astro('wave','ob-ava',draft.av);});
  $('ob-done').onclick=()=>{if(!draft.level)draft.level=draft.age?suggestLv(+draft.age):'upp';commitDraft();o.hidden=true;o.innerHTML='';SFX.badge();
    buddySay(`Hej ${pname()}! Jag heter ${bname()}. Tryck på mig nere i hörnet om du vill ha hjälp. Nu kör vi!`,'wave',6000);};
  $('ob-skip').onclick=()=>{S.profile={name:'',age:null,level:'upp',buddy:'Nova',av:Object.assign({},AVDEF)};save();applyProfile();o.hidden=true;o.innerHTML='';};}

/* ---------- Profilsida ---------- */
function renderProfile(){startDraft();const box=$('profile-form');box.innerHTML=profileForm('pf')+`<div class="row" style="justify-content:flex-start"><button class="primary" id="pf-save">Spara profilen</button><span class="lead" id="pf-msg"></span></div>`;
  if(!box.dataset.bound){box.dataset.bound=1;bindForm(box,'pf',()=>{$('pf-msg').textContent='Ändringar som inte är sparade';});
    box.addEventListener('click',e=>{if(e.target.closest('#pf-save')){commitDraft();$('pf-msg').textContent='Sparat!';SFX.right();buddySay(`Snyggt, ${pname()}! Nu är allt anpassat för nivån ${LVc().name}.`,'happy');}});}}

/* ---------- Hjälparen ---------- */
const CATN={planet:'en planet',mane:'en måne',stjarna:'en stjärna',dverg:'en dvärgplanet eller asteroid',komet:'en komet',djup:'något som finns långt ute i rymden'};
const PEPS=['Du är grym, {n}!','Varje fråga gör din hjärna lite starkare, {n}!','Riktiga astronauter tränar massor. Fortsätt så!','Fel svar är också bra, för då lär du dig något nytt.','Jag tror på dig, {n}! Ett steg i taget.','Du har redan {xp} XP. Snyggt jobbat!','Nyfikenhet är en superkraft, {n}!','Ta en paus om du behöver. Rymden springer inte iväg!'];
const pep=()=>PEPS[Math.floor(Math.random()*PEPS.length)].replace('{n}',pname()).replace('{xp}',S.xp);
const VHELP={
 hem:'Här på Hem ser du hur det går för dig. Tryck på den gula knappen för att fortsätta lärvägen, eller välj något i menyn längst ner.',
 larvag:'Lärvägen är som en bana i ett spel. Tryck på bilderna i steget och läs om dem. När du läst allt kan du göra testet. Klarar du det öppnas nästa steg.',
 ova:'Quiz testar vad du kan. Minneskort hjälper dig att komma ihåg. Börja med det som känns roligast!',
 mer:'Här finns allt annat: förklaringar, stjärnkartan, din profil och dina märken.',
 kort:'Läs frågan och försök svara i huvudet först. Tryck sedan på kortet för att se svaret. Var ärlig när du väljer Kunde eller Öva mer, så hjälper korten dig bäst.',
 karta:'Det här är solsystemet sett uppifrån. Solen är i mitten och planeterna åker runt den. Dra i reglaget för att spola tiden framåt.',
 skala:'Här ser du hur stora planeterna är jämfört med varandra. Under Avstånd kan du skicka en ljusstråle och se hur lång tid den tar.',
 forklaringar:'Titta på bilden medan den rör sig. Dra i reglaget om du vill stanna på en viss dag.',
 vag:'Skriv in hur mycket du väger. Då ser du hur tung du skulle vara på andra himlakroppar. Ju svagare tyngdkraft, desto högre kan du hoppa!',
 stjarnbilder:'Tryck på stjärnan med den gula ringen. Då dras ett streck. Fortsätt tills hela stjärnbilden är klar.',
 stjarnkarta:'Mitten av kartan är rakt ovanför dig och kanten är horisonten. Håll kartan över huvudet så stämmer väderstrecken. Tryck på en stjärna för att se vad den heter.',
 tidslinje:'Här ser du rymdresornas historia, från den första satelliten till idag. Tryck på Fördjupad fakta för att läsa mer.',
 ordlista:'Här står svåra ord förklarade. Skriv i sökrutan för att hitta ett ord snabbt.',
 marken:'Märken får du när du klarar olika saker. De gråa har du inte fått än. Läs vad som krävs under varje märke.',
 rymd3d:'Dra med fingret för att snurra runt och nyp för att zooma. Tryck på ett namn för att flyga dit. Prova Guidad tur så visar jag dig runt!',
 profil:'Här ändrar du ditt namn, din nivå och hur jag ser ut. Glöm inte att trycka på Spara!'};
function bodyExplain(k){const p=B[k],c=catOf(k);return `${p.name} är ${CATN[c]}. ${p.tag} Det viktigaste att komma ihåg är det här: ${p.facts[0]} Ord med prickar under kan du trycka på för att få dem förklarade.`;}
function helpCtx(){
  if(cur==='quiz'&&Q.stage!=='setup'&&Q.i<Q.list.length){const c=Q.list[Q.i],answered=!!document.querySelector('#quiz .opt[disabled]');
    if(answered)return{explain:`Svaret är ${c.a}. ${c.ex} Det gör inget om du svarade fel. Nu vet du det!`,tip:'Läs förklaringen och tryck sedan på Nästa fråga.'};
    return{explain:`Frågan handlar om ${B[c.k].name}. ${B[c.k].tag} Läs frågan lugnt och tänk på vad du har läst.`,tip:'Uteslut först de svar som verkar konstiga. Då blir det lättare att välja.',hint:true};}
  if(cur==='quiz')return{explain:'Välj ett ämne och en nivå och tryck på Starta. Du får nya frågor varje gång.',tip:'Börja med Lätt om du är osäker. Du kan alltid byta!'};
  if(cur==='utforska')return{explain:bodyExplain(sel),tip:'Tryck på Läs upp om du vill lyssna i stället för att läsa. När du har läst allt, tryck på den gula knappen för att få XP.'};
  if(cur==='larvag'&&PT.id&&PT.i<PT.list.length){const c=PT.list[PT.i];return{explain:`Frågan handlar om ${B[c.k].name}. ${B[c.k].tag}`,tip:'Tänk tillbaka på det du läste i steget. Du klarar det!'};}
  return{explain:VHELP[cur]||'Välj något i menyn längst ner för att komma igång.',tip:pep()};}
let bpText='';
function bpShow(text,mood='happy'){bpText=text;$('bp-text').innerHTML=`<p>${text}</p>${sayBtn(text)}`;$('bp-ava').innerHTML=astro(mood);}
function bpActions(){const h=helpCtx();
  $('bp-actions').innerHTML=`<button data-bp="explain">Jag förstår inte</button><button data-bp="tip">Ge mig ett tips</button>${h.hint?'<button data-bp="hint">Ta bort ett fel svar</button>':''}<button data-bp="pep">Peppa mig!</button>`;}
function openBuddy(){const p=$('buddy-panel');p.hidden=false;$('buddy').setAttribute('aria-expanded','true');$('buddy-say').hidden=true;
  bpShow(`Hej ${pname()}! Vad kan jag hjälpa dig med?`,'wave');bpActions();SFX.click();
  if(LVc().talk&&cur==='utforska'){} }
function closeBuddy(){$('buddy-panel').hidden=true;$('buddy').setAttribute('aria-expanded','false');}
$('buddy').addEventListener('click',e=>{e.stopPropagation();$('buddy-panel').hidden?openBuddy():closeBuddy();});
$('bp-close').addEventListener('click',closeBuddy);
$('bp-actions').addEventListener('click',e=>{const b=e.target.closest('[data-bp]');if(!b)return;const h=helpCtx(),k=b.dataset.bp;SFX.click();
  if(k==='explain')bpShow(h.explain,'happy');if(k==='tip')bpShow(h.tip,'wow');if(k==='pep')bpShow(pep(),'wave');
  if(k==='hint'){const c=Q.list[Q.i],wrong=[...document.querySelectorAll('#quiz .opt:not([disabled])')].filter(o=>decodeURIComponent(o.dataset.o)!==c.a);
    if(wrong.length>1){const w=wrong[Math.floor(Math.random()*wrong.length)];w.disabled=true;w.classList.add('struck');bpShow(`Jag tog bort ${decodeURIComponent(w.dataset.o)}. Det är inte rätt svar. Nu är det lite lättare!`,'wow');}
    else bpShow('Nu finns det bara två svar kvar. Det här klarar du själv!','happy');}
  bpActions();});
document.addEventListener('click',e=>{if($('buddy-panel').hidden)return;const p=e.composedPath();if(!p.some(el=>el&&(el.id==='buddy-panel'||el.id==='buddy')))closeBuddy();});
let sayT;
function buddySay(text,mood='happy',ms=4200){if(!$('buddy-panel').hidden)return;const s=$('buddy-say');s.innerHTML=`<p>${text}</p>`;s.hidden=false;s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');
  $('buddy').innerHTML=astro(mood);clearTimeout(sayT);sayT=setTimeout(()=>{s.hidden=true;$('buddy').innerHTML=astro('happy');},ms);}
$('buddy-say').addEventListener('click',()=>{$('buddy-say').hidden=true;openBuddy();});
/* Automatisk pepp vid händelser */
let qStreak=0;
function buddyOnAnswer(ok,c){if(ok){qStreak++;if(qStreak%3===0)buddySay(`${qStreak} rätt i rad, ${pname()}! ${['Du är på gång!','Grymt!','Raketfart!'][qStreak/3%3|0]}`,'wow');}
  else{qStreak=0;if(LVc().talk)buddySay(`Ingen fara, ${pname()}! ${c.ex}`,'happy',5500);}}
function buddyGreet(){const k=dayKey(new Date());if(S.greeted===k||!S.profile)return;S.greeted=k;save();
  setTimeout(()=>buddySay(`Hej ${pname()}! ${S.daily&&!S.daily.done?'Dagens uppdrag väntar på dig.':'Kul att se dig igen!'}`,'wave',5000),1200);}
