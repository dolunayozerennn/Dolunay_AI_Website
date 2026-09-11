'use strict';

// node netlify/sinav/giris_oturum.js
//
// Asama 3: panel girisi, oturum ve cikis. Gercek depo yok; Netlify Blobs
// bellekte taklit edilir. Olculen sey davranis: hesap var mi yok mu disaridan
// ayirt edilebiliyor mu, cerez dogru bayraklarla mi gidiyor, cikis oturumu
// gercekten kapatiyor mu, kaba kuvvet kapisi tutuyor mu.

const path = require('node:path');
const Module = require('node:module');

const EPOSTA = 'ayse@ornek.com';
const SIFRE = 'gercekSifre123';

const HESAP = path.resolve(__dirname, '../lib/hesap.js');
const OTURUM_LIB = path.resolve(__dirname, '../lib/oturum.js');
const GIRIS = path.resolve(__dirname, '../lib/uclar/giris.js');
const OTURUM = path.resolve(__dirname, '../lib/uclar/oturum.js');
const CIKIS = path.resolve(__dirname, '../lib/uclar/cikis.js');

// --- bellekteki sahte depo ------------------------------------------------
const kutu = new Map();
let depoKapali = false;

function depoYuzeyi() {
  const bak = () => { if (depoKapali) throw new Error('sinav_depo_kapali'); };
  return {
    get: async (a) => { bak(); const d = kutu.get(a); return d === undefined ? null : JSON.parse(d); },
    setJSON: async (a, d) => { bak(); kutu.set(a, JSON.stringify(d)); },
    delete: async (a) => { bak(); kutu.delete(a); },
    list: async ({ prefix } = {}) => {
      bak();
      return { blobs: [...kutu.keys()].filter((a) => !prefix || a.startsWith(prefix)).map((a) => ({ key: a })) };
    },
  };
}

const gercekYukle = Module._load;
Module._load = function (istek, ...kalan) {
  return istek === '@netlify/blobs' ? { getStore: depoYuzeyi } : gercekYukle.call(this, istek, ...kalan);
};

function taze() {
  for (const d of [HESAP, OTURUM_LIB, GIRIS, OTURUM, CIKIS]) {
    try { delete require.cache[require.resolve(d)]; } catch { /* ilk kosu */ }
  }
}

// --- yardimcilar ----------------------------------------------------------
function olay(yontem, govde, cerez, tip) {
  const basliklar = {};
  if (cerez) basliklar.cookie = `dolunay_oturum=${cerez}`;
  if (govde) basliklar['content-type'] = tip || 'application/json';
  return {
    httpMethod: yontem,
    headers: basliklar,
    isBase64Encoded: false,
    body: govde ? (tip === 'application/x-www-form-urlencoded'
      ? new URLSearchParams(govde).toString() : JSON.stringify(govde)) : '',
    queryStringParameters: {},
  };
}

function cerezDegeri(cevap) {
  const c = cevap.headers && cevap.headers['Set-Cookie'];
  if (!c) return null;
  const m = String(c).match(/^dolunay_oturum=([^;]*)/);
  return m ? m[1] : null;
}

function govde(cevap) {
  try { return JSON.parse(cevap.body); } catch { return {}; }
}

function anahtarlar(onek) {
  return [...kutu.keys()].filter((a) => a.startsWith(onek));
}

async function hesapKur() {
  const h = require(HESAP);
  await h.hesapAc(EPOSTA, {
    eposta: EPOSTA,
    sifreOzeti: await h.sifreOzetle(SIFRE),
    markaAdi: 'Ornek Marka',
    webSitesi: 'https://ornek.com/',
    plan: 'plan-1',
    slug: 'blog-profesyonel',
  });
}

const cagir = {
  giris: (g, c, t) => require(GIRIS).handler(olay('POST', g, c, t)),
  oturum: (c) => require(OTURUM).handler(olay('GET', null, c)),
  cikis: (c) => require(CIKIS).handler(olay('POST', {}, c)),
};

// --- vakalar --------------------------------------------------------------
const VAKALAR = [];
const vaka = (ad, f) => VAKALAR.push([ad, f]);

