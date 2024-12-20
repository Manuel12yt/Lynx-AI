import fetch from 'node-fetch';
import yts from 'yt-search';


const LimitAud = 725 * 1024 * 1024; // 700MB
const LimitVid = 425 * 1024 * 1024; // 425MB


const sendAudio = async (conn, chat, url, title, quoted, size) => {
    if (size > LimitAud) {
        return await conn.sendMessage(chat, {
            document: { url },
            fileName: `${title}.mp3`,
            mimetype: 'audio/mpeg',
            caption: '🎵 Archivo demasiado grande, enviado como documento.',
        }, { quoted });
    }
    return await conn.sendMessage(chat, {
        audio: { url },
        mimetype: 'audio/mpeg',
    }, { quoted });
};

// Función para enviar mensajes de video
const sendVideo = async (conn, chat, url, title, thumbnail, quoted, size) => {
    if (size > LimitVid) {
        return await conn.sendMessage(chat, {
            document: { url },
            fileName: `${title}.mp4`,
            mimetype: 'video/mp4',
            caption: '🎥 Archivo demasiado grande, enviado como documento.',
        }, { quoted });
    }
    return await conn.sendMessage(chat, {
        video: { url },
        mimetype: 'video/mp4',
        caption: '🎥 Aquí está tu video.',
        thumbnail,
    }, { quoted });
};

// Función principal del handler
const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    const isAudio = command === 'Audio' || command === 'mp3';
    const isVideo = command === 'Video' || command === 'mp4';

    if (!text) {
        return conn.reply(m.chat, `🌸 *Ingrese el nombre de un video de YouTube*\n\nEjemplo: !${command} Enemy Tommee Profitt`, m);
    }

    await m.react('⌛'); // Reacción de espera
    const searchResults = await yts(text);
    const yt_play = searchResults.videos[0];
    const details = `📚 Título: ${yt_play.title}\n📆 Publicado: ${yt_play.ago}\n🕒 Duración: ${yt_play.timestamp}\n👀 Vistas: ${yt_play.views}\n👤 Autor: ${yt_play.author.name}\n🔗 Enlace: ${yt_play.url}`;

    await conn.sendMessage(m.chat, {
        image: { url: yt_play.thumbnail },
        caption: `${details}\n\n⏳ *Procesando tu solicitud...*`,
    });

    try {
        const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${encodeURIComponent(yt_play.url)}`;
        const apiResponse = await fetch(apiUrl);
        const response = await apiResponse.json();

        if (!response.status) throw new Error('Error en la descarga desde la API.');

        const downloadUrl = response.data.download.url;
        const fileSize = await getFileSize(downloadUrl);

        if (isAudio) {
            await sendAudio(conn, m.chat, downloadUrl, yt_play.title, m, fileSize);
        } else if (isVideo) {
            await sendVideo(conn, m.chat, downloadUrl, yt_play.title, yt_play.thumbnail, m, fileSize);
        }

        await m.react('✅'); // Reacción de éxito
    } catch (error) {
        console.error('Error en la descarga:', error.message);
        await m.react('❌'); // Reacción de error
        await conn.reply(m.chat, '⚠️ Hubo un error al procesar tu solicitud.', m);
    }
};

handler.help = ['play *<título o artista>*'];
handler.tags = ['downloader'];
handler.command = ['play', 'ytmp3'];
handler.register = true;

export default handler;
