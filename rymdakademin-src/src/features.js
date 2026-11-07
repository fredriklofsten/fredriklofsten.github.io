/* ===================== Lärväg ===================== */
const PATH=[
 ['sol','Solen, vår stjärna',['sun']],['jord','Jorden och månen',['earth','moon']],['inre','De inre planeterna',['mercury','venus','mars']],
 ['gas','Gasjättarna',['jupiter','saturn']],['is','Isjättarna',['uranus','neptune']],['manar','Spännande månar',['io','europa','ganymede','titan']],
 ['sma','Dvärgplaneter och asteroider',['ceres','vesta','bennu','pluto']],['kometer','Kometer',['halley','halebopp','c67p','sl9']],
 ['stjarnor','Stjärnor',['sirius','polaris','betelgeuse']],['djup','Galaxer och djuprymden',['milkyway','andromeda','orion','crab','blackhole']],
 ['rymdfart','Rymdfart och exoplaneter',['rocket','iss','astronaut','exoplanet']],
 ['karta','Läs stjärnkartan',[]]];
const PT={id:null,list:[],i:0,score:0,ans:null};
const stepDone=id=>!!S.path[id];
function stepOpen(i){return i===0||stepDone(PATH[i-1][0]);}
function renderPath(){const box=$('path');const cur=PATH.findIndex(p=>!stepDone(p[0]));
  $('path-lead').textContent=cur<0?'Du har gått hela lärvägen. Grymt jobbat!':`Steg ${cur+1} av ${PATH.length}. Läs om allt i steget och gör sedan testet.`;
  box.innerHTML=PATH.map(([id,title,ks],i)=>{const done=stepDone(id),open=stepOpen(i),here=i===cur,read=ks.filter(k=>S.learned.includes(k)).length,ready=ks.length?read===ks.length:true;
    const st=done?'done':open?'open':'locked';
    let body='';
    if(open&&!done){
      if(id==='karta')body=`<p>Gå igenom lektionen i fliken Stjärnkartan och klara lärkollen där.</p><button class="primary" data-goview="stjarnkarta">Öppna stjärnkartan</button>`;
      else if(PT.id===id)body=renderPathTest();
      else body=`<p class="lead">Läst ${read} av ${ks.length}. Tryck på en himlakropp för att läsa om den.</p><button class="primary" data-ptest="${id}" ${ready?'':'disabled'}>${ready?'Gör testet · '+LVc().path+' frågor':'Läs allt först'}</button>`;}
    return `<li class="pstep ${st} ${here?'here':''}"><div class="pnode">${done?'✓':i+1}</div><div class="pcard"><div class="title-row"><h3>${title}</h3>${done?'<span class="got">Klart</span>':!open?'<span class="lock">Låst</span>':''}</div>
      ${ks.length?`<div class="pbodies">${ks.map(k=>`<button class="pbody ${S.learned.includes(k)?'read':''}" data-go="${k}" ${open?'':'disabled'}>${art(k)}<span>${B[k].short||B[k].name}</span></button>`).join('')}</div>`:''}${body}</div></li>`;}).join('');}
function startPathTest(id){const ks=PATH.find(p=>p[0]===id)[2],pool=ITEMS.filter(it=>ks.includes(it.k));
  PT.id=id;const hw=pool.filter(i=>!i.gen);PT.list=freshFirst(shuffle(hw.filter(i=>!i.hard)).concat(shuffle(hw.filter(i=>i.hard))).concat(shuffle(pool.filter(i=>i.gen))),LVc().path).map(it=>({...it,opts:shuffle([it.a,...it.w])}));PT.i=0;PT.score=0;PT.ans=null;renderPath();}
