'use strict';

// node netlify/sinav/veri_katmani.js
//
// Veri katmani: motorun anlik goruntusu, panelin kararlari, birlestirme.
// Olculen asil sey SAHIPLIK: motor panelin alanlarini ezemiyor mu, panelin
// karari cakismada kazaniyor mu, metin duzenlenince sayaclar duzeliyor mu.

const path = require('node:path');
const Module = require('node:module');

const HESAP = path.resolve(__dirname, '../lib/hesap.js');
const VERI = path.resolve(__dirname, '../lib/veri.js');
const YAZ = path.resolve(__dirname, '../lib/uclar/motor-yaz.js');
const OKU = path.resolve(__dirname, '../lib/uclar/motor-oku.js');
const P_VERI = path.resolve(__dirname, '../lib/uclar/panel-veri.js');
const P_YAZI = path.resolve(__dirname, '../lib/uclar/panel-yazi.js');
const P_KARAR = path.resolve(__dirname, '../lib/uclar/panel-karar.js');
const EPOSTA = 'musteri@ornek.com';

const SIR = 'sinav-motor-sirri';
const SLUG = 'ornek-musteri';

const kutu = new Map();
let depoKapali = false;
const gercekYukle = Module._load;
Module._load = function (istek, ...kalan) {
  if (istek !== '@netlify/blobs') return gercekYukle.call(this, istek, ...kalan);
  const bak = () => { if (depoKapali) throw new Error('sinav_depo_kapali'); };
  return {
    getStore: () => ({
      get: async (a) => { bak(); const d = kutu.get(a); return d === undefined ? null : JSON.parse(d); },
      setJSON: async (a, d) => { bak(); kutu.set(a, JSON.stringify(d)); },
      delete: async (a) => { bak(); kutu.delete(a); },
      list: async ({ prefix } = {}) => {
        bak();
        return { blobs: [...kutu.keys()].filter((a) => !prefix || a.startsWith(prefix)).map((a) => ({ key: a })) };
      },
    }),
  };
};

function taze() {
  for (const d of [HESAP, VERI, YAZ, OKU, P_VERI, P_YAZI, P_KARAR]) {
    try { delete require.cache[require.resolve(d)]; } catch { /* ilk kosu */ }
  }
}

function olay(yontem, govde, sorgu, sir) {
  return {
    httpMethod: yontem,
    headers: Object.assign({ 'content-type': 'application/json' },
      sir === null ? {} : { 'x-motor-sirri': sir === undefined ? SIR : sir }),
    body: govde ? JSON.stringify(govde) : '',
    isBase64Encoded: false,
    queryStringParameters: sorgu || {},
  };
}

const govde = (c) => { try { return JSON.parse(c.body); } catch { return {}; } };
const anahtarlar = (onek) => [...kutu.keys()].filter((a) => a.startsWith(onek));

const ORNEK = {
  slug: SLUG,
  uretildi: '2026-09-12T08:00:00Z',
  blogAdresi: 'https://ornek.example/blog',
  baglantiDurumu: 'tamam',
  yazilar: [
    { id: 'y1', baslik: 'Birinci yazi', ozet: 'ozet bir', kategori: 'Kira', durum: 'bekliyor',
      tarih: '2026-09-14', kelime: 1200, okumaDk: 6, adres: 'https://ornek.example/blog/bir',
      icerik: '<p>' + 'kelime '.repeat(1200) + '</p>' },
    { id: 'y2', baslik: 'Ikinci yazi', ozet: 'ozet iki', kategori: 'Miras', durum: 'yayinda',
      tarih: '2026-09-01', kelime: 900, okumaDk: 5, icerik: '<p>govde iki</p>' },
  ],
  konular: [{ id: 'k1', konu: 'Bir konu', kategori: 'Kira', hacim: 900, rekabet: 'Düşük', skor: 90 }],
};

const VAKALAR = [];
const vaka = (ad, f) => VAKALAR.push([ad, f]);

vaka('V1_motor_yazabiliyor_metin_ayri_anahtarda', async () => {
  const c = await require(YAZ).handler(olay('POST', ORNEK));
  const b = govde(c);
  return {
    gecti: c.statusCode === 200 && b.yazildi === true && b.yazi === 2 && b.metin === 2
      && anahtarlar(`motor/${SLUG}/liste`).length === 1
      && anahtarlar(`motor/${SLUG}/yazi/`).length === 2
      // Liste metinsiz olmali.
      && !JSON.parse(kutu.get(`motor/${SLUG}/liste`)).yazilar.some((y) => y.icerik),
    not: `kod:${c.statusCode} ${JSON.stringify(b)}`,
  };
});

