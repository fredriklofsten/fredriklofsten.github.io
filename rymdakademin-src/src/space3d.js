const LOW3D=(navigator.hardwareConcurrency||4)<=4||(navigator.deviceMemory||4)<=3;
/* ===================== 3D-rymdresa ===================== */
const S3={ready:false,loading:null,mode:'sol',days:0,speed:1,focus:null,fly:null,tour:null,running:false,objs:{},groups:{},labels:[]};
const S3URL=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'];
function loadScript(u){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=u;s.onload=res;s.onerror=()=>rej(new Error(u));document.head.appendChild(s);});}
function load3D(){if(S3.loading)return S3.loading;S3.loading=loadScript(S3URL[0]).then(()=>loadScript(S3URL[1])).then(()=>S.lite?null:loadFX().catch(()=>null)).catch(e=>{S3.loading=null;throw e;});return S3.loading;}
const ROCKY=['mercury','moon','mars','ceres','pluto','io','europa','ganymede'];
const S3B=['sun','mercury','venus','earth','mars','ceres','jupiter','saturn','uranus','neptune','pluto','halley'];
const S3M=[['moon','earth',27.32,384400,4],['io','jupiter',1.77,421700,2.1],['europa','jupiter',3.55,671000,2.7],['ganymede','jupiter',7.15,1070400,3.5],['titan','saturn',15.95,1221870,4.4]];
const KMR={sun:696340,mercury:2440,venus:6052,earth:6371,moon:1737,mars:3390,ceres:470,jupiter:69911,io:1822,europa:1561,ganymede:2634,saturn:58232,titan:2575,uranus:25362,neptune:24622,pluto:1188,halley:8};
const NEAR=[['sun','Solen',0,0,0],['alphacen','Alfa Centauri',14.66,-60.8,4.37],['barnard','Barnards stjärna',17.96,4.7,5.96],['wolf359','Wolf 359',10.94,7.0,7.9],['sirius','Sirius',6.75,-16.7,8.6],
 ['epseri','Epsilon Eridani',3.55,-9.46,10.5],['procyon','Procyon',7.66,5.2,11.5],['tauceti','Tau Ceti',1.73,-15.9,11.9],['altair','Altair',19.85,8.9,16.7],['vega','Vega',18.62,38.8,25],
 ['fomalhaut','Fomalhaut',22.96,-29.6,25],['pollux','Pollux',7.76,28.0,33.8],['arcturus','Arcturus',14.26,19.2,36.7],['capella','Capella',5.28,46.0,42.9]];
const AUKM=149597870;
/* position (AU, ekliptiska x,y,z) för en kropp ett visst antal dygn efter idag */
function helioAU(k,dd){const date=new Date(Date.now()+dd*864e5);
  if(PEL[k]){const T=(date.getTime()-Date.UTC(2000,0,1,12))/(864e5*36525);return helio(k,T);}
  const {r,ang}=bodyPos(k,(date.getTime()-J2000)/864e5);return[r*Math.cos(ang),r*Math.sin(ang),0];}
const vR=k=>k==='sun'?9:k==='halley'?.35:Math.max(.35,1.25*Math.pow(KMR[k]/6371,.45));
function toV(p,real){if(real)return new THREE.Vector3(p[0]*AUKM/1000,p[2]*AUKM/1000,-p[1]*AUKM/1000);const r=Math.hypot(p[0],p[1],p[2])||1,f=(26+56*Math.sqrt(r))/r;return new THREE.Vector3(p[0]*f,p[2]*f,-p[1]*f);}
function texFor(k,TW=512){const t=getTex(k,TW),cv=document.createElement('canvas');cv.width=t.w;cv.height=t.h;const c=cv.getContext('2d'),img=c.createImageData(t.w,t.h);
  for(let i=0;i<t.w*t.h;i++){img.data[i*4]=t.d[i*3];img.data[i*4+1]=t.d[i*3+1];img.data[i*4+2]=t.d[i*3+2];img.data[i*4+3]=255;}c.putImageData(img,0,0);
  const tx=new THREE.CanvasTexture(cv);tx.wrapS=THREE.RepeatWrapping;return tx;}
