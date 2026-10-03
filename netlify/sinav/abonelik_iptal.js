'use strict';

// node netlify/sinav/abonelik_iptal.js
//
// Panelden abonelik iptali. Olculen asil sey: musteriye "iptal edildi"
// denmesinin YALNIZ iyzico aboneligi CANCELED gosterdiginde olmasi. Yanlis
// "iptal edildi" musterinin kartindan cekim surerken durdugunu sanmasi demek.
// Ikinci olculen: baskasinin aboneligine ve sifresiz isteklere dokunulmamasi.
// Ag yok: iyzico ve Resend sahte.

const path = require('node:path');
const Module = require('node:module');

const HESAP = path.resolve(__dirname, '../lib/hesap.js');
const IYZICO = path.resolve(__dirname, '../lib/iyzico.js');
const BILDIRIM = path.resolve(__dirname, '../lib/bildirim.js');
const IPTAL = path.resolve(__dirname, '../lib/uclar/abonelik-iptal.js');
const P_VERI = path.resolve(__dirname, '../lib/uclar/panel-veri.js');

const EPOSTA = 'musteri@ornek.invalid';
const SIFRE = 'dogru-sifre-123';

process.env.IYZICO_API_KEY = 'sinav-api';
process.env.IYZICO_SECRET_KEY = 'sinav-gizli';
process.env.IYZICO_PAKETLER = JSON.stringify({ 'blog-profesyonel': { ad: 'Profesyonel', aylikYazi: 16, tutar: '5980' } });

const kutu = new Map();
const gercekYukle = Module._load;
Module._load = function (istek, ...kalan) {
  if (istek !== '@netlify/blobs') return gercekYukle.call(this, istek, ...kalan);
  return {
    getStore: () => ({
      get: async (a) => { const d = kutu.get(a); return d === undefined ? null : JSON.parse(d); },
      setJSON: async (a, d) => { kutu.set(a, JSON.stringify(d)); },
      delete: async (a) => { kutu.delete(a); },
      list: async ({ prefix } = {}) => ({
        blobs: [...kutu.keys()].filter((a) => !prefix || a.startsWith(prefix)).map((a) => ({ key: a })),
      }),
    }),
  };
};

// --- sahte iyzico ---------------------------------------------------------
// abonelikler: referans -> { durum, eposta }. davranis: iptal cagrisina ne olacak.
let abonelikler = {};
let davranis = {};
let cagrilar = [];
global.fetch = async (url, secenek = {}) => {
  const yol = String(url).replace(/^https?:\/\/[^/]+/, '');
  cagrilar.push({ yontem: secenek.method, yol });
  const cevap = (kod, govde) => ({ ok: kod >= 200 && kod < 300, status: kod, text: async () => JSON.stringify(govde) });
  const m = yol.match(/^\/v2\/subscription\/subscriptions\/([^/?]+)(\/cancel)?$/);
  if (!m) return cevap(404, { status: 'failure' });
  const ref = decodeURIComponent(m[1]);
  const a = abonelikler[ref];
  if (!m[2]) {
    if (davranis.okumaKopuk) throw new Error('ag yok');
    if (!a) return cevap(200, { status: 'failure', errorCode: '201600', errorMessage: 'bulunamadi' });
    const kayit = { referenceCode: ref, subscriptionStatus: a.durum, customerEmail: a.eposta };
    return cevap(200, { status: 'success', data: davranis.itemsBicimi ? { items: [kayit] } : kayit });
  }
  if (davranis.iptal === 'kopuk') { a.durum = davranis.kopuktaDurum || a.durum; throw new Error('ag koptu'); }
  if (davranis.iptal === 'ret') return cevap(200, { status: 'failure', errorCode: '100001', errorMessage: 'reddedildi' });
  a.durum = 'CANCELED';
  return cevap(200, { status: 'success' });
};

let bildirimler = [];
function taze() {
  for (const d of [HESAP, IYZICO, BILDIRIM, IPTAL, P_VERI]) {
    try { delete require.cache[require.resolve(d)]; } catch { /* ilk kosu */ }
  }
  require(BILDIRIM).gondericiAyarla(async ({ konu }) => { bildirimler.push(konu); return { durum: 'gonderildi' }; });
}

async function kur({ odeme = [{ anahtar: 'ref-1', kayit: { referans: 'ref-1', eposta: EPOSTA, slug: 'blog-profesyonel' } }] } = {}) {
  kutu.clear(); cagrilar = []; bildirimler = []; davranis = {};
  abonelikler = { 'ref-1': { durum: 'ACTIVE', eposta: EPOSTA } };
  taze();
  const h = require(HESAP);
  await h.hesapAc(EPOSTA, { eposta: EPOSTA, sifreOzeti: await h.sifreOzetle(SIFRE), markaAdi: 'Ornek', slug: 'blog-profesyonel' });
  for (const o of odeme) await h.odemeYaz(o.anahtar, o.kayit);
  const { id } = await h.oturumAc(EPOSTA);
  return id;
}