vaka('V2_sir_yanlissa_401_yazma_olmaz', async () => {
  const c = await require(YAZ).handler(olay('POST', ORNEK, null, 'yanlis-sir'));
  const c2 = await require(YAZ).handler(olay('POST', ORNEK, null, null));
  return {
    gecti: c.statusCode === 401 && c2.statusCode === 401 && anahtarlar('motor/').length === 0,
    not: `yanlis:${c.statusCode} yok:${c2.statusCode} anahtar:${anahtarlar('motor/').length}`,
  };
});

vaka('V3_panelin_alanlari_kabul_edilmiyor', async () => {
  // Motor eski cikti sekliyle panelin alanlarini da gonderirse YAZILMAMALI.
  const kirli = JSON.parse(JSON.stringify(ORNEK));
  kirli.yayinProgrami = { saat: '09:00', gunler: ['Pzt'] };
  kirli.marka = { sektor: 'motorun yazdigi' };
  kirli.whatsapp = { numara: '+900000000000', izin: true };
  kirli.yazilar[0].reddedildi = '2026-09-11';
  kirli.yazilar[0].reddetmeNedeni = 'motor yazdi';
  kirli.yazilar[0].onayaGonderildi = '2026-09-10';
  await require(YAZ).handler(olay('POST', kirli));
  const liste = JSON.parse(kutu.get(`motor/${SLUG}/liste`));
  const y1 = liste.yazilar.find((y) => y.id === 'y1');
  return {
    gecti: liste.yayinProgrami === undefined && liste.marka === undefined
      && liste.whatsapp === undefined
      && y1.reddedildi === undefined && y1.reddetmeNedeni === undefined
      && y1.onayaGonderildi === undefined,
    not: JSON.stringify(Object.keys(liste)) + ' / ' + JSON.stringify(Object.keys(y1)),
  };
});

vaka('V4_slug_dogrulaniyor', async () => {
  const kotu = ['', 'BUYUK', '../kacis', 'a', 'x'.repeat(80), 'bosluk var'];
  const kodlar = [];
  for (const s of kotu) {
    const c = await require(YAZ).handler(olay('POST', Object.assign({}, ORNEK, { slug: s })));
    kodlar.push(c.statusCode);
  }
  return {
    gecti: kodlar.every((k) => k === 400) && anahtarlar('motor/').length === 0,
    not: kodlar.join(','),
  };
});

vaka('V5_onay_karari_durumu_ilerletir', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, { yazilar: { y1: { onay: { zaman: '2026-09-12T10:00:00Z' } } } });
  const birlesik = v.birlestir({
    motor: await v.motorListeOku(SLUG), kararlar: await v.kararlarOku(SLUG),
    ayarlar: {}, hesap: {}, bugun: '2026-09-12',
  });
  const y1 = birlesik.yazilar.find((y) => y.id === 'y1');
  const y2 = birlesik.yazilar.find((y) => y.id === 'y2');
  return {
    gecti: y1.durum === 'planlandi' && y2.durum === 'yayinda',
    not: `y1:${y1.durum} y2:${y2.durum}`,
  };
});

vaka('V6_onay_yayindaki_yaziyi_geri_almaz', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, { yazilar: { y2: { onay: { zaman: '2026-09-12T10:00:00Z' } } } });
  const b = v.birlestir({ motor: await v.motorListeOku(SLUG), kararlar: await v.kararlarOku(SLUG), bugun: 'x' });
  return {
    gecti: b.yazilar.find((y) => y.id === 'y2').durum === 'yayinda',
    not: b.yazilar.find((y) => y.id === 'y2').durum,
  };
});

vaka('V7_ret_her_seyi_gecer_ve_tarihi_bosaltir', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, { yazilar: { y1: { ret: { zaman: 'z', neden: 'istemiyorum' } } } });
  const y1 = v.birlestir({ motor: await v.motorListeOku(SLUG), kararlar: await v.kararlarOku(SLUG) })
    .yazilar.find((y) => y.id === 'y1');
  return {
    gecti: y1.durum === 'reddedildi' && y1.reddetmeNedeni === 'istemiyorum' && y1.tarih === null,
    not: `${y1.durum} / ${y1.reddetmeNedeni} / ${y1.tarih}`,
  };
});

