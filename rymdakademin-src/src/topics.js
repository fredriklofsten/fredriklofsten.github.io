/* ===================== Nya ämnen: rymdfart, exoplaneter, ISS, astronauter ===================== */
Object.assign(B,{
 exoplanet:{name:'Exoplaneter',short:'Exoplaneter',type:'Planeter runt andra stjärnor',cat:'tema',icon:'exo',c1:'#8fd3ff',c2:'#ff7aa8',
  tag:'Planeter som kretsar runt andra stjärnor än solen. Vi har hittat över 6 000 av dem.',
  stats:[['Bekräftade','över 6 000'],['Första runt en sollik stjärna','1995'],['Närmaste','Proxima b, ca 4,2 ljusår'],['Vanligaste sättet att hitta dem','Stjärnan mörknar lite']],
  facts:['När en planet passerar framför sin stjärna blir stjärnan en aning mörkare. Så har de flesta exoplaneter hittats.','Det finns heta jupitrar, jättar som ligger så nära sin stjärna att ett år bara tar några dygn.','Stjärnan TRAPPIST-1 har sju planeter ungefär lika stora som jorden.'],
  did:'Nästan varje stjärna du ser på natthimlen har troligen minst en planet. Det betyder att det finns fler planeter än stjärnor i Vintergatan!'},
 rocket:{name:'Raketer',short:'Raketer',type:'Så tar vi oss ut i rymden',cat:'tema',icon:'rocket',c1:'#ffd98a',c2:'#ff7a45',
  tag:'En raket kastar ut het gas bakåt i väldig fart. Då trycks raketen framåt, ända ut i rymden.',
  stats:[['Fart för att stanna i bana','ca 28 000 km/h'],['Första satelliten','1957'],['Månraketen Saturn V','111 m hög'],['Uppskjutning till bana','ca 9 minuter']],
  facts:['En raket fungerar som en ballong som man släpper. Luften åker ut åt ena hållet och ballongen åker åt andra.','De flesta raketer har flera steg. När ett steg är tomt släpps det, så att raketen blir lättare.','I dag kan vissa raketsteg landa igen och användas flera gånger.'],
  did:'En raket behöver inte luft att trycka mot. Den fungerar till och med bättre i rymden, där inget bromsar.'},
 iss:{name:'Rymdstationen ISS',short:'ISS',type:'Ett hem i rymden',cat:'tema',icon:'iss',c1:'#e9ecff',c2:'#5d7cff',
  tag:'Ett stort laboratorium som kretsar runt jorden. Astronauter har bott där hela tiden sedan år 2000.',
  stats:[['Höjd','ca 400 km'],['Ett varv runt jorden','ca 90 minuter'],['Fart','ca 28 000 km/h'],['Bemannad sedan','november 2000']],
  facts:['ISS är ungefär lika lång som en fotbollsplan, med solpaneler på sidorna.','Astronauterna sover i sovsäckar som sitter fast i väggen, så att de inte svävar iväg.','Du kan se ISS med blotta ögat som en stark prick som glider över himlen utan att blinka.'],
  did:'Astronauterna på ISS ser ungefär 16 soluppgångar och 16 solnedgångar varje dygn.'},
 astronaut:{name:'Bli astronaut',short:'Astronaut',type:'Ett jobb i rymden',cat:'tema',icon:'astro',c1:'#e9ecff',c2:'#ffc94a',
  tag:'Astronauter är vanliga människor som har tränat väldigt mycket. Två svenskar har varit i rymden.',
  stats:[['Svenskar i rymden','2'],['Första människan','Jurij Gagarin, 1961'],['Längst bort','ca 406 800 km (Artemis II, 2026)'],['Rymdorganisation för Sverige','ESA']],
  facts:['Christer Fuglesang var den första svensken i rymden, år 2006. Marcus Wandt var den andra, år 2024.','Astronauter tränar rymdpromenader under vatten i en jättelik bassäng, där det känns nästan som att sväva.','I rymden blir man lite längre, eftersom ryggraden inte trycks ihop av tyngdkraften.'],
  did:'Många astronauter har först varit piloter, läkare, ingenjörer eller forskare. Att vara nyfiken och kunna samarbeta är superviktigt!'}});
