import fs from 'fs';
import ytSearch from 'yt-search';
import fetch from 'node-fetch';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

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

    // Descargar el archivo de audio
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.buffer();
    
    // Guardar temporalmente el archivo en el sistema
    const audioPath = './temp_audio.mp3';
    await writeFile(audioPath, audioBuffer);

    // Enviar el archivo de audio descargado
    await conn.sendMessage(
      m.chat,
      { audio: { url: audioPath }, mimetype: 'audio/mpeg', ptt: false }, 
      { quoted: m }
    );

    // Eliminar el archivo temporal después de enviarlo
    fs.unlinkSync(audioPath);
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
