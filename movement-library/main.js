import { PROGRAM, LIBRARY_EXTRAS } from "../src/data.js";

const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const exercises = [...new Map([...PROGRAM.A, ...PROGRAM.B, ...LIBRARY_EXTRAS].map(ex => [ex.id, ex])).values()]
  .map(ex => ({ ...ex, searchText: `${ex.name} ${ex.muscle} ${ex.equipment}`.toLocaleLowerCase("tr-TR") }));
const categories = ["Tümü", "Göğüs", "Sırt", "Bacak", "Omuz", "Kol", "Diğer"];
const state = { filter: "Tümü", query: "", selected: null, limit: 18 };
const content = $("#library-content");
const count = $("#movement-count");
try { const theme = localStorage.getItem("form-fitness-theme-v1"); if (["green", "red", "blue", "pink"].includes(theme)) document.documentElement.dataset.theme = theme; } catch {}

function category(ex) {
  const muscle = ex.muscle.toLocaleLowerCase("tr-TR");
  if (muscle.includes("göğüs")) return "Göğüs";
  if (muscle.includes("sırt")) return "Sırt";
  if (["bacak", "kalça", "baldır"].some(word => muscle.includes(word))) return "Bacak";
  if (muscle.includes("omuz")) return "Omuz";
  if (["biceps", "triceps", "kol", "ön kol"].some(word => muscle.includes(word))) return "Kol";
  return "Diğer";
}
function results() {
  const query = state.query.trim().toLocaleLowerCase("tr-TR");
  return exercises.filter(ex => (state.filter === "Tümü" || category(ex) === state.filter) && (!query || ex.searchText.includes(query)));
}
function symbol(ex) { return category(ex) === "Bacak" ? "◒" : category(ex) === "Sırt" ? "↗" : "◈"; }
function cards(list) {
  const shown = list.slice(0, state.limit);
  return `${shown.length ? `<div class="movement-grid">${shown.map(ex => `<button class="movement-card" type="button" data-open="${escapeHtml(ex.id)}"><span class="movement-card-top"><span class="movement-icon">${symbol(ex)}</span><span class="muscle-tag">${escapeHtml(category(ex))}</span></span><b>${escapeHtml(ex.name)}</b><small>${escapeHtml(ex.muscle)} · ${escapeHtml(ex.equipment)}</small><span class="movement-card-foot"><span>${ex.sets} × ${escapeHtml(ex.reps)}</span><span>Tekniği gör →</span></span></button>`).join("")}</div>` : `<div class="empty-state"><b>Bu aramayla hareket bulunamadı.</b><br>Başka bir hareket adı veya kas grubu dene.</div>`}${list.length > shown.length ? `<button class="load-more" type="button" data-more>Daha fazla göster (${shown.length}/${list.length})</button>` : ""}`;
}
const motionProfiles = {
  "chest-press": {pose:"seated",part:"arms",tool:"machine",from:-28,to:19,duration:1.8,cue:"Tutacakları göğüsten ileri it; omuzlarını aşağıda tut."},
  "lat-pulldown": {pose:"seated",part:"arms",tool:"cable",from:36,to:-13,duration:2.05,cue:"Barı köprücük kemiğine doğru çek; ensene indirme."},
  "leg-press": {pose:"seated",part:"legs",tool:"press",from:-30,to:12,duration:2.2,cue:"Platformu it; dizlerini kilitlemeden kontrollü geri dön."},
  "shoulder-press": {pose:"seated",part:"arms",tool:"dumbbells",from:32,to:-40,duration:1.9,cue:"Dambılları baş üzerine kaldır; belini çukurlaştırma."},
  "cable-row": {pose:"seated",part:"arms",tool:"cable",from:30,to:-11,duration:2.1,cue:"Tutacağı göbek hizana çek; gövdeni sallama."},
  "biceps-curl": {pose:"standing",part:"forearms",tool:"dumbbells",from:2,to:-92,duration:1.65,cue:"Dirseklerini sabit tut; dambılları omuzlarına yaklaştır."},
  "triceps-pushdown": {pose:"standing",part:"forearms",tool:"cable",from:-38,to:48,duration:1.75,cue:"Dirsekleri gövdene yakın tut; ipi aşağı doğru bastır."},
  "incline-press": {pose:"incline",part:"arms",tool:"dumbbells",from:-32,to:24,duration:1.9,cue:"Eğimli sehpada dambılları yukarı it; bileklerini düz tut."},
  "chest-supported-row": {pose:"incline",part:"arms",tool:"machine",from:26,to:-15,duration:2.15,cue:"Göğsünü minderde tut; dirseklerini geriye çek."},
  "leg-curl": {pose:"seated",part:"legs",tool:"machine",from:0,to:-70,duration:1.85,cue:"Topuklarını kalçana yaklaştır; pedleri yavaşça bırak."},
  "lateral-raise": {pose:"standing",part:"arms",tool:"dumbbells",from:4,to:-74,duration:1.75,cue:"Kolları yana kaldır; omuz hizasında dur ve yavaşça indir."},
  "face-pull": {pose:"standing",part:"arms",tool:"cable",from:24,to:-18,duration:1.9,cue:"İpi yüzüne çek; dirseklerini dışa aç ve kürek kemiklerini yaklaştır."},
  "hammer-curl": {pose:"standing",part:"forearms",tool:"dumbbells",from:-4,to:-82,duration:1.58,cue:"Avuç içlerini birbirine bakar tut; dirsekleri sabitle."},
  "calf-raise": {pose:"standing",part:"legs",tool:"step",from:0,to:-34,duration:1.65,cue:"Topuklarını yükselt, kısa süre sık ve kontrollü indir."},
  "goblet-squat": {pose:"squat",part:"torso",tool:"dumbbells",from:0,to:14,duration:2.1,cue:"Ağırlığı göğüste tut; dizlerini ayak yönünde izleyerek çömel."},
  "romanian-deadlift": {pose:"hinge",part:"torso",tool:"dumbbells",from:0,to:31,duration:2.2,cue:"Kalçanı geriye gönder; ağırlıkları bacaklarına yakın indir."},
  "hip-thrust": {pose:"bridge",part:"hips",tool:"bench",from:5,to:-25,duration:1.9,cue:"Omuzlarını sehpada tut; kalçanı yükseltip kontrollü indir."},
  "leg-extension": {pose:"seated",part:"legs",tool:"machine",from:0,to:68,duration:1.78,cue:"Dizlerini açıp pedleri kaldır; üst noktada kilitleme."},
  "split-squat": {pose:"lunge",part:"legs",tool:"dumbbells",from:5,to:32,duration:2.25,cue:"İki dizini bükerek alçal; ön ayağınla zemini iterek yüksel."},
  "hip-abduction": {pose:"seated",part:"legs",tool:"machine",from:-7,to:31,duration:1.9,cue:"Dizlerini dışa aç; gövdeni sabit tut ve yavaşça kapat."},
  "hip-adduction": {pose:"seated",part:"legs",tool:"machine",from:27,to:-8,duration:1.92,cue:"Bacaklarını kontrollü birleştir; pedleri çarptırmadan aç."},
  "glute-kickback": {pose:"hinge",part:"legs",tool:"cable",from:0,to:-43,duration:2.0,cue:"Çalışan bacağını geriye uzat; belini oynatmadan başlangıca dön."},
  "pec-fly": {pose:"seated",part:"arms",tool:"machine",from:-41,to:36,duration:2.0,cue:"Kollarını göğüs önünde birleştir; omuzda esnemeyi zorlamadan aç."},
  "cable-fly": {pose:"standing",part:"arms",tool:"cable",from:35,to:-38,duration:2.05,cue:"Kabloları göğüs önünde birleştir; dirseklerde hafif büküm koru."},
  "push-up": {pose:"floor",part:"torso",tool:"mat",from:0,to:8,duration:1.85,cue:"Baştan topuğa düz çizgiyi koru; göğsünü indirip zemini it."},
  "one-arm-row": {pose:"hinge",part:"forearms",tool:"dumbbells",from:0,to:-82,duration:1.75,cue:"Dirseğini kalçana çek; omzunu kulağına yükseltme."},
  "assisted-pull-up": {pose:"hanging",part:"arms",tool:"machine",from:43,to:-12,duration:2.1,cue:"Dirseklerini aşağı çek; gövdeni savurmadan kontrollü uzat."},
  "straight-arm-pulldown": {pose:"standing",part:"arms",tool:"cable",from:-54,to:24,duration:1.9,cue:"Kolların hafif bükülü kalsın; barı uyluklarına doğru indir."},
  "back-extension": {pose:"prone",part:"torso",tool:"bench",from:-18,to:12,duration:2.2,cue:"Gövdeni kalçadan kaldır; üst noktada geriye aşırı yaylanma."},
  "rear-delt-fly": {pose:"hinge",part:"arms",tool:"dumbbells",from:-26,to:37,duration:1.85,cue:"Kollarını yana aç; boynunu gevşek ve omuzlarını alçak tut."},
  "front-raise": {pose:"standing",part:"arms",tool:"dumbbells",from:12,to:-69,duration:1.8,cue:"Dambılları öne, omuz hizasına kadar kontrollü kaldır."},
  "arnold-press": {pose:"seated",part:"arms",tool:"dumbbells",from:37,to:-42,duration:2.0,cue:"Yukarı iterken avuç içlerini dışa çevir; kontrollü geri döndür."},
  "overhead-triceps-extension": {pose:"standing",part:"forearms",tool:"dumbbells",from:-64,to:36,duration:1.9,cue:"Dirseklerini başının yanında tut; ağırlığı kontrollü indirip uzat."},
  "preacher-curl": {pose:"seated",part:"forearms",tool:"bench",from:5,to:-82,duration:1.7,cue:"Üst kollarını mindere yerleştir; ağırlığı savurmadan kaldır."},
  "incline-curl": {pose:"incline",part:"forearms",tool:"dumbbells",from:8,to:-88,duration:1.72,cue:"Kollarını gövdenin yanında sarkıt; dirseklerini oynatmadan kıvır."},
  "plank": {pose:"floor",part:"torso",tool:"mat",from:-2,to:3,duration:2.6,cue:"Başından topuğuna düz çizgiyi koru; karnını sıkıp nefes al."},
  "dead-bug": {pose:"supine",part:"legs",tool:"mat",from:-25,to:37,duration:2.15,cue:"Karşı kol ve bacağını uzat; belini zemine yakın ve sabit tut."},
  "cable-crunch": {pose:"kneeling",part:"torso",tool:"cable",from:-5,to:34,duration:1.9,cue:"Kaburgalarını kalçana yaklaştır; ipi kollarınla çekme."},
  "seated-calf-raise": {pose:"seated",part:"legs",tool:"machine",from:0,to:-39,duration:1.6,cue:"Topuklarını aşağı bırak; ayak ucuna yükselip baldırını sık."},
  "hip-hinge": {pose:"hinge",part:"torso",tool:"bodyweight",from:0,to:24,duration:2.0,cue:"Dizlerini yumuşatıp kalçanı geriye gönder; sırtını nötr tut."}
};
const motionTools = {
  machine: `<path class="gear" d="M242 36v84m-14 0h29M242 49h-16v25h16M233 88h9"/><circle class="gear-dot" cx="242" cy="35" r="5"/>`,
  cable: `<path class="gear" d="M252 27v81m-12-81h24m-12 0v17m0 0-23 25m23-25 12 27"/><circle class="gear-dot" cx="252" cy="44" r="5"/>`,
  dumbbells: `<path class="gear" d="M112 61h27m-22-7v14m17-14v14m39-13h29m-24-7v14m19-14v14"/>`,
  bench: `<path class="gear" d="M83 93h126m-115 0-9 30m100-30 9 30m-76-44 75-18 5 11-76 18z"/>`,
  press: `<path class="gear" d="M245 36l31 23-6 9-31-23m-20 8 18 14m-11 10 26 19m-38-3h40m-36 0 5 24m28-24 5 24"/>`,
  step: `<path class="gear" d="M75 122h96v8H75zm88-12h62v8h-62z"/>`,
  mat: `<path class="gear" d="M70 124h180"/>`,
  bodyweight: ""
};
const motionBodies = {
  standing: `<circle cx="156" cy="25" r="10"/><path class="torso" d="M156 36v40m0-27-24 20m24-20 24 20m-24 7-20 29 0 20m20-49 20 29 0 20"/>`,
  seated: `<circle cx="155" cy="31" r="10"/><path class="torso" d="M155 42v37m0-24-24 13m24-13 24 13m-24 13 36 7v25m-36-32-22 8v24"/><path class="gear" d="M118 84h70m-64 0v42m57-42v42"/>`,
  incline: `<circle cx="132" cy="48" r="9"/><path class="torso" d="M142 52l34 18m-24-12-22-15m28 19 27-6m-18 22 29 23m-29-23-35 18"/><path class="gear" d="M112 99h104m-89 0-8 26m82-26 9 26m-79-35 65-35 7 10-66 34z"/>`,
  hinge: `<circle cx="165" cy="31" r="9"/><path class="torso" d="M158 41l-28 23m9-6-24-18m24 18 30-2m-39-1-5 36-18 26m23-26 23 26"/>`,
  bridge: `<circle cx="101" cy="88" r="9"/><path class="torso" d="M111 89l41 9 27-22m-42 19 11 27m-11-27-30 24m69-46 25 18 17-2m-18-5 4-20 18-3"/><path class="gear" d="M42 115h59v9H42zm8 9v8m41-8v8"/>`,
  lunge: `<circle cx="155" cy="25" r="10"/><path class="torso" d="M155 36v38m0-24-21 12m21-12 20 12m-20 12-29 18-8 30m37-48 28 16 4 32"/>`,
  squat: `<circle cx="155" cy="27" r="10"/><path class="torso" d="M155 38v35m0-22-20 9m20-9 20 9m-20 13-26 23 8 25m18-48 28 20-7 28"/>`,
  floor: `<circle cx="91" cy="85" r="9"/><path class="torso" d="M102 87l54-1 23 7m-54-6-16-20m16 20-17 21m55-22 26-19m-2 27 15 21"/>`,
  hanging: `<circle cx="155" cy="32" r="9"/><path class="torso" d="M155 43v40m0-30-23-16m23 16 23-16m-23 46-20 30m20-30 21 30"/><path class="gear" d="M105 18h100m-7 0v7m-86-7v7"/>`,
  prone: `<circle cx="91" cy="91" r="9"/><path class="torso" d="M102 91h72l25-12m-72 12-24 16m24-16-5 20m53-20 18 16m-18-16 5 18"/>`,
  supine: `<circle cx="92" cy="93" r="9"/><path class="torso" d="M103 94h62m-34 0-11-29m11 29 11-29m27 29 22-20m-22 20 17 19"/>`,
  kneeling: `<circle cx="156" cy="29" r="9"/><path class="torso" d="M156 40v37m0-24-22 10m22-10 23 10m-23 14-25 23-27 0m52-23 26 23h18"/>`
};
function animation(ex) {
  const profile = motionProfiles[ex.id] || motionProfiles["hip-hinge"];
  const isLegs = ["legs", "hips"].includes(profile.part), pivot = profile.part === "forearms" ? "174px 58px" : profile.part === "torso" ? "156px 61px" : profile.part === "hips" ? "153px 99px" : isLegs ? "165px 91px" : "156px 54px";
  const moving = profile.part === "arms" ? `<g class="moving-part" style="--pivot:${pivot};--from:${profile.from}deg;--to:${profile.to}deg;--duration:${profile.duration}s"><path d="M156 49l-24 15-18 13m42-28 24 15 18 13"/><circle cx="114" cy="77" r="3"/><circle cx="198" cy="77" r="3"/></g>`
    : profile.part === "forearms" ? `<path d="M156 49l-24 15"/><g class="moving-part" style="--pivot:${pivot};--from:${profile.from}deg;--to:${profile.to}deg;--duration:${profile.duration}s"><path d="M174 54l24 12"/><circle cx="198" cy="66" r="3"/></g>`
    : profile.part === "legs" ? `<path d="M156 75l-22 29m22-29 8 16"/><g class="moving-part" style="--pivot:${pivot};--from:${profile.from}deg;--to:${profile.to}deg;--duration:${profile.duration}s"><path d="M164 91l28 14 7 20"/><circle cx="199" cy="125" r="3"/></g>`
    : profile.part === "hips" ? `<path d="M156 49l-24 15m24-15 24 15"/><g class="moving-part" style="--pivot:${pivot};--from:${profile.from}deg;--to:${profile.to}deg;--duration:${profile.duration}s"><path d="M156 76l-24 26 8 25m16-51 30 16 32-2"/></g>`
    : profile.part === "torso" ? `<g class="moving-part" style="--pivot:${pivot};--from:${profile.from}deg;--to:${profile.to}deg;--duration:${profile.duration}s"><path d="M156 36v40m0-29-22 13m22-13 23 13"/></g><path d="M156 76l-22 29 0 20m22-49 24 29 0 20"/>` : "";
  const apparatus = motionTools[profile.tool] || "";
  return `<div class="motion-stage exercise-motion motion-${ex.id}" data-motion="${escapeHtml(ex.id)}"><svg viewBox="0 0 320 150" role="img" aria-label="${escapeHtml(ex.name)} için özel hareket canlandırması"><path class="motion-floor" d="M36 132H284"/>${apparatus}<g class="motion-figure pose-${profile.pose}">${motionBodies[profile.pose]}${moving}</g><path class="motion-path" d="M${isLegs?"190 116":"111 57"} q${profile.from<0?"-12":"18"} -24 ${profile.to<0?"-28":"26"} -20"/></svg><span class="motion-caption">${escapeHtml(profile.cue)}</span></div>`;
}
function renderDetail(ex) {
  return `<article class="detail"><button class="detail-back" type="button" data-back>← Tüm hareketler</button><header class="detail-hero"><span class="movement-icon detail-icon">${symbol(ex)}</span><div><span class="muscle-tag">${escapeHtml(ex.muscle)} · ${category(ex)}</span><h2>${escapeHtml(ex.name)}</h2><p>${escapeHtml(ex.equipment)}</p></div></header><section class="demo" aria-label="${escapeHtml(ex.name)} için döngülü hareket rehberi"><div class="demo-head"><b>Hareket canlandırması</b><span>Kısa döngülü görsel rehber</span></div>${animation(ex)}<p class="demo-note">Canlandırmayı aşağıdaki adımlarla birlikte incele.</p></section><div class="detail-columns"><section><h3>Nasıl yapılır?</h3><ol class="steps">${ex.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section><aside class="tip"><b>Teknik ipuçları</b><ul class="cues">${ex.cues.map(cue => `<li>${escapeHtml(cue)}</li>`).join("")}</ul><small>Program önerisi: ${ex.sets} set · ${escapeHtml(ex.reps)} tekrar · ${ex.rest} sn dinlenme</small><p class="load">Başlangıç yükü: ${escapeHtml(ex.load || "Hafif yükle başla")}</p></aside></div></article>`;
}
function render() {
  count.textContent = `${exercises.length} hareket`;
  if (state.selected) {
    const exercise = exercises.find(ex => ex.id === state.selected);
    content.innerHTML = exercise ? renderDetail(exercise) : `<div class="empty-state">Hareket bulunamadı. <button type="button" data-back>Geri dön</button></div>`;
    return;
  }
  content.innerHTML = `<div class="library-controls"><label class="search"><span>⌕</span><input type="search" id="movement-search" placeholder="Hareket, kas grubu veya ekipman ara…" value="${escapeHtml(state.query)}" autocomplete="off"></label><div class="filters" role="group" aria-label="Kas grubu filtresi">${categories.map(name => `<button class="filter" type="button" data-filter="${name}" aria-pressed="${state.filter === name}">${name}</button>`).join("")}</div></div><div id="movement-results">${cards(results())}</div>`;
}
content.addEventListener("input", event => { if (event.target.id !== "movement-search") return; state.query = event.target.value; state.limit = 18; $("#movement-results").innerHTML = cards(results()); });
content.addEventListener("click", event => {
  const filter = event.target.closest("[data-filter]");
  if (filter) { state.filter = filter.dataset.filter; state.limit = 18; render(); return; }
  const open = event.target.closest("[data-open]");
  if (open) { state.selected = open.dataset.open; render(); return; }
  if (event.target.closest("[data-back]")) { state.selected = null; render(); return; }
  if (event.target.closest("[data-more]")) { state.limit += 18; render(); }
});
render();
