'use client';

import Link from 'next/link';
import { TurkishOnlyDocument } from '@/components/LegalNotice';

/**
 * Metin avukat tarafindan revize edildi (24 Agustos 2026) ve ELLE yazilmaz.
 * Kaynak: Projeler/Artifex_Hukuki_Sayfalar/kaynak/Artifex Veri Silme MG.docx
 * Ureten: Projeler/Artifex_Hukuki_Sayfalar/uret_nextjs.py
 */
export default function ArtifexVeriSilmePage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TurkishOnlyDocument />
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Artifex Veri Silme Talebi
        </h1>
        <p className="text-gray-500 text-sm mb-8">Data Deletion Instructions (English label for review purposes)</p>
        <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300 leading-relaxed">

          <p className="text-gray-400 text-sm">Son güncelleme: 24 Ağustos 2026</p>

          <p>Bu Veri Silme, Yok Etme ve Anonimleştirme Politikası, Artifex AI tarafından sunulan yazılım hizmeti kapsamında işlenen kişisel verilerin ve hizmet kayıtlarının silinmesi, yok edilmesi veya anonim hâle getirilmesine ilişkin usul ve esasları açıklar.</p>
          <p>Artifex AI; işletmelerin Instagram hesaplarına gelen doğrudan mesajları ve yorumları teknik olarak alabilir, saklayabilir, sınıflandırabilir, yapay zekâ hizmetleri aracılığıyla işleyebilir ve işletmenin talimatları doğrultusunda yanıt oluşturabilir.</p>
          <p>Bu politika, aşağıdaki belgelerle birlikte değerlendirilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası</Link>,</li>
            <li><Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link>,</li>
            <li><Link href="/sozlesmeler/artifex-kosullar" className="text-[#4F8BFF] hover:underline">Kullanım Koşulları</Link>,</li>
            <li><Link href="/sozlesmeler/artifex-acik-riza" className="text-[#4F8BFF] hover:underline">Açık Rıza Metni</Link></li>
            <li>Varsa taraflar arasında imzalanmış özel sözleşme veya hizmet seviyesi sözleşmesi.</li>
          </ul>
          <p>Kişisel verilerin hangi amaçlarla ve hangi hukuki sebeplerle işlendiğine ilişkin ayrıntılar, ilgili kişi bakımından uygulanabilir olan <Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni’nde</Link> açıklanır.</p>
          <h2 className="text-xl font-semibold text-white mt-8">1. Veri silme talebinin kapsamı</h2>
          <p>Bu politika, Artifex AI sistemlerinde aşağıdaki kayıtların silinmesi, yok edilmesi veya anonimleştirilmesi taleplerini kapsar:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram üzerinden gönderilen doğrudan mesaj içerikleri,</li>
            <li>Yorum içerikleri,</li>
            <li>Mesaj ve yorum kimlikleri,</li>
            <li>Instagram kullanıcı adı ve uygulamaya özgü hesap tanımlayıcıları,</li>
            <li>Mesaj ve yorumların tarih ve saat bilgileri,</li>
            <li>Gönderilen görsel, video veya diğer içeriklere ilişkin teknik bağlantılar,</li>
            <li>Mesajlara verilen veya verilmek üzere oluşturulan yanıtlar,</li>
            <li>Yanıt oluşturma sürecine ilişkin işlem kayıtları,</li>
            <li>Mesajlarla bağlantılı teknik işlem ve hata kayıtları,</li>
            <li>Müşteri hesabı ve işletme hesabı eşleştirme kayıtları,</li>
            <li>İlgili kişi başvurularına ilişkin kayıtlar.</li>
          </ul>
          <p>Silme talebinin kapsamı, talepte belirtilen işletme hesabı, kullanıcı hesabı, iletişim dönemi ve kayıt türleriyle sınırlı olarak değerlendirilir.</p>
          <p>Bir kişinin farklı işletmelerle veya farklı Instagram hesaplarıyla olan yazışmaları, her müşteri işletmenin veri seti ayrı tutulduğu için tek bir silme talebiyle otomatik olarak silinmez. Birden fazla işletme veya hesap bakımından silme talep ediliyorsa, her bir işletme veya hesap talepte açıkça belirtilmelidir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">2. Veri sorumlusu ve veri işleyen bakımından başvurunun yönlendirilmesi</h2>
          <h3 className="text-lg font-semibold text-white mt-6">2.1. Artifex AI altyapısını kullanan bir işletmenin Instagram hesabına yazılması</h3>
          <p>Bir işletmenin Instagram hesabına doğrudan mesaj gönderir veya yorum yazarsanız, söz konusu mesaj ve yorumların hangi amaçla işleneceğine, ne kadar süreyle saklanacağına ve ne zaman silineceğine kural olarak ilgili işletme karar verir.</p>
          <p>Bu durumda ilgili işletme, müşteri hizmetleri, sipariş, rezervasyon, randevu, şikâyet veya bilgi taleplerinin yürütülmesi bakımından veri sorumlusu olabilir. Artifex AI ise ilgili işletmenin talimatları doğrultusunda teknik hizmet sunan veri işleyen sıfatıyla hareket edebilir.</p>
          <p>Bu kapsamda Artifex AI’a ulaşan silme talepleri:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>İlgili işletmeye iletilebilir,</li>
            <li>İlgili işletmenin talimatı doğrultusunda işleme alınabilir,</li>
            <li>Talep sahibinden ek bilgi istenerek doğru kayıtla eşleştirilebilir,</li>
            <li>İlgili işletmenin veri sorumlusu olarak karar vermesi için işletmeye yönlendirilebilir.</li>
          </ul>
          <p>Artifex AI, ilgili işletmenin talimatı veya hukuki zorunluluk bulunmaksızın, işletmenin veri sorumlusu olduğu hizmet kayıtlarını kendi takdirine göre silmez. Talebinizi bize ilettiğinizde onu gecikmeksizin ilgili işletmeye aktarır ve işletmenin talimatı doğrultusunda gereğini yaparız. Dilerseniz talebinizi doğrudan ilgili işletmeye de iletebilirsiniz.</p>
          <h3 className="text-lg font-semibold text-white mt-6">2.2. Doğrudan Artifex AI’ın kendi Instagram hesabına yazılması</h3>
          <p>Doğrudan Artifex AI’ın kendi Instagram hesabına mesaj gönderir veya yorum yazarsanız, ilgili kayıtların Artifex AI tarafından kendi amaçları doğrultusunda işlenen kısmı bakımından Artifex AI veri sorumlusu olarak hareket edebilir.</p>
          <p>Bu durumda silme talebi doğrudan Artifex AI tarafından değerlendirilir. Talebin kabul edilmesi hâlinde, hukuken saklanması zorunlu olan veya başka bir hukuki sebeple tutulması gereken kayıtlar dışında kalan kişisel veriler silinir, yok edilir veya anonim hâle getirilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">3. Kimler veri silme talebinde bulunabilir</h2>
          <p>Aşağıdaki kişiler veri silme, yok etme veya anonimleştirme talebinde bulunabilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Kişisel verisi işlenen ilgili kişi,</li>
            <li>İlgili kişinin kanuni temsilcisi,</li>
            <li>İlgili kişi tarafından usulüne uygun biçimde yetkilendirilmiş vekil veya temsilci,</li>
            <li>Tüzel kişi veya işletme bakımından yetkili temsilci,</li>
            <li>Artifex AI ile hizmet ilişkisi bulunan müşteri işletmenin yetkili temsilcisi.</li>
          </ul>
          <p>Kanuni temsilci veya vekil aracılığıyla yapılan başvurularda, temsil yetkisini gösteren belgenin sunulması istenebilir. Kimlik ve yetki doğrulaması için talep edilen belgeler, yalnızca başvurunun değerlendirilmesi için gerekli olduğu ölçüde işlenir ve başvuru süreci tamamlandıktan sonra uygulanabilir saklama kurallarına göre silinir veya imha edilir. Başvurunun başka bir kişi adına yapıldığı hâllerde Artifex AI, kişisel verilerin yetkisiz kişilere açıklanmasını önlemek amacıyla ek doğrulama talep edebilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">4. Veri silme talebinin iletilmesi</h2>
          <p>Şu anda talep almanın <strong className="text-white">tek yolu e-postadır</strong>:</p>
          <p><strong className="text-white">dolunay@dolunay.ai</strong></p>
          <p>Konu satırı: <strong className="text-white">Veri Silme Talebi</strong></p>
          <p>E-postanızda mutlaka belirtin:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram kullanıcı adınız</li>
            <li>Hangi işletmenin Instagram hesabıyla yazıştığınız</li>
          </ul>
          <p>Bu iki bilgi olmadan kayıtlarınızı doğru şekilde bulup eşleştiremeyiz.</p>
          <h2 className="text-xl font-semibold text-white mt-8">5. Kimlik ve hesap doğrulaması</h2>
          <p>Artifex AI, silme talebinin gerçekten ilgili kişi veya yetkili temsilci tarafından yapıldığını doğrulamak için makul ve ölçülü güvenlik tedbirleri uygulayabilir. Instagram hesabından doğrulama mesajı gönderilmesinin istenmesi, yalnızca kimlik doğrulama amacı taşır. Bu yöntem, hesabın şifresinin veya erişim bilgilerinin Artifex AI’a verilmesini gerektirmez.</p>
          <h2 className="text-xl font-semibold text-white mt-8">6. Talebin kapsamı</h2>
          <p>Bir silme talebi, yalnızca talebin yapıldığı işletmeyle olan yazışmaları kapsar.</p>
          <p>Aynı kişinin başka bir işletmeyle olan kayıtları bu talepten etkilenmez, çünkü kayıtlar işletme bazında ayrı tutulur.</p>
          <p>Birden fazla işletmeyle yazıştıysanız ve hepsinin silinmesini istiyorsanız, bunu talebinizde ayrıca belirtmeniz gerekir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">7. Silinecek Veriler</h2>
          <p>Aşağıdaki kayıtların her biri, yalnızca talebin yapıldığı işletme kapsamıyla sınırlı olarak silinir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Mesaj içerikleriniz (metin, gönderdiğiniz görsel ve videoların bağlantıları, paylaştığınız gönderilere ilişkin bilgiler)</li>
            <li>Yorum içerikleriniz</li>
            <li>Mesaj ve yorum kimlikleriniz ile zaman damgaları</li>
            <li>Uygulamaya özel Instagram hesap tanımlayıcınız ve kullanıcı adınız</li>
            <li>Bu yazışmalara bağlı teknik işlem kayıtları</li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-8">8. Değerlendirme ve cevap süresi</h2>
          <p>Başvurular, Artifex AI’a ulaştığı tarihten itibaren makul süre içinde incelenir ve talebinizi <strong className="text-white">en geç 30 gün</strong> içinde sonuçlandırırız.</p>
          <p>Kayıtların yedeklerden tamamen düşmesi <strong className="text-white">ek 30 günü</strong> bulabilir. Yedekler yalnızca felaket kurtarma amacıyla tutulur; günlük işleyişte kullanılmaz.</p>
          <p>Başvurunun ilgili müşteri işletmenin veri sorumlusu sıfatıyla karar vermesini gerektirmesi hâlinde, Artifex AI başvuruyu işletmeye iletir ve işletmenin talimatı doğrultusunda işlem yapar.</p>
          <h2 className="text-xl font-semibold text-white mt-8">9. Silinemeyen kayıtlar</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Hukuken saklanması zorunlu olan kayıtlar, yasal süre boyunca saklanmaya devam eder</li>
            <li>Kimliğinizle ilişkilendirilemeyecek şekilde anonim hâle getirilmiş istatistikler, artık kişisel veri olmadığı için silme kapsamı dışındadır</li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-8">10. Uygulamanın erişimini kaldırmak</h2>
          <p>Instagram uygulamasında <strong className="text-white">Ayarlar → Web sitesi izinleri → Uygulamalar ve web siteleri</strong> yolundan uygulamanın hesabınıza erişimini dilediğiniz an kaldırabilirsiniz.</p>
          <p><strong className="text-white">Bunun geçmiş kayıtları silmediğini</strong> unutmayın: erişimi kaldırmak yalnızca bundan sonrasını durdurur. Mevcut kayıtların silinmesi için yukarıdaki e-posta yoluyla ayrıca talepte bulunmanız gerekir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">11. Ayrıntılı bilgi</h2>
          <p>Hangi verileri hangi amaçla işlediğimiz, saklama süreleri ve KVKK haklarınız için: <Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası</Link>.</p>

          <h2 className="text-xl font-semibold text-white mt-8">Ayrıca bakınız</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası</Link></li>
            <li><Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link></li>
            <li><Link href="/sozlesmeler/artifex-acik-riza" className="text-[#4F8BFF] hover:underline">Açık Rıza Metni</Link></li>
            <li><Link href="/sozlesmeler/artifex-kosullar" className="text-[#4F8BFF] hover:underline">Kullanım Koşulları</Link></li>
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
