'use strict';

// node netlify/sinav/bildirim_yonetim.js
//
// Yeni musteri bildirimi ve yonetim ekrani. Gercek odeme, gercek iyzico,
// gercek depo ve gercek e-posta YOK: iyzico ve Resend sahte fetch ile, depo
// bellekte, e-posta gondericisi sahte.
//
// Olculen asil soru: hicbir odeme durumu sessiz kalmiyor mu? Ve bildirim
// cokse bile musterinin gordugu sayfa degismiyor mu?

const path = require('node:path');
const Module = require('node:module');

const TOKEN = '00000000-0000-4000-8000-00000000000b';
const REFERANS = 'SINAV-ABONELIK-B';
const PLAN = '00000000-0000-4000-8000-0000000000aa';
const EPOSTA = 'ayse@ornek.com';
const SIR = 'sinav-yonetim-sirri';
const MOTOR = 'sinav-motor-sirri';
const BASLANGIC = Date.UTC(2026, 8, 8, 11, 16); // 08.09.2026 14:16 Istanbul

const L = (d) => path.resolve(__dirname, '../lib', d);
const SONUC = L('uclar/abonelik-sonuc.js');
const BASLAT = L('uclar/abonelik-baslat.js');
const AC = L('uclar/hesap-ac.js');
const YV = L('uclar/yonetim-veri.js');
const YARIM = L('uclar/yarim-odeme.js');
const HESAP = L('hesap.js');
const BILDIRIM = L('bildirim.js');
const DOSYALAR = [SONUC, BASLAT, AC, YV, YARIM, HESAP, BILDIRIM, L('uclar/yonetim-test.js'), L('iyzico.js'), L('sayfa.js'), L('veri.js'), L('yonetim.js'), L('oturum.js')];

// --- sahte depo -----------------------------------------------------------
const kutu = new Map();
let depoKapali = false;
function depoYuzeyi() {
  const k = () => { if (depoKapali) throw new Error('sinav_depo_kapali'); };
  return {
    get: async (a) => { k(); const d = kutu.get(a); return d === undefined ? null : JSON.parse(d); },
    setJSON: async (a, d) => { k(); kutu.set(a, JSON.stringify(d)); },
    delete: async (a) => { k(); kutu.delete(a); },
    list: async ({ prefix } = {}) => { k(); return { blobs: [...kutu.keys()].filter((a) => !prefix || a.startsWith(prefix)).map((a) => ({ key: a })) }; },
  };
}
const gercekYukle = Module._load;
Module._load = function (istek, ...kalan) {
  return istek === '@netlify/blobs' ? { getStore: depoYuzeyi } : gercekYukle.call(this, istek, ...kalan);
};

// --- sahte ag -------------------------------------------------------------
let cagrilar = [];
let ag = {};
function cevap(govde, kod = 200) {
  return new Response(JSON.stringify(govde), { status: kod, headers: { 'content-type': 'application/json' } });
}
globalThis.fetch = async (url, secenek = {}) => {
  const u = String(url);
  cagrilar.push({ url: u, secenek });
  if (u.startsWith('https://api.resend.com/')) return ag.resend ? ag.resend(u, secenek) : cevap({ id: 'resend-1' });
  if (u.includes('/v2/subscription/checkoutform/initialize')) return cevap(ag.baslat || { status: 'success', token: 'T-YENI', checkoutFormContent: '<script></script>' });
  if (u.includes('/v2/subscription/checkoutform/')) return ag.sonuc ? ag.sonuc() : cevap({ status: 'failure', errorCode: 'X' });
  if (u.includes('/v2/subscription/subscriptions')) return ag.liste ? ag.liste() : cevap({ status: 'success', data: { totalCount: 0, items: [] } });
  throw new Error(`beklenmeyen ag cagrisi: ${u}`);
};

// --- sahte e-posta --------------------------------------------------------
let postalar = [];
let gondericiDavranisi = null;
function taze() {
  for (const d of DOSYALAR) { try { delete require.cache[require.resolve(d)]; } catch { /* ilk kosu */ } }
  require(BILDIRIM).gondericiAyarla(async (p) => {
    if (gondericiDavranisi) return gondericiDavranisi(p);
    postalar.push(p);
    return { durum: 'gonderildi', id: `sahte-${postalar.length}` };
  });
}