vaka('V8_tarih_degisikliginde_panel_kazanir', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, { yazilar: { y1: { tarihDegisikligi: { tarih: '2026-09-16', zaman: 'z' } } } });
  const y1 = v.birlestir({ motor: await v.motorListeOku(SLUG), kararlar: await v.kararlarOku(SLUG) })
    .yazilar.find((y) => y.id === 'y1');
  return { gecti: y1.tarih === '2026-09-16', not: y1.tarih };
});

vaka('V9_metin_degisikliginde_panel_kazanir_sayaclar_yeniden', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  const yeniGovde = '<p>' + 'kisa '.repeat(100) + '</p>';
  await v.kararlarYaz(SLUG, {
    yazilar: { y1: { metinDegisikligi: { baslik: 'Musteri basligi', icerik: yeniGovde, zaman: 'z' } } },
  });
  const y1 = v.birlestir({ motor: await v.motorListeOku(SLUG), kararlar: await v.kararlarOku(SLUG) })
    .yazilar.find((y) => y.id === 'y1');
  return {
    gecti: y1.baslik === 'Musteri basligi' && y1.panelDuzenledi === true
      // Motor 1200 demisti; yeni govde 100 kelime.
      && y1.kelime === 100 && y1.okumaDk === 1
      // Ozet degistirilmedi, motorunki kalmali.
      && y1.ozet === 'ozet bir',
    not: `kelime:${y1.kelime} okuma:${y1.okumaDk} ozet:${y1.ozet}`,
  };
});

vaka('V10_yalniz_baslik_degistiyse_govde_donmaz', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, { yazilar: { y1: { metinDegisikligi: { baslik: 'Yeni baslik', zaman: 'z' } } } });
  const y1 = v.birlestir({ motor: await v.motorListeOku(SLUG), kararlar: await v.kararlarOku(SLUG) })
    .yazilar.find((y) => y.id === 'y1');
  return {
    // Govde degismedigi icin motorun kelime sayisi korunur.
    gecti: y1.baslik === 'Yeni baslik' && y1.kelime === 1200,
    not: `baslik:${y1.baslik} kelime:${y1.kelime}`,
  };
});

vaka('V11_motorun_ikinci_yazisi_kararlari_ezmez', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, { yazilar: { y1: { onay: { zaman: 'z' } } } });
  // Motor yeniden yaziyor, y1 hala "bekliyor" diyor.
  await require(YAZ).handler(olay('POST', ORNEK));
  const kararlar = await v.kararlarOku(SLUG);
  const y1 = v.birlestir({ motor: await v.motorListeOku(SLUG), kararlar }).yazilar.find((y) => y.id === 'y1');
  return {
    gecti: kararlar.yazilar.y1 && kararlar.yazilar.y1.onay && y1.durum === 'planlandi',
    not: `karar duruyor mu:${!!(kararlar.yazilar.y1)} durum:${y1.durum}`,
  };
});

vaka('V12_motor_bekleyen_kararlari_okuyor', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, {
    yazilar: { y1: { onay: { zaman: 'z1' } }, y2: { ret: { zaman: 'z2', neden: 'yok' } } },
  });
  const c = await require(OKU).handler(olay('GET', null, { slug: SLUG }));
  const b = govde(c);
  return {
    gecti: c.statusCode === 200 && b.bekleyen.length === 2
      && b.bekleyen.some((k) => k.yaziId === 'y1' && k.tur === 'onay'),
    not: `kod:${c.statusCode} sayi:${b.bekleyen && b.bekleyen.length}`,
  };
});

vaka('V13_islenen_karar_bir_daha_gelmez', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, { yazilar: { y1: { onay: { zaman: 'z1' } } } });
  const ilk = govde(await require(OKU).handler(olay('GET', null, { slug: SLUG })));
  await require(OKU).handler(olay('POST', { slug: SLUG, kimlikler: ilk.bekleyen.map((k) => k.kimlik) }));
  const ikinci = govde(await require(OKU).handler(olay('GET', null, { slug: SLUG })));
  return {
    gecti: ilk.bekleyen.length === 1 && ikinci.bekleyen.length === 0,
    not: `ilk:${ilk.bekleyen.length} ikinci:${ikinci.bekleyen.length}`,
  };
});

