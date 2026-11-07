/* ===================== Motor: brus, texturer, 3D-sfärer ===================== */
const PI=Math.PI, TAU=PI*2;
const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function seeded(n){let s=n;return()=>((s=(s*16807)%2147483647)-1)/2147483646;}
const PERM=(()=>{const p=new Uint8Array(512),a=[...Array(256).keys()],r=seeded(1337);for(let i=255;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}for(let i=0;i<512;i++)p[i]=a[i&255];return p;})();
function vnoise(x,y,z){
  const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z);
  const fx=x-X,fy=y-Y,fz=z-Z,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),w=fz*fz*(3-2*fz);
  const xi=X&255,yi=Y&255,zi=Z&255;
  const A=PERM[xi]+yi,B_=PERM[xi+1]+yi,AA=PERM[A]+zi,AB=PERM[A+1]+zi,BA=PERM[B_]+zi,BB=PERM[B_+1]+zi;
  const l=(a,b,t)=>a+(b-a)*t;
  return l(l(l(PERM[AA],PERM[BA],u),l(PERM[AB],PERM[BB],u),v),l(l(PERM[AA+1],PERM[BA+1],u),l(PERM[AB+1],PERM[BB+1],u),v),w)/255;
}
function fbm(x,y,z,o){let s=0,a=.5,f=1,n=0;for(let i=0;i<o;i++){s+=a*vnoise(x*f,y*f,z*f);n+=a;a*=.5;f*=2.03;}return s/n;}
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mixc=(a,b,f)=>{f=clamp(f);return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f];};
const scl=(c,f)=>[c[0]*f,c[1]*f,c[2]*f];
const RP=(...p)=>p.map(([t,h])=>[t,hex(h)]);
function ramp(st,t){if(t<=st[0][0])return st[0][1];for(let i=1;i<st.length;i++)if(t<=st[i][0]){const a=st[i-1],b=st[i];return mixc(a[1],b[1],(t-a[0])/(b[0]-a[0]));}return st[st.length-1][1];}
const dirFrom=(lat,lon)=>[Math.cos(lat)*Math.sin(lon),Math.sin(lat),Math.cos(lat)*Math.cos(lon)];
function craterSet(n,seed,rmin,rmax){const r=seeded(seed),L=[];for(let i=0;i<n;i++){const u=r()*2-1,th=r()*TAU,s=Math.sqrt(1-u*u),rad=rmin+(rmax-rmin)*Math.pow(r(),2.4);L.push([s*Math.cos(th),u,s*Math.sin(th),rad,Math.cos(rad*1.2)]);}return L;}
function craterMod(x,y,z,L){let m=1;for(let i=0;i<L.length;i++){const c=L[i],d=x*c[0]+y*c[1]+z*c[2];if(d>c[4]){const t=Math.acos(Math.min(1,d))/c[3];if(t<.8)m*=.78+.18*t;else if(t<1.15)m*=1.12;}}return m;}

