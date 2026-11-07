/* ===================== 3D: realism (shaders, atmosfär, himmel, glöd) ===================== */
const FXURL=['shaders/CopyShader','shaders/LuminosityHighPassShader','postprocessing/EffectComposer','postprocessing/ShaderPass','postprocessing/RenderPass','postprocessing/UnrealBloomPass'].map(p=>'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/'+p+'.js');
function loadFX(){return FXURL.reduce((p,u)=>p.then(()=>loadScript(u)),Promise.resolve());}
const VSH=`#include <common>
#include <logdepthbuf_pars_vertex>
varying vec2 vUv;varying vec3 vN;varying vec3 vW;
void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;
#include <logdepthbuf_vertex>
}`;
const FHEAD=`#include <common>
#include <logdepthbuf_pars_fragment>
varying vec2 vUv;varying vec3 vN;varying vec3 vW;`;
function earthMat(day,night,clouds){return new THREE.ShaderMaterial({uniforms:{day:{value:day},night:{value:night},clouds:{value:clouds},t:{value:0}},vertexShader:VSH,
  fragmentShader:FHEAD+`uniform sampler2D day,night,clouds;uniform float t;
  void main(){
  #include <logdepthbuf_fragment>
  vec3 N=normalize(vN),L=normalize(-vW),V=normalize(cameraPosition-vW);float d=dot(N,L),lit=smoothstep(-0.12,0.28,d);
  vec3 dc=texture2D(day,vUv).rgb;float ca=texture2D(clouds,vUv+vec2(t,0.0)).a;
  vec3 col=mix(dc,vec3(1.0),ca*0.92)*lit*1.08;
  float ocean=step(dc.r+0.08,dc.b)*(1.0-ca);vec3 H=normalize(L+V);col+=vec3(1.0,0.92,0.78)*pow(max(dot(N,H),0.0),70.0)*ocean*lit*0.9;
  vec3 nl=texture2D(night,vUv).rgb*(1.0-smoothstep(-0.18,0.08,d))*(1.0-ca*0.85);col+=nl*1.4+dc*0.025;
  float rim=pow(1.0-max(dot(N,V),0.0),3.0);col+=vec3(0.35,0.6,1.0)*rim*clamp(d+0.3,0.0,1.0)*0.6;
  gl_FragColor=vec4(col,1.0);}`});}
function sunMat(map){return new THREE.ShaderMaterial({uniforms:{map:{value:map},t:{value:0}},vertexShader:VSH,
  fragmentShader:FHEAD+`uniform sampler2D map;uniform float t;
  void main(){
  #include <logdepthbuf_fragment>
  vec3 V=normalize(cameraPosition-vW);float mu=max(dot(normalize(vN),V),0.0);
  vec3 a=texture2D(map,vUv+vec2(t*0.004,0.0)).rgb,b=texture2D(map,vUv*2.0+vec2(-t*0.006,t*0.002)).rgb;
  vec3 c=mix(a,b,0.45);float limb=0.42+0.58*pow(mu,0.55);gl_FragColor=vec4(c*limb*1.12+vec3(0.08,0.04,0.0),1.0);}`});}
function atmoShell(R,rgb,strength){const col=new THREE.Color(rgb[0]/255,rgb[1]/255,rgb[2]/255);
  const front=new THREE.Mesh(new THREE.SphereGeometry(R*1.025,48,32),new THREE.ShaderMaterial({uniforms:{c:{value:col},s:{value:strength}},vertexShader:VSH,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    fragmentShader:FHEAD+`uniform vec3 c;uniform float s;void main(){
    #include <logdepthbuf_fragment>
    vec3 N=normalize(vN),V=normalize(cameraPosition-vW),L=normalize(-vW);float rim=pow(1.0-max(dot(N,V),0.0),2.6);float lit=clamp(dot(N,L)*0.9+0.35,0.0,1.0);gl_FragColor=vec4(c*rim*lit*s,1.0);}`}));
  const halo=new THREE.Mesh(new THREE.SphereGeometry(R*1.11,48,32),new THREE.ShaderMaterial({uniforms:{c:{value:col},s:{value:strength}},vertexShader:VSH,side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    fragmentShader:FHEAD+`uniform vec3 c;uniform float s;void main(){
    #include <logdepthbuf_fragment>
    vec3 N=normalize(vN),V=normalize(cameraPosition-vW),L=normalize(-vW);float h=pow(clamp(1.0+dot(N,V),0.0,1.0),5.0);float lit=clamp(dot(-N,L)*0.0+dot(N,L)*0.8+0.4,0.0,1.0);gl_FragColor=vec4(c*h*lit*s*0.9,1.0);}`}));
  const g=new THREE.Group();g.add(front,halo);return g;}
