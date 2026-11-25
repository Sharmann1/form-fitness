import { EXERCISE_DEMOS } from "../src/exercise-demos.js";
import { PROGRAM, LIBRARY_EXTRAS } from "../src/data.js";

const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const exercises = [...new Map([...PROGRAM.A, ...PROGRAM.B, ...LIBRARY_EXTRAS].map(ex => [ex.id, ex])).values()]
  .map(ex => ({ ...ex, searchText: `${ex.name} ${ex.muscle} ${ex.equipment}`.toLocaleLowerCase("tr-TR") }));
const categories = ["Tümü", "Göğüs", "Sırt", "Bacak", "Omuz", "Kol", "Diğer"];
const state = { filter: "Tümü", query: "", selected: null, limit: 18, side: "front" };
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
function cardPoster(ex) {
  const demo = EXERCISE_DEMOS[ex.id];
  return demo?.posterUrl || (demo?.kind === "youtube" ? `https://img.youtube.com/vi/${encodeURIComponent(demo.videoId)}/mqdefault.jpg` : "");
}
function cards(list) {
  const shown = list.slice(0, state.limit);
  return `${shown.length ? `<div class="movement-grid">${shown.map(ex => {const poster=cardPoster(ex);return `<button class="movement-card" type="button" data-open="${escapeHtml(ex.id)}"><span class="movement-card-visual">${poster? `<img src="${escapeHtml(poster)}" alt="" loading="lazy" decoding="async" onerror="this.hidden=true">`:""}<i class="movement-card-level">${ex.sets<=2?"BAŞLANGIÇ":"ORTA"}</i><span class="movement-card-visual-icon">${symbol(ex)}</span><span class="movement-card-visual-play">▶</span></span><span class="movement-card-info"><span class="muscle-tag">${escapeHtml(category(ex))} · ${escapeHtml(ex.equipment)}</span><b>${escapeHtml(ex.name)}</b><span class="movement-card-foot"><span>${ex.sets} × ${escapeHtml(ex.reps)}</span><span>Tekniği gör →</span></span></span></button>`;}).join("")}</div>` : `<div class="empty-state"><b>Bu aramayla hareket bulunamadı.</b><br>Başka bir hareket adı veya kas grubu dene.</div>`}${list.length > shown.length ? `<button class="load-more" type="button" data-more>Daha fazla göster (${shown.length}/${list.length})</button>` : ""}`;
}
function animation(ex) {
  const demo = EXERCISE_DEMOS[ex.id];
  if (!demo) return `<div class="demo-unavailable">Bu hareket için video kaynağı bulunamadı.</div>`;
  const sourceLink = `<a href="${escapeHtml(demo.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(demo.publisher)} ↗</a>`;
  const licenseLink = demo.licenseUrl ? ` · <a href="${escapeHtml(demo.licenseUrl)}" target="_blank" rel="noopener noreferrer">Lisans</a>` : "";
  const credit = `<p class="demo-source">Gösterim: <b>${escapeHtml(demo.title)}</b> · ${sourceLink}${licenseLink}</p>`;
  if (demo.kind === "youtube") {
    const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(demo.videoId)}`;
    return `<div class="demo-media demo-youtube"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(demo.videoId)}?rel=0" title="${escapeHtml(ex.name)} hareket gösterimi" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><p class="demo-fallback">Video açılmazsa <a href="${watchUrl}" target="_blank" rel="noopener noreferrer">YouTube'da aç</a>.</p>${credit}`;
  }
  return `<div class="demo-media"><video controls playsinline preload="metadata" poster="${escapeHtml(demo.posterUrl || "../icon.svg")}" aria-label="${escapeHtml(ex.name)} hareket gösterimi" data-demo-video><source src="${escapeHtml(demo.videoUrl)}" type="video/mp4">Tarayıcın video oynatmayı desteklemiyor.</video><div class="demo-play-hint" data-video-status role="status">Videoyu izlemek için oynat düğmesine dokun</div></div><p class="demo-fallback" data-video-fallback hidden>Video bu cihazda açılamadı. <a href="${escapeHtml(demo.videoUrl)}" target="_blank" rel="noopener noreferrer">Videoyu yeni sekmede aç</a> · ${sourceLink}</p>${credit}`;
}
function renderDetail(ex) {
  return `<article class="detail"><button class="detail-back" type="button" data-back>← Tüm hareketler</button><header class="detail-hero"><span class="movement-icon detail-icon">${symbol(ex)}</span><div><span class="muscle-tag">${escapeHtml(ex.muscle)} · ${category(ex)}</span><h2>${escapeHtml(ex.name)}</h2><p>${escapeHtml(ex.equipment)}</p></div></header><section class="demo" aria-label="${escapeHtml(ex.name)} için hareket videosu"><div class="demo-head"><div><b>Hareketi izle</b><span>Doğru formu kısa videoda gör</span></div><span class="demo-badge">VİDEO REHBER</span></div>${animation(ex)}</section><div class="detail-columns"><section><h3>Nasıl yapılır?</h3><ol class="steps">${ex.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section><aside class="tip"><b>Teknik ipuçları</b><ul class="cues">${ex.cues.map(cue => `<li>${escapeHtml(cue)}</li>`).join("")}</ul><small>Program önerisi: ${ex.sets} set · ${escapeHtml(ex.reps)} tekrar · ${ex.rest} sn dinlenme</small><p class="load">Başlangıç yükü: ${escapeHtml(ex.load || "Hafif yükle başla")}</p></aside></div></article>`;
}
function render() {
  count.textContent = `${exercises.length} hareket`;
  if (state.selected) {
    const exercise = exercises.find(ex => ex.id === state.selected);
    content.innerHTML = exercise ? renderDetail(exercise) : `<div class="empty-state">Hareket bulunamadı. <button type="button" data-back>Geri dön</button></div>`;
    return;
  }
  content.innerHTML = `<div class="library-explorer"><aside class="muscle-panel"><div class="muscle-panel-heading"><div><span class="eyebrow">HAREKET HARİTASI</span><b>Kas grubunu keşfet</b></div><div class="body-side-toggle"><button type="button" data-body-side="front" class="${state.side!=="back"?"active":""}">Ön</button><button type="button" data-body-side="back" class="${state.side==="back"?"active":""}">Arka</button></div></div><div class="body-figure ${state.side==="back"?"back":"front"}" aria-hidden="true"><svg viewBox="0 0 160 290"><circle cx="80" cy="22" r="13"/><path class="figure-neck" d="M72 37l-4 12m20-12 4 12"/><path class="figure-torso" d="M66 49q-21 2-28 19l8 46 11 12 2 44h42l2-44 11-12 8-46q-7-17-28-19l-14 12z"/><path class="figure-arm" d="M38 67L22 102l-12 43m36-25-13 27-8 38m97-118 16 35 12 43m-37-23 13 27 8 38"/><path class="figure-leg" d="M57 164l-2 56-3 34m53-90 2 56 3 34m-58 0-2 30m60-30 2 30"/><path class="figure-muscle" d="${state.side==="back"?"M59 68q21 20 42 0m-40 31h38m-42 15q22 13 48 0m-43 37 8 15m29-15-8 15m-31 6h12m22 0h-12":"M59 68q21 15 42 0m-37 27q16 12 32 0m-39 15q23 15 46 0m-35 23q12 8 24 0m-21 41-5 18m35-18 5 18"}"/></svg></div><div class="filters" role="group" aria-label="Kas grubu filtresi">${categories.map(name => `<button class="filter" type="button" data-filter="${name}" aria-pressed="${state.filter === name}"><span>${name==="Tümü"?"✦":symbol({muscle:name})}</span>${name}</button>`).join("")}</div><div class="muscle-panel-foot"><span>${exercises.length}</span> egzersiz · <span>40</span> teknik video</div></aside><section class="library-results-column"><div class="library-controls"><label class="search"><span>⌕</span><input type="search" id="movement-search" placeholder="Hareket, kas grubu veya ekipman ara…" value="${escapeHtml(state.query)}" autocomplete="off"></label><span class="movement-result-count">${results().length} sonuç</span></div><div id="movement-results">${cards(results())}</div></section></div>`;
}
content.addEventListener("error", event => {
  const video = event.target.closest?.("[data-demo-video]");
  if (!video) return;
  const status = content.querySelector("[data-video-status]");
  const fallback = content.querySelector("[data-video-fallback]");
  if (status) status.textContent = "Video yüklenemedi";
  if (fallback) fallback.hidden = false;
}, true);
content.addEventListener("playing", event => {
  if (!event.target.matches?.("[data-demo-video]")) return;
  const status = content.querySelector("[data-video-status]");
  if (status) status.textContent = "Kısa teknik gösterim";
}, true);
content.addEventListener("input", event => { if (event.target.id !== "movement-search") return; state.query = event.target.value; state.limit = 18; $("#movement-results").innerHTML = cards(results()); $(".movement-result-count").textContent = `${results().length} sonuç`; });
content.addEventListener("click", event => {
  const filter = event.target.closest("[data-filter]");
  if (filter) { state.filter = filter.dataset.filter; state.limit = 18; render(); return; }
  const side = event.target.closest("[data-body-side]");
  if (side) { state.side = side.dataset.bodySide; render(); return; }
  const open = event.target.closest("[data-open]");
  if (open) { state.selected = open.dataset.open; render(); return; }
  if (event.target.closest("[data-back]")) { state.selected = null; render(); return; }
  if (event.target.closest("[data-more]")) { state.limit += 18; render(); }
});
render();
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const refreshKey = "form-fitness-sw-v13-refreshed";
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    try { if (sessionStorage.getItem(refreshKey)) return; sessionStorage.setItem(refreshKey, "1"); } catch { return; }
    location.reload();
  });
  navigator.serviceWorker.register("../sw.js", { updateViaCache: "none" }).then(registration => registration.update()).catch(() => {});
}
