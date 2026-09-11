'use strict';

// node netlify/sinav/hesap_kurulum.js
//
// Asama 2: odeme ACTIVE dogrulandiktan sonra hesabin acilmasi.
// Gercek odeme, gercek iyzico ve gercek depo YOK. iyzico cevabi sahte fetch
// ile, Netlify Blobs bellekte taklit edilir.
//
// Olculen asil soru su: callback govdesinin sekli bilinmiyor. Konusma kimligi
// gelirse, gelmezse, hicbiri gelmezse ve depo kapaliysa davranis ne oluyor?
// Dort halin de musteriye "aboneliginiz basladi" demesi sarttir; para alindi.

const path = require('node:path');
const Module = require('node:module');

const TOKEN = '00000000-0000-4000-8000-000000000002';
const REFERANS = 'SINAV-ABONELIK-1';
const PLAN = '00000000-0000-4000-8000-000000000001';
const EPOSTA = 'ayse@ornek.com';
const SIFRE = 'gercekSifre123';
const KONUSMA = 'blog-profesyonel-1757500000000';

const SONUC = path.resolve(__dirname, '../functions/abonelik-sonuc.js');
const BASLAT = path.resolve(__dirname, '../functions/abonelik-baslat.js');
const HESAP = path.resolve(__dirname, '../lib/hesap.js');
const IYZICO = path.resolve(__dirname, '../lib/iyzico.js');
const SAYFA = path.resolve(__dirname, '../lib/sayfa.js');

// --- bellekteki sahte depo ------------------------------------------------
// Gercek depo gibi davranmasi gereken tek yani: yazilan JSON'un geri okunmasi
// ve onek ile listelenmesi. `kapali` bayragi acildiginda her cagri firlatir;
// depo erisiminin olmadigi hali boyle olcuyoruz.
const kutu = new Map();
let depoKapali = false;

function depoYuzeyi() {
  const kontrolEt = () => { if (depoKapali) throw new Error('sinav_depo_kapali'); };
  return {
    get: async (anahtar) => {
      kontrolEt();
      const deger = kutu.get(anahtar);
      return deger === undefined ? null : JSON.parse(deger);
    },
    setJSON: async (anahtar, deger) => { kontrolEt(); kutu.set(anahtar, JSON.stringify(deger)); },
    delete: async (anahtar) => { kontrolEt(); kutu.delete(anahtar); },
    list: async ({ prefix } = {}) => {
      kontrolEt();
      return {
        blobs: [...kutu.keys()].filter((a) => !prefix || a.startsWith(prefix)).map((a) => ({ key: a })),
      };
    },
  };
}

const gercekYukle = Module._load;
Module._load = function (istek, ...kalan) {
  return istek === '@netlify/blobs' ? { getStore: depoYuzeyi } : gercekYukle.call(this, istek, ...kalan);
};

// --- sahte iyzico ---------------------------------------------------------
// `undefined` alanlar JSON'da kaybolur; "bu alan hic gelmiyor" hali boyle kurulur.
function iyzicoCevabi({ konusma, eposta, plan, durum = 'ACTIVE' }) {
  const govde = {
    status: 'success',
    data: {
      token: TOKEN,
      referenceCode: REFERANS,
      subscriptionReferenceCode: REFERANS,
      pricingPlanReferenceCode: plan,
      customerEmail: eposta,
      subscriptionStatus: durum,
    },
  };
  if (konusma) govde.conversationId = konusma;
  return govde;
}

function fetchKur(govde) {
  globalThis.fetch = async () => new Response(JSON.stringify(govde), {
    status: 200, headers: { 'content-type': 'application/json' },
  });
}

function taze() {
  for (const dosya of [SONUC, BASLAT, HESAP, IYZICO, SAYFA]) {
    try { delete require.cache[require.resolve(dosya)]; } catch { /* ilk kosuda yok */ }
  }
}

// --- yardimcilar ----------------------------------------------------------
function anahtarlar(onek) {
  return [...kutu.keys()].filter((a) => a.startsWith(onek));
}

function oku(anahtar) {
  const deger = kutu.get(anahtar);
  return deger === undefined ? null : JSON.parse(deger);
}

function tumIcerik() {
  return [...kutu.values()].join('\n');
}