const G={
  star:(rp,f,spots)=>(x,y,z)=>{let g=fbm(x*f+11,y*f+3,z*f,4)*.75+fbm(x*f*3.1,y*f*3.1,z*f*3.1,2)*.25;let c=ramp(rp,g);
    if(spots){const s=fbm(x*2.3+40,y*2.3,z*2.3,3);if(s>.7&&Math.abs(y)<.55)c=scl(c,1-(s-.7)*2.4);}return c;},
  rocky:(rp,o)=>{const L=craterSet(o.n,o.seed,o.rmin||.015,o.rmax||.2);
    if(o.big)o.big.forEach(b=>{const d=dirFrom(b[0],b[1]);L.push([...d,b[2],Math.cos(b[2]*1.2)]);});
    return(x,y,z,lat,lon)=>{const h=fbm(x*3+o.seed*7.1,y*3,z*3,5);let c=ramp(rp,h);
      if(o.maria){const m=fbm(x*1.5+5,y*1.5,z*1.5,3);c=mixc(c,scl(c,.55),(m-.52)*6);}
      if(o.patch){const m=fbm(x*1.8+17,y*1.8,z*1.8,4);c=mixc(c,hex(o.patch),(m-.5)*5);}
      if(o.spec){const s=vnoise(x*38,y*38,z*38);if(s>.84)c=mixc(c,[215,208,196],(s-.84)*5);}
      if(o.extra)c=o.extra(x,y,z,lat,lon,c);
      return scl(c,craterMod(x,y,z,L));};},
  gas:(rp,o)=>(x,y,z,lat,lon)=>{const t=(fbm(x*o.tf+4,y*o.tf*1.7,z*o.tf,4)-.5)*o.turb;let b=Math.sin(lat*o.freq+t)*.5+.5;
    b=b*.82+.18*fbm(x*6,y*22,z*6,3);let c=ramp(rp,b);
    if(o.spot){const s=o.spot;let dl=lon-s.lon;while(dl>PI)dl-=TAU;while(dl<-PI)dl+=TAU;const e=(dl/s.w)**2+((lat-s.lat)/s.h)**2;
      if(e<1){const sw=fbm(dl*9+3,lat*9,2,3);c=mixc(c,mixc(hex(s.c),hex(s.c2||s.c),sw),Math.pow(1-e,.5)*s.a);}}
    return c;}
};
const TEX={
  sun:()=>G.star(RP([0,'#b83a0a'],[.4,'#f07818'],[.65,'#fbb32c'],[1,'#fff4c0']),9,true),
  sirius:()=>G.star(RP([0,'#6f9cff'],[.5,'#cfe0ff'],[1,'#ffffff']),9),
  polaris:()=>G.star(RP([0,'#d8a84a'],[.5,'#fff0b8'],[1,'#fffbe8']),9),
  betelgeuse:()=>G.star(RP([0,'#5e1004'],[.4,'#b8320c'],[.72,'#ff7028'],[1,'#ffc078']),2.6),
  mercury:()=>G.rocky(RP([0,'#4e4844'],[.5,'#8f8780'],[1,'#cfc7bf']),{n:110,seed:2,rmax:.2}),
  moon:()=>G.rocky(RP([0,'#6a6a72'],[.5,'#a8a8b0'],[1,'#e2e2e8']),{n:80,seed:5,rmax:.22,maria:true}),
  venus:()=>(x,y,z,lat)=>{const w=fbm(x*1.8+7,y*1.8,z*1.8,4),b=Math.sin(lat*5+w*6)*.5+.5;return ramp(RP([0,'#b97a34'],[.5,'#e8bd78'],[1,'#fbe7bb']),b*.55+fbm(x*4,y*4,z*4,4)*.45);},
  earth:()=>(x,y,z,lat)=>{const h=fbm(x*1.9+3,y*1.9,z*1.9,6),al=Math.abs(lat);
    if(al>1.3||(al>1.12&&h>.47))return[236,242,250];
    if(h<.53)return mixc(hex('#2f7fd8'),hex('#0b2f7a'),(.53-h)*7);
    const e=(h-.53)/.47,dry=fbm(x*3+9,y*3,z*3,3);
    let c=(al<.5&&dry>.55)?mixc(hex('#cfa86a'),hex('#a8794a'),e*2):mixc(hex('#3f9a4a'),hex('#285f30'),e*2.5);
    if(e>.3)c=mixc(c,hex('#857560'),(e-.3)*2.5);if(al>.95)c=mixc(c,[240,244,250],(al-.95)*3);return c;},
  earthClouds:()=>(x,y,z,lat)=>{const c=fbm(x*2.6+50,y*4.4,z*2.6,6);return[255,255,255,clamp((c-.52)*3.6)*235];},
  mars:()=>{const L=craterSet(30,21,.02,.08);return(x,y,z,lat)=>{const h=fbm(x*2.4+1,y*2.4,z*2.4,5);
    let c=ramp(RP([0,'#5a2414'],[.4,'#a4442a'],[.6,'#cd663e'],[1,'#e8a472']),h);
    c=mixc(c,hex('#4a2216'),(fbm(x*1.4+20,y*1.4,z*1.4,4)-.56)*4);const al=Math.abs(lat);if(al>1.3)c=mixc(c,[245,240,236],(al-1.3)*14);
    return scl(c,craterMod(x,y,z,L));};},
  vesta:()=>G.rocky(RP([0,'#5e5850'],[.5,'#9a9286'],[1,'#d2c8b8']),{n:60,seed:13,rmax:.15,big:[[-1.35,0,.75]]}),
  ceres:()=>G.rocky(RP([0,'#4a4744'],[.5,'#76726e'],[1,'#a8a49e']),{n:70,seed:11,rmax:.16,extra:(x,y,z,lat,lon,c)=>{const d=dirFrom(.35,.3);return(x*d[0]+y*d[1]+z*d[2])>.9975?[250,250,245]:c;}}),
  bennu:()=>G.rocky(RP([0,'#1c1a18'],[.5,'#3a3632'],[1,'#666058']),{n:25,seed:17,rmax:.1,spec:true}),
  jupiter:()=>G.gas(RP([0,'#9a5c34'],[.28,'#c48a5a'],[.5,'#e8cfae'],[.75,'#f7ecd8'],[1,'#d2ac84']),{freq:15,tf:2.4,turb:2.2,spot:{lat:-.38,lon:.6,w:.3,h:.13,c:'#b8442a',c2:'#e2825a',a:.95}}),
  io:()=>(x,y,z)=>{const f=fbm(x*3.2+2,y*3.2,z*3.2,5);let c=ramp(RP([0,'#fbf2a4'],[.42,'#ecd050'],[.62,'#d8982e'],[1,'#9a4e1c']),f);
    const h=fbm(x*8+30,y*8,z*8,3);if(h>.7)c=mixc(c,[38,26,18],(h-.7)*10);const w=fbm(x*5+60,y*5,z*5,3);if(w>.68)c=mixc(c,[255,252,230],(w-.68)*6);return c;},
  europa:()=>(x,y,z)=>{let c=ramp(RP([0,'#c8a684'],[.5,'#e8dcc8'],[1,'#fbf6ee']),fbm(x*2.5+5,y*2.5,z*2.5,4));
    const l1=Math.abs(fbm(x*2.2+13,y*2.2,z*2.2,4)-.5),l2=Math.abs(fbm(x*3.7+50,y*3.7,z*3.7,3)-.5);
    if(l1<.02)c=mixc(c,hex('#8a4a2a'),1-l1/.02);if(l2<.013)c=mixc(c,hex('#9a5a3a'),(1-l2/.013)*.8);return c;},
  ganymede:()=>G.rocky(RP([0,'#6e6256'],[.5,'#a39686'],[1,'#d6ccbe']),{n:50,seed:8,rmax:.12,patch:'#4e443a'}),
  saturn:()=>G.gas(RP([0,'#b88e50'],[.5,'#e6cc92'],[1,'#f8eccc']),{freq:20,tf:2,turb:1.1}),
  titan:()=>G.gas(RP([0,'#a8661a'],[.5,'#d89838'],[1,'#f0c070']),{freq:5,tf:1.4,turb:.7}),
  uranus:()=>G.gas(RP([0,'#86d0d6'],[.5,'#a4e2e4'],[1,'#c8f4f0']),{freq:9,tf:1.5,turb:.4}),
  neptune:()=>G.gas(RP([0,'#1a34a0'],[.5,'#3462d6'],[1,'#78a0f2']),{freq:11,tf:2,turb:1.6,spot:{lat:-.35,lon:1.2,w:.26,h:.12,c:'#0c1c62',a:.9}}),
  pluto:()=>{const L1=dirFrom(.42,.72),L2=dirFrom(.42,1.08);return(x,y,z,lat,lon)=>{const h=fbm(x*2.6+3,y*2.6,z*2.6,5);
    let c=ramp(RP([0,'#6a4430'],[.5,'#b48a68'],[1,'#e8d2b4']),h);const n=(fbm(x*3+70,y*3,z*3,3)-.5)*.2;
    const lobe=(x*L1[0]+y*L1[1]+z*L1[2])>Math.cos(.3+n)||(x*L2[0]+y*L2[1]+z*L2[2])>Math.cos(.3+n);
    const tip=lat<.45&&lat>-.35&&Math.abs(lon-.9)<(lat+.35)*.62+n;
    if(lobe||tip)return mixc(c,[250,240,226],.9);
    const lw=clamp((.3-Math.abs(lat+.1+n*1.5))*5),ow=clamp((1.1-Math.abs(lon+1.15+n*2))*3);return mixc(c,hex('#3e2218'),lw*ow*.85);};}
};
/* Hur varje kropp ritas */
const R3={
  sun:{rf:.27,speed:.012,emis:1,corona:'255,170,40'},
  sirius:{rf:.2,speed:.02,emis:1,corona:'170,200,255',spikes:1},
  polaris:{rf:.22,speed:.015,emis:1,corona:'255,235,170',spikes:1},
  betelgeuse:{rf:.3,speed:.006,emis:1,corona:'255,80,30'},
  mercury:{rf:.3,speed:.01},venus:{rf:.3,speed:-.006,atm:'255,225,160'},
  earth:{rf:.3,tilt:.41,speed:.035,atm:'110,185,255',clouds:1},moon:{rf:.3,speed:.012},
  mars:{rf:.3,tilt:.44,speed:.035,atm:'255,150,110'},
  vesta:{rf:.28,speed:.05,lumpy:.12,seed:3},ceres:{rf:.3,speed:.05},bennu:{rf:.28,speed:.09,lumpy:.1,seed:8},
  jupiter:{rf:.32,tilt:.05,speed:.06,atm:'255,230,200'},io:{rf:.3,speed:.03},europa:{rf:.3,speed:.025},ganymede:{rf:.3,speed:.02},
  saturn:{rf:.2,tilt:-.35,speed:.055,rings:[[1.22,1.5,'#6e5a3c',.35],[1.52,1.92,'#e8d4a2',.95],[1.99,2.24,'#cdb684',.85],[2.27,2.31,'#bfae88',.5]],ringRy:.3},
  titan:{rf:.3,speed:.01,atm:'255,180,90'},
  uranus:{rf:.26,tilt:1.45,speed:.045,atm:'180,255,250',rings:[[1.6,1.66,'#cfe8ea',.55],[1.9,1.96,'#e6f6f6',.75]],ringRy:.5},
  neptune:{rf:.3,tilt:.49,speed:.05,atm:'120,160,255'},pluto:{rf:.3,speed:-.008}
};
const TEXC={};
function getTex(k,TW){const key=k+TW;if(TEXC[key])return TEXC[key];const TH=TW>>1,f=TEX[k](),d=new Uint8ClampedArray(TW*TH*3);let A=null;
  for(let j=0;j<TH;j++){const lat=(.5-(j+.5)/TH)*PI,cl=Math.cos(lat),sl=Math.sin(lat);
    for(let i=0;i<TW;i++){const lon=((i+.5)/TW-.5)*TAU,c=f(cl*Math.sin(lon),sl,cl*Math.cos(lon),lat,lon),q=(j*TW+i)*3;
      d[q]=c[0];d[q+1]=c[1];d[q+2]=c[2];if(c.length>3){if(!A)A=new Uint8ClampedArray(TW*TH);A[j*TW+i]=c[3];}}}
  return TEXC[key]={w:TW,h:TH,d,a:A};}
