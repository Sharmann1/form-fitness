export const PROGRAM = {
  A: [
    {id:"chest-press",name:"Chest Press",muscle:"Göğüs",kind:"compound",sets:2,reps:"8–12",rest:120,load:"10–15 kg",xp:15,equipment:"Göğüs press makinesi",steps:["Koltuk yüksekliğini, tutacaklar göğüs orta hizasında olacak şekilde ayarla.","Sırtını ve başını mindere yasla; ayakların yerde olsun.","Nefes verirken tutacakları kontrollü biçimde ileri it.","Dirsekleri kilitlemeden dur; nefes alarak yavaşça başlangıca dön."],cues:["Omuzlarını kulaklarına çekme.","Belini aşırı çukurlaştırma.","Ağrı varsa hareketi bırak."]},
    {id:"lat-pulldown",name:"Lat Pulldown",muscle:"Sırt",kind:"compound",sets:2,reps:"8–12",rest:90,load:"15–20 kg",xp:15,equipment:"Lat pulldown makinesi",steps:["Diz pedini uyluklarına göre ayarla.","Barı omuz genişliğinden biraz geniş kavra.","Göğsünü hafifçe kaldır; gövdeni geriye çok yatırma.","Barı üst göğse doğru çek, sonra kontrollü biçimde yukarı bırak."],cues:["Barı ensene çekme.","Hareketi momentumla yapma.","Omuzlarını aşağıda tut."]},
    {id:"leg-press",name:"Leg Press",muscle:"Ön bacak / kalça",kind:"compound",sets:2,reps:"10–12",rest:120,load:"Makineye göre hafif",xp:15,equipment:"Leg press",steps:["Sırtını ve kalçanı mindere tamamen yasla.","Ayaklarını platformda yaklaşık omuz genişliğinde konumlandır.","Dizlerini kontrollü bük; belin minderden ayrılmadan inebildiğin noktada dur.","Platformu iterek başlangıca dön; dizlerini kilitleme."],cues:["Dizlerin ayak yönünü takip etsin.","Belin yuvarlanıyorsa daha az derine in.","İlk gün boş veya çok hafif makineyle tekniği öğren."]},
    {id:"shoulder-press",name:"Shoulder Press",muscle:"Omuz",kind:"accessory",sets:2,reps:"8–12",rest:90,load:"5–10 kg toplam / hafif dambıl",xp:10,equipment:"Dambıl veya omuz press makinesi",steps:["Sırt destekli otur; karın kaslarını hafifçe sık.","Dambılları omuz hizasında, bilekler düz tut.","Ağırlıkları başının üzerine kontrollü kaldır.","Dirsekleri kilitlemeden yavaşça indir."],cues:["Belini aşırı çukurlaştırma.","Ağrısız hareket aralığında kal.","Hafif ağırlıkla başla."]},
    {id:"cable-row",name:"Seated Cable Row",muscle:"Sırt",kind:"accessory",sets:2,reps:"10–12",rest:90,load:"15–20 kg",xp:10,equipment:"Kablo row makinesi",steps:["Ayaklarını platforma yerleştir ve dizlerini hafif bük.","Gövdeni dik, omuzlarını rahat tut.","Tutacağı göbek hizana doğru çek; kürek kemiklerini yaklaştır.","Kollarını kontrollü uzat, gövdeni savurma."],cues:["Belden ileri geri sallanma.","Omuzlarını yukarı çekme."]},
    {id:"biceps-curl",name:"Dumbbell Biceps Curl",muscle:"Biceps",kind:"accessory",sets:2,reps:"10–12",rest:60,load:"3–4 kg / el",xp:10,equipment:"Dambıl",steps:["Ayakta dik dur, avuç içlerini öne çevir.","Dirseklerini gövdene yakın ve sabit tut.","Dambılları omuzlarına doğru kaldır.","Yavaşça indir; dirsekleri öne kaçırma."],cues:["Belden sallanma.","Bilekleri bükme.","Hafif dambılla tekniği oturt."]},
    {id:"triceps-pushdown",name:"Triceps Rope Pushdown",muscle:"Triceps",kind:"accessory",sets:2,reps:"10–12",rest:60,load:"5–10 kg",xp:10,equipment:"Kablo ve ip aparat",steps:["İpi üst makaraya tak ve dirseklerini gövdene yakın tut.","Üst kollarını sabit bırak.","İpi aşağı doğru it; altta uçları hafifçe ayır.","Kontrollü şekilde başlangıca dön."],cues:["Dirsekleri öne arkaya oynatma.","Gövdenle ağırlığı itme."]}
  ],
  B: [
    {id:"incline-press",name:"Incline Dumbbell Press",muscle:"Üst göğüs",kind:"compound",sets:2,reps:"8–12",rest:120,load:"Hafif dambıl",xp:15,equipment:"Eğimli sehpa ve dambıl",steps:["Sehpayı 20–30 dereceye ayarla.","Dambılları göğsün üst hizasında tut; ayakların yerde olsun.","Dambılları yukarı it; bileklerini düz tut.","Kontrollü biçimde göğsün yanlarına indir."],cues:["Aşırı dik açı kullanma.","Omuzda ağrı olursa dur.","İlk hafta hafif yük seç."]},
    {id:"chest-supported-row",name:"Chest Supported Row",muscle:"Sırt",kind:"compound",sets:2,reps:"10–12",rest:90,load:"Hafif ağırlık",xp:15,equipment:"Göğüs destekli row makinesi",steps:["Göğsünü mindere yasla ve ayaklarını sabitle.","Kolların öne uzanmışken tutacakları kavra.","Dirseklerini geriye çekerek tutacakları gövdene yaklaştır.","Ağırlığı kontrollü bırak."],cues:["Göğsünü minderden kaldırma.","Omuzları kulaklara çekme."]},
    {id:"leg-curl",name:"Seated Leg Curl",muscle:"Arka bacak",kind:"compound",sets:2,reps:"10–12",rest:90,load:"Hafif ağırlık",xp:15,equipment:"Leg curl makinesi",steps:["Diz eklemini makinenin dönme ekseniyle hizala.","Pedin alt kısmını ayak bileğinin biraz üzerine yerleştir.","Topuklarını aşağı ve geriye doğru çek.","Yavaşça başlangıç pozisyonuna dön."],cues:["Kalçanı koltuktan kaldırma.","Hareketi savurarak yapma."]},
    {id:"lateral-raise",name:"Dumbbell Lateral Raise",muscle:"Yan omuz",kind:"accessory",sets:2,reps:"12–15",rest:60,load:"2–4 kg / el",xp:10,equipment:"Dambıl",steps:["Hafif dambılları yanlarında tut; dirseklerini az bük.","Kollarını yana doğru omuz hizasına yaklaşana kadar kaldır.","Üstte kısa süre kontrol et.","Yavaşça indir."],cues:["Ağırlığı savurma.","Omuz hizasının çok üstüne çıkma.","Gerekirse daha hafif dambıl seç."]},
    {id:"face-pull",name:"Face Pull",muscle:"Arka omuz / üst sırt",kind:"accessory",sets:2,reps:"12–15",rest:60,load:"Hafif kablo",xp:10,equipment:"Kablo ve ip aparat",steps:["İpi yüz hizasına ayarla ve iki ucundan kavra.","Dirseklerini dışarı açarak ipi yüzüne doğru çek.","Kürek kemiklerini kontrollü yaklaştır.","Yavaşça başlangıca dön."],cues:["Belini geriye atma.","Omuzlarını yukarı çekme."]},
    {id:"hammer-curl",name:"Hammer Curl",muscle:"Biceps / ön kol",kind:"accessory",sets:2,reps:"10–12",rest:60,load:"3–4 kg / el",xp:10,equipment:"Dambıl",steps:["Dambılları avuç içleri birbirine bakacak şekilde tut.","Dirseklerini gövdene yakın sabitle.","Dambılları omuzlarına doğru kaldır.","Kontrollü indir."],cues:["Bilekleri düz tut.","Gövdeni sallama."]},
    {id:"calf-raise",name:"Calf Raise",muscle:"Baldır",kind:"accessory",sets:2,reps:"12–15",rest:60,load:"Vücut ağırlığı / hafif",xp:10,equipment:"Calf makinesi veya basamak",steps:["Ayak uçlarını platforma yerleştir; topukların serbest kalsın.","Topuklarını yükselterek baldırlarını sık.","Üstte kısa süre bekle.","Topuklarını kontrollü şekilde indir."],cues:["Zıplama yapma.","Hareket aralığını kontrollü kullan."]}
  ]
};

export const NAV = [
  {id:"home",label:"Genel Bakış",icon:"⌂"},
  {id:"calendar",label:"Takvim",icon:"▦"},
  {id:"workout",label:"Antrenman",icon:"◈"},
  {id:"library",label:"Hareket Kütüphanesi",icon:"▤"},
  {id:"weight",label:"Kilo & Ölçümler",icon:"↗"},
  {id:"nutrition",label:"Beslenme",icon:"◉"},
  {id:"achievements",label:"Başarılar",icon:"★"},
  {id:"profile",label:"Profil & Ayarlar",icon:"⚙"}
];

export const DEFAULT_PROFILE = {
  name:"Sporcu", startWeight:63, currentWeight:63, targetWeight:68, height:182,
  level:"Başlangıç", days:["0","2","4"], startDate:null, calories:2600, protein:120
};