/* =========================================================================
   Panel — kabuk, yönlendirme ve ekranlar.
   Veri yalnızca /.netlify/functions/panel-veri ucundan okunur; sayfada
   müşteri verisi yok. Panel sayfaları statik dosya olduğu için koruma bu
   kuralda: veri kimlik doğrulayan uçlardan gelir.
   ========================================================================= */

(function () {
  "use strict";

  var M = {};   /* panel-veri ucundan dolar, acilista */

  /* ---- oturum kontrolü ----
     Panel sayfaları statik dosya; sunucu tarafında kapatılamıyorlar. Asıl
     koruma şu kuralda: SAYFADA MÜŞTERİ VERİSİ YOK, veri yalnızca kimlik
     doğrulayan uçlardan gelir. Buradaki iş, giriş yapmamış birini panelde
     oyalamamak.

     Sayfa doğrulama bitene kadar gizli duruyor (body.dogrulaniyor). Bu bir
     güvenlik önlemi değil görünüm önlemi: panel bir an görünüp kaybolmasın. */
  var VERI_UCU = "/.netlify/functions/panel-veri";
  var YAZI_UCU = "/.netlify/functions/panel-yazi";
  var CIKIS_UCU = "/.netlify/functions/cikis";

  function girisEkranina() {
    window.location.replace("index.html");
  }

  /* Motorun son yazma zamanı. Akış tek yönlü: panelden yapılan hiçbir şey
     anında yansımıyor, yazılar günde bir kez işleniyor. Müşteri kararının
     neden hemen görünmediğini buradan anlıyor; yoksa paneli bozuk sanar. */
  function sonGuncellemeyiGoster() {
    var yuva = document.getElementById("tepeSag");
    if (!yuva) return;
    var metin = M.sonGuncelleme
      ? "Son güncelleme: " + trTarihSaat(M.sonGuncelleme)
      : "Henüz güncelleme alınmadı";
    var s = document.createElement("span");
    s.className = "son-guncelleme";
    s.title = "Yazılar günde bir kez işleniyor. Panelden yaptığınız değişiklikler bir sonraki güncellemede yansır.";
    s.textContent = metin;
    yuva.appendChild(s);
  }

  var KARAR_UCU = "/.netlify/functions/panel-karar";

  /* Panelin kararını sunucuya yazar. Ekran zaten iyimser güncelleniyor;
     burada asıl iş, yazma başarısız olursa müşteriye SÖYLEMEK. Sessizce
     kaybolan bir onay, müşterinin yaptığını sandığı ama olmamış bir iştir. */
  function kararGonder(govde) {
    return fetch(KARAR_UCU, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(govde)
    }).then(function (cevap) {
      if (cevap.status === 401) { girisEkranina(); return null; }
      return cevap.json().catch(function () { return {}; }).then(function (v) {
        if (!cevap.ok) throw new Error(v.hata || ("kod " + cevap.status));
        return v;
      });
    }).catch(function (hata) {
      toast("Kaydedilemedi: " + (hata && hata.message ? hata.message : "bağlantı sorunu") +
        ". Sayfayı yenileyip tekrar deneyin.");
      throw hata;
    });
  }

  /* Yazının tam metni listede gelmiyor (liste hafif kalsın diye); önizleme
     ya da düzenleme açılınca çekiliyor. Müşteri metni düzenlediyse uç
     panelin metnini döndürür. */
  function yaziMetniGetir(id) {
    return fetch(YAZI_UCU + "?id=" + encodeURIComponent(id), {
      credentials: "same-origin",
      headers: { "Accept": "application/json" }
    }).then(function (cevap) {
      if (cevap.status === 401) { girisEkranina(); return ""; }
      if (!cevap.ok) return "";
      return cevap.json().then(function (v) { return v.icerik || ""; });
    }).catch(function () { return ""; });
  }

  /* "Veri gelmedi" ile "yazı yok" ayrı şeyler. Ayrı metin olmazsa müşteri
     kendi yazılarının silindiğini sanır. */
  function veriYokEkrani(sebep) {
    var yuva = document.querySelector(".icerik-ic");
    if (!yuva) return;
    yuva.innerHTML =
      '<div class="bos-durum">' +
      "<p>Panel verileriniz şu an okunamadı. Oturumunuz açık, sorun bizde.</p>" +
      "<p class=\"yardim-metni\">Birazdan sayfayı yenileyin; sürerse " +
      '<a href="mailto:dolunay@dolunay.ai">dolunay@dolunay.ai</a> adresine yazın.</p>' +
      "</div>";
    if (sebep) console.error("panel verisi alinamadi:", sebep);
  }

  function cikisYap() {
    /* Asıl iş oturum kaydını sunucuda kapatmak; çerezi düşürmek tek başına
       yetmez. Uç yanıt vermese bile giriş ekranına dönülür. */
    fetch(CIKIS_UCU, { method: "POST", credentials: "same-origin" })
      .catch(function () { /* yine de çıkılır */ })
      .then(function () { window.location.href = "index.html"; });
  }

  /* =======================================================================
     Küçük yardımcılar
     ======================================================================= */

  var AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* "2026-09-08" → "8 Eylül 2026" */
  function trTarih(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return Number(p[2]) + " " + AYLAR[Number(p[1]) - 1] + " " + p[0];
  }

  /* ISO zaman damgası → "8 Eylül 2026, 14:30". Motorun son yazma zamanı için.
     Tarayıcının saat dilimine çevirir; müşteri kendi saatini görür. */
  function trTarihSaat(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var saat = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    return d.getDate() + " " + AYLAR[d.getMonth()] + " " + d.getFullYear() + ", " + saat;
  }

  function sayi(n) {
    return Number(n || 0).toLocaleString("tr-TR");
  }

  /* Kapak yoksa marka renklerinde bir yüzey üretilir.
     id'den türetilir ki her açılışta aynı kapak aynı yazıda kalsın. */
  function kapakSinifi(id) {
    var t = 0;
    for (var i = 0; i < id.length; i++) t = (t * 31 + id.charCodeAt(i)) % 997;
    return "kapak-" + (t % 5);
  }

  function kapakHtml(yazi) {
    if (yazi.kapak) {
      return '<div class="kapak"><img src="' + esc(yazi.kapak) + '" alt=""></div>';
    }
    return '<div class="kapak ' + kapakSinifi(yazi.id) + '" role="presentation"></div>';
  }

  /* =======================================================================
     Veri erişimi — panelin tek okuma noktası
     ======================================================================= */

  var Veri = {
    yazilar: function (durum) {
      var hepsi = M.yazilar || [];
      if (!durum) return hepsi.slice();
      return hepsi.filter(function (y) { return y.durum === durum; });
    },
    buAyYayinlanan: function () {
      var ay = (M.bugun || "").slice(0, 7);
      return Veri.yazilar("yayinda").filter(function (y) {
        return y.tarih && y.tarih.slice(0, 7) === ay;
      }).length;
    },
    yayinlananKelime: function () {
      return Veri.yazilar("yayinda").reduce(function (t, y) {
        return t + (y.kelime || 0);
      }, 0);
    }
  };

  /* =======================================================================
     Toast
     ======================================================================= */

  var toastAlan = document.getElementById("toastAlan");

  function toast(mesaj) {
    if (!toastAlan) return;
    var kutu = document.createElement("div");
    kutu.className = "toast";
    kutu.setAttribute("role", "status");
    kutu.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4.5 12.5 10 18 19.5 6.5"/></svg><span>' + esc(mesaj) + "</span>";
    toastAlan.appendChild(kutu);

    setTimeout(function () {
      kutu.classList.add("gidiyor");
      setTimeout(function () { kutu.remove(); }, 260);
    }, 3600);
  }

  /* =======================================================================
     ANA SAYFA
     ======================================================================= */

  function yaziKartiHtml(y) {
    return '' +
      '<article class="yazi-kart bekliyor" data-yazi="' + esc(y.id) + '">' +
        kapakHtml(y) +
        '<div class="yazi-kart-ust">' +
          "<h3>" + esc(y.baslik) + "</h3>" +
          '<span class="rozet rozet-sari">Onay Bekliyor</span>' +
        "</div>" +
        '<p class="ozet">' + esc(y.ozet) + "</p>" +
        '<div class="yazi-meta">' +
          "<span>" + esc(trTarih(y.tarih)) + " tarihinde yayınlanacak</span>" +
          '<span class="ayrac">·</span><span>' + esc(y.kategori) + "</span>" +
          '<span class="ayrac">·</span><span>' + esc(y.okumaDk) + " dk</span>" +
        "</div>" +
        '<div class="yazi-eylem">' +
          '<button class="btn btn-kucuk btn-ikincil" data-eylem="onizle" ' +
            'data-yazi="' + esc(y.id) + '">Önizle</button>' +
          '<button class="btn btn-kucuk btn-onay" data-eylem="onayla" ' +
            'data-yazi="' + esc(y.id) + '">Onayla</button>' +
          '<button class="btn btn-kucuk btn-ret" data-eylem="reddet" ' +
            'data-yazi="' + esc(y.id) + '">Reddet</button>' +
        "</div>" +
      "</article>";
  }

  function anaSayfayiCiz() {
    var kutu = document.getElementById("b-anasayfa");
    if (!kutu) return;

    var bekleyen = Veri.yazilar("bekliyor");
    var yayinda = Veri.yazilar("yayinda");
    var buAy = Veri.buAyYayinlanan();
    var kota = (M.abonelik && M.abonelik.aylikYazi) || 0;
    var oran = kota ? Math.min(100, Math.round((buAy / kota) * 100)) : 0;

    var html = '' +
      '<section class="kart karsilama">' +
        "<h2>Hoş geldiniz, " + esc(M.hesap ? M.hesap.markaAdi : "") + "</h2>" +
        "<p>Bu ay <strong>" + buAy + "</strong> yazı yayınlandı" +
          (bekleyen.length
            ? ", <strong>" + bekleyen.length + "</strong> tanesi onayınızı bekliyor."
            : ". Onay bekleyen yazı yok.") +
        "</p>" +
        '<div class="ilerleme-ust"><span>Bu ay</span>' +
          "<b>" + buAy + "/" + kota + " yazı</b></div>" +
        '<div class="ilerleme-yol"><div class="ilerleme-dolu" style="width:' + oran + '%"></div></div>' +
      "</section>";

    if (bekleyen.length) {
      html +=
        '<h2 class="bolum-basligi"><span class="nokta nokta-sari"></span>' +
          "Onay bekleyen yazılar " +
          '<span class="sayi">(' + bekleyen.length + ")</span></h2>" +
        '<div class="yazi-listesi">' +
          bekleyen.map(yaziKartiHtml).join("") +
        "</div>";
    } else {
      html +=
        '<h2 class="bolum-basligi"><span class="nokta nokta-sari"></span>' +
          "Onay bekleyen yazılar</h2>" +
        '<div class="yazi-listesi"><div class="bos-durum">' +
          "<p>Şu an onayınızı bekleyen yazı yok. Sıradaki yazılar hazırlandıkça burada görünecek.</p>" +
          '<button class="btn btn-ikincil" data-git="posts">Yayın takvimine bak</button>' +
        "</div></div>";
    }

    html +=
      '<div class="istatistikler">' +
        '<div class="istatistik yesil"><b>' + yayinda.length + "</b><span>Yayında</span></div>" +
        '<div class="istatistik sari"><b>' + bekleyen.length + "</b><span>Onay Bekliyor</span></div>" +
        '<div class="istatistik mavi"><b>' + sayi(Veri.yayinlananKelime()) +
          "</b><span>Yayınlanan Kelime</span></div>" +
      "</div>";

    kutu.innerHTML = html;
  }

  /* ---- yazı onaylama ----
     Onaylanan yazı yayına değil, yayın takvimine girer: planlanan tarihinde
     yayınlanacaktır. Bu yüzden durumu "planlandi" olur. */
  function yaziOnayla(id) {
    var yazi = yaziBul(id);
    if (!yazi || yazi.durum !== "bekliyor") return;
    var eskiDurum = yazi.durum;
    /* Ekran iyimser güncelleniyor; yazma düşerse geri alınıyor. Müşterinin
       onayladığını sanıp onaylamamış olması en kötü sonuç. */
    yazi.durum = "planlandi";
    cizHepsi();
    kararGonder({ tur: "onay", yaziId: id }).then(function (v) {
      if (!v) return;
      /* "yayın takvimine eklendi" yerine "sıraya girdi": takvim panelin kendi
         görüntüsü, gerçek yayın sırası motorun bir sonraki turunda kuruluyor. */
      toast("Onayınız alındı. Yazı " + trTarih(yazi.tarih) + " için sıraya girdi.");
    }).catch(function () {
      yazi.durum = eskiDurum;
      cizHepsi();
    });
  }

  function yaziBul(id) {
    return (M.yazilar || []).filter(function (y) { return y.id === id; })[0];
  }

  /* Veri değiştiğinde etkilenen bütün ekranlar yeniden çizilir. */
  function cizHepsi() {
    anaSayfayiCiz();
    yazilarimiCiz();
  }

  /* =======================================================================
     MODALLAR
     ======================================================================= */

  var modalYuva = document.getElementById("modalYuva");
  var oncekiOdak = null;

  function modalKapat() {
    if (!modalYuva.firstChild) return;
    modalYuva.innerHTML = "";
    document.body.style.overflow = "";
    if (oncekiOdak && document.contains(oncekiOdak)) oncekiOdak.focus();
    oncekiOdak = null;
  }

  /* govde: modalın iç HTML'i. odakla: açılınca odaklanacak seçici. */
  function modalAc(govde, secenek) {
    secenek = secenek || {};
    oncekiOdak = document.activeElement;

    var ortu = document.createElement("div");
    ortu.className = "ortu";
    ortu.innerHTML = '<div class="modal' + (secenek.dar ? " dar" : "") +
      '" role="dialog" aria-modal="true" aria-label="' + esc(secenek.ad || "") + '">' +
      govde + "</div>";

    modalYuva.innerHTML = "";
    modalYuva.appendChild(ortu);
    document.body.style.overflow = "hidden";

    /* dışarı tıklayınca kapansın */
    ortu.addEventListener("mousedown", function (e) {
      if (e.target === ortu) modalKapat();
    });

    var odak = secenek.odakla && ortu.querySelector(secenek.odakla);
    (odak || ortu.querySelector(".kapat") || ortu).focus();

    return ortu;
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") modalKapat();
  });

  function modalBasiHtml(baslik, altYazi, sagHtml) {
    return '<div class="modal-basi"><div><h2>' + esc(baslik) + "</h2>" +
      (altYazi ? "<p>" + esc(altYazi) + "</p>" : "") + "</div>" +
      '<div class="sag">' + (sagHtml || "") +
      '<button class="kapat" data-eylem="modal-kapat" aria-label="Kapat">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
        'stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div></div>';
  }

  /* ---- 1) Önizleme ---- */

  function kagitKapakHtml(y) {
    if (y.kapak) {
      return '<div class="kagit-kapak"><img src="' + esc(y.kapak) + '" alt=""></div>';
    }
    return '<div class="kagit-kapak kapak ' + kapakSinifi(y.id) + '" role="presentation"></div>';
  }

  /* Tam metin listede gelmiyor; modal önce açılıp metin sonra doluyor.
     Beklerken boş bir kağıt göstermek yerine "yükleniyor" denir. */
  function metniYerlestir(id, secici, bosMetin) {
    yaziMetniGetir(id).then(function (html) {
      var yuva = document.querySelector(secici);
      if (!yuva) return;
      yuva.innerHTML = html || bosMetin;
      if (secici === "#duzIcerik") duzenlemeBaslangicMetni = yuva.innerHTML;
    });
  }

  var duzenlemeBaslangicMetni = "";

  function onizlemeAc(id) {
    var y = yaziBul(id);
    if (!y) return;

    var duzenleDugmesi =
      '<button class="btn btn-kucuk btn-ikincil" data-eylem="duzenle" data-yazi="' +
      esc(y.id) + '">✎ Düzenle</button>';

    modalAc(
      modalBasiHtml("Önizleme", y.kategori + " · " + y.okumaDk + " dk okuma", duzenleDugmesi) +
      '<div class="modal-govde"><article class="kagit">' +
        kagitKapakHtml(y) +
        "<h1>" + esc(y.baslik) + "</h1>" +
        '<div class="kagit-meta">' +
          esc(trTarih(y.tarih)) + (y.durum === "yayinda" ? " tarihinde yayınlandı" : " için planlandı") +
          " · " + esc(y.kategori) + " · " + esc(y.okumaDk) + " dk" +
        "</div>" +
        '<div id="onizlemeGovde"><p class="yardim-metni">Yazı yükleniyor…</p></div>' +
      "</article></div>",
      { ad: "Yazı önizlemesi" }
    );
    metniYerlestir(id, "#onizlemeGovde", "<p>Bu yazının içeriği henüz hazırlanmadı.</p>");
  }

  /* ---- 2) Reddetme ---- */

  function reddetAc(id) {
    var y = yaziBul(id);
    if (!y) return;

    modalAc(
      modalBasiHtml("Yazıyı reddet", y.baslik) +
      '<div class="modal-govde sikisik">' +
        '<div class="alan"><label for="retNedeni">Reddetme sebebi (opsiyonel)</label>' +
        '<textarea id="retNedeni" rows="5" placeholder="Bu konuyu istemiyorum çünkü…"></textarea></div>' +
      "</div>" +
      '<div class="modal-alti">' +
        '<span class="not">Reddedilen konu tekrar yazılmaz. Aylık kotanızdan düşmez, ' +
          "yerine yeni yazı hazırlanır.</span>" +
        '<button class="btn btn-ikincil" data-eylem="modal-kapat">İptal</button>' +
        '<button class="btn btn-ret" data-eylem="ret-onayla" data-yazi="' + esc(y.id) + '">Reddet</button>' +
      "</div>",
      { dar: true, ad: "Yazıyı reddet", odakla: "#retNedeni" }
    );
  }

  function yaziReddet(id) {
    var y = yaziBul(id);
    if (!y) return;
    var alan = document.getElementById("retNedeni");
    var neden = alan ? alan.value.trim() : "";

    var eski = { durum: y.durum, tarih: y.tarih, reddedildi: y.reddedildi, neden: y.reddetmeNedeni };
    y.durum = "reddedildi";
    y.reddedildi = M.bugun;
    y.tarih = null;
    if (neden) y.reddetmeNedeni = neden;

    modalKapat();
    cizHepsi();
    kararGonder({ tur: "ret", yaziId: id, neden: neden }).then(function (v) {
      if (!v) return;
      toast("Yazı reddedildi. Yerine yeni bir yazı hazırlanacak.");
    }).catch(function () {
      y.durum = eski.durum; y.tarih = eski.tarih;
      y.reddedildi = eski.reddedildi; y.reddetmeNedeni = eski.neden;
      cizHepsi();
    });
  }

  /* ---- 3) Düzenleme ----
     Zengin metin için tarayıcının kendi düzenleme özelliği kullanılıyor;
     kütüphane kurulmadı. execCommand eski bir API ama kütüphanesiz tek yol
     bu ve Chrome'da çalışıyor. */

  function duzenleAc(id) {
    var y = yaziBul(id);
    if (!y) return;

    modalAc(
      modalBasiHtml("Yazıyı düzenle", y.kategori) +
      '<div class="modal-govde sikisik">' +
        '<div class="alan"><label for="duzBaslik">Başlık</label>' +
        '<input type="text" id="duzBaslik" value="' + esc(y.baslik) + '"></div>' +

        '<div class="alan"><label for="duzOzet">Özet</label>' +
        '<textarea id="duzOzet" rows="3">' + esc(y.ozet) + "</textarea></div>" +

        '<div class="alan"><label id="icerikEtiket">İçerik</label>' +
          '<div class="editor">' +
            '<div class="editor-arac">' +
              '<button type="button" class="arac-btn" data-bicim="bold" title="Kalın"><b>B</b></button>' +
              '<button type="button" class="arac-btn" data-bicim="italic" title="Eğik"><i>I</i></button>' +
              '<button type="button" class="arac-btn" data-bicim="insertUnorderedList" title="Madde listesi">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
                'stroke-linecap="round"><path d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01"/></svg>' +
              "</button>" +
              '<button type="button" class="arac-btn" data-bicim="h2" title="Ara başlık">H2</button>' +
            "</div>" +
            '<div class="kagit" id="duzIcerik" contenteditable="true" ' +
              'role="textbox" aria-multiline="true" aria-labelledby="icerikEtiket">' +
              '<p class="yardim-metni">Yazı yükleniyor…</p>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="modal-alti">' +
        '<button class="btn btn-ikincil" data-eylem="modal-kapat">İptal</button>' +
        '<button class="btn btn-birincil" data-eylem="duzenle-kaydet" data-yazi="' + esc(y.id) + '">Kaydet</button>' +
      "</div>",
      { ad: "Yazıyı düzenle", odakla: "#duzBaslik" }
    );
    duzenlemeBaslangicMetni = "";
    metniYerlestir(id, "#duzIcerik", "");
  }

  function yaziKaydet(id, dugme) {
    var y = yaziBul(id);
    if (!y) return;

    var baslikAlani = document.getElementById("duzBaslik");
    var kutu = baslikAlani.closest(".alan");
    var yeniBaslik = baslikAlani.value.trim();

    /* satır içi doğrulama — alert() yok */
    var eskiHata = kutu.querySelector(".hata");
    if (!yeniBaslik) {
      kutu.classList.add("hatali");
      if (!eskiHata) {
        var p = document.createElement("p");
        p.className = "hata";
        p.textContent = "Başlık boş bırakılamaz.";
        kutu.appendChild(p);
      }
      baslikAlani.focus();
      return;
    }
    kutu.classList.remove("hatali");

    var icerik = document.getElementById("duzIcerik").innerHTML;

    dugme.disabled = true;
    dugme.textContent = "Kaydediliyor…";

    /* Düzenlenen metin PANELIN KARARI sayılır: motor bu yazının düzenlenen
       alanlarını bir daha ezmez. Yalnız gerçekten değiştirilen alanlar
       gönderilir (Karar E4); müşteri sadece başlığı düzelttiyse motor gövdeyi
       güncellemeye devam etsin. HTML uçta temizleniyor (Karar E2), kelime ve
       okuma süresi de orada yeniden hesaplanıyor (Karar E3). */
    var yeniOzet = document.getElementById("duzOzet").value.trim();
    var govde = { tur: "metin", yaziId: id };
    if (yeniBaslik !== y.baslik) govde.baslik = yeniBaslik;
    if (yeniOzet !== y.ozet) govde.ozet = yeniOzet;
    if (icerik !== duzenlemeBaslangicMetni) govde.icerik = icerik;

    if (!govde.baslik && !govde.ozet && !govde.icerik) {
      dugme.disabled = false;
      dugme.textContent = "Kaydet";
      modalKapat();
      return;
    }

    kararGonder(govde).then(function (v) {
      if (!v) return;
      /* Sunucu neyi kabul ettiyse ekran da onu göstersin: veriyi yeniden
         çekmek, yerel tahminle sunucunun gerçeği ayrışmasın diye. */
      return veriyiYenile();
    }).then(function () {
      modalKapat();
      /* "sitenize yansıtıldı" DEMEZ. Panelden yapılan hiçbir şey anında
         yayına gitmiyor: yazılar günde bir kez işleniyor. */
      toast("Değişiklikleriniz kaydedildi. Sonraki güncellemede sitenize yansıyacak.");
    }).catch(function () {
      dugme.disabled = false;
      dugme.textContent = "Kaydet";
    });
  }

  /* Veriyi uçtan yeniden çeker ve ekranları tazeler. */
  function veriyiYenile() {
    return fetch(VERI_UCU, {
      credentials: "same-origin",
      headers: { "Accept": "application/json" }
    }).then(function (cevap) {
      if (cevap.status === 401) { girisEkranina(); return null; }
      if (!cevap.ok) throw new Error("veri alınamadı");
      return cevap.json();
    }).then(function (veri) {
      if (!veri) return;
      M = veri;
      cizHepsi();
    });
  }

  /* araç çubuğu */
  document.addEventListener("click", function (e) {
    var arac = e.target.closest ? e.target.closest(".arac-btn") : null;
    if (!arac) return;
    e.preventDefault();
    var alan = document.getElementById("duzIcerik");
    if (!alan) return;
    alan.focus();
    var bicim = arac.dataset.bicim;
    try {
      if (bicim === "h2") {
        var icinde = document.queryCommandValue("formatBlock").toLowerCase();
        document.execCommand("formatBlock", false, icinde === "h2" ? "p" : "h2");
      } else {
        document.execCommand(bicim, false, null);
      }
    } catch (hata) {
      toast("Bu biçimlendirme tarayıcınızda çalışmadı.");
    }
  });

  /* =======================================================================
     YAZILARIM — yayın takvimi ve tablolar
     ======================================================================= */

  var GUN_ADLARI = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  /* Görüntülenen ay. mock.bugun'dan başlar, oklarla değişir. */
  var gosterilenAy = (function () {
    var p = (M.bugun || "2026-01-01").split("-");
    return { yil: Number(p[0]), ay: Number(p[1]) - 1 };
  })();

  function iso(d) {
    var a = d.getMonth() + 1, g = d.getDate();
    return d.getFullYear() + "-" + (a < 10 ? "0" : "") + a + "-" + (g < 10 ? "0" : "") + g;
  }

  /* Pazartesi = 0 olacak şekilde hafta günü */
  function haftaGunu(d) { return (d.getDay() + 6) % 7; }

  function ayaAit(tarih) {
    if (!tarih) return false;
    var p = tarih.split("-");
    return Number(p[0]) === gosterilenAy.yil && Number(p[1]) - 1 === gosterilenAy.ay;
  }

  function gunUnYazilari(tarih) {
    return (M.yazilar || []).filter(function (y) { return y.tarih === tarih; });
  }

  function takvimHtml() {
    var ilk = new Date(gosterilenAy.yil, gosterilenAy.ay, 1);
    var kaydir = haftaGunu(ilk);
    var basla = new Date(gosterilenAy.yil, gosterilenAy.ay, 1 - kaydir);
    var gunSayisi = new Date(gosterilenAy.yil, gosterilenAy.ay + 1, 0).getDate();
    var hucre = Math.ceil((kaydir + gunSayisi) / 7) * 7;
    var yayinGunleri = (M.yayinProgrami && M.yayinProgrami.gunler) || [];
    var bugun = M.bugun;

    var html = '<div class="takvim-izgara">';

    GUN_ADLARI.forEach(function (g) {
      html += '<div class="gun-basligi' +
        (yayinGunleri.indexOf(g) > -1 ? " yayin-gunu" : "") + '">' + g + "</div>";
    });

    for (var i = 0; i < hucre; i++) {
      var d = new Date(basla.getFullYear(), basla.getMonth(), basla.getDate() + i);
      var t = iso(d);
      var disay = d.getMonth() !== gosterilenAy.ay;

      html += '<div class="gun' + (disay ? " disay" : "") +
        (t === bugun ? " bugun" : "") + '" data-tarih="' + t + '">' +
        '<span class="gun-no">' + d.getDate() + "</span>";

      if (!disay) {
        gunUnYazilari(t).forEach(function (y) {
          var suruklenebilir = y.durum === "planlandi";
          html += '<span class="yazi-cip cip-' + y.durum + '"' +
            (suruklenebilir ? ' draggable="true"' : "") +
            ' data-yazi="' + esc(y.id) + '" title="' + esc(y.baslik) + '">' +
            '<span class="cip-metin">' + esc(y.baslik) + "</span></span>";
        });
      }

      html += "</div>";
    }

    return html + "</div>";
  }

  function tabloSatiriBekleyen(y) {
    return "<tr>" +
      '<td class="baslik-hucre"><b>' + esc(y.baslik) + "</b>" +
        "<small>" + esc(y.kategori) +
        (y.onayaGonderildi ? " · Onaya gönderildi: " + esc(trTarih(y.onayaGonderildi)) : "") +
        "</small></td>" +
      '<td class="tarih-hucre">' + esc(trTarih(y.tarih)) + "</td>" +
      '<td class="islem-hucre">' +
        '<button class="btn btn-kucuk btn-ikincil" data-eylem="onizle" data-yazi="' + esc(y.id) + '">Önizle</button>' +
        '<button class="btn btn-kucuk btn-onay" data-eylem="onayla" data-yazi="' + esc(y.id) + '">Onayla</button>' +
        '<button class="btn btn-kucuk btn-ret" data-eylem="reddet" data-yazi="' + esc(y.id) + '">Reddet</button>' +
      "</td></tr>";
  }

  function tabloSatiriYayinda(y) {
    var adres = (M.blogAdresi || "") + "/" + (y.adres || "");
    return "<tr>" +
      '<td class="baslik-hucre"><b>' + esc(y.baslik) + "</b></td>" +
      "<td><span class=\"rozet rozet-sade\">" + esc(y.kategori) + "</span></td>" +
      '<td class="tarih-hucre">' + esc(trTarih(y.tarih)) + "</td>" +
      '<td class="islem-hucre">' +
        '<a class="btn btn-kucuk btn-ikincil" href="' + esc(adres) + '" target="_blank" rel="noopener">' +
          'Görüntüle<span class="dis-ok">↗</span></a>' +
        '<button class="btn btn-kucuk btn-hayalet" data-eylem="onizle" data-yazi="' + esc(y.id) + '">Önizle</button>' +
        '<button class="btn btn-kucuk btn-hayalet" data-eylem="duzenle" data-yazi="' + esc(y.id) + '">Düzenle</button>' +
      "</td></tr>";
  }

  function yazilarimiCiz() {
    var kutu = document.getElementById("b-posts");
    if (!kutu) return;

    var hepsi = M.yazilar || [];
    var ayYayinda = hepsi.filter(function (y) { return y.durum === "yayinda" && ayaAit(y.tarih); });
    var ayBekliyor = hepsi.filter(function (y) { return y.durum === "bekliyor" && ayaAit(y.tarih); });
    var ayPlanli = hepsi.filter(function (y) { return y.durum === "planlandi" && ayaAit(y.tarih); });

    var bekleyen = Veri.yazilar("bekliyor").slice().sort(function (a, b) {
      return a.tarih < b.tarih ? -1 : 1;
    });
    var yayinda = Veri.yazilar("yayinda").slice().sort(function (a, b) {
      return a.tarih > b.tarih ? -1 : 1;
    });
    var reddedilen = Veri.yazilar("reddedildi");

    var saat = (M.yayinProgrami && M.yayinProgrami.saat) || "";

    var html = '' +
      '<div class="takvim-ust">' +
        '<h2><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
          'stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/>' +
          '<path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/></svg>Yayın Takvimi</h2>' +
        '<span class="rozet rozet-yesil">' + ayYayinda.length + " yayınlandı</span>" +
        '<span class="rozet rozet-sari">' + ayBekliyor.length + " onay bekliyor</span>" +
        '<span class="rozet rozet-mavi">' + ayPlanli.length + " planlandı</span>" +
        (saat ? '<span class="rozet rozet-sade saat">' + esc(saat) + "</span>" : "") +
      "</div>" +

      '<div class="bilgi-serit">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
          'stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 3.5v17M3.5 12h17M8.5 7 12 3.5 15.5 7M8.5 17 12 20.5 15.5 17M7 8.5 3.5 12 7 15.5M17 8.5l3.5 3.5-3.5 3.5"/>' +
        "</svg>" +
        "<span>Planlanmış <strong>(mavi)</strong> yazıları <strong>sürükleyip bırakarak</strong> " +
        "bu ay içinde yeniden tarihlendirin. Dolu bir güne bırakırsanız iki yazı " +
        "<strong>yer değiştirir</strong>.</span>" +
      "</div>" +

      '<div class="takvim">' +
        '<div class="takvim-basi">' +
          '<button class="ay-ok" data-ay="-1" aria-label="Önceki ay">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
            'stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg></button>' +
          '<div class="ay"><b>' + AYLAR[gosterilenAy.ay] + "</b><span>" + gosterilenAy.yil + "</span></div>" +
          '<button class="ay-ok" data-ay="1" aria-label="Sonraki ay">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
            'stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg></button>' +
        "</div>" +
        takvimHtml() +
      "</div>";

    /* --- onay bekleyenler --- */
    html += '<h2 class="bolum-basligi"><span class="nokta nokta-sari"></span>Onay bekleyen ' +
      '<span class="sayi">(' + bekleyen.length + ")</span></h2>";
    if (bekleyen.length) {
      html += '<div class="tablo-kutu sari"><div class="tablo-sar"><table class="tablo">' +
        "<thead><tr><th>Başlık</th><th>Tarih</th><th>İşlemler</th></tr></thead><tbody>" +
        bekleyen.map(tabloSatiriBekleyen).join("") +
        "</tbody></table></div></div>";
    } else {
      html += '<div class="bos-durum" style="margin-bottom:12px">' +
        "<p>Onayınızı bekleyen yazı yok. Sıradaki yazılar hazırlandıkça burada görünecek.</p>" +
        "</div>";
    }

    /* --- yayınlananlar --- */
    html += '<h2 class="bolum-basligi" style="margin-top:30px">Yayınlanan yazılar ' +
      '<span class="sayi">(' + yayinda.length + ")</span></h2>";
    if (yayinda.length) {
      html += '<div class="tablo-kutu"><div class="tablo-sar"><table class="tablo">' +
        "<thead><tr><th>Başlık</th><th>Kategori</th><th>Yayın tarihi</th><th>İşlemler</th></tr></thead><tbody>" +
        yayinda.map(tabloSatiriYayinda).join("") +
        "</tbody></table></div>" +
        '<div class="tablo-alt">Toplam ' + yayinda.length + " yazı</div></div>";
    } else {
      html += '<div class="bos-durum" style="margin-bottom:12px">' +
        "<p>Henüz yayınlanmış yazı yok. Onayladığınız yazılar planlanan tarihlerinde " +
        "sitenizde yayına girecek.</p></div>";
    }

    /* --- reddedilenler --- */
    if (reddedilen.length) {
      html += '<details class="katlanir" style="margin-top:22px"><summary>' +
        '<span class="ok">›</span>Reddedilen yazılar (' + reddedilen.length + ")" +
        '<span class="not">Kotadan düşmez · yerine yeni yazı üretilir</span></summary>' +
        '<div class="govde"><div class="tablo-sar"><table class="tablo">' +
        "<thead><tr><th>Başlık</th><th>Kategori</th><th>Reddedildi</th></tr></thead><tbody>" +
        reddedilen.map(function (y) {
          return "<tr>" +
            '<td class="baslik-hucre"><b>' + esc(y.baslik) + "</b>" +
              (y.reddetmeNedeni ? '<span class="ret-nedeni">“' + esc(y.reddetmeNedeni) + "”</span>" : "") +
            "</td>" +
            "<td><span class=\"rozet rozet-sade\">" + esc(y.kategori) + "</span></td>" +
            '<td class="tarih-hucre">' + esc(trTarih(y.reddedildi)) + "</td></tr>";
        }).join("") +
        "</tbody></table></div></div></details>";
    }

    kutu.innerHTML = html;
  }

  /* =======================================================================
     KONULAR
     ======================================================================= */

  function konularCiz() {
    var kutu = document.getElementById("b-topics");
    if (!kutu) return;
    var liste = M.konular || [];

    var html =
      '<div class="konu-form">' +
        "<h3>Yeni konu önerin</h3>" +
        '<div class="konu-form-satir">' +
          '<div class="alan" id="alanKonu">' +
            '<label for="yeniKonu">Konu başlığı</label>' +
            '<input type="text" id="yeniKonu" placeholder="Örn: Kat mülkiyetinde ortak alan giderleri nasıl paylaşılır">' +
            '<p class="hata" id="hataKonu"></p>' +
          "</div>" +
          '<button class="btn btn-birincil" data-eylem="konu-ekle">Konu Ekle</button>' +
        "</div>" +
      "</div>" +

      '<div class="bilgi-serit yesil">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
          'stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 8.4v4.2M12 15.8h.01"/></svg>' +
        "<span>Konular tükendikçe yeni konular otomatik eklenir. Önerdiğiniz konular " +
        "listenin <strong>en üstüne</strong> eklenir ve sıradaki yazı olarak öncelikli üretilir.</span>" +
      "</div>";

    if (liste.length) {
      html += '<div class="tablo-kutu"><div class="tablo-sar"><table class="tablo">' +
        "<thead><tr><th>Konu</th><th>Kategori</th>" +
        '<th class="sayi-hucre">Hacim</th><th>Rekabet</th>' +
        '<th class="sayi-hucre">Skor</th><th class="sil-hucre"></th></tr></thead><tbody>' +
        liste.map(function (k) {
          var renk = k.rekabet === "Yüksek" ? "rozet-kirmizi"
            : k.rekabet === "Orta" ? "rozet-sari" : "rozet-yesil";
          return "<tr>" +
            '<td class="baslik-hucre"><b>' + esc(k.konu) + "</b></td>" +
            '<td><span class="rozet rozet-sade">' + esc(k.kategori) + "</span></td>" +
            '<td class="sayi-hucre">' + sayi(k.hacim) + "</td>" +
            '<td><span class="rozet ' + renk + '">' + esc(k.rekabet) + "</span></td>" +
            '<td class="sayi-hucre skor">' + esc(k.skor) + "</td>" +
            '<td class="sil-hucre"><button class="satir-sil" data-eylem="konu-sil" ' +
              'data-konu="' + esc(k.id) + '" aria-label="Konuyu listeden çıkar" ' +
              'title="Konuyu listeden çıkar">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
              'stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></td>' +
            "</tr>";
        }).join("") +
        "</tbody></table></div>" +
        '<div class="tablo-alt">Sırada ' + liste.length + " konu var</div></div>";
    } else {
      html += '<div class="bos-durum">' +
        "<p>Konu listeniz boş. Yeni konular otomatik eklenene kadar kendiniz de öneri girebilirsiniz.</p>" +
        '<button class="btn btn-ikincil" data-odakla="#yeniKonu">Konu öner</button></div>';
    }

    kutu.innerHTML = html;
  }

  function konuEkle() {
    var girdi = document.getElementById("yeniKonu");
    var alan = document.getElementById("alanKonu");
    var hata = document.getElementById("hataKonu");
    var metin = girdi.value.trim();

    if (metin.length < 8) {
      alan.classList.add("hatali");
      hata.textContent = metin
        ? "Konu başlığı biraz daha açıklayıcı olmalı."
        : "Bir konu başlığı yazın.";
      girdi.focus();
      return;
    }

    var yeniKayit = {
      id: "k-" + Date.now(),
      konu: metin,
      kategori: "Sizin öneriniz",
      hacim: null,
      rekabet: "—",
      skor: "—"
    };
    M.konular.unshift(yeniKayit);
    konularCiz();

    kararGonder({ tur: "konu-ekle", konu: metin }).then(function (v) {
      if (!v) return;
      toast("Konu listenin en üstüne eklendi, sıradaki yazı olarak üretilecek.");
      var yeni = document.getElementById("yeniKonu");
      if (yeni) yeni.focus();
    }).catch(function () {
      var i = M.konular.indexOf(yeniKayit);
      if (i >= 0) M.konular.splice(i, 1);
      konularCiz();
    });
  }

  function konuSil(id) {
    var i = (M.konular || []).findIndex(function (k) { return k.id === id; });
    if (i < 0) return;
    var kayit = M.konular[i];
    var ad = kayit.konu;
    M.konular.splice(i, 1);
    konularCiz();

    kararGonder({ tur: "konu-cikar", konuId: id }).then(function (v) {
      if (!v) return;
      toast("“" + (ad.length > 40 ? ad.slice(0, 40) + "…" : ad) + "” listeden çıkarıldı.");
    }).catch(function () {
      M.konular.splice(i, 0, kayit);
      konularCiz();
    });
  }

  /* =======================================================================
     MARKA PROFİLİM
     ======================================================================= */

  function alanHtml(id, etiket, deger, secenek) {
    secenek = secenek || {};
    var ic = secenek.satirlar
      ? '<textarea id="' + id + '" rows="' + secenek.satirlar + '">' + esc(deger) + "</textarea>"
      : '<input type="text" id="' + id + '" value="' + esc(deger) + '"' +
        (secenek.pasif ? " readonly" : "") + ">";
    return '<div class="alan"><label for="' + id + '">' + esc(etiket) + "</label>" + ic +
      (secenek.yardim ? '<p class="yardim-metni">' + esc(secenek.yardim) + "</p>" : "") +
      '<p class="hata"></p></div>';
  }

  var HEX_KALIP = /^#[0-9a-fA-F]{6}$/;

  /* <input type="color"> yalnızca geçerli #rrggbb kabul eder; geçersiz değer
     sessizce yok sayılır ve seçici siyah görünür. Bozuk veri gelirse seçiciye
     koyu kabuk rengi verilir, hex alanı gelen değeri olduğu gibi gösterir. */
  function renkVeya(deger) {
    var d = String(deger == null ? "" : deger).trim();
    return HEX_KALIP.test(d) ? d.toLowerCase() : "#14161d";
  }

  /* Hex alanı duruyor; yanına tıklanabilir bir renk seçici kondu. İkisi
     birbirini canlı günceller, kaydeden taraf yine hex alanını okur. */
  function renkAlani(id, etiket, deger) {
    return '<div class="alan"><label for="' + id + '">' + esc(etiket) + " (hex)</label>" +
      '<div class="renk-satir">' +
        '<input type="color" class="renk-kutu" id="' + id + 'Kutu"' +
          ' value="' + esc(renkVeya(deger)) + '"' +
          ' aria-label="' + esc(etiket) + ' için renk seçici">' +
        '<input type="text" id="' + id + '" value="' + esc(deger) + '"' +
          ' spellcheck="false" autocomplete="off">' +
      "</div>" +
      '<p class="hata"></p></div>';
  }

  function markamCiz() {
    var kutu = document.getElementById("b-brand");
    if (!kutu || !M.marka) return;
    var m = M.marka;

    kutu.innerHTML =
      '<div class="bilgi-serit">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
          'stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/></svg>' +
        "<span><strong>Marka profiliniz yazı üretiminin temelidir.</strong> Bu bilgiler " +
        "sitenizden otomatik çıkarıldı. Değişiklik yaparsanız sonraki yazılar yeni bilgilere " +
        "göre üretilir; <strong>mevcut yazılarda geçerli olmaz</strong>.</span>" +
      "</div>" +

      '<div class="kart-bolum"><h3>Genel bilgiler</h3>' +
        alanHtml("mSektor", "Sektör", m.sektor) +
        '<div class="ikili">' +
          alanHtml("mTon", "Ton stili", m.tonStili) +
          alanHtml("mKisilik", "Marka kişiliği", m.markaKisiligi) +
        "</div>" +
      "</div>" +

      '<div class="kart-bolum"><h3>Hedef kitle</h3>' +
        alanHtml("mKitle1", "Birincil kitle", m.birincilKitle, {
          satirlar: 3, yardim: "Yazıların birincil hedef aldığı kitle. Demografi, meslek, ilgi alanı."
        }) +
        alanHtml("mKitle2", "İkincil kitle (opsiyonel)", m.ikincilKitle, { satirlar: 2 }) +
      "</div>" +

      '<div class="kart-bolum"><h3>Anahtar kelimeler</h3>' +
        alanHtml("mAk1", "Birincil (virgülle ayır)", m.anahtarKelimeler.birincil) +
        alanHtml("mAk2", "İkincil", m.anahtarKelimeler.ikincil) +
        alanHtml("mAk3", "Uzun kuyruklu (long-tail)", m.anahtarKelimeler.uzunKuyruk, { satirlar: 2 }) +
      "</div>" +

      '<div class="kart-bolum"><h3>Hizmetler ve rakipler</h3>' +
        alanHtml("mHizmet", "Hizmetleriniz (virgülle ayır)", m.hizmetler, { satirlar: 2 }) +
        alanHtml("mRakip", "Bölgesel rakipleriniz (virgülle ayır)", m.rakipler, {
          satirlar: 2, yardim: "Benzer hizmet veren firmalar. Yazılarda avantaj karşılaştırmasında kullanılır."
        }) +
      "</div>" +

      '<div class="kart-bolum"><h3>Yazılarda bahsedilmeyenler</h3>' +
        alanHtml("mYasakli", "Yasaklı konular / kelimeler", m.yasakli, {
          satirlar: 3, yardim: "Virgülle veya satır başıyla ayır. Bu konular yazılarda kullanılmaz."
        }) +
      "</div>" +

      '<div class="kart-bolum"><h3>Marka renkleri</h3><div class="ikili">' +
        renkAlani("mRenk1", "Ana renk", m.renkler.ana) +
        renkAlani("mRenk2", "İkincil renk", m.renkler.ikincil) +
      "</div></div>" +

      '<div class="buton-satir">' +
        '<button class="btn btn-birincil btn-tam" data-eylem="marka-kaydet">Profili Kaydet</button>' +
      "</div>";
  }

  function markaKaydet() {
    var d = function (id) { return document.getElementById(id).value.trim(); };
    var hexGecerli = /^#[0-9a-fA-F]{6}$/;
    var tamam = true;

    ["mRenk1", "mRenk2"].forEach(function (id) {
      var girdi = document.getElementById(id);
      var alan = girdi.closest(".alan");
      if (!hexGecerli.test(girdi.value.trim())) {
        alan.classList.add("hatali");
        alan.querySelector(".hata").textContent = "Renk kodu #RRGGBB biçiminde olmalı.";
        tamam = false;
      } else {
        alan.classList.remove("hatali");
        alan.querySelector(".hata").textContent = "";
      }
    });

    if (!tamam) { document.getElementById("mRenk1").focus(); return; }

    var eski = M.marka;
    var yeni = {
      sektor: d("mSektor"),
      tonStili: d("mTon"),
      markaKisiligi: d("mKisilik"),
      birincilKitle: d("mKitle1"),
      ikincilKitle: d("mKitle2"),
      anahtarKelimeler: { birincil: d("mAk1"), ikincil: d("mAk2"), uzunKuyruk: d("mAk3") },
      hizmetler: d("mHizmet"),
      rakipler: d("mRakip"),
      yasakli: d("mYasakli"),
      renkler: { ana: d("mRenk1"), ikincil: d("mRenk2") }
    };
    M.marka = yeni;

    kararGonder({ tur: "ayarlar", marka: yeni }).then(function (v) {
      if (!v) return;
      toast("Marka profiliniz kaydedildi. Sonraki yazılar bu bilgilere göre üretilecek.");
    }).catch(function () {
      M.marka = eski;
      markamCiz();
    });
  }

  /* =======================================================================
     DESTEK
     ======================================================================= */

  function destekCiz() {
    var kutu = document.getElementById("b-support");
    if (!kutu || !M.destek) return;
    var talepler = M.destek.talepler || [];

    kutu.innerHTML =
      '<div class="kart-bolum"><h3>Destek talebi oluştur</h3>' +
        '<div class="alan" id="alanDestekKonu"><label for="destekKonu">Konu</label>' +
          '<input type="text" id="destekKonu" placeholder="Destek talebinizin konusu">' +
          '<p class="hata"></p></div>' +
        '<div class="alan" id="alanDestekMesaj"><label for="destekMesaj">Mesaj</label>' +
          '<textarea id="destekMesaj" rows="5" placeholder="Detaylı açıklama yazın…"></textarea>' +
          '<p class="hata"></p></div>' +
        '<button class="btn btn-birincil" data-eylem="destek-gonder">Gönder</button>' +

        (talepler.length
          ? '<div style="margin-top:22px">' + talepler.map(function (t) {
              return '<div class="talep"><div class="talep-ust"><b>' + esc(t.konu) + "</b>" +
                '<span class="rozet rozet-sari">' + esc(t.durum) + "</span>" +
                '<span class="tarih">' + esc(trTarih(t.tarih)) + "</span></div>" +
                "<p>" + esc(t.mesaj) + "</p></div>";
            }).join("") + "</div>"
          : '<p class="yardim-metni" style="margin-top:16px">Henüz destek talebi yok.</p>') +
      "</div>" +

      '<div class="kart-bolum"><h3>Hızlı iletişim</h3>' +
        '<div class="iletisim-izgara">' +
          '<div class="iletisim-kutu">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
              'stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2"/>' +
              '<path d="m3.5 7 8.5 6 8.5-6"/></svg>' +
            "<div><b>E-posta</b><span>" + esc(M.destek.iletisim.eposta) + "</span></div></div>" +
          '<div class="iletisim-kutu">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
              'stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/>' +
              '<path d="M9.7 9.6a2.4 2.4 0 0 1 4.6.8c0 1.6-2.3 2-2.3 3.4M12 17.2h.01"/></svg>' +
            "<div><b>SSS</b><span>Sık sorulan sorular</span></div></div>" +
        "</div>" +
        '<div class="bilgi-serit yesil" style="margin-bottom:0">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
            'stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 6.5"/></svg>' +
          "<span>" + esc(M.destek.baglantiDurumu) + "</span>" +
        "</div>" +
      "</div>";
  }

  function destekGonder() {
    var konu = document.getElementById("destekKonu");
    var mesaj = document.getElementById("destekMesaj");
    var tamam = true;

    [[konu, "Talebinizin konusunu yazın."], [mesaj, "Ne olduğunu birkaç cümleyle anlatın."]]
      .forEach(function (c) {
        var alan = c[0].closest(".alan");
        if (!c[0].value.trim()) {
          alan.classList.add("hatali");
          alan.querySelector(".hata").textContent = c[1];
          tamam = false;
        } else {
          alan.classList.remove("hatali");
          alan.querySelector(".hata").textContent = "";
        }
      });

    if (!tamam) { konu.focus(); return; }

    var talep = {
      konu: konu.value.trim(),
      mesaj: mesaj.value.trim(),
      tarih: M.bugun,
      durum: "Açık"
    };
    M.destek.talepler.unshift(talep);
    destekCiz();

    /* Talepler ayarlar kaydında duruyor: motor okuyor, panel yazıyor.
       Listenin tamamı gönderiliyor, uç onu olduğu gibi saklıyor. */
    kararGonder({ tur: "ayarlar", destekTalepleri: M.destek.talepler }).then(function (v) {
      if (!v) return;
      toast("Destek talebiniz alındı. En kısa sürede dönüş yapacağız.");
    }).catch(function () {
      var i = M.destek.talepler.indexOf(talep);
      if (i >= 0) M.destek.talepler.splice(i, 1);
      destekCiz();
    });
  }

  /* =======================================================================
     HESABIM
     ======================================================================= */

  var SAATLER = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  function hesabimCiz() {
    var kutu = document.getElementById("b-account");
    if (!kutu) return;
    var h = M.hesap || {};
    var yp = M.yayinProgrami || { saat: "", gunler: [] };
    var odemeler = M.odemeGecmisi || [];

    kutu.innerHTML =
      '<div class="kart-bolum"><h3>Profil bilgileri</h3>' +
        alanHtml("hMarka", "Marka adı", h.markaAdi, { pasif: true }) +
        alanHtml("hEposta", "E-posta", h.eposta, {
          pasif: true, yardim: "E-posta değişikliği için destek talebi açın."
        }) +
        '<div class="alan" id="alanTelefon"><label for="hTelefon">Telefon</label>' +
          '<input type="text" id="hTelefon" value="' + esc(h.telefon) + '">' +
          '<p class="hata"></p></div>' +
        '<button class="btn btn-birincil" data-eylem="telefon-kaydet">Telefonu Kaydet</button>' +
      "</div>" +

      '<div class="kart-bolum"><h3 class="ayrik">Şifre</h3>' +
        '<p class="bolum-alt">Panele e-posta ve şifreyle giriş yapmak için yeni bir şifre belirleyin.</p>' +
        '<div class="alan" id="alanSifreEski"><label for="hSifreEski">Mevcut şifre</label>' +
          '<input type="password" id="hSifreEski" autocomplete="current-password">' +
          '<p class="hata"></p></div>' +
        '<div class="alan" id="alanSifre1"><label for="hSifre1">Yeni şifre</label>' +
          '<input type="password" id="hSifre1" placeholder="En az 8 karakter">' +
          '<p class="hata"></p></div>' +
        '<div class="alan" id="alanSifre2"><label for="hSifre2">Yeni şifre (tekrar)</label>' +
          '<input type="password" id="hSifre2">' +
          '<p class="hata"></p></div>' +
        '<button class="btn btn-birincil btn-tam" data-eylem="sifre-kaydet">Şifreyi Kaydet</button>' +
      "</div>" +

      '<div class="kart-bolum"><h3 class="ayrik">Yayın programı</h3>' +
        '<p class="bolum-alt">Yazılarınızın hangi saatte ve hangi günlerde yayınlanacağını ' +
          "buradan ayarlayabilirsiniz.</p>" +
        '<div class="alan"><label for="hSaat">Yayın saati (Türkiye)</label>' +
          '<select id="hSaat">' + SAATLER.map(function (s) {
            return '<option value="' + s + '"' + (s === yp.saat ? " selected" : "") + ">" + s + "</option>";
          }).join("") + "</select>" +
          '<p class="yardim-metni">Yayın bu saatte gerçekleşir.</p></div>' +
        '<div class="alan" id="alanGunler"><label>Yayın günleri</label>' +
          '<div class="gun-haplar">' + GUN_ADLARI.map(function (g) {
            return '<button type="button" class="gun-hap' +
              (yp.gunler.indexOf(g) > -1 ? " secili" : "") + '" data-gun="' + g +
              '" aria-pressed="' + (yp.gunler.indexOf(g) > -1) + '">' + g + "</button>";
          }).join("") + "</div>" +
          '<p class="yardim-metni">En az 1 gün seçmelisiniz. Plan kotanızın yayılması için ' +
            "seçtiğiniz günler kullanılır.</p>" +
          '<p class="hata"></p></div>' +
        '<button class="btn btn-birincil btn-tam" data-eylem="program-kaydet">Yayın Programını Kaydet</button>' +
      "</div>" +

      '<div class="kart-bolum"><h3>Ödeme geçmişi</h3>' +
        (odemeler.length
          ? '<div class="tablo-sar"><table class="tablo"><thead><tr><th>Tarih</th><th>Paket</th>' +
            '<th class="sayi-hucre">Tutar</th></tr></thead><tbody>' +
            odemeler.map(function (o) {
              return "<tr><td>" + esc(trTarih(o.tarih)) + "</td><td>" + esc(o.paket) + "</td>" +
                '<td class="sayi-hucre">' + esc(o.tutar) + "</td></tr>";
            }).join("") + "</tbody></table></div>"
          : '<p class="yardim-metni">Henüz ödeme kaydı yok.</p>') +
      "</div>" +

      '<div class="kart-bolum tehlike"><h3 class="ayrik">Kişisel veriler (KVKK)</h3>' +
        '<p class="bolum-alt">6698 sayılı KVKK\'nın 11. maddesi kapsamında kendi verilerinizi ' +
          "indirebilir veya silebilirsiniz.</p>" +
        '<div class="buton-satir">' +
          '<button class="btn btn-ikincil" data-eylem="veri-indir">↓ Verilerimi İndir (JSON)</button>' +
          '<button class="btn btn-ret" data-eylem="hesap-sil">Hesabımı Sil</button>' +
        "</div>" +
        '<p class="yardim-metni" style="margin-top:14px"><strong>Not:</strong> Hesabınız ' +
          "silindiğinde iletişim bilgileri, kart referansı ve erişim kayıtlarınız silinir. " +
          "Yayınlanmış blog yazılarınız sitenizde kalmaya devam eder. Aktif aboneliğiniz varsa " +
          "otomatik iptal edilir.</p>" +
      "</div>";
  }

  function telefonKaydet() {
    var girdi = document.getElementById("hTelefon");
    var alan = girdi.closest(".alan");
    var deger = girdi.value.trim();
    /* rakam sayısına bakıyoruz; biçim serbest */
    if (deger.replace(/\D/g, "").length < 10) {
      alan.classList.add("hatali");
      alan.querySelector(".hata").textContent = "Telefon numarası eksik görünüyor.";
      girdi.focus();
      return;
    }
    alan.classList.remove("hatali");
    alan.querySelector(".hata").textContent = "";
    var eski = M.hesap.telefon;
    M.hesap.telefon = deger;

    kararGonder({ tur: "ayarlar", telefon: deger }).then(function (v) {
      if (!v) return;
      toast("Telefon numaranız kaydedildi.");
    }).catch(function () {
      M.hesap.telefon = eski;
      hesabimCiz();
    });
  }

  function sifreKaydet() {
    var s1 = document.getElementById("hSifre1");
    var s2 = document.getElementById("hSifre2");
    var a1 = s1.closest(".alan");
    var a2 = s2.closest(".alan");

    function isaret(alan, mesaj) {
      alan.classList.toggle("hatali", !!mesaj);
      alan.querySelector(".hata").textContent = mesaj || "";
      return !mesaj;
    }

    var sEski = document.getElementById("hSifreEski");
    var aEski = sEski.closest(".alan");

    var t0 = isaret(aEski, sEski.value ? null : "Mevcut şifrenizi yazın.");
    var t1 = isaret(a1, s1.value.length < 8 ? "Şifre en az 8 karakter olmalı." : null);
    var t2 = isaret(a2, s1.value !== s2.value ? "İki şifre birbirini tutmuyor." : null);
    if (!t0) { sEski.focus(); return; }
    if (!t1) { s1.focus(); return; }
    if (!t2) { s2.focus(); return; }

    /* Mevcut şifre soruluyor: oturum tek başına yetmez. Çerezi ele geçirmiş
       biri şifreyi değiştirip hesabı kalıcı olarak devralabilirdi. */
    fetch("/.netlify/functions/sifre-degistir", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ mevcut: sEski.value, yeni: s1.value })
    }).then(function (cevap) {
      /* 401 iki şey olabilir: oturum düştü ya da mevcut şifre yanlış.
         Ayıran şey gövde: oturum düştüyse `girisli: false` geliyor. */
      return cevap.json().catch(function () { return {}; }).then(function (v) {
        return { kod: cevap.status, veri: v };
      });
    }).then(function (s) {
      if (s.kod === 200 && s.veri.degisti) {
        sEski.value = ""; s1.value = ""; s2.value = "";
        var ek = s.veri.dusenOturum > 0
          ? " Diğer cihazlardaki oturumlarınız kapatıldı."
          : "";
        toast("Şifreniz güncellendi." + ek);
        return;
      }
      if (s.kod === 401 && s.veri.girisli === false) { girisEkranina(); return; }
      isaret(aEski, s.veri.hata || "Şifre değiştirilemedi.");
      sEski.focus();
    }).catch(function () {
      toast("Sunucuya ulaşılamadı. Şifreniz değişmedi.");
    });
  }

  function programKaydet() {
    var alan = document.getElementById("alanGunler");
    var secili = [].slice.call(alan.querySelectorAll(".gun-hap.secili")).map(function (b) {
      return b.dataset.gun;
    });

    if (!secili.length) {
      alan.classList.add("hatali");
      alan.querySelector(".hata").textContent = "En az bir gün seçmelisiniz.";
      return;
    }
    alan.classList.remove("hatali");
    alan.querySelector(".hata").textContent = "";

    var eski = { gunler: M.yayinProgrami.gunler, saat: M.yayinProgrami.saat };
    var yeni = { gunler: secili, saat: document.getElementById("hSaat").value };
    M.yayinProgrami = yeni;
    yazilarimiCiz();

    kararGonder({ tur: "ayarlar", yayinProgrami: yeni }).then(function (v) {
      if (!v) return;
      toast("Yayın programınız kaydedildi: " + secili.join(", ") + " · " + yeni.saat);
    }).catch(function () {
      M.yayinProgrami = eski;
      yazilarimiCiz();
      hesabimCiz();
    });
  }

  function verileriIndir() {
    var veri = {
      disaAktarmaTarihi: M.bugun,
      hesap: M.hesap,
      abonelik: M.abonelik,
      yayinProgrami: M.yayinProgrami,
      markaProfili: M.marka,
      yazilar: (M.yazilar || []).map(function (y) {
        return { baslik: y.baslik, kategori: y.kategori, durum: y.durum, tarih: y.tarih };
      }),
      destekTalepleri: M.destek.talepler,
      odemeGecmisi: M.odemeGecmisi
    };

    var bag = URL.createObjectURL(
      new Blob([JSON.stringify(veri, null, 2)], { type: "application/json" })
    );
    var a = document.createElement("a");
    a.href = bag;
    a.download = "dolunay-verilerim-" + M.bugun + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(bag); }, 1000);

    toast("Verileriniz JSON dosyası olarak indirildi.");
  }

  /* Silme TALEBİ, silmenin kendisi değil.
     Panel hesabı doğrudan silemiyor, çünkü silme aynı anda iyzico'daki aktif
     aboneliğin iptalini gerektiriyor ve o çağrı panelde yok. "Sildik" deyip
     aboneliği açık bırakmak, müşteriden para çekilmeye devam etmesi demekti.
     Talep destek kaydına düşüyor, KVKK süresi içinde elle tamamlanıyor. */
  function hesapSilOnayi() {
    modalAc(
      modalBasiHtml("Hesap silme talebi",
        "Talebiniz bize iletilir, işlemi biz tamamlarız.") +
      '<div class="modal-govde">' +
        '<div class="bilgi-serit" style="background:rgba(248,113,113,.1);' +
          'border-color:rgba(248,113,113,.3);margin-bottom:0">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
            'stroke-linecap="round" style="color:var(--red)">' +
            '<path d="M12 8v5M12 16.5h.01"/><circle cx="12" cy="12" r="8.5"/></svg>' +
          "<span>Talebiniz alındıktan sonra iletişim bilgileriniz, kart referansınız ve " +
          "erişim kayıtlarınız silinir, aktif aboneliğiniz iptal edilir. " +
          "Yayınlanmış blog yazılarınız sitenizde kalmaya devam eder. " +
          "İşlem tamamlanınca size e-posta ile bilgi veririz.</span>" +
        "</div>" +
      "</div>" +
      '<div class="modal-alti">' +
        '<button class="btn btn-ikincil" data-eylem="modal-kapat">Vazgeç</button>' +
        '<button class="btn btn-ret" data-eylem="hesap-sil-onayla">Silme talebi gönder</button>' +
      "</div>",
      { dar: true, ad: "Hesap silme talebi" }
    );
  }

  /* Talep destek kaydına düşüyor: müşterinin de bizim de gördüğümüz tek
     ortak liste orası. Yazma başarısız olursa müşteriye "alındı" DENMİYOR;
     kararGonder zaten uyarıyor, biz de listeden geri alıyoruz. */
  function hesapSilmeTalebi() {
    if (!M.destek) M.destek = { talepler: [] };
    if (!Array.isArray(M.destek.talepler)) M.destek.talepler = [];

    var talep = {
      konu: "Hesap silme talebi",
      mesaj: "Müşteri panelden hesabının silinmesini istedi. Aktif aboneliğin " +
        "iptali ve kayıtların silinmesi elle tamamlanacak.",
      tarih: M.bugun,
      durum: "Açık"
    };
    M.destek.talepler.unshift(talep);
    destekCiz();

    kararGonder({ tur: "ayarlar", destekTalepleri: M.destek.talepler }).then(function (v) {
      if (!v) return;
      toast("Silme talebiniz alındı. İşlem tamamlanınca e-posta ile bilgi vereceğiz.");
    }).catch(function () {
      var i = M.destek.talepler.indexOf(talep);
      if (i >= 0) M.destek.talepler.splice(i, 1);
      destekCiz();
    });
  }

  /* ---- takvimde sürükle-bırak ----
     Yalnızca planlanmış (onaylanmış ama henüz yayınlanmamış) yazılar taşınır.
     Yayınlanmışlar geçmişte kaldığı, onay bekleyenler ise henüz onaylanmadığı
     için sabittir. Değişiklik bellekte tutulur; sayfa yenilenince sıfırlanır. */

  var suruklenen = null;

  document.addEventListener("dragstart", function (e) {
    var cip = e.target.closest ? e.target.closest(".yazi-cip[draggable='true']") : null;
    if (!cip) return;
    suruklenen = cip.dataset.yazi;
    cip.classList.add("surukleniyor");
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", suruklenen);
    } catch (hata) {}
  });

  document.addEventListener("dragend", function (e) {
    var cip = e.target.closest ? e.target.closest(".yazi-cip") : null;
    if (cip) cip.classList.remove("surukleniyor");
    suruklenen = null;
    document.querySelectorAll(".gun.hedef, .gun.yasak-hedef").forEach(function (g) {
      g.classList.remove("hedef", "yasak-hedef");
    });
  });

  /* Hedef gün geçerli mi? Geçmişe ve ay dışına bırakılamaz. */
  function hedefGecerli(hucre) {
    if (!hucre || !suruklenen) return false;
    if (hucre.classList.contains("disay")) return false;
    return hucre.dataset.tarih > (M.bugun || "");
  }

  document.addEventListener("dragover", function (e) {
    var hucre = e.target.closest ? e.target.closest(".gun") : null;
    if (!hucre || !suruklenen) return;
    e.preventDefault();
    var olur = hedefGecerli(hucre);
    /* Yasak hücrede de "move" bırakılıyor. dropEffect "none" olsaydı tarayıcı
       drop olayını hiç tetiklemez, aşağıdaki açıklama toast'ı çalışmaz ve
       kullanıcı sürüklemenin bozuk olduğunu sanırdı. Reddi kırmızı hücre
       önden gösteriyor, sebebini bırakınca toast söylüyor. */
    e.dataTransfer.dropEffect = "move";
    hucre.classList.toggle("hedef", olur);
    hucre.classList.toggle("yasak-hedef", !olur);
  });

  document.addEventListener("dragleave", function (e) {
    var hucre = e.target.closest ? e.target.closest(".gun") : null;
    if (hucre) hucre.classList.remove("hedef", "yasak-hedef");
  });

  document.addEventListener("drop", function (e) {
    var hucre = e.target.closest ? e.target.closest(".gun") : null;
    if (!hucre || !suruklenen) return;
    e.preventDefault();

    var yazi = yaziBul(suruklenen);
    var hedef = hucre.dataset.tarih;
    hucre.classList.remove("hedef", "yasak-hedef");

    if (!yazi) return;
    if (hucre.classList.contains("disay")) {
      toast("Yazıyı yalnızca görüntülenen ay içinde taşıyabilirsiniz.");
      return;
    }
    if (hedef <= (M.bugun || "")) {
      toast("Geçmiş bir güne taşınamaz.");
      return;
    }
    if (hedef === yazi.tarih) return;

    /* dolu güne bırakıldıysa iki yazı yer değiştirir */
    var mevcut = gunUnYazilari(hedef).filter(function (y) { return y.id !== yazi.id; })[0];
    var eski = yazi.tarih;
    yazi.tarih = hedef;

    if (mevcut) mevcut.tarih = eski;
    cizHepsi();

    /* Yer değiştirmede İKİ yazının da tarihi değişiyor, yani iki karar.
       İkisi de yazılamazsa ekran geri alınır; yarım kalmış bir takvim,
       müşterinin gördüğüyle motorun göreceğini ayırır. */
    var istekler = [kararGonder({ tur: "tarih", yaziId: yazi.id, tarih: hedef })];
    if (mevcut) istekler.push(kararGonder({ tur: "tarih", yaziId: mevcut.id, tarih: eski }));

    Promise.all(istekler).then(function (sonuclar) {
      if (sonuclar.some(function (s) { return !s; })) return;
      if (mevcut) toast("İki yazı yer değiştirdi: " + trTarih(hedef) + " ↔ " + trTarih(eski));
      else toast("Yazı " + trTarih(hedef) + " tarihine alındı.");
    }).catch(function () {
      yazi.tarih = eski;
      if (mevcut) mevcut.tarih = hedef;
      cizHepsi();
    });
  });

  /* =======================================================================
     Menü ve yönlendirme
     ======================================================================= */

  var MENU = [
    { id: "anasayfa", ad: "Ana Sayfa", ikon: "i-ev" },
    { id: "posts",    ad: "Yazılarım", ikon: "i-yazi" },
    { id: "topics",   ad: "Konular",   ikon: "i-konu" },
    { id: "brand",    ad: "Markam",    ikon: "i-marka" },
    { id: "support",  ad: "Destek",    ikon: "i-destek" },
    { id: "hesap",    ad: "Hesabım",   ikon: "i-hesap" }
  ];

  var MENU_ALT = [
    { id: "help",  ad: "Yardım", ikon: "i-yardim" },
    { id: "cikis", ad: "Çıkış",  ikon: "i-cikis", eylem: "cikis" }
  ];

  /* menüdeki "hesap" bölümünün adresi #account */
  var HASH = {
    anasayfa: "", posts: "posts", topics: "topics",
    brand: "brand", support: "support", hesap: "account", help: "help"
  };
  var BOLUM = {
    anasayfa: "b-anasayfa", posts: "b-posts", topics: "b-topics",
    brand: "b-brand", support: "b-support", hesap: "b-account", help: "b-help"
  };
  var HASHTAN_ID = { "": "anasayfa", "posts": "posts", "topics": "topics",
    "brand": "brand", "support": "support", "account": "hesap", "help": "help" };

  function dugmeCiz(kayit) {
    var a = document.createElement("a");
    a.className = "ray-link";
    a.href = kayit.eylem ? "#" : ("#" + HASH[kayit.id]);
    a.dataset.bolum = kayit.id;
    if (kayit.eylem) a.dataset.eylem = kayit.eylem;
    a.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + kayit.ikon + '"></use></svg>' +
      "<span>" + kayit.ad + "</span>";
    return a;
  }

  var rayMenu = document.getElementById("rayMenu");
  var rayMenuAlt = document.getElementById("rayMenuAlt");
  MENU.forEach(function (k) { rayMenu.appendChild(dugmeCiz(k)); });
  MENU_ALT.forEach(function (k) { rayMenuAlt.appendChild(dugmeCiz(k)); });

  /* ---- üst şerit ---- */
  (function tepeyiDoldur() {
    var kutu = document.getElementById("tepeSag");
    var ab = M.abonelik;
    if (!kutu || !ab) return;
    kutu.innerHTML =
      '<span class="rozet rozet-mavi">' + esc(ab.paket) + " · " + esc(ab.aylikYazi) + " yazı/ay</span>" +
      '<span class="rozet rozet-yesil">' + esc(ab.durum) + "</span>";
  })();

  /* ---- bölüm açma ---- */

  var bolumler = document.querySelectorAll(".bolum");
  var baslik = document.getElementById("sayfaBasligi");

  function bolumAc(id) {
    if (!BOLUM[id]) id = "anasayfa";

    for (var i = 0; i < bolumler.length; i++) {
      bolumler[i].classList.toggle("acik", bolumler[i].id === BOLUM[id]);
    }

    var etkinBolum = document.getElementById(BOLUM[id]);
    baslik.textContent = etkinBolum ? etkinBolum.dataset.baslik : "Panel";
    document.title = baslik.textContent + " · dolunay.ai";

    var linkler = document.querySelectorAll(".ray-link");
    for (var j = 0; j < linkler.length; j++) {
      var etkin = linkler[j].dataset.bolum === id;
      linkler[j].classList.toggle("etkin", etkin);
      if (etkin) linkler[j].setAttribute("aria-current", "page");
      else linkler[j].removeAttribute("aria-current");
    }

    window.scrollTo(0, 0);
  }

  function hashtanAc() {
    var h = (window.location.hash || "").replace("#", "");
    bolumAc(HASHTAN_ID[h] || "anasayfa");
  }

  /* ---- tıklamalar ---- */

  document.addEventListener("click", function (e) {
    var cikisDugmesi = e.target.closest('[data-eylem="cikis"]');
    if (cikisDugmesi) {
      e.preventDefault();
      cikisYap();
      return;
    }

    var onayDugmesi = e.target.closest('[data-eylem="onayla"]');
    if (onayDugmesi) {
      e.preventDefault();
      yaziOnayla(onayDugmesi.dataset.yazi);
      return;
    }

    /* takvim çipine tıklayınca önizleme açılır */
    var cip = e.target.closest(".yazi-cip[data-yazi]");
    if (cip) {
      e.preventDefault();
      onizlemeAc(cip.dataset.yazi);
      return;
    }

    /* yayın günü hapları — seçim burada sadece işaretlenir, Kaydet'te yazılır */
    var gunHapi = e.target.closest(".gun-hap");
    if (gunHapi) {
      e.preventDefault();
      var acik = !gunHapi.classList.contains("secili");
      gunHapi.classList.toggle("secili", acik);
      gunHapi.setAttribute("aria-pressed", String(acik));
      var gunlerAlani = gunHapi.closest(".alan");
      gunlerAlani.classList.remove("hatali");
      gunlerAlani.querySelector(".hata").textContent = "";
      return;
    }

    var odaklaDugmesi = e.target.closest("[data-odakla]");
    if (odaklaDugmesi) {
      e.preventDefault();
      var hedefAlan = document.querySelector(odaklaDugmesi.dataset.odakla);
      if (hedefAlan) hedefAlan.focus();
      return;
    }

    var eylemDugmesi = e.target.closest("[data-eylem]");
    if (eylemDugmesi) {
      var eylem = eylemDugmesi.dataset.eylem;
      var yaziId = eylemDugmesi.dataset.yazi;

      if (eylem === "onizle")  { e.preventDefault(); onizlemeAc(yaziId); return; }
      if (eylem === "konu-ekle")     { e.preventDefault(); konuEkle(); return; }
      if (eylem === "konu-sil")      { e.preventDefault(); konuSil(eylemDugmesi.dataset.konu); return; }
      if (eylem === "marka-kaydet")  { e.preventDefault(); markaKaydet(); return; }
      if (eylem === "destek-gonder") { e.preventDefault(); destekGonder(); return; }
      if (eylem === "telefon-kaydet"){ e.preventDefault(); telefonKaydet(); return; }
      if (eylem === "sifre-kaydet")  { e.preventDefault(); sifreKaydet(); return; }
      if (eylem === "program-kaydet"){ e.preventDefault(); programKaydet(); return; }
      if (eylem === "veri-indir")    { e.preventDefault(); verileriIndir(); return; }
      if (eylem === "hesap-sil")     { e.preventDefault(); hesapSilOnayi(); return; }
      if (eylem === "hesap-sil-onayla") {
        e.preventDefault();
        modalKapat();
        hesapSilmeTalebi();
        return;
      }
      if (eylem === "reddet")  { e.preventDefault(); reddetAc(yaziId); return; }
      if (eylem === "duzenle") { e.preventDefault(); duzenleAc(yaziId); return; }
      if (eylem === "modal-kapat") { e.preventDefault(); modalKapat(); return; }
      if (eylem === "ret-onayla")  { e.preventDefault(); yaziReddet(yaziId); return; }
      if (eylem === "duzenle-kaydet") {
        e.preventDefault();
        yaziKaydet(yaziId, eylemDugmesi);
        return;
      }
    }

    var ayDugmesi = e.target.closest("[data-ay]");
    if (ayDugmesi) {
      e.preventDefault();
      var adim = Number(ayDugmesi.dataset.ay);
      var d = new Date(gosterilenAy.yil, gosterilenAy.ay + adim, 1);
      gosterilenAy = { yil: d.getFullYear(), ay: d.getMonth() };
      yazilarimiCiz();
      return;
    }

    var gitDugmesi = e.target.closest("[data-git]");
    if (gitDugmesi) {
      e.preventDefault();
      var hedef = gitDugmesi.dataset.git;
      window.location.hash = hedef === "anasayfa" ? "" : "#" + hedef;
      if (!window.location.hash) hashtanAc();
    }
  });

  /* ---- başlat ---- */

  /* bölüm değiştirince en üstten başlansın; tarayıcı eski konumu geri
     yüklemesin */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  /* Marka renkleri iki yönlü: hex yazılınca seçici, seçiciden renk alınınca
     hex alanı güncellenir. Yarım yazılmış hex seçiciye gönderilmez, yoksa
     seçici siyaha düşerdi. */
  document.addEventListener("input", function (e) {
    var hedef = e.target;

    if (hedef.id === "mRenk1" || hedef.id === "mRenk2") {
      var kutu = document.getElementById(hedef.id + "Kutu");
      if (kutu && HEX_KALIP.test(hedef.value.trim())) {
        kutu.value = hedef.value.trim().toLowerCase();
      }
      return;
    }

    if (hedef.id === "mRenk1Kutu" || hedef.id === "mRenk2Kutu") {
      var girdi = document.getElementById(hedef.id.replace("Kutu", ""));
      if (!girdi) return;
      girdi.value = hedef.value.toUpperCase();
      /* Seçiciden gelen değer her zaman geçerli; varsa eski hata silinir. */
      var alan = girdi.closest(".alan");
      if (alan) {
        alan.classList.remove("hatali");
        var hataSatiri = alan.querySelector(".hata");
        if (hataSatiri) hataSatiri.textContent = "";
      }
    }
  });

  /* ---- açılış ----
     Tek istek hem oturumu doğruluyor hem veriyi getiriyor: uç girişli
     değilse 401 veriyor, o zaman giriş ekranına dönülüyor. Ayrı bir oturum
     sorgusu fazladan gidiş dönüş olurdu. */
  function ekranlariCiz() {
    cizHepsi();
    konularCiz();
    markamCiz();
    destekCiz();
    hesabimCiz();
    window.addEventListener("hashchange", hashtanAc);
    hashtanAc();
  }

  fetch(VERI_UCU, {
    credentials: "same-origin",
    headers: { "Accept": "application/json" }
  }).then(function (cevap) {
    if (cevap.status === 401) { girisEkranina(); return null; }
    if (!cevap.ok) throw new Error("veri alınamadı: " + cevap.status);
    return cevap.json();
  }).then(function (veri) {
    if (!veri) return;
    M = veri;
    document.body.classList.remove("dogrulaniyor");
    ekranlariCiz();
    sonGuncellemeyiGoster();
  }).catch(function (hata) {
    /* Doğrulanmamış birine panel göstermektense hiç göstermemek doğrusu.
       Ama giriş ekranına atmak da yanlış olur: oturum geçerli olabilir,
       sorun veri ucunda olabilir. Sayfa açılır ve ne olduğu söylenir. */
    document.body.classList.remove("dogrulaniyor");
    veriYokEkrani(hata && hata.message);
  });
})();
