---
title: "Ürün Analiz Dökümanı — Kişisel Blog Web Sitesi"
author: "Göktuğ Efe Madran"
---

# Ürün Analiz Dökümanı

**Proje Adı:** Kişisel Blog / Portföy Web Sitesi
**Dersi Veren:** Süleyman KESİK
**Dersi Alan:** Göktuğ Efe Madran
**Dönem:** 2025–2026 Bahar Dönemi
**Bölüm:** Bilgisayar Teknolojileri Bölümü / Bilişim Güvenliği Teknolojisi Programı
**Döküman Türü:** Geliştirici / Analiz Dökümanı
**Versiyon:** 1.0

---

## 1. Giriş

### 1.1 Amaç ve Kapsam

Bu döküman, **Kişisel Blog Web Sitesi** projesinin teknik analizini, iş gereksinimlerini, mimari yapısını ve önyüz tasarımlarını geliştirici bakış açısıyla tariflemek amacıyla hazırlanmıştır.

Proje; bir kullanıcının (site sahibinin) kendisi hakkındaki bilgileri ve farklı konulardaki yazılarını yayımlayabildiği, ziyaretçilerin ise bu içerikleri okuyabildiği kişisel bir blog/portföy uygulamasıdır. Tasarım `aliabdaal.com` örnek alınarak sade, sıcak ve içerik odaklı bir yaklaşımla gerçekleştirilmiştir.

Kapsam dahilindeki ana modüller:

- **Hakkımda** — site sahibinin kişisel bilgileri ve fotoğrafı.
- **Teknik Bilgi**, **Teknik Olmayan Bilgi**, **Araştırmalarım**, **Hobilerim**, **Okuduğum Kitaplar** — kategori bazlı içerik bölümleri.
- **Yetkilendirme** — iki ayrı kullanıcı deneyimi: yalnızca okuyan **Normal Kullanıcı** ve içerik yöneten **Yetkili Kullanıcı**.

Kapsam **dışı**: ödeme/e-ticaret, çok dilli içerik, yorum sistemi ve son kullanıcı üyeliği bu sürümde bulunmamaktadır.

### 1.2 Tanımlar ve Kısaltmalar

| Tanım / Kısaltma | Açıklama |
|---|---|
| API | Application Programming Interface — uygulama programlama arayüzü |
| CRUD | Create, Read, Update, Delete — oluştur/oku/güncelle/sil işlemleri |
| DRF | Django REST Framework |
| JWT | JSON Web Token — kimlik doğrulama jetonu |
| ORM | Object-Relational Mapping — nesne–ilişkisel eşleme |
| REST | Representational State Transfer — API mimari yaklaşımı |
| SPA | Single Page Application — tek sayfa uygulaması |
| Slug | İçerik başlığından türetilen, URL dostu benzersiz metin |
| Bölüm (Section) | İçeriklerin gruplandığı üst başlık (örn. Teknik Bilgi) |
| Kategori | Bir bölüm altındaki alt sınıflandırma (örn. Web Güvenliği) |
| Yetkili Kullanıcı | Giriş yaparak içerik yönetebilen kullanıcı (admin) |
| Normal Kullanıcı | Giriş yapmadan yalnızca okuyabilen ziyaretçi |

### 1.3 Referanslar

| No | Döküman Adı | Notlar |
|---|---|---|
| 1 | Blog Web Sitesi Değerlendirme Kriterleri | Dersin proje gereksinim ve puanlama dökümanı |
| 2 | Django 5.x Resmî Dökümantasyonu | https://docs.djangoproject.com |
| 3 | Django REST Framework Dökümantasyonu | https://www.django-rest-framework.org |
| 4 | Angular 21 Resmî Dökümantasyonu | https://angular.dev |
| 5 | PostgreSQL 15 Dökümantasyonu | https://www.postgresql.org/docs |
| 6 | aliabdaal.com | Tasarım ve içerik kurgusu için örnek site |

---

## 2. İş Modeli

Uygulama iki temel aktör üzerine kuruludur:

1. **Ziyaretçi (Normal Kullanıcı):** Siteye girer, Hakkımda bilgilerini ve yayımlanmış içerikleri bölüm/kategori bazında okur. Herhangi bir kayıt veya giriş gerektirmez. Yazma yetkisi **yoktur**.
2. **Site Sahibi (Yetkili Kullanıcı):** Kullanıcı adı/şifre ile giriş yapar, JWT jetonu alır ve Yönetim Paneli üzerinden tüm içerikleri yönetir (ekleme, güncelleme, silme).

**Temel akış (EPC benzeri özet):**

```
[Ziyaretçi siteye girer]
        → (Ana Sayfa) → [Bölüm seçer] → [İçerik listesini görür] → [İçerik detayını okur]

[Site sahibi /giris ekranına gider]
        → [Kimlik doğrulama (JWT)] → (Yönetim Paneli)
        → [Yönetilecek bölümü seçer]
              ├── Hakkımda  → [Profil formunu günceller → Kaydet]
              └── İçerik bölümü → [Kategori CRUD] + [İçerik CRUD]
```

Yetki kuralı sunucu tarafında zorlanır: yazma uçlarına yalnızca geçerli JWT jetonu olan istekler erişebilir; jetonsuz yazma denemeleri **HTTP 401** ile reddedilir.

---

## 3. İş Gereksinimleri

İlgili iş alanı; kişisel içerik yayıncılığıdır. Site sahibi, bilgi birikimini yapılandırılmış bölümler ve kategoriler altında düzenleyerek ziyaretçiyle paylaşır.

### 3.1 Fonksiyonel Gereksinimler

| Sıra | Fonksiyonel Gereksinim | Detay | Durum |
|---|---|---|---|
| F-01 | Hakkımda görüntüleme | Ziyaretçi; isim, yaş, şehir, meslek, okul, sosyal medya ve uzun biyografi paragrafını görür | Tamamlandı |
| F-02 | Hakkımda güncelleme | Yetkili kullanıcı tüm Hakkımda alanlarını ve profil fotoğrafını güncelleyebilir | Tamamlandı |
| F-03 | Bölümleri listeleme | 5 içerik bölümü (Teknik, Teknik Olmayan, Araştırmalar, Hobiler, Kitaplar) ayrı sayfalarda sunulur | Tamamlandı |
| F-04 | Kategori CRUD | Yetkili kullanıcı her bölüm için kategori ekler/günceller/siler | Tamamlandı |
| F-05 | İçerik CRUD | Yetkili kullanıcı içerik ekler/günceller/siler; görsel ve dış bağlantı ekleyebilir | Tamamlandı |
| F-06 | İçerik filtreleme | Ziyaretçi bölüm içinde kategoriye göre filtreleme yapabilir | Tamamlandı |
| F-07 | İçerik detay görüntüleme | Slug tabanlı detay sayfasında Markdown içerik biçimlendirilerek gösterilir | Tamamlandı |
| F-08 | Taslak/Yayın durumu | İçerikler "taslak" veya "yayında" olabilir; taslaklar ziyaretçiye gösterilmez | Tamamlandı |
| F-09 | Kimlik doğrulama | Yetkili kullanıcı JWT ile giriş yapar; jeton tarayıcıda saklanır | Tamamlandı |
| F-10 | Yetki bazlı erişim | Okuma herkese açık, yazma yalnızca kimliği doğrulanmış kullanıcıya açıktır | Tamamlandı |
| F-11 | API dökümantasyonu | Swagger (drf-spectacular) ile interaktif API dökümantasyonu sunulur | Tamamlandı |

### 3.2 Ertelenen / Yönlendirilen Gereksinimler

| Sıra No | Gereksinim | Detay |
|---|---|---|
| E-01 | Ziyaretçi yorum sistemi | İçeriklere yorum yazma özelliği ileriki sürüme ertelenmiştir |
| E-02 | Tam metin arama | Site genelinde arama motoru ileriki sürüme bırakılmıştır |
| E-03 | Çok dilli içerik (i18n) | İçeriklerin İngilizce versiyonları kapsam dışıdır |
| E-04 | E-posta bülteni | Abonelik/bülten entegrasyonu ertelenmiştir |

### 3.3 Kısıtlamalar, Varsayımlar ve Bağımlılıklar

