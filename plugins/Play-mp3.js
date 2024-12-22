// [ ❀ PLAY ]
import fetch from "node-fetch";
import yts from "yt-search";

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, `❀ Ingresa un link de YouTube válido`, m,rcanal);
    

    await m.react('🕓');

    // Buscar video en YouTube
    let ytres = await yts(text);
    let video = ytres.videos[0];

    if (!video) {
        return conn.reply(m.chat, "❀ Video no encontrado", m,rcanal);
    }

    let { title, thumbnail, timestamp, views, ago, url } = video;
    let vistas = parseInt(views).toLocaleString("es-ES") + " vistas";

    let HS = `- Duración: ${timestamp}
- Vistas: ${vistas}
- Subido: ${ago}
- Enlace: ${url}`;

    // Manejar el thumbnail
    let thumb;
    try {
        let thumbFile = await conn.getFile(thumbnail);
        thumb = thumbFile?.data;
    } catch (err) {
        console.error("Error obteniendo thumbnail:", err);
        thumb = null; // Usa un valor por defecto si falla
    }

    let JT = {
        contextInfo: {
            externalAdReply: {
                title: title,
                body: "",
                mediaType: 1,
                previewType: 0,
                mediaUrl: url,
                sourceUrl: url,
                thumbnail: thumb || undefined, // Solo incluye thumbnail si está disponible
                renderLargerThumbnail: true,
            }
        }
    };

    await conn.reply(m.chat, HS, m, { quoted: m }, JT,rcanal);

    try {
        // Descargar el MP3
        let api = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${url}`);
        let json = await api.json();

        if (!json.result || !json.result.download) {
            throw new Error("Error en la respuesta de la API. No se encontró 'download'.");
        }

        let download = json.result.download;

        // Enviar audio
        await conn.sendMessage(
            m.chat,
            { 
                audio: { url: download.url }, 
                mimetype: "audio/mpeg" 
            },
            { quoted: m }
        );

        await m.react('✅');
    } catch (error) {
        console.error("Error al enviar audio:", error);
        await conn.reply(m.chat, "❀ Ocurrió un error al procesar el comando. Inténtalo nuevamente.", m);
    }
};

handler.command = /^(play)$/i;

export default handler;