const LIGHT=(()=>{const v=[-.55,-.45,.7],n=Math.hypot(...v);return v.map(a=>a/n);})();
function buildLUT(D,rp,b,TH){const c=D/2,ct=Math.cos(b.tilt||0),st=Math.sin(b.tilt||0),P=[],U=[],Ro=[],Sh=[],Al=[];
  for(let py=0;py<D;py++)for(let px=0;px<D;px++){const dx=(px+.5-c)/rp,dy=(py+.5-c)/rp;let rr=1;
    if(b.lumpy){const th=Math.atan2(dy,dx);rr=1+b.lumpy*(vnoise(Math.cos(th)*1.8+5,Math.sin(th)*1.8+5,b.seed||1)*2-1);}
    const d=Math.hypot(dx,dy)/rr;if(d>1+1.5/rp)continue;
    const nx=dx/rr,ny=dy/rr,nz=Math.sqrt(Math.max(0,1-Math.min(1,d*d)));
    const tx=nx*ct+ny*st,ty=-nx*st+ny*ct,lat=Math.asin(clamp(-ty,-1,1)),lon=Math.atan2(tx,nz);
    P.push((py*D+px)*4);U.push(lon/TAU+.5);Ro.push(Math.min(TH-1,Math.floor((.5-lat/PI)*TH)));
    let sh;if(b.emis)sh=.6+.42*Math.pow(nz,.45);else{const df=Math.max(0,nx*LIGHT[0]+ny*LIGHT[1]+nz*LIGHT[2]);sh=(.05+1.02*Math.pow(df,.8))*(.88+.12*nz);}
    Sh.push(sh);Al.push(clamp((1-d)*rp+.5)*255);}
  return{n:P.length,p:Int32Array.from(P),u:Float32Array.from(U),row:Int32Array.from(Ro),sh:Float32Array.from(Sh),a:Uint8Array.from(Al)};}