function glowTex(col){const cv=document.createElement('canvas');cv.width=cv.height=128;const c=cv.getContext('2d'),g=c.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,col.replace(')',',1)').replace('rgb','rgba'));g.addColorStop(.25,col.replace(')',',.5)').replace('rgb','rgba'));g.addColorStop(1,col.replace(')',',0)').replace('rgb','rgba'));c.fillStyle=g;c.fillRect(0,0,128,128);return new THREE.CanvasTexture(cv);}
function ringTex(){const cv=document.createElement('canvas');cv.width=256;cv.height=4;const c=cv.getContext('2d');
  for(let x=0;x<256;x++){const r=1.22+x/255*(2.31-1.22);let a=0,col='230,210,160';for(const b of R3.saturn.rings)if(r>=b[0]&&r<=b[1]){a=b[3]*(.75+.25*Math.sin(x*.9));col=hex(b[2]).join(',');}c.fillStyle=`rgba(${col},${a})`;c.fillRect(x,0,1,4);}
  return new THREE.CanvasTexture(cv);}
function ringMesh(R,tilt){const g=new THREE.RingGeometry(R*1.22,R*2.31,128,1),pos=g.attributes.position,uv=g.attributes.uv,v=new THREE.Vector3();
  for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i);uv.setXY(i,(v.length()-R*1.22)/(R*1.09),.5);}
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:ringTex(),color:0xd8d2c4,side:THREE.DoubleSide,transparent:true,depthWrite:false}));m.rotation.x=-PI/2;return m;}
async function buildBodies(real){const G=S3.groups[real?'real':'sol'];if(S3.built[real?'real':'sol'])return;S3.built[real?'real':'sol']=true;
    let bi=0;for(const k of S3B){bi++;$('s3-msg').textContent=`Bygger ${B[k].name}… ${Math.round(100*bi/S3B.length)} %`;await new Promise(r=>requestAnimationFrame(r));
      const R=real?KMR[k]/1000:vR(k),key=(real?'r:':'v:')+k;let mesh;
      if(k==='halley'){mesh=new THREE.Mesh(new THREE.SphereGeometry(R,12,8),new THREE.MeshBasicMaterial({color:0x9aa0b0}));
        const tail=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('rgb(170,210,255)'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));tail.scale.set(R*30,R*30,1);mesh.add(tail);mesh.userData.tail=tail;}
      else{const tex=S3.tex&&S3.tex[k]||(S3.tex=S3.tex||{},S3.tex[k]=texFor(k,LOW3D?256:512));let mat;
        if(k==='sun'){tex.wrapT=THREE.RepeatWrapping;mat=sunMat(tex);}
        else if(k==='earth')mat=earthMat(tex,S3.night||(S3.night=nightTex(LOW3D?256:512)),S3.cloud||(S3.cloud=cloudTex(LOW3D?256:512)));
        else mat=new THREE.MeshPhongMaterial(ROCKY.includes(k)?{map:tex,bumpMap:tex,bumpScale:R*.02,shininess:1,specular:0x000000}:{map:tex,shininess:2,specular:0x000000});
        mesh=new THREE.Mesh(new THREE.SphereGeometry(R,LOW3D?40:64,LOW3D?24:40),mat);
        if(k==='sun'){[[5,'rgb(255,200,90)'],[14,'rgb(255,150,60)']].forEach(([f,c],i)=>{const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(c),transparent:true,opacity:i?.25:.6,depthWrite:false,blending:THREE.AdditiveBlending}));gl.scale.set(R*f,R*f,1);mesh.add(gl);});}
        const at=R3[k]&&R3[k].atm;if(at&&!S.lite)mesh.add(atmoShell(R,at.split(',').map(Number),k==='earth'?1.3:k==='jupiter'?.35:.8));}
      const pivot=new THREE.Group();pivot.add(mesh);pivot.rotation.z=(R3[k]&&R3[k].tilt)||0;if(k==='saturn')pivot.add(ringMesh(R));if(k==='uranus'){const rg=new THREE.Mesh(new THREE.RingGeometry(R*1.6,R*1.66,96),new THREE.MeshBasicMaterial({color:0xcfe8ea,side:THREE.DoubleSide,transparent:true,opacity:.5}));rg.rotation.x=-PI/2;pivot.add(rg);}
      G.add(pivot);S3.objs[key]={k,mesh,pivot,R,real};
      if(k!=='sun'){const per=k==='halley'?27510:(ORB[k]?ORB[k][1]:365),pts=[];for(let i=0;i<=240;i++)pts.push(toV(helioAU(k,per*i/240),real));
        const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:k==='halley'?0x6f9bd6:0x5a64b8,transparent:true,opacity:.5}));G.add(ln);}}
    for(const [k,p,per,km,f] of S3M){const R=real?KMR[k]/1000:Math.max(.22,vR(k)*.55),tex=S3.tex[k]||(S3.tex[k]=texFor(k,LOW3D?256:512));
      const mesh=new THREE.Mesh(new THREE.SphereGeometry(R,LOW3D?28:48,LOW3D?18:32),new THREE.MeshPhongMaterial({map:tex,bumpMap:tex,bumpScale:R*.02,shininess:1,specular:0x000000}));if(k==='titan'&&!S.lite)mesh.add(atmoShell(R,[255,180,90],.9));const pivot=new THREE.Group();pivot.add(mesh);G.add(pivot);
      S3.objs[(real?'r:':'v:')+k]={k,mesh,pivot,R,real,parent:p,per,dist:real?km/1000:vR(p)*f};}
  $('s3-msg').textContent='';}
