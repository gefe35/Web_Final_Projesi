---
title: "Ürün Kullanıcı Dökümanı — Kişisel Blog Web Sitesi"
author: "Göktuğ Efe Madran"
---

# Ürün Kullanıcı Dökümanı

**Ürün Adı:** Kişisel Blog / Portföy Web Sitesi
**Dersi Veren:** Süleyman KESİK
**Dersi Alan:** Göktuğ Efe Madran
**Dönem:** 2025–2026 Bahar Dönemi
**Bölüm:** Bilgisayar Teknolojileri Bölümü / Bilişim Güvenliği Teknolojisi Programı
**Döküman Türü:** Kullanıcı Kılavuzu
**Versiyon:** 1.0

---

## 1. Giriş

### 1.1 Amaç ve Kapsam

Bu kılavuz, **Kişisel Blog Web Sitesi** ürününün kullanım yordamlarını tariflemek amacıyla hazırlanmıştır. Belge, hem siteyi ziyaret edip içerik okuyan kullanıcılar hem de içerikleri yöneten site sahibi için adım adım yönergeler sunar.

Hizmet ettiği kullanıcı grubu:

- **Normal Kullanıcı (Ziyaretçi):** Giriş yapmadan içerikleri okuyabilen herkes.
- **Yetkili Kullanıcı (Site Sahibi / Admin):** Giriş yaparak içerikleri yöneten kullanıcı.

Kapsam, web sitesinin tüm ekranlarının (Ana Sayfa, Hakkımda, 5 içerik bölümü, İçerik Detay, Giriş ve Yönetim Paneli) kullanımını içerir.

### 1.2 Rol ve Sorumluluklar

| Rol | Sorumluluklar |
|---|---|
| Normal Kullanıcı | • Hakkımda bilgilerini görüntülemek • Bölümlere göz atmak • Kategoriye göre filtrelemek • İçerik detaylarını okumak |
| Yetkili Kullanıcı | • Sisteme giriş yapmak • Hakkımda bilgilerini ve fotoğrafı güncellemek • Kategori eklemek/güncellemek/silmek • İçerik eklemek/güncellemek/silmek • İçerik durumunu (taslak/yayında) belirlemek |

### 1.3 Referanslar

| No | Döküman Adı | Notlar |
|---|---|---|
| 1 | Blog Web Sitesi Değerlendirme Kriterleri | Proje gereksinim dökümanı |
| 2 | Ürün Analiz Dökümanı | Bu projenin geliştirici/analiz dökümanı |
| 3 | aliabdaal.com | Örnek alınan referans web sitesi |

### 1.4 Tanımlar ve Kısaltmalar

| Tanım / Kısaltma | Açıklama |
|---|---|
| Bölüm | İçeriklerin gruplandığı üst başlık (örn. Teknik Bilgi) |
| Kategori | Bir bölüm altındaki alt başlık (örn. Web Güvenliği) |
| İçerik | Bir kategoriye ait yazı/paylaşım |
| Yönetim Paneli | Yetkili kullanıcının içerik yönettiği ekran |
| Taslak | Henüz yayımlanmamış, ziyaretçiye görünmeyen içerik |
| Yayında | Ziyaretçilerin görebildiği yayımlanmış içerik |
| Slug | İçeriğin adresinde (URL) geçen kısa benzersiz metin |

---

## 2. Menü Yapısı

Site üst kısmında, her ekrandan erişilebilen sabit bir gezinme menüsü (navbar) bulunur:

```
Göktuğ Efe (logo)  |  Ana Sayfa · Hakkımda · Teknik · Teknik Olmayan ·
                       Araştırmalar · Hobiler · Kitaplar  |  Giriş
```

- **Ana Sayfa:** Karşılama (hero) alanı, başlık kartları ve son eklenen yazılar.
- **Hakkımda:** Site sahibinin profil bilgileri.
- **Teknik / Teknik Olmayan / Araştırmalar / Hobiler / Kitaplar:** İçerik bölümleri.
- **Giriş:** Yetkili kullanıcı girişi. Giriş yapıldığında menüde **"Yönetim"** ve **"Çıkış"** bağlantıları belirir.

Mobil cihazlarda menü, sağ üstteki ☰ (hamburger) düğmesiyle açılır/kapanır.

### 2.1 Yetkilendirme

| Menü / Ekran | Normal Kullanıcı | Yetkili Kullanıcı |
|---|---|---|
| Ana Sayfa, Hakkımda, İçerik Bölümleri, İçerik Detay | ✔ Görüntüleme | ✔ Görüntüleme |
| Giriş | ✔ | ✔ |
| Yönetim Paneli (`/yonetim`) | ✘ Erişim yok (giriş ekranına yönlendirilir) | ✔ Tam erişim |
| İçerik / Kategori / Hakkımda değiştirme | ✘ | ✔ |

Yetki kontrolü sunucu tarafında da uygulanır: yetkisiz bir değiştirme denemesi sistem tarafından reddedilir.