['exoplanet','rocket','iss','astronaut'].forEach(k=>ORDER.push(k));
CATS.push(['tema','Rymdfart & mer']);

Object.assign(MORE,{
 exoplanet:['Den första exoplaneten runt en stjärna som liknar solen heter 51 Pegasi b och hittades 1995.','Rymdteleskopen Kepler och TESS har hittat tusentals exoplaneter.','James Webb-teleskopet kan undersöka luften på vissa exoplaneter.','En del exoplaneter ligger i den beboeliga zonen, där det varken är för varmt eller för kallt för flytande vatten.'],
 rocket:['Den sovjetiska raketen som skickade upp Sputnik 1957 var den första som nådde omloppsbana.','Saturn V tog astronauterna till månen mellan 1969 och 1972.','Den 1 april 2026 skickade NASA:s SLS-raket upp fyra astronauter i Artemis II mot månen.','Från Esrange utanför Kiruna skjuter Sverige upp forskningsraketer.'],
 iss:['ISS byggdes ihop i rymden av många delar, som ett jättelikt lego.','USA, Ryssland, Europa, Japan och Kanada samarbetar om ISS.','På ISS återvinns nästan allt vatten, även svett och kiss, till dricksvatten.','Planen är att ISS ska tas ner och brinna upp i atmosfären runt år 2030.'],
 astronaut:['Jurij Gagarin var den första människan i rymden, år 1961.','Neil Armstrong var den första människan på månen, år 1969.','Valentina Teresjkova var den första kvinnan i rymden, år 1963.','I april 2026 flög Artemis II runt månen. Det var första gången sedan 1972 som människor reste till månen.']});
Object.assign(SEE,{
 exoplanet:'Exoplaneterna syns inte, men du kan se deras stjärnor. Stjärnan 51 Pegasi står i Pegasus, som syns på höstkvällar.',
 rocket:'Uppskjutningar sänds ofta direkt på nätet. Ibland kan du se forskningsraketer från Esrange i norra Sverige.',
 iss:'Leta efter en stark, vit prick som glider jämnt över himlen i några minuter strax efter skymningen eller före gryningen. Appar visar när den passerar.',
 astronaut:'Följ ESA och NASA på nätet. Där kan du se astronauterna jobba på rymdstationen.'});
Object.assign(DEEP,{
 exoplanet:[['Hur hittar man dem?','Transitmetoden mäter när stjärnan mörknar lite. Med radialhastighetsmetoden ser man att stjärnan vickar fram och tillbaka när planeten drar i den.'],['Konstiga världar','Det finns planeter som kretsar runt två solar, planeter täckta av hav och planeter som är hetare än lava.'],['Finns det liv?','Forskare letar efter gaser i exoplaneternas luft som skulle kunna komma från liv. Hittills har inget säkert spår hittats.']],
 rocket:[['Newtons tredje lag','Varje kraft har en lika stor motkraft. Gasen trycks bakåt, raketen trycks framåt.'],['Snabbt i sidled','För att stanna i bana måste man flyga så fort i sidled att man hela tiden faller runt jorden utan att träffa den.'],['Bränsle','Många raketer bränner flytande väte eller fotogen tillsammans med flytande syre. Det mesta av raketens vikt vid starten är bränsle.']],
 iss:[['Ständigt fall','Astronauterna svävar inte för att tyngdkraften är borta. De och stationen faller hela tiden runt jorden tillsammans.'],['Forskning','På ISS gör man experiment om kroppen, växter, material och eld i tyngdlöshet.'],['Träning varje dag','Utan tyngdkraft blir muskler och skelett svagare. Därför tränar astronauterna ungefär två timmar om dagen.']],
 astronaut:[['Hur blir man vald?','ESA söker nya astronauter ungefär vart tionde år. Senast sökte över 22 000 personer och 17 valdes ut år 2022.'],['Lång utbildning','Utbildningen tar flera år. Man lär sig om rymdfarkoster, rymdpromenader, första hjälpen, ryska och överlevnad i vildmarken.'],['Vad ska jag plugga?','Naturvetenskap, teknik, matematik eller medicin är bra vägar. Bra hälsa, lugn under stress och lagarbete är också viktigt.']]});
