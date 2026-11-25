# FORM Fitness

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
4. Yayın adresi `https://KULLANICI.github.io/form-fitness/` biçiminde olur.

## Özellikler
- Ana sayfa / günlük özet
- Haftalık ve aylık takvim; A/B antrenman rotasyonu
- Set, tekrar, kilo ve tamamlanma kutuları
- XP puanları set tamamlama oranından türetilir; çift puan yoktur
- Hareket kütüphanesi ve yazılı uygulama adımları
- Kilo geçmişi grafiği ve vücut ölçümleri
- Kalori, protein, su ve öğün kaydı
- Rozetler ve seviye
- JSON yedek dışa/içe aktarma
- Mobil alt menü ve PWA önbelleği

## Veri ve güvenlik notu
Bu sürüm kullanıcı hesabı veya bulut veritabanı içermez. Kayıtlar aynı tarayıcının LocalStorage alanında kalır. Tarayıcı verisi temizlenirse kaybolabilir; Profil bölümünden düzenli JSON yedeği alın. Cihazlar arasında eşitleme ve güvenli çok kullanıcılı hesap için ayrıca backend (ör. Supabase/Firebase) kurulmalıdır.

## Program güvenliği
Başlangıç ağırlıkları yalnızca yaklaşık deneme aralıklarıdır; makineye ve kişiye göre değişir. İlk antrenmanlarda eğitmenden teknik kontrolü alın. Ağrı, baş dönmesi veya olağandışı belirti olursa hareketi bırakın. Bu uygulama tıbbi değerlendirme yerine geçmez.
