/* ---------- Start ---------- */
$('logo').innerHTML=art('saturn');
applyLook();renderRemind();renderHUD();renderSound();$('lite').setAttribute('aria-pressed',!!S.lite);renderMission();renderDaily();renderFilters();renderStrip();renderDetail();
renderFcTopic();buildQueue();renderSetup();renderWeight();renderConstPick();renderConst();renderGloss();updSpeedLbl();buildSkyView();
if(!MAP.play)$('map-play').textContent='Spela';
show(location.hash.slice(1));applyProfile();if(!S.profile)openOnboarding();else buddyGreet();
skySize();requestAnimationFrame(skyDraw);