/* ---------- Montering och animationsloop ---------- */
const LIVE=new Set();
let DPR=Math.min(2,devicePixelRatio||1);
function mountBodies(){document.querySelectorAll('canvas.body3d:not([data-m])').forEach(cv=>{cv.dataset.m=1;LIVE.add({cv,k:cv.dataset.body,ready:false});});}
new MutationObserver(mountBodies).observe(document.documentElement,{childList:true,subtree:true});
function initObj(o){const p=B[o.k],cv=o.cv,W=cv.clientWidth,cw=Math.max(8,Math.round(W*DPR));cv.width=cv.height=cw;o.W=W;o.cw=cw;o.ctx=cv.getContext('2d');o.drawn=false;
  if(p.nebula){o.draw=()=>drawNeb(o);o.static=true;}
  else if(p.blackhole){o.draw=t=>drawBH(o,t);}
  else{const b=R3[o.k]||{rf:.3,speed:.02};o.b=b;const rp=b.rf*cw,D=Math.ceil(2*rp)+4;
    const TW=rp>150?512:rp>48?256:128;o.tex=getTex(o.k,TW);o.cl=b.clouds?getTex('earthClouds',TW):null;
    o.rp=rp;o.D=D;o.lut=buildLUT(D,rp,b,o.tex.h);o.off=document.createElement('canvas');o.off.width=o.off.height=D;o.octx=o.off.getContext('2d');o.img=o.octx.createImageData(D,D);
    o.draw=t=>drawSphere(o,t);}
  o.ready=true;}
