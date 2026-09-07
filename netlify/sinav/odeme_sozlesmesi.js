'use strict';

// node _gorev/sinav_odeme.js <iyzico.js> <abonelik-baslat.js> <abonelik-sonuc.js>
// Yalniz Node yerlesikleri. Uygulama kaynagi incelenmez, require ile calistirilir.
// S1-S4 formSonuc(token), S5-S6 belgelenen POST formu uzerinden olculur.
// Sonuc handler'inin girisi ilk fetch erisiminde sabitlenir.
const path = require('node:path');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const { isDeepStrictEqual } = require('node:util');

const ROOT_URL = 'https://sinav.invalid';
const PLAN = '00000000-0000-4000-8000-000000000001';
const TOKEN = '00000000-0000-4000-8000-000000000002';
const RAW_ERROR = 'IYZICO_SINAV_HAM_RET_5001';
const REJECTION = { status: 'failure', errorCode: '5001', errorMessage: RAW_ERROR };
const SUCCESS = {
  status: 'success',
  token: TOKEN,
  data: {
    token: TOKEN,
    referenceCode: TOKEN,
    subscriptionReferenceCode: TOKEN,
    customerReferenceCode: TOKEN,
    pricingPlanReferenceCode: PLAN,
    subscriptionStatus: 'ACTIVE',
    checkoutFormContent: '<form>Sinav odeme formu</form>',
  },
  // S4 yalniz status kontroluyle gecemez; diger JSON turleri de korunmali.
  sinav: { sayi: 7, bayrak: false, bos: null, liste: ['koru', 1] },
};
const CASES = [
  ['S1_zaman_asimi', 'api', 'hang', 1],
  ['S1_abort', 'api', 'abort', 1],
  ['S1_ag', 'api', 'network', 1],
  ['S2_sunucu', 'api', 'server', 2],
  ['S3_http_4xx', 'api', 'http4xx', 3],
  ['S4_basari', 'api', 'success', 4],
  ['S5_zaman_asimi', 'start', 'hang', 5],
  ['S5_sunucu', 'start', 'server', 5],
  ['S5_ag', 'start', 'network', 5],
  ['S6_is_kurali', 'start', 'business', 6],
  ['S7_zaman_asimi', 'result', 'hang', 7],
  ['S7_sunucu', 'result', 'server', 7],
  ['S7_ag', 'result', 'network', 7],
  ['S8_net_ret', 'result', 'declined', 8],
  ['S9_basari', 'result', 'success', 9],
  ['S10_tarama_hatasi', 'start', 'scan_failure', 10],
  ['S10_tarama_istisna', 'start', 'scan_throw', 10],
  ['S10_sayfalama_tavani', 'start', 'scan_full', 10],
  ['S11_bos_nesne', 'result', 'empty_object', 11],
  ['S11_bos_dizi', 'result', 'empty_array', 11],
  ['S11_beklemede', 'result', 'pending', 11],
];
const REAL_LIMIT_MS = 900;
const WORKER_LIMIT_MS = 2500;
const VIRTUAL_LIMIT_MS = 30000; // Makul bekleme ust siniri: 30 saniye sanal zaman.
const SKIP_REASONS = {
  arguman: 'Uc uygulama modulunun dosya yolu komut satirinda verilmedi.',
  yukleme: 'Uygulama modulu veya bagimliliklari yuklenemedi.',
  imza: 'Modulde bu vaka icin gerekli cagrilabilir yuzey bulunamadi.',
  ag: 'Uygulama sahte fetch disinda engellenen bir ag yolu kullanmaya calisti.',
  giris: 'Verilen girisle vakanin hedef sahte fetch cagrisina ulasilamadi.',
  calistirma: 'Vaka iscisinin calismasi hedef sahte fetch cagrisina ulasmadan kesildi.',
  sure: 'Vaka iscisi sure sinirinda hedef sahte fetch cagrisina ulasamadi.',
};

function fold(value) {
  return String(value).normalize('NFKD').replace(/\p{M}/gu, '')
    .replace(/\u0131/g, 'i').toLowerCase();
}

function visibleText(html) {
  // Script, CSS ve yorumlardaki metin kullaniciya gosterilmis sayilmaz.
  const text = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/?(?:br|hr|p|div|h[1-6]|li|ul|ol|section|article|header|footer|tr|td)\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '');
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (all, code) => {
    if (code[0] !== '#') return entities[code.toLowerCase()] || all;
    const number = /^#x/i.test(code) ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : all;
  }).replace(/\s+/g, ' ').trim();
}

