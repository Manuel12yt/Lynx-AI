import ytSearch from 'yt-search';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import NodeID3 from 'node-id3';

let handler = async (m, { conn, text, usedPrefix, command, quoted }) => {
  if (!text && !quoted) {
    return conn.reply(m.chat, `❀ Ingresa el nombre de una canción o artista`, m, fake);
  }

  try {
    if (quoted) {
      const quotedMessage = quoted.text || quoted.caption;
      if (quotedMessage && quotedMessage.includes('📎 *Enlace*:') && /audio/i.test(text)) {
        const urlMatch = quotedMessage.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          const url = urlMatch[0];
          await m.react('🕓');
          return await processAudioDownload(m, conn, url); // Llamar función de descarga directa
        }
      }
    }

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
> - Para descargar responde a este mensaje con Video o Audio.
    `.trim();

    conn.reply(m.chat, caption, m);
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

// Función para procesar la descarga del MP3
async function processAudioDownload(m, conn, url) {
  try {
    const downloadUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${url}`;
    const downloadResponse = await fetch(downloadUrl);
    const downloadData = await downloadResponse.json();
    const audioUrl = downloadData?.data?.dl;

    if (!audioUrl) {
      await m.react('❌');
      return conn.reply(m.chat, `❀ Ocurrió un error al intentar descargar el audio.`, m);
    }

    const tempFile = path.resolve('./temp', `audio.mp3`);
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.buffer();
    fs.writeFileSync(tempFile, audioBuffer);

    // Agregar etiquetas ID3
    const tags = {
      title: 'Descarga de YouTube',
      artist: 'Bot',
      album: 'YouTube',
      year: new Date().getFullYear().toString(),
      comment: {
        text: `Descargado desde YouTube`,
      },
      genre: 'Podcast',
    };
    NodeID3.write(tags, tempFile);

    // Enviar el archivo de audio con etiquetas
    await conn.sendMessage(
      m.chat,
      { audio: fs.createReadStream(tempFile), mimetype: 'audio/mp4', ptt: false },
      { quoted: m }
    );

    await m.react('✅');
    fs.unlinkSync(tempFile);
  } catch (error) {
    console.error(error);
    await m.react('⚠️');
    conn.reply(m.chat, `❀ Ocurrió un error al intentar procesar el audio.`, m);
  }
}

handler.help = ['play *<título o artista>*'];
handler.tags = ['downloader'];
handler.command = ['play', 'ytmp3'];
handler.register = true;

export default handler;