function renderPathTest(){if(PT.i>=PT.list.length){const need=Math.ceil(PT.list.length*.6),ok=PT.score>=need;
    return `<div class="ptest pop"><b>${PT.score} av ${PT.list.length} rätt</b><p>${ok?'Godkänt! Nästa steg är upplåst.':'Du behöver '+need+' rätt. Läs lite till och försök igen.'}</p><button class="primary" data-pfinish="${ok?1:0}">${ok?'Fortsätt':'Försök igen'}</button></div>`;}
  const c=PT.list[PT.i],fb=PT.ans;
  return `<div class="ptest"><div class="q-head"><span>Fråga ${PT.i+1} av ${PT.list.length}</span><span>${PT.score} rätt</span></div><div class="title-row" style="margin:6px 0 10px"><h3 style="font-size:1.1rem">${c.q}</h3>${sayBtn(c.q+' '+c.opts.join(', '))}</div>
    <div class="opts">${c.opts.map(o=>{let cl='';if(fb){if(o===c.a)cl='right';else if(o===fb)cl='wrong';}return `<button class="opt ${cl}" data-pans="${encodeURIComponent(o)}" ${fb?'disabled':''}>${o}</button>`;}).join('')}</div>
    ${fb?`<p style="margin-top:8px">${fb===c.a?'<b style="color:var(--mint)">Rätt!</b>':'<b style="color:var(--bad)">Svaret är: '+c.a+'</b>'} ${c.ex}</p><button class="primary" data-pnext style="margin-top:8px;width:100%">${PT.i+1<PT.list.length?'Nästa fråga':'Se resultat'}</button>`:''}</div>`;}
$('path').addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g&&!g.disabled){SFX.click();select(g.dataset.go);return;}
  const v=e.target.closest('[data-goview]');if(v){try{location.hash=v.dataset.goview;}catch(_){}show(v.dataset.goview);return;}
  const t=e.target.closest('[data-ptest]');if(t&&!t.disabled){SFX.click();startPathTest(t.dataset.ptest);return;}
  const a=e.target.closest('[data-pans]');if(a&&!a.disabled){const p=decodeURIComponent(a.dataset.pans),c=PT.list[PT.i];PT.ans=p;if(p===c.a){PT.score++;SFX.right();noteHit(c.id);}else{SFX.wrong();noteMiss(c.id);}renderPath();return;}
  if(e.target.closest('[data-pnext]')){PT.i++;PT.ans=null;renderPath();return;}
  const f=e.target.closest('[data-pfinish]');if(f){const ok=f.dataset.pfinish==='1',id=PT.id;PT.id=null;
    if(ok&&!S.path[id]){S.path[id]=true;save();SFX.badge();addXP(20,f);toast('Steget är klart!');buddySay(`Snyggt, ${pname()}! Nästa steg är upplåst.`,'wow');}else if(!ok)buddySay(`Det gör inget, ${pname()}. Läs igen och försök en gång till, du får nya frågor.`,'happy',5000);renderPath();}});
function checkPathKarta(){if(S.skyQuiz&&stepOpen(PATH.length-1)&&!S.path.karta){S.path.karta=true;save();checkBadges();}}

/* ===================== Missade frågor ===================== */
function statNote(id,ok){const it=ITEMS.find(x=>x.id===id);if(!it)return;const c=catOf(it.k),s=S.stats[c]=S.stats[c]||{a:0,c:0};s.a++;if(ok)s.c++;}
function noteMiss(id){statNote(id,false);if(!S.missed.includes(id))S.missed.push(id);save();}
function noteHit(id){statNote(id,true);const i=S.missed.indexOf(id);if(i>=0)S.missed.splice(i,1);save();}

/* ===================== Dagens uppdrag ===================== */
const DAILY=[['learned',2,'Utforska 2 nya himlakroppar'],['quiz',5,'Svara rätt på 5 quizfrågor'],['cards',5,'Klara 5 minneskort'],['terms',3,'Slå upp 3 svåra ord'],['deep',2,'Läs 2 fördjupningar']];
const dayKey=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function ensureDay(){const k=dayKey(new Date());if(S.daily&&S.daily.date===k)return;
  const avail=DAILY.filter(([id])=>id==='learned'?S.learned.length<ORDER.length:id==='deep'?ORDER.some(o=>!S.deep.includes(o)):id==='terms'?S.terms.length<GLOSSARY.length-10:true);
  const r=seeded([...k].reduce((a,c)=>a*31+c.charCodeAt(0),7)%2147483646+1);const pick=avail.map(t=>[r(),t]).sort((a,b)=>a[0]-b[0]).slice(0,3).map(x=>x[1][0]);
  S.daily={date:k,c:{},tasks:pick,done:false};save();}
