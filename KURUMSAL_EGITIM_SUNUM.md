# /kurumsal-egitim — genel kurumsal eğitim sunumu

Canlı: https://dolunay.ai/kurumsal-egitim/ — menüde YOK, `noindex, nofollow`. Sadece linki bilen görür.

Ne: `/bankalar` sunumunun sektör bağımsız hali. Aynı iskelet, aynı 9 slayt, aynı gezinme.
Bankaya özel dil çıkarıldı; her sektöre gönderilebilir.

## /bankalar'dan farkı (tek liste)

| Yer | Bankalar | Genel |
|---|---|---|
| `<title>` | Bankalar için Yapay Zeka | Kurumsal Yapay Zeka Eğitimi |
| Kapak üst satır | Bankalar için | Kurumlar için |
| Kapak alt satır | Türkiye Finans ve Misyon Bankası ekiplerinde uygulandı | Farklı sektörlerden kurumsal ekiplerde uygulandı |
| Slayt 1 başlık | Bu program bankada çalıştı | Bu program sahada çalıştı |
| Slayt 6 senaryo | Şube Asistanı, hesap açılışı, tüzel kişi, ticaret sicil | Departman Asistanı, yeni çalışan girişi, stajyer, staj yazısı |
| Slayt 6 bilgi bankası | Kredi Yönetmeliği · Şube Operasyon El Kitabı · Ücret ve Komisyon Tarifesi | Satın Alma Prosedürü · İnsan Kaynakları El Kitabı · Yan Haklar Yönetmeliği |
| Slayt 8 adım 2 | Örnekler bankacılıktan seçilir | Örnekler sizin sektörünüzden seçilir |
| Slayt 7 dipnot | Çok şubeli programlarda | Çok lokasyonlu programlarda |

**Referans kartları bilerek DEĞİŞMEDİ.** Türkiye Finans ve Misyon Bankası isimleri duruyor;
bunlar hedef kitle değil kanıttır (regüle kurumların bu programı satın aldığı bilgisi her
sektörde işe yarar). Alıcı bir bankanın rakibiyse ya da referansların değişmesi isteniyorsa
kartlar `.refs` bloğundan değiştirilir. Fiyatlar, müfredat ve fotoğraflar birebir aynı;
kaynakları `BANKALAR_SUNUM.md`'de.

Senaryo İK üzerinden kurgulandı çünkü her kurumda karşılığı var. Gerçek bir müşteri işi
değil, örnek senaryo.

## Doğrulama (2026-08-16)

Playwright, `out/` build'i üzerinden HTTP ile. Masaüstü 1440×900 ve mobil 390×844.
Her slayt `?s=N&b=9` ile tek tek açıldı:

- 9 slaytın hepsinde yatay taşma 0 (slayt ve body ayrı ayrı), iki viewport'ta da.
- Her slaytta açılmamış `[data-r]` öğe sayısı 0 — yani tüm beat'ler görünür oluyor.
- Animasyon son beat'inde 4 baloncuğun 4'ü, 3 kutunun 3'ü açık, iki eşleşme satırı da yeşil.
- Konsol hatası yok.
- Em-dash 0, şapkalı harf 0 (grep ile sayıldı).
- Kalan "banka" geçişleri yalnız 2 referans kartı adı + "bilgi bankası" terimi.
- `npm run build` yeşil, `out/kurumsal-egitim/index.html` üretiliyor.

Gözle bakılan kareler: masaüstü slayt 0, 1, 6, 8.
