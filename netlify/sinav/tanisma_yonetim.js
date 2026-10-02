'use strict';

// node netlify/sinav/tanisma_yonetim.js
//
// Tanisma formu, yonetici notu, elle musteri ekleme ve durum listesi.
// Sozlesme: Blog-Motoru/_kopru/panel-sozlesme.md
// Gercek depo, gercek iyzico, gercek e-posta YOK: depo bellekte, ag sahte.
//
// Olculen asil sorular: musterinin formu dogru sekilde ve yalniz kendi
// hesabina yaziliyor mu; Savas'in notu musteriye hicbir yoldan gitmiyor mu;
// durum listesi motorun yazmadigi bir degeri uyduruyor mu.

const path = require('node:path');
const Module = require('node:module');

const SIR = 'sinav-yonetim-sirri';
const MOTOR = 'sinav-motor-sirri';
const EPOSTA = 'ayse@ornek.com';
const NOT_METNI = '  Merhaba Savaş Bey,\n  bayramda yayın olmasın.  ';

const L = (d) => path.resolve(__dirname, '../lib', d);
const DOSYALAR = ['uclar/panel-tanisma.js', 'uclar/motor-musteriler.js','uclar/yonetim-yaz.js', 'uclar/yonetim-veri.js', 'uclar/motor-oku.js',
  'uclar/motor-yaz.js', 'uclar/panel-veri.js', 'tanisma.js', 'veri.js', 'hesap.js', 'yonetim.js', 'oturum.js',
  'iyzico.js', 'bildirim.js'].map(L);

// --- sahte depo -----------------------------------------------------------
const kutu = new Map();
function depoYuzeyi() {
  return {
    get: async (a) => { const d = kutu.get(a); return d === undefined ? null : JSON.parse(d); },
    setJSON: async (a, d) => { kutu.set(a, JSON.stringify(d)); },
    delete: async (a) => { kutu.delete(a); },
    list: async ({ prefix } = {}) => ({ blobs: [...kutu.keys()].filter((a) => !prefix || a.startsWith(prefix)).map((a) => ({ key: a })) }),
  };
}
const gercekYukle = Module._load;
Module._load = function (istek, ...kalan) {
  return istek === '@netlify/blobs' ? { getStore: depoYuzeyi } : gercekYukle.call(this, istek, ...kalan);
};
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('/v2/subscription/subscriptions')) {
    return new Response(JSON.stringify({ status: 'success', data: { totalCount: 0, items: [] } }), { status: 200, headers: { 'content-type': 'application/json' } });
  }
  throw new Error(`beklenmeyen ag cagrisi: ${u}`);
};

// Sahte e-posta gondericisi: gercek Resend'e hic gidilmez.
let postalar = [];
let gondericiDavranisi = null;
function taze() {
  for (const d of DOSYALAR) { try { delete require.cache[require.resolve(d)]; } catch { /* ilk kosu */ } }
  postalar = [];
  gondericiDavranisi = null;
  require(L('bildirim.js')).gondericiAyarla(async (p) => {
    if (gondericiDavranisi) return gondericiDavranisi(p);
    postalar.push(p);
    return { durum: 'gonderildi', id: `sahte-${postalar.length}` };
  });
}
const uc = (ad) => require(L(`uclar/${ad}.js`)).handler;
const oku = (a) => { const d = kutu.get(a); return d === undefined ? null : JSON.parse(d); };
const anahtarlar = (onek) => [...kutu.keys()].filter((a) => a.startsWith(onek));
const govde = (c) => { try { return JSON.parse(c.body); } catch { return {}; } };

function olay(yontem, { cerez, yonetim, motor, body, qs } = {}) {
  const h = { 'content-type': 'application/json' };
  if (cerez) h.cookie = `dolunay_oturum=${cerez}`;
  if (yonetim !== undefined) h['x-yonetim-sirri'] = yonetim;
  if (motor !== undefined) h['x-motor-sirri'] = motor;
  return { httpMethod: yontem, headers: h, body: body ? JSON.stringify(body) : '', isBase64Encoded: false, queryStringParameters: qs || {} };
}

async function hesapKur({ eposta = EPOSTA, motorSlug } = {}) {
  const h = require(L('hesap.js'));
  await h.hesapAc(eposta, { eposta, markaAdi: 'Örnek Marka', slug: 'blog-profesyonel', ...(motorSlug ? { motorSlug } : {}) });
  return (await h.oturumAc(eposta)).id;
}

