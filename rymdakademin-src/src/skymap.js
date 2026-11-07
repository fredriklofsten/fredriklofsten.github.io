/* ===================== Stjärnkartan ===================== */
const SKY=[
 ['polaris','Polstjärnan',2.53,89.26,1.98,'#fff0c8','Lilla björnen'],['yildun','Yildun',17.54,86.59,4.35,0,'Lilla björnen'],['epsumi','',16.77,82.04,4.2,0,'Lilla björnen'],
 ['zetaumi','',15.73,77.79,4.3,0,'Lilla björnen'],['etaumi','',16.29,75.76,4.95,0,'Lilla björnen'],['pherkad','Pherkad',15.35,71.83,3.0,0,'Lilla björnen'],['kochab','Kochab',14.85,74.16,2.08,'#ffd2a0','Lilla björnen'],
 ['dubhe','Dubhe',11.06,61.75,1.79,'#ffe0b0','Karlavagnen'],['merak','Merak',11.03,56.38,2.37,0,'Karlavagnen'],['phecda','Phecda',11.9,53.69,2.44,0,'Karlavagnen'],['megrez','Megrez',12.26,57.03,3.3,0,'Karlavagnen'],
 ['alioth','Alioth',12.9,55.96,1.77,0,'Karlavagnen'],['mizar','Mizar',13.4,54.93,2.04,0,'Karlavagnen'],['alkaid','Alkaid',13.79,49.31,1.86,'#cfe0ff','Karlavagnen'],
 ['caph','Caph',.15,59.15,2.28,0,'Kassiopeja'],['schedar','Schedar',.68,56.54,2.24,'#ffd8a8','Kassiopeja'],['gammacas','Gamma Cassiopeiae',.95,60.72,2.47,'#cfe0ff','Kassiopeja'],['ruchbah','Ruchbah',1.43,60.24,2.68,0,'Kassiopeja'],['segin','Segin',1.91,63.67,3.37,0,'Kassiopeja'],
 ['betelgeuse','Betelgeuse',5.92,7.41,.5,'#ffab7a','Orion'],['bellatrix','Bellatrix',5.42,6.35,1.64,'#cfe0ff','Orion'],['mintaka','Mintaka',5.53,-.3,2.23,0,'Orion'],['alnilam','Alnilam',5.6,-1.2,1.69,'#cfe0ff','Orion'],
 ['alnitak','Alnitak',5.68,-1.94,1.77,'#cfe0ff','Orion'],['saiph','Saiph',5.8,-9.67,2.06,0,'Orion'],['rigel','Rigel',5.24,-8.2,.13,'#bcd4ff','Orion'],['meissa','Meissa',5.59,9.93,3.33,0,'Orion'],
 ['deneb','Deneb',20.69,45.28,1.25,'#f4f8ff','Svanen'],['sadr','Sadr',20.37,40.26,2.23,0,'Svanen'],['albireo','Albireo',19.51,27.96,3.05,'#ffd8a0','Svanen'],['gienah','Gienah',20.77,33.97,2.48,0,'Svanen'],['deltacyg','Delta Cygni',19.75,45.13,2.87,0,'Svanen'],
 ['vega','Vega',18.62,38.78,.03,'#e4ecff','Lyran'],['altair','Altair',19.85,8.87,.76,0,'Örnen'],['aldebaran','Aldebaran',4.6,16.51,.86,'#ffb27a','Oxen'],['capella','Capella',5.28,46,.08,'#fff2c0','Kusken'],
 ['castor','Castor',7.58,31.89,1.58,0,'Tvillingarna'],['pollux','Pollux',7.76,28.03,1.14,'#ffd8a8','Tvillingarna'],['procyon','Procyon',7.66,5.22,.34,0,'Lilla hunden'],['sirius','Sirius',6.75,-16.72,-1.46,'#d8e6ff','Stora hunden'],
 ['regulus','Regulus',10.14,11.97,1.35,'#dde8ff','Lejonet'],['algieba','Algieba',10.33,19.84,2,'#ffd8a8','Lejonet'],['denebola','Denebola',11.82,14.57,2.14,0,'Lejonet'],
 ['arcturus','Arcturus',14.26,19.18,-.05,'#ffc58a','Björnvaktaren'],['spica','Spica',13.42,-11.16,.97,'#cfe0ff','Jungfrun'],['antares','Antares',16.49,-26.43,1,'#ff8a6a','Skorpionen'],
 ['mirfak','Mirfak',3.41,49.86,1.79,'#fff2d0','Perseus'],['algol','Algol',3.14,40.96,2.1,0,'Perseus'],['alpheratz','Alpheratz',.14,29.09,2.06,0,'Andromeda'],
 ['markab','Markab',23.08,15.21,2.48,0,'Pegasus'],['scheat','Scheat',23.06,28.08,2.42,'#ffc8a0','Pegasus'],['algenib','Algenib',.22,15.18,2.83,0,'Pegasus']];
