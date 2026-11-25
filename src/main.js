import { PROGRAM, LIBRARY_EXTRAS, NAV, DEFAULT_PROFILE } from "./data.js";
import * as DB from "./store.js";

const app=document.querySelector("#app");
let page="home", calendarCursor=new Date(), libraryFilter="Tümü", libraryQuery="", selectedExercise=null, libraryVisibleCount=18;
const THEME_KEY="form-fitness-theme-v1", themes=["green","red","blue","pink"];
let activeTheme="green";
try{const savedTheme=localStorage.getItem(THEME_KEY);if(themes.includes(savedTheme))activeTheme=savedTheme;}catch{}
document.documentElement.dataset.theme=activeTheme;
const $=(s,root=document)=>root.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateISO=d=>new Date(d).toISOString().slice(0,10);
const today=DB.today();
const fmt=(n,d=0)=>Number(n||0).toLocaleString("tr-TR",{maximumFractionDigits:d});
const allExercises=[...new Map([...PROGRAM.A,...PROGRAM.B,...LIBRARY_EXTRAS].map(ex=>[ex.id,ex])).values()]
 .map(ex=>({...ex,searchText:`${ex.name} ${ex.muscle} ${ex.equipment}`.toLocaleLowerCase("tr-TR")}));
const LIBRARY_PAGE_SIZE=18;
function planFor(date){const type=DB.workoutType(date);return type?PROGRAM[type]:null;}
function sessionLabel(date){const p=planFor(date);return p?`Antrenman ${DB.getState().logs[date]?.type||DB.workoutType(date)}`:"Dinlenme / serbest gün";}
function progressFor(date){const log=DB.getState().logs[date];if(!log)return 0;const all=PROGRAM[log.type].flatMap(x=>log.exercises[x.id]?.sets||[]);return all.length?Math.round(all.filter(s=>s.done).length/all.length*100):0;}
function pageTitle(){return NAV.find(n=>n.id===page)?.label||"Genel Bakış";}
function shell(){
 const st=DB.getState(),xp=DB.totalXP(),level=Math.floor(xp/250)+1;
 app.innerHTML=`
 <div class="app-shell">
  <aside class="sidebar">
   <div class="brand"><div class="brand-mark">F</div><div><b>FORM</b><small>FITNESS CLUB</small></div></div>
   <div class="side-caption">MENÜ</div>
   <nav>${NAV.map(n=>`<button class="nav-item ${page===n.id?"active":""}" data-page="${n.id}"><span class="nav-icon">${n.icon}</span>${n.label}${n.id==="workout"&&planFor(today)?'<i class="nav-dot"></i>':""}</button>`).join("")}</nav>
   <div class="sidebar-bottom"><div class="level-mini"><span>SEVİYE ${level}</span><b>${xp} XP</b><div class="mini-track"><i style="width:${xp%250/250*100}%"></i></div></div><div class="profile-mini"><div class="avatar">${esc((st.profile.name||"S").slice(0,1).toUpperCase())}</div><div><b>${esc(st.profile.name)}</b><small>${esc(st.profile.level)} seviye</small></div><button class="icon-button" data-page="profile" aria-label="Profil">⚙</button></div></div>
  </aside>
  <main class="main">
   <header class="topbar"><div><div class="eyebrow">KİŞİSEL PERFORMANS PANELİ</div><h1>${pageTitle()}</h1></div><div class="top-actions"><span class="date-chip">◷ ${new Intl.DateTimeFormat("tr-TR",{weekday:"short",day:"numeric",month:"short"}).format(new Date())}</span><div class="theme-picker" role="group" aria-label="Renk teması">${themes.map(t=>`<button class="theme-swatch theme-${t} ${activeTheme===t?"active":""}" type="button" data-theme-select="${t}" aria-label="${{green:"Yeşil",red:"Kırmızı",blue:"Mavi",pink:"Pembe"}[t]} tema" aria-pressed="${activeTheme===t}"></button>`).join("")}</div><div class="xp-chip">★ ${xp} XP</div></div></header>
   <section class="page-content" id="page-content"></section>
  </main>
  <nav class="mobile-nav">${NAV.slice(0,5).map(n=>`<button class="${page===n.id?"active":""}" data-page="${n.id}"><span>${n.icon}</span><small>${n.label==="Genel Bakış"?"Ana":n.label==="Hareket Kütüphanesi"?"Hareket":n.label==="Kilo & Ölçümler"?"Kilo":n.label}</small></button>`).join("")}</nav>
 </div>`;
 app.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
 renderPage();
}
function navigate(p){page=p;shell();window.scrollTo({top:0,behavior:"smooth"});}
function card(title,sub,body,extra=""){return `<section class="card ${extra}"><div class="card-head"><div><h2>${title}</h2>${sub?`<p>${sub}</p>`:""}</div></div>${body}</section>`;}
function stat(label,value,unit,icon,trend=""){return `<div class="stat-card"><div class="stat-top"><span>${label}</span><i>${icon}</i></div><div class="stat-value">${value}<small>${unit||""}</small></div>${trend?`<div class="stat-foot">${trend}</div>`:""}</div>`;}
function renderPage(){
 const el=$("#page-content");
 const render={home:renderHome,calendar:renderCalendar,workout:renderWorkout,library:renderLibrary,weight:renderWeight,nutrition:renderNutrition,achievements:renderAchievements,profile:renderProfile}[page]||renderHome;
 el.innerHTML=render(); bindPage();
}
function renderHome(){
 const st=DB.getState(),p=st.profile, xp=DB.totalXP(),level=Math.floor(xp/250)+1, todayPlan=planFor(today), log=st.logs[today], pct=progressFor(today);
 const weight=st.weights.at(-1)?.weight??p.currentWeight, delta=(weight-p.startWeight).toFixed(1);
 const exercises=todayPlan||[];
 const taskRows=exercises.slice(0,4).map(ex=>`<div class="task-row"><span class="task-check ${log&&log.exercises[ex.id]?.sets.every(s=>s.done)?"checked":""}">${log&&log.exercises[ex.id]?.sets.every(s=>s.done)?"✓":"·"}</span><div><b>${ex.name}</b><small>${ex.sets} set · ${ex.reps} tekrar</small></div><strong>+${ex.xp} XP</strong></div>`).join("");
 return `
 <div class="welcome-row"><div><div class="eyebrow green">BUGÜNÜN HEDEFİ</div><h2>Merhaba ${esc(p.name)} 👋</h2><p>İstikrarlı ol. Küçük ilerlemeler büyük sonuçlar getirir.</p></div><div class="streak-pill">🔥 ${DB.streak()} gün seri</div></div>
 <div class="stats-grid">${stat("GÜNCEL KİLO",fmt(weight,1),"kg","⚖",`${delta>=0?"+":""}${delta} kg başlangıçtan`)}${stat("TOPLAM PUAN",fmt(xp),"XP","★",`Seviye ${level}`)}${stat("BU HAFTA",DB.weekSessions()," / 3","▦","Antrenman günü")}${stat("HEDEF KİLO",fmt(p.targetWeight,1),"kg","◎",`${(p.targetWeight-weight).toFixed(1)} kg kaldı`)}</div>
 <div class="dashboard-grid">
  <div class="stack">
   ${card("Bugünkü program",todayPlan?`${sessionLabel(today)} · ${todayPlan.length} hareket`:"Bugün planlı antrenman yok",`
    ${todayPlan?`<div class="today-progress"><div class="progress-ring" style="--progress:${pct*3.6}deg"><div><b>${pct}%</b><small>TAMAMLANDI</small></div></div><div class="progress-copy"><b>${log?DB.getXP(today):0} XP kazanıldı</b><span>${log?`${pct===100?"Harika! Bugünkü program tamamlandı.":"Setlerini tamamladıkça puanın artacak."}`:"Antrenmana başla ve ilk setini kaydet."}</span><button class="btn btn-primary" data-page="workout">Antrenmana git <span>→</span></button></div></div><div class="task-list">${taskRows}</div>`:`<div class="empty-state"><div class="empty-icon">☀</div><b>Aktif dinlenme günü</b><p>Bugün hafif yürüyüş, esneme ve beslenme hedeflerine odaklan.</p><button class="btn btn-secondary" data-page="calendar">Takvimi görüntüle</button></div>`}
   `)}
   ${card("Haftalık takvim","Planlanan antrenman günlerin",`<div class="week-strip">${weekDays().map(d=>{const t=DB.workoutType(d.iso),pr=progressFor(d.iso);return `<button class="week-day ${d.iso===today?"current":""} ${t?"training":""}" data-date="${d.iso}"><small>${d.label}</small><b>${d.num}</b><i>${t?(pr===100?"✓":t):"·"}</i></button>`}).join("")}</div>`)}
  </div>
  <div class="stack">
   ${card("Seviye ilerlemesi","Her tamamlanan set seni bir adım ileri taşır.",`<div class="level-card"><div class="level-number">${level}</div><div class="level-info"><b>Seviye ${level} · ${levelName(level)}</b><small>${xp%250} / 250 XP sonraki seviyeye</small><div class="progress-track"><i style="width:${xp%250/250*100}%"></i></div></div></div><div class="muted-note">Bir hareketin tüm setlerini tamamla, puanını kazan. Antrenmanın tamamı bittiğinde +20 bonus XP!</div>`)}
   ${card("Hedeflerin","Kas kazanımı için düzenli takip",`<div class="goal-list"><div><span>Protein hedefi</span><b>${st.nutrition[today]?.protein||0} / ${p.protein} g</b></div><div class="progress-track"><i style="width:${Math.min(100,(st.nutrition[today]?.protein||0)/p.protein*100)}%"></i></div><div><span>Su hedefi</span><b>${st.nutrition[today]?.water||0} / 2500 ml</b></div><div class="progress-track"><i style="width:${Math.min(100,(st.nutrition[today]?.water||0)/2500*100)}%"></i></div><button class="text-button" data-page="nutrition">Beslenme kaydı ekle →</button></div>`)}
   ${card("Sonraki adım","Gelişimini düzenli kaydet",`<div class="quick-links"><button data-page="weight"><i>⚖</i><span><b>Kilonu kaydet</b><small>Haftalık değişimi gör</small></span>→</button><button data-page="library"><i>▤</i><span><b>Hareketleri öğren</b><small>Teknik ve uygulama</small></span>→</button></div>`)}
  </div>
 </div>`;
}
function weekDays(){const m=DB.monday();return Array.from({length:7},(_,i)=>{const d=new Date(m+"T12:00:00");d.setDate(d.getDate()+i);return {iso:dateISO(d),num:d.getDate(),label:["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"][i]};});}
function renderWorkout(){
 const st=DB.getState(),date=st.selectedDate||today,type=DB.workoutType(date),plan=planFor(date);
 if(!plan)return `<div class="empty-state large"><div class="empty-icon">☀</div><h2>Dinlenme günü</h2><p>${DB.formatDate(date,{weekday:"long",day:"numeric",month:"long"})} için planlı ağırlık antrenmanı yok. İstersen takvimden başka bir gün seçebilirsin.</p><button class="btn btn-primary" data-page="calendar">Takvime git</button></div>`;
 const log=DB.ensureLog(date),pct=progressFor(date);
 const cards=plan.map(ex=>{
  const sets=log.exercises[ex.id].sets;
  return `<article class="exercise-card">
   <div class="exercise-title"><div class="exercise-symbol">${ex.muscle.includes("Sırt")?"↗":ex.muscle.includes("bacak")||ex.muscle.includes("Bacak")?"◒":"◈"}</div><div class="exercise-name"><h3>${ex.name}</h3><small>${ex.muscle} · ${ex.equipment}</small></div><span class="xp-label">+${ex.xp} XP</span></div>
   <div class="exercise-meta"><span>${ex.sets} set</span><span>${ex.reps} tekrar</span><span>Dinlenme ${ex.rest} sn</span><span class="suggested">${ex.load}</span></div>
   <div class="set-table"><div class="set-head"><span>SET</span><span>KG</span><span>TEKRAR</span><span>TAMAM</span></div>
   ${sets.map((s,i)=>`<div class="set-row"><b>${i+1}</b><input type="number" min="0" step="0.5" placeholder="kg" value="${esc(s.weight)}" data-weight="${ex.id}" data-index="${i}"><input type="number" min="1" placeholder="${ex.reps.split("–")[0]}" value="${esc(s.reps)}" data-reps="${ex.id}" data-index="${i}"><label class="check-wrap"><input type="checkbox" data-set="${ex.id}" data-index="${i}" ${s.done?"checked":""}><span>✓</span></label></div>`).join("")}
   </div>
   <div class="exercise-footer"><span>${sets.filter(s=>s.done).length}/${ex.sets} set tamamlandı</span><button class="text-button" data-exercise="${ex.id}">Tekniği gör →</button></div>
  </article>`;
 }).join("");
 return `<div class="workout-toolbar"><div><div class="eyebrow green">${type==="A"?"TAM VÜCUT A":"TAM VÜCUT B"}</div><h2>${DB.formatDate(date,{weekday:"long",day:"numeric",month:"long"})}</h2><p>${DB.programWeek(date)}. hafta · Haftaya göre set sayısı otomatik ayarlanır.</p></div><div class="workout-score"><b>${DB.getXP(date)} XP</b><small>Bugünkü puan</small></div></div>
 <div class="workout-summary"><div><span>İlerleme</span><b>${pct}%</b></div><div class="progress-track"><i style="width:${pct}%"></i></div><small>${plan.length} hareket · ${plan.reduce((a,e)=>a+(log.exercises[e.id]?.sets.length||e.sets),0)} toplam set</small></div>
 <div class="notice"><b>Güvenli başlangıç:</b> İlk gün ağırlıklar yalnızca tahmindir. Her sette 2–3 tekrar yedekte bırak; ağrı veya baş dönmesinde dur. Makine ayarlarını salon eğitmenine kontrol ettir.</div>
 <div class="exercise-list">${cards}</div>
 <div class="finish-panel"><div><b>${pct===100?"Antrenman tamamlandı! 🎉":"Devam et, her set seni hedefe yaklaştırır."}</b><small>${pct===100?"+20 tamamlanma bonusu kazandın.":"Tüm setleri işaretlediğinde +20 bonus XP kazanırsın."}</small></div><div class="finish-xp">★ ${DB.getXP(date)} XP</div></div>`;
}
function renderCalendar(){
 const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth(),first=new Date(y,m,1),offset=(first.getDay()+6)%7,days=DB.daysInMonth(y,m),st=DB.getState();
 const cells=Array.from({length:offset},()=>`<div class="cal-cell blank"></div>`);
 for(let n=1;n<=days;n++){const d=dateISO(new Date(y,m,n)),type=DB.workoutType(d),pct=progressFor(d),selected=st.selectedDate===d;cells.push(`<button class="cal-cell ${d===today?"today":""} ${selected?"selected":""} ${type?"has-workout":""}" data-date="${d}"><span>${n}</span>${type?`<i class="${pct===100?"done":""}">${pct===100?"✓":type}</i>`:""}</button>`);}
 const sel=st.selectedDate||today, t=DB.workoutType(sel),log=st.logs[sel];
 return `<div class="calendar-layout"><div class="card calendar-card"><div class="calendar-toolbar"><button class="icon-button" data-month="-1">‹</button><h2>${new Intl.DateTimeFormat("tr-TR",{month:"long",year:"numeric"}).format(calendarCursor)}</h2><button class="icon-button" data-month="1">›</button></div><div class="calendar-grid">${["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].map(x=>`<div class="cal-weekday">${x}</div>`).join("")}${cells.join("")}</div><div class="calendar-legend"><span><i class="legend-dot"></i> Antrenman</span><span><i class="legend-dot done"></i> Tamamlandı</span><span><i class="legend-today"></i> Bugün</span></div></div>
 <div class="card selected-day"><div class="eyebrow green">SEÇİLİ GÜN</div><h2>${DB.formatDate(sel,{weekday:"long",day:"numeric",month:"long"})}</h2>${t?`<div class="selected-workout"><span class="type-badge">${t}</span><b>${t==="A"?"Tam Vücut A":"Tam Vücut B"}</b><small>${PROGRAM[t].length} hareket · ${log?progressFor(sel):0}% tamamlandı</small></div><ul class="mini-ex-list">${PROGRAM[t].map(ex=>`<li>${ex.name}<small>${(log?.exercises[ex.id]?.sets.length||ex.sets)} × ${ex.reps}</small></li>`).join("")}</ul><button class="btn btn-primary full" data-open-workout="${sel}">Bu antrenmanı aç →</button>`:`<div class="empty-state compact"><div class="empty-icon">☀</div><b>Dinlenme günü</b><p>Toparlanma da programın bir parçası.</p></div>`}</div></div>`;
}
function exerciseCategory(ex){
 const m=ex.muscle.toLocaleLowerCase("tr-TR");
 if(m.includes("göğüs")) return "Göğüs";
 if(m.includes("sırt")) return "Sırt";
 if(m.includes("bacak")||m.includes("kalça")||m.includes("baldır")) return "Bacak";
 if(m.includes("omuz")) return "Omuz";
 if(m.includes("biceps")||m.includes("triceps")||m.includes("kol")||m.includes("ön kol")) return "Kol";
 return "Diğer";
}
function filteredLibrary(){
 const query=libraryQuery.trim().toLocaleLowerCase("tr-TR");
 return allExercises.filter(ex=>(libraryFilter==="Tümü"||exerciseCategory(ex)===libraryFilter)&&(!query||ex.searchText.includes(query)));
}
function renderLibrary(){
 const categories=["Tümü","Göğüs","Sırt","Bacak","Omuz","Kol","Diğer"];
 const list=filteredLibrary();
 const detail=selectedExercise?allExercises.find(e=>e.id===selectedExercise):null;
 return `<div class="library-intro"><div><h2>Hareketleri doğru öğren.</h2><p>Programındaki hareketleri keşfet; hedef kası, ekipmanı ve doğru tekniği adım adım öğren.</p></div><div class="library-count">${allExercises.length}<small>HAREKET</small></div></div>
 ${detail?`<div class="card detail-card"><button class="text-button" data-close-detail>← Tüm hareketler</button><div class="detail-hero"><div class="exercise-symbol big">◈</div><div><div class="eyebrow green">${esc(detail.muscle)} · ${exerciseCategory(detail)}</div><h2>${esc(detail.name)}</h2><p>${esc(detail.equipment)}</p></div></div><div class="movement-demo" role="img" aria-label="${esc(detail.name)} için döngülü hareket animasyonu"><div class="movement-demo-head"><b>Hareket canlandırması</b><span>Döngülü görsel rehber</span></div>${renderExerciseAnimation(detail)}<p>Bu animasyon hareket yolunu gösterir. Tekniği aşağıdaki adımlarla kontrol et.</p></div><div class="detail-columns"><div><h3>Nasıl yapılır?</h3><ol class="instruction-list">${detail.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></div><div class="tip-box"><b>Teknik ipuçları</b><ul>${detail.cues.map(c=>`<li>${esc(c)}</li>`).join("")}</ul><small>Program önerisi: ${detail.sets} set · ${detail.reps} tekrar · ${detail.rest} sn dinlenme</small><p class="library-load">Başlangıç yükü: ${esc(detail.load)}</p></div></div></div>`:
 `<label class="library-search"><span>⌕</span><input type="search" id="library-search" placeholder="Hareket veya kas grubu ara…" value="${esc(libraryQuery)}" autocomplete="off"></label>
 <div class="filter-row">${categories.map(m=>`<button class="filter-chip ${libraryFilter===m?"active":""}" data-filter="${m}">${m}</button>`).join("")}</div>
 <div id="library-results">${renderLibraryResults(list)}</div>`}`;
}
function renderExerciseAnimation(ex){
 const id=ex.id.toLowerCase();
 if(/hip-thrust|glute-bridge/.test(id))return `<div class="motion-stage motion-hip"><svg viewBox="0 0 320 150" aria-hidden="true"><path class="motion-floor" d="M32 128H288"/><path class="motion-bench" d="M38 101h57v12H38zm8 12v15m41-15v15"/><circle cx="108" cy="87" r="9"/><path class="motion-hip-torso" d="M115 87l46 13 24-15"/><path class="motion-hip-legs" d="M161 100l31 17 38-1m-38-1 13-27 25 0"/><path class="motion-arms" d="M120 91l-5 25m15-22-8 22"/><path class="motion-path" d="M150 103q20-35 42-8"/></svg><span>Omuzlarını sehpada tut · kalçanı kaldır ve kontrollü indir</span></div>`;
 const isHinge=/romanian-deadlift|hip-hinge|good-morning/.test(id),isLower=exerciseCategory(ex)==="Bacak",isCore=/plank|dead-bug|cable-crunch/i.test(id),isPush=/press|push|fly/i.test(id);
 const motion=isCore?"core":isHinge?"hinge":isLower?"lower":isPush?"push":"pull";
 return `<div class="motion-stage motion-${motion}"><svg viewBox="0 0 320 150" aria-hidden="true"><path class="motion-floor" d="M32 128H288"/><g class="motion-body"><circle cx="160" cy="29" r="12"/><path d="M160 42v42"/><g class="motion-arms"><path d="M160 52l-37 18-18 20m55-38 37 18 18 20"/></g><g class="motion-legs"><path d="M160 84l-23 24 2 19m21-43 23 24-2 19"/></g><path class="motion-weight" d="M98 88v18m-5-13h10m119-5v18m-5-13h10"/></g><path class="motion-path" d="M110 58q-18-23 0-40m100 40q18-23 0-40"/></svg><span>${isCore?"Gövdeyi kontrollü sabitle":isHinge?"Kalçanı geriye al · sırtını nötr tut":isLower?"Kontrollü in · güçlü kalkış":isPush?"İt · kontrollü başlangıca dön":"Çek · kontrollü bırak"}</span></div>`;
}
function renderLibraryResults(list){
 const visible=list.slice(0,libraryVisibleCount);
 if(!list.length)return `<div class="empty-state"><div class="empty-icon">⌕</div><b>Hareket bulunamadı</b><p>Arama kelimesini veya kas grubu filtresini değiştir.</p></div>`;
 return `<div class="library-grid">${visible.map(ex=>`<button class="library-card" data-exercise="${ex.id}"><div class="library-card-top"><span class="exercise-symbol">${exerciseCategory(ex)==="Bacak"?"◒":exerciseCategory(ex)==="Sırt"?"↗":"◈"}</span><span class="arrow">↗</span></div><b>${esc(ex.name)}</b><small>${esc(ex.muscle)} · ${esc(ex.equipment)}</small><div class="library-card-bottom"><span>${ex.sets} × ${ex.reps}</span><span>Tekniği gör →</span></div></button>`).join("")}</div>${list.length>visible.length?`<button class="btn btn-secondary library-load-more" data-library-more>Daha fazla göster (${visible.length}/${list.length})</button>`:""}`;
}
function renderWeight(){
 const st=DB.getState(),weights=st.weights,latest=weights.at(-1)?.weight??st.profile.currentWeight,first=weights[0]?.weight??st.profile.startWeight,delta=latest-first;
 const points=weights.slice(-12),min=Math.min(...points.map(p=>p.weight),st.profile.targetWeight)-1,max=Math.max(...points.map(p=>p.weight),st.profile.targetWeight)+1;
 const coords=points.map((p,i)=>{const x=points.length===1?50:8+i/(points.length-1)*84,y=88-(p.weight-min)/(max-min)*72;return `${x},${y}`;}).join(" ");
 const circles=points.map((p,i)=>{const x=points.length===1?50:8+i/(points.length-1)*84,y=88-(p.weight-min)/(max-min)*72;return `<circle cx="${x}" cy="${y}" r="1.7" fill="var(--green)"/>`;}).join("");
 return `<div class="stats-grid">${stat("SON KİLO",fmt(latest,1),"kg","⚖")}${stat("BAŞLANGIÇ",fmt(first,1),"kg","◎")}${stat("DEĞİŞİM",`${delta>0?"+":""}${fmt(delta,1)}`,"kg","↗")}${stat("HEDEF",fmt(st.profile.targetWeight,1),"kg","★")}</div>
 <div class="two-col">${card("Kilo gelişim grafiği","Kayıt ettiğin son 12 ölçüm",`<div class="chart-wrap"><svg viewBox="0 0 100 100" preserveAspectRatio="none" class="weight-chart"><line x1="5" y1="88" x2="95" y2="88" stroke="#30372f" stroke-width=".5"/><line x1="5" y1="50" x2="95" y2="50" stroke="#30372f" stroke-width=".5"/><line x1="5" y1="12" x2="95" y2="12" stroke="#30372f" stroke-width=".5"/><polyline points="${coords}" fill="none" stroke="var(--green)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>${circles}</svg><div class="chart-labels">${points.map(p=>`<span>${DB.formatDate(p.date,{day:"numeric",month:"short"})}<b>${fmt(p.weight,1)}</b></span>`).join("")}</div></div>`)}
 ${card("Yeni kilo kaydı","Sabah, tuvalet sonrası ve benzer koşullarda tartıl.",`<form id="weight-form" class="form-stack"><label>Tarih<input type="date" name="date" value="${today}" required></label><label>Kilo (kg)<input type="number" name="weight" min="25" max="300" step=".1" placeholder="63.0" required></label><button class="btn btn-primary">Kilo kaydet</button></form>`)}
 </div>
 ${card("Vücut ölçümleri","Aynı koşullarda 2–4 haftada bir ölç.",`<form id="measure-form" class="measure-grid">${["Göğüs","Bel","Omuz","Kol","Kalça","Uyluk"].map(x=>`<label>${x} (cm)<input type="number" name="${x}" min="1" max="250" step=".1" placeholder="—"></label>`).join("")}<button class="btn btn-secondary full">Ölçümleri kaydet</button></form><div class="history-list">${st.measurements.slice(-5).reverse().map(m=>`<div><b>${DB.formatDate(m.date)}</b><span>${Object.entries(m).filter(([k,v])=>k!=="date"&&v).map(([k,v])=>`${k}: ${v} cm`).join(" · ")}</span></div>`).join("")||'<p class="muted">Henüz ölçüm kaydı yok.</p>'}</div>`)}
 <div class="notice">Kilo değişimini günlük dalgalanmalara göre değil, haftalık ortalamalara göre yorumla. Hedefin haftada yaklaşık 0,2–0,35 kg artış; hızlı artış için kendini zorlama.</div>`;
}
function renderNutrition(){
 const st=DB.getState(),n=st.nutrition[today]||{},p=st.profile;
 const kcal=n.calories||0,protein=n.protein||0,water=n.water||0;
 return `<div class="nutrition-intro"><div><div class="eyebrow green">GÜNLÜK TAKİP</div><h2>Beslenmeni de antrenman gibi takip et.</h2><p>Kas gelişimi için yeterli enerji, protein ve düzenli öğün.</p></div><div class="nutrition-date">${DB.formatDate(today,{day:"numeric",month:"long"})}</div></div>
 <div class="stats-grid">${stat("KALORİ",fmt(kcal),`/ ${p.calories} kcal`,"◉")}${stat("PROTEİN",fmt(protein),`/ ${p.protein} g`,"◈")}${stat("SU",fmt(water),"/ 2500 ml","◌")}${stat("HEDEF",`${Math.round(protein/Math.max(1,p.protein)*100)}%`,"protein","✓")}</div>
 <div class="two-col">${card("Bugünkü beslenme kaydı","Öğünlerini ekledikçe günlük toplam güncellenir.",`<form id="food-form" class="form-stack"><label>Öğün / açıklama<input name="meal" placeholder="Örn. Tavuk, pilav, yoğurt"></label><div class="form-row"><label>Kalori (kcal)<input name="calories" type="number" min="0" placeholder="650"></label><label>Protein (g)<input name="protein" type="number" min="0" placeholder="40"></label></div><button class="btn btn-primary">Öğünü ekle</button></form><div class="food-log">${(n.meals||[]).map(m=>`<div><span><b>${esc(m.meal||"Öğün")}</b><small>${m.calories} kcal · ${m.protein} g protein</small></span><span>✓</span></div>`).join("")||'<p class="muted">Bugün henüz öğün eklemedin.</p>'}</div>`)}
 ${card("Su takibi","Bardağını veya ml miktarını ekle.",`<div class="water-counter"><div class="water-number">${fmt(water)}<small> / 2500 ml</small></div><div class="progress-track"><i style="width:${Math.min(100,water/2500*100)}%"></i></div><div class="water-actions"><button class="btn btn-secondary" data-water="-250">− 250 ml</button><button class="btn btn-primary" data-water="250">+ 250 ml</button><button class="btn btn-secondary" data-water="500">+ 500 ml</button></div></div>`)}
 </div><div class="notice">Kalori hedefi başlangıç tahminidir; yaş, günlük hareket, iştah ve kilo eğilimine göre ayarlanmalıdır. Protein hedefi yaklaşık 1,7–2,0 g/kg aralığından seçilmiştir.</div>`;
}
function renderAchievements(){
 const xp=DB.totalXP(),level=Math.floor(xp/250)+1,done=Object.keys(DB.getState().logs).filter(d=>progressFor(d)===100).length;
 const badges=[{icon:"🌱",name:"İlk Adım",desc:"İlk setini tamamla",ok:xp>0},{icon:"💪",name:"İlk Antrenman",desc:"Bir antrenmanı bitir",ok:done>=1},{icon:"🔥",name:"Rutin Oluşturucu",desc:"3 antrenman tamamla",ok:done>=3},{icon:"⭐",name:"250 XP Kulübü",desc:"250 XP kazan",ok:xp>=250},{icon:"🏆",name:"500 XP Kulübü",desc:"500 XP kazan",ok:xp>=500},{icon:"⚖️",name:"Takipçi",desc:"İlk kilo kaydını ekle",ok:DB.getState().weights.length>1}];
 return `<div class="achievement-hero"><div><div class="eyebrow green">İLERLEMEN</div><h2>Her tekrar bir yatırım.</h2><p>İstikrarını puanlara ve başarılara dönüştür.</p></div><div class="big-xp"><b>${xp}</b><small>TOPLAM XP</small></div></div>
 <div class="level-card large"><div class="level-number">${level}</div><div class="level-info"><b>${levelName(level)}</b><small>${xp%250} / 250 XP · Sonraki seviyeye ${250-xp%250} XP</small><div class="progress-track"><i style="width:${xp%250/250*100}%"></i></div></div></div>
 <div class="section-heading"><h2>Rozet koleksiyonu</h2><span>${badges.filter(b=>b.ok).length}/${badges.length} açıldı</span></div><div class="badge-grid">${badges.map(b=>`<div class="badge-card ${b.ok?"unlocked":"locked"}"><div>${b.icon}</div><b>${b.name}</b><small>${b.desc}</small><span>${b.ok?"AÇILDI":"KİLİTLİ"}</span></div>`).join("")}</div>
 ${card("Puan nasıl hesaplanıyor?","Puanlar tamamlanan set sayısına göre otomatik hesaplanır.",`<div class="xp-rules"><div><span>Isınma / mobilite görevi</span><b>+5 XP</b></div><div><span>Ana bileşik hareketin tüm setleri</span><b>+15 XP</b></div><div><span>Yardımcı hareketin tüm setleri</span><b>+10 XP</b></div><div><span>Tüm günlük antrenmanı bitirme</span><b>+20 XP</b></div><div><span>Her 250 XP</span><b>1 seviye</b></div></div><p class="muted small">Kısmi setlerde puan orantılıdır. Puanlar tamamlanan setlerden türetilir; aynı seti tekrar işaretlemek ikinci kez puan vermez. İleride haftalık devamlılık bonusu eklenebilir.</p>`)}
 `;
}
function renderProfile(){
 const p=DB.getState().profile;
 return `<div class="profile-layout">${card("Kişisel profil","Programın bu bilgilere göre düzenlenir.",`<form id="profile-form" class="form-stack"><label>Adın<input name="name" value="${esc(p.name)}"></label><label>Program başlangıç tarihi<input name="startDate" type="date" value="${esc(p.startDate||today)}"></label><div class="form-row"><label>Boy (cm)<input name="height" type="number" value="${p.height}"></label><label>Başlangıç kilosu (kg)<input name="startWeight" type="number" step=".1" value="${p.startWeight}"></label></div><div class="form-row"><label>Hedef kilo (kg)<input name="targetWeight" type="number" step=".1" value="${p.targetWeight}"></label><label>Günlük kalori hedefi<input name="calories" type="number" value="${p.calories}"></label></div><label>Günlük protein hedefi (g)<input name="protein" type="number" value="${p.protein}"></label><fieldset><legend>Antrenman günleri (3 gün seç)</legend>${[["1","Pazartesi"],["2","Salı"],["3","Çarşamba"],["4","Perşembe"],["5","Cuma"],["6","Cumartesi"],["0","Pazar"]].map(([v,l])=>`<label class="inline-check"><input type="checkbox" name="days" value="${v}" ${p.days.includes(v)?"checked":""}>${l}</label>`).join("")}</fieldset><button class="btn btn-primary">Profili kaydet</button></form>`)}
 ${card("Veri yedekleme","Kayıtların bu cihazın tarayıcısında saklanır. Düzenli yedek al.",`<div class="backup-actions"><button class="btn btn-secondary" id="export-data">↓ Yedeği indir (JSON)</button><label class="btn btn-secondary file-button">↑ Yedek yükle<input type="file" id="import-data" accept="application/json" hidden></label></div><p class="muted small">Bu sürümde kullanıcı hesabı ve bulut eşitlemesi yoktur. Tarayıcı verilerini temizlemek kayıtları silebilir.</p>`)}
 ${card("12 haftalık program","Başlangıç seviyesine uygun, haftada 3 gün A/B tam vücut planı.",`<div class="program-phases"><div><b>1–2. hafta</b><span>Teknik öğrenimi · 2 set · hafif yük</span></div><div><b>3–4. hafta</b><span>Hareket başına 3 set</span></div><div><b>5. hafta</b><span>Toparlanma · setleri 1’e indir</span></div><div><b>6–12. hafta</b><span>Bileşik hareketlerde 3, yardımcı hareketlerde 2 set; kontrollü yük artışı</span></div><div><b>9–12. hafta</b><span>Performans değerlendirmesi ve istikrarlı gelişim</span></div></div>`)}
 </div>`;
}
function levelName(l){return ["Yeni Başlayan","İstikrarlı","Güçleniyor","Disiplinli","Performans Odaklı","FORM Elçisi"][Math.min(5,Math.max(0,l-1))];}
function bindPage(){
 app.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
 app.querySelectorAll("[data-date]").forEach(b=>b.addEventListener("click",()=>{DB.setSelectedDate(b.dataset.date);if(page==="calendar")renderPage();else navigate("workout");}));
 app.querySelectorAll("[data-open-workout]").forEach(b=>b.addEventListener("click",()=>{DB.setSelectedDate(b.dataset.openWorkout);navigate("workout");}));
 app.querySelectorAll("[data-month]").forEach(b=>b.addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()+Number(b.dataset.month));renderPage();}));
 app.querySelectorAll("[data-exercise]:not(.library-card)").forEach(b=>b.addEventListener("click",()=>{selectedExercise=b.dataset.exercise;const ex=allExercises.find(x=>x.id===selectedExercise);openExerciseModal(ex);}));
 app.querySelectorAll("[data-close-detail]").forEach(b=>b.addEventListener("click",()=>{selectedExercise=null;renderPage();}));
 app.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{libraryFilter=b.dataset.filter;libraryVisibleCount=LIBRARY_PAGE_SIZE;renderPage();}));
 app.querySelectorAll("[data-theme-select]").forEach(b=>b.addEventListener("click",()=>{
  activeTheme=b.dataset.themeSelect;document.documentElement.dataset.theme=activeTheme;
  try{localStorage.setItem(THEME_KEY,activeTheme);}catch{}
  app.querySelectorAll("[data-theme-select]").forEach(x=>{const selected=x.dataset.themeSelect===activeTheme;x.classList.toggle("active",selected);x.setAttribute("aria-pressed",String(selected));});
 }));
 $("#library-search")?.addEventListener("input",e=>{libraryQuery=e.target.value;libraryVisibleCount=LIBRARY_PAGE_SIZE;const results=$("#library-results");if(results)results.innerHTML=renderLibraryResults(filteredLibrary());});
 $("#library-results")?.addEventListener("click",e=>{
  const exercise=e.target.closest("[data-exercise]");
  if(exercise){selectedExercise=exercise.dataset.exercise;renderPage();return;}
  if(!e.target.closest("[data-library-more]"))return;
  libraryVisibleCount+=LIBRARY_PAGE_SIZE;const results=$("#library-results");results.innerHTML=renderLibraryResults(filteredLibrary());
 });
 app.querySelectorAll("[data-set]").forEach(inp=>inp.addEventListener("change",()=>{DB.updateSet(DB.getState().selectedDate||today,inp.dataset.set,Number(inp.dataset.index),{done:inp.checked});renderPage();}));
 app.querySelectorAll("[data-weight],[data-reps]").forEach(inp=>inp.addEventListener("change",()=>{const date=DB.getState().selectedDate||today,log=DB.ensureLog(date);const ex=inp.dataset.weight||inp.dataset.reps;const idx=Number(inp.dataset.index);const key=inp.hasAttribute("data-weight")?"weight":"reps";DB.updateSet(date,ex,idx,{[key]:inp.value});}));
 $("#weight-form")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);const ok=DB.addWeight(f.get("weight"),f.get("date"));if(ok){renderPage();toast("Kilo kaydedildi.");}});
 $("#measure-form")?.addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));DB.addMeasurement(Object.fromEntries(Object.entries(data).filter(([,v])=>v)));renderPage();toast("Ölçümlerin kaydedildi.");});
 $("#food-form")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),n=DB.getState().nutrition[today]||{};const meal={meal:f.get("meal"),calories:Number(f.get("calories")||0),protein:Number(f.get("protein")||0)};DB.updateNutrition(today,{calories:(n.calories||0)+meal.calories,protein:(n.protein||0)+meal.protein,meals:[...(n.meals||[]),meal]});renderPage();toast("Öğün eklendi.");});
 app.querySelectorAll("[data-water]").forEach(b=>b.addEventListener("click",()=>{const n=DB.getState().nutrition[today]||{};DB.updateNutrition(today,{water:Math.max(0,(n.water||0)+Number(b.dataset.water))});renderPage();}));
 $("#profile-form")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),days=f.getAll("days");DB.updateProfile({name:f.get("name"),startDate:f.get("startDate"),height:Number(f.get("height")),startWeight:Number(f.get("startWeight")),targetWeight:Number(f.get("targetWeight")),calories:Number(f.get("calories")),protein:Number(f.get("protein")),days:days.slice(0,3)});renderPage();toast("Profilin güncellendi.");});
 $("#export-data")?.addEventListener("click",DB.exportData);
 $("#import-data")?.addEventListener("change",async e=>{try{await DB.importData(e.target.files[0]);renderPage();toast("Yedek yüklendi.");}catch{toast("Yedek dosyası okunamadı.");}});
}
function openExerciseModal(ex){
 const modal=document.createElement("div");modal.className="modal-backdrop";modal.innerHTML=`<div class="modal"><button class="modal-close">×</button><div class="eyebrow green">${esc(ex.muscle)}</div><h2>${ex.name}</h2><p class="muted">${ex.equipment}</p><h3>Uygulama</h3><ol class="instruction-list">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol><div class="tip-box"><b>Dikkat</b><ul>${ex.cues.map(c=>`<li>${c}</li>`).join("")}</ul></div></div>`;
 document.body.append(modal);modal.addEventListener("click",e=>{if(e.target===modal||e.target.closest(".modal-close"))modal.remove();});
}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.append(t);setTimeout(()=>t.remove(),2200);}
function mountAssistant(){
 document.body.insertAdjacentHTML("beforeend",`<button class="chat-launcher" id="chat-launcher" aria-label="Yardım sohbetini aç" aria-expanded="false">?<span>Yardım</span></button><section class="chat-panel" id="chat-panel" aria-label="FORM Fitness yardım sohbeti" hidden><header><div><b>FORM Yardım</b><small>Uygulama içi rehber</small></div><button type="button" id="chat-close" aria-label="Sohbeti kapat">×</button></header><div class="chat-messages" id="chat-messages" aria-live="polite"><p class="chat-bubble assistant">Merhaba! Hareket tekniği, setler, takvim veya uygulama kullanımı hakkında sorabilirsin.</p></div><div class="chat-suggestions"><button type="button" data-chat-prompt="Antrenman programım nerede?">Programım nerede?</button><button type="button" data-chat-prompt="Bir hareketi nasıl yaparım?">Hareket tekniği</button></div><form id="chat-form"><label class="sr-only" for="chat-input">Sorunu yaz</label><input id="chat-input" autocomplete="off" placeholder="Nasıl yardımcı olayım?" required><button class="btn btn-primary" aria-label="Soruyu gönder">Gönder</button></form></section>`);
 const panel=$("#chat-panel"),launcher=$("#chat-launcher"),messages=$("#chat-messages"),input=$("#chat-input");
 const toggle=open=>{panel.hidden=!open;launcher.setAttribute("aria-expanded",String(open));if(open)input.focus();};
 launcher.addEventListener("click",()=>toggle(panel.hidden));$("#chat-close").addEventListener("click",()=>toggle(false));
 const send=value=>{const question=value.trim();if(!question)return;const user=document.createElement("p");user.className="chat-bubble user";user.textContent=question;messages.append(user);const answer=document.createElement("p");answer.className="chat-bubble assistant";answer.textContent=assistantAnswer(question);messages.append(answer);messages.scrollTop=messages.scrollHeight;input.value="";};
 $("#chat-form").addEventListener("submit",e=>{e.preventDefault();send(input.value);});
 panel.querySelectorAll("[data-chat-prompt]").forEach(b=>b.addEventListener("click",()=>send(b.dataset.chatPrompt)));
}
function assistantAnswer(question){
 const q=question.toLocaleLowerCase("tr-TR");
 if(/ağrı|acı|başım dön|baş dön|sakat/.test(q))return "Ağrı, baş dönmesi veya olağandışı bir belirti olursa hareketi bırak. Tekniği salon eğitmenine kontrol ettir; belirti sürerse sağlık uzmanına danış.";
 const movement=allExercises.find(ex=>q.includes(ex.name.toLocaleLowerCase("tr-TR"))||ex.searchText.split(" ").some(word=>word.length>4&&q.includes(word))&&/hareket|nasıl|form|teknik|yapılır/.test(q));
 if(movement)return `${movement.name}: ${movement.steps[0]} ${movement.steps[1]} ${movement.steps[2]} Hareket detaylarında tüm adımları ve teknik ipuçlarını görebilirsin.`;
 if(/hareket|form|teknik|nasıl yap/.test(q))return "Hareket Kütüphanesi’ni açıp isme veya kas grubuna göre ara. Bir harekete dokununca adımlar ve teknik ipuçları görünür.";
 if(/set|tekrar|ağırlık|kilo/.test(q))return "Antrenman sayfasında her setin kilosunu ve tekrarını girebilir, tamamladığın seti işaretleyebilirsin. Program haftana göre set sayısı ayarlanır.";
 if(/takvim|program|antrenman günü/.test(q))return "Takvimde antrenman günlerini ve A/B planını görebilirsin. Program günlerini Profil bölümünden seçebilirsin.";
 if(/protein|kalori|beslenme|su|öğün/.test(q))return "Beslenme sayfasında öğün, protein, kalori ve su kaydı ekleyebilirsin. Günlük hedefler Profil ayarlarından değişir.";
 if(/renk|tema/.test(q))return "Renk temasını üst çubuktaki dört renk düğmesinden seçebilirsin. Seçimin bu cihazda saklanır.";
 if(/yedek|veri|kayıt|profil|ayar/.test(q))return "Profil & Ayarlar bölümünde bilgilerini düzenleyebilir ve JSON yedeği alıp geri yükleyebilirsin. Antrenman kayıtların bu tarayıcıda saklanır.";
 return "Hareket tekniği, antrenman setleri, takvim, beslenme, renk teması veya veri yedeği hakkında sorabilirsin. Hareket adı yazarsan o hareketin adımlarını da bulmaya çalışırım.";
}
window.addEventListener("formstate",()=>{const active=document.activeElement;if(!active||!["INPUT","TEXTAREA"].includes(active.tagName))renderPage();});
shell();
mountAssistant();
if("serviceWorker" in navigator && location.protocol!=="file:"){navigator.serviceWorker.register("./sw.js").catch(()=>{});}
