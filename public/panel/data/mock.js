/* =========================================================================
   SAHTE VERİ — panelin okuduğu TEK kaynak.
   Gerçek bağlantı geldiğinde yalnızca bu dosya değişecek; panelin geri kalanı
   dokunulmadan kalacak şekilde kuruldu.

   KURAL — hukuki içerik:
   Burada uydurma madde numarası, kanun maddesi, mahkeme kararı künyesi, süre,
   oran ya da tutar GEÇMEZ. Başlıklar ve özetler "yazı neyi anlatıyor"
   seviyesinde kalır; hiçbir hukuki iddia içermez. Yazı gövdeleri de aynı
   kurala tabidir — yer tutucu metindir, hukuki bilgi değildir.

   TAKVİM — Premium paket, ayda 30 yazı, her gün yayın.
   Eylül 2026 otuz gün çeker; otuz günün tamamı doludur ve bu tam olarak aylık
   kotadır. Abonelik 1 Eylül'de başladı, o yüzden ağustosta kayıt yok.
     1–10 Eylül  → yayınlandı (10)   ← bugün 10 Eylül, saat 10:00 yayını geçti
     11–13 Eylül → onay bekliyor (3)
     14–30 Eylül → planlandı (17)
   Ayrıca tarihi olmayan 1 reddedilmiş yazı var.

   Not: konu listesindeki hacim / rekabet / skor değerleri yer tutucudur;
   gerçek araştırma verisi bağlandığında değişecektir.
   ========================================================================= */