ITEMS.push(
 {k:'exoplanet',q:'Vad är en exoplanet?',a:'En planet runt en annan stjärna',w:['En planet utan måne','En planet som har exploderat','En stor asteroid'],ex:'Exo betyder utanför. Exoplaneter finns utanför vårt solsystem.'},
 {k:'exoplanet',q:'Hur hittar man oftast exoplaneter?',a:'Stjärnan blir lite mörkare',w:['Man ser dem med blotta ögat','Man hör dem i radio','De lyser rött'],ex:'När planeten passerar framför sin stjärna blockerar den lite ljus.'},
 {k:'exoplanet',q:'Ungefär hur många exoplaneter är bekräftade?',a:'Över 6 000',w:['Ungefär 10','Ungefär 100','Exakt 8'],ex:'NASA passerade 6 000 bekräftade exoplaneter år 2025.',hard:1},
 {k:'exoplanet',q:'Hur många jordstora planeter har stjärnan TRAPPIST-1?',a:'7',w:['1','3','12'],ex:'TRAPPIST-1 har sju planeter ungefär lika stora som jorden.',hard:1},
 {k:'rocket',q:'Varför åker en raket framåt?',a:'Den sprutar ut gas bakåt',w:['Den trycker mot luften','Vingarna lyfter den','Magneter drar den'],ex:'Gasen trycks bakåt och raketen trycks framåt. Det fungerar även i rymden.'},
 {k:'rocket',q:'Varför har raketer flera steg?',a:'Tomma steg släpps så raketen blir lättare',w:['För att det ser coolt ut','För att astronauterna ska kunna byta plats','För att bromsa'],ex:'En lättare raket kan komma snabbare och längre med mindre bränsle.'},
 {k:'rocket',q:'Vilken raket tog astronauterna till månen 1969?',a:'Saturn V',w:['Sputnik','Falcon 9','Ariane 6'],ex:'Saturn V var 111 meter hög.',hard:1},
 {k:'rocket',q:'Varifrån skjuter Sverige upp forskningsraketer?',a:'Esrange vid Kiruna',w:['Göteborg','Gotland','Stockholm'],ex:'Esrange ligger i norra Sverige.',hard:1},
 {k:'iss',q:'Hur lång tid tar ett varv runt jorden för ISS?',a:'Ungefär 90 minuter',w:['Ett dygn','En vecka','Ett år'],ex:'ISS åker i ungefär 28 000 km/h.'},
 {k:'iss',q:'Varför svävar astronauterna på ISS?',a:'De faller runt jorden hela tiden',w:['Det finns ingen tyngdkraft där','De har magnetskor','De väger ingenting'],ex:'Tyngdkraften finns kvar, men stationen och astronauterna faller tillsammans runt jorden.',hard:1},
 {k:'iss',q:'Hur ser ISS ut på himlen?',a:'En stark prick som glider fram',w:['En röd blinkande lampa','Ett suddigt moln','Den syns inte alls'],ex:'Den blinkar inte och rör sig jämnt över himlen i några minuter.'},
 {k:'iss',q:'Ungefär hur högt upp åker ISS?',a:'400 km',w:['10 km','4 000 km','400 000 km'],ex:'Det är ungefär som avståndet från Stockholm till Göteborg.',hard:1},
 {k:'astronaut',q:'Vem var den första svensken i rymden?',a:'Christer Fuglesang',w:['Marcus Wandt','Neil Armstrong','Jurij Gagarin'],ex:'Christer Fuglesang flög år 2006.'},
 {k:'astronaut',q:'Var tränar astronauter rymdpromenader?',a:'I en stor bassäng',w:['I en bastu','På en fotbollsplan','I en hiss'],ex:'Under vatten känns det nästan som att sväva.'},
 {k:'astronaut',q:'Vem var den första människan i rymden?',a:'Jurij Gagarin',w:['Neil Armstrong','Christer Fuglesang','Valentina Teresjkova'],ex:'Gagarin åkte ett varv runt jorden 1961.'},
 {k:'astronaut',q:'Vad hände med Artemis II i april 2026?',a:'Fyra astronauter flög runt månen',w:['Den landade på Mars','Den byggde en månbas','Den hämtade en komet'],ex:'Det var första gången sedan 1972 som människor reste till månen.',hard:1});