// --- yardimcilar ----------------------------------------------------------
const anahtarlar = (onek) => [...kutu.keys()].filter((a) => a.startsWith(onek));
const oku = (a) => { const d = kutu.get(a); return d === undefined ? null : JSON.parse(d); };
const olaylar = () => anahtarlar('olay/').map(oku);
const gorunen = (html) => String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const BASARI = /aboneli\S*\s+ba\S*lad|aktif edildi/i;
const YASAK = ['12345678950', 'Ornek Mah', 'sifreOzeti', 'scrypt$', 'gercekSifre123'];
const yasakVar = (metin) => YASAK.filter((y) => String(metin).includes(y));

async function bekleyenSerp({ eposta = EPOSTA, token = TOKEN } = {}) {
  const h = require(HESAP);
  await h.bekleyenYaz({
    eposta, plan: PLAN, slug: 'blog-profesyonel', konusmaKimligi: 'blog-profesyonel-1',
    sifreOzeti: await h.sifreOzetle('gercekSifre123'),
    markaAdi: 'Ornek Marka', webSitesi: 'https://ornek.com/', ad: 'Ayse', soyad: 'Yilmaz',
    telefon: '+905301234567', tckn: '12345678950', adres: 'Ornek Mah 1 Sok No 2',
    ilce: 'Kadikoy', sehir: 'Istanbul', postaKodu: '34710',
  });
  if (token) await h.jetonYaz(token, { eposta, plan: PLAN, konusmaKimligi: 'blog-profesyonel-1' });
}

function sonucGovdesi(durum = 'ACTIVE') {
  return { status: 'success', data: {
    token: TOKEN, referenceCode: REFERANS, pricingPlanReferenceCode: PLAN,
    customerEmail: EPOSTA, subscriptionStatus: durum, startDate: BASLANGIC,
  } };
}

async function sonucCagir() {
  return require(SONUC).handler({
    httpMethod: 'GET', path: '/.netlify/functions/abonelik-sonuc',
    headers: {}, queryStringParameters: { token: TOKEN }, body: '', isBase64Encoded: false,
  });
}

function yonetimOlayi(sir, yontem = 'GET') {
  const h = {};
  if (sir !== null && sir !== undefined) h['x-yonetim-sirri'] = sir;
  return { httpMethod: yontem, headers: h, body: '', isBase64Encoded: false, queryStringParameters: {} };
}
const govde = (c) => { try { return JSON.parse(c.body); } catch { return {}; } };

// --- vakalar --------------------------------------------------------------
const VAKALAR = [];
const vaka = (ad, f) => VAKALAR.push([ad, f]);

vaka('B1_akistan_yeni_musteri_tum_alanlarla_bildiriliyor', async () => {
  await bekleyenSerp();
  ag.sonuc = () => cevap(sonucGovdesi());
  const c = await sonucCagir();
  const p = postalar[0] || {};
  const m = p.metin || '';
  const istenen = ['Ayse Yilmaz', 'Ornek Marka', EPOSTA, '+905301234567', 'Blog Profesyonel',
    '5.980 TL + KDV / ay', '08.09.2026', REFERANS, '08.10.2026'];
  const eksik = istenen.filter((x) => !m.includes(x));
  const od = oku(`odeme/${REFERANS}`) || {};
  const ol = olaylar();
  return {
    gecti: c.statusCode === 200 && BASARI.test(gorunen(c.body)) && postalar.length === 1
      && /^Yeni müşteri: Ornek Marka$/.test(p.konu) && eksik.length === 0 && yasakVar(m).length === 0
      && od.tutar === '5.980 TL + KDV / ay' && od.sonrakiCekim && od.sonrakiCekim.startsWith('2026-10-08')
      && ol.length === 1 && ol[0].tur === 'yeni-musteri' && ol[0].gonderim === 'gonderildi' && yasakVar(JSON.stringify(ol)).length === 0,
    not: `kod:${c.statusCode} posta:${postalar.length} konu:${p.konu} eksik:${eksik.join('|')} yasak:${yasakVar(m)} odeme:${od.tutar}/${od.sonrakiCekim} olay:${ol.length}`,
  };
});