---

## 3. Ekranlar

### 3.1 Ana Sayfa

**Ekranın Amacı:** Ziyaretçiyi karşılamak, site sahibini kısaca tanıtmak ve içeriklere giriş noktaları sunmak.

**Ekrana Erişim:** Tarayıcıdan site adresi (örn. `http://localhost:4200/`) açıldığında veya menüden **Ana Sayfa** seçildiğinde görüntülenir.

**Ekranın Kullanımı / Fonksiyonaliteler:**

- Üst kısımda karşılama (hero) alanı: site sahibinin adı, mesleği, kısa tanıtım ve fotoğrafı.
- "Teknik Yazıları Oku" ve "Ben Kimim?" düğmeleriyle hızlı yönlendirme.
- "Keşfedebileceğin başlıklar" bölümünde 6 başlık kartı (Hakkımda dahil 5 içerik bölümü) — tıklanınca ilgili bölüme gider.
- "En yeni yazılar" bölümünde son eklenen 3 içerik kartı.

**Dikkat Edilecek Hususlar:** Henüz hiç içerik eklenmemişse "En yeni yazılar" bölümü görünmez; bu normaldir.

### 3.2 Hakkımda

**Ekranın Amacı:** Site sahibinin kişisel bilgilerini sunmak.

**Ekrana Erişim:** Menüden **Hakkımda** veya Ana Sayfa'daki "Ben Kimim?" düğmesi.

**Fonksiyonaliteler:** İsim soyisim, meslek, profil fotoğrafı, uzun biyografi paragrafı ve "Kişisel Kart" (yaş, şehir, meslek, okul, LinkedIn, GitHub) görüntülenir. LinkedIn/GitHub düğmeleri ilgili profili yeni sekmede açar.

**Dikkat Edilecek Hususlar:** Bu bilgiler yalnızca Yönetim Paneli'nden (yetkili kullanıcı tarafından) değiştirilebilir.

### 3.3 İçerik Bölümleri (Teknik Bilgi, Teknik Olmayan Bilgi, Araştırmalarım, Hobilerim, Okuduğum Kitaplar)

**Ekranın Amacı:** Seçilen bölüme ait yayımlanmış içerikleri listelemek.

**Ekrana Erişim:** Menüden ilgili bölüm başlığı.

**Fonksiyonaliteler:**

- Bölüm başlığı ve açıklaması üstte yer alır.
- Altında **kategori filtre çubuğu** bulunur: "Tümü" ve mevcut kategoriler. Bir kategoriye tıklayınca liste o kategoriye göre daralır.
- İçerikler kart düzeninde gösterilir (görsel/renkli kapak, kategori etiketi, başlık, özet, tarih).
- Bir karta tıklamak içeriğin detay sayfasını açar.

**Dikkat Edilecek Hususlar:** Yalnızca "Yayında" durumundaki içerikler görünür. Bölümde içerik yoksa "Henüz içerik yok" mesajı gösterilir.

### 3.4 İçerik Detay

**Ekranın Amacı:** Bir içeriğin tam metnini biçimlendirilmiş olarak göstermek.

**Ekrana Erişim:** Herhangi bir bölümde içerik kartına tıklayarak (`/icerik/{slug}`).

**Fonksiyonaliteler:** Kategori etiketi, başlık, tarih, varsa kapak görseli, özet ve Markdown biçiminde yazılmış içerik (başlıklar, listeler, kod blokları) gösterilir. Varsa "İlgili Bağlantıyı Aç" düğmesiyle dış kaynağa gidilir. Üstteki bağlantıyla bölüme geri dönülür.

### 3.5 Giriş

**Ekranın Amacı:** Yetkili kullanıcının (site sahibinin) kimliğini doğrulayarak Yönetim Paneli'ne erişmesini sağlamak.

**Ekrana Erişim:** Menüden **Giriş** veya alt bilgideki "Yönetici Girişi".

**Ekranın Kullanımı:**

1. **Kullanıcı Adı** alanına yönetici kullanıcı adınızı girin (örn. `admin`).
2. **Şifre** alanına şifrenizi girin.
3. **Giriş Yap** düğmesine tıklayın.
4. Bilgiler doğruysa otomatik olarak **Yönetim Paneli'ne** yönlendirilirsiniz.

**Dikkat Edilecek Hususlar:** Bilgiler hatalıysa "Kullanıcı adı veya şifre hatalı." uyarısı görünür. Oturum bilgisi tarayıcıda saklanır; çıkış yapana kadar geçerlidir.

### 3.6 Yönetim Paneli

**Ekranın Amacı:** Yetkili kullanıcının tüm site içeriğini (Hakkımda, kategoriler ve içerikler) tek bir ekrandan yönetmesini sağlamak.

**Ekrana Erişim:** Giriş yaptıktan sonra menüdeki **Yönetim** bağlantısı veya `/yonetim` adresi. Giriş yapılmadan erişilmeye çalışılırsa Giriş ekranına yönlendirilir.