ITEMS.forEach(it=>it.id=it.id||it.q);
GLOSSARY.push(
 ['Exoplanet','En planet som kretsar runt en annan stjärna än solen.'],
 ['Beboelig zon','Området runt en stjärna där det varken är för varmt eller för kallt för flytande vatten.'],
 ['Raketsteg','En del av en raket med egen motor och eget bränsle. Den släpps när bränslet är slut.'],
 ['Tyngdlöshet','När man faller fritt och därför känns viktlös, som astronauterna på ISS.'],
 ['Rymdpromenad','När en astronaut går ut ur rymdfarkosten i rymddräkt.']);
TIMELINE.push([2026,'Artemis II','Fyra astronauter flyger runt månen.','Den 1–10 april 2026 flög Reid Wiseman, Victor Glover, Christina Koch och Jeremy Hansen runt månen. De kom ungefär 406 800 km från jorden, längre än någon människa varit tidigare.']);

/* ---------- Lättlästa texter för Nybörjare (6–8 år) ---------- */
const KID={
 sun:['Solen är en jättestor, het boll av gas. Den ger oss ljus och värme.','Solen är en stjärna, precis som stjärnorna på natten.','Solen är så stor att mer än en miljon jordar skulle få plats inuti.','Titta aldrig rakt på solen. Det är farligt för ögonen.'],
 sirius:['Sirius är den ljusaste stjärnan på natthimlen.','Sirius är egentligen två stjärnor som snurrar runt varandra.','Den syns bäst på vintern.','Sirius kallas ibland Hundstjärnan.'],
 polaris:['Polstjärnan visar alltid var norr är.','Den står nästan stilla på himlen medan andra stjärnor snurrar runt.','Förr använde sjömän den för att hitta rätt.','Du hittar den med hjälp av Karlavagnen.'],
 betelgeuse:['Betelgeuse är en jättestor röd stjärna i Orion.','Om den låg där solen ligger skulle den nå förbi Mars.','En dag kommer den att explodera, men kanske inte på väldigt länge.','Den syns på vinterkvällar.'],
 mercury:['Merkurius är den minsta planeten och ligger närmast solen.','På dagen är det jättevarmt och på natten iskallt.','Merkurius har massor av gropar som kallas kratrar.','Den åker snabbast av alla planeter runt solen.'],
 venus:['Venus är den hetaste planeten. Den är täckt av tjocka moln.','Venus är nästan lika stor som jorden.','Venus är ofta det ljusaste du ser på himlen, efter månen.','På Venus går solen upp i väster.'],
 earth:['Jorden är vårt hem. Här finns vatten, luft och liv.','Jorden snurrar ett varv på ett dygn. Det ger dag och natt.','Ett varv runt solen tar ett år.','Det mesta av jorden är täckt av hav.'],
 moon:['Månen åker runt jorden. Den har inget eget ljus utan lyser av solen.','Tolv astronauter har gått på månen.','Månen ser ut att ändra form. Det kallas månens faser.','Det finns gropar på månen som kallas kratrar.'],
 mars:['Mars är den röda planeten. Marken är röd som rost.','På Mars finns den högsta vulkanen vi känner till.','Robotbilar kör runt på Mars och tar bilder.','Mars har två små månar.'],
 vesta:['Vesta är en stor sten i rymden, en asteroid.','Den finns mellan Mars och Jupiter.','Vesta har en jättestor grop på sydpolen.','Små bitar av Vesta har landat på jorden.'],
 ceres:['Ceres är en liten rund värld, en dvärgplanet.','Den bor i asteroidbältet mellan Mars och Jupiter.','På Ceres finns ljusa fläckar av salt.','En rymdsond som hette Dawn har hälsat på där.'],
 bennu:['Bennu är en liten asteroid, ungefär som ett högt berg.','En rymdsond hämtade sten från Bennu och skickade hem den.','Bennu ser ut som en snurrsnurra.','Den är full av stenar och grus.'],
 jupiter:['Jupiter är den största planeten. Den är gjord av gas.','Jupiter har en jättestor storm som heter Stora röda fläcken.','Stormen är större än hela jorden.','Jupiter har väldigt många månar.'],
 io:['Io är en måne till Jupiter med massor av vulkaner.','Den är gul och orange, nästan som en pizza.','Vulkanerna sprutar högt upp i rymden.','Io är ungefär lika stor som vår måne.'],
 europa:['Europa är en måne till Jupiter täckt av is.','Under isen finns ett stort hav.','Forskare undrar om det kan finnas liv i havet.','En rymdsond är på väg dit nu.'],
 ganymede:['Ganymedes är den största månen i hela solsystemet.','Den är större än planeten Merkurius.','Under isen finns kanske ett hav.','Ganymedes är en måne till Jupiter.'],
 titan:['Titan är Saturnus största måne. Den har tjock orange luft.','På Titan regnar det, men inte vatten.','Där finns sjöar och floder.','En flygande robot ska åka dit.'],
 saturn:['Saturnus är planeten med de vackra ringarna.','Ringarna är gjorda av is och sten.','Saturnus är så lätt att den skulle kunna flyta i ett jättestort badkar.','Saturnus har flest månar av alla planeter.'],
 uranus:['Uranus är en kall, blågrön planet.','Den ligger på sidan och rullar runt solen.','Uranus är väldigt långt borta.','Den har tunna ringar.'],
 neptune:['Neptunus är den planet som ligger längst bort från solen.','Den är blå och det blåser jättemycket där.','Ett år på Neptunus är 165 jordår långt.','Bara en rymdsond har hälsat på där.'],
 pluto:['Pluto är en liten, kall dvärgplanet långt borta.','Pluto har ett stort ljust område som ser ut som ett hjärta.','Förr kallades Pluto planet.','Pluto har fem månar.'],
 halley:['Halleys komet är en smutsig snöboll som åker runt solen.','Den kommer tillbaka ungefär vart 76:e år.','Nästa gång den syns är år 2061.','När den kommer nära solen får den en lång svans.'],
 halebopp:['Hale-Bopp är en stor komet med två svansar.','Den syntes jättetydligt år 1997.','Många människor kunde se den utan kikare.','Den kommer inte tillbaka på flera tusen år.'],
 c67p:['67P är en komet som ser ut som en gummianka.','En liten robot landade på den.','Kometen är mörk som kol.','Den är gjord av is och damm.'],
 sl9:['Shoemaker-Levy 9 var en komet som krockade med Jupiter.','Kometen gick sönder i flera bitar först.','Bitarna gjorde stora mörka fläckar på Jupiter.','Det hände år 1994.'],
 neowise:['NEOWISE var en komet som syntes år 2020.','Den hade en lång, fin svans.','Man kunde se den från Sverige på sommarnätterna.','Den kommer inte tillbaka på mycket länge.'],
 encke:['Enckes komet åker runt solen ofta, ungefär vart tredje år.','Den lämnar damm efter sig.','Dammet blir stjärnfall på hösten.','Den är svår att se utan teleskop.'],
 tempel1:['Tempel 1 är en komet som forskare skickade en kula på.','Kulan gjorde ett hål så att man kunde se vad som fanns inuti.','Kometen ser ut som en potatis.','Det hände år 2005.'],
 hyakutake:['Hyakutake var en komet med en jättelång svans.','Den syntes år 1996.','Den kom nära jorden.','Den kommer inte tillbaka på väldigt länge.'],
 milkyway:['Vintergatan är vår galax. Där bor solen och jorden.','Den består av miljarder stjärnor.','En mörk natt kan du se den som ett ljust band på himlen.','Vintergatan snurrar långsamt runt.'],
 andromeda:['Andromeda är en annan galax, en granne till oss.','Den är så långt bort att ljuset tar 2,5 miljoner år att komma hit.','Du kan se den som en suddig fläck.','Den är ungefär lika stor som vår galax.'],
 orion:['Orionnebulosan är ett moln där nya stjärnor föds.','Den syns som en suddig stjärna i Orions svärd.','Molnet lyser i rött och lila.','Det är en stjärnfabrik.'],
 crab:['Krabbnebulosan är det som blev kvar när en stjärna exploderade.','Explosionen syntes på jorden för nästan tusen år sedan.','I mitten snurrar en liten stjärna jättefort.','Den syns bara i teleskop.'],
 blackhole:['Ett svart hål drar i allt runt sig, till och med ljus.','Därför är det helt svart.','Svarta hål finns långt bort från oss.','I mitten av vår galax finns ett jättestort svart hål.'],
 exoplanet:['Exoplaneter är planeter som snurrar runt andra stjärnor.','Forskare har hittat tusentals av dem.','Vi letar efter planeter som liknar jorden.','Kanske finns det liv någon annanstans!'],
 rocket:['En raket sprutar ut het gas bakåt och åker då uppåt.','Raketer tar astronauter och satelliter till rymden.','Raketer är jättesnabba.','Vissa raketer kan landa och flyga igen.'],
 iss:['ISS är ett hus i rymden där astronauter bor.','Den åker runt jorden på en och en halv timme.','Där svävar allt omkring.','Du kan se den som en ljus prick på himlen.'],
 astronaut:['En astronaut är någon som reser ut i rymden.','Astronauter tränar jättemycket, bland annat i en stor pool.','Två svenskar har varit i rymden.','Kanske kan du bli astronaut en dag!']};
