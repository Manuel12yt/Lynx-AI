import ytSearch from 'yt-search';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `❀ Ingresa el nombre de una canción o artista`, m);
  }

  try {
    await m.react('🕓');

    // Búsqueda de la canción en YouTube
    const searchResults = await ytSearch(text);
    if (!searchResults.videos.length) {
      await m.react('❌');
      return conn.reply(m.chat, `❀ No se encontraron resultados para "${text}"`, m);
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
> 🤴 Un momento, se está enviando el audio 🤴
    `.trim();

    // Enviar información del video
    conn.reply(m.chat, caption, m);

    // Obtener la URL de descarga de la API
    const downloadUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${url}`;
    const downloadResponse = await fetch(downloadUrl);
    const downloadData = await downloadResponse.json();
    const audioUrl = downloadData?.data?.dl;

    // Verificar si se obtuvo la URL de descarga
    if (!audioUrl) {
      await m.react('❌');
      return conn.reply(m.chat, `❀ Ocurrió un error al intentar descargar el audio.`, m);
    }

    // Comprobar el tamaño del archivo de audio
    const headResponse = await fetch(audioUrl, { method: 'HEAD' });
    const fileSize = headResponse.headers.get('content-length');

    if (fileSize > 5000000) { // Límite de 5MB (ajústalo según tus necesidades)
      return conn.reply(m.chat, '❀ El archivo de audio es demasiado grande para ser enviado.', m);
    }

    // Enviar el archivo de audio
    await conn.sendMessage(
      m.chat,
      { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false }, // 'audio/mpeg' si es MP3
      { quoted: m }
    );
    
    await m.react('✅');
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    await m.react('⚠️');
    conn.reply(m.chat, `❀ Ocurrió un error al procesar tu solicitud.`, m);
  }
};

handler.help = ['play *<título o artista>*'];
handler.tags = ['downloader'];
handler.command = ['play', 'ytmp3'];
handler.register = true;

export default handler;
