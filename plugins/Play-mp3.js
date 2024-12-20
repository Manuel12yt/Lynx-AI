import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import fetch from 'node-fetch';
import yts from 'yt-search';

const LimitAud = 725 * 1024 * 1024; // 700MB
const LimitVid = 425 * 1024 * 1024; // 425MB

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
    const { title, ago, duration, views, author, url, thumbnail } = video;

    // Texto informativo
    const infoText = `
*𔓕꯭𓏲 Crow Bot 𓏲꯭𔓕*

📚 *Título*: ${title}
📆 *Publicado*: ${ago}
🕒 *Duración*: ${duration.timestamp}
👀 *Vistas*: ${views}
👤 *Autor*: ${author.name}
🔗 *Enlace*: ${url}

📽 *Descargando su ${command === 'paudio' ? 'audio' : 'video'}... Espere un momento...*`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoText,
    });

    // Descarga y envío
    if (command === 'paudio' || command === 'mp3') {
      const audioUrl = await getDownloadUrl(url, 'audio');
      const fileSize = await getFileSize(audioUrl);

      if (fileSize > LimitAud) {
        return conn.sendMessage(m.chat, {
          document: { url: audioUrl },
          fileName: `${title}.mp3`,
          mimetype: 'audio/mpeg',
        });
      }

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
      });
    } else if (command === 'pvideo' || command === 'mp4') {
      const videoUrl = await getDownloadUrl(url, 'video');
      const fileSize = await getFileSize(videoUrl);

      if (fileSize > LimitVid) {
        return conn.sendMessage(m.chat, {
          document: { url: videoUrl },
          fileName: `${title}.mp4`,
          mimetype: 'video/mp4',
        });
      }

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: `🌷 Aquí está tu video.`,
        fileName: `${title}.mp4`,
        thumbnail,
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

// Función para calcular el tamaño del archivo
async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return parseInt(response.headers.get('content-length') || '0');
  } catch (error) {
    console.error('Error obteniendo tamaño del archivo:', error);
    return 0;
  }
}

handler.help = ['paudio', 'pvideo', 'pdoc', 'pdoc2', 'playdoc'];
handler.tags = ['descargas'];
handler.command = ['paudio', 'pvideo', 'pdoc', 'pdoc2', 'mp32', 'mp42', 'playdoc', 'playdoc2']
handler.group = true;

export default handler;