vaka('G1_dogru_sifreyle_giris', async () => {
  await hesapKur();
  const c = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  return {
    gecti: c.statusCode === 200 && govde(c).girisli === true
      && govde(c).markaAdi === 'Ornek Marka'
      && !!cerezDegeri(c) && anahtarlar('oturum/').length === 1,
    not: `kod:${c.statusCode} cerez:${!!cerezDegeri(c)} oturum:${anahtarlar('oturum/').length}`,
  };
});

vaka('G2_cerez_bayraklari_dogru', async () => {
  await hesapKur();
  const c = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  const ham = String(c.headers['Set-Cookie'] || '');
  return {
    gecti: /HttpOnly/i.test(ham) && /Secure/i.test(ham) && /SameSite=Lax/i.test(ham)
      && /Path=\//.test(ham) && /Max-Age=604800/.test(ham),
    not: ham.replace(/^dolunay_oturum=[^;]*/, 'dolunay_oturum=***'),
  };
});

vaka('G3_yanlis_sifre_401', async () => {
  await hesapKur();
  const c = await cagir.giris({ eposta: EPOSTA, sifre: 'yanlisSifre999' });
  return {
    gecti: c.statusCode === 401 && !cerezDegeri(c) && anahtarlar('oturum/').length === 0,
    not: `kod:${c.statusCode}`,
  };
});

vaka('G4_olmayan_hesap_ayni_cevabi_verir', async () => {
  await hesapKur();
  const yanlis = await cagir.giris({ eposta: EPOSTA, sifre: 'yanlisSifre999' });
  const yok = await cagir.giris({ eposta: 'kimse@ornek.com', sifre: 'yanlisSifre999' });
  return {
    gecti: yanlis.statusCode === yok.statusCode
      && govde(yanlis).hata === govde(yok).hata
      && yok.statusCode === 401,
    not: `varsa:${yanlis.statusCode}/${govde(yanlis).hata} yoksa:${yok.statusCode}/${govde(yok).hata}`,
  };
});

vaka('G5_eksik_alan_400_ve_yanlis_yontem_405', async () => {
  await hesapKur();
  const bos = await cagir.giris({ eposta: '', sifre: '' });
  const yontem = await require(GIRIS).handler(olay('GET', null, null));
  return {
    gecti: bos.statusCode === 400 && yontem.statusCode === 405,
    not: `bos:${bos.statusCode} yontem:${yontem.statusCode}`,
  };
});

vaka('G6_form_encoded_govde_de_calisir', async () => {
  await hesapKur();
  const c = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE }, null, 'application/x-www-form-urlencoded');
  return { gecti: c.statusCode === 200 && !!cerezDegeri(c), not: `kod:${c.statusCode}` };
});

vaka('G7_oturum_cerezsiz_401', async () => {
  const c = await cagir.oturum(null);
  return { gecti: c.statusCode === 401 && govde(c).girisli === false, not: `kod:${c.statusCode}` };
});

vaka('G8_gecerli_cerezle_oturum_bilgi_dondurur', async () => {
  await hesapKur();
  const g = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  const c = await cagir.oturum(cerezDegeri(g));
  const b = govde(c);
  return {
    gecti: c.statusCode === 200 && b.girisli === true && b.eposta === EPOSTA
      && b.markaAdi === 'Ornek Marka'
      // Sifre ozeti ve fatura bilgisi bu cevapta GECMEZ.
      && !JSON.stringify(b).includes('scrypt') && b.sifreOzeti === undefined,
    not: JSON.stringify(b),
  };
});

vaka('G9_suresi_dolmus_oturum_401_ve_cerez_dusurulur', async () => {
  await hesapKur();
  const g = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  for (const a of anahtarlar('oturum/')) {
    const k = JSON.parse(kutu.get(a));
    k.sonKullanma = new Date(Date.now() - 60000).toISOString();
    kutu.set(a, JSON.stringify(k));
  }
  const c = await cagir.oturum(cerezDegeri(g));
  const ham = String(c.headers['Set-Cookie'] || '');
  return {
    gecti: c.statusCode === 401 && govde(c).girisli === false && /Max-Age=0/.test(ham),
    not: `kod:${c.statusCode} cerez:${ham}`,
  };
});

