/* 

[ Canal Principal ] :
https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n

[ Canal Rikka Takanashi Bot ] :
https://whatsapp.com/channel/0029VaksDf4I1rcsIO6Rip2X

[ Canal StarlightsTeam] :
https://whatsapp.com/channel/0029VaBfsIwGk1FyaqFcK91S

[ HasumiBot FreeCodes ] :
https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W
*/

// *[ ❀ YTMP3 ]*
import ytSearch from 'yt-search';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `❀ Ingresa el nombre de una canción o artista`, m);
  }

  try {
    // Buscar en YouTube
    const searchResults = await ytSearch(text);
    if (!searchResults.videos.length) {
      return conn.reply(m.chat, `❀ No se encontraron resultados para "${text}"`, m);
    }

    // Obtener el primer resultado
    const video = searchResults.videos[0];
    const { title, url, views, timestamp, ago } = video;

    // Descargar el audio MP3
    const downloadUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${url}`;
    const downloadResponse = await fetch(downloadUrl);
    const downloadData = await downloadResponse.json();
    const audioUrl = downloadData.data.dl;

    if (!audioUrl) {
      return conn.reply(m.chat, `❀ Ocurrió un error al intentar descargar el audio.`, m);
    }

    // Enviar información del video
    const caption = `
🎵 *Título*: ${title}
⏱️ *Duración*: ${timestamp}
👀 *Vistas*: ${views}
📆 *Publicado hace*: ${ago}
📎 *Enlace*: ${url}
    `.trim();

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

    // Enviar el archivo MP3
    await conn.sendMessage(
      m.chat,
      { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: false },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `❀ Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.`, m);
  }
};

handler.help = ['play *<título o artista>*'];
handler.tags = ['downloader'];
handler.command = ['play', 'ytmp3'];

export default handler;