const SKYLINES=[['polaris','yildun'],['yildun','epsumi'],['epsumi','zetaumi'],['zetaumi','etaumi'],['etaumi','pherkad'],['pherkad','kochab'],['kochab','zetaumi'],
 ['alkaid','mizar'],['mizar','alioth'],['alioth','megrez'],['megrez','phecda'],['phecda','merak'],['merak','dubhe'],['dubhe','megrez'],
 ['caph','schedar'],['schedar','gammacas'],['gammacas','ruchbah'],['ruchbah','segin'],
 ['bellatrix','meissa'],['meissa','betelgeuse'],['betelgeuse','alnitak'],['alnitak','alnilam'],['alnilam','mintaka'],['mintaka','bellatrix'],['mintaka','rigel'],['alnitak','saiph'],
 ['deneb','sadr'],['sadr','albireo'],['gienah','sadr'],['sadr','deltacyg'],['castor','pollux'],['regulus','algieba'],['algieba','denebola'],['denebola','regulus'],
 ['alpheratz','scheat'],['scheat','markab'],['markab','algenib'],['algenib','alpheratz'],['mirfak','algol']];
const SKYDSO=[['m31','Andromedagalaxen',.71,41.27,'Andromeda'],['m42','Orionnebulosan',5.59,-5.39,'Orion'],['m45','Plejaderna',3.79,24.1,'Oxen']];
const CLAB=[['Karlavagnen',['dubhe','megrez','alioth','phecda','merak']],['Lilla björnen',['kochab','pherkad','zetaumi']],['Kassiopeja',['schedar','gammacas','ruchbah']],['Orion',['alnilam','betelgeuse','rigel']],
 ['Svanen',['sadr','deneb','albireo']],['Lejonet',['regulus','algieba','denebola']],['Pegasus',['markab','scheat','algenib','alpheratz']],['Tvillingarna',['castor','pollux']],['Perseus',['mirfak','algol']]];
const SKYBY=Object.fromEntries(SKY.map(s=>[s[0],s]));
const LAT=59.33,LON=18.07,D2R=PI/180;
const TASKS=[['polaris','Tryck på Polstjärnan. Den står nästan stilla i norr.'],['dubhe','Hitta Dubhe, en av pekarstjärnorna längst fram i Karlavagnen.'],['capella','Hitta Capella, en ljus gul stjärna som alltid syns från Sverige.'],['deneb','Hitta Deneb, den ljusaste stjärnan i Svanen.'],['spin','Dra i tidsreglaget och se himlen vrida sig runt Polstjärnan.'],['planet','Hitta en planet på kartan. Planeter flyttar sig mellan stjärnorna och syns nära ekliptikan.']];
const SKYQ=[
 ['Var på en rund stjärnkarta finns horisonten?','Längs kanten',['I mitten','Längst upp','Den finns inte med'],'Mitten är zenit, punkten rakt ovanför dig.'],
 ['Varför är öster och väster omkastade på stjärnkartan?','Man håller den över huvudet',['Det är ett tryckfel','Stjärnorna går baklänges','Kartan är gjord i Australien'],'När du tittar uppåt hamnar öster till vänster.'],
 ['Vad betyder en större prick på kartan?','Stjärnan lyser starkare',['Stjärnan är närmare','Stjärnan är större på riktigt','Det är en planet'],'Prickens storlek visar ljusstyrkan, inte storleken.'],
 ['Vilken magnitud betyder ljusast?','−1,5',['2','4','6'],'Ju lägre tal, desto ljusare. Sirius har −1,5.'],
 ['Vad är ekliptikan?','Vägen som solen och planeterna följer',['Himlens ekvator','En stjärnbild','Vintergatans mitt'],'Planeter syns alltid nära ekliptikan.'],
 ['Hur mycket vrider sig himlen på en timme?','Ungefär 15°',['Ungefär 1°','Ungefär 90°','Ungefär 180°'],'360° delat på 24 timmar blir 15° i timmen.']];
