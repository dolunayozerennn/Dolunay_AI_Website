'use client';

import Link from 'next/link';
import { TurkishOnlyDocument } from '@/components/LegalNotice';

/**
 * Metin avukat tarafindan revize edildi (24 Agustos 2026) ve ELLE yazilmaz.
 * Kaynak: Projeler/Artifex_Hukuki_Sayfalar/kaynak/Artifex Kullanım Şartları.docx
 * Ureten: Projeler/Artifex_Hukuki_Sayfalar/uret_nextjs.py
 */
export default function ArtifexKullanimKosullariPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TurkishOnlyDocument />
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Artifex AI Kullanım Koşulları
        </h1>
        <p className="text-gray-500 text-sm mb-8">Terms of Use (English label for review purposes)</p>
        <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300 leading-relaxed">

          <p className="text-gray-400 text-sm">Son güncelleme: 24 Ağustos 2026</p>

          <p>Bu Kullanım Koşulları (&quot;Koşullar&quot;), ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ (&quot;Artifex&quot;) tarafından sunulan Artifex AI App hizmetinin işletmeler ve onların yetkili kullanıcıları tarafından kullanılmasına ilişkin hak ve yükümlülükleri düzenler.</p>
          <p>Hizmet yalnızca ticari veya mesleki amaçlarla hareket eden işletmelere sunulur. Bir işletmenin Instagram hesabına mesaj gönderen veya yorum yapan kişiler bu Koşulların tarafı değildir. Bu kişilerin verilerinin işlenmesine ilişkin açıklamalar Artifex <Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası</Link> ile ilgili işletmenin kendi aydınlatma metinlerinde yer alır. Uygulamayı kullanmaya başladığınızda bu koşulları kabul etmiş sayılırsınız.</p>
          <p>Bu Koşullar, İşletme ile Artifex arasında kurulan hizmet ilişkisinin bir parçasıdır. Taraflar arasında ayrıca imzalanmış bir ana hizmet sözleşmesi, Sipariş Formu, hizmet seviyesi taahhüdü veya veri işleme protokolü bulunması hâlinde bütün belgeler birlikte uygulanır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">1. Hizmetin tanımı</h2>
          <p>Artifex AI App, işletmelerin Instagram hesaplarına gelen doğrudan mesajların ve yorumların otomatik olarak yanıtlanmasını sağlayan bir yazılım hizmetidir.</p>
          <p>Hizmet işletmelere sunulur, son kullanıcılara değil. Bir işletmenin Instagram hesabına yazan kişi bu koşulların tarafı değildir; o kişinin verilerinin nasıl işlendiği <Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası&apos;nda</Link> açıklanmıştır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">2. Kimler kullanabilir</h2>
          <p>Uygulamayı yalnızca aşağıdaki koşulların tamamını sağlayanlar kullanabilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram işletme hesabına sahip olmak</li>
            <li>Artifex AI ile kurulmuş bir hizmet ilişkisi bulunmak</li>
            <li>18 yaşını doldurmuş olmak</li>
            <li>İşletme adına işlem yapmaya yetkili temsilci sıfatını taşımak</li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-8">3. İşletmenin yükümlülükleri</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Bağladığı Instagram hesabı üzerinde bunu yapmaya yetkili olmak</li>
            <li>Meta&apos;nın platform şartlarına ve yürürlükteki mevzuata uymak</li>
            <li>Hizmeti spam, yanıltıcı içerik veya hukuka aykırı amaçlarla kullanmamak</li>
            <li>Kendi son kullanıcılarına karşı aydınlatma yükümlülüğünü yerine getirmek</li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-8">4. Bizim yükümlülüklerimiz ve sınırları</h2>
          <p>Hizmeti makul özenle sunarız. Bununla birlikte:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Hizmetin kesintisiz ve hatasız olacağına dair bir garanti vermeyiz.</li>
            <li>Hizmet Meta&apos;nın altyapısına bağlıdır. Meta kaynaklı kesintilerden, erişim kısıtlarından veya politika değişikliklerinden sorumlu değiliz.</li>
            <li>Otomatik üretilen yanıtların içeriğinden doğan sonuçlarda sorumluluğumuz, ilgili döneme ait hizmet bedeliyle sınırlıdır.</li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-8">5. Fikri mülkiyet</h2>
          <p>Hizmet, yazılım, kaynak kodu, kullanıcı arayüzü, tasarım, veri tabanı yapısı, dokümantasyon, marka, alan adı ve Artifex tarafından geliştirilen diğer unsurlar üzerindeki fikrî ve sınai mülkiyet hakları Artifex’e veya ilgili lisans verenlere aittir.</p>
          <p>Artifex, geçerli abonelik süresince İşletmeye Hizmeti yalnızca kendi iç ticari faaliyetleri için kullanmak üzere sınırlı, münhasır olmayan, devredilemez ve alt lisans verilemez bir kullanım hakkı tanır. Bu hak; Hizmetin kopyalanması, yeniden satılması, rakip ürün geliştirmek amacıyla incelenmesi, kaynak kodunun çıkarılması veya Artifex markalarının izinsiz kullanılması yetkisini içermez.</p>
          <p>İşletme tarafından isteğe bağlı olarak iletilen öneri ve geri bildirimler, gizli bilgi veya kişisel veri içermemesi kaydıyla, İşletmeye bir ücret borcu doğurmaksızın Hizmetin geliştirilmesi amacıyla kullanılabilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">6. Askıya alma ve fesih</h2>
          <p>Kötüye kullanımın tespiti hâlinde erişimi süreli veya süresiz olarak askıya alabiliriz.</p>
          <p>Taraflardan her biri hizmeti dilediği zaman sonlandırabilir.</p>
          <p>Sonlandırma hâlinde verilerin saklanması, <Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası&apos;nda</Link> belirtilen sürelere tabidir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">7. Ücretlendirme</h2>
          <p>Hizmet bedeli ayrı bir sözleşmeyle belirlenir. Bu sayfa herhangi bir fiyat taahhüdü içermez. Kullanım Sözleşmesi, ana hizmet sözleşmesi olmadan herhangi bir geçerlilik taşımaz ve teklif olarak değerlendirilemez. Fiyatlara aksi açıkça belirtilmedikçe KDV ve diğer vergi, resim ve harçlar dâhil değildir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">8. Değişiklikler</h2>
          <p>Bu koşullar Artifex AI tarafından güncellenebilir. Güncelleme yapıldığında sayfanın başındaki tarih değişir; önemli değişikliklerde ayrıca bilgilendirme yapılır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">9. Uygulanacak hukuk ve yetkili mahkeme</h2>
          <p>Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Doğabilecek uyuşmazlıklarda İstanbul Anadolu mahkemeleri ve icra daireleri yetkilidir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">10. Diğer Hükümler</h2>
          <p>Yapay zekâ tarafından oluşturulan yanıtlar olasılıksal niteliktedir; eksik, hatalı, güncelliğini yitirmiş veya bağlama uygun olmayan içerikler üretebilir. Hizmet, belirli bir ticari sonuç, satış artışı, müşteri memnuniyeti, kesintisiz yanıt veya içeriğin mutlak doğruluğu konusunda garanti vermez.</p>
          <p>Tarafların makul kontrolü dışında kalan; doğal afet, salgın, savaş, terör, iç karışıklık, genel grev, enerji veya internet altyapısı kesintisi, geniş çaplı siber saldırı, kamu otoritesi işlemi ve benzeri olaylar nedeniyle yükümlülüğün ifası gecikirse etkilenen taraf, kusuru bulunmadığı ve etkileri azaltmak için makul çabayı gösterdiği ölçüde gecikmeden sorumlu olmaz.</p>
          <p>Etkilenen taraf durumu ve tahmini süreyi makul olan en kısa sürede bildirir. Mücbir sebebin 30 günden uzun sürmesi ve Hizmetin esaslı bölümünü engellemesi hâlinde taraflardan her biri etkilenen kısmı yazılı bildirimle sona erdirebilir. Mücbir sebep öncesinde doğmuş ödeme yükümlülükleri devam eder.</p>
          <h2 className="text-xl font-semibold text-white mt-8">11. İletişim</h2>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
            <p>ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ<br />
            Barbaros Mah. Şebboy Sk. No: 4/1 İç Kapı No: 2, Ataşehir/İstanbul<br />
            E-posta: <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a></p>
          </div>

          <h2 className="text-xl font-semibold text-white mt-8">Ayrıca bakınız</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası</Link></li>
            <li><Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link></li>
            <li><Link href="/sozlesmeler/artifex-acik-riza" className="text-[#4F8BFF] hover:underline">Açık Rıza Metni</Link></li>
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
