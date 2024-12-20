import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, command, args, text }) => {
  if (!text) {
    return conn.reply(
      m.chat, 
      `🌸 *Ingrese el nombre de un video de YouTube*\n\nEjemplo: !${command} Enemy Tommee Profitt`, 
      m
    );
  }

  await m.react('⏳'); // Indicador de espera

  try {
    // Búsqueda en YouTube
    const ytPlay = await yts(text);
    if (!ytPlay.videos.length) {
      return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
    }

    const video = ytPlay.videos[0];
    const { title, url, timestamp, description, thumbnail } = video;

    // Enviar la imagen, título y descripción
    const descriptionText = `🎶 *Título:* ${title}\n⏳ *Duración:* ${timestamp}\n📝 *Descripción:* ${description || 'No disponible'}`;
    await conn.reply(m.chat, descriptionText, m);

    // Enviar la imagen
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: descriptionText,
    });

    // Descargar directamente el MP3
    const audioData = await getDownloadUrl(url);
    if (!audioData || !audioData.url) {
      return conn.reply(m.chat, '❌ No se pudo obtener el enlace de descarga del MP3.', m);
    }

    const audioUrl = audioData.url;
    const fileSize = audioData.bytes_size;

    // Si el archivo es grande, lo enviamos como documento, si no lo enviamos como audio directamente
    if (fileSize > 50 * 1024 * 1024) {  // 50MB
      // Enviar el archivo como documento
      return conn.sendMessage(m.chat, {
        document: { url: audioUrl },
        fileName: `${title}.mp3`,
        mimetype: 'audio/mpeg',
      });
    } else {
      // Enviar el archivo MP3 directamente
      const audioResponse = await fetch(audioUrl);
      const audioBuffer = await audioResponse.buffer();

      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
      });
    }

    await m.react('✅');
  } catch (error) {
    await m.react('❌');
    console.error(error);
    conn.reply(m.chat, '❌ *Hubo un error al procesar su solicitud.*', m);
  }
};

// Función para obtener el URL de descarga
async function getDownloadUrl(videoUrl) {
  try {
    const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status) throw new Error('API no pudo obtener el enlace');
    return data.data.download;
  } catch (error) {
    console.error('Error obteniendo URL de audio:', error);
    throw error;
  }
}

handler.help = ['play '];
handler.tags = ['descargas'];
handler.command = ['play'];
handler.group = true;

export default handler;
