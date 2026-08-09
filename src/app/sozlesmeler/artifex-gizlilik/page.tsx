'use client';

import Link from 'next/link';
import { TurkishOnlyDocument } from '@/components/LegalNotice';

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

          <p className="text-gray-400 text-sm">Son güncelleme: 9 Ağustos 2026</p>

          <p>
            Bu politika, Artifex&apos;in işletmelere sunduğu mesaj otomasyonu hizmetinde
            Instagram, Facebook Messenger ve WhatsApp üzerinden gelen mesajların nasıl
            işlendiğini anlatır. Yalnızca bu hizmeti kapsar. dolunay.ai sitesinin kendi
            ziyaretçi verileri için{' '}
            <Link href="/sozlesmeler/kvkk" className="text-[#4F8BFF] hover:underline">
              Gizlilik ve KVKK Politikası
            </Link>{' '}
            geçerlidir.
          </p>

          <p>
            Bu sayfa aynı zamanda 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun
            10. maddesi kapsamında aydınlatma metnidir. Hizmeti kullanan işletme, kendi
            hesabına yazan kişilere yönelik aydınlatmayı kendi kanallarında ayrıca yapar.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">1. Hizmeti Sunan Şirket</h2>
          <p>
            <strong className="text-white">Unvan:</strong> ARTİFEX YAPAY ZEKA ÇÖZÜMLERİ LİMİTED ŞİRKETİ<br />
            <strong className="text-white">Adres:</strong> Barbaros Mah. Şebboy Sk. No:4/1 İç Kapı No:2, Ataşehir / İstanbul<br />
            <strong className="text-white">Vergi kimlik numarası:</strong> 0851465973 (Kozyatağı Vergi Dairesi)<br />
            <strong className="text-white">MERSİS:</strong> 0085146597300001<br />
            <strong className="text-white">E-posta:</strong>{' '}
            <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">dolunay@dolunay.ai</a><br />
            <strong className="text-white">KEP:</strong> artifexyapayzeka@hs01.kep.tr
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">2. Kim Neyden Sorumlu</h2>
          <p>Bu hizmette üç taraf vardır ve sorumlulukları farklıdır.</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong className="text-white">Müşteri işletme (veri sorumlusu):</strong> Kendi
              Instagram, Facebook veya WhatsApp hesabına yazan kişilerin verisinde karar veren
              taraftır. Hangi mesajın otomatik cevaplanacağına o karar verir. Kendi hesabına
              yazan kişileri otomatik cevap kullanıldığı konusunda bilgilendirmek de onun
              sorumluluğundadır.
            </li>
            <li>
              <strong className="text-white">Artifex (veri işleyen):</strong> Müşteri işletmenin
              talimatıyla ve onun adına mesajları işler. Kendi amacı için kullanmaz, satmaz,
              reklam hedeflemesine vermez.
            </li>
            <li>
              <strong className="text-white">Teknik hizmet ortağı (alt yüklenici):</strong>{' '}
              Sistemin sunucusunu ve günlük işletimini Artifex adına, Artifex&apos;in talimatıyla
              çalıştıran taraftır. Yalnızca hizmetin çalışması için gereken kadar veriye erişir.
              Kendi amacı için kullanamaz, başkasına aktaramaz. Kendisiyle yazılı gizlilik ve
              veri işleme taahhüdü yürürlüktedir. Ortak değişirse bu sayfa güncellenir.
            </li>
          </ul>
          <p>
            Artifex bazı işlerde kendisi veri sorumlusudur: sistemin arıza ve güvenlik kayıtları,
            hizmetin genel kalitesini ölçme çalışmaları ve müşteri işletmenin yetkilisiyle
            kurulan ticari ilişki. Bu üç işte karar veren taraf Artifex&apos;tir.
          </p>
          <p>
            Her müşteri işletmenin verisi ayrı tutulur. Bir işletmenin verisi başka bir
            işletmenin hizmetinde kullanılmaz ve işletmeler birbirinin verisini göremez.
          </p>
          <p>
            Bir hesap sisteme ancak o hesabın yetkilisi Meta ekranında açıkça izin verirse
            bağlanır. İzin her an geri alınabilir. Bu izin, Meta panelindeki bir
            yetkilendirmedir; 6698 sayılı Kanun anlamında açık rıza değildir.
          </p>
          <p>
            Müşteri işletmeye karşı veri işleyen olsak da, Meta&apos;nın geliştirici şartlarına
            uyma sorumluluğu doğrudan bize aittir ve bu sorumluluğu müşteriye devretmeyiz.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">3. Toplanan Veriler</h2>
          <p>
            Yalnızca otomasyonun çalışması için gereken alanlar toplanır. Meta&apos;nın bize
            gönderdiği bildirimlerden gelen veriler şunlardır:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-white">Mesaj içeriği:</strong> Kişinin işletmeye yazdığı metin ve gönderdiği ekler.</li>
            <li><strong className="text-white">Yorum içeriği:</strong> İşletmenin gönderisine yazılan yorum metni.</li>
            <li><strong className="text-white">Hesap kimliği:</strong> Platformun verdiği kullanıcı numarası ve genel kullanıcı adı. Kimlik numarası, adres, kart bilgisi toplanmaz.</li>
            <li><strong className="text-white">Sohbet bilgisi:</strong> Mesajın zamanı, hangi işletme hesabına geldiği, mesaj numarası, sohbetin geçmişi.</li>
            <li><strong className="text-white">Paylaşılan gönderi bilgisi:</strong> Kişi bir video ya da gönderi paylaştıysa onun başlığı ve adresi.</li>
            <li><strong className="text-white">Üretilen cevap:</strong> Sistemin hazırladığı yanıt ve gönderilip gönderilmediği kaydı.</li>
            <li><strong className="text-white">İşletme hesabının erişim anahtarı:</strong> Müşteri izin verdiğinde Meta&apos;nın verdiği anahtar. Şifreler asla alınmaz ve istenmez.</li>
          </ul>
          <p>
            Sağlık, inanç, siyasi görüş gibi özel nitelikli veriler ne istenir ne de bu amaçla
            toplanır. Bir kişi bunları mesajında kendiliğinden yazarsa, o metin sohbetin parçası
            olarak sistemde bulunabilir. Böyle bir veriyi fark ettiğimizde ya da bize
            bildirildiğinde gecikmeden sileriz; bu tür veriye erişimi olan kişi sayısı ayrıca
            sınırlıdır. Bu verileri hiçbir analizde, sınıflandırmada veya profil çıkarmada
            kullanmayız.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">4. Veriler Nasıl Toplanıyor</h2>
          <p>
            Veri, müşteri işletme izin verdikten sonra Meta&apos;nın bize gönderdiği bildirimlerle
            ve tamamen otomatik yollarla gelir. Sistem kimsenin profilini taramaz, liste çekmez,
            hesap kazımaz.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">5. İşleme Amaçları</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Gelen mesaj ve yorumlara işletme adına cevap hazırlamak ve göndermek</li>
            <li>Aynı mesaja iki kez cevap gitmesini engellemek</li>
            <li>Kişinin sorduğu soruya uygun bilgi ya da bağlantı bulmak</li>
            <li>Cevap gerektirmeyen mesajı ayırmak ve gereksiz mesaj göndermemek</li>
            <li>Hizmetin çalıştığını izlemek, arızayı görmek ve düzeltmek</li>
            <li>Verilen cevapların doğruluğunu kontrol etmek ve hataları düzeltmek</li>
          </ul>
          <p>
            Veriler reklam hedeflemesi, profil çıkarma ya da üçüncü kişilere satış için
            kullanılmaz. Mesaj içerikleri yapay zeka modellerinin eğitilmesi için kullanılmaz.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">6. Hukuki Sebep</h2>
          <p>
            Verinizi işlememizin dayanağı 6698 sayılı Kanun&apos;un 5. maddesindeki işleme
            şartlarıdır:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Mesajınızı cevaplamak ve size hizmet vermek: bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması.</li>
            <li>Arıza takibi, güvenlik kaydı ve cevap kalitesini ölçme: temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaat.</li>
            <li>Kanunen tutmak zorunda olduğumuz kayıtlar: hukuki yükümlülüğün yerine getirilmesi.</li>
          </ul>
          <p>Bu işlerin hiçbirinde açık rızanıza dayanmıyoruz.</p>

          <h2 className="text-xl font-semibold text-white mt-8">7. Kimlerle Paylaşılıyor</h2>
          <p>
            Instagram, Facebook Messenger ve WhatsApp, mesajların geldiği ve cevapların
            gönderildiği platformlardır. Bu platformları Meta işletir. Meta bizim altyapı
            sağlayıcımız değildir; Meta&apos;nın kendi veri işleme kuralları kendi gizlilik
            politikasında yazılıdır.
          </p>
          <p>
            Veri satılmaz. Aşağıdaki liste, hizmeti çalıştırmak için kullandığımız ve bizim
            talimatımız dışına çıkamayan sağlayıcı türlerini gösterir. Her birine yalnızca
            hizmetin çalışması için gereken kadar veri gider.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-white">Sunucu barındırma:</strong> Uygulamanın çalıştığı bulut altyapısı.</li>
            <li><strong className="text-white">Veritabanı:</strong> Sohbet kaydının tutulduğu yönetilen veritabanı.</li>
            <li><strong className="text-white">Yapay zeka sağlayıcıları:</strong> Cevap metnini üreten ve mesajı anlamlandıran servisler. Bu servislere yalnızca cevabın üretilmesi için gereken metin gider.</li>
            <li><strong className="text-white">Görsel ve video barındırma:</strong> Cevapta paylaşılan hazır görsellerin durduğu servis.</li>
          </ul>
          <p>
            Bu sağlayıcılarla, verinin yalnızca bize hizmet vermek için kullanılmasını ve model
            eğitiminde kullanılmamasını öngören koşullarda çalışırız. Kullandığımız güncel
            sağlayıcı listesini talep üzerine paylaşırız; liste değişirse bu sayfayı güncelleriz.
          </p>
          <p>
            Yetkili kamu kurumları hukuka uygun bir talep gönderirse, yalnızca talep edilen
            kadarı paylaşılır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">8. Yurt Dışına Aktarım</h2>
          <p>
            Sağlayıcıların bir kısmının sunucuları Türkiye dışında olabilir. Bu bir yurt dışına
            aktarımdır ve 6698 sayılı Kanun&apos;un 9. maddesine tabidir.
          </p>
          <p>
            Aktarımın yapılacağı ülke için Kurul&apos;un yeterlilik kararı varsa aktarım o karara
            dayanılarak yapılır. Yeterlilik kararı yoksa, Kurul&apos;un yayınladığı standart
            sözleşme imzalanır ve imzadan itibaren beş iş günü içinde Kişisel Verileri Koruma
            Kurumu&apos;na bildirilir. Bu sağlayıcılara akış sürekli olduğu için arızi aktarım
            istisnalarına dayanmayız.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">9. Saklama ve Silme</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-white">Mesaj ve yorum içeriği:</strong> Müşteri işletmeyle sözleşme sürdüğü sürece saklanır. Sözleşme bittiğinde en geç 30 gün içinde bizim sistemimizden silinir.</li>
            <li><strong className="text-white">Erişim anahtarları:</strong> İzin kaldırıldığı anda Meta tarafında geçersiz hale gelir ve sistemimiz o hesaba erişemez. Elimizdeki kayıt da düzenli olarak temizlenir.</li>
            <li><strong className="text-white">Sistem kayıtları:</strong> Arıza takibi için tutulan teknik kayıtlar, ihtiyaç kalmadığında düzenli olarak temizlenir.</li>
            <li><strong className="text-white">Kendiliğinden silme:</strong> Bir verinin saklanma sebebi ortadan kalktığında, kimse talep etmese de sileriz.</li>
            <li><strong className="text-white">Silme talebi:</strong> Talep gelirse süre beklenmez; talep en geç 30 gün içinde sonuçlandırılır.</li>
          </ul>
          <p>
            Silme yapıldığında veri canlı sistemden kalkar. Otomatik yedeklerde kalan kopyalar,
            yedek döngüsü yenilendikçe kaybolur; bu süre boyunca yedeklere yalnızca yedeklemeden
            sorumlu taraf erişebilir ve veri kullanılmaz.
          </p>
          <p>
            Sipariş, fiyat ya da teslimat konuşulan yazışmaları ticari kayıt olarak saklama
            yükümlülüğü müşteri işletmeye aittir.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">10. Verilerin Silinmesi</h2>
          <p>
            Verilerinin silinmesini isteyen herkes{' '}
            <a href="mailto:dolunay@dolunay.ai?subject=Veri%20Silme%20Talebi" className="text-[#4F8BFF] hover:underline">
              dolunay@dolunay.ai
            </a>{' '}
            adresine konu satırına Veri Silme Talebi yazarak başvurabilir. Talep en geç 30 gün
            içinde sonuçlandırılır. Kimlik doğrulaması, gereken bilgiler ve adım adım talimat
            ayrı sayfadadır:{' '}
            <Link href="/sozlesmeler/artifex-veri-silme" className="text-[#4F8BFF] hover:underline">
              Veri Silme Talebi
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">11. Haklarınız</h2>
          <p>6698 sayılı Kanun&apos;un 11. maddesi kapsamında şu haklara sahipsiniz:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Verinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi isteme</li>
            <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Verinizin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmiş verinin düzeltilmesini isteme</li>
            <li>Verinin silinmesini veya yok edilmesini isteme</li>
            <li>Düzeltme veya silme yapıldığında bunun, verinizin aktarıldığı üçüncü kişilere de bildirilmesini isteme</li>
            <li>Yalnız otomatik sistemlerle analiz sonucu aleyhinize çıkan sonuca itiraz etme</li>
            <li>Kanuna aykırı işleme sebebiyle zarara uğrarsanız zararın giderilmesini isteme</li>
          </ul>
          <p>
            <strong className="text-white">Talebinizi nereye yazacaksınız.</strong> Mesaj
            içeriğiyle ilgili taleplerde kanunen muhatap, mesaj yazdığınız işletmedir; otuz
            günlük yasal süre o işletme için işler. Yine de bize yazabilirsiniz: talebi alır,
            ilgili işletmeyi bilgilendirir ve işletmenin kararının teknik tarafını biz uygularız.
            Artifex&apos;in kendi veri sorumlusu olduğu konularda (2. bölümdeki üç iş) talebi
            doğrudan biz sonuçlandırırız.
          </p>
          <p>
            <strong className="text-white">Geçerli başvuru yolları.</strong> Talebinizi şu
            yollardan biriyle iletin: ıslak imzalı dilekçeyi adresimize posta ile göndererek,
            KEP adresimize yazarak, güvenli elektronik imza veya mobil imza ile imzalayıp
            göndererek, ya da daha önce bize bildirdiğiniz ve sistemimizde kayıtlı olan e-posta
            adresinizden yazarak. Başvurunuzda adınız ve soyadınız, T.C. kimlik numaranız
            (yabancıysanız uyruğunuz ve pasaport numaranız), tebligata esas adresiniz, varsa
            e-posta ve telefonunuz ve talep konunuz bulunmalıdır.
          </p>
          <p>
            <strong className="text-white">Süre ve ücret.</strong> Talepler en kısa sürede ve her
            halde en geç otuz gün içinde ücretsiz sonuçlandırılır. Cevabın kağıda basılıp
            gönderilmesi gerekirse ilk on sayfa ücretsizdir, sonraki her sayfa için mevzuatta
            belirlenen işlem ücreti alınabilir. Bir talebi reddedersek sebebini yazılı olarak
            bildiririz.
          </p>
          <p>
            <strong className="text-white">Kurul&apos;a şikayet.</strong> Kanun, önce veri
            sorumlusuna başvurmadan şikayet yoluna gidilmesine izin vermez. Başvurunuz
            reddedilirse, cevap yetersiz gelirse ya da otuz gün içinde cevap alamazsanız,
            cevabı öğrendiğiniz tarihten itibaren otuz ve her halde başvuru tarihinden itibaren
            altmış gün içinde Kişisel Verileri Koruma Kurulu&apos;na şikayette bulunabilirsiniz.
            Kişilik haklarınız zarar gördüyse tazminat hakkınız ayrıca saklıdır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">12. Ticari İleti ve İzin</h2>
          <p>
            Sistem, kişinin sorduğu soruya cevap verir. Cevap yalnızca sorulanı içeriyorsa
            tanıtım iletisi değildir. Cevaba kampanya, indirim, ürün önerisi ya da satın alma
            bağlantısı eklenmesi ayrı bir durumdur ve ticari elektronik ileti mevzuatına tabi
            olabilir.
          </p>
          <p>
            Bu durumda izin almak ve izni İleti Yönetim Sistemi&apos;ne kaydetmek müşteri
            işletmenin yükümlülüğüdür. Artifex, gönderimi başlatan taraf olarak, tanıtım içeren
            gönderim öncesinde işletmeden izin beyanı ister. Kişinin işletmeye ilk mesajı yazmış
            olması tek başına izin yerine geçmez. Tanıtım iletisi almak istemezseniz aynı
            kanaldan bize yazmanız yeterlidir; ücret alınmaz, gerekçe sorulmaz ve gönderim en
            geç üç iş günü içinde durdurulur. Bu, veri silme talebinden ayrı bir haktır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">13. Güvenlik Önlemleri</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Tüm bağlantılar şifreli kanaldan kurulur.</li>
            <li>Kayıtlara yalnızca uygulamanın kendi servis kimliği erişir. Genel erişime açık bir bağlantı yoktur.</li>
            <li>Erişim anahtarları koda yazılmaz, erişimi kısıtlanmış ayrı bir alanda tutulur.</li>
            <li>Anahtarların kayıtlara ve hata mesajlarına düşmemesi için önlem alınır.</li>
            <li>Gelen bildirimlerin gerçekten Meta&apos;dan geldiği imza kontrolüyle doğrulanır; imzası doğrulanamayan bildirim işleme alınmaz.</li>
            <li>Sisteme erişimi olan kişi sayısı asgari tutulur ve bu erişim düzenli olarak gözden geçirilir.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">14. Veri Güvenliği İhlali</h2>
          <p>
            Verilerin hukuka aykırı biçimde başkaları tarafından elde edildiğini tespit edersek,
            durumu gecikmeden ve her halde 72 saat içinde ilgili müşteri işletmeye bildiririz.
            Bildirim; ne olduğunu, hangi verinin etkilendiğini ve ne yaptığımızı içerir. Kurum&apos;a
            bildirimi kanunen veri sorumlusu sıfatındaki taraf yapar; biz gereken tüm bilgi ve
            belgeyi sağlarız. Teknik hizmet ortağımız da kendi tarafındaki bir ihlali gecikmeden
            bize bildirmekle yükümlüdür.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">15. Platform Kuralları</h2>
          <p>
            Bu hizmet Meta&apos;nın geliştirici şartlarına ve platform politikalarına uygun olacak
            biçimde tasarlanmıştır. Platformdan alınan veri yalnızca müşteri işletmeye hizmet
            vermek için kullanılır. Şu kullanımlar yasaktır ve yapılmaz:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Verinin satılması, lisanslanması veya satın alınması</li>
            <li>Kişiler arasında ayrımcılık yaratacak biçimde işlenmesi</li>
            <li>Konut, iş, sigorta, eğitim, kredi, devlet yardımı veya göçmenlik statüsü kararlarında kullanılması</li>
            <li>Gözetim amaçlı kullanım, kolluk ya da ulusal güvenlik amacıyla işlenmesi</li>
            <li>Kişinin geçerli izni olmadan profil oluşturulması veya var olan profilin zenginleştirilmesi</li>
            <li>Reklam hedeflemesi ve yeniden hedefleme</li>
            <li>Verinin yeniden kimliklendirilmesi ya da tersine mühendislikle çözülmesi</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">16. Cevapları Yapay Zeka Hazırlar</h2>
          <p>
            Mesajlara gelen cevaplar bir yapay zeka sistemi tarafından hazırlanır. Kullanıcıya
            otomatik bir sistemle konuştuğu bildirilir ve isterse işletmenin bir yetkilisine
            bağlanmayı talep edebilir. Yoruma verilen cevap işletmenin hesabından herkese açık
            yayınlanır; hangi konularda otomatik cevap verileceğini işletme belirler ve
            yayınlanan cevaptan işletme sorumludur. Hukuka aykırı bir cevap bildirildiğinde
            gecikmeden kaldırılır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">17. Çocukların Verileri</h2>
          <p>
            Bu hizmet çocuklara yönelik değildir. Türk hukukunda çocuk, 18 yaşını doldurmamış
            herkestir. 18 yaşın altındaki bir kişinin verisinin işlenmesi ancak velisinin ya da
            vasisinin bilgisi ve onayıyla mümkündür. Mesaj yazan kişinin yaşını biz göremeyiz;
            bunu bilebilecek taraf, kendi hesabına yazılan işletmedir. Bir mesajın 18 yaşın
            altındaki birine ait olduğu bize bildirilirse o veriyi gecikmeden sileriz.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">18. Politikadaki Değişiklikler</h2>
          <p>
            Bu politika güncellenebilir. Güncelleme bu sayfada yayınlanır ve en üstteki tarih
            değişir. Kapsamı esaslı biçimde değiştiren bir güncelleme olursa müşteri işletmelere
            sözleşmede belirtilen iletişim adresinden ayrıca bildirilir.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">19. İletişim</h2>
          <p>
            Sorularınız ve başvurularınız için{' '}
            <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">
              dolunay@dolunay.ai
            </a>{' '}
            adresine yazabilirsiniz. Resmi bildirimler için KEP adresi:
            artifexyapayzeka@hs01.kep.tr
          </p>

        </div>
      </div>
    </div>
  );
}