window.MOCK = {

  /* Demonun "bugün"ü. Sabit tutuluyor ki panel hangi tarihte açılırsa açılsın
     takvim ve "bu ay" sayaçları tutarlı görünsün. */
  bugun: "2026-09-10",

  /* ---- panele giren hesap ---- */
  hesap: {
    markaAdi: "Demo Hukuk Bürosu",
    eposta: "demo@dolunay.ai",
    telefon: "0850 000 00 00",
  },

  /* Müşterinin kendi blogu. .example uzantısı örnek amaçlıdır, hiçbir zaman
     gerçek bir adrese çözülmez — sahte ama var gibi duran alan adı kullanmamak
     için böyle bırakıldı. */
  blogAdresi: "https://demo-hukuk-burosu.example/blog",

  /* ---- abonelik ----
     Paket adları ve fiyatlar dolunay.ai/blog-otomasyonu sayfasında yazan
     hâliyle. Uydurma limit/fiyat yok. */
  abonelik: {
    paket: "Premium",
    aylikYazi: 30,
    fiyat: 9980,
    paraBirimi: "₺",
    kdvOrani: 0.2,
    durum: "Aktif Abonelik",
  },

  paketler: [
    { ad: "Başlangıç",   aylikYazi: 8,  fiyat: 2980, not: "haftada 2 yayın" },
    { ad: "Profesyonel", aylikYazi: 16, fiyat: 5980, not: "haftada 4 yayın", enPopuler: true },
    { ad: "Premium",     aylikYazi: 30, fiyat: 9980, not: "her gün yayın" },
  ],

  /* Premium = her gün yayın, yedi günün tamamı seçili. */
  yayinProgrami: {
    saat: "10:00",
    gunler: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
  },

  /* =======================================================================
     YAZILAR
     durum: "yayinda" | "bekliyor" | "planlandi" | "reddedildi"
     tarih: yayınlananlarda yayın tarihi; bekleyen ve planlananlarda planlanan
            tarih; reddedilenlerde yok
     kapak: gerçek görsel adresi. null ise panel marka renklerinde geometrik
            bir yer tutucu üretir — dışarıdan görsel çekilmez.
     ======================================================================= */
  yazilar: [

    /* ---------- yayınlandı: 1–10 Eylül ---------- */
    {
      id: "y-01", baslik: "Kiracı ve ev sahibi arasındaki anlaşmazlıklarda izlenen yollar",
      ozet: "Anlaşmazlığın hangi aşamada nasıl ele alındığını, tarafların hangi adımları attığını ve süreçte nelerin istendiğini aktarıyoruz.",
      kategori: "Gayrimenkul Hukuku", durum: "yayinda", tarih: "2026-09-01",
      okumaDk: 5, kelime: 980, kapak: null, adres: "kiraci-ve-ev-sahibi-anlasmazliklarinda-izlenen-yollar",
      icerik:
        "<p>Kira ilişkisinde çıkan anlaşmazlıklar çoğunlukla benzer başlıklar etrafında toplanır. Bu yazıda izlenen yolları anlatıyoruz.</p>" +
        "<h2>İlk adım ne oluyor?</h2>" +
        "<p>Tarafların yazılı olarak birbirine durumu bildirmesi, sonraki adımların zeminini oluşturur.</p>" +
        "<h2>Anlaşma sağlanamazsa</h2>" +
        "<p>Bu noktadan sonra izlenen yol değişir. Yazının devamında aşamaları sırasıyla açıklıyoruz.</p>",
    },
    {
      id: "y-02", baslik: "Boşanma davası ne kadar sürer? Süreci etkileyen başlıklar",
      ozet: "Süreyi uzatan ve kısaltan başlıkları, dosyanın hangi aşamalardan geçtiğini ve tarafların hangi noktalarda beklediğini anlatıyoruz.",
      kategori: "Aile Hukuku", durum: "yayinda", tarih: "2026-09-02",
      okumaDk: 6, kelime: 1090, kapak: null, adres: "bosanma-davasi-ne-kadar-surer",
      icerik:
        "<p>Sürenin ne kadar olacağı dosyadan dosyaya değişir. Bu yazıda süreyi etkileyen başlıkları anlatıyoruz.</p>" +
        "<h2>Neler süreci uzatıyor?</h2>" +
        "<p>Tarafların anlaşamadığı konuların sayısı, süreci belirleyen en görünür etkendir.</p>" +
        "<h2>Neler kısaltıyor?</h2>" +
        "<p>Belgelerin baştan eksiksiz hazırlanması, aşamalar arasındaki bekleme sürelerini azaltır.</p>",
    },
    {
      id: "y-03", baslik: "İşten çıkarıldığınızda hangi haklarınızı sorabilirsiniz?",
      ozet: "Ayrılma sonrasında konuşulan başlıkları, hangi belgelerin istendiğini ve süreçte izlenen sırayı adım adım anlatıyoruz.",
      kategori: "İş Hukuku", durum: "yayinda", tarih: "2026-09-03",
      okumaDk: 7, kelime: 1260, kapak: null, adres: "isten-cikarildiginizda-hangi-haklarinizi-sorabilirsiniz",
      icerik:
        "<p>İş ilişkisi sona erdiğinde konuşulan başlıklar belirli bir sırayla ele alınır. Bu yazıda o sırayı anlatıyoruz.</p>" +
        "<h2>İlk hangi belgeler isteniyor?</h2>" +
        "<p>İş yerinden alınan belgeler ve yazışmalar süreç boyunca en çok başvurulan kaynaklardır.</p>" +
        "<h2>Süreç nasıl ilerliyor?</h2>" +
        "<p>Adımlar, ayrılmanın nasıl gerçekleştiğine göre değişir. Yazının devamında bunları açıklıyoruz.</p>",
    },
    {
      id: "y-04", baslik: "Nafaka miktarı neye göre belirlenir?",
      ozet: "Belirlemede hangi başlıkların dikkate alındığını, tarafların neleri sunduğunu ve sürecin nasıl ilerlediğini anlatıyoruz.",
      kategori: "Aile Hukuku", durum: "yayinda", tarih: "2026-09-04",
      okumaDk: 6, kelime: 1120, kapak: null, adres: "nafaka-miktari-neye-gore-belirlenir",
      icerik:
        "<p>Nafaka konusunda en sık sorulan soru, miktarın neye göre belirlendiğidir. Bu yazıda dikkate alınan başlıkları anlatıyoruz.</p>" +
        "<h2>Hangi başlıklara bakılıyor?</h2>" +
        "<p>Tarafların koşulları ve ihtiyaçları süreçte en çok konuşulan konulardır.</p>" +
        "<h2>Neler sunuluyor?</h2>" +
        "<p>Tarafların sunduğu belgeler duruma göre değişir; yazıda sık sunulanları derledik.</p>",
    },
    {
      id: "y-05", baslik: "Anlaşmalı boşanmada protokol hazırlarken nelere bakılır?",
      ozet: "Protokolde yer alan başlıkları, atlandığında sonradan sorun çıkaran noktaları ve metnin nasıl düzenlendiğini örneklerle anlatıyoruz.",
      kategori: "Aile Hukuku", durum: "yayinda", tarih: "2026-09-05",
      okumaDk: 6, kelime: 1070, kapak: null, adres: "anlasmali-bosanmada-protokol-hazirlarken-nelere-bakilir",
      icerik:
        "<p>Protokol, tarafların üzerinde anlaştığı konuları tek metinde toplayan belgedir. Bu yazıda metnin nasıl düzenlendiğini anlatıyoruz.</p>" +
        "<h2>Hangi başlıklar yer alıyor?</h2>" +
        "<p>Tarafların ortak yaşamına dair konular ve sonrasına ilişkin düzenlemeler metnin ana başlıklarını oluşturur.</p>" +
        "<h2>En çok ne atlanıyor?</h2>" +
        "<p>Sonradan sorun çıkaran noktalar çoğunlukla metinde hiç yazılmamış ayrıntılardan doğuyor.</p>",
    },
    {
      id: "y-06", baslik: "Velayet davasında hangi başlıklar konuşulur?",
      ozet: "Sürecin hangi başlıklar üzerinden yürüdüğünü, tarafların neleri anlattığını ve dosyaya nelerin sunulduğunu sade bir dille aktarıyoruz.",
      kategori: "Aile Hukuku", durum: "yayinda", tarih: "2026-09-06",
      okumaDk: 6, kelime: 1100, kapak: null, adres: "velayet-davasinda-hangi-basliklar-konusulur",
      icerik:
        "<p>Velayet süreçlerinde konuşulan başlıklar, çocuğun günlük yaşamına dair somut konular etrafında toplanır. Bu yazıda bunları anlatıyoruz.</p>" +
        "<h2>Hangi konular öne çıkıyor?</h2>" +
        "<p>Çocuğun düzeni, bakımı ve ihtiyaçları süreç boyunca en çok konuşulan başlıklardır.</p>" +
        "<h2>Dosyaya neler sunuluyor?</h2>" +
        "<p>Tarafların sunduğu belgeler duruma göre değişir. Yazının devamında sık sunulanları listeledik.</p>",
    },
    {
      id: "y-07", baslik: "İstifa eden çalışan tazminat isteyebilir mi? Konunun çerçevesi",
      ozet: "Ayrılma biçiminin sonuçları nasıl değiştirdiğini, hangi durumların ayrı değerlendirildiğini ve başvuru öncesinde nelere bakıldığını anlatıyoruz.",
      kategori: "İş Hukuku", durum: "yayinda", tarih: "2026-09-07",
      okumaDk: 7, kelime: 1290, kapak: null, adres: "istifa-eden-calisan-tazminat-isteyebilir-mi",
      icerik:
        "<p>İş ilişkisinin nasıl sona erdiği, sonrasında konuşulan başlıkları doğrudan etkiler. Bu yazıda konunun çerçevesini çiziyoruz.</p>" +
        "<h2>Ayrılma biçimi neden önemli?</h2>" +
        "<p>Ayrılmanın hangi gerekçeyle ve nasıl gerçekleştiği, sonraki adımları belirleyen ilk başlıktır.</p>" +
        "<h2>Başvuru öncesinde neye bakılır?</h2>" +
        "<p>Yazışmalar, bildirimler ve iş yerindeki kayıtlar genellikle ilk incelenen belgelerdir.</p>",
    },
    {
      id: "y-08", baslik: "Miras paylaşımında hangi yollar izlenebilir?",
      ozet: "Mirasçıların anlaşarak ilerlediği yolları, anlaşma sağlanamadığında devreye giren süreçleri ve her birinin nasıl işlediğini anlatıyoruz.",
      kategori: "Miras Hukuku", durum: "yayinda", tarih: "2026-09-08",
      okumaDk: 6, kelime: 1150, kapak: null, adres: "miras-paylasiminda-hangi-yollar-izlenebilir",
      icerik:
        "<p>Miras paylaşımı, mirasçıların anlaşmasıyla ya da bir süreç yürütülerek sonuçlanabilir. Bu yazıda iki yolu da anlatıyoruz.</p>" +
        "<h2>Anlaşarak ilerlemek</h2>" +
        "<p>Mirasçıların kendi aralarında yaptığı düzenleme, süreci belirgin biçimde kısaltır. Yazıda bu düzenlemenin nasıl hazırlandığını açıklıyoruz.</p>" +
        "<h2>Anlaşma sağlanamazsa</h2>" +
        "<p>Bu durumda izlenen yol farklılaşır. Yazının devamında aşamaları sırasıyla aktarıyoruz.</p>",
    },
    {
      id: "y-09", baslik: "Vasiyetname türleri ve aralarındaki farklar",
      ozet: "Vasiyetnamenin hangi biçimlerde düzenlendiğini, her birinin nasıl hazırlandığını ve aralarındaki farkları tabloyla karşılaştırıyoruz.",
      kategori: "Miras Hukuku", durum: "yayinda", tarih: "2026-09-09",
      okumaDk: 7, kelime: 1240, kapak: null, adres: "vasiyetname-turleri-ve-aralarindaki-farklar",
      icerik:
        "<p>Vasiyetname birden fazla biçimde düzenlenebilir ve her biçimin kendine göre hazırlanma şekli vardır. Bu yazıda türleri karşılaştırıyoruz.</p>" +
        "<h2>Türler nasıl ayrışıyor?</h2>" +
        "<p>Ayrım, belgenin nasıl hazırlandığı ve kimlerin sürece katıldığı üzerinden kuruluyor. Yazıda bunları bir tablo hâlinde topladık.</p>" +
        "<h2>Hangi durumda hangisi tercih ediliyor?</h2>" +
        "<p>Tercih, kişinin koşullarına göre değişir. Yazının devamında sık karşılaşılan durumları örneklerle anlatıyoruz.</p>",
    },
    {
      id: "y-10", baslik: "Tapu kaydına itiraz etmek istediğinizde süreç nasıl işler?",
      ozet: "İtirazın nereye yapıldığını, hangi belgelerin istendiğini ve sürecin hangi aşamalardan geçtiğini baştan sona aktarıyoruz.",
      kategori: "Gayrimenkul Hukuku", durum: "yayinda", tarih: "2026-09-10",
      okumaDk: 6, kelime: 1080, kapak: null, adres: "tapu-kaydina-itiraz-surec-nasil-isler",
      icerik:
        "<p>Tapu kaydıyla ilgili bir sorun fark edildiğinde izlenecek yol, sorunun niteliğine göre değişir. Bu yazıda sürecin genel çerçevesini çiziyoruz.</p>" +
        "<h2>Hangi belgeler isteniyor?</h2>" +
        "<p>Kayda ilişkin belgeler ve taşınmazla ilgili geçmiş işlemler süreç boyunca en çok başvurulan kaynaklardır.</p>" +
        "<h2>Süreç nasıl ilerler?</h2>" +
        "<p>Başvurunun ardından dosya incelenir ve tarafların açıklamaları alınır. Yazının devamında aşamaları sırasıyla anlatıyoruz.</p>",
    },

    /* ---------- onay bekliyor: 11–13 Eylül ---------- */
    {
      id: "y-13",
      baslik: "İnternet üzerinden dolandırıldığınızı fark ettiğinizde ne yapılır?",
      ozet: "Fark ettiğiniz anda atılabilecek adımları, hangi kayıtların saklanması gerektiğini ve başvurunun hangi kanallardan yapıldığını sırasıyla anlatıyoruz.",
      kategori: "Bilişim Hukuku", durum: "bekliyor", tarih: "2026-09-11",
      onayaGonderildi: "2026-09-09",
      okumaDk: 6, kelime: 1120, kapak: null, adres: "internet-uzerinden-dolandirildiginizda-ne-yapilir",
      icerik:
        "<p>İnternet üzerinden yapılan işlemlerde bir sorun fark edildiğinde ilk saatler önemlidir. Bu yazıda, durumu fark ettikten sonra izlenebilecek adımları ve hangi belgelerin toplanmasının işi kolaylaştırdığını sade bir dille anlatıyoruz.</p>" +
        "<h2>Önce hangi kayıtlar toplanır?</h2>" +
        "<p>Yapılan yazışmalar, işlem dökümleri ve ekran görüntüleri süreç boyunca en çok başvurulan belgelerdir. Bunların düzenli biçimde bir arada tutulması, sonraki adımlarda zaman kazandırır.</p>" +
        "<ul><li>Yazışmaların tarih ve saat bilgisiyle birlikte saklanması</li><li>İşlem dökümlerinin ilgili kurumdan temin edilmesi</li><li>Ekran görüntülerinin bütün sayfayı kapsayacak şekilde alınması</li></ul>" +
        "<h2>Başvuru hangi kanallardan yapılır?</h2>" +
        "<p>Başvurunun nereye yapılacağı olayın niteliğine göre değişir. Yazının devamında, hangi durumda hangi kanalın kullanıldığını ve süreçte nelerin sorulduğunu açıklıyoruz.</p>",
    },
    {
      id: "y-14",
      baslik: "Arabuluculuk süreci nasıl işler?",
      ozet: "Görüşmelerin nasıl başladığını, tarafların hangi aşamada ne yaptığını ve sürecin sonunda hangi belgelerin düzenlendiğini adım adım aktarıyoruz.",
      kategori: "İhtiyari Arabuluculuk", durum: "bekliyor", tarih: "2026-09-12",
      onayaGonderildi: "2026-09-09",
      okumaDk: 5, kelime: 940, kapak: null, adres: "arabuluculuk-sureci-nasil-isler",
      icerik:
        "<p>Arabuluculuk, tarafların bir araya gelerek anlaşmazlığı kendi iradeleriyle çözmeye çalıştığı bir yöntemdir. Bu yazıda sürecin nasıl başladığını ve hangi aşamalardan geçtiğini anlatıyoruz.</p>" +
        "<h2>Görüşmeler nasıl yürür?</h2>" +
        "<p>Taraflar ortak oturumda bir araya gelebileceği gibi ayrı ayrı da görüşülebilir. Görüşmelerin düzenini arabulucu belirler; amacı tarafların kendi çözümlerini üretmesine alan açmaktır.</p>" +
        "<h2>Süreç nasıl sonuçlanır?</h2>" +
        "<p>Görüşmelerin sonunda düzenlenen belge, tarafların üzerinde uzlaştığı noktaları kayda geçirir. Yazının devamında bu belgenin nasıl hazırlandığını ve neleri kapsadığını açıklıyoruz.</p>",
    },
    {
      id: "y-15",
      baslik: "İsim ve soyisim değiştirme başvurusunun adımları",
      ozet: "Başvurunun nereye yapıldığını, hangi belgelerin istendiğini ve süreç boyunca karşınıza çıkan aşamaları örneklerle anlatıyoruz.",
      kategori: "Kişiler Hukuku", durum: "bekliyor", tarih: "2026-09-13",
      onayaGonderildi: "2026-09-10",
      okumaDk: 5, kelime: 890, kapak: null, adres: "isim-ve-soyisim-degistirme-basvurusunun-adimlari",
      icerik:
        "<p>İsim ya da soyisim değişikliği, kişinin kimlik bilgilerini doğrudan etkilediği için belirli bir sıra izlenerek yürütülür. Bu yazıda başvurunun nasıl yapıldığını ve sürecin nasıl ilerlediğini anlatıyoruz.</p>" +
        "<h2>Başvuru öncesinde neler hazırlanır?</h2>" +
        "<p>Başvuruda istenen belgeler kişinin durumuna göre değişebilir. Yazının bu bölümünde en sık istenen belgeleri ve bunların nereden temin edildiğini derledik.</p>" +
        "<h2>Sonuçlandıktan sonra ne olur?</h2>" +
        "<p>Değişiklik kayıtlara işlendikten sonra güncellenmesi gereken başka belgeler de olabilir. Yazının devamında bunları bir liste hâlinde veriyoruz.</p>",
    },

    /* ---------- planlandı: 14–30 Eylül ---------- */
    {
      id: "y-11", baslik: "İş yerinde mobbing iddiasını nasıl belgelendirirsiniz?",
      ozet: "Hangi kayıtların tutulduğunu, tanık beyanlarının süreçteki yerini ve başvuru öncesinde hazırlanan dosyanın nasıl düzenlendiğini anlatıyoruz.",
      kategori: "İş Hukuku", durum: "planlandi", tarih: "2026-09-14",
      okumaDk: 7, kelime: 1310, kapak: null, adres: "is-yerinde-mobbing-iddiasini-nasil-belgelendirirsiniz",
      icerik:
        "<p>İş yerinde yaşanan olumsuz davranışların kayda geçirilmesi, sürecin en belirleyici aşamalarından biridir. Bu yazıda hangi kayıtların tutulduğunu ve dosyanın nasıl düzenlendiğini anlatıyoruz.</p>" +
        "<h2>Hangi kayıtlar tutulur?</h2>" +
        "<p>Yazışmalar, görev değişiklikleri ve tarihli notlar en sık başvurulan kayıtlardır. Bunların düzenli tutulması, olayların sırasını anlaşılır kılar.</p>" +
        "<h2>Dosya nasıl düzenlenir?</h2>" +
        "<p>Kayıtların tarih sırasına göre dizilmesi ve her birine kısa bir açıklama eklenmesi, dosyayı okuyan kişi için işi kolaylaştırır.</p>",
    },
    {
      id: "y-12", baslik: "Kira artış oranı nasıl hesaplanır?",
      ozet: "Artışın hangi ölçüte göre belirlendiğini, hesabın hangi sırayla yapıldığını ve tarafların nelere dikkat ettiğini örnek bir tabloyla anlatıyoruz.",
      kategori: "Gayrimenkul Hukuku", durum: "planlandi", tarih: "2026-09-15",
      okumaDk: 6, kelime: 1160, kapak: null, adres: "kira-artis-orani-nasil-hesaplanir",
      icerik:
        "<p>Kira artışı, kira ilişkisinin en sık konuşulan başlıklarından biridir. Bu yazıda artışın hangi ölçüte bağlandığını ve hesabın nasıl yapıldığını sade bir dille anlatıyoruz.</p>" +
        "<h2>Hesap hangi sırayla yapılır?</h2>" +
        "<p>Hesaplama, sözleşmede yazan düzenlemeden başlar ve ilgili ölçütün o döneme ait değeriyle devam eder. Yazının bu bölümünde adımları örnek bir tablo üzerinden gösteriyoruz.</p>" +
        "<h2>Taraflar neye dikkat ediyor?</h2>" +
        "<p>Artışın yazılı olarak bildirilmesi, tarafların sonradan yaşadığı anlaşmazlıkları büyük ölçüde azaltıyor. Yazının devamında bildirimin nasıl yapıldığını açıklıyoruz.</p>",
    },
    {
      id: "y-17", baslik: "Kira sözleşmesinde depozito nasıl ele alınır?",
      ozet: "Depozitonun sözleşmede nasıl düzenlendiğini, tarafların hangi noktalarda anlaşmazlığa düştüğünü ve iade aşamasında nelere bakıldığını anlatıyoruz.",
      kategori: "Gayrimenkul Hukuku", durum: "planlandi", tarih: "2026-09-16",
      okumaDk: 5, kelime: 960, kapak: null, adres: "kira-sozlesmesinde-depozito-nasil-ele-alinir",
      icerik:
        "<p>Depozito, kira ilişkisinin başında konuşulup sonunda tekrar gündeme gelen bir başlıktır. Bu yazıda sözleşmede nasıl düzenlendiğini anlatıyoruz.</p>" +
        "<h2>Sözleşmede ne yazılıyor?</h2>" +
        "<p>Tutarın, saklanma biçiminin ve iade koşullarının yazılı olması, sonradan çıkan anlaşmazlıkları belirgin biçimde azaltıyor.</p>" +
        "<h2>İade aşamasında neye bakılıyor?</h2>" +
        "<p>Taşınmazın teslim alındığı andaki durumu ile bırakıldığı andaki durumun karşılaştırılması en sık başvurulan yöntemdir.</p>",
    },
    {
      id: "y-18", baslik: "İş sözleşmesi imzalarken hangi maddeler okunmalı?",
      ozet: "Sözleşmede en çok atlanan başlıkları, sonradan sorun çıkaran düzenlemeleri ve imzadan önce sorulması iyi olan soruları derledik.",
      kategori: "İş Hukuku", durum: "planlandi", tarih: "2026-09-17",
      okumaDk: 6, kelime: 1080, kapak: null, adres: "is-sozlesmesi-imzalarken-hangi-maddeler-okunmali",
      icerik:
        "<p>İş sözleşmesi, tarafların birbirine karşı konumunu belirleyen ilk belgedir. Bu yazıda imzadan önce okunması iyi olan başlıkları anlatıyoruz.</p>" +
        "<h2>En çok ne atlanıyor?</h2>" +
        "<p>Görev tanımı, çalışma yeri ve ek düzenlemeler çoğunlukla hızlıca geçilen ama sonradan en çok konuşulan maddelerdir.</p>" +
        "<h2>İmzadan önce ne sorulur?</h2>" +
        "<p>Anlaşılmayan her maddenin imzadan önce yazılı olarak açıklığa kavuşturulması, sonrasında iş yükünü azaltıyor.</p>",
    },
    {
      id: "y-19", baslik: "Mirasçılık belgesi nereden alınır, ne işe yarar?",
      ozet: "Belgenin hangi kurumdan alındığını, hangi işlemlerde istendiğini ve başvuru sırasında nelerin hazırlandığını sırasıyla anlatıyoruz.",
      kategori: "Miras Hukuku", durum: "planlandi", tarih: "2026-09-18",
      okumaDk: 5, kelime: 920, kapak: null, adres: "mirascilik-belgesi-nereden-alinir",
      icerik:
        "<p>Mirasla ilgili işlemlerin çoğunda ilk istenen belge mirasçılık belgesidir. Bu yazıda nereden alındığını ve ne işe yaradığını anlatıyoruz.</p>" +
        "<h2>Nereden alınıyor?</h2>" +
        "<p>Başvurunun yapılacağı yer, kişinin durumuna göre değişebilir. Yazıda seçenekleri karşılaştırıyoruz.</p>" +
        "<h2>Hangi işlemlerde isteniyor?</h2>" +
        "<p>Taşınmaz devri, banka işlemleri ve kurum başvuruları belgenin en sık istendiği yerlerdir.</p>",
    },
    {
      id: "y-20", baslik: "Ayıplı ürünle karşılaştığınızda izlenen yol",
      ozet: "Satıcıya başvurunun nasıl yapıldığını, hangi belgelerin saklandığını ve sürecin hangi aşamalardan geçtiğini adım adım aktarıyoruz.",
      kategori: "Tüketici Hukuku", durum: "planlandi", tarih: "2026-09-19",
      okumaDk: 5, kelime: 890, kapak: null, adres: "ayipli-urunle-karsilastiginizda-izlenen-yol",
      icerik:
        "<p>Alınan bir üründe sorun çıktığında izlenecek yol belirli bir sıra takip eder. Bu yazıda o sırayı anlatıyoruz.</p>" +
        "<h2>İlk adım ne?</h2>" +
        "<p>Satıcıya yazılı başvuru ve alışverişe ait belgelerin saklanması, sonraki adımların zeminini oluşturur.</p>" +
        "<h2>Sonrasında ne oluyor?</h2>" +
        "<p>Başvurudan sonuç alınamazsa izlenen yol değişir; yazının devamında aşamaları açıklıyoruz.</p>",
    },
    {
      id: "y-21", baslik: "Boşanma sürecinde çocukla kişisel ilişki nasıl düzenlenir?",
      ozet: "Düzenlemenin hangi başlıklar üzerinden kurulduğunu, tarafların nelere dikkat ettiğini ve uygulamada en çok neyin sorun çıkardığını anlatıyoruz.",
      kategori: "Aile Hukuku", durum: "planlandi", tarih: "2026-09-20",
      okumaDk: 6, kelime: 1110, kapak: null, adres: "cocukla-kisisel-iliski-nasil-duzenlenir",
      icerik:
        "<p>Çocukla kişisel ilişki, boşanma sürecinin en çok konuşulan başlıklarından biridir. Bu yazıda düzenlemenin nasıl kurulduğunu anlatıyoruz.</p>" +
        "<h2>Neye göre kuruluyor?</h2>" +
        "<p>Çocuğun günlük düzeni ve ihtiyaçları, düzenlemenin çerçevesini belirleyen ilk başlıktır.</p>" +
        "<h2>Uygulamada ne sorun çıkarıyor?</h2>" +
        "<p>Belirsiz yazılmış düzenlemeler, sonradan tarafların yeniden görüşmesini gerektiriyor.</p>",
    },
    {
      id: "y-22", baslik: "Elektronik yazışmalar delil olarak nasıl saklanır?",
      ozet: "Yazışmaların hangi biçimde saklandığını, bütünlüğünün nasıl korunduğunu ve sunum aşamasında nelere dikkat edildiğini anlatıyoruz.",
      kategori: "Bilişim Hukuku", durum: "planlandi", tarih: "2026-09-21",
      okumaDk: 6, kelime: 1040, kapak: null, adres: "elektronik-yazismalar-delil-olarak-nasil-saklanir",
      icerik:
        "<p>Elektronik yazışmalar birçok süreçte başvurulan kaynaklardandır. Bu yazıda nasıl saklandıklarını anlatıyoruz.</p>" +
        "<h2>Saklarken neye dikkat ediliyor?</h2>" +
        "<p>Yazışmanın tarih ve saat bilgisiyle, kesintisiz biçimde ve özgün hâliyle saklanması önemlidir.</p>" +
        "<h2>Sunarken ne isteniyor?</h2>" +
        "<p>Yazının devamında sunum aşamasında en sık istenen biçimleri derledik.</p>",
    },
    {
      id: "y-23", baslik: "Ortak mülkiyette karar almak: paydaşlar arasında süreç nasıl yürür?",
      ozet: "Paydaşların hangi konularda birlikte karar aldığını, anlaşma sağlanamadığında izlenen yolları ve sürecin nasıl ilerlediğini anlatıyoruz.",
      kategori: "Eşya Hukuku", durum: "planlandi", tarih: "2026-09-22",
      okumaDk: 6, kelime: 1070, kapak: null, adres: "ortak-mulkiyette-karar-almak",
      icerik:
        "<p>Bir taşınmaz birden fazla kişiye aitse, kararlar tek başına alınmaz. Bu yazıda sürecin nasıl yürüdüğünü anlatıyoruz.</p>" +
        "<h2>Hangi kararlar birlikte alınıyor?</h2>" +
        "<p>Kullanım, bakım ve devir konuları paydaşların birlikte konuştuğu başlıkların başında geliyor.</p>" +
        "<h2>Anlaşma sağlanamazsa</h2>" +
        "<p>Bu noktadan sonra izlenen yol değişir; yazının devamında seçenekleri açıklıyoruz.</p>",
    },
    {
      id: "y-24", baslik: "Kira sözleşmesi biterken taraflar hangi bildirimleri yapar?",
      ozet: "Sözleşme sonuna yaklaşılırken yapılan bildirimleri, bunların hangi biçimde iletildiğini ve atlandığında ne olduğunu anlatıyoruz.",
      kategori: "Gayrimenkul Hukuku", durum: "planlandi", tarih: "2026-09-23",
      okumaDk: 5, kelime: 950, kapak: null, adres: "kira-sozlesmesi-biterken-bildirimler",
      icerik:
        "<p>Kira sözleşmesinin sonuna yaklaşıldığında tarafların birbirine ilettiği bildirimler süreci belirler. Bu yazıda bunları anlatıyoruz.</p>" +
        "<h2>Bildirim nasıl yapılıyor?</h2>" +
        "<p>Bildirimin yazılı ve ulaştığı kanıtlanabilir biçimde yapılması, sonradan tartışma çıkmasını engelliyor.</p>" +
        "<h2>Atlanırsa ne oluyor?</h2>" +
        "<p>Yazının devamında, bildirim yapılmadığında tarafların hangi noktada anlaşmazlığa düştüğünü açıklıyoruz.</p>",
    },
    {
      id: "y-25", baslik: "Çalışma saatleri ve fazla mesai kayıtları nasıl tutulur?",
      ozet: "Kayıtların hangi biçimde tutulduğunu, çalışanın kendi tarafında neleri saklayabileceğini ve bunların süreçte nasıl kullanıldığını anlatıyoruz.",
      kategori: "İş Hukuku", durum: "planlandi", tarih: "2026-09-24",
      okumaDk: 6, kelime: 1030, kapak: null, adres: "calisma-saatleri-ve-fazla-mesai-kayitlari",
      icerik:
        "<p>Çalışma saatlerine ilişkin kayıtlar, iş ilişkisinde en çok başvurulan belgelerdendir. Bu yazıda nasıl tutulduklarını anlatıyoruz.</p>" +
        "<h2>Hangi kayıtlar tutuluyor?</h2>" +
        "<p>Giriş çıkış kayıtları, görev yazışmaları ve düzenli tutulan notlar en sık kullanılan kaynaklardır.</p>" +
        "<h2>Süreçte nasıl kullanılıyor?</h2>" +
        "<p>Kayıtların tarih sırasına göre düzenlenmesi, olayların akışını anlaşılır kılıyor.</p>",
    },
    {
      id: "y-26", baslik: "Miras bırakan borç bırakmışsa mirasçılar ne yapar?",
      ozet: "Mirasçıların önünde duran seçenekleri, her birinin nasıl işlediğini ve karar verirken nelere bakıldığını sade bir dille aktarıyoruz.",
      kategori: "Miras Hukuku", durum: "planlandi", tarih: "2026-09-25",
      okumaDk: 6, kelime: 1120, kapak: null, adres: "miras-birakan-borc-birakmissa",
      icerik:
        "<p>Mirasın yalnızca mal varlığından ibaret olmadığı durumlarda mirasçıların önünde birden fazla seçenek bulunur. Bu yazıda bunları anlatıyoruz.</p>" +
        "<h2>Seçenekler neler?</h2>" +
        "<p>Mirasçıların izleyebileceği yollar, mirasın durumuna göre farklılaşır. Yazıda her birini ayrı ayrı açıklıyoruz.</p>" +
        "<h2>Karar verirken neye bakılıyor?</h2>" +
        "<p>Mal varlığının ve yükümlülüklerin birlikte değerlendirilmesi, kararın temelini oluşturuyor.</p>",
    },
    {
      id: "y-27", baslik: "Boşanmada ev eşyalarının paylaşımı nasıl konuşulur?",
      ozet: "Paylaşımda hangi başlıkların konuşulduğunu, tarafların neleri belgelediğini ve anlaşmayı kolaylaştıran yöntemleri anlatıyoruz.",
      kategori: "Aile Hukuku", durum: "planlandi", tarih: "2026-09-26",
      okumaDk: 5, kelime: 970, kapak: null, adres: "bosanmada-ev-esyalarinin-paylasimi",
      icerik:
        "<p>Ev eşyalarının paylaşımı, süreçte çoğunlukla sona bırakılan ama en çok tartışma çıkaran başlıklardan biridir. Bu yazıda nasıl konuşulduğunu anlatıyoruz.</p>" +
        "<h2>Neler belgeleniyor?</h2>" +
        "<p>Alışverişe ait kayıtlar ve eşyaların ne zaman edinildiğine dair belgeler en çok başvurulan kaynaklardır.</p>" +
        "<h2>Anlaşmayı ne kolaylaştırıyor?</h2>" +
        "<p>Listenin baştan birlikte çıkarılması, sürecin belirgin biçimde kısalmasını sağlıyor.</p>",
    },
    {
      id: "y-28", baslik: "Ödeme emri elinize ulaştığında izlenecek adımlar",
      ozet: "Belgenin ulaşmasından sonra hangi adımların atıldığını, sürelerin nasıl takip edildiğini ve nelere dikkat edildiğini anlatıyoruz.",
      kategori: "İcra ve İflas Hukuku", durum: "planlandi", tarih: "2026-09-27",
      okumaDk: 6, kelime: 1060, kapak: null, adres: "odeme-emri-elinize-ulastiginda",
      icerik:
        "<p>Ödeme emri elinize ulaştığında atılacak adımlar belirli bir sıra izler. Bu yazıda o sırayı anlatıyoruz.</p>" +
        "<h2>İlk ne yapılıyor?</h2>" +
        "<p>Belgenin tarihinin ve içeriğinin dikkatle okunması, sonraki bütün adımların dayanağını oluşturur.</p>" +
        "<h2>Neye dikkat ediliyor?</h2>" +
        "<p>Yazının devamında süreçte en sık atlanan noktaları derledik.</p>",
    },
    {
      id: "y-29", baslik: "Kimlik bilgileriniz izinsiz kullanıldığında izlenecek yol",
      ozet: "Durumu fark ettikten sonra atılabilecek adımları, hangi kurumlara başvurulduğunu ve hangi kayıtların saklandığını anlatıyoruz.",
      kategori: "Bilişim Hukuku", durum: "planlandi", tarih: "2026-09-28",
      okumaDk: 6, kelime: 1010, kapak: null, adres: "kimlik-bilgileriniz-izinsiz-kullanildiginda",
      icerik:
        "<p>Kimlik bilgilerinin izinsiz kullanıldığı fark edildiğinde hızlı hareket etmek süreci kolaylaştırır. Bu yazıda izlenecek yolu anlatıyoruz.</p>" +
        "<h2>Hangi kayıtlar saklanıyor?</h2>" +
        "<p>Bildirimler, yazışmalar ve işlem dökümleri süreç boyunca en çok başvurulan belgelerdir.</p>" +
        "<h2>Başvuru nereye yapılıyor?</h2>" +
        "<p>Başvurulacak yer olayın niteliğine göre değişir; yazıda seçenekleri sıralıyoruz.</p>",
    },
    {
      id: "y-30", baslik: "Taşınmaz satışında tapu devri öncesi nelere bakılır?",
      ozet: "Devir öncesinde incelenen kayıtları, tarafların hangi belgeleri hazırladığını ve sürecin nasıl ilerlediğini anlatıyoruz.",
      kategori: "Gayrimenkul Hukuku", durum: "planlandi", tarih: "2026-09-29",
      okumaDk: 6, kelime: 1090, kapak: null, adres: "tasinmaz-satisinda-tapu-devri-oncesi",
      icerik:
        "<p>Tapu devri öncesinde yapılan inceleme, sonradan çıkabilecek sorunların büyük kısmını önler. Bu yazıda neye bakıldığını anlatıyoruz.</p>" +
        "<h2>Hangi kayıtlar inceleniyor?</h2>" +
        "<p>Taşınmaza ilişkin kayıtlar ve geçmiş işlemler ilk bakılan yerlerdir.</p>" +
        "<h2>Devir günü ne oluyor?</h2>" +
        "<p>Yazının devamında devir gününde izlenen adımları sırasıyla açıklıyoruz.</p>",
    },
    {
      id: "y-31", baslik: "Evlilik birliğinde edinilen malların kaydı nasıl tutulur?",
      ozet: "Hangi kayıtların tutulmasının işi kolaylaştırdığını, belgelerin nasıl saklandığını ve bunların sonradan nerede kullanıldığını anlatıyoruz.",
      kategori: "Aile Hukuku", durum: "planlandi", tarih: "2026-09-30",
      okumaDk: 6, kelime: 1040, kapak: null, adres: "evlilik-birliginde-edinilen-mallarin-kaydi",
      icerik:
        "<p>Evlilik süresince edinilen mallara ilişkin kayıtların düzenli tutulması, sonradan yaşanan tartışmaları belirgin biçimde azaltır. Bu yazıda nasıl tutulduğunu anlatıyoruz.</p>" +
        "<h2>Hangi belgeler saklanıyor?</h2>" +
        "<p>Alışverişe, devre ve ödemelere ilişkin belgeler en çok başvurulan kayıtlardır.</p>" +
        "<h2>Sonradan nerede kullanılıyor?</h2>" +
        "<p>Yazının devamında bu kayıtların hangi aşamalarda işe yaradığını açıklıyoruz.</p>",
    },

    /* ---------- reddedilen ---------- */
    {
      id: "y-16",
      baslik: "Şirket kuruluşunda ortaklık yapısı nasıl belirlenir?",
      ozet: "Ortaklık yapısının kurulurken hangi başlıkların konuşulduğunu ve sonradan değişiklik yapılırken nelere bakıldığını anlatıyoruz.",
      kategori: "Ticaret Hukuku",
      durum: "reddedildi",
      tarih: null,
      onayaGonderildi: "2026-09-08",
      reddedildi: "2026-09-09",
      reddetmeNedeni: "Bu konu bizim çalışma alanımızın dışında kalıyor, ticaret hukuku yazısı istemiyoruz.",
      okumaDk: 6, kelime: 1040, kapak: null,
      adres: "sirket-kurulusunda-ortaklik-yapisi",
      icerik:
        "<p>Ortaklık yapısı, şirketin kuruluş aşamasında konuşulan ilk başlıklardan biridir. Bu yazıda konunun çerçevesini çiziyoruz.</p>" +
        "<h2>Kuruluşta neler konuşuluyor?</h2>" +
        "<p>Tarafların rolleri ve katkıları, yapının nasıl kurulacağını belirleyen ana başlıklardır.</p>",
    },
  ],

  /* =======================================================================
     KONULAR — sıradaki üretim kuyruğu
     hacim / rekabet / skor yer tutucudur, gerçek araştırma verisi değildir.
     ======================================================================= */
  konular: [
    { id: "k-01", konu: "Kira sözleşmesi yenilenirken nelere dikkat edilir",        kategori: "Gayrimenkul Hukuku", hacim: 1300, rekabet: "Düşük",  skor: 92 },
    { id: "k-02", konu: "İhbar süresi içinde çalışanın hakları nelerdir",            kategori: "İş Hukuku",          hacim: 1100, rekabet: "Düşük",  skor: 90 },
    { id: "k-03", konu: "Mirasın reddi nasıl yapılır, süreç nasıl işler",            kategori: "Miras Hukuku",       hacim:  980, rekabet: "Orta",   skor: 88 },
    { id: "k-04", konu: "Boşanmada mal paylaşımı hangi başlıklar üzerinden yürür",   kategori: "Aile Hukuku",        hacim: 2400, rekabet: "Yüksek", skor: 86 },
    { id: "k-05", konu: "İcra takibine itiraz nasıl yapılır",                        kategori: "İcra ve İflas Hukuku", hacim: 870, rekabet: "Düşük", skor: 89 },
    { id: "k-06", konu: "Tüketici hakem heyetine başvuru nasıl yapılır",             kategori: "Tüketici Hukuku",    hacim: 1600, rekabet: "Orta",   skor: 87 },
    { id: "k-07", konu: "Kişisel verilerin korunmasında şirketlerin sorumlulukları", kategori: "Bilişim Hukuku",     hacim:  640, rekabet: "Düşük",  skor: 91 },
    { id: "k-08", konu: "Ev sahibi tahliye isterse hangi yollar izlenir",            kategori: "Gayrimenkul Hukuku", hacim: 1900, rekabet: "Orta",   skor: 85 },
    { id: "k-09", konu: "İş kazası sonrası izlenen adımlar",                         kategori: "İş Hukuku",          hacim: 1250, rekabet: "Orta",   skor: 88 },
    { id: "k-10", konu: "Vasiyetname nasıl iptal edilir",                            kategori: "Miras Hukuku",       hacim:  520, rekabet: "Düşük",  skor: 90 },
    { id: "k-11", konu: "Nişan bozulduğunda konuşulan başlıklar",                    kategori: "Aile Hukuku",        hacim:  410, rekabet: "Düşük",  skor: 84 },
    { id: "k-12", konu: "Sosyal medyada hakaret iddiasında izlenen yol",             kategori: "Bilişim Hukuku",     hacim:  760, rekabet: "Düşük",  skor: 89 },
    { id: "k-13", konu: "Arabuluculukta anlaşma sağlanamazsa ne olur",               kategori: "İhtiyari Arabuluculuk", hacim: 390, rekabet: "Düşük", skor: 87 },
    { id: "k-14", konu: "Kefil olmadan önce bilinmesi gerekenler",                   kategori: "Eşya Hukuku",        hacim:  680, rekabet: "Orta",   skor: 83 },
    { id: "k-15", konu: "Velayet değişikliği hangi durumlarda gündeme gelir",        kategori: "Aile Hukuku",        hacim:  900, rekabet: "Orta",   skor: 86 },
  ],

  /* =======================================================================
     MARKA PROFİLİ
     ======================================================================= */
  marka: {
    sektor: "Hukuk / Avukatlık ve Arabuluculuk",
    tonStili: "Sade, anlaşılır, güven veren; hukuku gündelik dile çeviren",
    markaKisiligi: "Bilgilendiren, koruyucu, kalıcı çözüm arayan",
    birincilKitle:
      "Hukuki hakkını öğrenmek isteyen genel halk — boşanma, nafaka, velayet yaşayanlar; işçiler; mirasçılar; kiracı ve ev sahipleri; borç ve tüketici sorunu yaşayanlar",
    ikincilKitle: "Bölgesinde avukat veya arabulucu arayan bireyler",
    anahtarKelimeler: {
      birincil: "arabuluculuk, miras hukuku, iş hukuku",
      ikincil: "icra takibi, velayet davası, kıdem tazminatı",
      uzunKuyruk:
        "arabuluculuk süreci nasıl işler, mirasın reddi nasıl yapılır, kira sözleşmesi yenilenirken nelere dikkat edilir",
    },
    hizmetler:
      "Aile Hukuku, İş Hukuku, Miras Hukuku, Ceza Hukuku, İcra ve İflas Hukuku, İhtiyari Arabuluculuk, Bilişim Hukuku, Eşya ve Kişiler Hukuku",
    rakipler:
      "Bölgedeki aile ve iş hukuku odaklı avukatlık büroları, arabuluculuk ofisleri, butik hukuk ve danışmanlık büroları",
    yasakli:
      "Belirli bir davanın kesin sonucunu vaat etme, kişi/kurum hedef gösterme, rakip büro adı, siyasi yorum, müvekkil yorumu, başarı oranı",
    renkler: { ana: "#1B2A4A", ikincil: "#C9A227" },
  },

  /* =======================================================================
     DESTEK
     ======================================================================= */
  destek: {
    talepler: [],
    iletisim: { eposta: "destek@dolunay.ai" },
    baglantiDurumu: "Bağlantınız tamam. Yazılar sitenize otomatik yükleniyor.",
  },

  odemeGecmisi: [],
};