const LESSON=[
 ['Vad är en stjärnkarta?','En stjärnkarta är en karta över himlen. Den runda sorten visar hela himlen ovanför dig en viss kväll. Kanten är horisonten, där himlen möter marken. Mitten är punkten rakt ovanför ditt huvud, som kallas zenit.',
  '<circle cx="60" cy="42" r="32" fill="#141a52" stroke="#a6acdf" stroke-width="2"/><circle cx="60" cy="42" r="2.5" fill="#ffc94a"/><text x="60" y="55" text-anchor="middle" fill="#ffc94a" font-size="8">zenit</text><text x="60" y="88" text-anchor="middle" fill="#a6acdf" font-size="8">kanten = horisonten</text>'],
 ['Håll kartan över huvudet','På en vanlig karta ligger öster till höger. På en stjärnkarta ligger öster till vänster, eftersom du håller den över huvudet och tittar uppåt. Vänd kartan så att väderstrecket du tittar mot hamnar nedåt, mot marken.',
  '<circle cx="60" cy="45" r="34" fill="#141a52" stroke="#a6acdf" stroke-width="2"/><g font-size="11" font-weight="800" text-anchor="middle"><text x="60" y="20" fill="#eef0ff">N</text><text x="60" y="78" fill="#eef0ff">S</text><text x="34" y="49" fill="#ff7aa8">Ö</text><text x="86" y="49" fill="#ff7aa8">V</text></g>'],
 ['Stora och små prickar','Ju större prick, desto starkare lyser stjärnan. Astronomer mäter ljusstyrka i magnitud, och ju lägre tal, desto ljusare. Sirius har −1,5 och de svagaste stjärnorna du ser utan kikare har ungefär 6.',
  '<g fill="#fff"><circle cx="18" cy="40" r="9"/><circle cx="46" cy="40" r="6"/><circle cx="72" cy="40" r="3.6"/><circle cx="96" cy="40" r="1.8"/></g><g font-size="9" fill="#a6acdf" text-anchor="middle"><text x="18" y="66">−1</text><text x="46" y="66">1</text><text x="72" y="66">3</text><text x="96" y="66">5</text></g>'],
 ['Linjer och namn','Linjerna binder ihop stjärnor till stjärnbilder. Det finns 88 officiella stjärnbilder som delar upp hela himlen, ungefär som länder på en världskarta. Många ljusa stjärnor har egna namn, ofta från arabiskan.',
  '<path d="M10 30 30 60 55 38 80 58 108 28" stroke="#9fd0ff" stroke-width="1.6" fill="none"/><g fill="#fff"><circle cx="10" cy="30" r="3"/><circle cx="30" cy="60" r="3.4"/><circle cx="55" cy="38" r="3.6"/><circle cx="80" cy="58" r="3.6"/><circle cx="108" cy="28" r="3.2"/></g>'],
 ['Himlens adresser','Varje stjärna har en adress på himlen, ungefär som latitud och longitud på jorden. Deklination säger hur långt norr eller söder om himmelsekvatorn stjärnan ligger, i grader. Rektascension mäts i timmar, från 0 till 24, runt himlen.',
  '<g stroke="#5a64b8" stroke-width="1" fill="none"><path d="M5 20h110M5 45h110M5 70h110"/><path d="M20 5v80M50 5v80M80 5v80M110 5v80"/></g><path d="M5 45h110" stroke="#5fe0b0" stroke-width="2"/><circle cx="65" cy="32" r="4" fill="#ffc94a"/><text x="70" y="27" font-size="8" fill="#ffc94a">stjärna</text><text x="8" y="56" font-size="7" fill="#5fe0b0">himmelsekvatorn</text>'],
 ['Ekliptikan','Den streckade linjen är ekliptikan, vägen som solen, månen och planeterna följer över himlen. Ser du en klar prick nära ekliptikan som inte finns med på kartan är det troligen en planet.',
  '<path d="M5 70Q60 10 115 70" stroke="#ffb05a" stroke-width="2" stroke-dasharray="5 4" fill="none"/><circle cx="35" cy="42" r="6" fill="#ffc94a"/><circle cx="78" cy="38" r="3.5" fill="#e8bd78"/><circle cx="96" cy="50" r="3" fill="#d0663e"/>'],
 ['Himlen snurrar','Jorden snurrar, så hela himlen ser ut att vrida sig runt Polstjärnan, ungefär 15° i timmen. Varje kväll går stjärnorna upp ungefär 4 minuter tidigare, så himlen ändras med årstiderna. Därför ställer man in datum och tid på en vridbar stjärnkarta.',
  '<circle cx="60" cy="45" r="4" fill="#fff0c8"/><g stroke="#a6acdf" fill="none" stroke-width="1.4" stroke-dasharray="3 3"><circle cx="60" cy="45" r="18"/><circle cx="60" cy="45" r="32"/></g><path d="M88 28a32 32 0 0 0-18-13" stroke="#ff7aa8" stroke-width="2.4" fill="none"/><path d="m70 11-1 6 6 0" stroke="#ff7aa8" stroke-width="2.4" fill="none"/><circle cx="78" cy="45" r="2" fill="#fff"/><circle cx="60" cy="13" r="2" fill="#fff"/>'],
 ['Tips för stjärnskådning','Ge ögonen 20–30 minuter att vänja sig vid mörkret. Använd en röd lampa när du läser kartan, eftersom rött ljus inte förstör mörkerseendet. Leta upp ett ställe långt från gatlampor.',
  '<rect x="30" y="30" width="44" height="22" rx="6" fill="#3a2a40"/><rect x="72" y="33" width="10" height="16" rx="3" fill="#ff4a4a"/><path d="M82 34 112 22v38L82 48z" fill="#ff4a4a" opacity=".35"/>']];
const WHY=[['Hitta rätt','Med Polstjärnan kan du hitta norr utan kompass eller mobil.','polaris'],['Hitta planeter och galaxer','Kartan visar var du ska titta för att se Jupiter, Andromedagalaxen eller Plejaderna.','andromeda'],
 ['Förstå årstiderna','Olika stjärnbilder syns olika tider på året, som Orion på vintern och Svanen på sommaren.','betelgeuse'],['Historien','Sjöfarare har navigerat efter stjärnorna i tusentals år, och många kalendrar bygger på himlen.','sirius'],
 ['Använda teleskop','Teleskop och stjärnappar använder samma himmelsadresser som kartan.','saturn'],['Framtidsjobb','Astronomer och rymdingenjörer måste kunna hitta rätt på himlen.','earth']];