async function build3D(){S3.built={};const box=$('s3-wrap'),cv=$('s3');S3.renderer=new THREE.WebGLRenderer({canvas:cv,antialias:!S.lite,logarithmicDepthBuffer:true});
  S3.renderer.setPixelRatio(S.lite?1:Math.min(2,devicePixelRatio));S3.scene=new THREE.Scene();S3.camera=new THREE.PerspectiveCamera(55,1,.01,5e7);
  S3.controls=new THREE.OrbitControls(S3.camera,cv);S3.controls.enableDamping=true;S3.controls.dampingFactor=.08;S3.controls.rotateSpeed=.6;
  S3.scene.add(new THREE.AmbientLight(0x1a1d33,.35));S3.light=new THREE.PointLight(0xfff4e6,1.25,0,0);S3.scene.add(S3.light);
  /* himmel: stjärnor på en stor sfär som följer kameran */
  const n=S.lite||LOW3D?1200:3500,sp=new Float32Array(n*3),sc=new Float32Array(n*3),r=seeded(42);
  for(let i=0;i<n;i++){const u=r()*2-1,t=r()*TAU,s=Math.sqrt(1-u*u);sp.set([s*Math.cos(t),u,s*Math.sin(t)],i*3);const w=.55+r()*.45;sc.set([w,w,w*(r()<.2?.8:1)],i*3);}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));sg.setAttribute('color',new THREE.BufferAttribute(sc,3));
  S3.sky=new THREE.Points(sg,new THREE.PointsMaterial({size:1.3,transparent:true,opacity:.75,sizeAttenuation:false,vertexColors:true,depthWrite:false}));S3.sky.renderOrder=-1;S3.scene.add(S3.sky);
  const mw=new Float32Array(2400*3);for(let i=0;i<2400;i++){const l=r()*TAU,b=(r()+r()+r()-1.5)*.12,[ra,de]=galToEq(l/D2R);const a=ra*15*D2R,d=de*D2R+b;mw.set([Math.cos(d)*Math.cos(a),Math.sin(d),Math.cos(d)*Math.sin(a)],i*3);}
  S3.mw=new THREE.Group();S3.mw.add(catalogStars());S3.mw.renderOrder=-2;S3.scene.add(S3.mw);
  /* grupper för varje läge */
  for(const m of ['sol','real','stars','galax']){S3.groups[m]=new THREE.Group();S3.scene.add(S3.groups[m]);}
  await buildBodies(S3.mode==='real');
  /* närmaste stjärnorna: 1 enhet = 1 ljusår */
  const SG=S3.groups.stars;NEAR.forEach(([id,name,ra,de,ly],i)=>{const a=ra*15*D2R,d=de*D2R,p=new THREE.Vector3(Math.cos(d)*Math.cos(a)*ly,Math.sin(d)*ly,Math.cos(d)*Math.sin(a)*ly);
    const col=id==='sun'?'rgb(255,210,120)':['sirius','vega','altair','procyon','fomalhaut'].includes(id)?'rgb(200,220,255)':['arcturus','pollux','capella'].includes(id)?'rgb(255,200,140)':'rgb(255,150,110)';
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(col),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));const s=id==='sun'?1.6:['barnard','wolf359'].includes(id)?.9:1.8;sp.scale.set(s,s,1);sp.position.copy(p);SG.add(sp);
    S3.objs['s:'+id]={k:id,name,ly,mesh:sp,pivot:sp,R:.6,star:true};});
  [5,10,20,40].forEach(rr=>{const pts=[];for(let i=0;i<=96;i++)pts.push(new THREE.Vector3(Math.cos(i/96*TAU)*rr,0,Math.sin(i/96*TAU)*rr));SG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x3a4290,transparent:true,opacity:.6})));});
  /* Vintergatan: 1 enhet = 1000 ljusår */
  const GG=S3.groups.galax,N=S.lite||LOW3D?9000:22000,gp=new Float32Array(N*3),gc=new Float32Array(N*3);
  for(let i=0;i<N;i++){let x,y,z,c;if(i<N*.18){const rr=Math.abs((r()+r()+r()-1.5))*6,t=r()*TAU;x=Math.cos(t)*rr*1.6;z=Math.sin(t)*rr*.7;y=(r()-.5)*2.4;c=[1,.86,.6];}
    else{const arm=i%4,t=r(),ang=arm*PI/2+t*4.4+(r()-.5)*.5,rr=4+t*46+(r()-.5)*4;x=Math.cos(ang)*rr;z=Math.sin(ang)*rr;y=(r()-.5)*1.2;c=t<.35?[1,.9,.75]:[.7,.8,1];}
    gp.set([x,y,z],i*3);const w=.5+r()*.5;gc.set(c.map(v=>v*w),i*3);}
  const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(gp,3));gg.setAttribute('color',new THREE.BufferAttribute(gc,3));
  GG.add(new THREE.Points(gg,new THREE.PointsMaterial({size:.35,vertexColors:true,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending})));
  const core=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('rgb(255,220,160)'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));core.scale.set(26,14,1);GG.add(core);
  const sunAng=PI/2+.55*4.4,sunPos=new THREE.Vector3(Math.cos(sunAng)*26,0,Math.sin(sunAng)*26);
  const you=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('rgb(255,122,168)'),transparent:true,depthWrite:false}));you.scale.set(2.4,2.4,1);you.position.copy(sunPos);GG.add(you);
  S3.objs['g:sun']={k:'sun',name:'Solen är här',mesh:you,pivot:you,R:1,gal:true};S3.objs['g:center']={k:'blackhole',name:'Mitten: Sagittarius A*',mesh:core,pivot:core,R:3,gal:true};
  if(window.THREE&&THREE.EffectComposer&&THREE.UnrealBloomPass&&!S.lite){S3.comp=new THREE.EffectComposer(S3.renderer);S3.comp.addPass(new THREE.RenderPass(S3.scene,S3.camera));S3.bloom=new THREE.UnrealBloomPass(new THREE.Vector2(256,256),.85,.55,.78);S3.comp.addPass(S3.bloom);}
  S3.ready=true;$('s3-msg').textContent='';onResize3D();setMode3D(S3.mode,true);}
