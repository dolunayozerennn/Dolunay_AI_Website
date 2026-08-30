'use client';

import Link from 'next/link';
import { TurkishOnlyDocument } from '@/components/LegalNotice';

/**
 * Metin avukat tarafindan revize edildi (24 Agustos 2026) ve ELLE yazilmaz.
 * Kaynak: Projeler/Artifex_Hukuki_Sayfalar/kaynak/Açık Rıza Metni MG.docx
 * Ureten: Projeler/Artifex_Hukuki_Sayfalar/uret_nextjs.py
 */
export default function ArtifexAcikRizaPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TurkishOnlyDocument />
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Artifex AI Açık Rıza Metni
        </h1>
        <p className="text-gray-500 text-sm mb-8">Explicit Consent Text (English label for review purposes)</p>
        <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300 leading-relaxed">

          <p className="text-gray-400 text-sm">Son güncelleme: 24 Ağustos 2026</p>

          <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında tarafıma sunulan <strong className="text-white">Artifex AI <Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link></strong>’ni, <strong className="text-white">Artifex AI <Link href="/sozlesmeler/artifex-kosullar" className="text-[#4F8BFF] hover:underline">Kullanım Koşulları</Link></strong>’nı ve <strong className="text-white">Artifex AI <Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası</Link></strong>’nı okuduğumu; kişisel verilerimin hangi amaçlarla işlendiği, hangi kişisel veri kategorilerinin işlenebileceği, hangi hizmet sağlayıcılara aktarılabileceği, kişisel verilerimin yurt dışında bulunan hizmet sağlayıcılara aktarılmasının muhtemel sonuçları ve sahip olduğum haklar hakkında bilgilendirildiğimi kabul ederim.</p>
          <p>Bu açık rıza metni, yalnızca kişisel verilerimin yurt dışında bulunan teknik hizmet sağlayıcılarına aktarılmasına ilişkindir. Bu metin, Artifex AI’ın kişisel verileri işleme amaçlarını ve hukuki sebeplerini açıklayan <Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link>’nin yerine geçmez.</p>
          <h2 className="text-xl font-semibold text-white mt-8">1. Aktarımın amacı</h2>
          <p>Instagram üzerinden Artifex AI’a veya Artifex AI altyapısını kullanan bir işletmenin Instagram hesabına gönderdiğim doğrudan mesaj ve yorumlarda yer alan kişisel verilerimin;</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Gelen mesaj ve yorumlara otomatik veya yarı otomatik yanıt oluşturulması,</li>
            <li>Yapay zekâ destekli yanıtların hazırlanması,</li>
            <li>Mesaj ve yorumların teknik olarak alınması, işlenmesi ve saklanması,</li>
            <li>Mesaj ve yorumların ilgili müşteri işletmeye iletilmesi,</li>
            <li>Hizmetin teknik olarak işletilmesi,</li>
            <li>Sistem güvenliğinin ve hizmet sürekliliğinin sağlanması,</li>
            <li>Teknik hata, işlem ve güvenlik kayıtlarının oluşturulması,</li>
            <li>Müşteri destek süreçlerinin yürütülmesi,</li>
            <li>Yetkisiz erişim, kötüye kullanım ve suistimalin önlenmesi,</li>
          </ul>
          <p>amaçlarıyla yurt dışında bulunan hizmet sağlayıcılara aktarılmasına açık rıza veriyorum.</p>
          <h2 className="text-xl font-semibold text-white mt-8">2. İşlenebilecek ve aktarılabilecek kişisel veri kategorileri</h2>
          <p>Yurt dışındaki hizmet sağlayıcılara, hizmetin teknik olarak sunulması için gerekli ve ölçülü olmak kaydıyla aşağıdaki kişisel veri kategorileri aktarılabilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Instagram kullanıcı adım,</li>
            <li>Instagram hesap tanımlayıcım,</li>
            <li>Profilimde kamuya açık olarak yer alan bilgiler,</li>
            <li>Doğrudan mesaj içeriklerim,</li>
            <li>Yorum içeriklerim,</li>
            <li>Mesaj ve yorum kimliklerim,</li>
            <li>Mesaj ve yorumların gönderilme tarih ve saatleri,</li>
            <li>Paylaştığım görsel, video veya diğer içeriklere ilişkin teknik bağlantılar,</li>
            <li>Mesaj veya yorumumun yanıtlanması için gerekli bağlam bilgileri,</li>
            <li>Oluşturulan veya oluşturulması istenen yanıt içerikleri,</li>
            <li>Teknik işlem, hata, erişim ve güvenlik kayıtları.</li>
          </ul>
          <p>Mesaj veya yorum içeriğimde özel nitelikli kişisel veri, sağlık bilgisi, finansal bilgi, kimlik bilgisi, çocuklara ilişkin bilgi veya üçüncü kişilere ait kişisel veri bulunması hâlinde, bu veriler de teknik işleme sırasında aktarılabilir. Bununla birlikte Artifex AI, hizmetin amacı için gerekli olmayan kişisel verilerin aktarılmamasını ve mümkün olduğu ölçüde veri minimizasyonu uygulanmasını hedefler.</p>
          <p>Hizmetin gerektirmediği hâllerde hassas veya özel nitelikli kişisel verileri mesaj veya yorum yoluyla paylaşmamam gerektiğini biliyorum.</p>
          <h2 className="text-xl font-semibold text-white mt-8">3. Aktarım yapılabilecek yurt dışındaki alıcılar</h2>
          <p>Kişisel verilerim, hizmetin teknik mimarisine ve kullanılan hizmetin niteliğine göre aşağıdaki yurt dışındaki alıcılara aktarılabilir:</p>
          <h3 className="text-lg font-semibold text-white mt-6">3.1. netcup GmbH – Almanya</h3>
          <p>Mesaj, yorum, yanıt, hesap, işlem ve teknik kayıtların barındırılması, depolanması, sunucu altyapısında tutulması, yedeklenmesi ve hizmetin teknik olarak işletilmesi amacıyla Almanya’da bulunan <strong className="text-white">netcup GmbH</strong> altyapısından yararlanılabilir.</p>
          <p>Bu kapsamda kişisel verilerim, netcup GmbH tarafından sağlanan sunucu ve barındırma altyapısında saklanabilir veya bu altyapı üzerinden teknik olarak erişilebilir hâle gelebilir.</p>
          <p>Netcup GmbH’ye aktarılabilecek veriler, hizmetin barındırılması ve teknik olarak işletilmesi için gerekli olan mesaj ve yorum kayıtları, hesap tanımlayıcıları, yanıt kayıtları, işlem kayıtları, hata kayıtları, güvenlik kayıtları ve teknik bilgilerle sınırlı tutulmaya çalışılır.</p>
          <h3 className="text-lg font-semibold text-white mt-6">3.2. Anthropic PBC – Amerika Birleşik Devletleri</h3>
          <p>Mesaj ve yorumlara otomatik veya yarı otomatik yanıt oluşturulması amacıyla Amerika Birleşik Devletleri’nde bulunan <strong className="text-white">Anthropic PBC</strong> hizmetlerinden yararlanılabilir.</p>
          <p>Bu kapsamda Anthropic PBC’ye aktarılabilecek veriler, yanıt oluşturmak için gerekli olan mesaj veya yorum içeriği, kullanıcı adı veya hesap tanımlayıcısı, gerekli bağlam bilgileri ve teknik işlem verileriyle sınırlı tutulmaya çalışılır.</p>
          <p>Anthropic PBC’ye aktarım, Artifex AI hizmetinin otomatik yanıt oluşturma işlevinin kullanılabilmesi amacıyla gerçekleştirilir. Artifex AI, kullanılan hizmet ve sözleşme koşulları elverdiği ölçüde, aktarılan içeriklerin genel yapay zekâ modeli eğitimi, reklam profili oluşturulması veya başka müşterilerin hizmetlerinin geliştirilmesi amacıyla kullanılmamasını hedefler.</p>
          <h2 className="text-xl font-semibold text-white mt-8">4. Aktarım yapılan ülkeler</h2>
          <p>Kişisel verilerim aşağıdaki ülkelerde bulunan hizmet sağlayıcıların altyapılarına aktarılabilir:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Almanya: netcup GmbH sunucu ve barındırma altyapısı,</li>
            <li>Amerika Birleşik Devletleri: Anthropic PBC yapay zekâ hizmeti.</li>
          </ul>
          <p>Almanya’da bulunan altyapı Avrupa Birliği içinde yer almakla birlikte, Almanya’ya yapılan aktarım da Türkiye dışına veri aktarımı niteliğindedir. Bu nedenle Almanya’daki barındırma hizmeti de yurt dışına veri aktarımı kapsamında ayrıca dikkate alınır.</p>
          <p>Hizmet sağlayıcıların teknik altyapısı, veri işleme şartları veya alt hizmet sağlayıcıları zaman içinde değişebilir. Böyle bir değişiklikte aktarılacak veri kategorileri, aktarım amacı, aktarım yapılan ülke ve hukuki güvence mekanizması yeniden değerlendirilir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">5. Aktarımın muhtemel sonuçları ve riskleri</h2>
          <p>Kişisel verilerimin yurt dışındaki hizmet sağlayıcılara aktarılması sonucunda verilerim, Türkiye dışındaki sunucu, bulut, yapay zekâ veya teknik hizmet altyapılarında işlenebilir.</p>
          <p>Bu aktarımın muhtemel sonuçları şunlardır:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Mesaj ve yorum içeriklerimin yurt dışındaki sunucularda işlenmesi veya saklanması,</li>
            <li>Mesaj içeriğimin otomatik yanıt oluşturulması amacıyla yurt dışındaki yapay zekâ hizmetine gönderilmesi,</li>
            <li>Teknik hata, erişim, güvenlik veya işlem kayıtlarının yurt dışındaki altyapılarda tutulması,</li>
            <li>Yedekleme veya teknik destek süreçlerinde verilerimin ilgili hizmet sağlayıcının sözleşmesel ve teknik koşullarına tabi olması,</li>
            <li>Yurt dışındaki hizmet sağlayıcının bulunduğu ülkenin mevzuatı ve teknik uygulamaları nedeniyle, verilerimin Türkiye’deki uygulamalardan farklı koruma ve başvuru mekanizmalarına tabi olabilmesi.</li>
          </ul>
          <p>Artifex AI, aktarılan verilerin kapsamını hizmetin gerektirdiği ölçüde sınırlamayı; uygun sözleşmesel, teknik ve idari güvenlik tedbirlerini uygulamayı; gereksiz kişisel verilerin aktarılmasını önlemeyi hedefler.</p>
          <h2 className="text-xl font-semibold text-white mt-8">6. Açık rızanın verilmesi ve geri alınması</h2>
          <p>Yukarıda açıklanan kişisel veri kategorilerinin, belirtilen amaçlarla ve belirtilen yurt dışındaki hizmet sağlayıcılara aktarılmasına <strong className="text-white">açık rıza veriyorum</strong>.</p>
          <p>Açık rızamı herhangi bir zamanda geri alabileceğimi biliyorum. Rızanın geri alınması, geri alma tarihinden önce bu rızaya dayanılarak gerçekleştirilen veri işleme faaliyetlerinin hukuka uygunluğunu etkilemez.</p>
          <p>Rızamı geri almak için aşağıdaki iletişim adresine başvurabilirim:</p>
          <p><strong className="text-white">E-posta:</strong> <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a></p>
          <p>Rızamı geri almam hâlinde, yurt dışındaki yapay zekâ hizmet sağlayıcısının veya yurt dışındaki barındırma altyapısının kullanılmasını gerektiren otomatik yanıt hizmeti veya bazı teknik hizmet işlevleri sunulamayabilir. Bu durumda, teknik olarak mümkün olduğu ölçüde insan desteği veya doğrudan e-posta iletişimi gibi alternatif iletişim kanalları kullanılabilir.</p>
          <p>Rızamın geri alınması, daha önce Instagram, Meta, netcup GmbH, Anthropic PBC veya başka bir hizmet sağlayıcı tarafından gerçekleştirilmiş işlemlerin geçmişe etkili olarak hukuka aykırı hâle gelmesine neden olmaz. Rızanın geri alınmasından sonra devam eden işleme faaliyetleri bakımından Artifex AI, uygulanabilir başka bir hukuki sebep bulunup bulunmadığını ayrıca değerlendirir.</p>
          <h2 className="text-xl font-semibold text-white mt-8">7. Açık rıza beyanı</h2>
          <p>Yukarıdaki açıklamaları okuduğumu, yurt dışına veri aktarımının amacı, kapsamı, aktarılabilecek kişisel veri kategorileri, aktarım yapılabilecek ülkeler, netcup GmbH ve Anthropic PBC’nin hizmet sağlayıcı olarak rolü ve aktarımın muhtemel sonuçları hakkında bilgilendirildiğimi kabul ederim.</p>
          <p>Aşağıdaki seçeneği işaretleyerek açık rızamı veriyorum:</p>
          <p><strong className="text-white">[ ]</strong> Kişisel verilerimin; otomatik yanıt oluşturulması, hizmetin teknik olarak yürütülmesi, sunucu ve barındırma hizmetlerinin sağlanması, mesaj ve yorum kayıtlarının işlenmesi ve hizmet güvenliğinin sağlanması amacıyla Almanya’da bulunan netcup GmbH’ye ve Amerika Birleşik Devletleri’nde bulunan Anthropic PBC’ye aktarılmasına ve bu hizmet sağlayıcılar tarafından işlenmesine açık rıza veriyorum.</p>
          <p><strong className="text-white">Ad-soyad:</strong></p>
          <p>[Ad SOYAD]</p>
          <p><strong className="text-white">Instagram kullanıcı adı:</strong></p>
          <p>[Instagram kullanıcı adı]</p>
          <p><strong className="text-white">E-posta adresi:</strong></p>
          <p>[E-posta adresi]</p>
          <p><strong className="text-white">Rıza tarihi:</strong></p>
          <p>[Tarih]</p>
          <p>Rıza veren kişinin imzası veya</p>

          <h2 className="text-xl font-semibold text-white mt-8">Ayrıca bakınız</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">Gizlilik Politikası</Link></li>
            <li><Link href="/sozlesmeler/artifex-kvkk-aydinlatma" className="text-[#4F8BFF] hover:underline">KVKK Aydınlatma Metni</Link></li>
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