vaka('V14_ayni_yazinin_ikinci_duzenlemesi_yeni_is_sayilir', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.kararlarYaz(SLUG, { yazilar: { y1: { metinDegisikligi: { icerik: '<p>bir</p>', zaman: 'z1' } } } });
  const ilk = govde(await require(OKU).handler(olay('GET', null, { slug: SLUG })));
  await require(OKU).handler(olay('POST', { slug: SLUG, kimlikler: ilk.bekleyen.map((k) => k.kimlik) }));
  // Musteri tekrar duzenliyor: zaman degisti, yeni is.
  await v.kararlarYaz(SLUG, { yazilar: { y1: { metinDegisikligi: { icerik: '<p>iki</p>', zaman: 'z2' } } } });
  const ikinci = govde(await require(OKU).handler(olay('GET', null, { slug: SLUG })));
  return { gecti: ikinci.bekleyen.length === 1, not: `sayi:${ikinci.bekleyen.length}` };
});

vaka('V15_motor_panel_ayarlarini_okur_yazmaz', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.ayarlarYaz(SLUG, { yayinProgrami: { saat: '15:00', gunler: ['Pzt', 'Çar'] }, marka: { sektor: 'Hukuk' } });
  const b = govde(await require(OKU).handler(olay('GET', null, { slug: SLUG })));
  // Motor tekrar yaziyor; ayarlara dokunmamali.
  await require(YAZ).handler(olay('POST', ORNEK));
  const sonra = await v.ayarlarOku(SLUG);
  return {
    gecti: b.ayarlar.yayinProgrami.saat === '15:00' && sonra.yayinProgrami.saat === '15:00'
      && sonra.marka.sektor === 'Hukuk',
    not: JSON.stringify(sonra),
  };
});

vaka('V16_birlestirmede_panel_ayarlari_kullanilir', async () => {
  const v = require(VERI);
  await require(YAZ).handler(olay('POST', ORNEK));
  await v.ayarlarYaz(SLUG, { yayinProgrami: { saat: '15:00', gunler: ['Pzt'] }, whatsapp: { numara: '+90', izin: true } });
  const b = v.birlestir({
    motor: await v.motorListeOku(SLUG), kararlar: await v.kararlarOku(SLUG),
    ayarlar: await v.ayarlarOku(SLUG), hesap: { markaAdi: 'Ornek', eposta: 'a@b.c' },
  });
  return {
    gecti: b.yayinProgrami.saat === '15:00' && b.whatsapp.izin === true
      && b.hesap.markaAdi === 'Ornek' && b.sonGuncelleme
      && b.blogAdresi === 'https://ornek.example/blog',
    not: JSON.stringify({ s: b.yayinProgrami, w: b.whatsapp, g: b.sonGuncelleme }),
  };
});

vaka('V17_eslesme_hesaba_yaziliyor', async () => {
  const h = require(HESAP);
  await h.hesapAc('musteri@ornek.com', { eposta: 'musteri@ornek.com', markaAdi: 'M', sifreOzeti: 'x' });
  const c = await require(YAZ).handler(olay('POST', Object.assign({}, ORNEK, { eposta: 'musteri@ornek.com' })));
  const hesap = await h.hesapOku('musteri@ornek.com');
  return {
    gecti: govde(c).eslesme === 'kuruldu' && hesap.motorSlug === SLUG && hesap.markaAdi === 'M',
    not: `${govde(c).eslesme} / ${hesap.motorSlug} / marka:${hesap.markaAdi}`,
  };
});

vaka('V18_depo_kapaliyken_yazma_503', async () => {
  depoKapali = true;
  const c = await require(YAZ).handler(olay('POST', ORNEK));
  const o = await require(OKU).handler(olay('GET', null, { slug: SLUG }));
  depoKapali = false;
  return { gecti: c.statusCode === 503 && o.statusCode === 503, not: `${c.statusCode}/${o.statusCode}` };
});

// --- HTML temizligi (Karar E2) --------------------------------------------

vaka('V19_zararli_html_temizleniyor_metin_kaliyor', async () => {
  const v = require(VERI);
  const c = v.htmlTemizle(
    '<p>iyi</p><script>alert(1)</script><img src=x onerror=alert(1)>' +
    '<b onclick="kotu()">kalin</b><div class="x">metin</div>'
  );
  return {
    gecti: !/script|onerror|onclick|<img|<div|class=/i.test(c)
      && c.includes('<p>iyi</p>') && c.includes('<b>kalin</b>')
      // Izinsiz etiketin ICINDEKI metin korunur.
      && c.includes('metin'),
    not: c,
  };
});