**Ekranın Kullanımı / Fonksiyonaliteler:**

Panelin en üstünde **bölüm seçim sekmeleri** bulunur:
`Hakkımda · Teknik Bilgi · Teknik Olmayan Bilgi · Araştırmalarım · Hobilerim · Okuduğum Kitaplar`.
Önce yönetmek istediğiniz bölümü seçersiniz; ekranın geri kalanı seçime göre değişir.

**A) "Hakkımda" sekmesi seçildiğinde:**

1. Tüm profil alanları ayrı ayrı kutular halinde gelir: İsim Soyisim, Yaş, Yaşadığım Şehir, Meslek, Okul, LinkedIn URL, Github URL ve uzun **Açıklama** paragrafı.
2. **Güncel Fotoğraf** alanından "Choose File" ile yeni bir fotoğraf seçebilirsiniz; küçük bir önizleme görünür.
3. Düzenlemeyi bitirince **Değişiklikleri Kaydet** düğmesine basın. "Hakkımda bilgileri kaydedildi." mesajını görürsünüz.

**B) Bir içerik bölümü (örn. "Teknik Bilgi") seçildiğinde:** ekran iki panele ayrılır.

*Sol panel — Kategoriler:*

- Yeni kategori eklemek için kutuya adını yazıp **Ekle**'ye basın.
- Bir kategoriyi yeniden adlandırmak için **Düzenle** → yeni adı yazın → **Kaydet**.
- Bir kategoriyi kaldırmak için **Sil** → onay verin. *(Kategoriyle birlikte içindeki tüm içerikler de silinir.)*

*Sağ panel — İçerikler:*

- **+ Yeni İçerik** düğmesi bir form penceresi açar. Burada: **Kategori** seçilir, **Başlık**, **Özet**, **İçerik** (Markdown destekler), isteğe bağlı **Dış Bağlantı**, **Görsel** ve **Durum** (Yayında/Taslak) girilir. **Kaydet**'e basınca içerik eklenir.
- Bir içeriği değiştirmek için satırdaki **Düzenle**, kaldırmak için **Sil** kullanılır.

**Çıkış:** Sağ üstteki **Çıkış Yap** düğmesi oturumu kapatır ve sizi ana sayfaya döndürür.

**Muhasebe Kayıtları:** Bu üründe muhasebe/finansal kayıt oluşturulmaz; bu başlık ürün kapsamı dışındadır.

**Çıktılar:** Panelde yapılan ekleme/güncelleme/silme işlemleri anında veritabanına işlenir ve sitenin ilgili sayfalarında yayımlanır. Ayrı bir basılı çıktı (fiş/dekont vb.) üretilmez.

**Ekler:** Gelişmiş veri yönetimi için Django yönetim arayüzü `http://localhost:8000/admin/` adresinden de kullanılabilir.

---

## 4. Sık Sorulan Sorular

**S: Siteyi okumak için üye olmam veya giriş yapmam gerekiyor mu?**
C: Hayır. Tüm içerikler giriş yapmadan, herkese açık şekilde okunabilir. Giriş yalnızca site sahibinin içerik yönetimi içindir.

**S: Giriş yaptım ama içerik ekleyemiyorum, ne yapmalıyım?**
C: Oturumunuzun süresi dolmuş olabilir. "Çıkış Yap" deyip tekrar giriş yapın. Sorun sürerse kullanıcı adı/şifrenizi kontrol edin.

**S: Yeni bir içerik ekledim ama sitede görünmüyor.**
C: İçeriğin **Durum** alanının "Yayında" olduğundan emin olun. "Taslak" durumundaki içerikler ziyaretçilere gösterilmez.

**S: Bir kategoriyi silersem içindeki yazılara ne olur?**
C: Kategori ile birlikte ona ait tüm içerikler de kalıcı olarak silinir. Silmeden önce çıkan onay uyarısını dikkatlice okuyun.

**S: İçerik metnini nasıl biçimlendirebilirim (başlık, kalın yazı, liste, kod)?**
C: İçerik alanı Markdown destekler. `## Başlık`, `**kalın**`, `- liste maddesi` ve üç ters tırnak (```) ile kod bloğu yazabilirsiniz; bunlar detay sayfasında otomatik biçimlendirilir.

**S: Profil fotoğrafımı nasıl değiştiririm?**
C: Yönetim Paneli → **Hakkımda** sekmesi → "Güncel Fotoğraf" alanından dosya seçin ve **Değişiklikleri Kaydet**'e basın.

**S: Şifremi unuttum.**
C: Yönetici şifresi sunucu tarafında yönetilir. Site sahibi, Django `manage.py changepassword` komutuyla şifresini yenileyebilir.

**S: Site mobil cihazlarda çalışıyor mu?**
C: Evet. Arayüz duyarlıdır (responsive); menü mobilde ☰ düğmesiyle açılır ve kartlar tek sütuna iner.
