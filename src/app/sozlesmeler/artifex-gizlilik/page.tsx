'use client';

import Link from 'next/link';
import { TurkishOnlyDocument } from '@/components/LegalNotice';

/**
 * Metin avukat tarafindan revize edildi (24 Agustos 2026) ve ELLE yazilmaz.
 * Kaynak: Projeler/Artifex_Hukuki_Sayfalar/kaynak/Gizlilik Politikası Artifex AI MG 23.08.2026.docx
 * Ureten: Projeler/Artifex_Hukuki_Sayfalar/uret_nextjs.py
 */
export default function ArtifexGizlilikPolitikasiPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TurkishOnlyDocument />
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Artifex Mesaj Otomasyonu Gizlilik Politikası
        </h1>
        <p className="text-gray-500 text-sm mb-8">Privacy Policy (English label for review purposes)</p>
        <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300 leading-relaxed">

          <p className="text-gray-400 text-sm">Son güncelleme: 24 Ağustos 2026</p>

          <p>Artifex AI, işletmelerin Instagram hesaplarına gelen doğrudan mesajların ve yorumların yönetilmesini, sınıflandırılmasını ve otomatik veya yarı otomatik olarak yanıtlanmasını sağlayan yapay zekâ destekli bir yazılım hizmetidir.</p>
          <p>Bu Gizlilik Politikası, Artifex AI hizmetinin işletilmesi sırasında işlenen bilgi ve verilerin nasıl korunduğunu, hangi amaçlarla kullanıldığını, hizmet sağlayıcılarla hangi kapsamda paylaşılabildiğini ve kullanıcıların hizmeti kullanırken hangi hususlara dikkat etmesi gerektiğini açıklar.</p>
          <p>Bu politika, Artifex AI’ın hizmetin işletilmesi kapsamında uyguladığı gizlilik ve bilgi güvenliği yaklaşımını ortaya koyar. Kişisel verilerin hangi hukuki sebeple işlendiği, ilgili kişilerin hakları ve aydınlatma yükümlülüğünün kapsamı ayrıca yayımlanan <Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link> ile düzenlenir. İşbu Gizlilik Politikası, <strong className="text-white">KVKK Aydınlatma Metni</strong> ve <strong className="text-white">Açık Rıza Metni</strong> ile birlikte değerlendirilmelidir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">1. Politikanın kapsamı</h2>
          <p>Bu Gizlilik Politikası aşağıdaki kişi ve faaliyetler bakımından uygulanır:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Artifex AI internet sitesini ziyaret eden kişiler,</li>
            <li>Artifex AI hizmetini kullanan veya kullanmak üzere başvuran işletmeler,</li>
            <li>Hizmeti kullanan işletmelerin Instagram hesaplarına mesaj gönderen veya yorum yazan kişiler,</li>
            <li>Doğrudan Artifex AI’ın Instagram hesabıyla iletişim kuran kişiler,</li>
            <li>Artifex AI ile e-posta, destek kanalı veya diğer iletişim kanalları üzerinden iletişim kuran kişiler,</li>
            <li>Artifex AI hizmetinin teknik işletimi sırasında oluşan kullanıcı, hesap, işlem, güvenlik ve destek kayıtları.</li>
          </ul>
          <p>Bu politika, Instagram ve Meta Platforms şirketlerinin kendi sistemlerinde, kendi amaçları doğrultusunda gerçekleştirdiği veri işleme faaliyetlerini kapsamaz. Instagram hesabınız, platform içi davranışlarınız, Instagram üzerindeki reklam faaliyetleri ve Meta’nın kendi sistemlerinde tuttuğu bilgiler bakımından Instagram ve Meta tarafından yayımlanan politika ve metinler ayrıca uygulanır.</p>
          <p>Artifex AI altyapısını kullanan bir işletmenin Instagram hesabına mesaj göndermeniz veya yorum yapmanız hâlinde, söz konusu kişisel veri işleme faaliyetleri bakımından veri sorumlusu ilgili işletme; Artifex ise işletmenin talimatları doğrultusunda hareket eden veri işleyendir. Verilerin işlenme amaçları, hukuki sebepleri ve saklama süreleri ilgili işletme tarafından belirlenir. Bu nedenle, ilgili işletmenin ayrıca yayımladığı sözleşme, gizlilik politikası ve aydınlatma metinleri uygulanır. Artifex, bu kapsamda işlediği verileri kendi bağımsız amaçları için kullanmaz.</p>
          <p>Doğrudan Artifex AI’ın kendi Instagram hesabına mesaj göndermeniz veya yorum yapmanız hâlinde ise söz konusu işleme faaliyetleri bakımından veri sorumlusu <strong className="text-white">ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ</strong>’dir.</p>
          <p><strong className="text-white">Kimliğimiz</strong></p>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
            <p>ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ<br />Barbaros Mah. Şebboy Sk. No: 4/1 İç Kapı No: 2, Ataşehir/İstanbul<br />E-posta: <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a><br />
            Hangi işletmenin hangi Instagram hesabını bizim altyapımızla işlettiğini öğrenmek isterseniz <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a> adresine yazın; ilgili işletmenin iletişim bilgisini sizinle paylaşırız.</p>
          </div>
          <h2 className="text-xl font-semibold text-white mt-8">2. Hizmetin çalışma biçimi</h2>
          <p>Artifex AI, işletmelerin ve kendisinin Instagram hesaplarına gelen doğrudan mesajları ve yorumları teknik olarak alır, ilgili yapılandırmalara göre işler ve işletme tarafından belirlenen kurallar, içerikler, bilgi kaynakları veya talimatlar doğrultusunda yanıt oluşturur.</p>
          <p>Hizmetin çalışma şekli, müşterinin tercihine ve teknik yapılandırmasına göre değişebilir. Buna göre:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Yanıt doğrudan otomatik olarak gönderilebilir,</li>
            <li>Yanıt gönderilmeden önce işletme yetkilisinin onayına sunulabilir,</li>
            <li>Mesaj insan temsilciye aktarılabilir,</li>
            <li>Mesaj belirli konu veya kategoriye göre sınıflandırılabilir,</li>
            <li>Belirlenen kelime, konu veya risk kategorileri bakımından otomatik yanıt sınırlandırılabilir,</li>
            <li>İşletme tarafından sağlanan ürün, hizmet, fiyat, rezervasyon veya kampanya bilgileri yanıt oluşturma sürecinde kullanılabilir.</li>
          </ul>
          <p>Yapay zekâ tarafından oluşturulan yanıtlar, kullanılan bilgi kaynaklarına, müşteri tarafından verilen talimatlara, mesajın içeriğine ve sistemin teknik çalışma koşullarına bağlıdır. Bu nedenle yapay zekâ tarafından oluşturulan yanıtlar her durumda eksiksiz, güncel, doğru veya bağlayıcı olmayabilir.</p>
          <p>İşletme; ürün, hizmet, fiyat, stok, kampanya, rezervasyon, iade, teslimat ve müşteri iletişimine ilişkin bilgilerin doğruluğundan ve güncelliğinden sorumludur. Artifex AI, müşterinin sisteme sağladığı yanlış, eksik, güncel olmayan veya hukuka aykırı bilgilerden kaynaklanan sonuçlardan, kendi kusuru bulunmadığı sürece sorumlu tutulamaz.</p>
          <h2 className="text-xl font-semibold text-white mt-8">3. Gizlilik yaklaşımımız</h2>
          <p>Artifex AI, hizmet kapsamında işlenen bilgilerin yalnızca belirli, sınırlı ve hizmetin gerektirdiği amaçlar doğrultusunda kullanılmasını hedefler.</p>
          <p>Bu kapsamda Artifex AI:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Kişisel verileri satmaz,</li>
            <li>Mesaj ve yorum içeriklerini reklam profili oluşturmak amacıyla kullanmaz,</li>
            <li>Bir müşterinin yazışmalarını başka bir müşteriye açmaz,</li>
            <li>Müşteri verilerini izinsiz şekilde başka müşterilerin hizmetlerine aktarmamaya çalışır,</li>
            <li>Instagram kullanıcılarının hesap şifrelerini talep etmez veya saklamaz,</li>
            <li>Hizmet için gerekli olmayan kişisel verilerin paylaşılmasını teşvik etmez,</li>
            <li>Verileri işleme amacı sona erdiğinde uygulanabilir teknik süreçler çerçevesinde siler, yok eder veya anonimleştirir,</li>
            <li>Hizmet sağlayıcılarına yalnızca hizmetin gerektirdiği kapsamda erişim vermeyi amaçlar,</li>
            <li>Yapay zekâ hizmetlerinin kullanımında veri minimizasyonu ve güvenlik ilkelerini gözetir.</li>
          </ul>
          <p>Mesaj ve yorum içerikleri, aksi açıkça kararlaştırılmadıkça, genel amaçlı yapay zekâ modeli eğitimi, başka müşterilerin hizmetlerini geliştirme, kişisel davranış profili oluşturma veya üçüncü kişilere pazarlama amacıyla kullanılmaz.</p>
          <p>Hizmetin performansını ölçmek veya teknik sorunları tespit etmek amacıyla toplu ve anonim istatistikler kullanılabilir. Bu istatistiklerin kişileri veya belirli müşteri işletmelerini makul yöntemlerle belirlemeye elverişli olmaması hedeflenir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">4. İşlenen bilgi türleri</h2>
          <p>Hizmetin kullanım biçimine göre aşağıdaki bilgi türleri işlenebilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram kullanıcı adı,</li>
            <li>Instagram hesap tanımlayıcısı,</li>
            <li>Profilde kamuya açık olarak yer alan bilgiler,</li>
            <li>Doğrudan mesaj içerikleri,</li>
            <li>Yorum içerikleri,</li>
            <li>Mesaj ve yorum kimlikleri,</li>
            <li>Mesajların ve yorumların gönderilme tarih ve saatleri,</li>
            <li>Gönderilen görsel, video veya diğer içeriklere ilişkin teknik bağlantılar,</li>
            <li>Paylaşılan gönderi, ürün, hizmet veya kampanya bilgileri,</li>
            <li>Rezervasyon, randevu, sipariş veya müşteri hizmeti talepleri,</li>
            <li>Oluşturulan otomatik yanıtlar,</li>
            <li>Yanıtın gönderilip gönderilmediğine ilişkin işlem kayıtları,</li>
            <li>Kullanıcı, müşteri ve hesap yapılandırmaları,</li>
            <li>Teknik hata ve performans kayıtları,</li>
            <li>Güvenlik, erişim ve denetim kayıtları,</li>
            <li>Destek talepleri ve müşteri iletişim kayıtları,</li>
            <li>Abonelik, faturalama ve ödeme bilgileri.</li>
          </ul>
          <p>Instagram şifresi Artifex AI tarafından talep edilmez, görüntülenmez veya saklanmaz. Hesap bağlantısı, Instagram veya Meta tarafından sunulan yetkilendirme yöntemleri ve erişim belirteçleri aracılığıyla gerçekleştirilir.</p>
          <p>Artifex AI, hizmetin gerektirmediği hâllerde kimlik numarası, banka bilgisi, sağlık bilgisi, biyometrik veri, siyasi görüş, dini inanç, sendika üyeliği veya benzeri hassas bilgilerin mesaj veya yorum yoluyla paylaşılmamasını talep eder.</p>
          <h2 className="text-xl font-semibold text-white mt-8">5. Bilgilerin işleme ve kullanım amaçları</h2>
          <p>Artifex AI tarafından işlenen bilgiler, hizmetin niteliğine ve ilgili müşteri işletmenin yapılandırmasına bağlı olarak aşağıdaki amaçlarla işlenebilir ve kullanılabilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram mesaj ve yorumlarının alınması,</li>
            <li>Mesaj ve yorumlara yanıt oluşturulması,</li>
            <li>Otomatik yanıtların gönderilmesi,</li>
            <li>Yanıtların işletme yetkilisinin onayına sunulması,</li>
            <li>Müşteri hizmetleri süreçlerinin yürütülmesi,</li>
            <li>Rezervasyon, randevu, sipariş veya bilgi taleplerinin ilgili işletmeye aktarılması,</li>
            <li>Mesajların konu veya kategori bazında sınıflandırılması,</li>
            <li>Riskli veya belirli konulardaki mesajların insan temsilciye yönlendirilmesi,</li>
            <li>Hizmetin teknik olarak işletilmesi,</li>
            <li>Hataların ve sistem arızalarının tespit edilmesi,</li>
            <li>Bilgi güvenliğinin sağlanması,</li>
            <li>Yetkisiz erişim, spam, kötüye kullanım ve suistimalin önlenmesi,</li>
            <li>Müşteri desteğinin sağlanması,</li>
            <li>Hizmet performansının izlenmesi,</li>
            <li>Teknik geliştirme ve sistem optimizasyonu,</li>
            <li>Abonelik, faturalama ve muhasebe süreçlerinin yürütülmesi,</li>
            <li>Hukuki yükümlülüklerin yerine getirilmesi,</li>
            <li>Hukuki uyuşmazlıkların yönetilmesi ve ilgili kayıtların korunması.</li>
          </ul>
          <p>Artifex AI Instagram sayfasına doğrudan yönlendirilen mesajlarda verilerinizi kendi ürünümüzü geliştirmek, size reklam göstermek veya profil çıkartmak için kullanmayız. Hizmet kapsamında işlenen mesaj ve yorum içerikleri, açıkça farklı bir kullanım kararlaştırılmadıkça:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Satılmaz,</li>
            <li>Kiralanmaz,</li>
            <li>Reklam hedefleme amacıyla kullanılmaz,</li>
            <li>Başka müşterilere aktarılmaz,</li>
            <li>Kullanıcı davranış profili oluşturmak amacıyla kullanılmaz,</li>
            <li>Genel yapay zekâ modeli eğitimi amacıyla kullanılmaz.</li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-8">6. Hukuki sebepler</h2>
          <p>Kişisel verilerinizi 6698 sayılı KVKK’nın 5. Ve 6. maddeleri kapsamındaki hukuki sebeplere dayanarak işlemekteyiz. Bunlardan bazıları:</p>
          <h3 className="text-lg font-semibold text-white mt-6">KVKK m.5/2-c — Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması</h3>
          <h3 className="text-lg font-semibold text-white mt-6">KVKK m.5/2-ç — Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması</h3>
          <h3 className="text-lg font-semibold text-white mt-6">KVKK m.5/2-f — İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması</h3>
          <h3 className="text-lg font-semibold text-white mt-6">Gerekli hâllerde açık rızanız</h3>
          <p>Söz konusu işleme, Artifex’in hizmet sunabilmesi için gereklidir. Açık rıza ve veri işlemesine izin verilmemesi durumunda tarafımızca hizmet verilmemektedir. Artifex’in veri işleyen olduğu durumlarda veri sorumlusu işletme gerekli izinleri alacak ve hukuki sebebi ilgili işletme belirleyecektir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">7. Müşteri işletmelerin sorumluluğu</h2>
          <p>Artifex AI hizmetini kullanan işletmeler, kendi Instagram hesapları üzerinden gerçekleştirilen veri işleme faaliyetleri bakımından gerekli hukuki ve teknik süreçleri kurmakla yükümlüdür. İşletmenin gerekli hukuki ve teknik süreçleri kurmamasından kaynaklı oluşacak zararlarda Artifex’e rücu edilemez.</p>
          <p>Müşteri işletmeler özellikle:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram hesabını kullanma ve Artifex AI’a bağlama yetkisine sahip olmalıdır,</li>
            <li>Mesaj ve yorumların işlenmesi için gerekli bilgilendirmeleri yapmalıdır,</li>
            <li>Kendi veri sorumlusu sıfatını ve iletişim kanallarını belirlemelidir,</li>
            <li>İşletmeye ulaşan kişisel veri taleplerini uygun şekilde karşılamalıdır,</li>
            <li>Kullanıcıların silme, düzeltme, erişim ve itiraz taleplerini değerlendirmelidir,</li>
            <li>Yapay zekâ yanıtlarında kullanılacak ürün, fiyat, stok ve kampanya bilgilerini güncel tutmalıdır,</li>
            <li>Hukuka aykırı, yanıltıcı, ayrımcı veya saldırgan yanıtların üretilmesini engelleyecek kuralları oluşturmalıdır,</li>
            <li>Sağlık, finans, hukuk, sigorta veya benzeri yüksek riskli alanlarda gerekli insan denetimini sağlamalıdır,</li>
            <li>Hizmeti spam, izinsiz pazarlama, yanıltıcı reklam veya platform kurallarını ihlal edecek biçimde kullanmamalıdır,</li>
            <li>Artifex AI’a aktardığı veriler üzerinde gerekli kullanım ve paylaşım yetkisine sahip olmalıdır.</li>
          </ul>
          <p>Artifex AI, müşterinin hizmeti hangi amaçla ve nasıl yapılandırdığına ilişkin olarak müşterinin yerine geçerek ticari, idari veya hukuki karar vermez. Müşteri, otomatik yanıtların gönderilmeden önce insan onayına sunulmasını tercih edebilir veya riskli konu kategorilerinde otomatik yanıtı devre dışı bırakabilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">8. Yapay zekâ tarafından oluşturulan içerikler</h2>
          <p>Artifex AI, mesaj ve yorumlara cevap oluşturmak amacıyla yapay zekâ tabanlı sistemlerden yararlanır. Yapay zekâ çıktıları:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Otomatik olarak oluşturulabilir,</li>
            <li>Müşteri tarafından sağlanan bilgilerden yararlanabilir,</li>
            <li>Önceden belirlenmiş yanıt kurallarına göre şekillenebilir,</li>
            <li>İşletme tarafından incelenebilir, değiştirilebilir veya onaylanabilir,</li>
            <li>Teknik hata, eksik bilgi veya yanlış bağlam nedeniyle hatalı olabilir.</li>
          </ul>
          <p>Yapay zekâ tarafından oluşturulan bir yanıtın tek başına hukuki, tıbbi, mali veya bağlayıcı ticari danışmanlık olarak değerlendirilmemesi gerekir.</p>
          <p>İşletmelerin, aşağıdaki konularda insan denetimi uygulaması önerilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>İade ve cayma talepleri,</li>
            <li>Fiyat veya indirim uyuşmazlıkları,</li>
            <li>Şikâyetler,</li>
            <li>Sağlıkla ilgili sorular,</li>
            <li>Hukuki veya mali konular,</li>
            <li>Kişisel veri talepleri,</li>
            <li>Özel nitelikli kişisel veri içeren mesajlar,</li>
            <li>Çocukların güvenliğiyle ilgili mesajlar,</li>
            <li>Tehdit, şiddet, taciz veya acil durum içerikleri,</li>
            <li>Sözleşme kurulmasına veya reddine yol açabilecek yanıtlar.</li>
          </ul>
          <p>Artifex AI, hizmetin teknik olarak hatasız veya kesintisiz çalışacağını ya da yapay zekâ tarafından oluşturulan her yanıtın belirli bir amaca uygun olacağını garanti etmez. Bununla birlikte hizmetin güvenli ve amacına uygun şekilde işletilmesi için makul teknik ve idari tedbirleri uygulamayı hedefler.</p>
          <h2 className="text-xl font-semibold text-white mt-8">9. Üçüncü taraf hizmet sağlayıcıları</h2>
          <p>Artifex AI, hizmetin sunulabilmesi için belirli teknik hizmet sağlayıcılarından yararlanabilir. Bu hizmet sağlayıcıları; sunucu barındırma, bulut altyapısı, yapay zekâ hizmetleri, hata izleme, güvenlik, e-posta, müşteri desteği, ödeme ve muhasebe hizmetleri sunabilir.</p>
          <p>Hâlihazırdaki teknik yapı bakımından:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Sunucu barındırma hizmetinde Almanya’da bulunan netcup GmbH altyapısından yararlanılmaktadır.</li>
            <li>Otomatik yanıt oluşturma hizmetinde Amerika Birleşik Devletleri’nde yerleşik Anthropic PBC hizmetlerinden yararlanılmaktadır.</li>
            <li>Instagram mesajlarının ve yorumlarının platform üzerinden iletilmesinde Meta Platforms ve Instagram altyapısı kullanılmaktadır.</li>
          </ul>
          <p>Bu sağlayıcıların erişimi, sundukları hizmetin gerektirdiği kapsamla sınırlandırılmaya çalışılır.</p>
          <p>Üçüncü tarafların kendi hizmetleri bakımından yayımladığı politika, sözleşme ve kullanım koşulları ayrıca uygulanabilir. Artifex AI, kendi kontrolü dışında bulunan üçüncü taraf sistemlerin güvenlik uygulamalarından veya kesintilerinden, kendi kusuru bulunmadığı sürece sorumlu değildir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">10. Yurt dışındaki hizmet sağlayıcıların kullanılması</h2>
          <p>Hizmetin teknik mimarisi gereği bazı bilgiler Türkiye dışında bulunan sunucu, bulut, yapay zekâ veya diğer teknik hizmet sağlayıcılarına aktarılabilir.</p>
          <p>Yurt dışı aktarımının kapsamı, aktarılan verinin niteliği, aktarım yapılan ülke, hizmet sağlayıcının sözleşme koşulları ve kullanılan teknik yapı zaman içinde değişebilir. Bu nedenle Artifex AI, yurt dışı hizmet sağlayıcılarını ve aktarım mekanizmalarını hizmetin güncel teknik mimarisine göre belirler.</p>
          <p>Yurt dışı aktarım süreçleri bakımından, kişisel verilerin korunmasına ilişkin yürürlükteki mevzuata, sözleşmesel güvenlik tedbirlerine ve ilgili veri aktarım mekanizmalarına uyulması hedeflenir. Ayrıntılı bilgilendirme, ilgili kişinin veya müşteri işletmenin durumuna göre ayrıca yayımlanan <Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link> ve <Link href="/sozlesmeler/artifex-acik-riza" className="text-[#4F8BFF] hover:underline">Açık Rıza Metni’nde</Link> yer alır. Bu aktarım, KVKK m.9 çerçevesinde açık rızanıza dayanır. Aktarıma açık rızanız bulunmadığı hallerde otomatik yanıt hizmetinden yararlanamazsınız.</p>
          <p>Hizmet verdiğimiz işletmelerde ise bu aktarım veri sorumlusu sıfatıyla işletmenin talimatı ve sorumluluğu altında gerçekleşir. Hizmet verdiğimiz her işletmeyi bu aktarım hakkında önceden bilgilendiririz.</p>
          <h2 className="text-xl font-semibold text-white mt-8">11. Bilgi güvenliği</h2>
          <p>Artifex AI, hizmet kapsamında işlenen bilgileri korumak için makul ve uygun teknik ve idari güvenlik tedbirleri uygular.</p>
          <p>Bu tedbirler, hizmetin teknik yapısına bağlı olarak aşağıdaki uygulamaları içerebilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Erişim anahtarlarının kaynak kodda tutulmaması,</li>
            <li>Gizli bilgilerin güvenli yapılandırma araçlarıyla yönetilmesi,</li>
            <li>Yetkilerin görev gereği erişim ilkesiyle sınırlandırılması,</li>
            <li>Sunucu ve uygulama erişiminin yetkili kişilerle sınırlandırılması,</li>
            <li>Güvenli iletişim protokollerinin kullanılması,</li>
            <li>Müşteri işletmelere ait verilerin birbirinden ayrıştırılması,</li>
            <li>Erişim ve işlem kayıtlarının tutulması,</li>
            <li>Olağan dışı faaliyetlerin izlenmesi,</li>
            <li>Sistem güncellemelerinin uygulanması,</li>
            <li>Yedekleme ve felaket kurtarma süreçlerinin yürütülmesi,</li>
            <li>Hizmet sağlayıcıların güvenlik uygulamalarının değerlendirilmesi,</li>
            <li>Yetkisiz erişim şüphesinde erişim bilgilerinin yenilenmesi veya iptal edilmesi.</li>
          </ul>
          <p>Bununla birlikte, internet üzerinden gerçekleştirilen hiçbir veri aktarımının veya elektronik depolama yönteminin mutlak güvenli olduğu garanti edilemez. Kullanıcıların ve müşteri işletmelerin, hizmet üzerinden gereksiz, aşırı veya hizmetin amacıyla ilgisiz hassas bilgi paylaşmaması gerekir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">12. Veri güvenliği olayları</h2>
          <p>Artifex AI, kişisel verilerin veya hizmet bilgilerinin yetkisiz şekilde erişilmesi, kaybolması, değiştirilmesi, açıklanması veya kullanılması şüphesini doğuran olayları makul ölçüde değerlendirmeye ve gerekli müdahale süreçlerini işletmeye çalışır.</p>
          <p>Bir güvenlik olayının meydana gelmesi hâlinde:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Olayın kapsamı ve etkisi incelenebilir,</li>
            <li>İlgili sistemlere erişim sınırlandırılabilir,</li>
            <li>Gerekli teknik düzeltmeler uygulanabilir,</li>
            <li>Etkilenen müşteri işletmeler bilgilendirilebilir,</li>
            <li>Kanunen gerekli bildirimler yapılabilir,</li>
            <li>Olayın tekrarlanmaması için güvenlik tedbirleri güncellenebilir.</li>
          </ul>
          <p>Bildirimlerin kapsamı ve yöntemi, olayın niteliğine, etkilenen verilerin türüne, ilgili taraflara ve yürürlükteki mevzuata göre belirlenir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">13. Verilerinize kimler erişebilir</h2>
          <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <tr><th className="border border-white/10 px-3 py-2 text-left bg-white/[0.04] text-white font-semibold">Kim</th><th className="border border-white/10 px-3 py-2 text-left bg-white/[0.04] text-white font-semibold">Sıfatı</th><th className="border border-white/10 px-3 py-2 text-left bg-white/[0.04] text-white font-semibold">Neden</th></tr>
            <tr><td className="border border-white/10 px-3 py-2 align-top">Hizmet verdiğimiz işletme</td><td className="border border-white/10 px-3 py-2 align-top">Veri sorumlusu</td><td className="border border-white/10 px-3 py-2 align-top">Mesajınızı görür, yanıtlar ve talebinizi yürütür</td></tr>
            <tr><td className="border border-white/10 px-3 py-2 align-top">netcup GmbH (Almanya)</td><td className="border border-white/10 px-3 py-2 align-top">Alt işleyen</td><td className="border border-white/10 px-3 py-2 align-top">Sunucu barındırma</td></tr>
            <tr><td className="border border-white/10 px-3 py-2 align-top">Anthropic PBC (ABD)</td><td className="border border-white/10 px-3 py-2 align-top">Alt işleyen</td><td className="border border-white/10 px-3 py-2 align-top">Cevabın üretilmesi</td></tr>
            <tr><td className="border border-white/10 px-3 py-2 align-top">Meta Platforms</td><td className="border border-white/10 px-3 py-2 align-top">—</td><td className="border border-white/10 px-3 py-2 align-top">Mesajın Instagram üzerinden iletilmesi</td></tr>
            <tr><td className="border border-white/10 px-3 py-2 align-top">Yetkili kamu kurum ve kuruluşları</td><td className="border border-white/10 px-3 py-2 align-top">—</td><td className="border border-white/10 px-3 py-2 align-top">Hukuken zorunlu olan hâllerde</td></tr>
          </table>
          </div>
          <p>Verilerinizi <strong className="text-white">satmıyoruz</strong> ve reklam amacıyla üçüncü taraflara <strong className="text-white">vermiyoruz</strong>.</p>
          <p>Hizmet verdiğimiz her işletmenin kayıtları birbirinden ayrı tutulur. Bir işletme, başka bir işletmenin yazışmalarını göremez.</p>
          <h2 className="text-xl font-semibold text-white mt-8">14. Saklama ve silme uygulamaları</h2>
          <p>Artifex AI,kayıtlarınızı, sizinle yapılan <strong className="text-white">son mesajlaşmadan itibaren 24 ay</strong> süre ile saklar. Bu sürenin sonunda kayıtlar silinir veya geri döndürülemez şekilde anonim hâle getirilir. Hukuki saklama zorunlulukları ve güvenlik zorunlulukları bu kuralın istisnasıdır.</p>
          <p>Artifex AI, bilgileri hizmetin sunulması, güvenliğin sağlanması, hukuki yükümlülüklerin yerine getirilmesi ve uyuşmazlıkların yönetilmesi için gerekli süre boyunca saklayabilir.</p>
          <p>Müşteri işletmelere ait hizmet verilerinin saklama süresi, öncelikle ilgili işletmenin talimatları ve Artifex AI ile işletme arasında yapılan sözleşme kapsamında belirlenir.</p>
          <p>Artifex AI’ın kendi amaçları doğrultusunda tuttuğu teknik, güvenlik, destek, faturalama ve sözleşme kayıtları bakımından farklı saklama süreleri uygulanabilir.</p>
          <p>Saklama süresinin sona ermesi veya verinin işlenmesini gerektiren nedenin ortadan kalkması hâlinde bilgiler, uygulanabilir teknik süreçler çerçevesinde:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Silinebilir,</li>
            <li>Yok edilebilir,</li>
            <li>Anonim hâle getirilebilir,</li>
            <li>Yedekleme sistemlerinin olağan yaşam döngüsü içinde silinebilir.</li>
          </ul>
          <p>Devam eden uyuşmazlık, denetim, soruşturma, güvenlik incelemesi veya kanuni saklama yükümlülüğü bulunması hâlinde bazı kayıtlar yalnızca ilgili amaçla sınırlı olarak tutulabilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">15. Haklarınız ve kime başvuracağınız</h2>
          <h3 className="text-lg font-semibold text-white mt-6">KVKK m.11 uyarınca şu haklara sahipsiniz:</h3>
          <h3 className="text-lg font-semibold text-white mt-6">Kişisel verinizin işlenip işlenmediğini öğrenme</h3>
          <h3 className="text-lg font-semibold text-white mt-6">İşlenmişse buna ilişkin bilgi talep etme</h3>
          <h3 className="text-lg font-semibold text-white mt-6">İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</h3>
          <h3 className="text-lg font-semibold text-white mt-6">Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</h3>
          <h3 className="text-lg font-semibold text-white mt-6">Eksik veya yanlış işlenmişse düzeltilmesini isteme</h3>
          <h3 className="text-lg font-semibold text-white mt-6">Silinmesini veya yok edilmesini isteme</h3>
          <h3 className="text-lg font-semibold text-white mt-6">Düzeltme, silme ve yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</h3>
          <h3 className="text-lg font-semibold text-white mt-6">Münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</h3>
          <h3 className="text-lg font-semibold text-white mt-6">Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</h3>
          <p><strong className="text-white">Hizmet verdiğimiz işletmenin Instagram sayfasına mesaj atmanız durumunda</strong>, Haklarınızı veri sorumlusu olan işletmeye karşı kullanırsınız. Bize ulaşan bir talebi kendiliğimizden sonuçlandıramayız; ancak talebinizi gecikmeksizin ilgili işletmeye iletir ve onun talimatı doğrultusunda gereğini yaparız. Dilerseniz sizi doğrudan işletmeye yönlendiririz.</p>
          <p><strong className="text-white">Artifex AI Instagram sayfasına mesaj atmanız durumunda,</strong> Başvurunuz doğrudan bize gelir ve en geç 30 gün içinde sonuçlandırılır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">16. Verilerinizin silinmesi</h2>
          <p>Silme talebinin nasıl yapılacağı, kapsamının ne olduğu ve ne kadar sürdüğü ayrı bir sayfada anlatılmıştır: <Link href="/sozlesmeler/artifex-veri-silme" className="text-[#4F8BFF] hover:underline">Veri Silme Talebi</Link>.</p>
          <h2 className="text-xl font-semibold text-white mt-8">17. Kullanıcıların ve işletmelerin dikkat etmesi gerekenler</h2>
          <p>Hizmetimiz 18 yaşın altındaki kişilere yönelik değildir ve bu yaş grubundan veri toplanmaz. Hizmeti kullanan kişiler ve işletmeler:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Başka kişilere ait kişisel verileri gereksiz şekilde paylaşmamalı,</li>
            <li>Mesaj ve yorumlara kimlik, banka, sağlık veya güvenlik bilgisi yazmamalı,</li>
            <li>Instagram hesap erişim bilgilerini üçüncü kişilerle paylaşmamalı,</li>
            <li>Yanıtların gönderilmeden önce kontrol edilmesini gerektiren durumlarda insan onayı kullanmalı,</li>
            <li>Yapay zekâ çıktılarının hatalı olabileceğini dikkate almalı,</li>
            <li>Çocuklara veya hassas gruplara ilişkin iletişimlerde özel dikkat göstermeli,</li>
            <li>Hizmeti spam, taciz, tehdit, yanıltıcı reklam veya hukuka aykırı pazarlama amacıyla kullanmamalı,</li>
            <li>Instagram ve Meta’nın güncel platform kurallarına uymalıdır.</li>
          </ul>
          <p>Artifex AI, hukuka aykırı, kötüye kullanıma yönelik, güvenlik riski oluşturan veya platform kurallarını ihlal eden kullanım biçimlerini sınırlandırabilir, inceleyebilir, durdurabilir veya ilgili hesabın hizmet erişimini askıya alabilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">18. Politika değişiklikleri</h2>
          <p>Artifex AI, hizmetin kapsamı, teknik altyapısı, kullanılan hizmet sağlayıcılar, mevzuat veya güvenlik uygulamalarındaki değişiklikler nedeniyle bu Gizlilik Politikasını güncelleyebilir.</p>
          <p>Güncel politika, son güncelleme tarihi belirtilerek yayımlanır. Önemli değişiklikler yapılması hâlinde, mümkün olduğu ölçüde internet sitesi, uygulama içi bildirim, e-posta veya benzeri uygun bir kanal üzerinden ayrıca bilgilendirme yapılabilir.</p>
          <p>Bu Gizlilik Politikası, yayımlandığı tarih itibarıyla yürürlüğe girer.</p>
          <p><strong className="text-white">Son güncelleme tarihi:</strong> 24 Ağustos 2026</p>
          <p><strong className="text-white">ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ</strong></p>
          <p><strong className="text-white">Adres:</strong></p>
          <p>Barbaros Mah. Şebboy Sok. No. 4/1 İç Kapı No. 2, Ataşehir/İstanbul</p>
          <p><strong className="text-white">E-posta:</strong></p>
          <p><a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a></p>
          <p><strong className="text-white">İlgili belgeler:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li><Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link></li>
            <li>Veri İşleme Protokolü</li>
            <li><Link href="/sozlesmeler/artifex-veri-silme" className="text-[#4F8BFF] hover:underline">Veri Silme</Link>, Yok Etme ve Anonimleştirme Politikası</li>
            <li>Kullanım</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">Ayrıca bakınız</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link></li>
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