- **Kısıtlama:** Frontend Angular, backend Django, veritabanı PostgreSQL olarak sabittir (ders kriteri).
- **Kısıtlama:** Hakkımda kaydı sistemde **tekildir** (singleton); yalnızca tek bir profil tutulur.
- **Varsayım:** İçerik metinleri Markdown söz dizimiyle yazılır ve önyüzde HTML'e dönüştürülür.
- **Varsayım:** Yetkili kullanıcı hesabı (admin) Django `createsuperuser` ile önceden oluşturulur.
- **Bağımlılık:** PostgreSQL, Docker Compose ile ayağa kaldırılır (host 5433 → konteyner 5432).
- **Bağımlılık:** Yüklenen görseller `media/` dizininde dosya sisteminde saklanır.

---

## 4. Entegrasyon Analizi

Uygulama dışa bağımlı kritik bir üçüncü parti servise sahip değildir; tüm veri kendi veritabanında tutulur. İç bileşen entegrasyonları aşağıdaki gibidir:

| İlişkili Fonksiyon/İşlev | Entegrasyon Kurulacak Sistem | Entegrasyon Açıklaması |
|---|---|---|
| Frontend ↔ Backend | Angular SPA ↔ Django REST API | `http://localhost:8000/api` üzerinden JSON/REST haberleşmesi; CORS açık |
| Kimlik doğrulama | rest_framework_simplejwt | `/api/token/` ucundan JWT access/refresh jetonu üretimi |
| API dökümantasyonu | drf-spectacular (Swagger) | `/api/schema/` ve `/api/docs/` uçları ile OpenAPI şeması |
| Veri kalıcılığı | PostgreSQL 15 (Docker) | Django ORM aracılığıyla erişilen ilişkisel veritabanı |
| Görsel depolama | Yerel dosya sistemi (`media/`) | `ImageField` ile yüklenen profil ve içerik görselleri |
| Test/Doğrulama | Postman & Swagger UI | API uçlarının manuel test edilmesi |

---

## 5. Raporlama Gereksinimleri

Proje işlemsel bir blog uygulaması olduğundan periyodik/basılı raporlama (gün sonu, ekstre vb.) gereksinimi **bulunmamaktadır**. Bunun yerine aşağıdaki dinamik listeleme/özet görünümleri mevcuttur:

- **Bölüm bazlı içerik listesi:** Seçilen bölüme ait yayımlanmış içeriklerin kart görünümü.
- **Kategoriye göre filtre:** Bölüm içinde kategori seçimiyle anlık daraltma.
- **Yönetim Paneli özetleri:** Her kategori için içerik sayısı, her içerik için durum rozeti (Yayında/Taslak).

Bu görünümler isteğe bağlı (on-demand) üretilir; herhangi bir dosya transferi veya zamanlanmış rapor periyodu yoktur.

---

## 6. Mevcut Uygulama ile Etkileşim

Proje sıfırdan geliştirilen yeni bir uygulamadır; devralınan/canlı bir mevcut sistemle entegrasyon etkisi yoktur. Uygulama içi etkileşim açısından dikkat edilecek nokta:

- Bir **kategori silindiğinde**, o kategoriye bağlı tüm **içerikler de** silinir (`on_delete=CASCADE`). Yönetim panelinde bu işlem öncesi kullanıcıya onay sorulur.

---

## 7. Önyüz Tasarımları ve Kod Açıklamaları

### 7.1 Önyüz Tasarımı

Önyüz, Angular 21 ile **tek sayfa uygulaması (SPA)** olarak geliştirilmiştir. Tasarım dili sıcak/açık renk paleti (krem zemin, teal + mercan vurgu), `Playfair Display` (başlık) ve `Outfit` (gövde) tipografisi üzerine kuruludur.

#### 7.1.1 Ekran Geçişleri

```
Ana Sayfa ("/")
 ├── Hakkımda ("/hakkimda")
 ├── Teknik Bilgi ("/teknik-bilgi") ───────┐
 ├── Teknik Olmayan ("/teknik-olmayan-bilgi")
 ├── Araştırmalarım ("/arastirmalarim")     ├── İçerik Detay ("/icerik/:slug")
 ├── Hobilerim ("/hobilerim")               │
 ├── Kitaplar ("/kitaplar") ────────────────┘
 └── Giriş ("/giris") → [JWT] → Yönetim Paneli ("/yonetim")
                                   ├── Hakkımda formu
                                   └── Bölüm → Kategori CRUD + İçerik CRUD
```