function bump(kind,n=1){ensureDay();const d=S.daily;if(!d.tasks.includes(kind)||d.done)return;d.c[kind]=(d.c[kind]||0)+n;
  if(d.tasks.every(t=>(d.c[t]||0)>=DAILY.find(x=>x[0]===t)[1])){d.done=true;const y=new Date();y.setDate(y.getDate()-1);
    S.streak=S.lastDay===dayKey(y)?(S.streak||0)+1:1;S.lastDay=d.date;S.bestStreak=Math.max(S.bestStreak||0,S.streak);save();SFX.badge();toast('Dagens uppdrag klart! '+S.streak+' '+(S.streak===1?'dag':'dagar')+' i rad.');addXP(25,$('mission'));}
  else save();renderMission();}
function renderMission(){ensureDay();const d=S.daily,y=new Date();y.setDate(y.getDate()-1);const alive=S.lastDay===d.date||S.lastDay===dayKey(y),st=alive?(S.streak||0):0;
  $('mission').innerHTML=`<div class="mhead"><div><small>Dagens uppdrag</small><h3>${d.done?'Klart för idag!':'Klara alla tre för 25 XP'}</h3></div>
    <div class="streak" title="Dagar i rad"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 0 3 2 4 3 4 0-3-1-6 0-9z" fill="${st?'#ff9a3c':'#4a5090'}"/></svg><b>${st}</b><span>${st===1?'dag':'dagar'} i rad</span></div></div>
    <ul class="mlist">${d.tasks.map(t=>{const [,goal,label]=DAILY.find(x=>x[0]===t),v=Math.min(goal,d.c[t]||0);return `<li class="${v>=goal?'ok':''}"><span class="tick">${v>=goal?'✓':''}</span><div><span>${label}</span><div class="mbar"><i style="width:${v/goal*100}%"></i></div></div><b>${v}/${goal}</b></li>`;}).join('')}</ul>`;}

/* ===================== Förklaringar ===================== */
const EX={moonDay:7,playing:!reduce,doy:172,running:false,last:null};
function drawPhase(c,x,y,r,frac,wax){c.fillStyle='#2a2f55';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.save();c.beginPath();c.arc(x,y,r,0,TAU);c.clip();c.fillStyle='#f4f2e8';
  const k=1-2*frac,side=wax?1:-1;c.beginPath();c.arc(x,y,r,-PI/2,PI/2,side<0);c.ellipse(x,y,Math.abs(k)*r,r,0,PI/2,-PI/2,(k>0)===(side>0));c.fill();c.restore();}