const kidOK=k=>LVc()===LV.nyb&&KID[k];
const bodyTag=k=>kidOK(k)?KID[k][0]:B[k].tag;
const bodyFacts=k=>kidOK(k)?KID[k].slice(1):B[k].facts.concat(MORE[k]||[]).slice(0,LVc().facts);

/* ---------- Ikoner för temaämnen ---------- */
function themeSVG(k,id,cls){const p=B[k];let g='';
 if(p.icon==='exo')g=`<defs><radialGradient id="${id}s"><stop offset="0" stop-color="#fff6c8"/><stop offset=".5" stop-color="#ffb03a"/><stop offset="1" stop-color="#ff7a1f" stop-opacity="0"/></radialGradient><radialGradient id="${id}p" cx=".35" cy=".35"><stop offset="0" stop-color="#9ef0d4"/><stop offset="1" stop-color="#1c6a8a"/></radialGradient></defs>
  <circle cx="34" cy="40" r="30" fill="url(#${id}s)"/><ellipse cx="50" cy="52" rx="44" ry="12" fill="none" stroke="#8ea0ff" stroke-width="1.2" stroke-dasharray="3 4" opacity=".7"/><circle cx="78" cy="58" r="11" fill="url(#${id}p)"/><circle cx="20" cy="62" r="5" fill="#ff9ab8"/>`;
 if(p.icon==='rocket')g=`<path d="M50 6c14 10 18 30 14 50H36C32 36 36 16 50 6z" fill="#eef1ff"/><path d="M50 6c6 4 10 10 12 18H38c2-8 6-14 12-18z" fill="#ff5d73"/><circle cx="50" cy="36" r="7" fill="#3a4bd8" stroke="#b9c6ff" stroke-width="2.5"/>
  <path d="M36 44 22 62l14-2zM64 44l14 18-14-2z" fill="#ff5d73"/><rect x="40" y="56" width="20" height="6" rx="2" fill="#9aa3c7"/><path d="M42 62q8 30 16 0z" fill="#ffc94a"/><path d="M45 62q5 18 10 0z" fill="#fff6c8"/>`;
 if(p.icon==='iss')g=`<g fill="#5d7cff" stroke="#b9c6ff" stroke-width="1"><rect x="4" y="22" width="18" height="22"/><rect x="4" y="56" width="18" height="22"/><rect x="78" y="22" width="18" height="22"/><rect x="78" y="56" width="18" height="22"/></g>
  <g stroke="#3a4bd8" stroke-width=".8" opacity=".7"><path d="M4 33h18M4 67h18M78 33h18M78 67h18M13 22v22M13 56v22M87 22v22M87 56v22"/></g><rect x="12" y="47" width="76" height="6" rx="2" fill="#d8dcf0"/><rect x="38" y="36" width="24" height="28" rx="6" fill="#eef1ff"/><rect x="44" y="28" width="12" height="44" rx="5" fill="#cfd5ef"/><circle cx="50" cy="50" r="4" fill="#ffc94a"/>`;
 if(p.icon==='astro')return astro('wave',`art ${cls}`,{suit:'#e9ecff',visor:'#262c78',glow:'#ffc94a',acc:'flag'});
 return `<svg class="art ${cls}" viewBox="0 0 100 100" role="img" aria-label="${p.name}">${g}</svg>`;}