function onResize3D(){if(!S3.ready)return;const w=$('s3-wrap').clientWidth,h=$('s3-wrap').clientHeight;S3.renderer.setSize(w,h,false);if(S3.comp){S3.comp.setSize(w,h);S3.comp.setPixelRatio&&S3.comp.setPixelRatio(S3.renderer.getPixelRatio());}S3.camera.aspect=w/h;S3.camera.updateProjectionMatrix();}
addEventListener('resize',()=>{if(cur==='rymd3d')onResize3D();});
const MODES3={sol:['Solsystemet','Planeterna är förstorade och avstånden ihoptryckta, så att allt syns.'],real:['Verklig skala','Allt i rätt storlek och avstånd. Planeterna blir pyttesmå, för rymden är nästan helt tom! Tryck på ett namn för att flyga dit.'],
  stars:['Närmaste stjärnorna','1 ruta på ringarna är 1 ljusår. Ringarna visar 5, 10, 20 och 40 ljusår från solen.'],galax:['Vintergatan','Hela vår galax sedd utifrån. Den rosa pricken är ungefär där solen finns.']};
function setMode3D(m,first){if((m==='real'||m==='sol')&&!S3.built[m]){if(S3.lazy)return;S3.lazy=buildBodies(m==='real').then(()=>{S3.lazy=null;setMode3D(m,first);});return;}S3.mode=m;S3.tour=null;for(const g in S3.groups)S3.groups[g].visible=g===m;S3.sky.visible=S3.mw.visible=m!=='galax';
  [...$('s3-modes').children].forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));$('s3-modeinfo').textContent=MODES3[m][1];
  S3.controls.minDistance=.05;S3.focus=null;$('s3-info').hidden=true;
  const home={sol:[0,130,230],real:[0,2.5e6,4.5e6],stars:[0,45,70],galax:[0,55,75]}[m];S3.camera.position.set(...home);S3.controls.target.set(0,0,0);
  S3.controls.maxDistance={sol:3000,real:2e7,stars:400,galax:300}[m];S3.sky.scale.setScalar({sol:20000,real:4e7,stars:2000,galax:2000}[m]);S3.mw.scale.copy(S3.sky.scale);
  S3.light.visible=m==='sol'||m==='real';buildLabels();renderTargets();if(!first)SFX.click();}