function networkMarked(value, httpFailure = false) {
  const network = /network|transport|time.?out|timed.?out|abort|fetch.?failed|econn|enotfound|eai_again|unreachable|connection|server|gateway|sunucu|baglanti|zaman.?asimi|ulasilam|ag.?hata/;
  const word = httpFailure ? new RegExp(`${network.source}|infrastructure|altyapi|http.?error`) : network;
  const seen = new Set();
  function visit(item) {
    if (!item || typeof item !== 'object' || seen.has(item)) return false;
    seen.add(item);
    return Object.entries(item).some(([key, data]) => {
      if (data === false || data === null || data === undefined || data === '' || data === 0) return false;
      const name = fold(key);
      if (/^(?:httpstatus(?:code)?|statuscode|httpcode)$/.test(name)
          && Number(data) >= (httpFailure ? 300 : 500) && Number(data) <= 599) return true;
      if (word.test(name) && /^(?:true|1|yes)$/i.test(String(data))) return true;
      if (typeof data === 'string' && word.test(fold(data))) return true;
      return visit(data);
    });
  }
  return visit(value);
}

function verdict(number, value, handler) {
  if (number <= 4) {
    if (handler) {
      if (!value || typeof value.body !== 'string') return false;
      try {
        value = JSON.parse(value.isBase64Encoded
          ? Buffer.from(value.body, 'base64').toString('utf8') : value.body);
      } catch { return false; }
    }
    if (number <= 2) return value?.status === 'failure' && networkMarked(value);
    // HTTP 4xx altyapi sorunudur; isaret eklenirken saglayici alanlari korunur.
    if (number === 3) return value?.status === 'failure' && networkMarked(value, true)
      && value.errorCode === REJECTION.errorCode && value.errorMessage === REJECTION.errorMessage;
    return isDeepStrictEqual(value, SUCCESS);
  }
  if (!value || typeof value.body !== 'string') return false;
  const body = value.isBase64Encoded ? Buffer.from(value.body, 'base64').toString('utf8') : value.body;
  const text = fold(visibleText(body));
  const status = Number(value.statusCode);
  const html = /<[a-z][^>]*>/i.test(body) || Object.entries(value.headers || {})
    .some(([key, data]) => key.toLowerCase() === 'content-type' && /text\/html/i.test(String(data)));
  const noCharge = /tahsilat\s+(?:(?:henuz|kesinlikle|asla)\s+)?(?:yapilmad|yapilmamis|alinmad|alinmamis|gerceklesmed)/i;
  if (number === 5) return status >= 500 && status <= 599 && html && noCharge.test(text);
  if (number === 6) return status >= 400 && status <= 499 && html
    && !fold(body).includes(fold(RAW_ERROR)) && !text.includes(fold(RAW_ERROR));
  if (number === 7) return !/tahsilat\s+yapilmad/i.test(text)
    && /teyit\s+edemedik|teyit\s+edilemedi/i.test(text);
  if (number === 8) return /tahsilat\s+yapilmad/i.test(text) || text.includes('herhangi bir tahsilat');
  // Mukerrer taramasi okunamadiginda odeme baslatilmaz; musteri tekrar denemeye yonlendirilir.
  if (number === 10) return status === 503 && /(?:tekrar|yeniden|sonra)\s+deney/i.test(text);
  // HTTP 200 donen tanimsiz govde kesin ret DEGILDIR; belirsizlik cumlesi cikmalidir.
  if (number === 11) return !noCharge.test(text) && /teyit\s+edemedik|teyit\s+edilemedi/i.test(text);
  return /\baboneli(?:k|g[a-z]*)(?:\s+(?:basariyla|artik|simdi|hemen))?\s+(?:basladi|baslamistir|baslatildi|baslatilmistir)\b/i.test(text);
}

function fixture() {
  // Sabit ilk dokuz haneden iki kontrol hanesi standart algoritmayla hesaplanir.
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const odd = digits.filter((_, i) => i % 2 === 0).reduce((sum, n) => sum + n, 0);
  const even = digits.filter((_, i) => i % 2 === 1).reduce((sum, n) => sum + n, 0);
  digits.push(((odd * 7 - even) % 10 + 10) % 10);
  digits.push(digits.reduce((sum, n) => sum + n, 0) % 10);
  const packages = {
    'blog-profesyonel': { plan: PLAN, ad: 'Blog Profesyonel', tutar: 10 },
  };
  const fields = {
    ad: 'Ayse', soyad: 'Yilmaz', eposta: 'ayse@ornek.com', telefon: '5301234567',
    tckn: digits.join(''), sehir: 'Istanbul', adres: 'Ornek Mah 1 Sok No 2', onay: 'on',
  };
  return { packages, fields };
}

