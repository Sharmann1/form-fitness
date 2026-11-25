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
function animation(ex) {
  const id = ex.id.toLowerCase();
  if (/hip-thrust|glute-bridge/.test(id)) return `<div class="motion motion-hip"><svg viewBox="0 0 320 150" aria-hidden="true"><path class="floor" d="M32 128H288"/><path d="M38 101h57v12H38zm8 12v15m41-15v15"/><circle cx="108" cy="87" r="9"/><path class="hip-torso" d="M115 87l46 13 24-15"/><path d="M161 100l31 17 38-1m-38-1 13-27 25 0m-110-5-5 25m15-22-8 22"/><path class="path" d="M150 103q20-35 42-8"/></svg><span>Omuzlarını sehpada tut · kalçanı kaldır ve kontrollü indir</span></div>`;
  const isCore = /plank|dead-bug|cable-crunch/i.test(id), isHinge = /romanian-deadlift|hip-hinge|good-morning/.test(id), isLower = category(ex) === "Bacak", isPush = /press|push|fly/i.test(id);
  const motion = isCore ? "core" : isHinge ? "hinge" : isLower ? "lower" : isPush ? "push" : "pull";
  const cue = isCore ? "Gövdeni sabit tut" : isHinge ? "Kalçanı geriye al · sırtını nötr tut" : isLower ? "Kontrollü in · güçlü kalkış" : isPush ? "İt · kontrollü başlangıca dön" : "Çek · kontrollü bırak";
  return `<div class="motion motion-${motion}"><svg viewBox="0 0 320 150" aria-hidden="true"><path class="floor" d="M32 128H288"/><g class="motion-body"><circle cx="160" cy="29" r="12"/><path d="M160 42v42"/><g class="motion-arms"><path d="M160 52l-37 18-18 20m55-38 37 18 18 20"/></g><path d="M160 84l-23 24 2 19m21-43 23 24-2 19m-62-37v18m-5-13h10m109-5v18m-5-13h10"/></g><path class="path" d="M110 58q-18-23 0-40m100 40q18-23 0-40"/></svg><span>${cue}</span></div>`;
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