vaka('V20_javascript_semali_baglanti_adressiz_kaliyor', async () => {
  const v = require(VERI);
  const kotu = v.htmlTemizle('<a href="javascript:alert(1)">tik</a>');
  const iyi = v.htmlTemizle('<a href="https://ornek.com/x">iyi</a>');
  return {
    gecti: !/javascript:/i.test(kotu) && kotu.includes('tik')
      && iyi.includes('href="https://ornek.com/x"') && iyi.includes('rel="noopener nofollow"'),
    not: kotu + ' | ' + iyi,
  };
});

// --- panel uclari ---------------------------------------------------------

async function oturumKur() {
  const h = require(HESAP);
  await h.hesapAc(EPOSTA, { eposta: EPOSTA, markaAdi: 'Ornek Buro', sifreOzeti: 'x', slug: 'blog-profesyonel' });
  await h.hesapGuncelle(EPOSTA, { motorSlug: SLUG });
  const o = await h.oturumAc(EPOSTA);
  return o.id;
}

function panelOlay(yontem, govde, cerez, sorgu) {
  return {
    httpMethod: yontem,
    headers: Object.assign({ 'content-type': 'application/json' }, cerez ? { cookie: `dolunay_oturum=${cerez}` } : {}),
    body: govde ? JSON.stringify(govde) : '',
    isBase64Encoded: false,
    queryStringParameters: sorgu || {},
  };
}

vaka('V21_panel_veri_oturumsuz_401', async () => {
  const c = await require(P_VERI).handler(panelOlay('GET'));
  return { gecti: c.statusCode === 401, not: `kod:${c.statusCode}` };
});

vaka('V22_panel_veri_birlesik_sekli_donduruyor', async () => {
  await require(YAZ).handler(olay('POST', Object.assign({}, ORNEK, { eposta: EPOSTA })));
  const cerez = await oturumKur();
  const v = require(VERI);
  await v.kararlarYaz(SLUG, { yazilar: { y1: { onay: { zaman: 'z' } } } });
  const c = await require(P_VERI).handler(panelOlay('GET', null, cerez));
  const b = govde(c);
  return {
    gecti: c.statusCode === 200 && b.hesap.markaAdi === 'Ornek Buro'
      && b.yazilar.length === 2
      && b.yazilar.find((y) => y.id === 'y1').durum === 'planlandi'
      && b.motorBagli === true && b.motorYazdiMi === true
      && b.sonGuncelleme && b.bugun
      // Liste metinsiz gelmeli.
      && !b.yazilar.some((y) => y.icerik),
    not: `kod:${c.statusCode} ${JSON.stringify({ y: b.yazilar && b.yazilar.length, m: b.motorBagli })}`,
  };
});

vaka('V23_motor_hic_yazmadiysa_ayirt_ediliyor', async () => {
  const cerez = await oturumKur();
  const c = await require(P_VERI).handler(panelOlay('GET', null, cerez));
  const b = govde(c);
  return {
    gecti: c.statusCode === 200 && b.motorBagli === true && b.motorYazdiMi === false
      && b.yazilar.length === 0 && b.sonGuncelleme === null,
    not: JSON.stringify({ b: b.motorBagli, y: b.motorYazdiMi, s: b.sonGuncelleme }),
  };
});

vaka('V24_yazi_metni_istendiginde_geliyor', async () => {
  await require(YAZ).handler(olay('POST', Object.assign({}, ORNEK, { eposta: EPOSTA })));
  const cerez = await oturumKur();
  const c = await require(P_YAZI).handler(panelOlay('GET', null, cerez, { id: 'y2' }));
  const b = govde(c);
  return {
    gecti: c.statusCode === 200 && b.kaynak === 'motor' && b.icerik.includes('govde iki'),
    not: `kod:${c.statusCode} kaynak:${b.kaynak}`,
  };
});

vaka('V25_duzenlenmis_yazida_panelin_metni_donuyor', async () => {
  await require(YAZ).handler(olay('POST', Object.assign({}, ORNEK, { eposta: EPOSTA })));
  const cerez = await oturumKur();
  await require(P_KARAR).handler(panelOlay('POST', {
    tur: 'metin', yaziId: 'y2', icerik: '<p>musteri yazdi</p><script>kotu()</script>',
  }, cerez));
  const c = await require(P_YAZI).handler(panelOlay('GET', null, cerez, { id: 'y2' }));
  const b = govde(c);
  return {
    gecti: b.kaynak === 'panel' && b.icerik.includes('musteri yazdi')
      && !/script/i.test(b.icerik),
    not: `kaynak:${b.kaynak} icerik:${b.icerik}`,
  };
});

