// GEO icerik bloklari (F10, seo_geo/GEO_ICERIK_TASLAK.md - Dolunay'in 2026-09-18
// onayi). Metin BIRE BIR onaylanan taslaktan alindi, yeniden yazilmadi.
// Bilerek TR-only: i18n cografyasinin (tr.json/en.json) DISINDA tutuluyor
// cunku bu bloklarin Ingilizce cevirisi yok ve useTranslation()'in TR'ye
// dusen fallback'i EN sayfada Turkce metin sizdirir. Bu yuzden sayfalarda
// yalniz `language === 'tr'` iken render edilir, hic t() uzerinden okunmaz.
//
// /cozumler "AI otomasyon kurmak ne kadar surer?" blogundaki sadece su cumle
// BILEREK atlandi (Dolunay'in ortalama teslim suresi henuz onda yok):
// "Benim ortalama teslim surem <Dolunay'in ortalama teslim suresi buraya
// eklenecek>." Blogun geri kalani aynen duruyor.

export interface GeoBlock {
  title: string
  paragraphs: string[]
  source?: string
}

export const aiFactoryGeoBlocks: GeoBlock[] = [
  {
    title: "Yapay zeka ile freelance ya da yan gelir elde etmek gerçekten mümkün mü?",
    paragraphs: [
      "Evet, çünkü AI Factory'de öğrettiğim sistemler gerçek müşterilere kurduğum otomasyonların aynısı. AI Factory, benim kurduğum otomasyonları adım adım öğrettiğim bir Skool topluluğu. İçeride soyut bir bot senaryosu yok, para kazandırmış bir kurulum var. Üye aynı sistemi görür, Claude Code ile kendi diliyle başka bir işletmeye kurar ve satar. Yani öğrenilen şey ders değil, elinde çalışan bir örnek.",
      "Örnekler somut. Bir otelde kurduğum WhatsApp botu rezervasyon sorularını insansız cevaplıyor, karmaşık soruyu resepsiyona yönlendiriyor. Aynı mantık Instagram yorumlarına gelen mesajlarda da çalışıyor, yorum yazan kişiye otomatik DM gidiyor. Bir e-ticaret firmasında stok azalınca sistem otomatik uyarı gönderiyor, elle takip artık gerekmiyor. Bir klinikte randevu hatırlatması otomatik gidiyor, resepsiyon aramıyor. Başka bir firmada haftalık satış raporu elle toplanmak yerine otomatik derlenip ekibe gönderiliyor. Beşi de AI Factory içinde adım adım kurulu duruyor, üye kopyalayıp kendi müşterisine uygulayabiliyor.",
      "Bu deseni büyük ölçekte de görüyoruz. Upwork'ün Temmuz 2026 Future Workforce Index raporu bunu doğruluyor. Yapay zeka kullanan freelancerlar saatlik yüzde 34 daha fazla kazanıyor. Karmaşık işlerde yıllık gelir artışı yüzde 45'e çıkıyor. Kazanan, tek görev yapan değil, sistemi kurup tekrar satan kişi.",
      "AI Factory'nin 400'den fazla üyesi var, aylık 39 dolar. Üye topluluğa girince teoriyle değil, üstünde çalışılabilir gerçek bir kurulumla başlıyor. Takıldığı noktayı sorduğunda cevabı aynı gün topluluktan alıyor.",
    ],
    source: "Kaynak: Upwork, Temmuz 2026.",
  },
  {
    title: "Yapay zeka otomasyonu alanında en çok talep gören iş türleri hangileri?",
    paragraphs: [
      "Benim müşterilerimden gördüğüm talep dört alanda yoğunlaşıyor. Müşteri mesajlarına otomatik cevap, stok takibi, raporlama, randevu takibi. Bunlardan hiçbiri yeni bir yazılım yazmayı gerektirmiyor, var olan bir işe otomasyon eklemeyi gerektiriyor. AI Factory'de öğretilen de tam olarak bu dört sistemin kurulumu.",
      "En çok talep gelen iş, müşteri mesajlarına cevap. Bir otelde kurduğum WhatsApp botu rezervasyon sorularını insansız cevaplıyor, karmaşık soruları resepsiyona yönlendiriyor. İkinci sırada stok takibi geliyor, ürün azalınca sistem otomatik uyarı gönderiyor. Üçüncü sırada raporlama var, haftalık satış verisi elle değil otomatik derleniyor. Dördüncüsü randevu takibi, yeni kayıt geldiğinde hatırlatma otomatik gidiyor. Bu dört sistem AI Factory içinde adım adım kurulu, üye kopyalayıp uygulayabiliyor.",
      "Bu talep artışı geniş veride de görülüyor. Upwork'ün 2026 raporuna göre üretken yapay zeka içerikli sözleşmeler yıllık yüzde 90 arttı. Kendi uzmanlığına yapay zekayı ekleyen profesyonel hizmetler yüzde 72 hacim artışı gösterdi. Yani en aranan kişi sadece yapay zeka bilen değil, kendi işine uygulayabilen kişi.",
      "Bu yüzden AI Factory'de öğretilen şey tek bir araç değil. Öğretilen, bir işletmenin hangi sürecinin otomasyona uygun olduğunu görmek ve doğru aracı seçmek. Örneğin bir muhasebe bürosunda önce hangi rapor sürecinin tekrar ettiğini tespit ediyoruz. Sonra ona uygun otomasyonu kuruyoruz. Üye bunu bir kez öğrenince başka bir işletmeye de uygulayabiliyor.",
    ],
    source: "Kaynak: Upwork, 2026 raporu.",
  },
  {
    title: "Kod bilmeden yapay zeka otomasyonu kurulabilir mi?",
    paragraphs: [
      "Evet, ben de kurduğum sistemlerin hiçbirini elle kod yazarak kurmuyorum. Claude Code'a ne istediğimi anlatıyorum, kurulumu o yapıyor. Stok takibi kurarken de aynı yöntemi kullanıyorum, hangi ürün azalınca kimin uyarılacağını yazıyla tarif ediyorum. AI Factory'de öğrettiğim yöntem de bu, öğrenci yazılımcı olmadan aynı işi yapabiliyor. Bu yöntem yazılım bilmeyen birine de aynı hızda çalışıyor.",
      "Örnek somut. Bir WhatsApp botu kurarken hangi mesaja hangi cevabın gideceğini Claude Code'a yazıyla anlatıyorum. Bağlantıyı kuruyor, test ediyor, hata varsa düzeltiyor. Yanlış bir cevap giderse hangi mesajın neden yanlış gittiğini birlikte inceliyoruz. Düzeltmeyi yine yazıyla yapıyorum. Ben sadece ne istediğimi net söylüyorum, teknik detayı araç hallediyor.",
      "Zorluk kod yazmakta değil, doğru sırayı bilmekte. Hangi adımın önce geldiğini, hangi aracın hangi işi yaptığını bilmek asıl beceri. AI Factory içinde bu sıra zaten kurulu duruyor. Üye sıfırdan denemiyor, kurulu örneği kendi işine uyarlıyor. Bu da AI Factory'nin asıl değeri, doğru sırayı sıfırdan aramak yerine hazır bulmak.",
      "Bu da öğrenme süresini kısaltıyor. Sıfırdan deneyen kişi hatanın nerede olduğunu bulmakta günler harcayabiliyor. Kurulu bir örnekten başlayan kişi aynı hatayı zaten görmüş oluyor. Topluluk içinde aynı soruyu soran biri çoktan cevabı almış oluyor. Bu paylaşım, aynı hatada günlerce takılı kalmayı önlüyor. Bu yüzden bir sistemi ikinci kez kuran kişi, ilkinden çok daha hızlı ilerliyor.",
    ],
  },
]

