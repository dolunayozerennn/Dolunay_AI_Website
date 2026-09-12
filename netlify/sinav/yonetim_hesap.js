'use strict';

// node netlify/sinav/yonetim_hesap.js
//
// Elle hesap acma ucu. Olculen asil sey: ucun mevcut hesabi ELE GECIRMEYE
// yaramamasi. Uc idempotent olmazsa, sirri eline gecirmis biri herhangi bir
// e-postaya ikinci kez cagri yapip yeni sifre alabilir ve hesabi devralirdi.
//
// Ikinci olculen sey yetki ayrimi: MOTOR_SIRRI bu ucu acmamali.

const path = require('node:path');
const Module = require('node:module');

const HESAP = path.resolve(__dirname, '../lib/hesap.js');
const AC = path.resolve(__dirname, '../lib/uclar/hesap-ac.js');
const GIRIS = path.resolve(__dirname, '../lib/uclar/giris.js');
const P_VERI = path.resolve(__dirname, '../lib/uclar/panel-veri.js');

const SIR = 'sinav-yonetim-sirri';
const MOTOR = 'sinav-motor-sirri';
const EPOSTA = 'bbcivelek@ornek.invalid';

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

function taze() {
  for (const d of [HESAP, AC, GIRIS, P_VERI]) {
    try { delete require.cache[require.resolve(d)]; } catch { /* ilk kosu */ }
  }
}

function olay(yontem, govde, sir) {
  const basliklar = { 'content-type': 'application/json' };
  if (sir !== null && sir !== undefined) basliklar['x-yonetim-sirri'] = sir;
  return {
    httpMethod: yontem,
    headers: basliklar,
    body: govde ? JSON.stringify(govde) : '',
    isBase64Encoded: false,
    queryStringParameters: {},
  };
}

const govde = (c) => { try { return JSON.parse(c.body); } catch { return {}; } };
const anahtarlar = (onek) => [...kutu.keys()].filter((a) => a.startsWith(onek));

const ISTEK = {
  eposta: EPOSTA,
  markaAdi: 'Civelek Hukuk',
  plan: '0f2e37ca-c367-45c1-b41f-98aa38691543',
  slug: 'blog-baslangic',
  motorSlug: 'baris-baran-civelek',
  odemeKaynagi: 'iyzico-odeme-linki',
  tutar: '3576',
  odemeTarihi: '2026-09-08',
  sonrakiCekim: '2026-10-08',
  abonelikReferansi: 'abonelik-ref-1',
  musteriReferansi: 'musteri-ref-1',
};

const VAKALAR = [];
const vaka = (ad, f) => VAKALAR.push([ad, f]);

vaka('Y1_sir_yanlissa_401_hesap_acilmaz', async () => {
  const a = await require(AC).handler(olay('POST', ISTEK, 'yanlis'));
  const b = await require(AC).handler(olay('POST', ISTEK, null));
  return {
    gecti: a.statusCode === 401 && b.statusCode === 401 && anahtarlar('hesap/').length === 0,
    not: `yanlis:${a.statusCode} yok:${b.statusCode} hesap:${anahtarlar('hesap/').length}`,
  };
});

vaka('Y2_sir_tanimsizsa_uc_kapali', async () => {
  delete process.env.YONETIM_SIRRI;
  const a = await require(AC).handler(olay('POST', ISTEK, ''));
  const b = await require(AC).handler(olay('POST', ISTEK, 'herhangi'));
  process.env.YONETIM_SIRRI = SIR;
  return {
    // Bos sir "herkese acik" demek olmamali.
    gecti: a.statusCode === 401 && b.statusCode === 401 && anahtarlar('hesap/').length === 0,
    not: `bos:${a.statusCode} rastgele:${b.statusCode}`,
  };
});

vaka('Y3_motor_sirri_bu_ucu_acmiyor', async () => {
  const c = await require(AC).handler(olay('POST', ISTEK, MOTOR));
  return {
    // Yetki ayriminin kendisi: motorun sirri hesap acamaz.
    gecti: c.statusCode === 401 && anahtarlar('hesap/').length === 0,
    not: `kod:${c.statusCode}`,
  };
});

vaka('Y4_hesap_aciliyor_sifre_bir_kez_donuyor', async () => {
  const c = await require(AC).handler(olay('POST', ISTEK, SIR));
  const b = govde(c);
  const kayit = await require(HESAP).hesapOku(EPOSTA);
  return {
    gecti: c.statusCode === 200 && b.acildi === true && typeof b.sifre === 'string'
      && b.sifre.length === 23 && !!kayit && kayit.motorSlug === 'baris-baran-civelek'
      && kayit.acilisYolu === 'elle',
    not: `kod:${c.statusCode} acildi:${b.acildi} sifre:${b.sifre && b.sifre.length} slug:${kayit && kayit.motorSlug}`,
  };
});

vaka('Y5_donen_sifreyle_giris_yapilabiliyor', async () => {
  const b = govde(await require(AC).handler(olay('POST', ISTEK, SIR)));
  const g = await require(GIRIS).handler({
    httpMethod: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ eposta: EPOSTA, sifre: b.sifre }), isBase64Encoded: false,
  });
  const yanlis = await require(GIRIS).handler({
    httpMethod: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ eposta: EPOSTA, sifre: 'bambaska-sifre' }), isBase64Encoded: false,
  });
  return {
    gecti: g.statusCode === 200 && yanlis.statusCode === 401,
    not: `dogru:${g.statusCode} yanlis:${yanlis.statusCode}`,
  };
});