function drawSphere(o,t){const {lut,tex,img,b}=o,d=img.data,T=tex.d,TW=tex.w,mask=TW-1,off=t*b.speed,C=o.cl,coff=t*b.speed*1.3;
  for(let i=0;i<lut.n;i++){const p=lut.p[i],row=lut.row[i]*TW,ti=(row+(((lut.u[i]+off)*TW|0)&mask))*3,sh=lut.sh[i];
    let r=T[ti],g=T[ti+1],bb=T[ti+2];
    if(C){const ca=C.a[row+(((lut.u[i]+coff)*TW|0)&mask)]/255;r+=(255-r)*ca;g+=(255-g)*ca;bb+=(255-bb)*ca;}
    d[p]=r*sh;d[p+1]=g*sh;d[p+2]=bb*sh;d[p+3]=lut.a[i];}
  o.octx.putImageData(img,0,0);
  const c=o.ctx,cw=o.cw,cx=cw/2,R=o.rp;c.clearRect(0,0,cw,cw);
  if(b.corona){const pulse=1+.04*Math.sin(t*1.3);const g=c.createRadialGradient(cx,cx,R*.8,cx,cx,R*1.9*pulse);g.addColorStop(0,`rgba(${b.corona},.75)`);g.addColorStop(.35,`rgba(${b.corona},.25)`);g.addColorStop(1,`rgba(${b.corona},0)`);c.fillStyle=g;c.fillRect(0,0,cw,cw);
    if(b.spikes){c.save();c.translate(cx,cx);c.rotate(t*.05);for(let i=0;i<4;i++){c.rotate(PI/4);const L=R*(i%2?1.8:2.6);const lg=c.createLinearGradient(-L,0,L,0);lg.addColorStop(0,`rgba(${b.corona},0)`);lg.addColorStop(.5,`rgba(255,255,255,.38)`);lg.addColorStop(1,`rgba(${b.corona},0)`);c.fillStyle=lg;c.fillRect(-L,-R*.03,2*L,R*.06);}c.restore();}}
  if(b.rings)drawRing(c,o,PI,TAU);
  c.drawImage(o.off,cx-o.D/2,cx-o.D/2);
  if(b.atm){const g=c.createRadialGradient(cx,cx,R*.9,cx,cx,R*1.13);g.addColorStop(0,`rgba(${b.atm},0)`);g.addColorStop(.5,`rgba(${b.atm},.4)`);g.addColorStop(1,`rgba(${b.atm},0)`);c.fillStyle=g;c.beginPath();c.arc(cx,cx,R*1.13,0,TAU);c.fill();}
  if(b.rings)drawRing(c,o,0,PI);}