const GECERLI_FORM = {
  firmaHizmetler: 'İş hukuku danışmanlığı, İstanbul.',
  hedefOkuyucu: 'İşveren KOBİ sahipleri',
  oneCikanKonular: 'işe iade',
  istenmeyenKonular: 'ceza hukuku',
  siteAdresi: 'ornek.com',
  siteYonetimi: 'wordpress',
  iletisim: { adSoyad: 'Ayşe Yılmaz', gorev: 'Ortak', telefon: '+90 530 000 00 00', eposta: 'ayse@ornek.com' },
  sifre: 'gizli123',
};

// --- vakalar --------------------------------------------------------------
const vakalar = [];
const vaka = (ad, fn) => vakalar.push({ ad, fn });

vaka('T01_oturumsuz_form_okunamaz_yazilamaz', async () => {
  const a = await uc('panel-tanisma')(olay('GET'));
  const b = await uc('panel-tanisma')(olay('POST', { body: GECERLI_FORM }));
  if (a.statusCode !== 401 || b.statusCode !== 401) return `GET ${a.statusCode}, POST ${b.statusCode}`;
  if (anahtarlar('tanisma/').length) return 'oturumsuz yazildi';
});

vaka('T02_zorunlu_alan_eksikse_400_ve_alan_adli_hata', async () => {
  const id = await hesapKur();
  const c = await uc('panel-tanisma')(olay('POST', { cerez: id, body: { hedefOkuyucu: 'x', iletisim: { adSoyad: '  ' } } }));
  const h = govde(c).hatalar || {};
  if (c.statusCode !== 400) return `kod ${c.statusCode}`;
  if (!h.firmaHizmetler || !h['iletisim.adSoyad']) return `hatalar ${JSON.stringify(h)}`;
  if (anahtarlar('tanisma/').length) return 'hatali form yazildi';
});

vaka('T03_gecerli_form_sozlesme_sekliyle_yazilir_sifre_alani_girmez', async () => {
  const id = await hesapKur();
  const c = await uc('panel-tanisma')(olay('POST', { cerez: id, body: GECERLI_FORM }));
  if (c.statusCode !== 200) return `kod ${c.statusCode} ${c.body}`;
  const k = oku(`tanisma/${encodeURIComponent(EPOSTA)}`);
  if (!k) return 'depoda yok';
  const beklenen = ['semaSurumu', 'firmaHizmetler', 'hedefOkuyucu', 'istenmeyenKonular', 'oneCikanKonular', 'siteAdresi',
    'siteYonetimi', 'siteYonetimiDiger', 'iletisim', 'ilkKayit', 'guncellendi', 'guncellemeSayisi'].sort().join(',');
  if (Object.keys(k).sort().join(',') !== beklenen) return `alanlar ${Object.keys(k).sort().join(',')}`;
  if (JSON.stringify(k).includes('gizli123')) return 'sifre depoya girdi';
  if (k.siteAdresi !== 'https://ornek.com') return `site ${k.siteAdresi}`;
  if (k.guncellemeSayisi !== 1 || !k.ilkKayit) return 'sayac / ilk kayit';
});

vaka('T04_guncelleme_ilk_kaydi_korur_sayaci_artirir', async () => {
  const id = await hesapKur();
  await uc('panel-tanisma')(olay('POST', { cerez: id, body: GECERLI_FORM }));
  const ilk = oku(`tanisma/${encodeURIComponent(EPOSTA)}`).ilkKayit;
  await new Promise((r) => setTimeout(r, 5));
  const c = await uc('panel-tanisma')(olay('POST', { cerez: id, body: { ...GECERLI_FORM, hedefOkuyucu: 'yeni' } }));
  const k = oku(`tanisma/${encodeURIComponent(EPOSTA)}`);
  if (c.statusCode !== 200) return `kod ${c.statusCode}`;
  if (k.ilkKayit !== ilk || k.guncellemeSayisi !== 2 || k.hedefOkuyucu !== 'yeni') return JSON.stringify(k);
  if (k.guncellendi === ilk) return 'guncellendi degismedi';
});