function eventFor(role, adapter) {
  if (role === 'start') return {
    httpMethod: 'POST', path: '/odeme/blog-profesyonel', headers: {},
    isBase64Encoded: false, body: new URLSearchParams(fixture().fields).toString(),
  };
  const callback = role === 'result';
  const endpoint = callback ? 'abonelik-sonuc' : 'abonelik-baslat';
  const fields = callback ? { token: TOKEN } : fixture(adapter.packages).fields;
  const json = adapter.encoding === 'json';
  return {
    httpMethod: adapter.method || 'POST',
    path: `/.netlify/functions/${endpoint}`,
    headers: {
      'content-type': json ? 'application/json' : 'application/x-www-form-urlencoded',
      'x-forwarded-for': '192.0.2.1', host: 'sinav.invalid',
    },
    body: json ? JSON.stringify(fields) : new URLSearchParams(fields).toString(),
    queryStringParameters: callback ? { token: TOKEN } : {},
    rawUrl: `${ROOT_URL}/.netlify/functions/${endpoint}${callback ? `?token=${TOKEN}` : ''}`,
  };
}

function exportedCall(mod, role) {
  const owner = mod?.default && typeof mod.default === 'object' ? mod.default : mod;
  if (role === 'api') return typeof owner?.formSonuc === 'function'
    ? { owner, fn: owner.formSonuc, handler: false } : null;
  if (role !== 'api' && typeof owner?.handler === 'function') return { owner, fn: owner.handler, handler: true };
  if (typeof mod === 'function') return { owner: null, fn: mod, handler: role !== 'api' };
  if (typeof mod?.default === 'function') return { owner: mod, fn: mod.default, handler: role !== 'api' };
  return null;
}

