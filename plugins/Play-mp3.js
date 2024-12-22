import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, command, args, text }) => {
  if (!text) {
    return conn.reply(m.chat, `🌸 *Ingrese el nombre de un video de YouTube*\n\nEjemplo: !${command} Enemy Tommee Profitt`, m,fake,rcanal);
  }

  await m.react('⏳');

  try {
    const ytPlay = await yts(text);
    if (!ytPlay.videos.length) {
      return conn.reply(m.chat, '❌ No se encontraron resultados.', m,fake);
    }

    const video = ytPlay.videos[0];
    const { title, url, timestamp, description, thumbnail } = video;
    const descriptionText = `🎶 *Título:* ${title}\n⏳ *Duración:* ${timestamp}\n📝 *Descripción:* ${description || 'No disponible'}`;
    
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: descriptionText,
    });

    const audioData = await getDownloadUrl(url);
    if (!audioData || !audioData.url) {
      return conn.reply(m.chat, '❌ No se pudo obtener el enlace de descarga del MP3.', m,fake);
    }

    const audioUrl = audioData.url;
    const fileSize = audioData.bytes_size;

    if (fileSize > 50 * 1024 * 1024) {
      return conn.sendMessage(m.chat, {
        document: { url: audioUrl },
        fileName: `${title}.mp3`,
        mimetype: 'audio/mpeg',
      },{ quated: m });
    } else {
      const audioResponse = await fetch(audioUrl);
      const audioBuffer = await audioResponse.buffer();

      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
      },{ quated: m });
    }

    await m.react('✅');
  } catch (error) {
    await m.react('❌');
    console.error(error);
    conn.reply(m.chat, '❌ *Hubo un error al procesar su solicitud.*', m);
  }
};

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