function keysInMode(){const p=S3.mode==='sol'?'v:':S3.mode==='real'?'r:':S3.mode==='stars'?'s:':'g:';return Object.keys(S3.objs).filter(k=>k.startsWith(p));}
function buildLabels(){const L=$('s3-labels');L.innerHTML=keysInMode().map(key=>{const o=S3.objs[key],nm=o.name||B[o.k].short||B[o.k].name;return `<button class="s3l ${o.parent?'moon':''}" data-k="${key}">${nm}</button>`;}).join('');S3.labels=[...L.children];}
function renderTargets(){$('s3-targets').innerHTML=keysInMode().filter(k=>!S3.objs[k].parent||S3.mode==='sol').map(key=>{const o=S3.objs[key];return `<button data-k="${key}">${o.name||B[o.k].short||B[o.k].name}</button>`;}).join('');}
function flyTo(key){const o=S3.objs[key];if(!o)return;S3.focus=key;const wp=new THREE.Vector3();o.mesh.getWorldPosition(wp);
  const dist=o.star?6:o.gal?(o.k==='sun'?8:30):o.k==='saturn'?o.R*7:o.R*(o.k==='sun'?7:4.6),dir=S3.camera.position.clone().sub(S3.controls.target).normalize();
  S3.lift=new THREE.Vector3(0,-dist*.22,0);S3.fly={t:0,from:S3.camera.position.clone(),fromT:S3.controls.target.clone(),off:dir.multiplyScalar(dist).add(new THREE.Vector3(0,dist*.25,0))};
  S3.controls.minDistance=o.R*1.15;showInfo3D(o);SFX.star();}