vaka('T05_gecersiz_secenek_ve_tehlikeli_adres_reddedilir', async () => {
  const id = await hesapKur();
  const a = await uc('panel-tanisma')(olay('POST', { cerez: id, body: { ...GECERLI_FORM, siteYonetimi: 'joomla' } }));
  const b = await uc('panel-tanisma')(olay('POST', { cerez: id, body: { ...GECERLI_FORM, siteAdresi: 'javascript:alert(1)' } }));
  if (a.statusCode !== 400 || !govde(a).hatalar.siteYonetimi) return `secenek ${a.statusCode}`;
  if (b.statusCode !== 400 || !govde(b).hatalar.siteAdresi) return `adres ${b.statusCode}`;
  if (anahtarlar('tanisma/').length) return 'yazildi';
});

vaka('T06_panel_veri_formu_motor_bagli_degilken_de_dondurur', async () => {
  const id = await hesapKur();
  const once = govde(await uc('panel-veri')(olay('GET', { cerez: id })));
  if (once.tanisma !== null) return `once ${JSON.stringify(once.tanisma)}`;
  await uc('panel-tanisma')(olay('POST', { cerez: id, body: GECERLI_FORM }));
  const sonra = govde(await uc('panel-veri')(olay('GET', { cerez: id })));
  if (!sonra.tanisma || sonra.tanisma.firmaHizmetler !== GECERLI_FORM.firmaHizmetler) return 'form donmedi';
  if (sonra.motorBagli !== false) return 'motorBagli';
});

vaka('T07_yonetim_yaz_sirsiz_ve_motor_sirriyla_kapali', async () => {
  const g = { tur: 'musteri-ekle', slug: 'ornek', markaAdi: 'Örnek' };
  const a = await uc('yonetim-yaz')(olay('POST', { body: g }));
  const b = await uc('yonetim-yaz')(olay('POST', { yonetim: MOTOR, body: g }));
  const c = await uc('yonetim-yaz')(olay('POST', { yonetim: 'yanlis', body: g }));
  if ([a, b, c].some((x) => x.statusCode !== 401)) return [a, b, c].map((x) => x.statusCode).join(',');
  if (anahtarlar('yonetim/').length) return 'yazildi';
});

vaka('T08_elle_musteri_kayit_acar_panel_hesabi_acmaz', async () => {
  const c = await uc('yonetim-yaz')(olay('POST', { yonetim: SIR, body: {
    tur: 'musteri-ekle', slug: 'yeni-firma', markaAdi: 'Yeni Firma', eposta: 'Yeni@Firma.com', siteAdresi: 'yenifirma.com',
    kanal: 'whatsapp', metin: NOT_METNI,
  } }));
  if (c.statusCode !== 200) return `kod ${c.statusCode} ${c.body}`;
  const k = oku('yonetim/musteri/yeni-firma');
  if (!k || k.kaynak !== 'elle' || k.eposta !== 'yeni@firma.com' || k.siteAdresi !== 'https://yenifirma.com') return JSON.stringify(k);
  if (k.notlar.length !== 1 || k.notlar[0].metin !== NOT_METNI || k.notlar[0].kanal !== 'whatsapp') return 'ilk not';
  if (anahtarlar('hesap/').length) return 'panel hesabi acildi';
});

vaka('T09_ayni_slug_gecersiz_slug_ayni_eposta_reddedilir', async () => {
  const y = uc('yonetim-yaz');
  await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'bir', markaAdi: 'Bir', eposta: 'a@b.co' } }));
  const ayni = await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'bir', markaAdi: 'Başka' } }));
  const gecersiz = await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: '../hesap', markaAdi: 'X' } }));
  const eposta = await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'iki', markaAdi: 'İki', eposta: 'A@b.co' } }));
  const markasiz = await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'uc', markaAdi: ' ' } }));
  if (ayni.statusCode !== 409 || gecersiz.statusCode !== 400 || eposta.statusCode !== 409 || markasiz.statusCode !== 400) {
    return [ayni, gecersiz, eposta, markasiz].map((x) => x.statusCode).join(',');
  }
  if (oku('yonetim/musteri/bir').markaAdi !== 'Bir') return 'ilk kayit ezildi';
  if (anahtarlar('yonetim/').length !== 1) return anahtarlar('yonetim/').join(',');
});