function drawRing(c,o,a0,a1){const b=o.b,R=o.rp,cx=o.cw/2,rot=b.tilt||0;
  for(const band of b.rings){const steps=Math.max(1,Math.round((band[1]-band[0])*R/1.5));
    for(let s=0;s<steps;s++){const rr=R*(band[0]+(band[1]-band[0])*(s+.5)/steps);c.globalAlpha=band[3]*(.78+.22*Math.sin(s*1.7));
      c.strokeStyle=band[2];c.lineWidth=(band[1]-band[0])*R/steps+.7;c.beginPath();c.ellipse(cx,cx,rr,rr*b.ringRy,rot,a0,a1);c.stroke();}}
  c.globalAlpha=1;}
function drawBH(o,t){const c=o.ctx,W=o.cw,cx=W/2,rh=W*.1;c.clearRect(0,0,W,W);
  const g=c.createRadialGradient(cx,cx,rh,cx,cx,W*.5);g.addColorStop(0,'rgba(255,140,60,.3)');g.addColorStop(1,'rgba(255,140,60,0)');c.fillStyle=g;c.fillRect(0,0,W,W);
  const tilt=-.18,ry=.27,rings=W<200?7:13,seg=W<200?18:36;
  const disk=(a0,a1)=>{for(let j=0;j<rings;j++){const f=j/(rings-1),rr=rh*(1.7+f*2.4),sp=1.6/Math.pow(1.7+f*2.4,1.5);
    for(let s=0;s<seg;s++){const a=a0+(a1-a0)*s/seg,bb=a0+(a1-a0)*(s+1)/seg,am=(a+bb)/2;
      const br=(.55+.45*Math.sin(am*3+j*1.3-t*sp*6))*(1+.5*Math.cos(am))*(1-f*.55);
      const col=f<.3?'255,236,190':f<.6?'255,165,80':'220,80,40';c.strokeStyle=`rgba(${col},${clamp(br*.8)})`;c.lineWidth=rh*2.4/rings+1;
      c.beginPath();c.ellipse(cx,cx,rr,rr*ry,tilt,a,bb+.02);c.stroke();}}};
  disk(PI,TAU);
  c.save();c.shadowColor='rgba(255,190,110,.9)';c.shadowBlur=rh*.6;
  c.strokeStyle='rgba(255,200,130,.55)';c.lineWidth=rh*.5;c.beginPath();c.ellipse(cx,cx-rh*.1,rh*1.9,rh*1.5,tilt,PI*1.05,TAU*.975);c.stroke();
  c.strokeStyle='#ffe2b0';c.lineWidth=Math.max(1,rh*.09);c.beginPath();c.arc(cx,cx,rh*1.16,0,TAU);c.stroke();c.restore();
  c.fillStyle='#000';c.beginPath();c.arc(cx,cx,rh*1.1,0,TAU);c.fill();
  disk(0,PI);}
function drawNeb(o){const p=B[o.k].nebula,N=Math.min(170,o.cw),off=document.createElement('canvas');off.width=off.height=N;const ox=off.getContext('2d'),img=ox.createImageData(N,N),d=img.data,A=p.cols,s=p.seed;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const nx=x/N*2-1,ny=y/N*2-1,warp=fbm(nx*1.5+s,ny*1.5,s*2,3),dd=Math.hypot(nx,ny)+(warp-.5)*.7;
    let m=clamp(1-dd*1.15);m=m*m*(3-2*m);const n1=fbm(nx*2.4+s*3,ny*2.4,s+1,5),n2=fbm(nx*2.4+40,ny*2.4+s,s+2,5);let r,g,b;
    if(p.crab){const fil=Math.pow(1-Math.abs(2*fbm(nx*3+s,ny*3,s+5,5)-1),6),df=Math.pow(n2,1.5);
      r=A[1][0]*df*.7+A[0][0]*fil*1.6;g=A[1][1]*df*.7+A[0][1]*fil*1.4;b=A[1][2]*df*.9+A[0][2]*fil;const core=Math.exp(-(nx*nx+ny*ny)*30)*.7;r+=255*core;g+=240*core;b+=255*core;}
    else{const w1=Math.pow(n1,2.6)*1.5,w2=Math.pow(n2,2.6)*1.5;r=A[0][0]*w1+A[1][0]*w2+A[2][0]*w1*w2;g=A[0][1]*w1+A[1][1]*w2+A[2][1]*w1*w2;b=A[0][2]*w1+A[1][2]*w2+A[2][2]*w1*w2;
      const core=Math.exp(-((nx+.05)**2+(ny-.05)**2)*30)*.6;r+=200*core;g+=240*core;b+=255*core;const du=fbm(nx*3+77,ny*3,s,4);if(du>.58){const k=clamp(1-(du-.58)*3);r*=k;g*=k;b*=k;}}
    const lum=Math.max(r,g,b)/255,q=(y*N+x)*4;d[q]=r;d[q+1]=g;d[q+2]=b;d[q+3]=clamp(m*lum*1.1)*255;}
  ox.putImageData(img,0,0);const c=o.ctx,W=o.cw;c.clearRect(0,0,W,W);c.imageSmoothingQuality='high';c.drawImage(off,0,0,W,W);
  const r=seeded(s*31);for(let i=0;i<45;i++){c.fillStyle=`rgba(255,255,255,${.4+r()*.6})`;c.beginPath();c.arc(r()*W,r()*W,(r()*1.1+.3)*DPR,0,TAU);c.fill();}}