vaka('V26_karar_ucu_onay_ret_tarih_yaziyor', async () => {
  await require(YAZ).handler(olay('POST', Object.assign({}, ORNEK, { eposta: EPOSTA })));
  const cerez = await oturumKur();
  const p = require(P_KARAR);
  await p.handler(panelOlay('POST', { tur: 'onay', yaziId: 'y1' }, cerez));
  await p.handler(panelOlay('POST', { tur: 'tarih', yaziId: 'y1', tarih: '2026-09-20' }, cerez));
  const kotuTarih = await p.handler(panelOlay('POST', { tur: 'tarih', yaziId: 'y1', tarih: '20/09' }, cerez));
  const k = await require(VERI).kararlarOku(SLUG);
  return {
    gecti: k.yazilar.y1.onay && k.yazilar.y1.tarihDegisikligi.tarih === '2026-09-20'
      && kotuTarih.statusCode === 400,
    not: JSON.stringify(k.yazilar.y1) + ' kotuTarih:' + kotuTarih.statusCode,
  };
});

vaka('V27_onay_onceki_reddi_geri_alir', async () => {
  await require(YAZ).handler(olay('POST', Object.assign({}, ORNEK, { eposta: EPOSTA })));
  const cerez = await oturumKur();
  const p = require(P_KARAR);
  await p.handler(panelOlay('POST', { tur: 'ret', yaziId: 'y1', neden: 'olmadi' }, cerez));
  await p.handler(panelOlay('POST', { tur: 'onay', yaziId: 'y1' }, cerez));
  const k = await require(VERI).kararlarOku(SLUG);
  return {
    gecti: !!k.yazilar.y1.onay && k.yazilar.y1.ret === undefined,
    not: JSON.stringify(k.yazilar.y1),
  };
});

vaka('V28_motor_slug_yoksa_409', async () => {
  const h = require(HESAP);
  await h.hesapAc(EPOSTA, { eposta: EPOSTA, markaAdi: 'M', sifreOzeti: 'x' });
  const o = await h.oturumAc(EPOSTA);
  const c = await require(P_KARAR).handler(panelOlay('POST', { tur: 'onay', yaziId: 'y1' }, o.id));
  const v = await require(P_VERI).handler(panelOlay('GET', null, o.id));
  return {
    // Karar yazilamaz ama panel yine acilir: "baglanmadi" durumu gosterilir.
    gecti: c.statusCode === 409 && v.statusCode === 200 && govde(v).motorBagli === false,
    not: `karar:${c.statusCode} veri:${v.statusCode}`,
  };
});

vaka('V29_ayarlar_ayri_kayitta_kararlari_bozmuyor', async () => {
  await require(YAZ).handler(olay('POST', Object.assign({}, ORNEK, { eposta: EPOSTA })));
  const cerez = await oturumKur();
  const p = require(P_KARAR);
  await p.handler(panelOlay('POST', { tur: 'onay', yaziId: 'y1' }, cerez));
  await p.handler(panelOlay('POST', {
    tur: 'ayarlar', yayinProgrami: { saat: '15:00', gunler: ['Pzt'] },
    whatsapp: { numara: '+905000000000', izin: true, izinZamani: 'z', izinMetniSurumu: 'v1' },
  }, cerez));
  const k = await require(VERI).kararlarOku(SLUG);
  const a = await require(VERI).ayarlarOku(SLUG);
  return {
    gecti: !!k.yazilar.y1.onay && a.yayinProgrami.saat === '15:00' && a.whatsapp.izin === true,
    not: JSON.stringify({ k: !!k.yazilar.y1, a: a.yayinProgrami }),
  };
});

async function main() {
  process.env.MOTOR_SIRRI = SIR;
  let gecen = 0;
  for (const [ad, calistir] of VAKALAR) {
    kutu.clear();
    depoKapali = false;
    taze();
    let s;
    try { s = await calistir(); } catch (e) { s = { gecti: false, not: `istisna: ${e && e.message}` }; }
    if (s.gecti) gecen += 1;
    process.stdout.write(`${s.gecti ? 'GECTI' : 'DUSTU'} ${ad}${s.gecti ? '' : `  (${s.not})`}\n`);
  }
  process.stdout.write(`${gecen}/${VAKALAR.length}\n`);
  process.exitCode = gecen === VAKALAR.length ? 0 : 1;
}

main().catch((e) => {
  process.stdout.write(`DUSTU kosum  (${e && e.message})\n`);
  process.exitCode = 1;
});