function olay(oturumId, govde, yontem = 'POST') {
  const basliklar = { 'content-type': 'application/json' };
  if (oturumId) basliklar.cookie = `dolunay_oturum=${oturumId}`;
  return { httpMethod: yontem, headers: basliklar, body: govde ? JSON.stringify(govde) : '', isBase64Encoded: false, queryStringParameters: {} };
}

const govde = (c) => { try { return JSON.parse(c.body); } catch { return {}; } };
const iptalCagrisi = () => cagrilar.filter((c) => c.yol.endsWith('/cancel')).length;
const hesapDurumu = async () => (await require(HESAP).hesapOku(EPOSTA) || {}).abonelikDurumu;

const VAKALAR = [];
const vaka = (ad, f) => VAKALAR.push([ad, f]);

vaka('I1_oturumsuz_401_iyzicoya_gidilmez', async () => {
  await kur();
  const c = await require(IPTAL).handler(olay(null, { mevcut: SIFRE }));
  return { gecti: c.statusCode === 401 && cagrilar.length === 0, not: `kod:${c.statusCode} cagri:${cagrilar.length}` };
});

vaka('I2_yanlis_sifre_401_iptal_yok', async () => {
  const id = await kur();
  const c = await require(IPTAL).handler(olay(id, { mevcut: 'yanlis' }));
  const b = await require(IPTAL).handler(olay(id, {}));
  return {
    gecti: c.statusCode === 401 && b.statusCode === 400 && cagrilar.length === 0 && abonelikler['ref-1'].durum === 'ACTIVE',
    not: `yanlis:${c.statusCode} bos:${b.statusCode} cagri:${cagrilar.length}`,
  };
});

vaka('I3_aktif_abonelik_iptal_ediliyor', async () => {
  const id = await kur();
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  const b = govde(c);
  return {
    gecti: c.statusCode === 200 && b.iptal === true && b.zaten === false && iptalCagrisi() === 1
      && abonelikler['ref-1'].durum === 'CANCELED' && await hesapDurumu() === 'iptal'
      && bildirimler.some((k) => k.includes('iptal etti')),
    not: `kod:${c.statusCode} iptal:${b.iptal} cagri:${iptalCagrisi()} hesap:${await hesapDurumu()} bildirim:${bildirimler.length}`,
  };
});

vaka('I4_zaten_iptalse_ikinci_iptal_cagrisi_yok', async () => {
  const id = await kur();
  abonelikler['ref-1'].durum = 'CANCELED';
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  const b = govde(c);
  return {
    gecti: c.statusCode === 200 && b.iptal === true && b.zaten === true && iptalCagrisi() === 0
      && await hesapDurumu() === 'iptal' && bildirimler.length === 0,
    not: `kod:${c.statusCode} zaten:${b.zaten} cagri:${iptalCagrisi()} bildirim:${bildirimler.length}`,
  };
});

vaka('I5_baskasinin_aboneligine_dokunulmaz', async () => {
  const id = await kur();
  abonelikler['ref-1'].eposta = 'baskasi@ornek.invalid';
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  return {
    gecti: c.statusCode === 502 && govde(c).iptal === false && iptalCagrisi() === 0
      && abonelikler['ref-1'].durum === 'ACTIVE' && await hesapDurumu() !== 'iptal',
    not: `kod:${c.statusCode} cagri:${iptalCagrisi()} durum:${abonelikler['ref-1'].durum}`,
  };
});

vaka('I6_iptal_cevabi_kayboldu_abonelik_hala_aktif_iptal_denmez', async () => {
  const id = await kur();
  davranis.iptal = 'kopuk';
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  return {
    gecti: c.statusCode === 502 && govde(c).iptal === false && await hesapDurumu() !== 'iptal'
      && bildirimler.some((k) => k.includes('tamamlanamadı')),
    not: `kod:${c.statusCode} hesap:${await hesapDurumu()} bildirim:${bildirimler.join('|')}`,
  };
});

vaka('I7_iptal_cevabi_kayboldu_ama_iyzico_CANCELED_iptal_sayilir', async () => {
  const id = await kur();
  davranis.iptal = 'kopuk';
  davranis.kopuktaDurum = 'CANCELED';
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  return {
    gecti: c.statusCode === 200 && govde(c).iptal === true && await hesapDurumu() === 'iptal',
    not: `kod:${c.statusCode} hesap:${await hesapDurumu()}`,
  };
});

vaka('I8_iyzico_reddi_iptal_denmez', async () => {
  const id = await kur();
  davranis.iptal = 'ret';
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  return {
    gecti: c.statusCode === 502 && govde(c).iptal === false && await hesapDurumu() !== 'iptal' && abonelikler['ref-1'].durum === 'ACTIVE',
    not: `kod:${c.statusCode} hesap:${await hesapDurumu()}`,
  };
});