/* Planeter och månen: JPL:s ungefärliga banelement (J2000) med ändring per sekel */
const PEL={mercury:[.38709927,.00000037,.20563593,.00001906,7.00497902,-.00594749,252.2503235,149472.67411175,77.45779628,.16047689,48.33076593,-.12534081],
 venus:[.72333566,.0000039,.00677672,-.00004107,3.39467605,-.0007889,181.9790995,58517.81538729,131.60246718,.00268329,76.67984255,-.27769418],
 earth:[1.00000261,.00000562,.01671123,-.00004392,-.00001531,-.01294668,100.46457166,35999.37244981,102.93768193,.32327364,0,0],
 mars:[1.52371034,.00001847,.0933941,.00007882,1.84969142,-.00813131,-4.55343205,19140.30268499,-23.94362959,.44441088,49.55953891,-.29257343],
 jupiter:[5.202887,-.00011607,.04838624,-.00013253,1.30439695,-.00183714,34.39644051,3034.74612775,14.72847983,.21252668,100.47390909,.20469106],
 saturn:[9.53667594,-.0012506,.05386179,-.00050991,2.48599187,.00193609,49.95424423,1222.49362201,92.59887831,-.41897216,113.66242448,-.28867794],
 uranus:[19.18916464,-.00196176,.04725744,-.00004397,.77263783,-.00242939,313.23810451,428.48202785,170.9542763,.40805281,74.01692503,.04240589],
 neptune:[30.06992276,.00026291,.00859048,.00005105,1.77004347,.00035372,-55.12002969,218.45945325,44.96476227,-.32241464,131.78422574,-.00508664]};
const SKYPL=[['mercury','#d8cfc4',-.2],['venus','#fff4d8',-4.2],['mars','#ff8a5a',.4],['jupiter','#ffe6c0',-2.3],['saturn','#f2dca0',.7],['uranus','#b8f0f0',5.7],['neptune','#8aa8ff',7.8]];
function helio(k,T){const e=PEL[k],a=e[0]+e[1]*T,ec=e[2]+e[3]*T,I=(e[4]+e[5]*T)*D2R,L=e[6]+e[7]*T,w=e[8]+e[9]*T,O=(e[10]+e[11]*T)*D2R,om=(w-(e[10]+e[11]*T))*D2R;
  let M=((L-w)%360+540)%360-180;M*=D2R;let E=M;for(let i=0;i<15;i++)E-=(E-ec*Math.sin(E)-M)/(1-ec*Math.cos(E));
  const xp=a*(Math.cos(E)-ec),yp=a*Math.sqrt(1-ec*ec)*Math.sin(E),co=Math.cos(om),so=Math.sin(om),cO=Math.cos(O),sO=Math.sin(O),cI=Math.cos(I);
  return[(co*cO-so*sO*cI)*xp+(-so*cO-co*sO*cI)*yp,(co*sO+so*cO*cI)*xp+(-so*sO+co*cO*cI)*yp,(so*Math.sin(I))*xp+(co*Math.sin(I))*yp];}
function eclXYZtoEq(x,y,z){const e=23.43928*D2R,ye=y*Math.cos(e)-z*Math.sin(e),ze=y*Math.sin(e)+z*Math.cos(e);return[((Math.atan2(ye,x)/D2R+360)%360)/15,Math.atan2(ze,Math.hypot(x,ye))/D2R];}
function planetEq(k,date){const T=(date.getTime()-Date.UTC(2000,0,1,12))/(864e5*36525),p=helio(k,T),E=helio('earth',T);return eclXYZtoEq(p[0]-E[0],p[1]-E[1],p[2]-E[2]);}
function moonPos(date){const T=(date.getTime()-Date.UTC(2000,0,1,12))/(864e5*36525),S=x=>Math.sin(x*D2R);
  const lam=218.32+481267.881*T+6.29*S(134.9+477198.85*T)-1.27*S(259.2-413335.38*T)+.66*S(235.7+890534.23*T)+.21*S(269.9+954397.7*T)-.19*S(357.5+35999.05*T)-.11*S(186.6+966404.05*T);
  const bet=5.13*S(93.3+483202.03*T)+.28*S(228.2+960400.87*T)-.28*S(318.3+6003.18*T)-.17*S(217.6-407332.2*T);
  const l=lam*D2R,b=bet*D2R,[ra,dec]=eclXYZtoEq(Math.cos(b)*Math.cos(l),Math.cos(b)*Math.sin(l),Math.sin(b));
  const d=(date.getTime()-Date.UTC(2000,0,1,12))/864e5,g=(357.528+.9856003*d)*D2R,ls=280.46+.9856474*d+1.915*Math.sin(g)+.02*Math.sin(2*g);
  const el=((lam-ls)%360+360)%360;return{ra,dec,frac:(1-Math.cos(el*D2R))/2,wax:el<180};}

const SM={doy:0,min:21*60,lines:true,names:true,ecl:true,mw:true,grid:false,hits:[],info:null,q:0,qScore:0,qAns:null};
function smDate(){const y=new Date().getFullYear(),d=new Date(y,0,1);d.setDate(1+SM.doy);d.setHours(0,SM.min,0,0);return d;}
function lst(date){const d=(date.getTime()-Date.UTC(2000,0,1,12))/864e5;return((280.46061837+360.98564736629*d+LON)%360+360)%360;}
function altaz(raH,dec,L){const H=(L-raH*15)*D2R,dl=dec*D2R,ph=LAT*D2R;const sa=Math.sin(ph)*Math.sin(dl)+Math.cos(ph)*Math.cos(dl)*Math.cos(H),alt=Math.asin(sa);
  const az=Math.atan2(-Math.cos(dl)*Math.sin(H),Math.sin(dl)*Math.cos(ph)-Math.cos(dl)*Math.cos(H)*Math.sin(ph));return[alt/D2R,(az/D2R+360)%360];}
