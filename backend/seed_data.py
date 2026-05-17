import os
import django

# Set up django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from blog_content.models import Category, ContentItem

def seed():
    print("Veritabanı tohumlanıyor...")
    
    # 1. Teknik Bilgi (Technical)
    tech_cat1, _ = Category.objects.get_or_create(name="Siber Tehdit Analizi", section_type="technical")
    tech_cat2, _ = Category.objects.get_or_create(name="Web Güvenliği", section_type="technical")
    
    ContentItem.objects.get_or_create(
        category=tech_cat1,
        title="Wireshark ile Paket Analizi ve Tehdit Avcılığı",
        summary="Ağ trafiğindeki şüpheli hareketleri, yetkisiz port taramalarını ve zararlı yazılım aktivitelerini tespit etmek için Wireshark kullanımı.",
        content="""## Wireshark ile Ağ Analizi ve Paket İnceleme

Ağ analizi, siber güvenlik dünyasında bir dedektiflik işidir. Paketleri yakalamak ve onları analiz etmek ağınızda olup biten her şeyi görmenizi sağlar. Bu rehberde Wireshark ile nasıl paket analizi yapacağımızı inceleyeceğiz.

### 1. Temel Filtreler
Filtreleme, milyonlarca paket arasından ilgilendiğimiz trafiği bulmamızı sağlar:
- `ip.addr == 192.168.1.5` -> Belirli bir IP adresine ait tüm gelen/giden paketler.
- `tcp.flags.syn == 1 and tcp.flags.ack == 0` -> Ağdaki TCP SYN taramalarını yakalar.
- `http.request.method == "POST"` -> Gönderilen HTTP POST isteklerini gösterir.

### 2. Tehdit Avcılığı Örneği
Eğer ağınızda şüpheli bir veri transferi (data exfiltration) olduğundan şüpheleniyorsanız, aşağıdaki adımları izleyebilirsiniz:
1. `dns` filtresi uygulayarak olağandışı alan adlarına yapılan sorguları inceleyin.
2. `http` veya `tls` trafiğinde büyük boyutlu veri transferi yapan IP'leri gruplayın.
3. TCP stream'i (`Follow TCP Stream`) takip ederek şifrelenmemiş verinin içeriğini okuyun.

Ağ analizi sabır ve tecrübe gerektirir. Wireshark'ı etkin kullanmak, güvenlik ihlallerini erken aşamada önlemenin en temel adımlarından biridir.
""",
        status="published"
    )

    ContentItem.objects.get_or_create(
        category=tech_cat2,
        title="OWASP Top 10 ve SQL Injection Koruması",
        summary="SQL Injection (SQLi) zafiyetinin çalışma prensipleri ve güvenli kodlama (Parameterized Queries) ile korunma yöntemleri.",
        content="""## SQL Injection Nedir ve Nasıl Önlenir?

SQL Injection (SQLi), saldırganın uygulama girdilerine SQL komutları enjekte ederek arka plandaki veritabanını manipüle etmesidir. OWASP Top 10 listesinde uzun yıllardır zirvede yer alan en kritik zafiyetlerden biridir.

### 1. Zafiyet Senaryosu
Bir giriş ekranında kullanıcı adı ve şifre kontrolü aşağıdaki gibi güvensiz bir şekilde yapıldığında:
```sql
SELECT * FROM users WHERE username = 'USER_INPUT' AND password = 'PASSWORD_INPUT'
```
Saldırgan `USER_INPUT` kısmına `' OR '1'='1` girdiğinde sorgu şuna dönüşür:
```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = ''
```
Bu koşul her zaman doğru döneceği için şifre kontrolü bypass edilerek sisteme yetkisiz giriş sağlanır.

### 2. Korunma Yöntemleri: Parametreli Sorgular
En etkili korunma yöntemi, SQL motorunun kullanıcı girdisini kod olarak yorumlamasını engelleyen **Parametreli Sorgular (Prepared Statements)** kullanmaktır:

```python
# GÜVENSİZ KULLANIM
cursor.execute(f"SELECT * FROM users WHERE username = '{user_input}'")

# GÜVENLİ VE PARAMETRELİ KULLANIM
cursor.execute("SELECT * FROM users WHERE username = %s", (user_input,))
```
Modern web frameworkleri (örneğin Django ORM) bu korumayı dahili olarak sağlar. Arka planda güvenli parametre bağlamayı otomatik yaparak geliştiricileri korur.
""",
        status="published"
    )

    # 2. Teknik Olmayan Bilgi (Non-Technical)
    nontech_cat1, _ = Category.objects.get_or_create(name="Kişisel Üretkenlik", section_type="non_technical")
    ContentItem.objects.get_or_create(
        category=nontech_cat1,
        title="Pomodoro ve Zaman Bloklama Metotları",
        summary="Zihinsel yorgunluğu azaltıp derin odaklanma süreleri yaratmak için uygulanan Pomodoro ve Zaman Bloklama tekniklerinin siber güvenlik çalışmalarındaki faydaları.",
        content="""## Siber Güvenlikte Zaman ve Enerji Yönetimi

Siber güvenlik alanında çalışırken veya eğitim alırken saatlerce ekran başında kalmak zihinsel olarak oldukça yıpratıcıdır. **Ali Abdaal**'ın da kitaplarında ve videolarında sıkça vurguladığı gibi, en büyük engel zaman kıtlığı değil, **enerji yönetimidir**.

### Pomodoro Tekniği
Pomodoro tekniği, çalışmayı 25 dakikalık bloklara ve ardından gelen 5 dakikalık dinlenme aralarına böler.
- **Odaklanma Süresi (25 dk):** Telefon, sosyal medya ve tüm bildirimler kapatılır. Sadece önünüzdeki sızma testine veya analiz konusuna odaklanılır.
- **Kısa Mola (5 dk):** Ekrandan uzaklaşılır, su içilir veya kısa bir esneme hareketi yapılır.

### Zaman Bloklama (Time Blocking)
Gününüzü belirsiz görevlerle geçirmek yerine, takviminizde spesifik saat dilimlerini belirli işlere bloke edin:
- `09:00 - 11:00` -> Siber Güvenlik Lab Uygulamaları (Derin Çalışma)
- `11:00 - 12:00` -> E-postalar ve Teknik Okumalar (Sığ Çalışma)

Bu metotlar beynin yorulmasını önleyerek gün boyu yüksek verimlilik sunar.
""",
        status="published"
    )

    # 3. Araştırmalarım (Researches)
    res_cat1, _ = Category.objects.get_or_create(name="Kriptoloji Araştırmaları", section_type="research")
    ContentItem.objects.get_or_create(
        category=res_cat1,
        title="Sıfır Bilgi Kanıtları (Zero-Knowledge Proofs) ve Geleceği",
        summary="ZKP protokollerinin çalışma mantığı, gizlilik odaklı blokzincir sistemlerindeki uygulamaları ve siber güvenlik kimlik doğrulama protokollerindeki yeri.",
        content="""## Sıfır Bilgi Kanıtı (Zero-Knowledge Proof - ZKP) Nedir?

Sıfır Bilgi Kanıtı, bir tarafın (kanıtlayan - prover), diğer tarafa (doğrulayan - verifier), bir iddianın doğru olduğunu, o iddianın doğruluğu dışında hiçbir bilgi vermeden matematiksel olarak kanıtlayabilmesini sağlayan bir kriptografi tekniğidir.

### Klasik Şifre Kontrolü ile Karşılaştırma
- **Klasik Yöntem:** Şifrenizi sisteme gönderirsiniz, sistem şifrenizi veritabanındaki hash ile karşılaştırır. Bu esnada şifrenizi sunucuya ifşa etmiş olursunuz.
- **ZKP Yöntemi:** Şifrenizi sunucuya göndermeden, sadece şifrenizi bildiğinizi gösteren matematiksel bir kanıt gönderirsiniz. Sunucu şifrenizi hiç öğrenmeden sizin doğru kişi olduğunuzu doğrular.

### Siber Güvenlikteki Uygulama Alanları
1. **Gizlilik Odaklı Kimlik Doğrulama:** Şifre sızıntılarını tamamen ortadan kaldıran güvenli giriş sistemleri.
2. **Blokzincir ve Finansal Gizlilik:** Transfer miktarını ve göndericiyi gizli tutarak işlemlerin geçerliliğini doğrulamak (örn: Zcash, zk-SNARKs).
3. **Bulut Veri Paylaşımı:** Hassas kişisel verileri ifşa etmeden yasal gereklilikleri doğrulamak.

ZKP, geleceğin siber güvenlik altyapısında gizlilik ve güvenliğin en önemli koruyucularından biri olacaktır.
""",
        status="published"
    )

    # 4. Hobilerim (Hobbies)
    hobby_cat1, _ = Category.objects.get_or_create(name="Zeka Oyunları", section_type="hobby")
    ContentItem.objects.get_or_create(
        category=hobby_cat1,
        title="Satranç Oynamanın Analitik Düşünceye Etkisi",
        summary="Satranç stratejileri ile siber güvenlikteki saldırı/savunma (Red Team / Blue Team) mantığı arasındaki şaşırtıcı benzerlikler.",
        content="""## Satranç ve Siber Güvenlik

Satranç oynamak sadece boş vakit değerlendirmek değil, zihni sürekli zinde tutan yoğun bir analitik egzersizdir. Bir siber güvenlik araştırmacısı olarak satranç tahtasında kurduğum stratejilerin, siber güvenlik dünyasındaki karşılıklarını fark etmek oldukça heyecan verici.

### Saldırı ve Savunma Dengesi
Satrançta da siber güvenlikte olduğu gibi iki temel yaklaşım vardır:
- **Kırmızı Takım (Saldırı - Taş Kazancı/Mat):** Rakibin zayıf karelerini tespit edip oraya baskı uygulamak, tuzaklar hazırlamak ve planı fark ettirmeden uygulamak.
- **Mavi Takım (Savunma - Profilaksi):** Rakibin muhtemel hamlelerini ve tehditlerini önceden öngörüp (profilaktik düşünce) savunma hattını erkenden kurmak.

Satrançta bir hamle yapmadan önce 3-4 hamle sonrasını düşünmek, bir sistem mimarisinde potansiyel zafiyet noktalarını önceden görerek yama hazırlamaya benzer. Her iki disiplin de yüksek odaklanma, örüntü tanıma ve sabır gerektirir.
""",
        status="published"
    )

    # 5. Okuduğum Kitaplar (Books)
    book_cat1, _ = Category.objects.get_or_create(name="Siber Roman & Biyografi", section_type="book")
    ContentItem.objects.get_or_create(
        category=book_cat1,
        title="Kukla Yumurtası (The Cuckoo's Egg) - Clifford Stoll",
        summary="Bir sistem yöneticisinin, 75 sentlik ufak bir sistem muhasebesi açığının peşine düşerek Soğuk Savaş dönemindeki bir casusluk şebekesini çökertme hikayesi.",
        content="""## Kukla Yumurtası: İlk Siber Dedektiflik Hikayesi

**Yazar:** Clifford Stoll
**Tür:** Siber Güvenlik / Biyografi / Polisiye

### Kitabın Özeti
Lawrence Berkeley Laboratuvarı'nda gökbilimci olan Clifford Stoll, bilgisayar sistemlerinin muhasebesini tutarken **75 sentlik bir açık** fark eder. Birçok insanın önemsemeyeceği bu küçük tutarsızlığın arkasında, sistem kaynaklarını izinsiz kullanan gizemli bir bilgisayar korsanının (hacker) olduğunu anlar. 

Stoll, bilgisayara bağlı bir teleks cihazı üzerinden hacker'ın her adımını kağıda yazdırarak aylarca süren bir takip başlatır. Sonunda bu takibin arkasından, Amerikan askeri sırlarını çalarak KGB'ye satan Batı Alman menşeili bir casusluk şebekesi çıkar.

### Siber Güvenlik Çıkarımları
- **Hiçbir Hata Önemsiz Değildir:** Log kayıtlarındaki en küçük sapmalar bile büyük bir güvenlik ihlalinin ayak sesleri olabilir.
- **Sabır ve İzlenebilirlik (Honey Pot):** Saldırganı sistemden hemen atmak yerine, onun hareketlerini izleyerek niyetini ve kaynağını anlamak (ilk bal küpü - honeypot örnekleri).

Siber güvenlik alanına adım atan herkesin okuması gereken, heyecan verici ve gerçek bir başucu kitabıdır.
""",
        external_link="https://www.goodreads.com/book/show/18154.The_Cuckoo_s_Egg",
        status="published"
    )

    print("Tohumlama başarıyla tamamlandı!")

if __name__ == '__main__':
    seed()