function phaseName(e){const d=e/TAU*29.53;if(d<1||d>28.5)return'Nymåne';if(d<6.4)return'Växande skära';if(d<8.4)return'Första kvarteret (halvmåne)';if(d<13.8)return'Växande, nästan full';if(d<15.8)return'Fullmåne';if(d<21.1)return'Avtagande, nästan full';if(d<23.1)return'Sista kvarteret (halvmåne)';return'Avtagande skära';}
function drawMoonEx(){const cv=$('ex-moon'),W=Math.round(cv.clientWidth*DPR);if(!W)return;const H=Math.round(cv.clientHeight*DPR);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  const c=cv.getContext('2d'),u=W/100;c.clearRect(0,0,W,H);
  c.strokeStyle='rgba(255,201,74,.35)';c.lineWidth=u*.4;for(let i=0;i<5;i++){const y=H*(.15+i*.17);c.beginPath();c.moveTo(u*2,y);c.lineTo(u*14,y);c.lineTo(u*12.5,y-u);c.moveTo(u*14,y);c.lineTo(u*12.5,y+u);c.stroke();}
  c.fillStyle='#ffc94a';c.font=`800 ${Math.max(u*2.6,12.0*DPR)}px Nunito,sans-serif`;c.textAlign='left';c.fillText('Solljus',u*2,H*.08);
  const ex=u*38,ey=H/2,R=H*.36,e=EX.moonDay/29.53*TAU,ang=PI+e,mx=ex+R*Math.cos(ang),my=ey-R*Math.sin(ang);
  c.strokeStyle='rgba(255,255,255,.18)';c.setLineDash([u,u]);c.beginPath();c.arc(ex,ey,R,0,TAU);c.stroke();c.setLineDash([]);
  const g=c.createLinearGradient(ex-u*6,0,ex+u*6,0);g.addColorStop(0,'#5fb0ff');g.addColorStop(.5,'#2a6fd0');g.addColorStop(.51,'#0f2550');c.fillStyle=g;c.beginPath();c.arc(ex,ey,u*6,0,TAU);c.fill();
  c.fillStyle='#eef0ff';c.textAlign='center';c.fillText('Jorden',ex,ey+u*10);
  const mg=c.createLinearGradient(mx-u*3,0,mx+u*3,0);mg.addColorStop(0,'#f4f2e8');mg.addColorStop(.5,'#f4f2e8');mg.addColorStop(.51,'#2a2f55');c.fillStyle=mg;c.beginPath();c.arc(mx,my,u*3,0,TAU);c.fill();
  c.strokeStyle='rgba(255,122,168,.6)';c.setLineDash([u*.8,u*.8]);c.beginPath();c.moveTo(ex,ey);c.lineTo(mx,my);c.stroke();c.setLineDash([]);
  c.fillStyle='#a6acdf';c.font=`700 ${Math.max(u*2.3,10.6*DPR)}px Nunito,sans-serif`;c.fillText('Uppifrån',ex,H*.08);
  const ix=u*82,iy=H*.46;c.fillStyle='rgba(10,13,43,.7)';c.beginPath();c.roundRect(u*66,H*.1,u*32,H*.8,u*3);c.fill();
  const frac=(1-Math.cos(e))/2;drawPhase(c,ix,iy,u*11,frac,e<PI);
  c.fillStyle='#eef0ff';c.font=`800 ${Math.max(u*2.4,11.0*DPR)}px Nunito,sans-serif`;c.fillText('Så ser vi den',ix,H*.18);c.fillStyle='#a6acdf';c.font=`700 ${Math.max(u*2.2,10.1*DPR)}px Nunito,sans-serif`;c.fillText('från Sverige',ix,H*.82);
  $('ex-moon-read').innerHTML=`<span>Dag <b>${nf(EX.moonDay,0)}</b> av 29,5</span><span><b>${phaseName(e)}</b></span><span><b>${nf(frac*100,0)} %</b> belyst</span>`;}