function visible(el){const r=el.getBoundingClientRect();return r.width>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}
let frame=0;const T0=performance.now();
function loop(now){frame++;const t=(now-T0)/1000;let budget=2;
  for(const o of LIVE){if(!o.cv.isConnected){LIVE.delete(o);continue;}
    if(!o.ready){if(o.cv.clientWidth>0&&visible(o.cv)&&budget>0){budget--;initObj(o);}else continue;}
    if((o.static||reduce||(typeof S!=='undefined'&&S.lite))&&o.drawn)continue;if(o.W<90&&frame%2)continue;if(!visible(o.cv))continue;
    o.draw(reduce?0:t);o.drawn=true;}
  requestAnimationFrame(loop);}
addEventListener('resize',()=>{DPR=Math.min(2,devicePixelRatio||1);for(const o of LIVE){o.ready=false;}});
requestAnimationFrame(loop);

/* ---------- SVG-konst: kometer och galaxer ---------- */
let uid=0;
function cometSVG(p,id,cls){const c=p.comet,L=c.len||110,dustC=c.dust||'#fff4dc',ionC=c.ion||'#79c3ff',comaC=c.comaC||'#dff2ff';
  let s=`<defs><linearGradient id="${id}d" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${dustC}" stop-opacity=".9"/><stop offset="1" stop-color="${dustC}" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}i" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${ionC}" stop-opacity=".95"/><stop offset="1" stop-color="${ionC}" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}c"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${comaC}" stop-opacity=".8"/><stop offset="1" stop-color="${comaC}" stop-opacity="0"/></radialGradient></defs>`;
  const one=(x,y,sc,len,coma,k)=>{const d=c.nodust?'':`<path d="M0 -7 Q${len*.5} -14 ${len} -${len*.34} L${len} ${len*.12} Q${len*.5} 10 0 7Z" fill="url(#${id}d)"/>`,iw=c.thin?3:5;
    return `<g transform="translate(${x} ${y}) rotate(140) scale(${sc})"><g class="tail" style="animation-delay:-${k*.4}s">${d}<path d="M0 -2.5 L${len*1.12} -${iw} L${len*1.12} ${iw} L0 2.5Z" fill="url(#${id}i)"/></g></g><circle class="coma" cx="${x}" cy="${y}" r="${coma*sc}" fill="url(#${id}c)"/>`;};
  let body='';
  if(c.sl9){s+=`<defs><clipPath id="${id}j"><circle cx="100" cy="102" r="26"/></clipPath></defs>`;
    body+=`<circle cx="100" cy="102" r="26" fill="#e9c296"/><g clip-path="url(#${id}j)" stroke="#b8754a" stroke-width="4" opacity=".7"><path d="M70 92h60M70 106h60M70 118h60"/></g><circle cx="88" cy="96" r="2.2" fill="#3a2a20" opacity=".7"/><circle cx="96" cy="99" r="1.6" fill="#3a2a20" opacity=".7"/>`;
    let fr='';for(let i=0;i<8;i++){const x=10+i*9,y=-4+i*8;fr+=one(x,y,.45,60,8,i)+`<circle cx="${x}" cy="${y}" r="1.6" fill="#4a4550"/>`;}
    body+=`<g class="drift">${fr}</g>`;}
  else{const nx=82,ny=18;let g=one(nx,ny,1,L,c.coma||13,0);
    g+=c.duck?`<circle cx="${nx-2}" cy="${ny+1.5}" r="3.6" fill="#4b4650"/><circle cx="${nx+3}" cy="${ny-2.5}" r="2.6" fill="#57525c"/>`:`<path d="M${nx-4} ${ny-2}q3-4 7-1q4 3 0 6q-4 3-7 0q-3-2 0-5z" fill="#4b4650"/>`;
    if(c.flash)g+=`<path class="flash" d="M${nx+8} ${ny+6}l2 5 5 1-5 2-2 5-2-5-5-2 5-1z" fill="#ffc94a"/>`;
    body=`<g class="drift">${g}</g>`;}
  return `<svg class="art comet-svg ${cls}" viewBox="-30 -30 160 160" role="img" aria-label="${p.name}">${s}${body}</svg>`;}