vaka('T10_not_en_yeni_basta_metin_dokunulmadan_bos_ve_kayitsiz_reddedilir', async () => {
  const y = uc('yonetim-yaz');
  await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'firma', markaAdi: 'Firma', kanal: 'eposta', metin: 'ilk' } }));
  await new Promise((r) => setTimeout(r, 5));
  const c = await y(olay('POST', { yonetim: SIR, body: { tur: 'not-ekle', slug: 'firma', kanal: 'faks', metin: NOT_METNI } }));
  const bos = await y(olay('POST', { yonetim: SIR, body: { tur: 'not-ekle', slug: 'firma', kanal: 'eposta', metin: ' \n ' } }));
  const yok = await y(olay('POST', { yonetim: SIR, body: { tur: 'not-ekle', slug: 'olmayan', metin: 'x' } }));
  if (c.statusCode !== 200 || bos.statusCode !== 400 || yok.statusCode !== 404) return [c, bos, yok].map((x) => x.statusCode).join(',');
  const n = oku('yonetim/musteri/firma').notlar;
  if (n.length !== 2 || n[0].metin !== NOT_METNI || n[1].metin !== 'ilk') return JSON.stringify(n);
  if (n[0].kanal !== 'diger') return `kanal ${n[0].kanal}`;
  if (!(n[0].zaman > n[1].zaman) || n[0].id === n[1].id) return 'zaman / kimlik';
});

vaka('T11_motor_oku_form_ve_notlari_yalniz_slugla_verir', async () => {
  const id = await hesapKur();
  await uc('panel-tanisma')(olay('POST', { cerez: id, body: GECERLI_FORM }));
  await uc('yonetim-yaz')(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'ornek-marka', markaAdi: 'Örnek', eposta: EPOSTA, kanal: 'whatsapp', metin: NOT_METNI } }));
  const m = uc('motor-oku');
  const sirsiz = await m(olay('GET', { qs: { slug: 'ornek-marka' } }));
  const yonetimSirri = await m(olay('GET', { motor: SIR, qs: { slug: 'ornek-marka' } }));
  const c = govde(await m(olay('GET', { motor: MOTOR, qs: { slug: 'ornek-marka' } })));
  if (sirsiz.statusCode !== 401 || yonetimSirri.statusCode !== 401) return 'yetki';
  if (!c.tanisma || c.tanisma.iletisim.adSoyad !== 'Ayşe Yılmaz' || c.tanismaEposta !== EPOSTA) return `tanisma ${JSON.stringify(c.tanisma)}`;
  if (!c.yonetim || c.yonetim.notlar[0].metin !== NOT_METNI) return 'notlar';
  if (!Array.isArray(c.bekleyen) || !('ayarlar' in c)) return 'eski alanlar bozuldu';
  const bos = govde(await m(olay('GET', { motor: MOTOR, qs: { slug: 'baska-musteri' } })));
  if (bos.tanisma !== null || bos.yonetim !== null || bos.tanismaEposta !== null) return `bos ${JSON.stringify(bos)}`;
});

vaka('T12_motor_oku_kayit_yoksa_formu_motorSlug_ile_bulur', async () => {
  const id = await hesapKur({ motorSlug: 'ornek-marka' });
  await uc('panel-tanisma')(olay('POST', { cerez: id, body: GECERLI_FORM }));
  const c = govde(await uc('motor-oku')(olay('GET', { motor: MOTOR, qs: { slug: 'ornek-marka' } })));
  if (!c.tanisma || c.yonetim !== null || c.tanismaEposta !== EPOSTA) return JSON.stringify(c);
});

vaka('T13_motor_yaz_durum_temizlenir_musteriye_gitmez', async () => {
  const id = await hesapKur({ motorSlug: 'ornek-marka' });
  const c = await uc('motor-yaz')(olay('POST', { motor: MOTOR, body: {
    slug: 'ornek-marka', yazilar: [],
    durum: { aktif: 'evet', havuzOnayBekliyor: true, havuzBekleyenSayisi: 8, ekAlan: 1,
      uyarilar: Array.from({ length: 25 }, (_, i) => ({ anahtar: `u${i}`, metin: `uyari ${i}` })).concat([{ metin: '' }]) },
  } }));
  if (c.statusCode !== 200) return `kod ${c.statusCode}`;
  const d = oku('motor/ornek-marka/liste').durum;
  if (d.aktif !== null || d.havuzOnayBekliyor !== true || d.havuzBekleyenSayisi !== 8 || d.uyarilar.length !== 20 || 'ekAlan' in d) return JSON.stringify(d);
  const p = govde(await uc('panel-veri')(olay('GET', { cerez: id })));
  if (JSON.stringify(p).includes('uyari 0') || 'durum' in p) return 'durum musteriye gitti';
  await uc('motor-yaz')(olay('POST', { motor: MOTOR, body: { slug: 'ornek-marka', yazilar: [] } }));
  if (oku('motor/ornek-marka/liste').durum !== null) return 'eski durum kaldi';
});