vaka('B2_sayfa_yenilenince_ikinci_eposta_yok', async () => {
  await bekleyenSerp();
  ag.sonuc = () => cevap(sonucGovdesi());
  await sonucCagir();
  const ikinci = await sonucCagir();
  return {
    gecti: postalar.length === 1 && ikinci.statusCode === 200 && BASARI.test(gorunen(ikinci.body)),
    not: `posta:${postalar.length} kod:${ikinci.statusCode}`,
  };
});

vaka('B3_eslesmeyen_odeme_yetim_dikkat_bildirimi', async () => {
  // Bekleyen kayit ve jeton yok: odeme alindi ama kimseyle eslesmiyor.
  ag.sonuc = () => cevap(sonucGovdesi());
  const c = await sonucCagir();
  const p = postalar[0] || {};
  return {
    gecti: c.statusCode === 200 && BASARI.test(gorunen(c.body)) && postalar.length === 1
      && p.konu.startsWith('[DİKKAT] Ödeme alındı ama hesap açılmadı') && p.metin.includes(REFERANS)
      && anahtarlar('yetim/').length === 1 && olaylar()[0].tur === 'yetim',
    not: `posta:${postalar.length} konu:${p.konu} yetim:${anahtarlar('yetim/').length}`,
  };
});

vaka('B4_depo_kapaliyken_bile_eposta_gidiyor_sayfa_ayni', async () => {
  await bekleyenSerp();
  depoKapali = true;
  ag.sonuc = () => cevap(sonucGovdesi());
  const c = await sonucCagir();
  depoKapali = false;
  const p = postalar[0] || {};
  return {
    gecti: c.statusCode === 200 && BASARI.test(gorunen(c.body)) && postalar.length === 1
      && p.konu.startsWith('[DİKKAT]') && p.metin.includes(REFERANS),
    not: `kod:${c.statusCode} posta:${postalar.length} konu:${p.konu}`,
  };
});

vaka('B5_kart_reddi_musteri_bilgisiyle_bildiriliyor', async () => {
  await bekleyenSerp();
  ag.sonuc = () => cevap({ status: 'failure', errorCode: '10051', errorMessage: 'Kart limiti yetersiz' });
  const c = await sonucCagir();
  const p = postalar[0] || {};
  return {
    gecti: /tamamlanmadı/.test(gorunen(c.body)) && postalar.length === 1
      && p.konu === '[DİKKAT] Ödeme tamamlanmadı: Ornek Marka'
      && p.metin.includes('+905301234567') && p.metin.includes('Kart limiti yetersiz') && yasakVar(p.metin).length === 0
      && olaylar()[0].tur === 'odeme-basarisiz',
    not: `posta:${postalar.length} konu:${p.konu}`,
  };
});

vaka('B6_belirsiz_sonuc_bildiriliyor', async () => {
  await bekleyenSerp();
  ag.sonuc = () => new Response('bozuk', { status: 503 });
  const c = await sonucCagir();
  const p = postalar[0] || {};
  return {
    gecti: c.statusCode === 502 && postalar.length === 1
      && p.konu === '[DİKKAT] Ödeme sonucu teyit edilemedi: Ornek Marka' && olaylar()[0].tur === 'belirsiz',
    not: `kod:${c.statusCode} posta:${postalar.length} konu:${p.konu}`,
  };
});

vaka('B7_eposta_cokerse_sayfa_ayni_olay_hata_ile_kayitli_sonra_yeniden_deneniyor', async () => {
  await bekleyenSerp();
  ag.sonuc = () => cevap(sonucGovdesi());
  gondericiDavranisi = async () => { throw new Error('resend kapali'); };
  const c = await sonucCagir();
  const ol = olaylar();
  const isaretVar = anahtarlar('bildirim/').length > 0;
  // Resend geri geldi; ayni olay yeniden tetiklenirse bu sefer gitmeli.
  gondericiDavranisi = null;
  const b = require(BILDIRIM);
  const tekrar = await b.bildir({ tur: 'yeni-musteri', baslik: 'x', tekil: `odeme/${REFERANS}` });
  return {
    gecti: c.statusCode === 200 && BASARI.test(gorunen(c.body)) && ol.length === 1 && ol[0].gonderim === 'hata'
      && !isaretVar && tekrar.gonderim === 'gonderildi',
    not: `kod:${c.statusCode} olay:${ol.length}/${ol[0] && ol[0].gonderim} isaret:${isaretVar} tekrar:${tekrar.gonderim}`,
  };
});

