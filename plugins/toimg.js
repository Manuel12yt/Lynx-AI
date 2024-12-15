import { webp2png } from '../lib/webp2mp4.js'

var handler = async (m, { conn, usedPrefix, command }) => {
  // Si se usa el comando .toimg sin un sticker citado
  const notStickerMessage = '*🌳 Responda a una imagen de tipo sticker*'
  if (!m.quoted) {
    conn.reply(m.chat, notStickerMessage, m, rcanal)
    return // Detener la ejecución del comando si no hay una imagen de tipo sticker
  }

  const q = m.quoted || m
  let mime = q.mediaType || ''

  // Si no es un sticker, lanzar el mensaje de error
  if (!/sticker/.test(mime)) {
    conn.reply(m.chat, notStickerMessage, m, rcanal)
    return // Detener la ejecución si no es un sticker
  }

  try {
    // Descargar el sticker citado
    let media = await q.download()

    // Convertir el sticker a imagen PNG
    let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)

    // Enviar la imagen convertida al chat
    await conn.sendFile(m.chat, out, 'output.png', '🌳 Aquí tienes la imagen convertida', m, fake,rcanal)

  } catch (error) {
    // Si ocurre un error, enviar mensaje de error
    conn.reply(m.chat, '❌ Ocurrió un error al procesar la imagen.', m, rcanal)
  }
}

handler.help = ['toimg']
handler.tags = ['img']
handler.command = ['toimg', 'jpg', 'jpeg', 'png']

handler.estrellas = 2

export default handler
