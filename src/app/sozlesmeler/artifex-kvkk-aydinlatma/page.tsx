'use client';

import Link from 'next/link';
import { TurkishOnlyDocument } from '@/components/LegalNotice';

/**
 * Metin avukat tarafindan revize edildi (24 Agustos 2026) ve ELLE yazilmaz.
 * Kaynak: Projeler/Artifex_Hukuki_Sayfalar/kaynak/KVKK Aydınlatma Metni Artifex MG.docx
 * Ureten: Projeler/Artifex_Hukuki_Sayfalar/uret_nextjs.py
 */
export default function ArtifexKvkkAydinlatmaPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TurkishOnlyDocument />
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Artifex AI KVKK Aydınlatma Metni
        </h1>
        <p className="text-gray-500 text-sm mb-8">Privacy Notice under Turkish Data Protection Law (English label for review purposes)</p>
        <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300 leading-relaxed">

          <p className="text-gray-400 text-sm">Son güncelleme: 24 Ağustos 2026</p>

          <p>Bu Kişisel Verilerin Korunması Kanunu kapsamında Aydınlatma Metni, Artifex AI tarafından sunulan; işletmelerin Instagram hesaplarına gelen doğrudan mesajların ve yorumların alınmasını, yönetilmesini, sınıflandırılmasını ve otomatik veya yarı otomatik olarak yanıtlanmasını sağlayan yazılım hizmeti kapsamında kişisel verilerin işlenmesine ilişkin bilgilendirme amacıyla hazırlanmıştır.</p>
          <p>Bu metin, kişisel verilerinizin hangi amaçlarla, hangi yöntemlerle, hangi hukuki sebeplere dayanılarak ve kimlere aktarılabilecek şekilde işlenebileceğini açıklar.</p>
          <p>Artifex AI’ın kişisel verilerin işlenmesine ilişkin genel yaklaşımı ayrıca <strong className="text-white">Gizlilik Politikası</strong>’nda; veri silme, yok etme ve anonimleştirme süreçleri ise <strong className="text-white">Veri Silme, Yok Etme ve Anonimleştirme Politikası</strong>’nda açıklanmaktadır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">1. Veri sorumlusunun kimliği</h2>
          <p>Kişisel verilerinizin Artifex AI tarafından kendi amaçları doğrultusunda işlendiği durumlarda veri sorumlusu:</p>
          <p><strong className="text-white">ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ</strong></p>
          <p><strong className="text-white">Adres:</strong></p>
          <p>Barbaros Mah. Şebboy Sok. No. 4/1 İç Kapı No. 2, Ataşehir/İstanbul</p>
          <p><strong className="text-white">E-posta:</strong></p>
          <p><a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a></p>
          <p>Artifex AI altyapısını kullanan bir işletmenin Instagram hesabına gönderdiğiniz mesaj ve yorumlar bakımından ise, mesaj ve yorumların hangi amaçlarla işleneceğine kural olarak ilgili işletme karar verir. Bu durumda ilgili işletme veri sorumlusu, Artifex AI ise işletmenin talimatları doğrultusunda veri işleyen olabilir.</p>
          <p>Belirli bir Instagram hesabının hangi işletme tarafından kullanıldığını veya ilgili işletmenin veri sorumlusu olarak iletişim bilgilerini öğrenmek için <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a> adresine başvurabilirsiniz. Artifex AI, gerekli olması hâlinde başvurunuzu ilgili işletmeye iletebilir veya sizi ilgili işletmenin başvuru kanalına yönlendirebilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">2. Aydınlatma metninin kapsamı</h2>
          <p>Bu metin aşağıdaki kişisel veri işleme faaliyetleri bakımından uygulanır:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Artifex AI’ın kendi Instagram hesabına gönderilen mesaj ve yorumların işlenmesi,</li>
            <li>Artifex AI altyapısını kullanan işletmelerin Instagram hesaplarına gelen mesaj ve yorumların Artifex AI sistemleri üzerinden teknik olarak işlenmesi,</li>
            <li>Artifex AI internet sitesi, uygulaması, destek kanalları veya e-posta adresi üzerinden iletişim kurulması,</li>
            <li>Artifex AI hizmetinin teknik olarak işletilmesi sırasında oluşan hesap, işlem, güvenlik, destek ve faturalama kayıtlarının tutulması,</li>
            <li>Veri silme, erişim, düzeltme veya diğer ilgili kişi başvurularının alınması ve sonuçlandırılması.</li>
          </ul>
          <p>Instagram ve Meta Platforms tarafından kendi amaçları doğrultusunda gerçekleştirilen kişisel veri işleme faaliyetleri bu metnin kapsamı dışındadır. Instagram hesabınız, platform içi davranışlarınız, Meta reklam faaliyetleri ve Meta’nın kendi sistemlerinde gerçekleştirdiği diğer veri işleme faaliyetleri bakımından Instagram ve Meta’nın kendi bilgilendirme metinleri uygulanır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">3. İşlenen kişisel veri kategorileri</h2>
          <p>Hizmetin kullanım biçimine, gönderilen mesaj veya yorumun içeriğine ve ilgili işletmenin talimatlarına bağlı olarak aşağıdaki kişisel veri kategorileri işlenebilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Kimlik ve hesap bilgileri,</li>
            <li>Instagram kullanıcı adı,</li>
            <li>Instagram hesap tanımlayıcısı,</li>
            <li>Uygulamaya özgü hesap ve kullanıcı bilgileri,</li>
            <li>Profilde kamuya açık olarak yer alan bilgiler,</li>
            <li>İletişim bilgileri,</li>
            <li>E-posta adresi ve başvuru sırasında paylaşılan iletişim bilgileri,</li>
            <li>İşlem güvenliği bilgileri,</li>
            <li>Mesaj ve yorum kimlikleri,</li>
            <li>Mesaj ve yorumların gönderilme tarih ve saatleri,</li>
            <li>Teknik erişim ve işlem kayıtları,</li>
            <li>Güvenlik ve hata kayıtları,</li>
            <li>Müşteri destek yazışmaları,</li>
            <li>Veri silme veya diğer ilgili kişi başvurularında sunulan bilgiler,</li>
            <li>Abonelik, faturalama ve ödeme bilgileri,</li>
            <li>Doğrudan mesaj ve yorum içerikleri,</li>
            <li>Mesajlarda veya yorumlarda paylaşılan görsel, video ve diğer içeriklere ilişkin teknik bağlantılar,</li>
            <li>Rezervasyon, randevu, sipariş, şikâyet veya bilgi talebi içerikleri,</li>
            <li>Yapay zekâ tarafından oluşturulan veya oluşturulması için işlenen yanıt içerikleri.</li>
          </ul>
          <p>Mesaj veya yorum içeriğinde ilgili kişi tarafından özel nitelikli kişisel veri, çocuklara ilişkin veri, sağlık bilgisi, finansal bilgi, kimlik bilgisi veya üçüncü kişilere ait kişisel veriler paylaşılması hâlinde, bu bilgiler hizmetin teknik işleyişi sırasında işlenebilir.</p>
          <p>Artifex AI, hizmetin gerektirmediği hâllerde bu tür bilgilerin paylaşılmasını talep etmez. Kullanıcıların ve müşteri işletmelerin, hizmetin amacıyla ilgisi olmayan hassas kişisel verileri mesaj veya yorum yoluyla paylaşmaması gerekir.</p>
          <p>Instagram şifreniz Artifex AI tarafından talep edilmez, görüntülenmez ve saklanmaz. Instagram hesabı ile Artifex AI arasındaki bağlantı, Instagram veya Meta tarafından sunulan yetkilendirme yöntemleri ve erişim belirteçleri aracılığıyla gerçekleştirilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">4. Kişisel verilerin elde edilme yöntemleri</h2>
          <p>Kişisel verileriniz aşağıdaki yöntemlerle elde edilebilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram üzerinden gönderdiğiniz doğrudan mesajlar,</li>
            <li>Instagram gönderilerine yazdığınız yorumlar,</li>
            <li>Müşteri işletmenin Instagram hesabıyla gerçekleştirdiğiniz iletişim,</li>
            <li>Doğrudan Artifex AI’ın Instagram hesabıyla gerçekleştirilen iletişim,</li>
            <li>Artifex AI internet sitesindeki formlar,</li>
            <li>E-posta yazışmaları,</li>
            <li>Müşteri destek talepleri,</li>
            <li>Veri silme, düzeltme, erişim veya diğer ilgili kişi başvuruları,</li>
            <li>Hizmetin teknik olarak kullanılması sırasında oluşan işlem ve güvenlik kayıtları,</li>
            <li>Müşteri işletmeler tarafından Artifex AI sistemine aktarılan veya Artifex AI’a erişim sağlanan hizmet verileri,</li>
            <li>Instagram, Meta veya hizmetin sunulması için kullanılan yetkilendirme ve teknik arayüzler.</li>
          </ul>
          <p>Artifex AI, yalnızca hizmetin sunulması ve hukuki yükümlülüklerin yerine getirilmesi için gerekli olan verileri elde etmeyi ve işlemeyi hedefler. Müşteri işletmeler ise kendi Instagram hesapları üzerinden elde edilen kişisel veriler bakımından, kendi sorumluluk alanlarında gerekli aydınlatma ve veri yönetimi süreçlerini yürütür.</p>
          <h2 className="text-xl font-semibold text-white mt-8">5. Kişisel verilerin işlenme amaçları</h2>
          <p>Kişisel verileriniz, somut işleme faaliyetine göre aşağıdaki amaçlarla işlenebilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram üzerinden gönderilen mesaj ve yorumların alınması,</li>
            <li>Mesaj ve yorumlara otomatik veya yarı otomatik yanıt oluşturulması,</li>
            <li>Oluşturulan yanıtların doğrudan gönderilmesi veya müşteri işletmenin onayına sunulması,</li>
            <li>Bilgi taleplerinin cevaplanması,</li>
            <li>Rezervasyon, randevu, sipariş veya müşteri hizmeti süreçlerinin yürütülmesi,</li>
            <li>Mesajların konu, amaç veya kategori bakımından sınıflandırılması,</li>
            <li>Riskli veya belirli konulardaki mesajların insan temsilciye yönlendirilmesi,</li>
            <li>Müşteri işletmeye ulaşan taleplerin ilgili işletmeye iletilmesi,</li>
            <li>Hizmetin teknik olarak çalışmasının sağlanması,</li>
            <li>Teknik hata ve sistem arızalarının tespit edilmesi,</li>
            <li>Bilgi güvenliği süreçlerinin yürütülmesi,</li>
            <li>Yetkisiz erişim, kötüye kullanım, spam ve suistimalin önlenmesi,</li>
            <li>Müşteri desteğinin sağlanması,</li>
            <li>Hizmet performansının ölçülmesi,</li>
            <li>Teknik geliştirme ve sistem optimizasyonunun yapılması,</li>
            <li>Abonelik, faturalama ve ödeme süreçlerinin yürütülmesi,</li>
            <li>Veri silme, yok etme, anonimleştirme ve ilgili kişi başvurularının sonuçlandırılması,</li>
            <li>Hukuki yükümlülüklerin yerine getirilmesi,</li>
            <li>Hukuki uyuşmazlıklarda kayıtların korunması,</li>
            <li>Yetkili kamu kurum ve kuruluşlarının taleplerinin karşılanması,</li>
            <li>Sözleşmesel ilişkilerin kurulması ve yürütülmesi,</li>
            <li>Hizmetin kötüye kullanılmasının ve üçüncü kişilerin haklarının ihlal edilmesinin önlenmesi.</li>
          </ul>
          <p>Mesaj ve yorum içerikleri, ayrıca ve açık biçimde kararlaştırılmadıkça genel yapay zekâ modeli eğitimi, başka müşterilerin hizmetlerinin geliştirilmesi, reklam profili oluşturulması veya kişisel davranış profillemesi amacıyla kullanılmaz.</p>
          <p>Hizmet performansının ölçülmesi ve teknik geliştirme amacıyla toplu ve anonim istatistiklerden yararlanılabilir. Bu verilerin ilgili kişiyle veya belirli bir müşteri işletmeyle ilişkilendirilememesi hedeflenir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">6. Kişisel verilerin işlenmesinin hukuki sebepleri</h2>
          <p>Artifex AI tarafından gerçekleştirilen kişisel veri işleme faaliyetleri, her bir işleme faaliyeti bakımından ayrı değerlendirilmek üzere KVKK m.5 ve m.6’daki hukuki sebeplere dayanır. Bunlardan bazıları:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Kanunlarda açıkça öngörülmesi,</li>
            <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla veri işlemenin gerekli olması,</li>
            <li>Artifex AI’ın hukuki yükümlülüğünü yerine getirebilmesi için veri işlemenin zorunlu olması,</li>
            <li>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması,</li>
            <li>İlgili kişi tarafından alenileştirilmiş olması,</li>
            <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla Artifex AI’ın meşru menfaatleri için veri işlemenin zorunlu olması,</li>
            <li>İşleme faaliyetinin niteliği gerektiriyorsa ilgili kişinin açık rızasının bulunması.</li>
          </ul>
          <p>Bu hukuki sebeplerden hangisinin uygulanacağı; işleme faaliyetinin niteliğine, verinin türüne, Artifex AI’ın veri sorumlusu veya veri işleyen sıfatına ve işlemenin amacına göre belirlenir.</p>
          <p>Açık rıza, hizmetin sunulması için zorunlu olmayan ve başka bir hukuki sebebe dayandırılamayan işleme faaliyetleri bakımından alınır. Açık rıza belirli bir işleme amacı, veri kategorisi ve aktarım bakımından ayrı ayrı alınır. Bir hizmetin sunulması için zorunlu olmayan bir işleme faaliyeti bakımından açık rıza verilmemesi, diğer hukuki sebeplere dayanan işlemlerin kendiliğinden geçersiz hâle gelmesine neden olmaz.</p>
          <h2 className="text-xl font-semibold text-white mt-8">7. Özel nitelikli kişisel veriler</h2>
          <p>Mesaj ve yorum içerikleri, ilgili kişi tarafından paylaşılması hâlinde özel nitelikli kişisel veri içerebilir. Sağlık, biyometrik veri, siyasi düşünce, dini inanç, sendika üyeliği, ceza mahkûmiyeti veya benzeri hassas bilgilerin hizmet üzerinden gereksiz şekilde paylaşılmaması gerekir.</p>
          <p>Artifex AI, özel nitelikli kişisel verileri hizmetin amacı dışında işlememeyi hedefler. Böyle bir verinin mesaj veya yorum içerisinde yer alması hâlinde, veri işleme faaliyeti ilgili işleme amacının ve yürürlükteki mevzuatın izin verdiği kapsamla sınırlı tutulur.</p>
          <p>Özel nitelikli kişisel verilerin işlenmesi gereken durumlarda, ilgili mevzuatta öngörülen özel şartlar ve yeterli güvenlik tedbirleri uygulanır. Müşteri işletmeler, kendi faaliyetleri bakımından özel nitelikli kişisel veri içeren mesajlara otomatik yanıt verilmesini sınırlandırmalı ve gerekli hâllerde insan denetimi sağlamalıdır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">8. Kişisel verilerin aktarılabileceği taraflar</h2>
          <p>Kişisel verileriniz, işleme amaçlarıyla sınırlı ve gerekli olduğu ölçüde aşağıdaki taraflara aktarılabilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Mesaj veya yorumun gönderildiği müşteri işletme,</li>
            <li>Artifex AI’ın yetkili çalışanları ve teknik destek personeli,</li>
            <li>Sunucu ve barındırma hizmeti sağlayıcıları,</li>
            <li>Yapay zekâ hizmeti sağlayıcıları,</li>
            <li>E-posta, bildirim, güvenlik, hata izleme ve teknik destek sağlayıcıları,</li>
            <li>Ödeme, faturalama ve muhasebe hizmeti sağlayıcıları,</li>
            <li>Instagram ve Meta Platforms,</li>
            <li>Hukuk, mali müşavirlik veya denetim hizmeti alınan yetkili profesyonel hizmet sağlayıcıları,</li>
            <li>Yetkili kamu kurum ve kuruluşları,</li>
            <li>Mahkemeler, icra daireleri ve kanunen yetkili diğer makamlar.</li>
          </ul>
          <p>Hâlihazırdaki teknik yapı bakımından:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Sunucu barındırma hizmetinde Almanya’da bulunan netcup GmbH altyapısından yararlanılabilir.</li>
            <li>Otomatik yanıt oluşturma hizmetinde Amerika Birleşik Devletleri’nde bulunan Anthropic PBC hizmetlerinden yararlanılabilir.</li>
            <li>Instagram mesajlarının ve yorumlarının iletilmesinde Instagram ve Meta altyapısı kullanılabilir.</li>
          </ul>
          <p>Kişisel verileriniz, reklam amacıyla satılmaz veya kiralanmaz. Müşteri işletmelerin verileri birbirinden ayrıştırılmaya çalışılır ve bir işletmenin başka bir işletmeye ait yazışmalara erişmesine izin verilmez.</p>
          <h2 className="text-xl font-semibold text-white mt-8">9. Kişisel verilerin yurt dışına aktarılması</h2>
          <p>Hizmetin teknik mimarisi nedeniyle bazı kişisel veriler yurt dışında bulunan hizmet sağlayıcılarına aktarılabilir.</p>
          <p>Yurt dışına aktarılabilecek bilgiler, otomatik yanıt oluşturulması veya hizmetin teknik olarak yürütülmesi için gerekli olan mesaj ve yorum içeriği, teknik kimlik bilgileri, erişim ve işlem kayıtları ile sınırlı tutulmaya çalışılır.</p>
          <p>Yurt dışına veri aktarımı bakımından:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Aktarım yapılacak ülke,</li>
            <li>Aktarılan veri kategorileri,</li>
            <li>Aktarım amacı,</li>
            <li>Alıcı hizmet sağlayıcı,</li>
            <li>Kullanılan sözleşmesel ve teknik güvence,</li>
            <li>Aktarımın sürekli veya arızi olup olmadığı,</li>
          </ul>
          <p>somut teknik yapıya göre belirlenir.</p>
          <p>Yurt dışına aktarım için açık rıza alınması gereken hâllerde, rıza metninde aktarımın yapılacağı ülke, aktarılabilecek kişisel veri kategorileri, aktarım amacı ve aktarımın muhtemel sonuçları açıkça belirtilir. Mevcut düzenlemeler ışığında Artifex AI açık rıza verilmediği hallerde hizmet veremeyeceğini beyan eder. Açık rızanın gerekli olmadığı hâllerde, aktarım yürürlükteki mevzuatta öngörülen diğer hukuki mekanizmalara dayanabilir.</p>
          <p>Müşteri işletme veri sorumlusu olarak kendi müşterilerini ve Instagram kullanıcılarını yurt dışı aktarım hakkında bilgilendirmek ve gerekli hukuki mekanizmayı sağlamakla yükümlüdür. Artifex AI, müşteri işletmenin talimatları doğrultusunda ve taraflar arasındaki Veri İşleme Protokolü kapsamında hareket eder.</p>
          <h2 className="text-xl font-semibold text-white mt-8">10. Kişisel verilerin saklama süreleri</h2>
          <p>Kişisel veriler, işleme amaçlarının gerektirdiği süre kadar saklanır. Saklama süresi belirlenirken:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>İşleme amacı,</li>
            <li>İlgili işletmenin talimatları,</li>
            <li>Hukuki yükümlülükler,</li>
            <li>Faturalama ve muhasebe gereklilikleri,</li>
            <li>Bilgi güvenliği ihtiyacı,</li>
            <li>Uyuşmazlık riski,</li>
            <li>Veri minimizasyonu ilkesi,</li>
            <li>Yedekleme ve felaket kurtarma süreçleri,</li>
          </ul>
          <p>dikkate alınır.</p>
          <p>Artifex AI’ın kendi veri sorumlusu olduğu durum bakımından, mesaj ve yorum kayıtları kural olarak ilgili kişiyle gerçekleşen son iletişim tarihinden itibaren en fazla 24 ay saklanır. Bu sürenin sonunda veriler, hukuken tutulmasını gerektiren bir neden bulunmadığı sürece silinir, yok edilir veya anonim hâle getirilir.</p>
          <p>Müşteri işletmeye ait mesaj ve yorum kayıtlarının saklama süresi, öncelikle ilgili işletmenin talimatı ve Artifex AI ile müşteri işletme arasındaki Veri İşleme Protokolü kapsamında belirlenir.</p>
          <p>Bunun dışında teknik işlem, güvenlik, destek, faturalama, muhasebe, başvuru ve uyuşmazlık kayıtları bakımından farklı saklama süreleri uygulanabilir.</p>
          <p>Aktif sistemlerden silinen veriler, yedekleme sistemlerinde teknik olarak belirli bir süre daha bulunabilir. Yedekler günlük hizmet işletiminde kullanılmaz ve olağan yedekleme yaşam döngüsü içinde silinir veya üzerine yazılır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">11. Kişisel verilerin silinmesi, yok edilmesi ve anonim hâle getirilmesi</h2>
          <p>İşlenmesini gerektiren sebeplerin ortadan kalkması, ilgili kişinin hukuken geçerli talepte bulunması veya müşteri işletmenin talimat vermesi hâlinde kişisel veriler:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Silinebilir,</li>
            <li>Yok edilebilir,</li>
            <li>Anonim hâle getirilebilir.</li>
          </ul>
          <p>Silme işlemi, teknik olarak uygulanabilir olduğu ölçüde:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Aktif veritabanlarını,</li>
            <li>Mesaj ve yorum kayıtlarını,</li>
            <li>Yanıt kayıtlarını,</li>
            <li>Yapay zekâ istem ve yanıt kayıtlarını,</li>
            <li>Teknik işlem ve hata kayıtlarını,</li>
            <li>İlgili destek kayıtlarını,</li>
            <li>Yedekleme sistemlerini,</li>
            <li>Alt hizmet sağlayıcılardaki ilgili kayıtları,</li>
          </ul>
          <p>kapsayacak şekilde yürütülür.</p>
          <p>Kanuni saklama yükümlülüğü, devam eden uyuşmazlık, güvenlik incelemesi, faturalama veya bir hakkın tesisi, kullanılması ya da korunması için gerekli kayıtlar, ilgili amaçla sınırlı olmak üzere tutulabilir.</p>
          <p>Gerçekten anonim hâle getirilen ve ilgili kişiyle makul yöntemlerle ilişkilendirilemeyen toplu istatistikler, kişisel veri niteliğini kaybetmeleri hâlinde silme talebinin kapsamı dışında kalabilir.</p>
          <p>Silme ve yok etme taleplerinin nasıl yapılacağı, kimlik doğrulama süreci, müşteri işletmeye yönlendirme ve teknik silme aşamaları <strong className="text-white">Veri Silme, Yok Etme ve Anonimleştirme Politikası</strong>’nda açıklanmaktadır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">12. İlgili kişinin hakları</h2>
          <p>Kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
            <li>Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Kişisel verilerinizin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,</li>
            <li>Kanuni şartların oluşması hâlinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,</li>
            <li>Düzeltme, silme veya yok etme işlemlerinin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
            <li>Kişisel verilerinizin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
            <li>Kişisel verilerinizin kanuna aykırı işlenmesi nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-8">13. Başvuru yöntemi</h2>
          <p>Artifex AI’ın kendi veri sorumlusu olduğu faaliyetler bakımından taleplerinizi aşağıdaki iletişim kanalı üzerinden iletebilirsiniz:</p>
          <p><strong className="text-white">E-posta:</strong></p>
          <p><a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a></p>
          <p><strong className="text-white">Konu:</strong></p>
          <p>KVKK İlgili Kişi Başvurusu</p>
          <p>Başvurunuzda mümkün olduğu ölçüde aşağıdaki bilgileri belirtmeniz, kaydınızın doğru şekilde bulunmasına yardımcı olur:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Ad-soyad,</li>
            <li>Instagram kullanıcı adı,</li>
            <li>Yazışma yapılan işletme veya Instagram hesabı,</li>
            <li>Yazışmanın yaklaşık tarihi veya tarih aralığı,</li>
            <li>Talebin konusu,</li>
            <li>Talep edilen işlemin kapsamı,</li>
            <li>Başvuruya cevap verilmesini istediğiniz iletişim kanalı.</li>
          </ul>
          <p>Başvurunun başka bir kişi adına yapılması hâlinde, kanuni temsil veya vekâlet yetkisini gösteren belge istenebilir.</p>
          <p>Kimlik ve yetki doğrulaması bakımından yalnızca başvurunun değerlendirilmesi için gerekli ve ölçülü bilgiler talep edilir. Instagram hesabınızın şifresi, erişim anahtarı veya güvenlik kodu Artifex AI tarafından istenmez.</p>
          <p>Mesaj ve yorumların veri sorumlusu ilgili müşteri işletmeyse, başvurunun öncelikle ilgili işletmeye yapılması gerekir. Artifex AI’a ulaşan başvurular, gerekli hâllerde ilgili işletmeye iletilebilir veya başvuru sahibi ilgili işletmenin başvuru kanalına yönlendirilebilir.</p>
          <p>Başvurular, niteliğine göre incelenir ve yürürlükteki mevzuatta öngörülen süre içinde sonuçlandırılır. Başvurunun tamamen veya kısmen reddedilmesi hâlinde, mümkün olduğu ölçüde ret gerekçesi açıklanır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">14. Yapay zekâ ve otomatik karar verme</h2>
          <p>Artifex AI, mesaj ve yorumlara yanıt oluşturmak, içerikleri sınıflandırmak veya belirli mesajları ilgili işletmeye yönlendirmek amacıyla yapay zekâ tabanlı sistemler kullanabilir.</p>
          <p>Yapay zekâ tarafından oluşturulan yanıtlar:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Yanlış veya eksik olabilir,</li>
            <li>Güncel olmayan bilgi içerebilir,</li>
            <li>Mesajın bağlamını hatalı yorumlayabilir,</li>
            <li>Müşteri işletme tarafından sağlanan yanlış bilgileri yansıtabilir,</li>
            <li>Her durumda bağlayıcı veya kesin bir ticari, hukuki, mali ya da tıbbi görüş niteliğinde olmayabilir.</li>
          </ul>
          <p>Artifex AI’ın hizmeti, kural olarak kullanıcılar hakkında tek başına hukuki sonuç doğuran bir karar vermek üzere tasarlanmamıştır. Bununla birlikte mesajların sınıflandırılması, otomatik yanıt oluşturulması veya insan temsilciye aktarılması gibi işlemler otomatik sistemler aracılığıyla yapılabilir.</p>
          <p>Münhasıran otomatik sistemlerle yapılan analiz sonucunda kişi aleyhine sonuç doğması hâlinde, ilgili kişi itiraz hakkını kullanabilir. Yüksek riskli konularda, özellikle kişisel veri talepleri, sağlık, hukuk, finans, ödeme, iade, rezervasyon, çocuklar ve şikâyetler bakımından insan denetimi uygulanması gerekir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">15. Çocuklara ilişkin veriler</h2>
          <p>Artifex AI hizmeti çocuklara özel olarak tasarlanmamıştır. Söz konusu hizmet sadece yetişkinlere yöneliktir. Çocuklara ilişkin veriler işlenmemektedir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">16. Veri güvenliği</h2>
          <p>Artifex AI, kişisel verilerin hukuka aykırı olarak işlenmesini, yetkisiz erişimi, açıklanmasını, değiştirilmesini, kaybolmasını veya yok edilmesini önlemek amacıyla uygun teknik ve idari tedbirler uygulamayı hedefler.</p>
          <p>Bu kapsamda aşağıdaki tedbirler uygulanabilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Erişim anahtarlarının kaynak kodda tutulmaması,</li>
            <li>Gizli bilgilerin güvenli yapılandırma araçlarıyla yönetilmesi,</li>
            <li>Yetkilerin görev gereği erişim ilkesiyle sınırlandırılması,</li>
            <li>Sunucu ve uygulama erişimlerinin yetkili kişilerle sınırlandırılması,</li>
            <li>Güvenli iletişim protokollerinin kullanılması,</li>
            <li>Müşteri işletme kayıtlarının birbirinden ayrıştırılması,</li>
            <li>Erişim ve işlem kayıtlarının tutulması,</li>
            <li>Olağan dışı faaliyetlerin izlenmesi,</li>
            <li>Yedekleme ve kurtarma süreçlerinin yürütülmesi,</li>
            <li>Hizmet sağlayıcıların güvenlik uygulamalarının değerlendirilmesi,</li>
            <li>Yetkisiz erişim şüphesinde erişim bilgilerinin yenilenmesi veya iptal edilmesi.</li>
          </ul>
          <p>Hiçbir elektronik aktarım veya depolama yönteminin mutlak güvenlik garantisi sağlamadığı dikkate alınmalıdır. Kullanıcılar ve müşteri işletmeler, hizmet üzerinden gereksiz, aşırı veya hassas bilgi paylaşmamalıdır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">17. Veri güvenliği olayları</h2>
          <p>Kişisel verilerin yetkisiz şekilde erişilmesi, kaybolması, değiştirilmesi, açıklanması veya kullanılması şüphesini doğuran bir olay meydana gelmesi hâlinde Artifex AI:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Olayın kapsamını ve etkisini inceleyebilir,</li>
            <li>İlgili sistemlere erişimi sınırlandırabilir,</li>
            <li>Gerekli teknik düzeltmeleri uygulayabilir,</li>
            <li>Etkilenen müşteri işletmeleri bilgilendirebilir,</li>
            <li>Kanunen gerekli bildirimleri yapabilir,</li>
            <li>Olayın tekrarını önlemek için güvenlik tedbirlerini güncelleyebilir.</li>
          </ul>
          <p>İlgili müşteri işletme veri sorumlusu sıfatıyla kendi müşterilerini bilgilendirme ve gerekli bildirim süreçlerini yürütme sorumluluğuna sahip olabilir. Artifex AI, veri işleyen sıfatıyla hareket ettiği faaliyetler bakımından olayla ilgili bilgileri ilgili işletmeye iletir ve işletmenin talimatlarını uygular.</p>
          <h2 className="text-xl font-semibold text-white mt-8">18. Güncellemeler</h2>
          <p>Bu Aydınlatma Metni; mevzuat değişiklikleri, hizmetin teknik yapısının değişmesi, yeni hizmet sağlayıcıların kullanılması, veri işleme amaçlarının farklılaşması veya yeni veri kategorilerinin işlenmeye başlanması hâlinde güncellenebilir.</p>
          <p>Güncel metin, son güncelleme tarihiyle birlikte yayımlanır. Esaslı değişiklikler yapılması hâlinde, gerekli olduğu ölçüde ilgili kişiler ayrıca bilgilendirilir veya yeniden aydınlatma yapılır.</p>
          <p><strong className="text-white">Son güncelleme tarihi:</strong> 24 Ağustos 2026</p>
          <p><strong className="text-white">ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ</strong></p>
          <p><strong className="text-white">Adres:</strong></p>
          <p>Barbaros Mah. Şebboy Sok. No. 4/1 İç Kapı No. 2, Ataşehir/İstanbul</p>
          <p><strong className="text-white">E-posta:</strong></p>
          <p><a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a></p>

          <h2 className="text-xl font-semibold text-white mt-8">Ayrıca bakınız</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası</Link></li>
            <li><Link href="/sozlesmeler/artifex-acik-riza" className="text-[#4F8BFF] hover:underline">Açık Rıza Metni</Link></li>
            <li><Link href="/sozlesmeler/artifex-kosullar" className="text-[#4F8BFF] hover:underline">Kullanım Koşulları</Link></li>
            <li><Link href="/sozlesmeler/artifex-veri-silme" className="text-[#4F8BFF] hover:underline">Veri Silme Talebi</Link></li>
          </ul>

          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 mt-8 text-sm">
            <p>
              <strong className="text-white">Unvan:</strong> ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ<br />
              <strong className="text-white">Adres:</strong> Barbaros Mah. Şebboy Sk. No:4/1 İç Kapı No:2, Ataşehir / İstanbul<br />
              <strong className="text-white">Vergi kimlik numarası:</strong> 0851465973 (Kozyatağı Vergi Dairesi)<br />
              <strong className="text-white">MERSİS:</strong> 0085146597300001<br />
              <strong className="text-white">E-posta:</strong>{' '}
              <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a><br />
              <strong className="text-white">KEP:</strong> artifexyapayzeka@hs01.kep.tr
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