function sunDecl(doy){return 23.44*Math.sin(TAU*(doy-80)/365);}
function dayLen(lat,dec){const ch=(Math.sin(-.83*D2R)-Math.sin(lat*D2R)*Math.sin(dec*D2R))/(Math.cos(lat*D2R)*Math.cos(dec*D2R));if(ch<-1)return 24;if(ch>1)return 0;return 2*Math.acos(ch)/D2R/15;}
const fmtH=h=>h>=24?'midnattssol, solen går inte ner':h<=0?'polarnatt, solen går inte upp':Math.floor(h)+' h '+Math.round(h%1*60)+' min';
function drawSeasonEx(){const cv=$('ex-season'),W=Math.round(cv.clientWidth*DPR);if(!W)return;const H=Math.round(cv.clientHeight*DPR);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  const c=cv.getContext('2d'),u=W/100,cx=W*.4,cy=H*.48,rx=W*.29,ry=H*.27;c.clearRect(0,0,W,H);
  c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=u*.3;c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,TAU);c.stroke();
  const sg=c.createRadialGradient(cx,cy,0,cx,cy,u*9);sg.addColorStop(0,'#fff6c8');sg.addColorStop(.4,'#ffc94a');sg.addColorStop(1,'rgba(255,170,40,0)');c.fillStyle=sg;c.beginPath();c.arc(cx,cy,u*9,0,TAU);c.fill();
  c.font=`800 ${Math.max(u*2.4,11.0*DPR)}px Nunito,sans-serif`;c.textAlign='center';
  [['Juni',PI],['September',PI*1.5],['December',0],['Mars',PI/2]].forEach(([t,a])=>{c.fillStyle='rgba(166,172,223,.8)';c.fillText(t,cx+(rx+u*6)*Math.cos(a),cy-(ry+u*4)*Math.sin(a)+u);});
  const a=PI+TAU*(EX.doy-172)/365,x=cx+rx*Math.cos(a),y=cy-ry*Math.sin(a),r=u*5.5,dx=cx-x,dy=cy-y,dl=Math.hypot(dx,dy)||1;
  const g=c.createLinearGradient(x+dx/dl*r,y+dy/dl*r,x-dx/dl*r,y-dy/dl*r);g.addColorStop(0,'#5fb0ff');g.addColorStop(.5,'#2a6fd0');g.addColorStop(.52,'#0f2550');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  const t=23.44*D2R,ax=Math.sin(t)*r*1.7,ay=Math.cos(t)*r*1.7;c.strokeStyle='#ff7aa8';c.lineWidth=u*.5;c.beginPath();c.moveTo(x-ax,y+ay);c.lineTo(x+ax,y-ay);c.stroke();
  c.fillStyle='#ff7aa8';c.fillText('N',x+ax*1.2,y-ay*1.2);
  const dec=sunDecl(EX.doy),h=90-59.33+dec,hx=W*.86,hy=H*.86,hr=W*.11;
  c.fillStyle='rgba(10,13,43,.7)';c.beginPath();c.roundRect(W*.72,H*.5,W*.27,H*.46,u*2);c.fill();
  c.strokeStyle='#5fe0b0';c.lineWidth=u*.4;c.beginPath();c.moveTo(hx-hr,hy);c.lineTo(hx+hr,hy);c.stroke();
  c.strokeStyle='rgba(255,255,255,.2)';c.beginPath();c.arc(hx,hy,hr*.85,PI,TAU);c.stroke();
  const sx=hx-hr*.85*Math.cos(h*D2R),sy=hy-hr*.85*Math.sin(h*D2R);c.strokeStyle='rgba(255,201,74,.6)';c.setLineDash([u*.6,u*.6]);c.beginPath();c.moveTo(hx,hy);c.lineTo(sx,sy);c.stroke();c.setLineDash([]);
  c.fillStyle='#ffc94a';c.beginPath();c.arc(sx,sy,u*1.6,0,TAU);c.fill();c.fillStyle='#eef0ff';c.font=`800 ${Math.max(u*2.1,9.7*DPR)}px Nunito,sans-serif`;c.fillText('Solen kl. 12',hx,H*.57);c.fillText(nf(h,0)+'° högt',hx,H*.93);
  const d=new Date(new Date().getFullYear(),0,1);d.setDate(1+EX.doy);
  $('ex-season-read').innerHTML=`<span>Datum: <b>${d.toLocaleDateString('sv-SE',{day:'numeric',month:'long'})}</b></span><span>Dagens längd i Stockholm: <b>${fmtH(dayLen(59.33,dec))}</b></span><span>I Kiruna: <b>${fmtH(dayLen(67.86,dec))}</b></span><span>Norra halvklotet lutar <b>${dec>2?'mot solen: sommarhalvåret':dec<-2?'bort från solen: vinterhalvåret':'åt sidan: vår- eller höstdagjämning'}</b></span>`;}
function startExplain(){if(EX.running)return;EX.running=true;EX.last=null;requestAnimationFrame(exFrame);}
function exFrame(now){if(cur!=='forklaringar'){EX.running=false;return;}if(EX.playing&&EX.last!==null){EX.moonDay=(EX.moonDay+(now-EX.last)/1000*1.6)%29.53;$('ex-moon-day').value=EX.moonDay;}EX.last=now;drawMoonEx();drawSeasonEx();requestAnimationFrame(exFrame);}
$('ex-moon-day').addEventListener('input',e=>{EX.moonDay=+e.target.value;EX.playing=false;$('ex-moon-play').textContent='Spela';drawMoonEx();});
$('ex-moon-play').addEventListener('click',()=>{EX.playing=!EX.playing;$('ex-moon-play').textContent=EX.playing?'Pausa':'Spela';SFX.click();});
$('ex-season-day').addEventListener('input',e=>{EX.doy=+e.target.value;drawSeasonEx();});
document.querySelectorAll('[data-season]').forEach(b=>b.addEventListener('click',()=>{EX.doy=+b.dataset.season;$('ex-season-day').value=EX.doy;SFX.click();drawSeasonEx();}));

document.querySelectorAll('[data-say-ex]').forEach(s=>{s.innerHTML=sayBtn($('ex-'+s.dataset.sayEx+'-text').textContent);});