vaka('B8_elle_hesap_acma_bildiriyor_sifre_postada_yok_tekrar_yok', async () => {
  const istek = {
    eposta: 'bbcivelek@ornek.invalid', markaAdi: 'Civelek Hukuk', ad: 'Barış Baran Civelek', telefon: '05070000000',
    plan: PLAN, slug: 'blog-profesyonel', motorSlug: 'baris-baran-civelek', odemeKaynagi: 'iyzico-odeme-linki',
    tutar: '3576', odemeTarihi: '2026-09-08', sonrakiCekim: '2026-10-08', abonelikReferansi: 'ref-elle-1',
  };
  const olay = () => ({ httpMethod: 'POST', headers: { 'content-type': 'application/json', 'x-yonetim-sirri': SIR }, body: JSON.stringify(istek), isBase64Encoded: false });
  const c = await require(AC).handler(olay());
  const b = govde(c);
  const p = postalar[0] || {};
  const ikinci = await require(AC).handler(olay());
  const istenen = ['Barış Baran Civelek', 'Civelek Hukuk', 'bbcivelek@ornek.invalid', '05070000000', 'Blog Profesyonel', '3576 TRY', '2026-09-08', 'ref-elle-1', '2026-10-08'];
  const eksik = istenen.filter((x) => !String(p.metin).includes(x));
  return {
    gecti: c.statusCode === 200 && b.acildi === true && b.bildirim === 'gonderildi' && postalar.length === 1
      && eksik.length === 0 && !String(p.metin).includes(b.sifre) && govde(ikinci).zatenVar === true,
    not: `kod:${c.statusCode} bildirim:${b.bildirim} posta:${postalar.length} eksik:${eksik.join('|')}`,
  };
});

vaka('B9_odeme_baslatilamazsa_bildiriliyor_tckn_sifre_yok', async () => {
  process.env.IYZICO_PAKETLER = JSON.stringify({ 'blog-profesyonel': { ad: 'Blog Profesyonel', tutar: '5.980 TL + KDV', periyot: 'ay', plan: PLAN } });
  const form = new URLSearchParams({
    markaAdi: 'Yeni Marka', eposta: 'yeni@ornek.com', ad: 'Can', soyad: 'Demir', telefon: '05301112233',
    tckn: '10000000146', adres: 'Bir adres 5', ilce: 'Besiktas', sehir: 'Istanbul',
    sifre: 'CokGizliSifre9', sifreTekrar: 'CokGizliSifre9', onay: 'on',
  }).toString();
  // Mukerrer taramasi gecsin, bekleyen kayit yazilamasin.
  const asil = depoYuzeyi;
  depoKapali = true;
  const c = await require(BASLAT).handler({ httpMethod: 'POST', path: '/odeme/blog-profesyonel', headers: { 'content-type': 'application/x-www-form-urlencoded' }, queryStringParameters: {}, body: form, isBase64Encoded: false });
  depoKapali = false;
  void asil;
  const p = postalar[0] || {};
  return {
    gecti: c.statusCode === 503 && postalar.length === 1 && p.konu === '[DİKKAT] Ödeme başlatılamadı: Yeni Marka'
      && p.metin.includes('05301112233') && !p.metin.includes('10000000146') && !p.metin.includes('CokGizliSifre9'),
    not: `kod:${c.statusCode} posta:${postalar.length} konu:${p.konu}`,
  };
});

vaka('B10_yarim_kalan_odeme_bir_kez_bildiriliyor', async () => {
  await bekleyenSerp({ token: null });
  const y = require(YARIM);
  const erken = await y.tara(Date.now() + 10 * 60 * 1000);
  const ilk = await y.tara(Date.now() + 60 * 60 * 1000);
  const ikinci = await y.tara(Date.now() + 90 * 60 * 1000);
  const eski = await y.tara(Date.now() + 8 * 24 * 60 * 60 * 1000);
  const p = postalar[0] || {};
  return {
    gecti: erken.bildirilen === 0 && ilk.bildirilen === 1 && ikinci.bildirilen === 0 && eski.bildirilen === 0
      && postalar.length === 1 && p.konu === '[DİKKAT] Ödeme yarıda kaldı: Ornek Marka'
      && p.metin.includes('+905301234567') && yasakVar(p.metin).length === 0,
    not: `erken:${erken.bildirilen} ilk:${ilk.bildirilen} ikinci:${ikinci.bildirilen} eski:${eski.bildirilen} posta:${postalar.length}`,
  };
});