function showInfo3D(o){const box=$('s3-info');box.hidden=false;let t;
  if(o.star){t=o.k==='sun'?'Här bor vi. Allt du ser är stjärnor inom ungefär 43 ljusår från solen.':`${o.name} ligger ${nf(o.ly,1)} ljusår bort. Ljuset du ser härifrån lämnade stjärnan för ${nf(o.ly,1)} år sedan.`;
    box.innerHTML=`<div><b>${o.name}</b><p>${t}</p></div>${sayBtn(o.name+'. '+t)}`;return;}
  if(o.gal){t=o.k==='sun'?'Solen ligger ungefär 26 000 ljusår från mitten, i Orionarmen. Ett varv runt mitten tar ungefär 230 miljoner år.':'Mitt i Vintergatan finns det supermassiva svarta hålet Sagittarius A*.';
    box.innerHTML=`<div><b>${o.name}</b><p>${t}</p></div>${sayBtn(t)}`;return;}
  const p=B[o.k];t=`${p.tag} ${(p.facts[0]||'')}`;
  box.innerHTML=`<div><b>${p.name}</b><p>${t}</p><p class="s3dist" id="s3-dist"></p><button class="linkbtn" data-go="${o.k}">Läs mer om ${p.short||p.name}</button></div>${sayBtn(p.name+'. '+t)}`;}
function earthDist(k){if(k==='earth')return null;const e=helioAU('earth',S3.days);let p;
  if(k==='sun')p=[0,0,0];else if(PEL[k]||ORB[k])p=helioAU(k,S3.days);else{const m=S3M.find(x=>x[0]===k);if(!m)return null;p=helioAU(m[1],S3.days);if(m[1]==='earth')return 384400;}
  return Math.hypot(p[0]-e[0],p[1]-e[1],p[2]-e[2])*AUKM;}
const fmtKm=km=>km>=1e9?nf(km/1e9,2)+' miljarder km':km>=1e6?nf(km/1e6,1)+' miljoner km':nf(km,0)+' km';
function update3D(dt){const real=S3.mode==='real';if(S3.mode==='sol'||real){
  for(const key of keysInMode()){const o=S3.objs[key];
    if(o.parent){const pp=S3.objs[(real?'r:':'v:')+o.parent].pivot.position,a=TAU*S3.days/o.per;o.pivot.position.set(pp.x+Math.cos(a)*o.dist,pp.y,pp.z-Math.sin(a)*o.dist);}
    else if(o.k!=='sun'){o.pivot.position.copy(toV(helioAU(o.k,S3.days),real));if(o.mesh.userData.tail){const d=o.pivot.position.clone().normalize(),au=Math.hypot(...helioAU('halley',S3.days));o.mesh.userData.tail.position.copy(d.multiplyScalar(o.R*12));o.mesh.userData.tail.material.opacity=clamp(3/au,0,1);}}
    const sp=(R3[o.k]&&R3[o.k].speed)||.02;o.mesh.rotation.y+=dt*sp*8;}}
  if(S3.mode==='galax')S3.groups.galax.rotation.y+=dt*.01;}
function project3D(){const v=new THREE.Vector3(),w=$('s3-wrap').clientWidth,h=$('s3-wrap').clientHeight,camd=S3.camera.position.distanceTo(S3.controls.target);
  for(const el of S3.labels){const o=S3.objs[el.dataset.k];o.mesh.getWorldPosition(v);const d=v.distanceTo(S3.camera.position);v.project(S3.camera);
    const vis=v.z<1&&v.z>-1&&Math.abs(v.x)<1.1&&Math.abs(v.y)<1.1&&!(o.parent&&S3.mode==='sol'&&d>o.dist*40);
    el.style.display=vis?'':'none';if(vis){el.style.transform=`translate(${(v.x*.5+.5)*w}px,${(-v.y*.5+.5)*h}px)`;el.classList.toggle('on',S3.focus===el.dataset.k);}}}