Yönlendirme `app.routes.ts` içinde tanımlıdır; `/yonetim` rotası `authGuard` ile korunur (jeton yoksa `/giris`'e yönlendirir).

#### 7.1.2 Ekran Tasarımları ve Kullanıcı Yetkileri

**Tablo — Kullanıcı Erişim ve Aksiyon Yetkileri**

| Ekran Adı | Normal Kullanıcı | Yetkili Kullanıcı |
|---|---|---|
| Ana Sayfa | Görüntüleme | Görüntüleme |
| Hakkımda | Görüntüleme | Görüntüleme + Güncelleme (panelden) |
| İçerik Bölümleri (5 adet) | Görüntüleme / Filtreleme | Görüntüleme + İçerik/Kategori CRUD (panelden) |
| İçerik Detay | Görüntüleme | Görüntüleme + Düzenleme/Silme (panelden) |
| Giriş | Erişebilir | Erişebilir |
| Yönetim Paneli | **Erişemez (yönlendirilir)** | Tam erişim (CRUD) |

### 7.2 Kodlar

**Mimari katmanlar:**

- **Model katmanı (Django):** `AboutMe`, `Category`, `ContentItem` modelleri; UUID birincil anahtar; başlıktan otomatik `slug` üretimi.
- **Serileştirme (DRF):** `ModelSerializer` sınıfları; salt-okunur türetilmiş alanlar (`category_name`, `item_count` vb.).
- **Görünüm/İzin (DRF):** `ModelViewSet` + `IsAuthenticatedOrReadOnly` izniyle "oku herkese / yaz yetkiliye" kuralı.
- **Servis katmanı (Angular):** `ApiService` (REST çağrıları) ve `AuthService` (JWT), HTTP `authInterceptor` ile her isteğe `Authorization: Bearer` başlığı eklenir.
- **Bileşenler (Angular):** `home`, `about`, `section` (5 bölüm için tek genel bileşen), `content-detail`, `login`, `management`.

**Örnek — Yetki kuralının zorlanması (Django, `blog_content/views.py`):**

```python
class ContentItemViewSet(viewsets.ModelViewSet):
    queryset = ContentItem.objects.all()
    serializer_class = ContentItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]   # oku herkese, yaz yetkiliye

    def get_queryset(self):
        qs = super().get_queryset()
        # Anonim ziyaretçi yalnızca yayımlanmışları görür
        if not self.request.user.is_authenticated:
            qs = qs.filter(status='published')
        return qs
```

**Örnek — JWT'nin önyüzde isteğe eklenmesi (Angular, `auth.interceptor.ts`):**

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (req.url.includes('/api/') && !req.url.includes('/api/token') && token) {
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
  return next(req);
};
```

#### 7.2.1 Uyarı / Hata Mesajları

| Hata Kodu | Hata Mesajı | Açıklama |
|---|---|---|
| H0001 | Kullanıcı adı veya şifre hatalı. | Giriş ekranında kimlik doğrulama başarısız (HTTP 401) |
| H0002 | Oturum süresi dolmuş olabilir, tekrar giriş yapın. | JWT geçersiz/süresi dolmuş; yazma isteği reddedildi |
| H0003 | Kategori, başlık ve içerik zorunludur. | İçerik formunda zorunlu alanlar boş bırakıldı |
| H0004 | "{ad}" kategorisi ve içindeki tüm içerikler silinecek. Emin misin? | Kategori silme onay uyarısı (cascade etkisi) |
| H0005 | İçerik bulunamadı. | Geçersiz slug ile detay sayfasına erişim (HTTP 404) |
| H0006 | Bir hata oluştu. | Beklenmeyen sunucu/ağ hatası için genel mesaj |

#### 7.2.2 Çıktılar

- **Tip / Açıklama:** Uygulamanın ürettiği başlıca çıktı, REST API'nin döndürdüğü **JSON** veri kümeleridir (içerik listesi, içerik detayı, kategori listesi, Hakkımda kaydı).
- **Format:** `application/json`; görseller için `multipart/form-data` ile yükleme, statik dosya olarak servis.
- **Çıktı obje tanımları:** `AboutMe`, `Category[]`, `ContentItem[]` nesneleri; önyüzde kart, detay sayfası ve form bileşenlerine bağlanır. Ayrıca Swagger UI, OpenAPI 3 şemasını insan-okur çıktı olarak sunar.

---

## 8. Tamamlayıcı Gereksinimler

- **Performans:** Kişisel blog ölçeğinde eşzamanlı kullanıcı sayısı düşüktür. API yanıtları yerel ortamda < 200 ms hedeflenir. İçerik listeleri sayfa başına makul boyuttadır; gerekirse DRF sayfalama eklenebilir.
- **Kapasite Tahminleri ve Planlama:** Yıllık içerik artışı birkaç yüz kayıt mertebesindedir; PostgreSQL bu hacmi indeksli sorgularla rahatlıkla karşılar. Görsel depolaması için disk alanı periyodik gözden geçirilir.
- **Kullanılabilirlik:** Bir API çağrısı başarısız olduğunda önyüz, tüm sayfayı bozmak yerine ilgili bölüme yönelik hata/boş-durum mesajı gösterir (örn. "Henüz içerik yok"). Planlı kesinti gerektirmez.
- **Denetlenebilirlik:** Yazma işlemleri yalnızca kimliği doğrulanmış kullanıcıyla yapılır. Django admin'in `LogEntry` mekanizması ile panel üzerinden yapılan değişiklikler izlenebilir; içeriklerde `created_at`/`updated_at` zaman damgaları tutulur.
- **Güvenlik:** Şifreler Django'nun PBKDF2 algoritmasıyla hash'lenerek saklanır. Kimlik doğrulama JWT ile yapılır (HS256). Yazma uçları `IsAuthenticatedOrReadOnly` ile korunur. SQL enjeksiyonuna karşı Django ORM parametreli sorgu kullanır; `SECRET_KEY` ve veritabanı kimlik bilgileri `.env` dosyasında ortam değişkeni olarak tutulur.
- **Felaket Kurtarma:**
  - *RTO (Hedeflenen Kurtarma Süresi):* < 8 saat. Uygulama durumsuzdur (stateless); kod Git deposundan, bağımlılıklar `requirements.txt`/`package.json` üzerinden yeniden kurulabilir.
  - *RPO (Hedeflenen Kurtarma Noktası):* PostgreSQL veri hacminin (`postgres_data`) düzenli yedeklenmesiyle veri kaybı en aza indirilir.
- **Gün Sonu İşlemleri:** Uygulamanın zamanlanmış gün sonu/batch işlemi yoktur.
- **Yaşam Döngüsü:**
  - *Basitlik:* Mimari, iş gereksinimlerini karşılayacak en yalın yapıda tutulmuş; gereksiz katmanlardan kaçınılmıştır (5 içerik bölümü tek genel bileşenle yönetilir).
  - *Geliştirilebilirlik:* Yeni bir bölüm eklemek için `SECTIONS` tanımına bir satır ve modeldeki `SECTION_CHOICES`'a bir seçenek eklemek yeterlidir.
- **Aktif-Aktif Hazır Olma:** Proje ölçeği gereği tek örnek (single instance) yeterlidir; aktif-aktif veri merkezi gereksinimi bulunmamaktadır.

---

## 9. Ekler

- **Ek-1:** Kaynak kodu deposu (Git/GitHub) — frontend (Angular) ve backend (Django) tek monorepo içinde.
- **Ek-2:** `docker-compose.yml` — PostgreSQL ve pgAdmin servis tanımları.
- **Ek-3:** Swagger arayüzü — `http://localhost:8000/api/docs/`.
- **Ek-4:** Çalıştırma betikleri — `run_mac.sh`, `run_windows.bat`.
- **Ek-5:** Veri tohumlama betiği — `backend/seed_data.py` (örnek kategori ve içerikler).
