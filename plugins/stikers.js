import { sticker } from '../lib/sticker.js'; // Asegúrate de que esta función esté configurada correctamente
//import { uploadImage, uploadFile } from '../lib/upload.js'; // Librerías de subida

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'));
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false;

  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    // Verifica si es imagen, video o gif
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime) && (q.msg || q).seconds > 8) {
        return m.reply('❌ *El video no puede durar más de 8 segundos.*');
      }

      let img = await q.download?.();
      if (!img || !Buffer.isBuffer(img)) {
        return m.reply('🍁 *Por favor, envía primero una imagen o video para convertir en sticker.*');
      }

      try {
        stiker = await sticker(img, false, global.packname, global.author);
      } catch (e) {
        console.error('Error al generar el sticker:', e);
      }

      if (!stiker) {
        let out;
        if (/webp/g.test(mime)) out = await uploadFile(img);
        else if (/image/g.test(mime)) out = await uploadImage(img);
        else if (/video/g.test(mime)) out = await uploadFile(img);

        if (typeof out !== 'string') out = await uploadImage(img);

        stiker = await sticker(false, out, global.packname, global.author);
      }
    } else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packname, global.author);
      } else {
        return m.reply('💫 El URL proporcionado no es válido.');
      }
    }
  } catch (e) {
    console.error('Error general:', e);
    stiker = null;
  } finally {
    if (stiker) {
      if (Buffer.isBuffer(stiker)) {
        conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, {
          contextInfo: {
            forwardingScore: 200,
            isForwarded: false,
            externalAdReply: {
              showAdAttribution: false,
              title: global.packname,
              body: 'Sticker generado por CrowBot',
              mediaType: 2,
              sourceUrl: global.redes || '',
              thumbnail: global.icono || null
            }
          }
        });
      } else {
        console.error('Error: El sticker no es un buffer válido.');
        conn.sendMessage(m.chat, '🌲 *La conversión de sticker falló. Intenta con otro archivo.*', { quoted: m });
      }
    } else {
      conn.sendMessage(m.chat, '🌲 *No se pudo generar el sticker. Por favor, reintenta.*', { quoted: m });
    }
  }
};

handler.help = ['stiker *<img>*', 'sticker *<url>*'];
handler.tags = ['group'];
handler.command = ['s', 'sticker', 'stiker'];

export default handler;