vaka('T14_yonetici_notu_musteri_paneline_hicbir_yoldan_gitmez', async () => {
  const id = await hesapKur({ motorSlug: 'ornek-marka' });
  await uc('yonetim-yaz')(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'ornek-marka', markaAdi: 'Örnek', eposta: EPOSTA, metin: 'GIZLI-NOT-123' } }));
  const p = await uc('panel-veri')(olay('GET', { cerez: id }));
  const t = await uc('panel-tanisma')(olay('GET', { cerez: id }));
  if (p.statusCode !== 200 || t.statusCode !== 200) return `${p.statusCode} ${t.statusCode}`;
  if ((p.body + t.body).includes('GIZLI-NOT-123')) return 'not sizdi';
});

vaka('T15_durum_listesi_uc_kaynagi_birlestirir_uydurmaz', async () => {
  const id = await hesapKur({ motorSlug: 'ornek-marka' });
  await uc('panel-tanisma')(olay('POST', { cerez: id, body: GECERLI_FORM }));
  const y = uc('yonetim-yaz');
  await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'elle-firma', markaAdi: 'Elle Firma', metin: 'not' } }));
  await uc('motor-yaz')(olay('POST', { motor: MOTOR, body: {
    slug: 'ornek-marka',
    yazilar: [
      { id: 'a', baslik: 'Eski', durum: 'yayinda', tarih: '2026-09-20' },
      { id: 'b', baslik: 'Yeni', durum: 'yayinda', tarih: '2026-09-28' },
      { id: 'c', baslik: 'Bekleyen 1', durum: 'bekliyor', tarih: '2026-10-06' },
      { id: 'd', baslik: 'Bekleyen 2', durum: 'bekliyor', tarih: '2026-10-03' },
    ],
    durum: { aktif: true, havuzOnayBekliyor: false, uyarilar: [] },
  } }));
  // Musteri panelde d'yi onayladi: artik onay bekleyen sayilmamali.
  await require(L('veri.js')).kararlarYaz('ornek-marka', { yazilar: { d: { onay: { zaman: '2026-10-01T10:00:00Z' } } }, konular: {} });
  await uc('motor-yaz')(olay('POST', { motor: MOTOR, body: { slug: 'yalniz-motor', yazilar: [] } }));

  const v = govde(await uc('yonetim-veri')(olay('GET', { yonetim: SIR })));
  const l = v.durumListesi || [];
  const h = l.find((s) => s.tur === 'hesap');
  const e = l.find((s) => s.tur === 'elle');
  const m = l.find((s) => s.tur === 'motor');
  if (l.length !== 3 || !h || !e || !m) return `satirlar ${l.map((s) => s.tur).join(',')}`;
  if (!h.tanisma || h.durum.aktif !== true || h.durum.havuzOnayBekliyor !== false) return `hesap ${JSON.stringify(h.durum)}`;
  if (!h.durum.sonYazi || h.durum.sonYazi.baslik !== 'Yeni' || h.durum.sonYazi.tarih !== '2026-09-28') return 'son yazi';
  if (h.durum.onayBekleyen.sayi !== 1 || h.durum.onayBekleyen.ilk.baslik !== 'Bekleyen 1') return `bekleyen ${JSON.stringify(h.durum.onayBekleyen)}`;
  if (e.durum !== null || e.tanisma !== null || e.yonetim.notlar.length !== 1) return `elle ${JSON.stringify(e)}`;
  if (m.slug !== 'yalniz-motor' || m.durum.aktif !== null || m.durum.havuzOnayBekliyor !== null || m.durum.uyarilar !== null || m.durum.sonYazi !== null) {
    return `motor ${JSON.stringify(m.durum)}`;
  }
  if (!Array.isArray(v.musteriler) || v.musteriler.length !== 1) return 'odeme listesi bozuldu';
});

