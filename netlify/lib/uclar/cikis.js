// Cikis. POST /.netlify/functions/cikis
//
// Oturum kaydi DEPODAN SILINIR, sonra cerez dusurulur. Sadece cerezi
// dusurmek yetmezdi: kimligi bir yerde saklamis biri onu tekrar
// kullanabilirdi. Opak kimlik + depo secilmesinin sebebi tam olarak bu.
const { oturumKapat } = require('../hesap')
const { cerezOku, cerezSil, json } = require('../oturum')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { hata: 'Yöntem desteklenmiyor.' })
  }

  const id = cerezOku(event)
  if (id) {
    try {
      await oturumKapat(id)
    } catch (e) {
      // Kayit silinemedi ama cerez yine de dusurulur: kullanici cikis
      // yaptigini gormeli. Kalan kayit suresi dolunca kendiliginden
      // gecersizlesiyor.
      console.error('oturum kaydi silinemedi', e && e.message)
    }
  }
  return json(200, { girisli: false }, cerezSil())
}