vaka('Y6_idempotent_ikinci_cagri_hesabi_devralamiyor', async () => {
  const ilk = govde(await require(AC).handler(olay('POST', ISTEK, SIR)));
  const ozetOnce = (await require(HESAP).hesapOku(EPOSTA)).sifreOzeti;
  // Musteri sifresini degistirmis olabilir; ucun ikinci cagrisi onu ezmemeli.
  const ikinci = await require(AC).handler(olay('POST', ISTEK, SIR));
  const b = govde(ikinci);
  const ozetSonra = (await require(HESAP).hesapOku(EPOSTA)).sifreOzeti;
  // Ilk sifre hala calisiyor mu?
  const g = await require(GIRIS).handler({
    httpMethod: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ eposta: EPOSTA, sifre: ilk.sifre }), isBase64Encoded: false,
  });
  return {
    gecti: ikinci.statusCode === 200 && b.acildi === false && b.zatenVar === true
      && b.sifre === undefined && ozetOnce === ozetSonra && g.statusCode === 200,
    not: `kod:${ikinci.statusCode} acildi:${b.acildi} sifre dondu mu:${b.sifre !== undefined} ozet ayni:${ozetOnce === ozetSonra} giris:${g.statusCode}`,
  };
});

vaka('Y7_odeme_kaydi_yaziliyor_ve_panele_dusuyor', async () => {
  const b = govde(await require(AC).handler(olay('POST', ISTEK, SIR)));
  const kayit = await require(HESAP).odemeOku('abonelik-ref-1');
  const o = await require(HESAP).oturumAc(EPOSTA);
  const p = await require(P_VERI).handler({
    httpMethod: 'GET', headers: { cookie: `dolunay_oturum=${o.id}` },
    body: '', isBase64Encoded: false, queryStringParameters: {},
  });
  const pv = govde(p);
  return {
    gecti: b.odeme === 'yazildi' && !!kayit && kayit.odemeKaynagi === 'iyzico-odeme-linki'
      && kayit.tutar === '3576' && kayit.abonelikReferansi === 'abonelik-ref-1'
      && kayit.eslestirme === 'elle'
      && p.statusCode === 200 && pv.odemeGecmisi.length === 1,
    not: `odeme:${b.odeme} kayit:${!!kayit} panel:${pv.odemeGecmisi && pv.odemeGecmisi.length}`,
  };
});

vaka('Y8_gecersiz_eposta_400', async () => {
  const a = await require(AC).handler(olay('POST', { eposta: 'bu bir eposta degil' }, SIR));
  const b = await require(AC).handler(olay('POST', {}, SIR));
  return {
    gecti: a.statusCode === 400 && b.statusCode === 400 && anahtarlar('hesap/').length === 0,
    not: `bozuk:${a.statusCode} bos:${b.statusCode}`,
  };
});

vaka('Y9_duz_sifre_hicbir_kayda_yazilmiyor', async () => {
  const b = govde(await require(AC).handler(olay('POST', ISTEK, SIR)));
  const hepsi = [...kutu.values()].join('\n');
  return {
    // Sifre yalniz cevapta donuyor; depoda yalniz scrypt ozeti durmali.
    gecti: !hepsi.includes(b.sifre) && hepsi.includes('sifreOzeti'),
    not: `depoda sifre var mi:${hepsi.includes(b.sifre)}`,
  };
});

vaka('Y10_yontem_ve_alan_kirpma', async () => {
  const g = await require(AC).handler(olay('GET', null, SIR));
  const c = await require(AC).handler(olay('POST', Object.assign({}, ISTEK, {
    markaAdi: 'M'.repeat(900),
  }), SIR));
  const kayit = await require(HESAP).hesapOku(EPOSTA);
  return {
    gecti: g.statusCode === 405 && c.statusCode === 200 && kayit.markaAdi.length === 300,
    not: `get:${g.statusCode} marka:${kayit && kayit.markaAdi && kayit.markaAdi.length}`,
  };
});

vaka('Y11_sifre_alfabesi_karisan_karakter_icermiyor', async () => {
  const uc = require(AC);
  const bicim = /^[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}$/;
  let hepsiUygun = true;
  const gorulen = new Set();
  for (let i = 0; i < 200; i += 1) {
    const s = uc.sifreUret();
    if (!bicim.test(s)) hepsiUygun = false;
    for (const h of s.replace(/-/g, '')) gorulen.add(h);
  }
  // Alfabe tamamen BUYUK harf. Klasik karisma cifti kucuk 'l' ile '1' ve 'I';
  // burada kucuk harf hic yok ve '1' de yok, o yuzden 'L' sorun degil.
  // Disarida kalmasi gerekenler: 0/O ve 1/I.
  const yasak = ['0', 'O', '1', 'I'].filter((h) => gorulen.has(h));
  return {
    // 32 harf ayrica sart: 256 % 32 === 0, yani rastgele bayttan harfe
    // gecerken modulo sapmasi olmuyor. 31 harfe dusurmek onu bozardi.
    gecti: hepsiUygun && yasak.length === 0 && uc.ALFABE.length === 32,
    not: `bicim:${hepsiUygun} yasak:${yasak.join(',')} alfabe:${uc.ALFABE.length}`,
  };
});

async function main() {
  let gecen = 0;
  for (const [ad, calistir] of VAKALAR) {
    kutu.clear();
    process.env.YONETIM_SIRRI = SIR;
    process.env.MOTOR_SIRRI = MOTOR;
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
