# FORM Fitness

The movement library pairs each of its 40 exercises with an exercise-specific video demonstration. Videos load only after opening a movement; the media credits and licenses are shown below each player. Most clips come from the CC0 Workout Free Videos set or the MIT-licensed Free Exercise DB with Videos project. Six movements use direct, privacy-enhanced YouTube embeds from NASM, Bodybuilding.com, ATHLEAN-X, Jack Hanrahan Fitness, or Instructor JP.

The service worker activates new releases immediately and fetches app pages, scripts, and styles from the network first. This avoids leaving mobile devices on an old cached interface while preserving an offline fallback.

Kişisel antrenman, takvim, hareket kütüphanesi, XP/rozet, kilo-ölçüm ve beslenme takip uygulaması.

## Teknoloji
- HTML5
- CSS3 (responsive / mobile-first)
- JavaScript ES Modules
- LocalStorage ile cihaz içi kayıt
- Web App Manifest + Service Worker (PWA / çevrimdışı önbellek)

## Yerelde çalıştırma
`index.html` dosyasını doğrudan açmak yerine bir yerel web sunucusu kullanın:

```bash
python -m http.server 8000
```

Ardından `http://localhost:8000` adresini açın.

## GitHub Pages ile yayınlama
1. Bu klasörün içeriğini GitHub'da `form-fitness` adlı **Public** depoya yükleyin.
2. `index.html` dosyası depo kök dizininde olmalı.
3. Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
4. Yayın adresi `https://sharmann1.github.io/form-fitness/?utm_source=chatgpt.com` biçiminde olur.

## Özellikler
- Ana sayfa / günlük özet
- Haftalık ve aylık takvim; A/B antrenman rotasyonu
- Set, tekrar, kilo ve tamamlanma kutuları
- XP puanları set tamamlama oranından türetilir; çift puan yoktur
- Hareket kütüphanesi ve yazılı uygulama adımları
- Kilo geçmişi grafiği ve vücut ölçümleri
- 60'tan fazla yaygın yiyecekte arama; seçilen besin ve gramaja göre yaklaşık kalori/protein hesabı
- Öğün çeşitliliğine dayalı günlük beslenme özeti, su ve öğün kaydı
- Rozetler ve seviye
- JSON yedek dışa/içe aktarma
- Mobil alt menü ve PWA önbelleği

## Veri ve güvenlik notu
Profil bölümünden Supabase hesabı açıp giriş yaptığında antrenman günleri ve set işaretleri cihazlar arasında eşitlenir. Profil, kilo, ölçüm ve beslenme kayıtları bu cihazın LocalStorage alanında kalır. Tarayıcı verisi temizlenirse bu yerel kayıtlar kaybolabilir; Profil bölümünden düzenli JSON yedeği alın.

Besin değerleri yaklaşık değerlerdir. Karışık tarifler ve markalı ürünler için porsiyon ve ürün etiketini kontrol edin; beslenme özeti tıbbi değerlendirme değildir.

## Program güvenliği
Başlangıç ağırlıkları yalnızca yaklaşık deneme aralıklarıdır; makineye ve kişiye göre değişir. İlk antrenmanlarda eğitmenden teknik kontrolü alın. Ağrı, baş dönmesi veya olağandışı belirti olursa hareketi bırakın. Bu uygulama tıbbi değerlendirme yerine geçmez.