async function workerCase() {
  const { paths, test, adapter } = workerData;
  const [, role, scenario, number] = test;
  const timers = require('node:timers');
  const realTimeout = timers.setTimeout;
  let reached = false;
  let blocked = false;
  let requestCount = 0;
  let checkoutCount = 0;
  let invalidRequest = false;
  let finished = false;
  const finish = (result) => {
    if (finished) return;
    finished = true;
    parentPort.postMessage({ type: 'done', reached, ...result });
  };

  // Orijinal fetch hic cagrilmaz. Alternatif Node ag yollari da disariya cikamaz.
  const denyNetwork = () => { blocked = true; throw new Error('sinav_ag_kapali'); };
  for (const [id, names] of [
    ['node:http', ['request', 'get']], ['node:https', ['request', 'get']],
    ['node:http2', ['connect']], ['node:net', ['connect', 'createConnection']],
    ['node:tls', ['connect']], ['node:dgram', ['createSocket']],
  ]) {
    const builtin = require(id);
    for (const name of names) builtin[name] = denyNetwork;
  }
  require('node:net').Socket.prototype.connect = denyNetwork;
  if (globalThis.WebSocket) globalThis.WebSocket = denyNetwork;
  if (globalThis.EventSource) globalThis.EventSource = denyNetwork;

  // Sahte saat, uygulamanin kendi abort/deadline kurmasini gerektirir.
  // Hic timeout kurmayan kodu sinav kendi abort ederek basarili saymaz.
  globalThis.setTimeout = timers.setTimeout = (fn, ms, ...args) => {
    const delay = Math.max(Number(ms) || 0, 0);
    // 20 saniye 20 ms olur. Bir gunluk timeout 5 ms'ye indirilip gecirilmez.
    return realTimeout(fn, delay <= VIRTUAL_LIMIT_MS ? delay / 1000 : WORKER_LIMIT_MS + 1, ...args);
  };
  if (globalThis.AbortSignal && globalThis.AbortController) {
    AbortSignal.timeout = (ms) => {
      const controller = new AbortController();
      setTimeout(() => {
        const error = new Error('Sinav timeout');
        error.name = 'TimeoutError';
        controller.abort(error);
      }, ms);
      return controller.signal;
    };
  }

  let call;
  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' || input instanceof URL ? String(input) : input?.url;
    let parsed;
    try { parsed = new URL(url); } catch { throw new TypeError('sinav_imza'); }
    const method = String(init.method || input?.method || 'GET').toUpperCase();
    requestCount += 1;
    if (parsed.pathname.includes('checkoutform')) checkoutCount += 1;
    if (!/^https?:$/.test(parsed.protocol) || !/^[A-Z]+$/.test(method)
        || (role === 'api' && (requestCount !== 1 || method !== 'GET'
          || init.body != null || input?.body != null))) {
      invalidRequest = true;
      throw new TypeError('sinav_imza');
    }
    if (role === 'start') {
      // S10: olculen cagri taramanin KENDISI; checkout'a hic gidilmemis olmali.
      if (number === 10 && method === 'GET' && parsed.pathname.includes('subscriptions')) {
        if (!reached) { reached = true; parentPort.postMessage({ type: 'reached' }); }
        if (scenario === 'scan_throw') throw new TypeError('fetch failed: sinav network');
        if (scenario === 'scan_failure') {
          return new Response(JSON.stringify(REJECTION), {
            status: 200, headers: { 'content-type': 'application/json' },
          });
        }
        // scan_full: her sayfa dolu doner, hicbiri eslesmez; tarama tavana dayanir.
        const items = Array.from({ length: 100 }, (_, index) => ({
          referenceCode: `sinav-${requestCount}-${index}`,
          customerEmail: 'baska@ornek.com',
          customer: { email: 'baska@ornek.com' },
          pricingPlanReferenceCode: PLAN,
          subscriptionStatus: 'ACTIVE',
        }));
        return new Response(JSON.stringify({ status: 'success', data: { items } }), {
          status: 200, headers: { 'content-type': 'application/json' },
        });
      }
      if (requestCount === 1 && method === 'GET' && parsed.pathname.includes('subscriptions')) {
        // Abonelik taramasi vakayi olcmez; asil hata yalniz form istegine uygulanir.
        return new Response(JSON.stringify({ status: 'success', data: { items: [] } }), {
          status: 200, headers: { 'content-type': 'application/json' },
        });
      }
      if (requestCount !== 2 || !parsed.pathname.includes('checkoutform')) {
        invalidRequest = true;
        throw new TypeError('sinav_istek_sirasi');
      }
    }
    if (!reached) {
      reached = true;
      parentPort.postMessage({ type: 'reached' });
    }
    if (scenario === 'network') throw new TypeError('fetch failed: sinav network');
    if (scenario === 'abort') {
      const error = new Error('Sinav abort');
      error.name = 'AbortError';
      throw error;
    }
    if (scenario === 'hang') {
      const signal = init.signal || input?.signal;
      return new Promise((resolve, reject) => {
        const abort = () => {
          const error = new Error('Sinav timeout');
          error.name = 'AbortError';
          reject(error);
        };
        if (signal?.aborted) abort();
        else signal?.addEventListener('abort', abort, { once: true });
      });
    }
    // Is kurali reddi HTTP 200 ile gelir; 4xx ayri altyapi vakasidir.
    const status = scenario === 'server' ? 500 : scenario === 'http4xx' ? (adapter.httpStatus || 400) : 200;
    // S11: iyzico'nun tanimadigimiz govdeleri. Hicbiri "hayir" demek degildir.
    const BILINMEYEN = { empty_object: {}, empty_array: [], pending: { status: 'pending' } };
    const body = scenario === 'server' ? '<html><body>Sinav sunucu hatasi</body></html>'
      : JSON.stringify(Object.prototype.hasOwnProperty.call(BILINMEYEN, scenario)
        ? BILINMEYEN[scenario] : scenario === 'success' ? SUCCESS : REJECTION);
    return new Response(body, { status, headers: {
      'content-type': scenario === 'server' ? 'text/html' : 'application/json',
    } });
  };

  const data = fixture();
  Object.assign(process.env, {
    IYZICO_API_KEY: 'sinav_sahte_api_key', IYZICO_SECRET_KEY: 'sinav_sahte_secret_key',
    IYZICO_PAKETLER: JSON.stringify(data.packages), URL: ROOT_URL,
  });
  let mod;
  try {
    for (const file of Object.values(paths)) {
      try { delete require.cache[require.resolve(file)]; } catch { /* Diger roller bagimsizdir. */ }
    }
    delete require.cache[require.resolve(paths[role])];
    mod = require(paths[role]);
  } catch {
    finish({ state: 'ATLANDI', reason: blocked ? 'ag' : 'yukleme' });
    return;
  }
  call = exportedCall(mod, role);
  if (!call) { finish({ state: 'ATLANDI', reason: 'imza' }); return; }
  realTimeout(() => finish(reached ? { state: 'DUSTU' }
    : { state: 'ATLANDI', reason: blocked ? 'ag' : 'giris' }), REAL_LIMIT_MS);
  try {
    const args = call.handler ? [eventFor(role, adapter), {
      functionName: role === 'result' ? 'abonelik-sonuc' : 'abonelik-baslat',
      getRemainingTimeInMillis: () => 30000,
    }] : ['sahte-token'];
    const value = await call.fn.apply(call.owner, args);
    if (!reached || blocked) finish({ state: 'ATLANDI', reason: blocked ? 'ag' : 'giris' });
    else finish({ state: !invalidRequest && (number !== 10 || checkoutCount === 0)
      && verdict(number, value, call.handler) ? 'GECTI' : 'DUSTU' });
  } catch {
    finish(blocked ? { state: 'ATLANDI', reason: 'ag' } : reached ? { state: 'DUSTU' }
      : { state: 'ATLANDI', reason: 'giris' });
  }
}