vaka('T16_kayit_guncelle_slugi_degistirmez_epostayi_tekil_tutar', async () => {
  const y = uc('yonetim-yaz');
  await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'bir', markaAdi: 'Bir', eposta: 'a@b.co' } }));
  await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'iki', markaAdi: 'İki' } }));
  const cakisan = await y(olay('POST', { yonetim: SIR, body: { tur: 'kayit-guncelle', slug: 'iki', eposta: 'a@b.co' } }));
  const ok = await y(olay('POST', { yonetim: SIR, body: { tur: 'kayit-guncelle', slug: 'iki', telefon: '0530', slugYeni: 'uc' } }));
  if (cakisan.statusCode !== 409 || ok.statusCode !== 200) return `${cakisan.statusCode} ${ok.statusCode}`;
  const k = oku('yonetim/musteri/iki');
  if (k.telefon !== '0530' || k.slug !== 'iki' || k.eposta !== '' || k.markaAdi !== 'İki') return JSON.stringify(k);
});

vaka('T17_ilk_doldurmada_savasa_tek_kisa_eposta_guncellemede_yok', async () => {
  const id = await hesapKur();
  const p = uc('panel-tanisma');
  await p(olay('POST', { cerez: id, body: GECERLI_FORM }));
  await p(olay('POST', { cerez: id, body: { ...GECERLI_FORM, hedefOkuyucu: 'degisti' } }));
  if (postalar.length !== 1) return `${postalar.length} e-posta`;
  const m = postalar[0];
  if (!/Tanışma formu dolduruldu/.test(m.konu) || !m.metin.includes('Örnek Marka')) return m.konu;
  if (m.metin.includes(GECERLI_FORM.firmaHizmetler) || m.metin.includes('gizli123')) return 'e-posta uzun / sifre';
  if (!anahtarlar('olay/').map(oku).some((o) => o.tur === 'tanisma')) return 'olay kaydi yok';
});

// Iki koruma ayri ayri: (a) yalniz ilk kayit e-posta uretir, isaret hic
// konmamis olsa bile; (b) kayit silinip yeniden "ilk" olsa bile tekil isaret
// ikinci e-postayi keser.
vaka('T17b_guncelleme_ve_yeniden_ilk_kayit_ikinci_eposta_uretmez', async () => {
  const id = await hesapKur();
  const p = uc('panel-tanisma');
  gondericiDavranisi = async () => ({ durum: 'hata', kod: 500 });
  await p(olay('POST', { cerez: id, body: GECERLI_FORM }));
  gondericiDavranisi = null;
  await p(olay('POST', { cerez: id, body: { ...GECERLI_FORM, hedefOkuyucu: 'degisti' } }));
  if (postalar.length !== 0) return `(a) guncelleme ${postalar.length} e-posta`;

  kutu.clear();
  const id2 = await hesapKur();
  await p(olay('POST', { cerez: id2, body: GECERLI_FORM }));
  kutu.delete(`tanisma/${encodeURIComponent(EPOSTA)}`);
  await p(olay('POST', { cerez: id2, body: GECERLI_FORM }));
  if (postalar.length !== 1) return `(b) ${postalar.length} e-posta`;
});

vaka('T18_eposta_coker_ise_musterinin_kaydi_yine_basarili', async () => {
  const id = await hesapKur();
  gondericiDavranisi = async () => { throw new Error('resend kapali'); };
  const c = await uc('panel-tanisma')(olay('POST', { cerez: id, body: GECERLI_FORM }));
  if (c.statusCode !== 200 || !govde(c).kaydedildi) return `kod ${c.statusCode}`;
  if (!oku(`tanisma/${encodeURIComponent(EPOSTA)}`)) return 'kayit yok';
});

