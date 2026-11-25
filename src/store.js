import { PROGRAM, DEFAULT_PROFILE } from "./data.js";

const KEY = "form-fitness-v2";
const todayISO = () => new Date().toISOString().slice(0,10);
const mondayISO = (date = new Date()) => {
  const d = new Date(date); const day = (d.getDay()+6)%7; d.setDate(d.getDate()-day);
  return d.toISOString().slice(0,10);
};
const fresh = () => ({
  profile:{...DEFAULT_PROFILE,startDate:mondayISO()},
  logs:{}, weights:[{date:todayISO(),weight:63}], measurements:[],
  nutrition:{}, selectedDate:todayISO(), achievements:[], createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()
});
let state;
try { state = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch { state = fresh(); }
function save(source="local"){ state.updatedAt=new Date().toISOString(); try { localStorage.setItem(KEY,JSON.stringify(state)); } catch(e){ console.warn("Yerel kayıt kullanılamıyor",e); } window.dispatchEvent(new CustomEvent("formstate",{detail:{state,source}})); }
export function getState(){ return state; }
export function replaceState(next,source="remote"){
  if(!next||typeof next!=="object"||!next.profile||!next.logs)throw new Error("Geçersiz antrenman verisi");
  state=next;save(source);
}
export function updateProfile(p){ state.profile={...state.profile,...p}; save(); }
export function setSelectedDate(date){ state.selectedDate=date; save(); }
export function programWeek(dateStr){
  const d=new Date(dateStr+"T12:00:00");
  const start=new Date((state.profile.startDate||mondayISO())+"T12:00:00");
  return Math.max(1,Math.floor((d-start)/(7*86400000))+1);
}
export function setsForExercise(ex,dateStr){
  const w=programWeek(dateStr);
  if(w<=2) return 2;
  if(w===5) return 1;
  if(w<=4) return 3;
  return ex.kind==="compound"?3:2;
}
export function workoutType(dateStr){
  const d=new Date(dateStr+"T12:00:00"), dow=String((d.getDay()+6)%7);
  if(!state.profile.days.includes(dow)) return null;
  const start=new Date((state.profile.startDate||mondayISO())+"T12:00:00");
  const week=Math.max(0,Math.floor((d-start)/(7*86400000)));
  const index=state.profile.days.indexOf(dow);
  const cycle=week%2===0?["A","B","A"]:["B","A","B"];
  return cycle[index]||"A";
}
export function ensureLog(dateStr){
  if(!state.logs[dateStr]){
    const type=workoutType(dateStr);
    if(!type) return null;
    state.logs[dateStr]={type,exercises:{},completedAt:null};
    PROGRAM[type].forEach(ex=>state.logs[dateStr].exercises[ex.id]={
      sets:Array.from({length:setsForExercise(ex,dateStr)},()=>({done:false,weight:"",reps:""}))
    });
    save();
  }
  const log=state.logs[dateStr];
  if(!log)return null;
  // Bring remotely merged or older logs up to the current exercise/set shape.
  log.exercises ||= {};
  (PROGRAM[log.type]||[]).forEach(ex=>{
    const exercise=log.exercises[ex.id] ||= {sets:[]};
    exercise.sets ||= [];
    const expected=setsForExercise(ex,dateStr);
    while(exercise.sets.length<expected)exercise.sets.push({done:false,weight:"",reps:""});
  });
  return log;
}
export function updateSet(dateStr,exerciseId,setIndex,patch){
  const log=ensureLog(dateStr); if(!log) return;
  const s=log.exercises[exerciseId].sets[setIndex];
  Object.assign(s,patch,{updatedAt:new Date().toISOString()});log.updatedAt=new Date().toISOString();
  const all=PROGRAM[log.type].every(ex=>log.exercises[ex.id].sets.every(x=>x.done));
  log.completedAt=all?new Date().toISOString():null;
  save();
}
export function getXP(dateStr){
  const log=state.logs[dateStr]; if(!log) return 0;
  const plan=PROGRAM[log.type]; let xp=0, all=true;
  for(const ex of plan){
    const sets=log.exercises[ex.id]?.sets||[];
    const done=sets.filter(s=>s.done).length;
    xp+=Math.round(ex.xp*(done/Math.max(1,ex.sets)));
    if(done<ex.sets) all=false;
  }
  if(all) xp+=20;
  return xp;
}
export function totalXP(){
  return Object.keys(state.logs).reduce((sum,d)=>sum+getXP(d),0);
}
export function addWeight(weight,date=todayISO()){
  const value=Number(weight); if(!Number.isFinite(value)||value<25||value>300) return false;
  state.weights=state.weights.filter(x=>x.date!==date);
  state.weights.push({date,weight:value}); state.weights.sort((a,b)=>a.date.localeCompare(b.date));
  state.profile.currentWeight=value; save(); return true;
}
export function addMeasurement(data){
  state.measurements.push({...data,date:todayISO()}); save();
}
export function updateNutrition(date,data){
  state.nutrition[date]={...(state.nutrition[date]||{}),...data}; save();
}
export function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="form-fitness-yedek.json"; a.click(); URL.revokeObjectURL(a.href);
}
export function importData(file){
  return file.text().then(t=>{const parsed=JSON.parse(t); if(!parsed.profile||!parsed.logs) throw new Error("Geçersiz yedek dosyası"); state=parsed; save();});
}
export function resetData(){ state=fresh(); save(); }
export function today(){ return todayISO(); }
export function monday(date=new Date()){return mondayISO(date);}
export function daysInMonth(y,m){return new Date(y,m+1,0).getDate();}
export function formatDate(date,opts={day:"numeric",month:"long"}){return new Intl.DateTimeFormat("tr-TR",opts).format(new Date(date+"T12:00:00"));}
export function weekSessions(){
  const start=mondayISO(); let count=0;
  for(let i=0;i<7;i++){const d=new Date(start+"T12:00:00");d.setDate(d.getDate()+i);const k=d.toISOString().slice(0,10);if(state.logs[k]&&getXP(k)>0)count++;}
  return count;
}
export function streak(){
  let count=0, d=new Date();
  for(let i=0;i<90;i++){const key=d.toISOString().slice(0,10);if(state.logs[key]&&getXP(key)>0)count++;else if(i>0)break;d.setDate(d.getDate()-1);}
  return count;
}