vaka('G10_cikis_oturumu_gercekten_kapatir', async () => {
  await hesapKur();
  const g = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  const id = cerezDegeri(g);
  const c = await cagir.cikis(id);
  const sonra = await cagir.oturum(id);
  return {
    gecti: c.statusCode === 200 && /Max-Age=0/.test(String(c.headers['Set-Cookie'] || ''))
      && anahtarlar('oturum/').length === 0
      && sonra.statusCode === 401,
    not: `cikis:${c.statusCode} kalan:${anahtarlar('oturum/').length} sonra:${sonra.statusCode}`,
  };
});

vaka('G11_deneme_tavani_429_verir', async () => {
  await hesapKur();
  const { DENEME_TAVANI } = require(HESAP);
  let son;
  for (let i = 0; i < DENEME_TAVANI; i += 1) {
    son = await cagir.giris({ eposta: EPOSTA, sifre: 'yanlis' + i });
  }
  const kilitli = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  return {
    gecti: son.statusCode === 401 && kilitli.statusCode === 429 && !cerezDegeri(kilitli),
    not: `son:${son.statusCode} kilitli:${kilitli.statusCode}`,
  };
});

vaka('G12_basarili_giris_sayaci_sifirlar', async () => {
  await hesapKur();
  for (let i = 0; i < 3; i += 1) await cagir.giris({ eposta: EPOSTA, sifre: 'yanlis' + i });
  const once = anahtarlar('deneme/').length;
  await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  return {
    gecti: once === 1 && anahtarlar('deneme/').length === 0,
    not: `once:${once} sonra:${anahtarlar('deneme/').length}`,
  };
});

vaka('G13_depo_kapaliyken_giris_acilmaz', async () => {
  await hesapKur();
  depoKapali = true;
  const g = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  const o = await cagir.oturum('herhangi');
  depoKapali = false;
  return {
    gecti: g.statusCode === 503 && !cerezDegeri(g)
      && o.statusCode === 503 && govde(o).girisli !== true,
    not: `giris:${g.statusCode} oturum:${o.statusCode}`,
  };
});

vaka('G14_oturum_kimligi_cevap_govdesinde_gecmez', async () => {
  await hesapKur();
  const g = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  const id = cerezDegeri(g);
  return {
    gecti: !!id && !g.body.includes(id),
    not: `govde: ${g.body.slice(0, 120)}`,
  };
});

vaka('G15_duz_sifre_hicbir_kayitta_yok', async () => {
  await hesapKur();
  await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  return {
    gecti: ![...kutu.values()].join('\n').includes(SIFRE),
    not: 'duz sifre depoda bulundu',
  };
});

vaka('G17_hesabi_silinmis_oturum_gecersiz', async () => {
  // Onizlemede olculdu: test hesabi silindikten sonra oturum ucu hala
  // "girisli" diyordu. Hesap yoksa oturum da gecersiz sayilmali.
  await hesapKur();
  const g = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  const id = cerezDegeri(g);
  for (const a of anahtarlar('hesap/')) kutu.delete(a);
  const c = await cagir.oturum(id);
  return {
    gecti: c.statusCode === 401 && govde(c).girisli === false
      && /Max-Age=0/.test(String(c.headers['Set-Cookie'] || '')),
    not: `kod:${c.statusCode} govde:${c.body}`,
  };
});

vaka('G18_hesap_okunamazsa_girisli_denmez', async () => {
  await hesapKur();
  const g = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  const id = cerezDegeri(g);
  depoKapali = true;
  const c = await cagir.oturum(id);
  depoKapali = false;
  return {
    gecti: c.statusCode === 503 && govde(c).girisli !== true,
    not: `kod:${c.statusCode}`,
  };
});

vaka('G16_cevaplar_onbellege_alinmaz', async () => {
  await hesapKur();
  const g = await cagir.giris({ eposta: EPOSTA, sifre: SIFRE });
  const o = await cagir.oturum(cerezDegeri(g));
  const c = await cagir.cikis(cerezDegeri(g));
  const hepsi = [g, o, c].every((x) => String(x.headers['Cache-Control'] || '') === 'no-store');
  return { gecti: hepsi, not: 'bir cevapta no-store yok' };
});

// --- kosum ----------------------------------------------------------------
async function main() {
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
