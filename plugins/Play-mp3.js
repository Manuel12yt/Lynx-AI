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
    const { title, url, thumbnail } = video;

    // Texto informativo
    const infoText = `*𔓕꯭𓏲 Crow Bot 𓏲꯭𔓕*

📚 *Título*: ${title}
🔗 *Enlace*: ${url}

📽 *Descargando el audio... Espere un momento...*`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoText,
    });

    // Obtener el enlace de descarga del MP3
    const audioUrl = await getDownloadUrl(url, 'audio');

    // Enviar directamente el archivo MP3
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
    });

    await m.react('✅');
  } catch (error) {
    await m.react('❌');
    console.error(error);
    conn.reply(m.chat, '❌ *Hubo un error al procesar su solicitud.*', m);
  }
};

// Función para obtener el URL de descarga
async function getDownloadUrl(videoUrl, type) {
  try {
    const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status) throw new Error('API no pudo obtener el enlace');
    return type === 'audio' ? data.data.download.audio : data.data.download.video;
  } catch (error) {
    console.error(`Error obteniendo URL de ${type}:`, error);
    throw error;
  }
}

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];
handler.group = true;

export default handler;
