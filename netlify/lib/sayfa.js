// Odeme akisindaki sayfalarin ortak kabugu. Site Next.js ile statik uretildigi
// icin bu sayfalar fonksiyondan HTML olarak doner; gorunum elle eslestirildi.
function kacir(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

const STIL = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#08090C;color:#F4F2EC;
  font-family:'Inter Tight','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;letter-spacing:-0.01em;line-height:1.6}
a{color:#4F8BFF}
.sar{max-width:640px;margin:0 auto;padding:64px 20px 80px}
.rozet{display:inline-block;padding:8px 16px;border-radius:999px;background:rgba(79,139,255,.10);
  border:1px solid rgba(79,139,255,.20);color:#4F8BFF;font-size:12px;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;margin-bottom:22px}
h1{font-size:34px;line-height:1.15;font-weight:700;letter-spacing:-.035em;margin:0 0 10px}
.alt{color:#8A8E99;margin:0 0 34px}
.kart{border:1px solid rgba(255,255,255,.07);background:#0b0e18;border-radius:22px;padding:28px;margin-bottom:18px}
.kart.vurgu{border-color:rgba(79,139,255,.40)}
.etiket{font-size:12px;font-weight:700;color:#7AA8FF;letter-spacing:.12em;text-transform:uppercase;margin:0 0 6px}
.bedel{font-size:40px;font-weight:700;margin:0}
.bedel span{font-size:18px;color:#8A8E99;font-weight:500}
ul{list-style:none;padding:0;margin:14px 0 0}
li{padding-left:22px;position:relative;color:#C9CCD4;font-size:14px;margin-bottom:8px}
li:before{content:'';position:absolute;left:0;top:8px;width:8px;height:8px;border-radius:50%;background:#4F8BFF}
.kform label{display:block;font-size:13px;color:#C9CCD4;margin:0 0 6px;font-weight:500}
.satir{margin-bottom:16px}
.ikili{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:520px){.ikili{grid-template-columns:1fr}}
.kform input,.kform textarea{width:100%;padding:13px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);color:#F4F2EC;font-size:15px;font-family:inherit;outline:none}
.kform input:focus,.kform textarea:focus{border-color:#4F8BFF}
.kform textarea{resize:vertical;min-height:78px}
.kform input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px #0b0e18 inset;-webkit-text-fill-color:#F4F2EC;caret-color:#F4F2EC}
.ipucu{font-size:12px;color:#8A8E99;margin:6px 0 0}
.onay{display:flex;gap:11px;align-items:flex-start;font-size:13px;color:#C9CCD4;margin:22px 0 6px}
.onay input{width:18px;height:18px;margin:2px 0 0;flex:0 0 auto;accent-color:#4F8BFF}
.kform button{width:100%;padding:16px;border:0;border-radius:14px;background:#4F8BFF;color:#fff;
  font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;margin-top:22px}
.kform button:hover{background:#2F6BE6}
.uyari{border:1px solid rgba(248,113,113,.30);background:rgba(248,113,113,.07);color:#FCA5A5;
  border-radius:14px;padding:14px 16px;font-size:14px;margin-bottom:20px}
.iyi{border:1px solid rgba(74,222,128,.30);background:rgba(74,222,128,.07);color:#86EFAC;
  border-radius:14px;padding:14px 16px;font-size:14px;margin-bottom:20px}
.dip{color:#8A8E99;font-size:13px;text-align:center;margin-top:30px}
.kartuyari{border:1px solid rgba(251,191,36,.32);background:rgba(251,191,36,.09);color:#FCD34D;
  border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5;margin:18px 0 0;font-weight:500}
#iyzipay-checkout-form{margin-top:8px;color-scheme:light;color:#1a1a1a}
#iyzipay-checkout-form input,#iyzipay-checkout-form select,#iyzipay-checkout-form textarea{color:#1a1a1a;-webkit-text-fill-color:#1a1a1a;caret-color:#1a1a1a}
#iyzipay-checkout-form input::placeholder{color:#8A8E99;-webkit-text-fill-color:#8A8E99}
#iyzipay-checkout-form input:-webkit-autofill{-webkit-text-fill-color:#1a1a1a}
`

function sayfa({ baslik, govde }) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="dark">
<title>${kacir(baslik)} | dolunay.ai</title>
<style>${STIL}</style>
</head>
<body><div class="sar">${govde}</div></body>
</html>`
}

// netlify.toml basliklari fonksiyon cevaplarina uygulanmiyor (canlida olculdu),
// bu yuzden odeme sayfasinin guvenlik basliklari burada kurulur. iyzico'nun gomulu
// formu kendi alan adlarindan script, baglanti ve cerceve aciyor; gevsetme yalniz
// bu sayfalarda, site genelinde degil.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.iyzipay.com https://cdn.iyzipay.com",
  "style-src 'self' 'unsafe-inline' https://static.iyzipay.com https://cdn.iyzipay.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://static.iyzipay.com https://cdn.iyzipay.com data:",
  "connect-src 'self' https://api.iyzipay.com https://merchant-gateway.iyzipay.com https://consumerapigw.iyzipay.com https://static.iyzipay.com https://cdn.iyzipay.com https://countly.iyzico.com https://o120955.ingest.tr.sentry.io",
  // 3D Secure adimi musteriyi KENDI BANKASININ adresine goturur (her banka ayri
  // alan adi, onceden listelenemez). Bu ikisi iyzipay ile sinirli kalirsa 3DS
  // adimi sessizce bloklanir ve iyzico "genel bir hata olustu" der.
  "frame-src 'self' https:",
  "frame-ancestors 'none'",
  "form-action 'self' https:",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

function html(kod, govde) {
  return {
    statusCode: kod,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': CSP,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
    },
    body: govde,
  }
}

function hataSayfasi(kod, baslik, mesaj) {
  return html(kod, sayfa({
    baslik,
    govde: `<span class="rozet">Abonelik</span>
      <h1>${kacir(baslik)}</h1>
      <div class="uyari">${kacir(mesaj)}</div>
      <p class="dip">Yardim icin <a href="mailto:dolunay@dolunay.ai">dolunay@dolunay.ai</a></p>`,
  }))
}

module.exports = { kacir, sayfa, html, hataSayfasi }
