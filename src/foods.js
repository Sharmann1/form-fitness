// Common food entries use estimated calories/protein per 100 g.
// Packaged products and mixed recipes vary; the UI lets the user adjust values.
export const FOOD_CATALOG = [
  {id:"chicken-breast",name:"Tavuk göğsü (ızgara)",kcal:165,protein:31,tags:["protein","whole"],icon:"🍗"},
  {id:"chicken-thigh",name:"Tavuk but (pişmiş)",kcal:209,protein:26,tags:["protein"],icon:"🍗"},
  {id:"turkey",name:"Hindi göğsü (pişmiş)",kcal:135,protein:29,tags:["protein","whole"],icon:"🍗"},
  {id:"beef",name:"Yağsız dana eti (pişmiş)",kcal:217,protein:26,tags:["protein","whole"],icon:"🥩"},
  {id:"meatballs",name:"Izgara köfte (tahmini)",kcal:250,protein:17,tags:["protein"],icon:"🥩"},
  {id:"salmon",name:"Somon (pişmiş)",kcal:208,protein:20,tags:["protein","whole"],icon:"🐟"},
  {id:"tuna",name:"Ton balığı (suda, süzülmüş)",kcal:116,protein:26,tags:["protein","whole"],icon:"🐟"},
  {id:"egg",name:"Yumurta (haşlanmış)",kcal:155,protein:13,tags:["protein","whole"],icon:"🥚"},
  {id:"egg-white",name:"Yumurta beyazı",kcal:52,protein:11,tags:["protein","whole"],icon:"🥚"},
  {id:"whey",name:"Whey protein (toz, ortalama)",kcal:400,protein:80,tags:["protein","packaged"],icon:"🥤"},
  {id:"yogurt",name:"Yoğurt (sade)",kcal:61,protein:3.5,tags:["protein","whole"],icon:"🥣"},
  {id:"greek-yogurt",name:"Süzme yoğurt",kcal:97,protein:9,tags:["protein","whole"],icon:"🥣"},
  {id:"kefir",name:"Kefir (sade)",kcal:55,protein:3.3,tags:["protein","whole"],icon:"🥛"},
  {id:"cottage",name:"Lor peyniri",kcal:98,protein:11,tags:["protein","whole"],icon:"🧀"},
  {id:"white-cheese",name:"Beyaz peynir",kcal:264,protein:14,tags:["protein"],icon:"🧀"},
  {id:"milk",name:"Süt (yarım yağlı)",kcal:50,protein:3.4,tags:["protein","whole"],icon:"🥛"},
  {id:"rice",name:"Pirinç pilavı (pişmiş, sade)",kcal:130,protein:2.7,tags:["carb","whole"],icon:"🍚"},
  {id:"bulgur",name:"Bulgur pilavı (pişmiş)",kcal:120,protein:3.1,tags:["carb","whole"],icon:"🌾"},
  {id:"pasta",name:"Makarna (pişmiş)",kcal:157,protein:5.8,tags:["carb"],icon:"🍝"},
  {id:"oats",name:"Yulaf ezmesi (kuru)",kcal:389,protein:16.9,tags:["carb","whole"],icon:"🌾"},
  {id:"potato",name:"Patates (haşlanmış)",kcal:87,protein:1.9,tags:["carb","whole"],icon:"🥔"},
  {id:"sweet-potato",name:"Tatlı patates (pişmiş)",kcal:90,protein:2,tags:["carb","whole"],icon:"🍠"},
  {id:"bread",name:"Tam buğday ekmeği",kcal:247,protein:13,tags:["carb","whole"],icon:"🍞"},
  {id:"lavash",name:"Lavaş ekmeği",kcal:275,protein:8,tags:["carb"],icon:"🫓"},
  {id:"lentils",name:"Yeşil mercimek (haşlanmış)",kcal:116,protein:9,tags:["protein","carb","whole"],icon:"🫘"},
  {id:"chickpeas",name:"Nohut (haşlanmış)",kcal:164,protein:8.9,tags:["protein","carb","whole"],icon:"🫘"},
  {id:"beans",name:"Kuru fasulye (pişmiş)",kcal:127,protein:8.7,tags:["protein","carb","whole"],icon:"🫘"},
  {id:"lentil-soup",name:"Mercimek çorbası (tahmini)",kcal:65,protein:3.5,tags:["protein","veg"],icon:"🥣"},
  {id:"chicken-soup",name:"Tavuk çorbası (tahmini)",kcal:55,protein:4,tags:["protein","veg"],icon:"🥣"},
  {id:"chicken-rice",name:"Tavuklu pilav (tahmini)",kcal:170,protein:10,tags:["protein","carb"],icon:"🍛"},
  {id:"doner",name:"Tavuk döner (tahmini)",kcal:220,protein:20,tags:["protein"],icon:"🌯"},
  {id:"beef-doner",name:"Et döner (tahmini)",kcal:250,protein:20,tags:["protein"],icon:"🌯"},
  {id:"menemen",name:"Menemen (tahmini)",kcal:120,protein:6,tags:["protein","veg"],icon:"🍳"},
  {id:"lahmacun",name:"Lahmacun (tahmini)",kcal:250,protein:10,tags:["carb"],icon:"🫓"},
  {id:"borek",name:"Peynirli börek (tahmini)",kcal:310,protein:8,tags:["treat"],icon:"🥐"},
  {id:"pide",name:"Kıymalı pide (tahmini)",kcal:270,protein:12,tags:["protein","treat"],icon:"🥙"},
  {id:"burger",name:"Hamburger (ortalama)",kcal:295,protein:17,tags:["protein","treat"],icon:"🍔"},
  {id:"pizza",name:"Pizza (ortalama)",kcal:266,protein:11,tags:["protein","treat"],icon:"🍕"},
  {id:"fries",name:"Patates kızartması",kcal:312,protein:3.4,tags:["treat"],icon:"🍟"},
  {id:"baklava",name:"Baklava (tahmini)",kcal:430,protein:6,tags:["treat"],icon:"🍰"},
  {id:"chocolate",name:"Sütlü çikolata",kcal:535,protein:7,tags:["treat","packaged"],icon:"🍫"},
  {id:"chips",name:"Patates cipsi",kcal:536,protein:6,tags:["treat","packaged"],icon:"🥔"},
  {id:"banana",name:"Muz",kcal:89,protein:1.1,tags:["fruit","whole"],icon:"🍌"},
  {id:"apple",name:"Elma",kcal:52,protein:0.3,tags:["fruit","whole"],icon:"🍎"},
  {id:"orange",name:"Portakal",kcal:47,protein:0.9,tags:["fruit","whole"],icon:"🍊"},
  {id:"strawberry",name:"Çilek",kcal:32,protein:0.7,tags:["fruit","whole"],icon:"🍓"},
  {id:"avocado",name:"Avokado",kcal:160,protein:2,tags:["veg","whole"],icon:"🥑"},
  {id:"tomato",name:"Domates",kcal:18,protein:0.9,tags:["veg","whole"],icon:"🍅"},
  {id:"cucumber",name:"Salatalık",kcal:15,protein:0.7,tags:["veg","whole"],icon:"🥒"},
  {id:"salad",name:"Mevsim salatası (yağsız)",kcal:25,protein:1.3,tags:["veg","whole"],icon:"🥗"},
  {id:"broccoli",name:"Brokoli (haşlanmış)",kcal:35,protein:2.4,tags:["veg","whole"],icon:"🥦"},
  {id:"spinach",name:"Ispanak (pişmiş)",kcal:23,protein:2.9,tags:["veg","whole"],icon:"🥬"},
  {id:"almonds",name:"Badem",kcal:579,protein:21,tags:["whole"],icon:"🥜"},
  {id:"peanut-butter",name:"Fıstık ezmesi",kcal:588,protein:25,tags:["whole"],icon:"🥜"},
  {id:"olive-oil",name:"Zeytinyağı",kcal:884,protein:0,tags:["fat"],icon:"🫒"},
  {id:"rice-pilaf",name:"Pirinç pilavı (yağlı, tahmini)",kcal:160,protein:3,tags:["grain"],icon:"🍚"},
  {id:"bulgur-pilaf",name:"Bulgur pilavı (tahmini)",kcal:120,protein:4,tags:["grain","whole"],icon:"🍲"},
  {id:"ezogelin",name:"Ezogelin çorbası (tahmini)",kcal:60,protein:3,tags:["veg","whole"],icon:"🥣"},
  {id:"cheese-toast",name:"Kaşarlı tost (tahmini)",kcal:290,protein:14,tags:["grain","protein"],icon:"🥪"},
  {id:"kebab",name:"Adana kebap (tahmini)",kcal:270,protein:18,tags:["protein"],icon:"🍢"},
  {id:"pasta-tomato",name:"Domates soslu makarna (tahmini)",kcal:155,protein:5,tags:["grain"],icon:"🍝"},
  {id:"tuna-sandwich",name:"Ton balıklı sandviç (tahmini)",kcal:210,protein:15,tags:["protein","grain"],icon:"🥪"}
];

export const FOOD_DATA_SOURCE = "USDA FoodData Central; karışık yemekler yaklaşık değerdir.";

const normalize = value => String(value || "").trim().toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("ı", "i");

export function searchFoods(query, limit = 7) {
  const normalized = normalize(query);
  if (normalized.length < 2) return [];
  return FOOD_CATALOG
    .map(food => { const name = normalize(food.name); return { food, score: name.startsWith(normalized) ? 0 : name.includes(normalized) ? 1 : 2 }; })
    .filter(item => item.score < 2)
    .sort((a, b) => a.score - b.score || a.food.name.localeCompare(b.food.name, "tr"))
    .slice(0, limit)
    .map(item => item.food);
}