function galaxySVG(p,id,cls){const andro=p.galaxy==='andromeda',R=seeded(andro?11:7);let dots='';const arms=andro?2:4,n=andro?120:70;
  for(let a=0;a<arms;a++)for(let i=0;i<n;i++){const t=i/n,ang=a*TAU/arms+t*(andro?5.2:4.2)+(R()-.5)*.35,r=8+t*58+(R()-.5)*(andro?9:5);
    const x=50+r*Math.cos(ang),y=50+r*Math.sin(ang)*(andro?1:.62),col=t<.3?'#ffe6a8':t<.6?'#fff':'#a9c4ff';
    dots+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${((1-t)*1.4+.5).toFixed(2)}" fill="${col}" opacity="${(.3+R()*.6).toFixed(2)}"/>`;}
  if(andro)for(let i=0;i<5;i++){const r=24+i*9;dots+=`<ellipse cx="50" cy="50" rx="${r}" ry="${r}" fill="none" stroke="#3a2a40" stroke-width="2.2" opacity=".55" stroke-dasharray="${8+i*3} ${5+i}"/>`;}
  let you='';if(!andro&&cls.includes('big')){const ang=PI/2+.55*4.2,r=8+.55*58,x=50+r*Math.cos(ang),y=50+r*Math.sin(ang)*.62;
    you=`<circle cx="${x}" cy="${y}" r="3.5" fill="none" stroke="#ff7aa8" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="1.2" fill="#ffc94a"/><text x="${x-6}" y="${y+12}" text-anchor="end" font-family="Nunito,sans-serif" font-size="7" font-weight="800" fill="#ff7aa8">Du är här</text>`;}
  const defs=`<defs><radialGradient id="${id}g"><stop offset="0" stop-color="#fff3c9"/><stop offset=".35" stop-color="#ffc94a" stop-opacity=".7"/><stop offset="1" stop-color="#ffc94a" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}h"><stop offset="0" stop-color="${andro?'#c0a0ff':'#8a7dff'}" stop-opacity=".4"/><stop offset="1" stop-color="#8a7dff" stop-opacity="0"/></radialGradient></defs>`;
  const core=`<ellipse cx="50" cy="50" rx="${andro?14:17}" ry="${andro?14:11}" fill="url(#${id}g)"/>`+(andro?'':`<ellipse cx="50" cy="50" rx="10" ry="3.5" fill="#fff6d8" opacity=".8" transform="rotate(25 50 50)"/>`);
  const body=andro?`<ellipse cx="50" cy="50" rx="78" ry="34" fill="url(#${id}h)" transform="rotate(-35 50 50)"/><g transform="translate(50 50) rotate(-35) scale(1 .36) translate(-50 -50)"><g class="spin">${dots}${core}</g></g><circle cx="70" cy="58" r="4" fill="url(#${id}g)"/><ellipse cx="26" cy="30" rx="6" ry="3.5" fill="url(#${id}g)" opacity=".7"/>`
    :`<ellipse cx="50" cy="50" rx="74" ry="48" fill="url(#${id}h)"/><g transform="rotate(-18 50 50)"><g class="spin">${dots}${core}${you}</g></g>`;
  return `<svg class="art ${cls}" viewBox="-30 -30 160 160" role="img" aria-label="${p.name}">${defs}${body}</svg>`;}
function art(k,cls='',style=''){const p=B[k],id='a'+(uid++);let h;if(p.icon)h=themeSVG(k,id,cls);else if(p.comet)h=cometSVG(p,id,cls);else if(p.galaxy)h=galaxySVG(p,id,cls);
  else h=`<canvas class="art body3d ${p.nebula?'neb ':''}${cls}" data-body="${k}" role="img" aria-label="${p.name}"></canvas>`;
  return style?h.replace(/^<(\w+) /,`<$1 style="${style}" `):h;}