function gorunenMetin(html) {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

// Bekleyen kaydi uygulamanin KENDI yoluyla yazar; anahtar bicimi teste
// kopyalanmaz, yoksa bicim degistiginde test yanlis yerde yesil kalir.
async function bekleyenSerp({ konusma = KONUSMA, eposta = EPOSTA, plan = PLAN } = {}) {
  const hesap = require(HESAP);
  await hesap.bekleyenYaz({
    eposta,
    plan,
    slug: 'blog-profesyonel',
    konusmaKimligi: konusma,
    sifreOzeti: await hesap.sifreOzetle(SIFRE),
    markaAdi: 'Ornek Marka',
    webSitesi: 'https://ornek.com/',
    ad: 'Ayse',
    soyad: 'Yilmaz',
    telefon: '+905301234567',
    tckn: '12345678950',
    adres: 'Ornek Mah 1 Sok No 2',
    ilce: 'Kadikoy',
    sehir: 'Istanbul',
    postaKodu: '34710',
  });
}

async function cagir(govde) {
  fetchKur(govde);
  const { handler } = require(SONUC);
  return handler({
    httpMethod: 'GET',
    path: '/.netlify/functions/abonelik-sonuc',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    queryStringParameters: { token: TOKEN },
    body: '',
    isBase64Encoded: false,
  });
}

// --- vakalar --------------------------------------------------------------
const VAKALAR = [];
function vaka(ad, calistir) { VAKALAR.push([ad, calistir]); }

const BASARI = /aboneli\S*\s+ba\S*lad|aktif edildi/i;

vaka('V1_konusma_kimligi_ile_eslesir', async () => {
  await bekleyenSerp();
  const cevap = await cagir(iyzicoCevabi({ konusma: KONUSMA, eposta: undefined, plan: undefined }));
  const metin = gorunenMetin(cevap.body);
  const hesaplar = anahtarlar('hesap/');
  const odemeler = anahtarlar('odeme/');
  return {
    gecti: cevap.statusCode === 200 && BASARI.test(metin)
      && hesaplar.length === 1 && odemeler.length === 1
      && anahtarlar('bekleyen/').length === 0
      && oku(odemeler[0]).eslestirme === 'konusmaKimligi',
    not: `hesap:${hesaplar.length} odeme:${odemeler.length} bekleyen:${anahtarlar('bekleyen/').length}`,
  };
});

vaka('V2_kimlik_yoksa_eposta_plana_duser', async () => {
  await bekleyenSerp();
  const cevap = await cagir(iyzicoCevabi({ konusma: undefined, eposta: EPOSTA, plan: PLAN }));
  const odemeler = anahtarlar('odeme/');
  return {
    gecti: cevap.statusCode === 200 && BASARI.test(gorunenMetin(cevap.body))
      && anahtarlar('hesap/').length === 1 && odemeler.length === 1
      && oku(odemeler[0]).eslestirme === 'eposta+plan',
    not: `eslestirme:${odemeler.length ? oku(odemeler[0]).eslestirme : 'yok'}`,
  };
});

vaka('V3_hicbiri_yoksa_yetim_ama_sayfa_basarili', async () => {
  await bekleyenSerp();
  const cevap = await cagir(iyzicoCevabi({ konusma: undefined, eposta: undefined, plan: undefined }));
  const metin = gorunenMetin(cevap.body);
  return {
    gecti: cevap.statusCode === 200 && BASARI.test(metin)
      && !/tahsilat yap\S*mad/i.test(metin)
      && anahtarlar('yetim/').length === 1 && anahtarlar('hesap/').length === 0
      && anahtarlar('bekleyen/').length === 1,
    not: `yetim:${anahtarlar('yetim/').length} hesap:${anahtarlar('hesap/').length}`,
  };
});

vaka('V4_depo_kapaliyken_sayfa_yine_basarili', async () => {
  depoKapali = true;
  const cevap = await cagir(iyzicoCevabi({ konusma: KONUSMA, eposta: EPOSTA, plan: PLAN }));
  depoKapali = false;
  const metin = gorunenMetin(cevap.body);
  return {
    gecti: cevap.statusCode === 200 && BASARI.test(metin) && !/tahsilat yap\S*mad/i.test(metin),
    not: `kod:${cevap.statusCode}`,
  };
});

vaka('V5_ikinci_cagri_hesabi_ezmez', async () => {
  await bekleyenSerp();
  const govde = iyzicoCevabi({ konusma: KONUSMA, eposta: EPOSTA, plan: PLAN });
  await cagir(govde);
  const ilkHesap = oku(anahtarlar('hesap/')[0]);
  const cevap = await cagir(govde);
  const sonHesap = oku(anahtarlar('hesap/')[0]);
  return {
    gecti: cevap.statusCode === 200 && anahtarlar('hesap/').length === 1
      && anahtarlar('odeme/').length === 1
      // Yenilenen sonuc sayfasi yetim uretmemeli: is zaten bitmisti.
      && anahtarlar('yetim/').length === 0
      && ilkHesap.acildi === sonHesap.acildi && ilkHesap.sifreOzeti === sonHesap.sifreOzeti,
    not: `hesap:${anahtarlar('hesap/').length} odeme:${anahtarlar('odeme/').length} yetim:${anahtarlar('yetim/').length}`,
  };
});

vaka('V6_suresi_dolmus_bekleyen_kayit_kullanilmaz', async () => {
  await bekleyenSerp();
  // Kaydin son kullanma tarihi geriye alinir; anahtar bicimi teste yazilmaz.
  for (const a of anahtarlar('bekleyen/')) {
    const kayit = oku(a);
    kayit.sonKullanma = new Date(Date.now() - 60000).toISOString();
    kutu.set(a, JSON.stringify(kayit));
  }
  const cevap = await cagir(iyzicoCevabi({ konusma: KONUSMA, eposta: EPOSTA, plan: PLAN }));
  return {
    gecti: cevap.statusCode === 200 && anahtarlar('hesap/').length === 0
      && anahtarlar('yetim/').length === 1,
    not: `hesap:${anahtarlar('hesap/').length} yetim:${anahtarlar('yetim/').length}`,
  };
});

vaka('V7_tani_kaydi_alan_adlarini_tutar_degerleri_tutmaz', async () => {
  await bekleyenSerp();
  await cagir(iyzicoCevabi({ konusma: KONUSMA, eposta: EPOSTA, plan: PLAN }));
  const tani = oku('tani/callback-sekli');
  const dizi = tani && Array.isArray(tani.yollar) ? tani.yollar.join(' ') : '';
  return {
    gecti: !!tani
      && dizi.includes('conversationId') && dizi.includes('data.customerEmail')
      && tani.eslesme.konusmaKimligi === 'conversationId'
      && tani.eslesme.eposta === 'data.customerEmail'
      && !JSON.stringify(tani).includes(EPOSTA)
      && !JSON.stringify(tani).includes(KONUSMA),
    not: tani ? `eslesme:${JSON.stringify(tani.eslesme)}` : 'tani kaydi yok',
  };
});

vaka('V8_tani_kaydi_ikinci_odemede_degismez', async () => {
  await bekleyenSerp();
  await cagir(iyzicoCevabi({ konusma: KONUSMA, eposta: EPOSTA, plan: PLAN }));
  const ilk = JSON.stringify(oku('tani/callback-sekli'));
  await bekleyenSerp({ konusma: 'baska-kimlik-2', eposta: 'baska@ornek.com' });
  await cagir(iyzicoCevabi({ konusma: 'baska-kimlik-2', eposta: 'baska@ornek.com', plan: PLAN }));
  return {
    gecti: ilk === JSON.stringify(oku('tani/callback-sekli')),
    not: 'tani kaydi ustune yazildi',
  };
});

vaka('V9_duz_sifre_hicbir_kayitta_durmaz', async () => {
  await bekleyenSerp();
  await cagir(iyzicoCevabi({ konusma: KONUSMA, eposta: EPOSTA, plan: PLAN }));
  const hesap = oku(anahtarlar('hesap/')[0]);
  return {
    gecti: !tumIcerik().includes(SIFRE) && typeof hesap.sifreOzeti === 'string'
      && hesap.sifreOzeti.startsWith('scrypt$'),
    not: `ozet:${hesap && hesap.sifreOzeti ? hesap.sifreOzeti.slice(0, 7) : 'yok'}`,
  };
});

vaka('V10_ACTIVE_olmayan_abonelikte_hesap_acilmaz', async () => {
  await bekleyenSerp();
  const cevap = await cagir(iyzicoCevabi({
    konusma: KONUSMA, eposta: EPOSTA, plan: PLAN, durum: 'UNPAID',
  }));
  const metin = gorunenMetin(cevap.body);
  return {
    gecti: anahtarlar('hesap/').length === 0 && anahtarlar('odeme/').length === 0
      && /teyit ede/i.test(metin) && !BASARI.test(metin),
    not: `kod:${cevap.statusCode} hesap:${anahtarlar('hesap/').length}`,
  };
});

vaka('V11_fatura_bilgisi_odeme_kaydinda_durur', async () => {
  await bekleyenSerp();
  await cagir(iyzicoCevabi({ konusma: KONUSMA, eposta: EPOSTA, plan: PLAN }));
  const odeme = oku(anahtarlar('odeme/')[0]);
  const hesap = oku(anahtarlar('hesap/')[0]);
  return {
    gecti: odeme.fatura && odeme.fatura.tckn === '12345678950' && odeme.fatura.ilce === 'Kadikoy'
      && hesap.markaAdi === 'Ornek Marka' && hesap.tckn === undefined,
    not: `fatura:${odeme.fatura ? 'var' : 'yok'} hesapta tckn:${hesap.tckn === undefined ? 'yok' : 'VAR'}`,
  };
});

vaka('V12_jeton_isaretcisi_once_kullanilir', async () => {
  await bekleyenSerp();
  await require(HESAP).jetonYaz(TOKEN, { eposta: EPOSTA, plan: PLAN, konusmaKimligi: KONUSMA });
  // Govdede ne konusma kimligi ne e-posta var: geriye yalniz jeton yolu kalir.
  const cevap = await cagir(iyzicoCevabi({ konusma: undefined, eposta: undefined, plan: undefined }));
  const odemeler = anahtarlar('odeme/');
  return {
    gecti: cevap.statusCode === 200 && anahtarlar('hesap/').length === 1 && odemeler.length === 1
      && oku(odemeler[0]).eslestirme === 'jeton',
    not: `eslestirme:${odemeler.length ? oku(odemeler[0]).eslestirme : 'yok'}`,
  };
});

vaka('V13_suresi_dolmus_jeton_diger_yollara_duser', async () => {
  await bekleyenSerp();
  await require(HESAP).jetonYaz(TOKEN, { eposta: EPOSTA, plan: PLAN });
  for (const a of anahtarlar('jeton/')) {
    const kayit = oku(a);
    kayit.sonKullanma = new Date(Date.now() - 60000).toISOString();
    kutu.set(a, JSON.stringify(kayit));
  }
  const cevap = await cagir(iyzicoCevabi({ konusma: undefined, eposta: EPOSTA, plan: PLAN }));
  const odemeler = anahtarlar('odeme/');
  return {
    gecti: cevap.statusCode === 200 && odemeler.length === 1
      && oku(odemeler[0]).eslestirme === 'eposta+plan',
    not: `eslestirme:${odemeler.length ? oku(odemeler[0]).eslestirme : 'yok'}`,
  };
});

vaka('V14_odeme_baslatinca_jeton_isaretcisi_yazilir', async () => {
  process.env.IYZICO_PAKETLER = JSON.stringify({
    'blog-profesyonel': { plan: PLAN, ad: 'Blog Profesyonel', tutar: '5.980 TL' },
  });
  // Iki cagri: once mukerrer taramasi (bos liste), sonra odeme formu.
  globalThis.fetch = async (adres) => {
    const yol = new URL(String(adres)).pathname;
    const govde = yol.includes('subscriptions')
      ? { status: 'success', data: { totalCount: 0, currentPage: 1, pageCount: 1, items: [] } }
      : { status: 'success', token: TOKEN, checkoutFormContent: '<form>Sinav odeme formu</form>' };
    return new Response(JSON.stringify(govde), {
      status: 200, headers: { 'content-type': 'application/json' },
    });
  };
  const { handler } = require(BASLAT);
  const cevap = await handler({
    httpMethod: 'POST',
    path: '/odeme/blog-profesyonel',
    headers: {},
    isBase64Encoded: false,
    body: new URLSearchParams({
      markaAdi: 'Ornek Marka', ad: 'Ayse', soyad: 'Yilmaz', eposta: EPOSTA,
      telefon: '5301234567', tckn: '12345678950', ilce: 'Kadikoy', sehir: 'Istanbul',
      adres: 'Ornek Mah 1 Sok No 2', sifre: SIFRE, sifreTekrar: SIFRE, onay: 'on',
    }).toString(),
  });
  const jetonlar = anahtarlar('jeton/');
  return {
    gecti: cevap.statusCode === 200 && jetonlar.length === 1
      && oku(jetonlar[0]).eposta === EPOSTA && oku(jetonlar[0]).plan === PLAN
      && anahtarlar('bekleyen/').length === 1
      && !tumIcerik().includes(SIFRE),
    not: `kod:${cevap.statusCode} jeton:${jetonlar.length} bekleyen:${anahtarlar('bekleyen/').length}`,
  };
});

vaka('V15_uctan_uca_baslat_sonra_callback', async () => {
  // Once odeme baslatilir (jeton isaretcisi yazilir), sonra ayni jetonla
  // callback gelir. Govde en fakir haliyle doner: ne kimlik ne e-posta.
  process.env.IYZICO_PAKETLER = JSON.stringify({
    'blog-profesyonel': { plan: PLAN, ad: 'Blog Profesyonel', tutar: '5.980 TL' },
  });
  globalThis.fetch = async (adres) => {
    const yol = new URL(String(adres)).pathname;
    const govde = yol.includes('subscriptions')
      ? { status: 'success', data: { totalCount: 0, currentPage: 1, pageCount: 1, items: [] } }
      : { status: 'success', token: TOKEN, checkoutFormContent: '<form>Sinav odeme formu</form>' };
    return new Response(JSON.stringify(govde), {
      status: 200, headers: { 'content-type': 'application/json' },
    });
  };
  await require(BASLAT).handler({
    httpMethod: 'POST',
    path: '/odeme/blog-profesyonel',
    headers: {},
    isBase64Encoded: false,
    body: new URLSearchParams({
      markaAdi: 'Ornek Marka', ad: 'Ayse', soyad: 'Yilmaz', eposta: EPOSTA,
      telefon: '5301234567', tckn: '12345678950', ilce: 'Kadikoy', sehir: 'Istanbul',
      adres: 'Ornek Mah 1 Sok No 2', sifre: SIFRE, sifreTekrar: SIFRE, onay: 'on',
    }).toString(),
  });
  const cevap = await cagir(iyzicoCevabi({ konusma: undefined, eposta: undefined, plan: undefined }));
  const hesaplar = anahtarlar('hesap/');
  return {
    gecti: cevap.statusCode === 200 && BASARI.test(gorunenMetin(cevap.body))
      && hesaplar.length === 1 && oku(hesaplar[0]).eposta === EPOSTA
      && oku(hesaplar[0]).markaAdi === 'Ornek Marka'
      && anahtarlar('yetim/').length === 0,
    not: `hesap:${hesaplar.length} yetim:${anahtarlar('yetim/').length}`,
  };
});

vaka('V16_referanssiz_cevapta_yenileme_yetim_uretmez', async () => {
  await bekleyenSerp();
  await require(HESAP).jetonYaz(TOKEN, { eposta: EPOSTA, plan: PLAN, konusmaKimligi: KONUSMA });
  // Cevapta referenceCode da yok: odeme kaydinin anahtari ancak jeton
  // isaretcisindeki konusma kimliginden kurulabilir.
  const govde = { status: 'success', data: { subscriptionStatus: 'ACTIVE' } };
  await cagir(govde);
  const cevap = await cagir(govde);
  return {
    gecti: cevap.statusCode === 200 && anahtarlar('hesap/').length === 1
      && anahtarlar('odeme/').length === 1 && anahtarlar('yetim/').length === 0,
    not: `hesap:${anahtarlar('hesap/').length} odeme:${anahtarlar('odeme/').length} yetim:${anahtarlar('yetim/').length}`,
  };
});

// --- kosum ----------------------------------------------------------------
async function main() {
  Object.assign(process.env, {
    IYZICO_API_KEY: 'sinav_sahte_api_key',
    IYZICO_SECRET_KEY: 'sinav_sahte_secret_key',
    IYZICO_BASE_URL: 'https://sinav.invalid',
    URL: 'https://sinav.invalid',
  });
  delete process.env.PANEL_URL;

  let gecen = 0;
  for (const [ad, calistir] of VAKALAR) {
    kutu.clear();
    depoKapali = false;
    taze();
    let sonuc;
    try {
      sonuc = await calistir();
    } catch (e) {
      sonuc = { gecti: false, not: `istisna: ${e && e.message}` };
    }
    if (sonuc.gecti) gecen += 1;
    process.stdout.write(`${sonuc.gecti ? 'GECTI' : 'DUSTU'} ${ad}${sonuc.gecti ? '' : `  (${sonuc.not})`}\n`);
  }
  process.stdout.write(`${gecen}/${VAKALAR.length}\n`);
  process.exitCode = gecen === VAKALAR.length ? 0 : 1;
}

main().catch((e) => {
  process.stdout.write(`DUSTU kosum  (${e && e.message})\n`);
  process.exitCode = 1;
});