function attempt(paths, test, adapter) {
  return new Promise((resolve) => {
    let reached = false;
    let settled = false;
    let timer;
    let worker;
    const done = async (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (worker) await worker.terminate().catch(() => {});
      resolve({ reached, ...result });
    };
    try {
      worker = new Worker(__filename, {
        workerData: { paths, test, adapter },
        // Gercek ortam anahtarlari ve NODE_OPTIONS alt kosuya tasinmaz.
        env: { NODE_ENV: 'test', TZ: 'Europe/Istanbul' }, execArgv: [],
        stdout: true, stderr: true,
      });
      // Uygulama loglari ve stack trace'ler rapora veya diske girmez.
      worker.stdout.resume();
      worker.stderr.resume();
      worker.on('message', (message) => {
        if (message.type === 'reached') reached = true;
        if (message.type === 'done') void done(message);
      });
      worker.on('error', () => void done(reached ? { state: 'DUSTU' }
        : { state: 'ATLANDI', reason: 'calistirma' }));
      worker.on('exit', () => void done(reached ? { state: 'DUSTU' }
        : { state: 'ATLANDI', reason: 'calistirma' }));
      timer = setTimeout(() => void done(reached ? { state: 'DUSTU' }
        : { state: 'ATLANDI', reason: 'sure' }), WORKER_LIMIT_MS);
    } catch { void done({ state: 'ATLANDI', reason: 'calistirma' }); }
  });
}

function adaptersFor(role) {
  if (role === 'result') return ['POST', 'GET'].flatMap((method) =>
    ['form', 'json'].map((encoding) => ({ method, encoding, packages: 0 })));
  return [{}];
}

async function main() {
  const args = process.argv.slice(2);
  const paths = args.length === 3 ? Object.fromEntries(['api', 'start', 'result']
    .map((role, i) => [role, path.resolve(args[i])])) : null;
  const chosen = new Map();
  let passed = 0;
  for (const test of CASES) {
    const [name, role] = test;
    let result = { state: 'ATLANDI', reason: 'arguman' };
    if (paths) {
      const candidates = chosen.has(role) ? [chosen.get(role)] : adaptersFor(role);
      for (const adapter of candidates) {
        result = await attempt(paths, test, adapter);
        if (result.reached) { chosen.set(role, adapter); break; }
        if (result.reason !== 'giris') break;
      }
      // S3 tek satir raporlanir; yaygin 4xx kodlarinin tamami ayni sozlesmeden gecer.
      if (test[3] === 3 && result.state === 'GECTI') {
        for (const httpStatus of [401, 403, 404, 429]) {
          result = await attempt(paths, test, { ...chosen.get(role), httpStatus });
          if (result.state !== 'GECTI') break;
        }
      }
    }
    if (result.state === 'GECTI') passed += 1;
    const reason = SKIP_REASONS[result.reason] || SKIP_REASONS.calistirma;
    process.stdout.write(`${result.state} ${name}${result.state === 'ATLANDI' ? ` ${reason}` : ''}\n`);
  }
  process.stdout.write(`${passed}/${CASES.length}\n`);
  // ATLANDI, basari degildir: 0 yalniz tum sozlesme olculup gecerse doner.
  process.exitCode = passed === CASES.length ? 0 : 1;
}

if (isMainThread) {
  main().catch(() => { process.exitCode = 1; });
} else {
  workerCase().catch(() => parentPort.postMessage({
    type: 'done', state: 'ATLANDI', reason: 'calistirma',
  }));
}