function eclToEq(lam){const e=23.44*D2R,l=lam*D2R;return[((Math.atan2(Math.sin(l)*Math.cos(e),Math.cos(l))/D2R+360)%360)/15,Math.asin(Math.sin(e)*Math.sin(l))/D2R];}
function galToEq(l){const aN=192.85948*D2R,dN=27.12825*D2R,lN=122.93192*D2R,x=lN-l*D2R;const dec=Math.asin(Math.cos(dN)*Math.cos(x));
  const ra=aN+Math.atan2(Math.sin(x),-Math.sin(dN)*Math.cos(x));return[(((ra/D2R)%360+360)%360)/15,dec/D2R];}
function sunEq(date){const d=(date.getTime()-Date.UTC(2000,0,1,12))/864e5,g=(357.528+.9856003*d)*D2R,L=280.46+.9856474*d;return eclToEq(L+1.915*Math.sin(g)+.02*Math.sin(2*g));}
const dirName=az=>['norr','nordost','öster','sydost','söder','sydväst','väster','nordväst'][Math.round(az/45)%8];
function drawSky(){const cv=$('skymap'),W=Math.round(cv.clientWidth*DPR);if(!W)return;if(cv.width!==W)cv.width=cv.height=W;
  const c=cv.getContext('2d'),cx=W/2,R=W/2-24*DPR,date=smDate(),L=lst(date),[sra,sdec]=sunEq(date),[salt,saz]=altaz(sra,sdec,L);
  const P=(alt,az)=>{const r=(90-alt)/90*R,a=az*D2R;return[cx-r*Math.sin(a),cx-r*Math.cos(a)];};
  c.clearRect(0,0,W,W);const day=clamp((salt+12)/12);
  const bg=c.createRadialGradient(cx,cx,0,cx,cx,R);bg.addColorStop(0,day>.9?'#3d6fc4':`rgb(${20+day*40},${26+day*80},${70+day*120})`);bg.addColorStop(1,day>.9?'#8ab8f0':`rgb(${12+day*90},${16+day*120},${48+day*150})`);
  c.fillStyle=bg;c.beginPath();c.arc(cx,cx,R,0,TAU);c.fill();
  c.save();c.beginPath();c.arc(cx,cx,R,0,TAU);c.clip();const fade=1-day*.85;
  const poly=(pts,style,w,dash)=>{c.strokeStyle=style;c.lineWidth=w;c.setLineDash(dash||[]);c.beginPath();let pen=false;for(const [ra,dec] of pts){const [al,az]=altaz(ra,dec,L);if(al<-2){pen=false;continue;}const [x,y]=P(al,az);pen?c.lineTo(x,y):c.moveTo(x,y);pen=true;}c.stroke();c.setLineDash([]);};
  if(SM.mw){const pts=[];for(let l=0;l<=360;l+=2)pts.push(galToEq(l));c.lineCap='round';poly(pts,`rgba(190,200,255,${.07*fade})`,46*DPR);poly(pts,`rgba(210,220,255,${.08*fade})`,22*DPR);}
  if(SM.grid){for(const dec of [0,30,60]){const pts=[];for(let h=0;h<=24;h+=.25)pts.push([h,dec]);poly(pts,dec===0?`rgba(95,224,176,${.7*fade})`:`rgba(120,140,220,${.45*fade})`,DPR*(dec===0?1.6:1));}
    for(let h=0;h<24;h+=2){const pts=[];for(let d=-30;d<=88;d+=3)pts.push([h,d]);poly(pts,`rgba(120,140,220,${.35*fade})`,DPR);}}
  if(SM.ecl){const pts=[];for(let l=0;l<=360;l+=3)pts.push(eclToEq(l));poly(pts,`rgba(255,176,90,${.85*fade})`,1.6*DPR,[6*DPR,5*DPR]);}
  const pos={};for(const s of SKY){const [al,az]=altaz(s[2],s[3],L);pos[s[0]]=[al,az,...P(al,az)];}
  if(SM.lines){c.strokeStyle=`rgba(159,208,255,${.55*fade})`;c.lineWidth=1.2*DPR;c.beginPath();for(const [a,b] of SKYLINES){const A=pos[a],Bp=pos[b];if(A[0]<0||Bp[0]<0)continue;c.moveTo(A[2],A[3]);c.lineTo(Bp[2],Bp[3]);}c.stroke();
    c.setLineDash([3*DPR,5*DPR]);c.strokeStyle=`rgba(255,201,74,${.45*fade})`;c.beginPath();for(const [a,b] of [['vega','deneb'],['deneb','altair'],['altair','vega']]){const A=pos[a],Bp=pos[b];if(A[0]<0||Bp[0]<0)continue;c.moveTo(A[2],A[3]);c.lineTo(Bp[2],Bp[3]);}c.stroke();c.setLineDash([]);}
  SM.hits=[];
  for(const d of SKYDSO){const [al,az]=altaz(d[2],d[3],L);if(al<0)continue;const [x,y]=P(al,az);
    if(d[0]==='m45'){const r=seeded(4);c.fillStyle=`rgba(220,230,255,${fade})`;for(let i=0;i<7;i++){c.beginPath();c.arc(x+(r()-.5)*10*DPR,y+(r()-.5)*7*DPR,1.1*DPR,0,TAU);c.fill();}}
    else{const g=c.createRadialGradient(x,y,0,x,y,9*DPR);g.addColorStop(0,`rgba(240,220,255,${.8*fade})`);g.addColorStop(1,'rgba(240,220,255,0)');c.fillStyle=g;c.beginPath();c.ellipse(x,y,(d[0]==='m31'?11:7)*DPR,(d[0]==='m31'?4:6)*DPR,.6,0,TAU);c.fill();}
    SM.hits.push(['dso',d,x,y,al,az]);}
  for(const s of SKY){const [al,az,x,y]=pos[s[0]];if(al<0)continue;const r=Math.max(.9,3.3-s[4]*.62)*DPR;
    if(s[4]<1.2){const g=c.createRadialGradient(x,y,0,x,y,r*3);g.addColorStop(0,`rgba(255,255,255,${.35*fade})`);g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r*3,0,TAU);c.fill();}
    c.globalAlpha=Math.max(.15,fade);c.fillStyle=s[5]||'#ffffff';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.globalAlpha=1;
    if(SM.info&&SM.info[0]===s[0]){c.strokeStyle='#ffc94a';c.lineWidth=2*DPR;c.beginPath();c.arc(x,y,r+6*DPR,0,TAU);c.stroke();}
    SM.hits.push(['star',s,x,y,al,az]);}
  const pls=[];for(const [k,col,mag] of SKYPL){const [ra,dec]=planetEq(k,date),[al,az]=altaz(ra,dec,L);if(al<0)continue;const [x,y]=P(al,az),r=Math.max(1.6,4.2-mag*.55)*DPR;
    const g=c.createRadialGradient(x,y,0,x,y,r*3.2);g.addColorStop(0,col);g.addColorStop(.35,col+'88');g.addColorStop(1,col+'00');c.fillStyle=g;c.beginPath();c.arc(x,y,r*3.2,0,TAU);c.fill();
    c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();if(k==='saturn'){c.strokeStyle=col;c.lineWidth=1.2*DPR;c.beginPath();c.ellipse(x,y,r*2.2,r*.8,-.4,0,TAU);c.stroke();}
    c.strokeStyle='rgba(255,201,74,.85)';c.lineWidth=1.2*DPR;c.setLineDash([2*DPR,2*DPR]);c.beginPath();c.arc(x,y,r+5*DPR,0,TAU);c.stroke();c.setLineDash([]);
    if(SM.info&&SM.info[0]===k){c.strokeStyle='#ffc94a';c.lineWidth=2*DPR;c.beginPath();c.arc(x,y,r+9*DPR,0,TAU);c.stroke();}
    pls.push([k,al,az]);SM.hits.push(['planet',[k,B[k].name,ra,dec,mag],x,y,al,az]);}
  const mo=moonPos(date),[mal,maz]=altaz(mo.ra,mo.dec,L);
  if(mal>-1){const [x,y]=P(Math.max(0,mal),maz),r=7*DPR;c.fillStyle='#2a2f55';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
    c.save();c.beginPath();c.arc(x,y,r,0,TAU);c.clip();c.fillStyle='#f4f2e8';const k2=1-2*mo.frac,side=mo.wax?1:-1;
    c.beginPath();c.arc(x,y,r,-PI/2,PI/2,side<0);c.ellipse(x,y,Math.abs(k2)*r,r,0,PI/2,-PI/2,(k2>0)===(side>0));c.fill();c.restore();
    if(SM.info&&SM.info[0]==='moon'){c.strokeStyle='#ffc94a';c.lineWidth=2*DPR;c.beginPath();c.arc(x,y,r+5*DPR,0,TAU);c.stroke();}
    SM.hits.push(['moon',['moon','Månen',mo.ra,mo.dec,-12,mo],x,y,mal,maz]);}
  SM.visPl=pls;SM.moon={...mo,alt:mal,az:maz};
  c.textAlign='center';
  if(SM.names){c.font=`800 ${10.5*DPR}px Nunito,sans-serif`;c.fillStyle=`rgba(255,201,74,${Math.max(.5,fade)})`;
    for(const h of SM.hits){if(h[0]==='planet'||h[0]==='moon'){const up=h[0]==='planet'&&(h[1][0]==='neptune'||h[1][0]==='uranus');c.fillText(h[1][1],h[2],h[3]+(up?-12:h[0]==='moon'?20:16)*DPR);}}}
  if(SM.names){c.font=`700 ${10*DPR}px Nunito,sans-serif`;c.fillStyle=`rgba(238,240,255,${.85*Math.max(.3,fade)})`;
    for(const s of SKY){const [al,,x,y]=pos[s[0]];if(al>0&&s[1]&&(s[4]<1.6||s[0]==='polaris'))c.fillText(s[1],x,y-7*DPR);}
    c.font=`800 ${10.5*DPR}px Fredoka,Nunito,sans-serif`;c.fillStyle=`rgba(255,122,168,${.9*Math.max(.3,fade)})`;
    for(const [n,ids] of CLAB){const v=ids.map(i=>pos[i]).filter(p=>p[0]>3);if(v.length<ids.length)continue;c.fillText(n.toUpperCase(),v.reduce((a,p)=>a+p[2],0)/v.length,v.reduce((a,p)=>a+p[3],0)/v.length+16*DPR);}}
  if(salt>-1){const [x,y]=P(Math.max(0,salt),saz);const g=c.createRadialGradient(x,y,0,x,y,20*DPR);g.addColorStop(0,'#fffbe0');g.addColorStop(.3,'#ffc94a');g.addColorStop(1,'rgba(255,201,74,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,20*DPR,0,TAU);c.fill();}
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=DPR;c.beginPath();c.moveTo(cx-5*DPR,cx);c.lineTo(cx+5*DPR,cx);c.moveTo(cx,cx-5*DPR);c.lineTo(cx,cx+5*DPR);c.stroke();
  c.restore();
  c.strokeStyle='#a6acdf';c.lineWidth=2*DPR;c.beginPath();c.arc(cx,cx,R,0,TAU);c.stroke();
  c.font=`800 ${14*DPR}px Fredoka,Nunito,sans-serif`;c.textBaseline='middle';
  [['N',0],['Ö',90],['S',180],['V',270]].forEach(([t,az])=>{const a=az*D2R,r=R+13*DPR;c.fillStyle=(t==='Ö'||t==='V')?'#ff7aa8':'#eef0ff';c.fillText(t,cx-r*Math.sin(a),cx-r*Math.cos(a));});
  c.textBaseline='alphabetic';
  $('sky-when').textContent=date.toLocaleDateString('sv-SE',{day:'numeric',month:'long'})+' kl. '+date.toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
  const vp=(SM.visPl||[]).filter(p=>SKYPL.find(q=>q[0]===p[0])[2]<6);$('sky-planets').innerHTML=vp.length?'Planeter ovanför horisonten: '+vp.map(p=>`<b>${B[p[0]].name}</b> (${dirName(p[2])}, ${nf(p[1],0)}°)`).join(', '):'Inga planeter som syns med blotta ögat är ovanför horisonten nu.';
  $('sky-day').hidden=salt<-6;$('sky-day').textContent=salt>0?'Solen är uppe, så det är ljust och stjärnorna syns inte. Men de finns där! Dra tiden till kvällen.':'Det skymmer. Bara de ljusaste stjärnorna syns ännu.';}
function skyInfo(){const box=$('sky-info');if(!SM.info){box.innerHTML='<p class="lead">Tryck på en stjärna på kartan för att se vad den heter och var du hittar den.</p>';return;}
  const [kind,d,,,al,az]=SM.info.hit,name=d[1]||'En svag stjärna',circ=kind==='star'&&d[3]>90-LAT;
  if(kind==='planet'||kind==='moon'){const k=d[0];let t;
    if(kind==='moon'){const m=d[5];t=`Månen. Just nu ${nf(Math.max(0,al),0)}° över horisonten, åt ${dirName(az)}. Den är ${nf(m.frac*100,0)} % belyst och ${m.frac>.97?'nästan full':m.frac<.03?'nästan ny':m.wax?'växande, alltså blir den större för varje kväll':'avtagande, alltså blir den mindre för varje kväll'}.`;}
    else t=`${name} är en planet, inte en stjärna. Just nu ${nf(al,0)}° över horisonten, åt ${dirName(az)}. ${d[4]<-1?'Den lyser starkare än alla stjärnor.':d[4]<1.5?'Den syns tydligt med blotta ögat.':d[4]<6?'Den är svår att se utan kikare.':'Den syns bara i teleskop.'} Planeter blinkar mindre än stjärnor och flyttar sig långsamt mellan dem från natt till natt.`;
    box.innerHTML=`<div class="sky-card pop"><div><b>${name}</b><p>${t}</p><button class="linkbtn" data-go="${k}" style="margin-top:6px">Läs mer om ${name}</button></div>${sayBtn(t)}</div>`;return;}
  const txt=kind==='star'?`${name} i ${d[6]}. Magnitud ${nf(d[4],2)}. Just nu ${nf(al,0)}° över horisonten, åt ${dirName(az)}.${circ?' Den går aldrig ner från Sverige.':''}`:`${name} i ${d[4]}. Just nu ${nf(al,0)}° över horisonten, åt ${dirName(az)}.`;
  box.innerHTML=`<div class="sky-card pop" data-read><div><b>${name}</b><p>${txt.replace(name+' i ','I stjärnbilden ')}</p></div>${sayBtn(txt)}</div>`;}
function renderTasks(){$('sky-tasks').innerHTML=TASKS.map(([id,t])=>{const ok=S.skyTasks.includes(id);return `<li class="${ok?'ok':''}"><span class="tick">${ok?'✓':''}</span>${t}</li>`;}).join('');}
function doneTask(id,el){if(S.skyTasks.includes(id))return;S.skyTasks.push(id);SFX.right();addXP(5,el);renderTasks();if(S.skyTasks.length===TASKS.length)toast('Alla uppdrag klara!');}
function renderSkyQ(){const box=$('sky-quiz');if(SM.q>=SKYQ.length){const ok=SM.qScore>=5;if(ok&&!S.skyQuiz){S.skyQuiz=true;save();addXP(20,box);checkPathKarta();}
    box.innerHTML=`<div class="result pop">${nova(ok?'happy':'sad')}<h3 style="font-size:1.4rem">${SM.qScore} av ${SKYQ.length} rätt</h3><p>${ok?'Du kan läsa en stjärnkarta!':'Läs stegen igen och gör ett nytt försök. Du behöver 5 rätt.'}</p><button class="primary" id="skq-again">Gör lärkollen igen</button></div>`;return;}
  const [q,a,w,ex]=SKYQ[SM.q];if(!SM.opts)SM.opts=shuffle([a,...w]);const fb=SM.qAns;
  box.innerHTML=`<div class="q-head"><span>Fråga ${SM.q+1} av ${SKYQ.length}</span><span>${SM.qScore} rätt</span></div><div style="display:flex;gap:10px;align-items:center;justify-content:space-between;margin:8px 0 12px"><h3 style="font-size:1.25rem">${q}</h3>${sayBtn(q+' '+SM.opts.join(', '))}</div>
    <div class="opts">${SM.opts.map(o=>{let cl='';if(fb){if(o===a)cl='right';else if(o===fb)cl='wrong';}return `<button class="opt ${cl}" data-skq="${encodeURIComponent(o)}" ${fb?'disabled':''}>${o}</button>`;}).join('')}</div>
    ${fb?`<div class="feedback ${fb===a?'ok':'no'} pop" style="margin-top:12px">${nova(fb===a?'happy':'sad')}<div><b>${fb===a?'Rätt!':'Svaret är: '+a}</b><p>${ex}</p></div></div><button class="primary" id="skq-next" style="margin-top:12px;width:100%">${SM.q+1<SKYQ.length?'Nästa fråga':'Se resultat'}</button>`:''}`;}
function buildSkyView(){
  $('sky-why').innerHTML=WHY.map(([h,t,k])=>`<div class="why">${art(k)}<div><b>${h}</b><p>${t}</p></div></div>`).join('');
  $('sky-why-say').innerHTML=sayBtn('Varför är det bra att kunna läsa en stjärnkarta? '+WHY.map(([h,t])=>h+'. '+t).join(' '),'Läs upp');
  $('sky-steps').innerHTML=LESSON.map(([h,t,svg],i)=>`<li class="step"><svg viewBox="0 0 120 92" aria-hidden="true">${svg}</svg><div><span class="dnum">${i+1}</span><h3>${h}</h3><p>${t}</p>${sayBtn(h+'. '+t)}</div></li>`).join('');
  const now=new Date(),start=new Date(now.getFullYear(),0,1);SM.doy=Math.min(364,Math.floor((now-start)/864e5));$('sky-date').value=SM.doy;$('sky-time').value=SM.min/15;
  renderTasks();skyInfo();renderSkyQ();}
$('sky-date').addEventListener('input',e=>{SM.doy=+e.target.value;drawSky();});
$('sky-time').addEventListener('input',e=>{SM.min=+e.target.value*15;drawSky();doneTask('spin',$('sky-time'));});
$('sky-now').addEventListener('click',()=>{const n=new Date(),s=new Date(n.getFullYear(),0,1);SM.doy=Math.min(364,Math.floor((n-s)/864e5));SM.min=n.getHours()*60+Math.floor(n.getMinutes()/15)*15;$('sky-date').value=SM.doy;$('sky-time').value=SM.min/15;SFX.click();drawSky();});
$('sky-toggles').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;const k=b.dataset.t;SM[k]=!SM[k];b.setAttribute('aria-pressed',SM[k]);SFX.click();drawSky();});
$('skymap').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)*DPR,y=(e.clientY-r.top)*DPR;let best=null,bd=18*DPR;
  for(const h of SM.hits){const d=Math.hypot(h[2]-x,h[3]-y)-(h[0]==='star'?(3-h[1][4]*.5)*DPR:0);if(d<bd){bd=d;best=h;}}
  if(!best){SM.info=null;skyInfo();drawSky();return;}SFX.star();SM.info={0:best[1][0],hit:best};skyInfo();drawSky();
  if(best[0]==='star'&&TASKS.some(t=>t[0]===best[1][0]))doneTask(best[1][0],$('sky-info'));
  if(best[0]==='planet')doneTask('planet',$('sky-info'));});
$('sky-info').addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){SFX.click();select(g.dataset.go);}});
$('sky-quiz').addEventListener('click',e=>{const o=e.target.closest('[data-skq]');if(o&&!o.disabled){const p=decodeURIComponent(o.dataset.skq),ok=p===SKYQ[SM.q][1];if(ok){SM.qScore++;SFX.right();}else SFX.wrong();SM.qAns=p;renderSkyQ();return;}
  if(e.target.closest('#skq-next')){SM.q++;SM.qAns=null;SM.opts=null;renderSkyQ();}
  if(e.target.closest('#skq-again')){SM.q=0;SM.qScore=0;SM.qAns=null;SM.opts=null;renderSkyQ();}});
addEventListener('resize',()=>{if(cur==='stjarnkarta')drawSky();});