/* ---------- Automatiska frågor från faktarutorna ---------- */
(function(){
  const T={
   'Avstånd till solen':[n=>`Hur långt från solen ligger ${n}?`,v=>`Vilken himlakropp ligger ${v} från solen?`,(n,v)=>`${n} ligger ${v} från solen.`],
   'Ett år':[n=>`Hur lång tid tar det för ${n} att åka ett varv runt solen?`,v=>`På vilken himlakropp är ett år ${v} långt?`,(n,v)=>`Ett år på ${n} är ${v} långt.`],
   'Ett dygn':[n=>`Hur långt är ett dygn på ${n}?`,v=>`På vilken himlakropp är ett dygn ${v} långt?`,(n,v)=>`Ett dygn på ${n} är ${v} långt.`],
   'Månar':[n=>`Hur många kända månar har ${n}?`,null,(n,v)=>`${n} har ${v} kända månar.`],
   'Upptäckt':[n=>`Vilket år upptäcktes ${n}?`,v=>`Vilken himlakropp upptäcktes år ${v}?`,(n,v)=>`${n} upptäcktes år ${v}.`],
   'Diameter':[n=>`Hur bred är ${n}?`,v=>`Vilken himlakropp är ${v} bred?`,(n,v)=>`${n} är ${v} bred.`],
   'Temperatur':[n=>`Hur varmt eller kallt är det på ${n}?`,null,(n,v)=>`På ${n} är det ${v}.`],
   'Avstånd':[n=>`Hur långt bort är ${n}?`,v=>`Vad ligger ${v.replace(/\s*\(.*?\)/,"")} bort från oss?`,(n,v)=>`${n} ligger ${v} bort.`],
   'Omloppstid':[n=>`Hur ofta kommer ${n} tillbaka till solen?`,v=>`Vilken komet åker ett varv runt solen på ${v}?`,(n,v)=>`${n} åker ett varv runt solen på ${v}.`],
   'Rymdsond':[n=>`Vilken rymdsond besökte ${n}?`,v=>`Vad besökte rymdsonden ${v}?`,(n,v)=>`Rymdsonden ${v} besökte ${n}.`]};
  const by={};ORDER.forEach(k=>{if(catOf(k)==='tema')return;B[k].stats.forEach(([l,v])=>{if(T[l])(by[l]=by[l]||[]).push([k,v]);});});
  for(const l in by){const rows=by[l],vals=[...new Set(rows.map(r=>r[1]))];if(vals.length<4)continue;
    rows.forEach(([k,v])=>{const n=B[k].name,others=shuffle(vals.filter(x=>x!==v)).slice(0,3),ex=T[l][2](n,v);
      ITEMS.push({gen:1,hard:1,k,q:T[l][0](n),a:v,w:others,ex,id:'g1:'+k+':'+l});
      if(T[l][1]&&rows.filter(r=>r[1]===v).length===1){const wn=shuffle(rows.filter(r=>r[0]!==k).map(r=>B[r[0]].name)).slice(0,3);
        if(wn.length===3)ITEMS.push({gen:1,k,q:T[l][1](v),a:n,w:wn,ex,id:'g2:'+k+':'+l});}});}
})();

/* ---------- Riktiga foton (NASA, fri användning) ---------- */
const PHOTO=/*PHOTOS*/{};
