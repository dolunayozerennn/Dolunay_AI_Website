'use client';

import Link from 'next/link';
import { TurkishOnlyDocument } from '@/components/LegalNotice';

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

          <p className="text-gray-400 text-sm">Son güncelleme: 9 Ağustos 2026</p>

          <p>
            Artifex, işletmelere Instagram, Facebook Messenger ve WhatsApp mesajlarını
            otomatik cevaplama hizmeti verir. Bu sırada mesajlarınız saklanır. Bu sayfa,
            saklanan verilerinizi nasıl sildireceğinizi anlatır. Hangi verinin tutulduğu{' '}
            <Link href="/sozlesmeler/artifex-gizlilik" className="text-[#4F8BFF] hover:underline">
              Artifex Mesaj Otomasyonu Gizlilik Politikası
            </Link>{' '}
            sayfasında yazılıdır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Kimler Talep Gönderebilir</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Bir işletmenin Instagram, Messenger veya WhatsApp hesabına yazmış olan kişi</li>
            <li>Hizmeti kullanan işletme, kendi hesabındaki tüm veriler için</li>
          </ul>
          <p>
            Talebiniz, mesaj yazdığınız işletmeye ait veriyi ilgilendirir. Talebi alır,
            gerekiyorsa ilgili işletmeyi bilgilendirir ve silme işlemini yürütürüz.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Önce Kimlik Doğrulaması</h2>
          <p>
            Başkasının verisinin silinmesini ya da görülmesini önlemek için, talebi gönderen
            kişinin gerçekten o hesabın sahibi olduğunu doğrulamamız gerekir. Bunun için sizden
            hesabınızdan gönderilecek kısa bir teyit mesajı ya da benzeri basit bir doğrulama
            adımı isteyebiliriz. Doğrulama yapılamazsa talebi karşılayamayız; sebebini size
            yazılı olarak bildiririz.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Yol 1: Bize Yazılı Başvurun</h2>
          <p>Bu en hızlı yoldur. Üç adım vardır.</p>
          <ol className="list-decimal list-inside space-y-3">
            <li>
              <strong className="text-white">Başvurunuzu gönderin.</strong> Şu yollardan biri
              geçerlidir: KEP adresimize (artifexyapayzeka@hs01.kep.tr) yazmak, güvenli
              elektronik imza veya mobil imza ile imzalayıp göndermek, ıslak imzalı dilekçeyi
              adresimize posta ile yollamak, ya da daha önce bize bildirdiğiniz ve sistemimizde
              kayıtlı olan e-posta adresinizden{' '}
              <a href="mailto:dolunay@dolunay.ai?subject=Veri%20Silme%20Talebi" className="text-[#4F8BFF] hover:underline">
                dolunay@dolunay.ai
              </a>{' '}
              adresine yazmak. Konu satırına <strong className="text-white">Veri Silme Talebi</strong> yazın.
            </li>
            <li>
              <strong className="text-white">Kanunen bulunması gerekenleri yazın:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Adınız ve soyadınız, başvuru yazılı ise imzanız</li>
                <li>T.C. kimlik numaranız; yabancıysanız uyruğunuz ve pasaport numaranız</li>
                <li>Tebligata esas yerleşim yeri veya iş yeri adresiniz</li>
                <li>Varsa e-posta adresiniz ve telefon numaranız</li>
                <li>Talebinizin konusu</li>
              </ul>
            </li>
            <li>
              <strong className="text-white">Sizi sistemde bulabilmemiz için şunları ekleyin:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Kullandığınız platform: Instagram, Messenger veya WhatsApp</li>
                <li>Kullanıcı adınız; arada değiştirdiyseniz eski adınızı da yazın. WhatsApp ise telefon numaranız</li>
                <li>Yazdığınız işletmenin hesap adı</li>
                <li>Yaklaşık tarih aralığı (biliyorsanız)</li>
              </ul>
            </li>
          </ol>
          <p>
            Başvurunuzu Türkçe gönderin. Eksik bilgiyle gelen başvuruyu sonuçlandıramayız, ama
            neyin eksik olduğunu size bildiririz.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Yol 2: İzni Platform Üzerinden Geri Alın</h2>
          <p>
            Hizmeti kullanan işletmeyseniz, bağlantıyı kendi hesabınızdan kesebilirsiniz.
            Hangi platformdan bağlandığınıza göre yol değişir.
          </p>
          <p><strong className="text-white">Instagram üzerinden bağlandıysanız:</strong></p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Instagram uygulamasında Ayarlar bölümünü açın.</li>
            <li>Uygulama ve medya başlığı altındaki internet sitesi izinleri bölümüne girin.</li>
            <li>Uygulamalar ve internet siteleri bölümünde Aktif listesine bakın.</li>
            <li>Uygulamamızı bulun ve kaldırın.</li>
          </ol>
          <p><strong className="text-white">Facebook sayfası veya WhatsApp üzerinden bağlandıysanız:</strong></p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Facebook ayarlarında iş bağlantıları ya da iş birliği entegrasyonları bölümünü açın.</li>
            <li>Listede uygulamamızı bulun ve kaldırın.</li>
          </ol>
          <p>
            Ekranlar zamanla değişebilir. Uygulamayı listede bulamazsanız bize yazın, yol
            gösterelim.
          </p>
          <p>
            İzni kaldırdığınız anda erişim anahtarı Meta tarafında geçersiz olur ve sistemimiz
            o hesaba erişemez. Aynı işlem, o hesaba ait sohbet ve yorum kayıtlarının silinmesini
            de başlatır; silme en geç 30 gün içinde tamamlanır. Ayrıca e-posta göndermenize
            gerek yoktur, ama isterseniz Yol 1 ile silme onayı talep edebilirsiniz.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Ne Siliniyor</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Mesajlarınızın ve yorumlarınızın metni</li>
            <li>Size gönderilen otomatik cevapların kaydı</li>
            <li>Hesabınıza ait platform kullanıcı numarası ve kullanıcı adı</li>
            <li>Sohbete bağlı ek bilgiler ve zaman kayıtları</li>
            <li>İşletme talebiyse ayrıca erişim anahtarı ve tüm bağlantı kaydı</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">Ne Silinemiyor</h2>
          <p>
            Aşağıdakiler genellikle silinemez. Yine de her talebi tek tek değerlendiririz. Bir
            talebi reddedersek sebebini yazılı olarak ve otuz gün içinde bildiririz.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong className="text-white">Instagram, Messenger ve WhatsApp uygulamasındaki
              mesajlarınızın kendisi.</strong> Onlar Meta&apos;nın sunucusundadır, bizim
              elimizde değildir. Onları uygulamanın içinden silmeniz gerekir.
            </li>
            <li>
              <strong className="text-white">Cevabı üreten yapay zeka sağlayıcılarında geçici
              olarak kalan kopyalar.</strong> Bu servisler istemleri kötüye kullanım denetimi
              için kısa bir süre saklayabilir ve kendi süreleri dolunca siler.
            </li>
            <li>
              <strong className="text-white">Kanunen saklamak zorunda olduğumuz kayıtlar.</strong>{' '}
              Fatura ve muhasebe belgeleri vergi mevzuatı gereği beş yıl, ticari defter ve
              yazışmalar Türk Ticaret Kanunu gereği on yıl saklanır. Süreler kaydın oluştuğu
              takvim yılının bitişiyle başlar. Bu kayıtlar mesaj içeriği taşımaz.
            </li>
            <li>
              <strong className="text-white">Kimliğe bağlı olmayan sayısal özetler.</strong>{' '}
              Kaç mesaj geldiği gibi toplam sayılar sizinle ilişkilendirilemez, bu yüzden silinmez.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">Süreler</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Talebin alındığının teyidi: en kısa sürede</li>
            <li>Silmenin tamamlanması: en kısa sürede ve her halde en geç 30 gün içinde, ücretsiz</li>
            <li>Yedekler: silme sonrası veri canlı sistemden kalkar, otomatik yedeklerdeki kopyalar yedek döngüsü yenilendikçe kaybolur</li>
          </ul>
          <p>
            İşlem bittiğinde size aynı yoldan dönüş yaparız. Cevabın kağıda basılıp gönderilmesi
            gerekirse ilk on sayfa ücretsizdir, sonraki her sayfa için mevzuatta belirlenen
            işlem ücreti alınabilir.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Tanıtım İletisi Almak İstemiyorsanız</h2>
          <p>
            Bu, veri silme talebinden ayrı bir haktır. Tanıtım içeren ileti almak istemezseniz
            aynı kanaldan bize yazmanız yeterlidir. Ücret alınmaz, gerekçe sorulmaz ve gönderim
            en geç üç iş günü içinde durdurulur.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Talebiniz Karşılanmazsa</h2>
          <p>
            Önce bize ya da mesaj yazdığınız işletmeye başvurmanız gerekir; kanun doğrudan
            şikayete gidilmesine izin vermez. Başvurunuz reddedilirse, cevap yetersiz gelirse ya
            da otuz gün içinde cevap alamazsanız, cevabı öğrendiğiniz tarihten itibaren otuz ve
            her halde başvuru tarihinden itibaren altmış gün içinde Kişisel Verileri Koruma
            Kurulu&apos;na şikayette bulunabilirsiniz. Kişilik haklarınız zarar gördüyse tazminat
            hakkınız ayrıca saklıdır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">İletişim Bilgileri</h2>
          <p>
            <strong className="text-white">Unvan:</strong> ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ<br />
            <strong className="text-white">Adres:</strong> Barbaros Mah. Şebboy Sk. No:4/1 İç Kapı No:2, Ataşehir / İstanbul<br />
            <strong className="text-white">Vergi kimlik numarası:</strong> 0851465973 (Kozyatağı Vergi Dairesi)<br />
            <strong className="text-white">MERSİS:</strong> 0085146597300001<br />
            <strong className="text-white">E-posta:</strong>{' '}
            <a href="mailto:dolunay@dolunay.ai?subject=Veri%20Silme%20Talebi" className="text-[#4F8BFF] hover:underline">
              dolunay@dolunay.ai
            </a><br />
            <strong className="text-white">KEP:</strong> artifexyapayzeka@hs01.kep.tr
          </p>

        </div>
      </div>
    </div>
  );
}
