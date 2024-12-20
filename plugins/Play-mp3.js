// *[ ❀ YTMP3 ]*
import ytSearch from 'yt-search';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `❀ Ingresa el nombre de una canción o artista`, m, fake);
  }

  try {
    await m.react('🕓');

    const searchResults = await ytSearch(text);
    if (!searchResults.videos.length) {
      await m.react('❌');
      return conn.reply(m.chat, `❀ No se encontraron resultados para "${text}"`, m, fake);
    }

    const video = searchResults.videos[0];
    const { title, url, views, timestamp, ago } = video;

    const caption = `
🎵 *Título*: ${title}
⏱️ *Duración*: ${timestamp}
👀 *Vistas*: ${views}
📆 *Publicado hace*: ${ago}
📎 *Enlace*: ${url}
\n
> 🤴 un momento se esta enviando 🤴
    `.trim();

    conn.reply(m.chat, caption, m, rcanal);

    const downloadUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${url}`;
    const downloadResponse = await fetch(downloadUrl);
    const downloadData = await downloadResponse.json();
    const audioUrl = downloadData?.data?.dl;

    if (!audioUrl) {
      await m.react('❌');
      return conn.reply(m.chat, `❀ Ocurrió un error al intentar descargar el audio.`, m);
    }

    await conn.sendMessage(
      m.chat,
      { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false },
      { quoted: m }
    );
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('⚠️');
    conn.reply(
      m.chat,
      `❀ Ocurrió un error al procesar tu solicitud.`,
      m
    );
  }
};

handler.help = ['play *<título o artista>*'];
handler.tags = ['downloader'];
handler.command = ['play', 'ytmp3'];
handler.register = true;

export default handler;
