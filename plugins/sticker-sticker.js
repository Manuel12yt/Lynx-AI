import { sticker } from '../lib/sticker.js';
import uploadFile from '../lib/uploadFile.js';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/video/g.test(mime)) {
      if ((q.msg || q).seconds > 10) return m.reply('✧ Máximo 10 segundos.');

      let video = await q.download?.();
      if (!video) throw `✧ Responde a un vídeo con el comando *${usedPrefix + command}*`;

      let stiker = false;
      try {
        stiker = await sticker(video, false, global.stickpack, global.stickauth);
      } catch (e) {
        console.error(e);
        let out = await uploadFile(video);
        stiker = await sticker(false, out, global.stickpack, global.stickauth);
      }

      await conn.sendMessage(
        m.chat,
        { sticker: { url: stiker } },
        { quoted: m }
      );

    } else if (/image/g.test(mime)) {
      let img = await q.download?.();
      if (!img) throw `✧ Responde a una imagen con el comando *${usedPrefix + command}*`;

      let [packname, ...author] = args.join(' ').split('|');
      packname = packname || global.stickpack;
      author = (author || []).join('|') || global.stickauth;

      let stiker = false;
      try {
        stiker = await createSticker(img, null, packname, author, 100);
      } catch (e) {
        console.error(e);
      }

      if (!stiker) throw '✧ Hubo un problema al crear el sticker.';
      await conn.sendMessage(
        m.chat,
        { sticker: { url: stiker } },
        { quoted: m }
      );

    } else {
      conn.reply(
        m.chat,
        `✧ Responde a una imagen o video con el comando *${usedPrefix + command}*`,
        m
      );
    }
  } catch (e) {
    console.error(e);
    m.reply('❀ Hubo un error al procesar tu solicitud. Por favor, inténtalo nuevamente.');
  }
};

handler.help = ['sticker'];
handler.tags = ['sticker'];
handler.command = /^s(tic?ker)?(gif)?$/i;
handler.register = true;

export default handler;

async function createSticker(img, url, packName, authorName, quality) {
  const stickerMetadata = {
    type: 'full',
    pack: packName,
    author: authorName,
    quality: quality || 100,
  };
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer();
}