vaka('I9_iyzico_okunamazsa_iptal_cagrisi_yapilmaz', async () => {
  const id = await kur();
  davranis.okumaKopuk = true;
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  return {
    gecti: c.statusCode === 502 && iptalCagrisi() === 0 && await hesapDurumu() !== 'iptal',
    not: `kod:${c.statusCode} cagri:${iptalCagrisi()}`,
  };
});

vaka('I10_odeme_kaydi_yoksa_talep_202_iptal_denmez', async () => {
  const id = await kur({ odeme: [] });
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  const b = govde(c);
  return {
    gecti: c.statusCode === 202 && b.iptal === false && b.talep === true && cagrilar.length === 0
      && await hesapDurumu() !== 'iptal' && bildirimler.some((k) => k.includes('elle iptal')),
    not: `kod:${c.statusCode} talep:${b.talep} cagri:${cagrilar.length}`,
  };
});

vaka('I11_elle_kayitta_abonelik_referansi_kullanilir', async () => {
  const id = await kur({ odeme: [{ anahtar: 'odeme-ref-x', kayit: { referans: 'odeme-ref-x', abonelikReferansi: 'ref-1', eposta: EPOSTA } }] });
  davranis.itemsBicimi = true;
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  return {
    gecti: c.statusCode === 200 && cagrilar.some((x) => x.yol === '/v2/subscription/subscriptions/ref-1/cancel')
      && !cagrilar.some((x) => x.yol.includes('odeme-ref-x')),
    not: `kod:${c.statusCode} yollar:${cagrilar.map((x) => x.yol).join(',')}`,
  };
});

vaka('I12_baska_hesabin_odeme_kaydi_taranmaz', async () => {
  const id = await kur({ odeme: [
    { anahtar: 'ref-1', kayit: { referans: 'ref-1', eposta: EPOSTA } },
    { anahtar: 'ref-2', kayit: { referans: 'ref-2', eposta: 'baskasi@ornek.invalid' } },
  ] });
  abonelikler['ref-2'] = { durum: 'ACTIVE', eposta: 'baskasi@ornek.invalid' };
  const c = await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  return {
    gecti: c.statusCode === 200 && abonelikler['ref-2'].durum === 'ACTIVE' && !cagrilar.some((x) => x.yol.includes('ref-2')),
    not: `kod:${c.statusCode} ref2:${abonelikler['ref-2'].durum}`,
  };
});

vaka('I13_panel_verisi_iptali_gosteriyor', async () => {
  const id = await kur();
  const once = govde(await require(P_VERI).handler(olay(id, null, 'GET')));
  await require(IPTAL).handler(olay(id, { mevcut: SIFRE }));
  const sonra = govde(await require(P_VERI).handler(olay(id, null, 'GET')));
  return {
    gecti: once.abonelik && once.abonelik.durum === 'aktif' && sonra.abonelik && sonra.abonelik.durum === 'iptal edildi'
      && typeof sonra.abonelik.iptalZamani === 'string',
    not: `once:${once.abonelik && once.abonelik.durum} sonra:${sonra.abonelik && sonra.abonelik.durum}`,
  };
});

vaka('I14_ikinci_basista_iptal_tarihi_kaymaz', async () => {
  const id = await kur();
  const ilk = govde(await require(IPTAL).handler(olay(id, { mevcut: SIFRE })));
  await new Promise((r) => setTimeout(r, 15));
  const ikinci = govde(await require(IPTAL).handler(olay(id, { mevcut: SIFRE })));
  const kayit = await require(HESAP).hesapOku(EPOSTA);
  return {
    gecti: ilk.iptalZamani && ilk.iptalZamani === ikinci.iptalZamani && kayit.iptalZamani === ilk.iptalZamani && iptalCagrisi() === 1,
    not: `ilk:${ilk.iptalZamani} ikinci:${ikinci.iptalZamani} cagri:${iptalCagrisi()}`,
  };
});

vaka('I15_GET_405', async () => {
  const id = await kur();
  const c = await require(IPTAL).handler(olay(id, null, 'GET'));
  return { gecti: c.statusCode === 405 && cagrilar.length === 0, not: `kod:${c.statusCode}` };
});

(async () => {
  let gecen = 0;
  for (const [ad, f] of VAKALAR) {
    let s;
    try { s = await f(); } catch (e) { s = { gecti: false, not: 'HATA ' + (e && e.stack) }; }
    if (s.gecti) gecen += 1;
    console.log(`${s.gecti ? 'GECTI ' : 'KALDI '} ${ad}  ${s.not || ''}`);
  }
  console.log(`\nabonelik_iptal: ${gecen}/${VAKALAR.length}`);
  process.exitCode = gecen === VAKALAR.length ? 0 : 1;
})();
