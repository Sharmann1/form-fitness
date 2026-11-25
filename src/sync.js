import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";
import * as DB from "./store.js";

const configured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
let client = null, currentUser = null, channel = null, pushTimer = 0;
let status = { state: "unconfigured", email: "", message: "Supabase proje ayarları bekleniyor. Mevcut kayıtların bu cihazda korunuyor." };
const emit = (state, message, email = currentUser?.email || "") => {
  status = { state, message, email };
  window.dispatchEvent(new CustomEvent("cloudsync", { detail: status }));
};
async function getClient() {
  if (!configured) throw new Error("Önce Supabase proje URL’si ve public key eklenmeli.");
  if (!client) {
    emit("connecting", "Supabase bağlantısı hazırlanıyor…");
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  return client;
}
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
// Only workout dates, exercise IDs, and checked-set states leave this device.
function exportProgress(logs = {}) {
  const workouts = {};
  for (const [date, log] of Object.entries(logs)) {
    if (!log || typeof log !== "object") continue;
    const exercises = {};
    for (const [id, exercise] of Object.entries(log.exercises || {})) {
      if (!Array.isArray(exercise?.sets)) continue;
      exercises[id] = { sets: exercise.sets.map(set => ({ done: Boolean(set?.done), ...(set?.updatedAt ? { updatedAt: set.updatedAt } : {}) })) };
    }
    workouts[date] = { type: log.type, exercises };
  }
  return { version: 1, workouts };
}
function readProgress(value) {
  // Accept a legacy snapshot if one exists, but only extract workout completion marks.
  return value?.workouts ? value : exportProgress(value?.logs || {});
}
function mergeProgress(localLogs, remoteValue) {
  const remote = readProgress(remoteValue).workouts || {};
  const logs = clone(localLogs || {});
  for (const [date, remoteLog] of Object.entries(remote)) {
    if (!remoteLog || typeof remoteLog !== "object") continue;
    const log = logs[date] || { type: remoteLog.type, exercises: {}, completedAt: null };
    log.type ||= remoteLog.type;
    log.exercises ||= {};
    for (const [id, remoteExercise] of Object.entries(remoteLog.exercises || {})) {
      const remoteSets = Array.isArray(remoteExercise?.sets) ? remoteExercise.sets : [];
      const localExercise = log.exercises[id] || { sets: [] };
      const localSets = Array.isArray(localExercise.sets) ? localExercise.sets : [];
      const count = Math.max(localSets.length, remoteSets.length);
      localExercise.sets = Array.from({ length: count }, (_, i) => {
        const local = localSets[i] || { done: false, weight: "", reps: "" };
        const remoteSet = remoteSets[i];
        if (!remoteSet) return local;
        const localTime = Date.parse(local.updatedAt || "") || 0;
        const remoteTime = Date.parse(remoteSet.updatedAt || "") || 0;
        return remoteTime > localTime ? { ...local, done: Boolean(remoteSet.done), updatedAt: remoteSet.updatedAt } : local;
      });
      log.exercises[id] = localExercise;
    }
    logs[date] = log;
  }
  return logs;
}
async function readCloud(userId) {
  const { data, error } = await client.from("fitness_states").select("state,updated_at").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data?.state || null;
}
async function pushState() {
  if (!client || !currentUser) return;
  const progress = exportProgress(DB.getState().logs);
  const { error } = await client.from("fitness_states").upsert({ user_id: currentUser.id, state: progress, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
  emit("synced", "Antrenman günleri ve set işaretleri eşitlendi.");
}
function schedulePush() {
  if (!currentUser) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => pushState().catch(error => emit("error", `Bulut eşitlemesi başarısız: ${error.message}`)), 450);
}
function detachRealtime() { if (channel && client) client.removeChannel(channel); channel = null; }
async function attachUser(user) {
  if (!client || currentUser?.id !== user.id) return;
  try {
    emit("syncing", "Antrenman günleri ve set işaretleri birleştiriliyor…", user.email);
    const local = clone(DB.getState()), remote = await readCloud(user.id);
    if (!remote) await pushState();
    else {
      const mergedLogs = mergeProgress(local.logs, remote);
      const mergedState = { ...local, logs: mergedLogs };
      DB.replaceState(mergedState, "remote");
      const mergedProgress = exportProgress(mergedLogs);
      if (stable(mergedProgress) !== stable(readProgress(remote))) await pushState();
      else emit("synced", "Antrenman günleri ve set işaretleri diğer cihazlarınla eşit.", user.email);
    }
    detachRealtime();
    channel = client.channel(`fitness-state-${user.id}`).on("postgres_changes", { event: "*", schema: "public", table: "fitness_states", filter: `user_id=eq.${user.id}` }, async payload => {
      if (!payload.new?.state) return;
      const current = DB.getState();
      const mergedLogs = mergeProgress(current.logs, payload.new.state);
      const mergedProgress = exportProgress(mergedLogs);
      if (stable(mergedProgress) !== stable(exportProgress(current.logs))) DB.replaceState({ ...current, logs: mergedLogs }, "remote");
      if (stable(mergedProgress) !== stable(readProgress(payload.new.state))) await pushState();
      else emit("synced", "Antrenman günleri ve set işaretleri diğer cihazlarınla eşit.", user.email);
    }).subscribe((value, error) => { if (value === "CHANNEL_ERROR") emit("error", `Canlı eşitleme bağlantısı kurulamadı: ${error?.message || "Realtime durumunu kontrol et."}`, user.email); });
  } catch (error) { emit("error", `Bulut eşitlemesi başarısız: ${error.message}`, user.email); }
}
export async function initializeCloudSync() {
  if (!configured) { emit("unconfigured", "Bulut veritabanı için Supabase proje ayarları gerekiyor. Mevcut kayıtların bu cihazda korunuyor."); return; }
  try {
    const supabase = await getClient(), { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data.session?.user) { currentUser = data.session.user; await attachUser(currentUser); }
    else emit("signed-out", "Hesapla giriş yap; set işaretlerin cihazların arasında eşitlensin.");
  } catch (error) { emit("error", `Supabase başlatılamadı: ${error.message}`); }
}
export async function createCloudAccount(email, password) {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (data.session?.user) { currentUser = data.session.user; await attachUser(currentUser); }
  else emit("signed-out", "Hesap oluşturuldu. E-posta onayını tamamladıktan sonra giriş yap.", email);
}
export async function signInCloud(email, password) {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = data.user; await attachUser(data.user);
}
export async function signOutCloud() { if (!client) return; const { error } = await client.auth.signOut(); if (error) throw error; currentUser = null; detachRealtime(); emit("signed-out", "Hesaptan çıkıldı. Kayıtlar bu cihazda korunuyor."); }
export async function syncCloudNow() { if (!currentUser) throw new Error("Önce hesabına giriş yap."); await attachUser(currentUser); }
export function cloudSyncConfigured() { return configured; }
export function cloudSyncStatus() { return status; }
window.addEventListener("formstate", event => { if (event.detail?.source !== "remote") schedulePush(); });
