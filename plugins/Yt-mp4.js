// *[ ❀ YTMP4 ]*
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❀ Ingresa un link de YouTube válido`, m);

  await m.react('🕓');

  try {
    let api = await (await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${text}`)).json();
    let dl_url = api.data.dl;

    await conn.reply(m.chat, dl_url, 'video.mp4',m,listo);

    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('❌');
    conn.reply(m.chat, `❀ Ocurrió un error al intentar descargar el video. Inténtalo más tarde.`, m);
  }
};

handler.help = ['ytmp4 *<url>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp4'];
handler.register = true;

export default handler;
