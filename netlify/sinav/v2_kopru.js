'use strict';

// node netlify/sinav/v2_kopru.js
//
// v1 <-> v2 koprusu. Bu kabuk canli odeme yolunda duruyor: her istek once
// buradan geciyor. Olculen sey, v1 mantiginin gordugu olayin dogru kurulmasi
// ve v1 cevabinin Response'a dogru cevrilmesi.
//
// En kritik vaka: odeme ucu paket adini `event.path`ten okuyor. Yanlis
// kurulursa butun paketler 404 olur ve kimse abone olamaz.

const path = require('node:path');
const Module = require('node:module');
const { pathToFileURL } = require('node:url');

const KOPRU = path.resolve(__dirname, '../lib/v2-kopru.js');

// Gercek kabugu denerken hesap katmani Blobs'u require ediyor; bellekte taklit.
const kutu = new Map();
const gercekYukle = Module._load;
Module._load = function (istek, ...kalan) {
  if (istek !== '@netlify/blobs') return gercekYukle.call(this, istek, ...kalan);
  return {
    getStore: () => ({
      get: async (a) => { const d = kutu.get(a); return d === undefined ? null : JSON.parse(d); },
      setJSON: async (a, d) => { kutu.set(a, JSON.stringify(d)); },
      delete: async (a) => { kutu.delete(a); },
      list: async () => ({ blobs: [] }),
    }),
  };
};

const { sar, olayaCevir, cevabaCevir } = require(KOPRU);

const VAKALAR = [];
const vaka = (ad, f) => VAKALAR.push([ad, f]);

// Handler'in gordugu olayi yakalayan yardimci.
function yakala() {
  const kutucuk = {};
  const fn = sar(async (event) => {
    kutucuk.event = event;
    return { statusCode: 200, headers: { 'X-Deneme': '1' }, body: 'tamam' };
  });
  return { fn, kutucuk };
}

vaka('K1_GET_yol_ve_sorgu_dogru_kuruluyor', async () => {
  const { fn, kutucuk } = yakala();
  await fn(new Request('https://dolunay.ai/odeme/sonuc?token=abc&x=1'), {});
  const e = kutucuk.event;
  return {
    gecti: e.httpMethod === 'GET' && e.path === '/odeme/sonuc'
      && e.queryStringParameters.token === 'abc' && e.queryStringParameters.x === '1'
      && e.rawUrl.includes('/odeme/sonuc') && e.isBase64Encoded === false,
    not: `yol:${e.path} sorgu:${JSON.stringify(e.queryStringParameters)}`,
  };
});

vaka('K2_odeme_paket_yolu_korunuyor', async () => {
  // Kritik vaka: paket adi event.path'ten okunuyor.
  const { fn, kutucuk } = yakala();
  await fn(new Request('https://dolunay.ai/odeme/blog-profesyonel'), {});
  return {
    gecti: kutucuk.event.path === '/odeme/blog-profesyonel',
    not: `yol: ${kutucuk.event.path}`,
  };
});

vaka('K3_POST_govdesi_ve_basliklar', async () => {
  const { fn, kutucuk } = yakala();
  await fn(new Request('https://dolunay.ai/.netlify/functions/giris', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Buyuk-Harf': 'deger' },
    body: '{"a":1}',
  }), {});
  const e = kutucuk.event;
  return {
    gecti: e.httpMethod === 'POST' && e.body === '{"a":1}'
      && e.headers['content-type'] === 'application/json'
      && e.headers['x-buyuk-harf'] === 'deger',
    not: `govde:${e.body} basliklar:${JSON.stringify(e.headers)}`,
  };
});

vaka('K4_GET_govdesi_okunmaya_calisilmiyor', async () => {
  const { fn, kutucuk } = yakala();
  await fn(new Request('https://dolunay.ai/x'), {});
  return { gecti: kutucuk.event.body === '', not: `govde: ${JSON.stringify(kutucuk.event.body)}` };
});

vaka('K5_cevap_kodu_baslik_ve_govde_geciyor', async () => {
  const fn = sar(async () => ({
    statusCode: 418, headers: { 'Content-Type': 'text/plain', 'X-Bir': 'iki' }, body: 'merhaba',
  }));
  const c = await fn(new Request('https://dolunay.ai/x'), {});
  return {
    gecti: c.status === 418 && c.headers.get('x-bir') === 'iki'
      && c.headers.get('content-type') === 'text/plain' && (await c.text()) === 'merhaba',
    not: `kod:${c.status}`,
  };
});

vaka('K6_set_cookie_geciyor', async () => {
  const fn = sar(async () => ({
    statusCode: 200,
    headers: { 'Set-Cookie': 'dolunay_oturum=abc; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800' },
    body: '{}',
  }));
  const c = await fn(new Request('https://dolunay.ai/x'), {});
  const cerez = c.headers.get('set-cookie') || '';
  return {
    gecti: cerez.includes('dolunay_oturum=abc') && /HttpOnly/i.test(cerez) && /Max-Age=604800/.test(cerez),
    not: cerez,
  };
});

vaka('K7_handler_firlatirsa_500_doner_cokmez', async () => {
  const fn = sar(async () => { throw new Error('bilerek'); });
  const c = await fn(new Request('https://dolunay.ai/x'), {});
  return { gecti: c.status === 500, not: `kod: ${c.status}` };
});

vaka('K8_istemci_ip_basligi_yedekleniyor', async () => {
  const { fn, kutucuk } = yakala();
  await fn(new Request('https://dolunay.ai/x'), { ip: '192.0.2.7' });
  return {
    gecti: kutucuk.event.headers['x-nf-client-connection-ip'] === '192.0.2.7',
    not: JSON.stringify(kutucuk.event.headers),
  };
});

vaka('K9_gelen_ip_basligi_ezilmiyor', async () => {
  const { fn, kutucuk } = yakala();
  await fn(new Request('https://dolunay.ai/x', {
    headers: { 'x-nf-client-connection-ip': '198.51.100.9' },
  }), { ip: '192.0.2.7' });
  return {
    gecti: kutucuk.event.headers['x-nf-client-connection-ip'] === '198.51.100.9',
    not: kutucuk.event.headers['x-nf-client-connection-ip'],
  };
});

vaka('K10_gercek_kabuk_Request_alip_Response_donuyor', async () => {
  // Gercek .mjs kabugu: giris ucu. Bos govdeyle 400 donmeli.
  const url = pathToFileURL(path.resolve(__dirname, '../functions/giris.mjs')).href;
  const mod = await import(url);
  const c = await mod.default(new Request('https://dolunay.ai/.netlify/functions/giris', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  }), {});
  const v = JSON.parse(await c.text());
  return {
    gecti: c.status === 400 && typeof v.hata === 'string'
      && c.headers.get('cache-control') === 'no-store',
    not: `kod:${c.status} govde:${JSON.stringify(v)}`,
  };
});

vaka('K11_cevirici_yardimcilari_dogrudan', async () => {
  const e = olayaCevir(new Request('https://dolunay.ai/a/b?q=1'), 'govde', {});
  const c = cevabaCevir({ statusCode: 201, headers: {}, body: '' });
  const bos = cevabaCevir(null);
  return {
    gecti: e.path === '/a/b' && e.body === 'govde' && c.status === 201
      && (await c.text()) === '' && bos.status === 500,
    not: `yol:${e.path} kod:${c.status} bos:${bos.status}`,
  };
});

async function main() {
  let gecen = 0;
  for (const [ad, calistir] of VAKALAR) {
    kutu.clear();
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
