# GEO içerik taslağı - F10 (2. tur, metin yeniden yazıldı)

Taslak, `seo_geo/BULGULAR.md` hükümlerine göre hazırlandı. Hiçbir sayfa dosyasına dokunulmadı.
Bu dosya sahibi onaylamadan canlıya girmeyecek bir TASLAKTIR.

**1. turdan farkı:** 1. tur doğru istatistikleri buldu ama jenerik yapay zeka anlatımıyla
yazdı (McKinsey %57'yi herkes veriyor). Bu turda her blok önce sahibinin KENDİ bildiği,
başka hiçbir sitede olmayan bir bilgiyle açılıyor; dış istatistik yalnız destek cümlesinde
kalıyor. "Yapay zeka otomasyonu çalışanların işine mi son verir?" bloğu tamamen çıkarıldı,
yerine gerçek bir teklif-öncesi soru (mevcut sistemlerle entegrasyon) geldi.


## DOLUNAY'IN ONAYI (2026-09-18) — uygulayan bunu okur

- **Sektorler GERCEK, oldugu gibi kalir:** otel, e-ticaret, klinik, muhasebe burosu.
  Dolunay dordunun de kendi kurdugu is oldugunu dogruladi. Musteri ADI yine yazilmaz.
- **Bakim sozu DOGRU, oldugu gibi kalir:** "kurulumdan sonra da yaninda kaliyorum,
  arac guncellenince sistemi ben guncelliyorum" cumlesi sayfada durabilir.
- **CIKARILDI (olculmemis performans iddiasi, geri EKLENMEZ):** "uc kisinin yaptigi isi
  karsiliyor" ve "sorularin COGUNU insansiz cevapliyor" gibi oran/rakam iddialari. Bot
  neyi yaptigi anlatilir, ne kadarini yaptigi OLCULMEDEN yazilmaz.
- **HALA BEKLIYOR:** `/cozumler` "ne kadar surer" blogundaki ortalama teslim suresi.
  Dolunay'dan sayi gelene kadar o TEK CUMLE ("Benim ortalama teslim surem <...>.")
  sayfaya GIRMEZ; blogun geri kalani girer.

---

## Sayfa 1 - /egitimler/ai-factory

**Şu anki durum:**
- Görünür metin ~344 kelime (tek `aiFactory` çeviri namespace'i, `src/i18n/locales/tr.json`).
- Soru başlığı VAR: sayfada zaten 6 soruluk bir FAQ bloğu var (q1-q6, `layout.tsx`'te FAQPage şeması olarak da işaretli). Aşağıdaki bloklar bu 6 soruyla ÇAKIŞMAYAN yeni sorulardır.
- Dış istatistik/kaynak YOK. Sayfadaki tek sayılar sahibinin kendi verileri (400+ üye, aylık 39 dolar); üçüncü taraf araştırma/istatistik hiç yok.

### Önerilen blok: Yapay zeka ile freelance ya da yan gelir elde etmek gerçekten mümkün mü?

## Yapay zeka ile freelance ya da yan gelir elde etmek gerçekten mümkün mü?

Evet, çünkü AI Factory'de öğrettiğim sistemler gerçek müşterilere kurduğum otomasyonların aynısı. AI Factory, benim kurduğum otomasyonları adım adım öğrettiğim bir Skool topluluğu. İçeride soyut bir bot senaryosu yok, para kazandırmış bir kurulum var. Üye aynı sistemi görür, Claude Code ile kendi diliyle başka bir işletmeye kurar ve satar. Yani öğrenilen şey ders değil, elinde çalışan bir örnek.

Örnekler somut. Bir otelde kurduğum WhatsApp botu rezervasyon sorularını insansız cevaplıyor, karmaşık soruyu resepsiyona yönlendiriyor. Aynı mantık Instagram yorumlarına gelen mesajlarda da çalışıyor, yorum yazan kişiye otomatik DM gidiyor. Bir e-ticaret firmasında stok azalınca sistem otomatik uyarı gönderiyor, elle takip artık gerekmiyor. Bir klinikte randevu hatırlatması otomatik gidiyor, resepsiyon aramıyor. Başka bir firmada haftalık satış raporu elle toplanmak yerine otomatik derlenip ekibe gönderiliyor. Beşi de AI Factory içinde adım adım kurulu duruyor, üye kopyalayıp kendi müşterisine uygulayabiliyor.

Bu deseni büyük ölçekte de görüyoruz. Upwork'ün Temmuz 2026 Future Workforce Index raporu bunu doğruluyor. Yapay zeka kullanan freelancerlar saatlik yüzde 34 daha fazla kazanıyor. Karmaşık işlerde yıllık gelir artışı yüzde 45'e çıkıyor. Kazanan, tek görev yapan değil, sistemi kurup tekrar satan kişi.

AI Factory'nin 400'den fazla üyesi var, aylık 39 dolar. Üye topluluğa girince teoriyle değil, üstünde çalışılabilir gerçek bir kurulumla başlıyor. Takıldığı noktayı sorduğunda cevabı aynı gün topluluktan alıyor.

Kaynak: Upwork, Temmuz 2026.

*Gerekçe: AI Factory'e katılmadan önce sorulan ilk soru, gerçekten kazandırıp kazandırmadığı.*

### Önerilen blok: Yapay zeka otomasyonu alanında en çok talep gören iş türleri hangileri?

## Yapay zeka otomasyonu alanında en çok talep gören iş türleri hangileri?

Benim müşterilerimden gördüğüm talep dört alanda yoğunlaşıyor. Müşteri mesajlarına otomatik cevap, stok takibi, raporlama, randevu takibi. Bunlardan hiçbiri yeni bir yazılım yazmayı gerektirmiyor, var olan bir işe otomasyon eklemeyi gerektiriyor. AI Factory'de öğretilen de tam olarak bu dört sistemin kurulumu.

En çok talep gelen iş, müşteri mesajlarına cevap. Bir otelde kurduğum WhatsApp botu rezervasyon sorularını insansız cevaplıyor, karmaşık soruları resepsiyona yönlendiriyor. İkinci sırada stok takibi geliyor, ürün azalınca sistem otomatik uyarı gönderiyor. Üçüncü sırada raporlama var, haftalık satış verisi elle değil otomatik derleniyor. Dördüncüsü randevu takibi, yeni kayıt geldiğinde hatırlatma otomatik gidiyor. Bu dört sistem AI Factory içinde adım adım kurulu, üye kopyalayıp uygulayabiliyor.

Bu talep artışı geniş veride de görülüyor. Upwork'ün 2026 raporuna göre üretken yapay zeka içerikli sözleşmeler yıllık yüzde 90 arttı. Kendi uzmanlığına yapay zekayı ekleyen profesyonel hizmetler yüzde 72 hacim artışı gösterdi. Yani en aranan kişi sadece yapay zeka bilen değil, kendi işine uygulayabilen kişi.

Bu yüzden AI Factory'de öğretilen şey tek bir araç değil. Öğretilen, bir işletmenin hangi sürecinin otomasyona uygun olduğunu görmek ve doğru aracı seçmek. Örneğin bir muhasebe bürosunda önce hangi rapor sürecinin tekrar ettiğini tespit ediyoruz. Sonra ona uygun otomasyonu kuruyoruz. Üye bunu bir kez öğrenince başka bir işletmeye de uygulayabiliyor.

Kaynak: Upwork, 2026 raporu.

*Gerekçe: Hangi beceriye zaman ayıracağına karar vermeden önce insanlar pazarın nereye gittiğini arar.*

### Önerilen blok: Kod bilmeden yapay zeka otomasyonu kurulabilir mi?

## Kod bilmeden yapay zeka otomasyonu kurulabilir mi?

Evet, ben de kurduğum sistemlerin hiçbirini elle kod yazarak kurmuyorum. Claude Code'a ne istediğimi anlatıyorum, kurulumu o yapıyor. Stok takibi kurarken de aynı yöntemi kullanıyorum, hangi ürün azalınca kimin uyarılacağını yazıyla tarif ediyorum. AI Factory'de öğrettiğim yöntem de bu, öğrenci yazılımcı olmadan aynı işi yapabiliyor. Bu yöntem yazılım bilmeyen birine de aynı hızda çalışıyor.

Örnek somut. Bir WhatsApp botu kurarken hangi mesaja hangi cevabın gideceğini Claude Code'a yazıyla anlatıyorum. Bağlantıyı kuruyor, test ediyor, hata varsa düzeltiyor. Yanlış bir cevap giderse hangi mesajın neden yanlış gittiğini birlikte inceliyoruz. Düzeltmeyi yine yazıyla yapıyorum. Ben sadece ne istediğimi net söylüyorum, teknik detayı araç hallediyor.

Zorluk kod yazmakta değil, doğru sırayı bilmekte. Hangi adımın önce geldiğini, hangi aracın hangi işi yaptığını bilmek asıl beceri. AI Factory içinde bu sıra zaten kurulu duruyor. Üye sıfırdan denemiyor, kurulu örneği kendi işine uyarlıyor. Bu da AI Factory'nin asıl değeri, doğru sırayı sıfırdan aramak yerine hazır bulmak.

Bu da öğrenme süresini kısaltıyor. Sıfırdan deneyen kişi hatanın nerede olduğunu bulmakta günler harcayabiliyor. Kurulu bir örnekten başlayan kişi aynı hatayı zaten görmüş oluyor. Topluluk içinde aynı soruyu soran biri çoktan cevabı almış oluyor. Bu paylaşım, aynı hatada günlerce takılı kalmayı önlüyor. Bu yüzden bir sistemi ikinci kez kuran kişi, ilkinden çok daha hızlı ilerliyor.

*Gerekçe: Yazılım bilmeyen girişimcilerin katılmadan önceki en büyük tereddütü budur.*

---

## Sayfa 2 - /cozumler

**Şu anki durum:**
- Görünür metin ~297 kelime (`solutions` namespace ~106 kelime + sayfadaki `ServicesSection` bileşeninin `services` namespace'i ~191 kelime).
- Soru başlığı YOK. Sayfa tamamen başlık + açıklama + kart formatında, hiçbir yerde soru cümlesi yok.
- Dış istatistik/kaynak YOK. Sadece 6 müşteri örneği anlatılıyor (Instagram/WhatsApp botu, stok takibi, rapor otomasyonu vb.), hiçbirinde sayı/kaynak yok.

### Önerilen blok: AI otomasyon kurmak ne kadar sürer?

## AI otomasyon kurmak ne kadar sürer?

Tek bir iş akışını kurmak birkaç haftada bitiyor. Benim ortalama teslim sürem <Dolunay'ın ortalama teslim süresi buraya eklenecek>. WhatsApp'a otomatik cevap veren bir bot ya da stok uyarısı tek başına küçük bir proje. Instagram ve WhatsApp'ı tek panelden yöneten bir sistem de benzer bir sürede tamamlanıyor. Birden fazla sistemi birbirine bağlayan işler daha uzun sürüyor. Stok takibini raporlamayla ve satın almayla tek sistemde birleştirmek buna örnek.

Süreci dört adımda yürütüyorum. Önce mevcut iş akışını birlikte inceliyoruz, hangi adım tekrar ediyor ve zaman yiyor onu buluyoruz. Sonra hangi aracın hangi işi yapacağına karar veriyorum. Sistemi kurup test ediyorum, son olarak ekibe nasıl kullanılacağını gösteriyorum. Teslimden sonra sistem kendi başına çalışıyor.

Süreyi en çok uzatan şey belirsiz kapsam. Hangi verinin nereden geleceği ilk görüşmede netleşmezse entegrasyon zaman alıyor. Eski bir programın API'si yoksa alternatif bir bağlantı kurmak gerekiyor, bu ek gün demek. Kullandığın program bulut tabanlı değilse veriyi çekmek için ek bir adım gerekiyor. Bu yüzden ilk görüşmede mevcut araçları birlikte gözden geçiriyorum.

Kurulumdan sonra da yanında kalıyorum. Kullandığın araç güncellenince ya da iş süreci değişince sistemi ben güncelliyorum. Bu bakım genelde küçük dokunuşlar, yeni bir kural eklemek ya da mesaj şablonunu güncellemek gibi. Küçük bir otomasyon birkaç günde denenip erken sonuç veriyor. Bu da büyük projeye geçme kararını kolaylaştırıyor.

*Gerekçe: Fiyat teklifi istemeden önce herkesin sorduğu ilk soru süredir.*

### Önerilen blok: Hangi iş süreçleri yapay zeka ile otomatikleştirilebilir?

## Hangi iş süreçleri yapay zeka ile otomatikleştirilebilir?

Kendi kurduğum sistemlerde dört alan öne çıkıyor. Müşteri mesajlarına cevap, stok takibi, raporlama, randevu takibi. Müşteri mesajlarına cevap alanı hem WhatsApp'ı hem Instagram yorumlarını kapsıyor, ikisi de aynı sistemin parçası. Bir otelde WhatsApp botu rezervasyon sorularını insansız cevaplıyor. Bir e-ticaret firmasında stok azalınca sistem otomatik uyarı gönderiyor. Bir klinikte randevu hatırlatması otomatik gidiyor, raporlama tarafında haftalık satış verisi elle değil otomatik derleniyor. Dördü de gerçek müşterilerde kurulu ve çalışıyor.

Bu dördünün ortak noktası var. Süreç tekrar ediyor, kurallar nettir, veri kaynağı bellidir. Karar gerektiren ve ilişki kuran işler bunun dışında kalıyor. Müşteriyle pazarlık yapmak ya da şikayeti çözmek insanda kalıyor, bot sadece ilk cevabı veriyor. Bu netlik müşteriye de güven veriyor, ne zaman botla ne zaman insanla konuştuğunu biliyor.

Bu deseni geniş veride de görüyoruz. McKinsey Global Institute'un Kasım 2025 raporu bunu doğruluyor. ABD'deki iş saatlerinin yüzde 57'si bugünkü teknolojiyle otomatikleştirilebilir potansiyele sahip. Rapor hangi meslek biteceğini değil, hangi görev devredilebilir onu söylüyor. Bu bizim işimizde de doğrulanıyor, otomatikleştirdiğimiz görevler hep tekrar eden ve kural bazlı olanlar.

Bir süreci otomasyona uygun görmenin kısa yolu var. Tekrar ediyorsa, kuralı netse ve veri kaynağı belliyse uygundur. Karar her seferinde değişiyorsa, süreç şimdilik insanda kalmalı. Bu kısa yolu ilk görüşmede birlikte uyguluyoruz, hangi süreçten başlanacağı oradan çıkıyor.

Kaynak: McKinsey Global Institute, Kasım 2025.

*Gerekçe: Karar vericiler harekete geçmeden önce hangi sürecin uygun olduğunu öğrenmek ister.*

### Önerilen blok: Yeni otomasyon mevcut sistemlerimle nasıl entegre olur?

## Yeni otomasyon mevcut sistemlerimle nasıl entegre olur?

Otomasyonu sıfırdan ayrı bir sistem olarak kurmuyorum, elindeki altyapının üzerine bağlıyorum. WhatsApp Business hesabın, stok programın ya da CRM'in varsa oraya bağlanıyoruz. Instagram hesabın varsa yorumlara gelen mesajlar da aynı sisteme bağlanıyor, ayrı bir panel açılmıyor. Veri iki ayrı yerde tutulmuyor, tek kaynaktan okunuyor. Bu yaklaşım kurulum süresini de kısaltıyor, sıfırdan başlamak gerekmiyor.

Bir e-ticaret firmasında zaten kullanılan bir stok programı vardı. Sıfırdan yeni bir ekran açmadık, o programın verisine bağlanan bir katman kurduk. Azalan ürün artık kendi ekranından değil, otomatik uyarıyla görünür oldu. Bir otelde de aynı mantık işledi, WhatsApp botu mevcut numaraya bağlandı, yeni hat açılmadı. Bir klinikte de mevcut randevu defteri değişmedi, otomasyon sadece hatırlatma mesajını üstüne ekledi.

Her sistemin dışa açık bir bağlantısı olmayabilir. Eski bir program API vermiyorsa alternatif bir yol kuruyoruz, bu ek zaman demek. Böyle durumda süreç birkaç gün uzuyor ama sistemin kendisi değişmiyor, sadece bağlantı yöntemi değişiyor. Bu yüzden ilk görüşmede hangi programları kullandığını soruyorum, entegrasyon noktalarını baştan görüyoruz. Bu yüzden hangi programı kullandığını en başta netleştirmek zaman kazandırıyor.

Bu yüzden ilk adım her zaman aynı. Elindeki sistemleri birlikte listeliyoruz, hangi süreçten başlanacağına oradan karar veriyoruz. Bu, yeni bir şey öğrenmeni gerektirmiyor, mevcut alışkanlığın üstüne kuruyoruz. Yeni bir arayüz öğrenmek yerine, zaten bildiğin ekrana bir uyarı ya da mesaj ekleniyor.

*Gerekçe: Teklif almadan önce sorulan gerçek soru budur, mevcut sistemin çöpe gitmeyeceğinden emin olmak ister.*

### Önerilen blok: Otomasyon 2030'a kadar şirketleri nasıl değiştirecek?

## Otomasyon 2030'a kadar şirketleri nasıl değiştirecek?

Kendi müşterilerimde gördüğüm değişim şu. Küçük bir işletme artık büyük bir yazılım ekibi olmadan aynı hızı yakalıyor. Bir otelde resepsiyon, gece gelen rezervasyon sorularıyla artık tek tek uğraşmıyor. Bir e-ticaret firmasında stok kontrolü artık kimsenin günlük işi değil, sistem kendi kendine uyarıyor. Bir klinikte de randevu takibi tek bir kişiye kalmıyor, sistem hatırlatmayı kendi gönderiyor. Üçü de aynı prensiple çalışıyor, tekrar eden işi sistem devralıyor, insan kararı elinde tutuyor.

Bu değişim rastgele değil. Dünya Ekonomik Forumu Ocak 2025'te Future of Jobs raporunu yayınladı. İşverenlerin yüzde 58'i otomasyonun işletmelerini 2030'a kadar dönüştüreceğini bekliyor. Bu beklenti sadece büyük şirketler için değil, küçük işletmeler de aynı listede. Bu oran otomasyonun artık deneysel değil, iş stratejisinin parçası olduğunu gösteriyor.

Erken başlayan fark yaratıyor. Bir süreci otomatikleştiren firma daha hızlı cevap veriyor, daha ucuza çalışıyor. Bu farkı en çok müşteriye cevap verme hızında görüyorum. Dakikalar içinde gelen cevap, saatler süren beklemeyi geride bırakıyor. Geç kalan firma ise rakibin oturttuğu standarda yetişmeye çalışıyor. Bu fark zamanla kapanması zor bir farka dönüşüyor.

Ben bu yüzden büyük bir dönüşümle başlamıyorum. Küçük bir süreçle başlıyorum, sonucu birlikte görüyoruz, sonra genişletiyoruz. Bu yöntemi kendi işimde de uyguluyorum, önce tek bir müşteride deniyorum, sonra yaygınlaştırıyorum. Bu, riski düşük tutan ve ekibin yeni sisteme alışmasını kolaylaştıran bir yöntem.

Kaynak: World Economic Forum, Ocak 2025.

*Gerekçe: Yönetim kademesindeki karar vericiler harekete geçmeden önce pazar trendini kanıtla görmek ister.*

---

## Sahibinden alınacak veriler

1. `/cozumler` sayfası, blok "AI otomasyon kurmak ne kadar sürer?" içinde: Dolunay'ın tipik/ortalama otomasyon kurulum süresi (kaç hafta/ay, kapsam bazında değişiyorsa aralık olarak). Şu an `<Dolunay'ın ortalama teslim süresi buraya eklenecek>` yer tutucusu duruyor.

Not: Kurumsal otomasyon fiyatlandırması (maliyet aralığı) için de bir istatistik aranmıştı; internet üzerindeki "otomasyon şu kadar dolara kurulur" rakamları kaynaksız pazarlama blog yazılarıydı (stealthagents.com, qbsglobal.blog, ustechautomations.com vb.), gerçek bir ankete dayanmıyordu. Bu yüzden maliyetle ilgili hiçbir sayı taslağa girmedi ve blok da açılmadı. Dolunay isterse kendi fiyatlandırma mantığını (sabit mi, teklif bazlı mı) ayrı bir blok olarak eklenebilir.

## Kullanılan kaynaklar

1. **McKinsey Global Institute** - "Agents, robots, and us: Skill partnerships in the age of AI", 25 Kasım 2025. %57 rakamı doğrudan McKinsey sayfasında (mckinsey.com, zaman aşımına uğradı) değil, Fortune'un o rapordan yaptığı doğrudan alıntıyla doğrulandı: https://fortune.com/2025/11/25/why-ai-wont-take-your-job-partnership-agents-robots-mckinsey/ (McKinsey orijinali: https://www.mckinsey.com/mgi/our-research/agents-robots-and-us-skill-partnerships-in-the-age-of-ai)
2. **Upwork** - Future Workforce Index 2026, 14 Temmuz 2026. %34 ve %45 rakamları, %90 ve %72 büyüme rakamları doğrudan basın bülteninde görüldü: https://www.globenewswire.com/news-release/2026/07/14/3326964/0/en/Upwork-s-Future-Workforce-Index-2026-How-AI-is-Redefining-the-Value-of-Work-as-Skilled-Freelancing-Accelerates.html
3. **World Economic Forum** - Future of Jobs Report 2025, Ocak 2025. %58 rakamı weforum.org'un kendi sayfasında değil (HTTP 403 ile engellendi), Zapier'in derleme yazısında WEF atfıyla doğrulandı: https://zapier.com/blog/business-automation-statistics/ (WEF orijinal basın bülteni: https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/, erişilemedi)

### Denenip KULLANILMAYAN istatistikler (kaynak zayıf ya da doğrulanamadı)

- Zapier blog yazısının WebSearch özetinde "küçük işletmelerin %82'si otomasyon kullanıyor, işveren haftada 5 saat / çalışan 11,5 saat tasarruf ediyor" iddiası vardı. Sayfayı bizzat açıp okuyunca bu cümle SAYFADA YOKTU; WebSearch'ün kendi özeti yanlıştı. Kullanılmadı.
- "AI otomasyon projesi ortalama X haftada/ayda tamamlanır" ve "otomasyon kurmak X-Y dolara mal olur" rakamları onlarca pazarlama/ajans blogunda geçiyor ama hiçbiri gerçek bir ankete/kuruma dayanmıyor, kaynaksız aralıklar. Kullanılmadı.
- Visa'nın "küçük işletmelerin %90'ı AI ve otomasyon hizmetlerini değerlendiriyor" istatistiği Zapier üzerinden görüldü ama "kullanıyor" değil "değerlendiriyor" diyor, zayıf ve hedef kitleye (kurumsal) tam uymuyor. Kullanılmadı.
- AI otomasyon pazarının büyüklüğü/CAGR'ı için Grand View Research sayfası HTTP 403 ile erişime kapalıydı, doğrulanamadığı için hiçbir pazar büyüklüğü rakamı taslağa girmedi.

---

# 2. parti GEO blokları (2026-09-18) — ince kalan iki sayfa

Sebep: `/cozumler/hizmetler` (293 görünür kelime) ve `/egitimler/kurumsal-egitimler`
(267 görünür kelime) Google'a hiç girmemişti. İç linkleme sorunu yoktu (ikisi de 6
sayfadan linkli), sorun ince içerikti. Karşılaştırma: indekslenen `/cozumler` 1256,
`/egitimler/ai-factory` 1064 kelime. Dolunay iki sayfaya da aynı GEO bloklarını onayladı.

**Üstteki 7 blokla çakışma yok:** altı sorunun hiçbiri yukarıda cevaplanmadı.
**Yeni istatistik YOK:** yüzdeli her cümle yukarıda zaten kullanılan ve kaynağı
doğrulanmış üç rapordan geliyor (Upwork Temmuz 2026, McKinsey Kasım 2025, WEF Ocak 2025).

## Sayfa 3 - /cozumler/hizmetler

**Şu anki durum:**
- Görünür metin 293 kelime, Google'da "Discovered - currently not indexed".
- Soru başlığı YOK, dış istatistik YOK. Gövde `ServicesSection` + `AbonelikSeridi`.
- Sorular hizmet kapsamı / fiyatlandırma / çalışma biçimi ekseninde seçildi.

### Önerilen blok: Yapay zeka otomasyonu kurmak ne kadara mal oluyor?

## Yapay zeka otomasyonu kurmak ne kadara mal oluyor?

Tek bir liste fiyatım yok, çünkü iki işletmenin süreci hiç aynı çıkmıyor. Fiyatı üç şey belirliyor: kaç süreç otomatikleşecek, kaç sisteme bağlanacak, ekip kaç kişi. Bu üçü netleşmeden verilen rakam ya seni ya beni yanıltıyor. Bu yüzden ilk görüşmede fiyat değil kapsam konuşuyoruz. Kapsam netleşince teklif kalem kalem çıkıyor. Hangi sürecin ne kadar tuttuğunu tek tek görüyorsun.

Aradaki farkı kendi işlerimden örnekle anlatayım. Bir otelde kurduğum WhatsApp botu tek bir iş akışıydı, tek kalemden ibaretti. Bir e-ticaret firmasında ise stok takibi raporlamaya da bağlandı, kalem sayısı arttı. Bir klinikte sadece randevu hatırlatması kuruldu, o da ikisinin altında kaldı. Üçü aynı fiyatta olamaz, çünkü üçü aynı iş değil. Teklifi bu yüzden hazır paket olarak değil, süreç başına yazıyorum.

Bütçeyi en çok şişiren şey her şeyi aynı anda kurmaya çalışmak. Ben tek bir süreçle başlamayı öneriyorum, sonucu birlikte görüyoruz. Bir muhasebe bürosunda önce sadece tekrar eden rapor otomatikleşti, gerisi sonra geldi. Küçük başlayınca hem ilk maliyet düşük kalıyor hem karar vermek kolaylaşıyor. İşe yaradığını gördükten sonra genişletmek çok daha rahat oluyor. Bu sırayı neredeyse bütün müşterilerimde aynı şekilde uyguluyorum.

Kurulum bedelinin dışında aylık bir araç maliyeti de var, onu baştan söylüyorum. Bot çalıştığı sürece mesajlaşma altyapısı ve model kullanımı için ödeme yapılıyor. Bu kalemi teklifte ayrı satır olarak gösteriyorum, sonradan sürpriz çıkmıyor. Sistemleri Claude Code ile kurduğum için ayrıca bir yazılım ekibi maliyeti taşımıyorsun. Kurulumdan sonra devam eden bakım da ayrı bir kalem, aylık abonelik olarak yürüyor.

*Gerekçe: Teklif oncesi sorulan ilk soru; fiyat verilemedigi icin fiyati NEYIN belirledigi anlatiliyor.*

### Önerilen blok: Otomasyon kurulduktan sonra bakımını kim yapıyor?

## Otomasyon kurulduktan sonra bakımını kim yapıyor?

Bakımı ben yapıyorum, teslimle birlikte ortadan kaybolmuyorum. Kurduğum her sistem dışarıdaki bir araca bağlı ve o araçlar sürekli değişiyor. WhatsApp tarafında bir kural değişince ya da bir arayüz güncellenince sistem etkileniyor. Bu değişikliği ben takip ediyorum, senin fark etmen gerekmiyor. Böyle bir durumda bağlantıyı yeniden kuruyorum ve sistem kaldığı yerden devam ediyor. Bu takip aylık abonelik içinde, ayrıca ücretlendirilmiyor.

Bakımın ikinci yarısı işin kendisiyle ilgili. Bir otelde kurduğum botun cevap vermesi gereken sorular zamanla değişti. Yeni bir kampanya çıkınca ya da fiyat güncellenince bot da güncelleniyor. Bir e-ticaret firmasında stok eşiği sezona göre değişti, uyarı kuralını ben değiştirdim. Bunlar küçük dokunuşlar, yeni bir kural eklemek ya da mesaj şablonunu düzeltmek gibi. Sistemi baştan kurmaya gerek kalmıyor, tek bir satır değişiyor.

Bir şey bozulduğunda haber vermeni beklemiyorum. Kurduğum sistemler kendi durumlarını kontrol ediyor ve susan bir akış bana bildiriliyor. Bir e-ticaret firmasında uyarı akışı sustuğunda haber benim tarafıma düşüyor. Bu yüzden arıza genelde sen fark etmeden kapanıyor. Yine de bir şey gözüne çarparsa doğrudan bana yazıyorsun. Arada bir çağrı merkezi ya da destek bileti sistemi yok.

Bu bakım aylık bir abonelik olarak yürüyor, tek seferlik bir iş değil. Abonelik kademeli: en alt kademe sistemin çalışır kalmasını kapsıyor. Üst kademede sunucu ve model kullanım bedeli de abonelik içinde. Süreç değişirse otomasyonu yeni sürece uyduruyoruz, eskisini zorla kullanmıyorsun. Otomasyon canlı bir şey, kurulduğu gün donmuyor. Bakımsız bırakılan bir otomasyon birkaç ay içinde sessizce işe yaramaz hale geliyor.

*Gerekçe: Satin almayi durduran asil itiraz: kuran kisi gidince sistem sahipsiz kalir mi.*

### Önerilen blok: Hazır bir yapay zeka aracı almak yerine neden özel kurulum yaptırayım?

## Hazır bir yapay zeka aracı almak yerine neden özel kurulum yaptırayım?

Hazır araçlar iyi bir başlangıç, ama senin sürecini bilmiyorlar. Piyasadaki hazır bot sana genel bir cevap veriyor, çünkü kendi verine bakmıyor. Benim kurduğum sistemler senin kendi kaynağından okuyor, tahmin etmiyor. Aradaki fark cevabın akıcılığında değil, kimin verisiyle konuştuğunda ortaya çıkıyor. Müşteri yanlış bir fiyat duyduğunda bunun bedelini hazır araç değil sen ödüyorsun.

Bunu bir otelde açıkça gördüm. Hazır bir sohbet aracı oda tiplerini ve iptal koşullarını bilmiyordu, genel cevaplar veriyordu. Kurduğumuz bot aynı soruları otelin kendi bilgisinden okuyarak cevapladı. Karmaşık bir soru geldiğinde ise kendi kafasından uydurmadı, resepsiyona yönlendirdi. Bu sınırı çizmek hazır araçta mümkün olmuyor, kurulumda oluyor. Müşteri de ne zaman botla ne zaman insanla konuştuğunu biliyor.

İkinci fark bağlantı tarafında. Hazır araç genelde kendi panelinde yaşıyor, ekibin bir ekran daha açmak zorunda kalıyor. Bir e-ticaret firmasında yeni bir ekran açmadık, mevcut stok programının verisine bağlandık. Bir muhasebe bürosunda da tekrar eden rapor, kullanılan programın çıktısından derlendi. Ekip yeni bir arayüz öğrenmedi, sadece işini daha az elle yaptı. Veri tek yerde kaldı, ikinci bir kopya oluşmadı.

Bu tercih pazarda da görülüyor. Upwork'ün Temmuz 2026 Future Workforce Index raporu bunu doğruluyor. Üretken yapay zeka içerikli sözleşmeler yıllık yüzde 90 arttı. Kendi uzmanlığına yapay zekayı ekleyen profesyonel hizmetler yüzde 72 hacim artışı gösterdi. Yani değer aracın kendisinde değil, işe uyarlanmış kurulumunda toplanıyor. Ben de Claude Code ile bu uyarlamayı senin sürecine göre yapıyorum.

Kaynak: Upwork, Temmuz 2026.

*Gerekçe: Hazir chatbot ile ozel kurulum arasinda karar veren musterinin gercek sorusu.*

## Sayfa 4 - /egitimler/kurumsal-egitimler

**Şu anki durum:**
- Görünür metin 267 kelime, Google'da "URL is unknown to Google".
- Soru başlığı YOK, dış istatistik YOK. Gövde referans kartları + özellik kartları.
- Sorular kurum içi eğitim ekseninde seçildi.

### Önerilen blok: Kurumsal yapay zeka eğitimi kaç saat sürmeli ve nasıl planlanıyor?

## Kurumsal yapay zeka eğitimi kaç saat sürmeli ve nasıl planlanıyor?

Tek bir doğru süre yok, ama tek seferlik uzun bir gün en kötü seçenek. Kendi eğitimlerimde en iyi sonucu bölünmüş programlarda aldım. Bir bankada aynı ekiple iki ayrı blok çalıştık, arada uygulama süresi vardı. Katılımcı ilk bloktan sonra kendi işinde deneme şansı buldu. İkinci blokta gelen sorular çok daha somuttu, çünkü herkes bir yerde takılmıştı. Tek blokta bitirseydik o sorular hiç sorulmayacaktı.

Online eğitimde süreyi daha da kısa tutuyorum. Bir kurumda bütün programı tek oturumda değil, birkaç kısa seansa böldük. Ekranın karşısında dikkat iki saatten sonra hızla düşüyor, bunu her seferinde görüyorum. Kısa seanslar katılımı da artırıyor, çünkü kimse bütün gününü bloke etmiyor. Yüz yüze atölyede ise yarım günlük bloklar daha rahat çalışıyor. Aynı içerik iki formatta aynı sürede anlatılmıyor.

Planlamayı katılımcı sayısına göre de değiştiriyorum. Yüz kişilik bir online seansta herkesin ekranını tek tek göremiyorum, anlatım ağırlıklı ilerliyor. Yirmi kişilik bir atölyede ise herkes kendi bilgisayarında aynı anda uyguluyor. Bu ikisi aynı program olamaz, çünkü ikisinde öğrenme biçimi farklı. Kalabalık gruplarda ardından bire bir danışmanlık ekliyorum. Gerçek sorular çoğunlukla o görüşmelerde çıkıyor.

Süreyi belirleyen asıl şey içerik değil, ekibin başlangıç seviyesi. Aynı şirkette bir departman araçları hiç açmamışken başka bir departman zaten kullanıyor olabiliyor. Bu yüzden eğitimden önce kısa bir seviye sorusu gönderiyorum. Cevaplara göre programı sadeleştiriyorum ya da derinleştiriyorum. Böylece kimse bildiği bir şeyi dinlemiyor, kimse de geride kalmıyor. Müfredatı şirkete göre yazmanın asıl anlamı da bu.

*Gerekçe: Kurumsal egitim talebinde ilk sorulan operasyonel soru: kac saat, kac oturum.*

### Önerilen blok: Hangi departmanlar yapay zeka eğitiminden en çok fayda görüyor?

## Hangi departmanlar yapay zeka eğitiminden en çok fayda görüyor?

Eğitim verdiğim kurumlarda en hızlı sonucu üç departmanda gördüm. Müşteri ilişkileri, operasyon ve raporlama yapan ekipler. Üçünün ortak noktası aynı: işlerinin büyük kısmı tekrar eden metin işi. Tekrar eden bir iş varsa, eğitimin karşılığı ertesi hafta görülüyor. Karar ağırlıklı ve ilişki ağırlıklı ekiplerde fayda daha yavaş çıkıyor. Orada da çıkıyor, ama ölçmesi haftalar alıyor.

Somut örnek vereyim. Bir bankada iki günlük atölyeyi aynı ekiple iki kez tekrarladık. Uygulama hep rapor ve sunum işleri üstünden gitti. Başka bir bankada yüzü aşkın kişiyle online çalıştık, ardından bire bir danışmanlık yaptık. Bir üniversitede de eğitim verdim, e-ticaret tarafında satıcı ekipleriyle çalıştım. Hepsinde aynı şey oldu: en hızlı ilerleyen kişi, işi zaten her hafta tekrar edendi.

Bu tablo geniş araştırmalarda da aynı çıkıyor. McKinsey Global Institute'un Kasım 2025 raporu buna işaret ediyor. ABD'deki iş saatlerinin yüzde 57'si bugünkü teknolojiyle otomatikleştirilebilir potansiyele sahip. Rapor hangi mesleğin biteceğini değil, hangi görevin devredilebileceğini söylüyor. Departman seçerken ben de aynı soruyu soruyorum: burada hangi görev tekrar ediyor. Cevap netse eğitimin nereden başlayacağı da netleşiyor.

Yine de tek bir departmanla başlamayı öneriyorum. Bütün şirketi aynı anda eğitmek kulağa verimli geliyor ama sonuç dağılıyor. Tek departmanla başlayınca o ekip iç örnek üretiyor, diğerleri onu görüyor. Bir kurumda bu iç örnek, benim anlattığım her şeyden daha ikna edici oldu. Claude Code ile kurulan küçük bir otomasyon, sunumdan çok daha hızlı yayıldı. Sonraki departmanların eğitimi de o örnek üstünden çok daha kolay geçti.

Kaynak: McKinsey Global Institute, Kasım 2025.

*Gerekçe: Butceyi onaylayan yonetici once hangi ekipten baslayacagini bilmek ister.*

### Önerilen blok: Eğitimden sonra ekip öğrendiğini gerçekten kullanmaya devam ediyor mu?

## Eğitimden sonra ekip öğrendiğini gerçekten kullanmaya devam ediyor mu?

Dürüst cevap şu: kendiliğinden devam etmiyor. Eğitim bittikten sonra hiçbir şey değişmezse ekip eski alışkanlığına dönüyor. Bunu ilk yıllarda birkaç kurumda yaşadım, sunum güzeldi ama takip yoktu. O yüzden artık programı tek başına bir eğitimle bitirmiyorum. Son bölümde herkes kendi işinden gerçek bir görev seçiyor ve onu canlıya alıyor. Eğitim odasından çıkarken elde çalışan bir şey oluyor.

Kalıcılığı belirleyen şey eğitimin kendisi değil, eğitimden sonraki ilk iki hafta. Ekip o iki hafta içinde bir işi yeni yöntemle bitirirse alışkanlık oturuyor. Bitiremezse eski yönteme dönüyor ve eğitim raftaki bir sunuma dönüşüyor. Bu yüzden eğitim sonrasına kısa bir takip oturumu koyuyorum. Orada herkes ne denedi, nerede takıldı, onu konuşuyoruz. Takıldığı yer çoğunlukla araçta değil, kendi sürecinde oluyor.

Bire bir danışmanlık bu noktada en çok işe yarayan parça. Grup önünde soru sormayan kişi, bire bir görüşmede asıl takıldığı yeri söylüyor. Bir kurumda takip görüşmelerinde çıkan sorular, eğitimdeki sorulardan tamamen farklıydı. Çünkü artık kimse aracı merak etmiyordu, herkes kendi işini soruyordu. O sorular sayesinde hangi otomasyonun kurulacağı da netleşti. Eğitim böylece kurulum kararının da girdisi oluyor.

Bu konuyu kurumların ciddiye aldığını geniş veride de görüyoruz. Dünya Ekonomik Forumu Ocak 2025'te Future of Jobs raporunu yayınladı. İşverenlerin yüzde 58'i otomasyonun işletmelerini 2030'a kadar dönüştüreceğini bekliyor. Böyle bir beklentinin karşılığı tek seferlik bir eğitim olamaz. Bu yüzden ben eğitimi bir gün değil, bir başlangıç olarak planlıyorum. Sonrasında ekip isterse kurulum tarafında da yanında oluyorum.

Kaynak: World Economic Forum, Ocak 2025.

*Gerekçe: Egitim satin almanin en buyuk suphesi: para harcanir, ekip eski yontemine doner.*