vaka('T19_not_sil_yalniz_yonetimden_kopruden_de_kalkar_metin_kalmaz', async () => {
  const y = uc('yonetim-yaz');
  await y(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'firma', markaAdi: 'Firma', metin: 'kalsin' } }));
  await y(olay('POST', { yonetim: SIR, body: { tur: 'not-ekle', slug: 'firma', metin: 'SIFRE-YANLISLIKLA-123' } }));
  const hedef = oku('yonetim/musteri/firma').notlar[0];
  const motorla = await y(olay('POST', { yonetim: MOTOR, body: { tur: 'not-sil', slug: 'firma', notId: hedef.id } }));
  const yok = await y(olay('POST', { yonetim: SIR, body: { tur: 'not-sil', slug: 'firma', notId: 'n-yok' } }));
  const c = await y(olay('POST', { yonetim: SIR, body: { tur: 'not-sil', slug: 'firma', notId: hedef.id } }));
  if (motorla.statusCode !== 401 || yok.statusCode !== 404 || c.statusCode !== 200) return [motorla, yok, c].map((x) => x.statusCode).join(',');
  const k = oku('yonetim/musteri/firma');
  if (JSON.stringify(k).includes('SIFRE-YANLISLIKLA')) return 'metin kayitta kaldi';
  if (k.notlar.length !== 1 || k.notlar[0].metin !== 'kalsin') return 'yanlis not silindi';
  if (!k.silinenNotlar || k.silinenNotlar[0].id !== hedef.id) return 'silinen izi yok';
  const m = await uc('motor-oku')(olay('GET', { motor: MOTOR, qs: { slug: 'firma' } }));
  const mg = govde(m);
  if (m.body.includes('SIFRE-YANLISLIKLA') || mg.yonetim.notlar.length !== 1) return 'motor-oku notu veriyor';
  if (!mg.yonetim.silinenNotlar.some((s) => s.id === hedef.id)) return 'motor silineni bilmiyor';
});

vaka('T20_motor_musteriler_listeyi_acar_odeme_ve_gizli_alan_tasimaz', async () => {
  const id = await hesapKur();
  await uc('panel-tanisma')(olay('POST', { cerez: id, body: GECERLI_FORM }));
  await require(L('hesap.js')).odemeYaz('REF-1', { eposta: EPOSTA, fatura: { tckn: '12345678950', adres: 'Ornek Mah' }, tutar: 9980 });
  await uc('yonetim-yaz')(olay('POST', { yonetim: SIR, body: { tur: 'musteri-ekle', slug: 'elle-firma', markaAdi: 'Elle', metin: 'NOT-METNI-XYZ' } }));
  await uc('motor-yaz')(olay('POST', { motor: MOTOR, body: { slug: 'yalniz-motor', yazilar: [] } }));
  const m = uc('motor-musteriler');
  const sirsiz = await m(olay('GET'));
  const yonetimSirri = await m(olay('GET', { motor: SIR }));
  const c = await m(olay('GET', { motor: MOTOR }));
  if (sirsiz.statusCode !== 401 || yonetimSirri.statusCode !== 401 || c.statusCode !== 200) return [sirsiz, yonetimSirri, c].map((x) => x.statusCode).join(',');
  const l = govde(c).musteriler || [];
  const h = l.find((s) => s.tur === 'hesap');
  if (l.length !== 3 || !h || h.slug !== '' || !h.tanisma || h.tanisma.iletisim.adSoyad !== 'Ayşe Yılmaz') return JSON.stringify(l);
  if (!l.find((s) => s.tur === 'elle' && s.yonetim && s.yonetim.notSayisi === 1) || !l.find((s) => s.tur === 'motor' && s.slug === 'yalniz-motor')) return 'elle / motor satiri';
  for (const yasak of ['12345678950', 'Ornek Mah', '9980', 'sifreOzeti', 'scrypt', 'NOT-METNI-XYZ', 'oturum']) {
    if (c.body.includes(yasak)) return `liste "${yasak}" tasiyor`;
  }
});

(async () => {
  process.env.YONETIM_SIRRI = SIR;
  process.env.MOTOR_SIRRI = MOTOR;
  let gecen = 0;
  for (const v of vakalar) {
    kutu.clear();
    taze();
    let sonuc;
    try { sonuc = await v.fn(); } catch (e) { sonuc = `istisna: ${e && e.stack}`; }
    if (sonuc) console.log(`KALDI ${v.ad}: ${sonuc}`);
    else { gecen++; console.log(`GECTI ${v.ad}`); }
  }
  console.log(`${gecen}/${vakalar.length}`);
  process.exit(gecen === vakalar.length ? 0 : 1);
})();