vaka('B11_hesabi_acilmis_kayit_yarim_sayilmiyor', async () => {
  await bekleyenSerp({ token: null });
  await require(HESAP).hesapAc(EPOSTA, { eposta: EPOSTA, plan: PLAN });
  const s = await require(YARIM).tara(Date.now() + 60 * 60 * 1000);
  return { gecti: s.bildirilen === 0 && s.tamamlanmis === 1 && postalar.length === 0, not: JSON.stringify(s) };
});

vaka('B12_yonetim_ucu_sirsiz_yanlis_motor_sirriyla_kapali', async () => {
  const uc = require(YV).handler;
  const a = await uc(yonetimOlayi(null));
  const b = await uc(yonetimOlayi('yanlis'));
  const m = await uc(yonetimOlayi(MOTOR));
  const y = await uc(yonetimOlayi(SIR, 'POST'));
  delete process.env.YONETIM_SIRRI;
  const bos = await uc(yonetimOlayi(''));
  process.env.YONETIM_SIRRI = SIR;
  return {
    gecti: a.statusCode === 401 && b.statusCode === 401 && m.statusCode === 401 && y.statusCode === 405 && bos.statusCode === 401
      && !String(a.body + b.body + m.body).includes(EPOSTA),
    not: `yok:${a.statusCode} yanlis:${b.statusCode} motor:${m.statusCode} post:${y.statusCode} tanimsiz:${bos.statusCode}`,
  };
});

vaka('B13_yonetim_listesi_en_yeni_ustte_iyzico_birlesik_hassas_veri_yok', async () => {
  const h = require(HESAP);
  const veri = require(L('veri.js'));
  // Eski musteri: elle acilmis, motor bagli ve yazmis. Yeni musteri: akistan, motorsuz.
  await h.hesapAc('eski@ornek.com', { eposta: 'eski@ornek.com', markaAdi: 'Eski Hukuk', plan: PLAN, slug: 'blog-profesyonel', motorSlug: 'eski-hukuk', acilisYolu: 'elle', sifreOzeti: 'scrypt$x' });
  kutu.set('hesap/eski%40ornek.com', JSON.stringify(Object.assign(oku('hesap/eski%40ornek.com'), { acildi: '2026-09-01T10:00:00.000Z' })));
  await veri.motorListeYaz('eski-hukuk', { slug: 'eski-hukuk', uretildi: '2026-09-20T08:00:00.000Z', yazilar: [{ id: 1 }, { id: 2 }] });
  await h.odemeYaz('ref-eski', { referans: 'ref-eski', abonelikReferansi: 'ref-eski', eposta: 'eski@ornek.com', tutar: '3576', fatura: { telefon: '+905550000000', tckn: '12345678950' } });
  await h.hesapAc(EPOSTA, { eposta: EPOSTA, markaAdi: 'Ornek Marka', plan: PLAN, slug: 'blog-profesyonel', sifreOzeti: 'scrypt$y' });
  // Yarim kalmis bir baska musteri (iki saat once).
  await bekleyenSerp({ eposta: 'yarim@ornek.com', token: null });
  const bk = anahtarlar('bekleyen/')[0];
  kutu.set(bk, JSON.stringify(Object.assign(oku(bk), { olusturuldu: new Date(Date.now() - 2 * 3600e3).toISOString() })));
  await require(BILDIRIM).bildir({ tur: 'yeni-musteri', baslik: 'Yeni müşteri: Ornek Marka', satirlar: [['E-posta', EPOSTA]] });

  const bugun = Date.now();
  ag.liste = () => cevap({ status: 'success', data: { totalCount: 2, items: [
    { referenceCode: 'ref-eski', subscriptionStatus: 'ACTIVE', customerEmail: 'eski@ornek.com', pricingPlanReferenceCode: PLAN,
      startDate: bugun - 20 * 864e5, orders: [
        { orderStatus: 'SUCCESS', price: 3576, currencyCode: 'TRY', startPeriod: bugun - 20 * 864e5 },
        { orderStatus: 'WAITING', price: 3576, currencyCode: 'TRY', startPeriod: bugun + 10 * 864e5 },
      ] },
    { referenceCode: 'ref-hesapsiz', subscriptionStatus: 'ACTIVE', customerEmail: 'kayip@ornek.com', pricingPlanReferenceCode: PLAN, startDate: bugun - 3 * 864e5, orders: [] },
  ] } });
  const c = await require(YV).handler(yonetimOlayi(SIR));
  const v = govde(c);
  const [ilk, ikinci] = v.musteriler || [];
  return {
    gecti: c.statusCode === 200 && v.iyzicoOkundu === true && v.musteriler.length === 2
      && ilk.eposta === EPOSTA && ikinci.eposta === 'eski@ornek.com'
      && ilk.motor.bagli === false && ikinci.motor.bagli === true && ikinci.motor.yazdi === true && ikinci.motor.yaziSayisi === 2
      && ikinci.odemeDurumu.etiket === 'Aktif' && ikinci.sonrakiCekim.kaynak === 'iyzico'
      && ilk.odemeDurumu.ton === 'dikkat' && ikinci.telefon === '+905550000000' && ikinci.paket === 'Blog Profesyonel'
      && v.hesapsizAbonelikler.length === 1 && v.hesapsizAbonelikler[0].eposta === 'kayip@ornek.com'
      && v.yarimKalanlar.length === 1 && v.yarimKalanlar[0].eposta === 'yarim@ornek.com'
      && v.olaylar.length === 1 && v.ozet.dikkat === 2
      && yasakVar(c.body).length === 0 && !c.body.includes('tckn'),
    not: `kod:${c.statusCode} sira:${ilk && ilk.eposta},${ikinci && ikinci.eposta} motor:${ikinci && JSON.stringify(ikinci.motor)} odeme:${ikinci && ikinci.odemeDurumu.etiket} hesapsiz:${v.hesapsizAbonelikler && v.hesapsizAbonelikler.length} yarim:${v.yarimKalanlar && v.yarimKalanlar.length} dikkat:${v.ozet && v.ozet.dikkat} yasak:${yasakVar(c.body)}`,
  };
});