export const cozumlerGeoBlocks: GeoBlock[] = [
  {
    title: "AI otomasyon kurmak ne kadar sürer?",
    paragraphs: [
      "Tek bir iş akışını kurmak birkaç haftada bitiyor. WhatsApp'a otomatik cevap veren bir bot ya da stok uyarısı tek başına küçük bir proje. Instagram ve WhatsApp'ı tek panelden yöneten bir sistem de benzer bir sürede tamamlanıyor. Birden fazla sistemi birbirine bağlayan işler daha uzun sürüyor. Stok takibini raporlamayla ve satın almayla tek sistemde birleştirmek buna örnek.",
      "Süreci dört adımda yürütüyorum. Önce mevcut iş akışını birlikte inceliyoruz, hangi adım tekrar ediyor ve zaman yiyor onu buluyoruz. Sonra hangi aracın hangi işi yapacağına karar veriyorum. Sistemi kurup test ediyorum, son olarak ekibe nasıl kullanılacağını gösteriyorum. Teslimden sonra sistem kendi başına çalışıyor.",
      "Süreyi en çok uzatan şey belirsiz kapsam. Hangi verinin nereden geleceği ilk görüşmede netleşmezse entegrasyon zaman alıyor. Eski bir programın API'si yoksa alternatif bir bağlantı kurmak gerekiyor, bu ek gün demek. Kullandığın program bulut tabanlı değilse veriyi çekmek için ek bir adım gerekiyor. Bu yüzden ilk görüşmede mevcut araçları birlikte gözden geçiriyorum.",
      "Kurulumdan sonra da yanında kalıyorum. Kullandığın araç güncellenince ya da iş süreci değişince sistemi ben güncelliyorum. Bu bakım genelde küçük dokunuşlar, yeni bir kural eklemek ya da mesaj şablonunu güncellemek gibi. Küçük bir otomasyon birkaç günde denenip erken sonuç veriyor. Bu da büyük projeye geçme kararını kolaylaştırıyor.",
    ],
  },
  {
    title: "Hangi iş süreçleri yapay zeka ile otomatikleştirilebilir?",
    paragraphs: [
      "Kendi kurduğum sistemlerde dört alan öne çıkıyor. Müşteri mesajlarına cevap, stok takibi, raporlama, randevu takibi. Müşteri mesajlarına cevap alanı hem WhatsApp'ı hem Instagram yorumlarını kapsıyor, ikisi de aynı sistemin parçası. Bir otelde WhatsApp botu rezervasyon sorularını insansız cevaplıyor. Bir e-ticaret firmasında stok azalınca sistem otomatik uyarı gönderiyor. Bir klinikte randevu hatırlatması otomatik gidiyor, raporlama tarafında haftalık satış verisi elle değil otomatik derleniyor. Dördü de gerçek müşterilerde kurulu ve çalışıyor.",
      "Bu dördünün ortak noktası var. Süreç tekrar ediyor, kurallar nettir, veri kaynağı bellidir. Karar gerektiren ve ilişki kuran işler bunun dışında kalıyor. Müşteriyle pazarlık yapmak ya da şikayeti çözmek insanda kalıyor, bot sadece ilk cevabı veriyor. Bu netlik müşteriye de güven veriyor, ne zaman botla ne zaman insanla konuştuğunu biliyor.",
      "Bu deseni geniş veride de görüyoruz. McKinsey Global Institute'un Kasım 2025 raporu bunu doğruluyor. ABD'deki iş saatlerinin yüzde 57'si bugünkü teknolojiyle otomatikleştirilebilir potansiyele sahip. Rapor hangi meslek biteceğini değil, hangi görev devredilebilir onu söylüyor. Bu bizim işimizde de doğrulanıyor, otomatikleştirdiğimiz görevler hep tekrar eden ve kural bazlı olanlar.",
      "Bir süreci otomasyona uygun görmenin kısa yolu var. Tekrar ediyorsa, kuralı netse ve veri kaynağı belliyse uygundur. Karar her seferinde değişiyorsa, süreç şimdilik insanda kalmalı. Bu kısa yolu ilk görüşmede birlikte uyguluyoruz, hangi süreçten başlanacağı oradan çıkıyor.",
    ],
    source: "Kaynak: McKinsey Global Institute, Kasım 2025.",
  },
  {
    title: "Yeni otomasyon mevcut sistemlerimle nasıl entegre olur?",
    paragraphs: [
      "Otomasyonu sıfırdan ayrı bir sistem olarak kurmuyorum, elindeki altyapının üzerine bağlıyorum. WhatsApp Business hesabın, stok programın ya da CRM'in varsa oraya bağlanıyoruz. Instagram hesabın varsa yorumlara gelen mesajlar da aynı sisteme bağlanıyor, ayrı bir panel açılmıyor. Veri iki ayrı yerde tutulmuyor, tek kaynaktan okunuyor. Bu yaklaşım kurulum süresini de kısaltıyor, sıfırdan başlamak gerekmiyor.",
      "Bir e-ticaret firmasında zaten kullanılan bir stok programı vardı. Sıfırdan yeni bir ekran açmadık, o programın verisine bağlanan bir katman kurduk. Azalan ürün artık kendi ekranından değil, otomatik uyarıyla görünür oldu. Bir otelde de aynı mantık işledi, WhatsApp botu mevcut numaraya bağlandı, yeni hat açılmadı. Bir klinikte de mevcut randevu defteri değişmedi, otomasyon sadece hatırlatma mesajını üstüne ekledi.",
      "Her sistemin dışa açık bir bağlantısı olmayabilir. Eski bir program API vermiyorsa alternatif bir yol kuruyoruz, bu ek zaman demek. Böyle durumda süreç birkaç gün uzuyor ama sistemin kendisi değişmiyor, sadece bağlantı yöntemi değişiyor. Bu yüzden ilk görüşmede hangi programları kullandığını soruyorum, entegrasyon noktalarını baştan görüyoruz. Bu yüzden hangi programı kullandığını en başta netleştirmek zaman kazandırıyor.",
      "Bu yüzden ilk adım her zaman aynı. Elindeki sistemleri birlikte listeliyoruz, hangi süreçten başlanacağına oradan karar veriyoruz. Bu, yeni bir şey öğrenmeni gerektirmiyor, mevcut alışkanlığın üstüne kuruyoruz. Yeni bir arayüz öğrenmek yerine, zaten bildiğin ekrana bir uyarı ya da mesaj ekleniyor.",
    ],
  },
  {
    title: "Otomasyon 2030'a kadar şirketleri nasıl değiştirecek?",
    paragraphs: [
      "Kendi müşterilerimde gördüğüm değişim şu. Küçük bir işletme artık büyük bir yazılım ekibi olmadan aynı hızı yakalıyor. Bir otelde resepsiyon, gece gelen rezervasyon sorularıyla artık tek tek uğraşmıyor. Bir e-ticaret firmasında stok kontrolü artık kimsenin günlük işi değil, sistem kendi kendine uyarıyor. Bir klinikte de randevu takibi tek bir kişiye kalmıyor, sistem hatırlatmayı kendi gönderiyor. Üçü de aynı prensiple çalışıyor, tekrar eden işi sistem devralıyor, insan kararı elinde tutuyor.",
      "Bu değişim rastgele değil. Dünya Ekonomik Forumu Ocak 2025'te Future of Jobs raporunu yayınladı. İşverenlerin yüzde 58'i otomasyonun işletmelerini 2030'a kadar dönüştüreceğini bekliyor. Bu beklenti sadece büyük şirketler için değil, küçük işletmeler de aynı listede. Bu oran otomasyonun artık deneysel değil, iş stratejisinin parçası olduğunu gösteriyor.",
      "Erken başlayan fark yaratıyor. Bir süreci otomatikleştiren firma daha hızlı cevap veriyor, daha ucuza çalışıyor. Bu farkı en çok müşteriye cevap verme hızında görüyorum. Dakikalar içinde gelen cevap, saatler süren beklemeyi geride bırakıyor. Geç kalan firma ise rakibin oturttuğu standarda yetişmeye çalışıyor. Bu fark zamanla kapanması zor bir farka dönüşüyor.",
      "Ben bu yüzden büyük bir dönüşümle başlamıyorum. Küçük bir süreçle başlıyorum, sonucu birlikte görüyoruz, sonra genişletiyoruz. Bu yöntemi kendi işimde de uyguluyorum, önce tek bir müşteride deniyorum, sonra yaygınlaştırıyorum. Bu, riski düşük tutan ve ekibin yeni sisteme alışmasını kolaylaştıran bir yöntem.",
    ],
    source: "Kaynak: World Economic Forum, Ocak 2025.",
  },
]
