// ===== Datalager =====
// Ett enda gränssnitt för socialt innehåll. Idag: lokalt i telefonen.
// När databasen kopplas på byts bara detta lager ut – resten av appen är oförändrad.
const TABLES=["posts","likes","comments","tips","votes","hangs","joins","hostels","jobs"];
const DB=(()=>{
  const KEY="lufsa_social";
  let data={profiles:{}},listeners=[],uid=null;
  TABLES.forEach(t=>data[t]=[]);
  function load(){try{const r=JSON.parse(localStorage.getItem(KEY)||"null");if(r){data={...data,...r};TABLES.forEach(t=>data[t]=data[t]||[])}}catch(e){}
    try{uid=localStorage.getItem("lufsa_uid")}catch(e){}
    if(!uid){uid="u_"+Math.random().toString(36).slice(2,11);try{localStorage.setItem("lufsa_uid",uid)}catch(e){}}}
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){toast("Lagringen i telefonen är full – ta bort några bilder");throw e}emit()}
  function emit(){listeners.forEach(f=>{try{f()}catch(e){console.error(e)}})}
  const now=()=>new Date().toISOString();
  return {
    mode:"local",
    get uid(){return uid},
    get data(){return data},
    async init(){load();emit()},
    onChange(f){listeners.push(f)},
    me(){return data.profiles[uid]||null},
    async saveProfile(p){data.profiles[uid]={...p,id:uid,updated_at:now()};persist()},
    async add(table,row){const r={id:"r_"+Math.random().toString(36).slice(2,11),user_id:uid,created_at:now(),...row};data[table].push(r);persist();return r},
    async remove(table,id){const r=data[table].find(x=>x.id===id);if(!r)return;if(r.user_id!==uid)throw new Error("Inte din");data[table]=data[table].filter(x=>x.id!==id);persist()},
    async toggle(table,fields){const k=Object.keys(fields);const ex=data[table].find(r=>r.user_id===uid&&k.every(f=>r[f]===fields[f]));
      if(ex){data[table]=data[table].filter(r=>r!==ex)}else data[table].push({id:"r_"+Math.random().toString(36).slice(2,11),user_id:uid,created_at:now(),...fields});persist();return !ex},
    // bilder: komprimeras hårt i testläget eftersom telefonens lagring är liten
    async upload(blob){return await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(blob)})},
    imgMax:900
  };
})();