vaka('B14_iyzico_okunamazsa_ekran_yine_aciliyor', async () => {
  await require(HESAP).hesapAc(EPOSTA, { eposta: EPOSTA, markaAdi: 'Ornek Marka', plan: PLAN });
  ag.liste = () => new Response('kapali', { status: 500 });
  const c = await require(YV).handler(yonetimOlayi(SIR));
  const v = govde(c);
  return {
    gecti: c.statusCode === 200 && v.iyzicoOkundu === false && v.musteriler.length === 1
      && /iyzico okunamadı/.test(v.musteriler[0].odemeDurumu.etiket) && v.hesapsizAbonelikler.length === 0,
    not: `kod:${c.statusCode} okundu:${v.iyzicoOkundu} etiket:${v.musteriler && v.musteriler[0] && v.musteriler[0].odemeDurumu.etiket}`,
  };
});

vaka('B15_resend_anahtarsiz_ag_cagrisi_yapmiyor_anahtarla_dogru_istek', async () => {
  const b = require(BILDIRIM);
  delete process.env.RESEND_API_KEY;
  const once = cagrilar.length;
  const yok = await b.resendGonder({ konu: 'k', metin: 'm' });
  const agYok = cagrilar.length === once;
  process.env.RESEND_API_KEY = 're_sinav';
  const var_ = await b.resendGonder({ konu: 'Konu', metin: 'Metin', tekil: 'x' });
  const c = cagrilar[cagrilar.length - 1];
  const g = JSON.parse(c.secenek.body);
  ag.resend = () => cevap({ message: 'domain not verified' }, 403);
  const red = await b.resendGonder({ konu: 'k', metin: 'm' });
  ag.resend = () => { throw new TypeError('fetch failed'); };
  const kopuk = await b.resendGonder({ konu: 'k', metin: 'm' });
  delete process.env.RESEND_API_KEY;
  return {
    gecti: yok.durum === 'anahtar-yok' && agYok && var_.durum === 'gonderildi'
      && c.url === 'https://api.resend.com/emails' && c.secenek.method === 'POST'
      && c.secenek.headers.Authorization === 'Bearer re_sinav' && !!c.secenek.headers['Idempotency-Key']
      && g.from === 'dolunay.ai <savas@dolunay.ai>' && g.to[0] === 'savas@dolunay.ai' && g.subject === 'Konu'
      && red.durum === 'hata' && red.kod === 403 && kopuk.durum === 'hata',
    not: `yok:${yok.durum} ag:${agYok} var:${var_.durum} from:${g.from} red:${red.durum}/${red.kod} kopuk:${kopuk.durum}`,
  };
});