function nightTex(TW){const t=getTex('earth',TW),cv=document.createElement('canvas');cv.width=t.w;cv.height=t.h;const c=cv.getContext('2d'),img=c.createImageData(t.w,t.h),r=seeded(77);
  for(let j=0;j<t.h;j++){const lat=Math.abs(.5-(j+.5)/t.h)*PI;for(let i=0;i<t.w;i++){const q=j*t.w+i,R=t.d[q*3],G=t.d[q*3+1],Bb=t.d[q*3+2];
    const land=!(Bb>R+30)&&!(R>215&&G>215&&Bb>215);let v=0;
    if(land&&lat<1.15){const n=vnoise(i*.09,j*.09,3)*.7+vnoise(i*.35,j*.35,9)*.3;if(n>.6&&r()>.35)v=clamp((n-.6)*4.5);}
    img.data[q*4]=255*v;img.data[q*4+1]=190*v;img.data[q*4+2]=110*v;img.data[q*4+3]=255;}}
  c.putImageData(img,0,0);const tx=new THREE.CanvasTexture(cv);tx.wrapS=THREE.RepeatWrapping;return tx;}
function cloudTex(TW){const t=getTex('earthClouds',TW),cv=document.createElement('canvas');cv.width=t.w;cv.height=t.h;const c=cv.getContext('2d'),img=c.createImageData(t.w,t.h);
  for(let q=0;q<t.w*t.h;q++){img.data[q*4]=img.data[q*4+1]=img.data[q*4+2]=255;img.data[q*4+3]=t.a?t.a[q]:0;}c.putImageData(img,0,0);const tx=new THREE.CanvasTexture(cv);tx.wrapS=THREE.RepeatWrapping;return tx;}
/* Vintergatans band som himmelstextur, i samma koordinater som scenen */
function skyTex(W){const H=W/2,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d'),img=c.createImageData(W,H),e=23.44*D2R;
  const aN=192.85948*D2R,dN=27.12825*D2R,lN=122.93192*D2R,r=seeded(5);
  for(let j=0;j<H;j++){const th=(j+.5)/H*PI;for(let i=0;i<W;i++){const ph=(i+.5)/W*TAU,x=-Math.cos(ph)*Math.sin(th),y=Math.cos(th),z=Math.sin(ph)*Math.sin(th);
    const X=x,Y=-z,Z=y,xe=X,ye=Y*Math.cos(e)-Z*Math.sin(e),ze=Y*Math.sin(e)+Z*Math.cos(e),ra=Math.atan2(ye,xe),de=Math.asin(clamp(ze,-1,1));
    const sb=Math.sin(de)*Math.sin(dN)+Math.cos(de)*Math.cos(dN)*Math.cos(ra-aN),b=Math.asin(clamp(sb,-1,1));
    let l=lN-Math.atan2(Math.cos(de)*Math.sin(ra-aN),Math.sin(de)*Math.cos(dN)-Math.cos(de)*Math.sin(dN)*Math.cos(ra-aN));l=((l%TAU)+TAU)%TAU;const lc=l>PI?l-TAU:l;
    const bulge=Math.exp(-((lc/(32*D2R))**2)),wid=(7+9*bulge)*D2R,n=fbm(x*4+3,y*4,z*4,5),band=Math.exp(-((b/wid)**2))*(.45+.75*n)*(1+1.7*bulge);
    const dust=Math.abs(b)<(2.2+2*bulge)*D2R?clamp(1-(fbm(x*9,y*9,z*9+7,4)-.35)*1.6,.25,1):1;let v=band*dust*.55;
    const q=(j*W+i)*4;img.data[q]=clamp(v*(.75+.3*bulge))*255;img.data[q+1]=clamp(v*(.72+.15*bulge))*255;img.data[q+2]=clamp(v*(.9-.1*bulge))*255;img.data[q+3]=255;}}
  c.putImageData(img,0,0);for(let i=0;i<W*1.2;i++){c.fillStyle=`rgba(255,255,255,${.15+r()*.35})`;c.fillRect(r()*W,r()*H,1,1);}return new THREE.CanvasTexture(cv);}
/* ljusa stjärnor från katalogen, i scenens ekliptiska koordinater */
function catalogStars(){const e=23.44*D2R,pos=[],col=[],size=[];
  for(const s of SKY){const a=s[2]*15*D2R,d=s[3]*D2R,x=Math.cos(d)*Math.cos(a),y=Math.cos(d)*Math.sin(a),z=Math.sin(d),Y=y*Math.cos(e)+z*Math.sin(e),Z=-y*Math.sin(e)+z*Math.cos(e);
    pos.push(x,Z,-Y);const c=new THREE.Color(s[5]||'#ffffff');col.push(c.r,c.g,c.b);size.push(s[4]);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  return new THREE.Points(g,new THREE.PointsMaterial({size:3.2,sizeAttenuation:false,vertexColors:true,depthWrite:false,transparent:true,opacity:.95}));}
function upgradeTex(o){if(o.hi||o.star||o.gal||o.k==='halley'||S.lite)return;o.hi=true;const k=o.k;$('s3-msg').textContent='Laddar fler detaljer…';
  setTimeout(()=>{const m=o.mesh.material;
    if(k==='earth'&&m.uniforms){m.uniforms.day.value=texFor('earth',1024);m.uniforms.night.value=nightTex(1024);m.uniforms.clouds.value=cloudTex(1024);}
    else if(k==='sun'&&m.uniforms){m.uniforms.map.value=texFor('sun',1024);m.uniforms.map.value.wrapT=THREE.RepeatWrapping;}
    else if(m.map){const t=texFor(k,1024);m.map=t;if(m.bumpMap)m.bumpMap=t;m.needsUpdate=true;}
    $('s3-msg').textContent='';},60);}