let last3=0;
function loop3D(now){if(cur!=='rymd3d'||!S3.ready){S3.running=false;return;}const dt=Math.min(.1,(now-(last3||now))/1000);last3=now;
  S3.days+=dt*S3.speed;update3D(dt);
  if(S3.focus){const o=S3.objs[S3.focus],wp=new THREE.Vector3();o.mesh.getWorldPosition(wp);
    if(S3.fly){S3.fly.t=Math.min(1,S3.fly.t+dt/1.6);const e=S3.fly.t<.5?2*S3.fly.t*S3.fly.t:1-Math.pow(-2*S3.fly.t+2,2)/2;
      const tg=wp.clone().add(S3.lift);S3.controls.target.lerpVectors(S3.fly.fromT,tg,e);S3.camera.position.lerpVectors(S3.fly.from,tg.clone().add(S3.fly.off),e);if(S3.fly.t>=1){S3.fly=null;upgradeTex(o);}}
    else{const delta=wp.clone().add(S3.lift).sub(S3.controls.target);S3.controls.target.add(delta);S3.camera.position.add(delta);}
    const d=$('s3-dist');if(d){const km=earthDist(o.k);d.textContent=km?`Avstånd från jorden just nu: ${fmtKm(km)}. Ljuset tar ${fmtT(km/299792)}.`:'';}}
  S3.controls.update();S3.sky.position.copy(S3.camera.position);S3.mw.position.copy(S3.camera.position);
  const tt=now/1000;for(const key of ['v:sun','r:sun','v:earth','r:earth']){const o=S3.objs[key];if(o&&o.mesh.material.uniforms)o.mesh.material.uniforms.t.value=key.endsWith('earth')?tt*.004:tt;}
  if(S3.comp&&S3.mode!=='galax')S3.comp.render();else S3.renderer.render(S3.scene,S3.camera);project3D();
  const date=new Date(Date.now()+S3.days*864e5);$('s3-date').textContent=(S3.mode==='sol'||S3.mode==='real')?date.toLocaleDateString('sv-SE',{year:'numeric',month:'short',day:'numeric'}):'';
  if(S3.tour)tourStep(now);
  requestAnimationFrame(loop3D);}
function start3D(){const st=$('s3-msg');if(!S3.ready){st.textContent='Laddar 3D-motorn…';
    load3D().then(()=>S3.ready||S3.building||(S3.building=build3D().then(()=>{S3.building=null;if(!S3.running){S3.running=true;requestAnimationFrame(loop3D);}})))
      .catch(()=>{st.textContent='3D-motorn kunde inte laddas. Kontrollera internetanslutningen och försök igen.';});return;}
  onResize3D();if(!S3.running){S3.running=true;last3=0;requestAnimationFrame(loop3D);}}
/* guidad tur */
const TOUR=['sun','mercury','venus','earth','moon','mars','jupiter','io','saturn','titan','uranus','neptune','pluto'];
function startTour(){$('s3-wrap').scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});if(S3.mode!=='sol')setMode3D('sol');S3.tour={i:-1,next:0};$('s3-tour').textContent='Stoppa turen';}
function stopTour(){S3.tour=null;$('s3-tour').textContent='Guidad tur';}
function tourStep(now){const T=S3.tour;if(now<T.next)return;T.i++;if(T.i>=TOUR.length){stopTour();buddySay(`Det var hela solsystemet, ${pname()}! Flyg runt själv nu.`,'wow',5000);return;}
  const k=TOUR[T.i];flyTo('v:'+k);T.next=now+7000;const p=B[k];buddySay(`${p.name}: ${p.facts[0]}`,'happy',6800);}
/* knappar */
$('s3-modes').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b&&S3.ready){stopTour();setMode3D(b.dataset.m);}});
$('s3-targets').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b&&S3.ready){stopTour();flyTo(b.dataset.k);$('s3-wrap').scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});}});
$('s3-labels').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b){stopTour();flyTo(b.dataset.k);}});
$('s3-speed').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;S3.speed=+b.dataset.s;[...$('s3-speed').children].forEach(x=>x.setAttribute('aria-pressed',x===b));SFX.click();});
$('s3-home').addEventListener('click',()=>{if(S3.ready){stopTour();setMode3D(S3.mode);}});
$('s3-tour').addEventListener('click',()=>{if(!S3.ready)return;S3.tour?stopTour():startTour();});
$('s3-full').addEventListener('click',()=>{const w=$('s3-wrap');w.classList.toggle('max');document.body.classList.toggle('s3max',w.classList.contains('max'));$('s3-full').textContent=w.classList.contains('max')?'Mindre':'Helskärm';setTimeout(onResize3D,50);});
$('s3-info').addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){SFX.click();select(g.dataset.go);}});
$('s3').addEventListener('pointerdown',()=>{if(S3.fly)S3.fly=null;});