vaka('B16_anahtar_yokken_olay_yine_yaziliyor', async () => {
  gondericiDavranisi = null;
  require(BILDIRIM).gondericiAyarla(null); // gercek Resend yolu, anahtar yok
  delete process.env.RESEND_API_KEY;
  const once = cagrilar.length;
  const s = await require(BILDIRIM).bildir({ tur: 'yeni-musteri', baslik: 'Yeni müşteri: X', satirlar: [['E-posta', 'x@ornek.com']] });
  const ol = olaylar();
  return {
    gecti: s.gonderim === 'anahtar-yok' && cagrilar.length === once && ol.length === 1 && ol[0].gonderim === 'anahtar-yok',
    not: `gonderim:${s.gonderim} olay:${ol.length}`,
  };
});

vaka('B17_test_epostasi_yetkili_tek_posta_anahtarsizsa_502', async () => {
  const uc = require(L('uclar/yonetim-test.js')).handler;
  const post = (sir) => ({ httpMethod: 'POST', headers: sir ? { 'x-yonetim-sirri': sir } : {}, body: '', isBase64Encoded: false });
  const sirsiz = await uc(post(null));
  const motor = await uc(post(MOTOR));
  const get = await uc(Object.assign(post(SIR), { httpMethod: 'GET' }));
  const once = postalar.length;
  const iyi = await uc(post(SIR));
  const tekPosta = postalar.length === once + 1 && /^Test: /.test(postalar[postalar.length - 1].konu);
  require(BILDIRIM).gondericiAyarla(null); // gercek yol, anahtar yok
  const yok = await uc(post(SIR));
  return {
    gecti: sirsiz.statusCode === 401 && motor.statusCode === 401 && get.statusCode === 405 && postalar.length === once + 1
      && iyi.statusCode === 200 && govde(iyi).gonderim === 'gonderildi' && tekPosta
      && yok.statusCode === 502 && govde(yok).gonderim === 'anahtar-yok' && olaylar().every((o) => o.tur === 'test'),
    not: `sirsiz:${sirsiz.statusCode} motor:${motor.statusCode} get:${get.statusCode} iyi:${iyi.statusCode}/${govde(iyi).gonderim} tek:${tekPosta} yok:${yok.statusCode}`,
  };
});

async function main() {
  let gecen = 0;
  for (const [ad, calistir] of VAKALAR) {
    kutu.clear(); depoKapali = false; cagrilar = []; ag = {}; postalar = []; gondericiDavranisi = null;
    Object.assign(process.env, {
      YONETIM_SIRRI: SIR, MOTOR_SIRRI: MOTOR, IYZICO_API_KEY: 'sinav', IYZICO_SECRET_KEY: 'sinav',
      IYZICO_PAKETLER: JSON.stringify({ 'blog-profesyonel': { ad: 'Blog Profesyonel', tutar: '5.980 TL + KDV', periyot: 'ay', plan: PLAN } }),
    });
    delete process.env.RESEND_API_KEY;
    taze();
    let s;
    const hata = console.error;
    console.error = () => {}; // beklenen hata kayitlari ciktiyi bogmasin
    try { s = await calistir(); } catch (e) { s = { gecti: false, not: `istisna: ${e && e.stack}` }; }
    console.error = hata;
    if (s.gecti) gecen += 1;
    process.stdout.write(`${s.gecti ? 'GECTI' : 'DUSTU'} ${ad}${s.gecti ? '' : `  (${s.not})`}\n`);
  }
  process.stdout.write(`${gecen}/${VAKALAR.length}\n`);
  process.exitCode = gecen === VAKALAR.length ? 0 : 1;
}

main().catch((e) => { process.stdout.write(`DUSTU kosum  (${e && e.message})\n`); process.exitCode = 1; });
