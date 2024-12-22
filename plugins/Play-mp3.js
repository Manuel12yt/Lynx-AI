// [ ❀ PLAY ]
import fetch from "node-fetch";
import yts from "yt-search";

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(m.chat, "❀ Ingresa un enlace de YouTube válido.", m,rcanal);
    }

    await m.react("🕓");

    try {
        // Buscar información del video
        const ytres = await yts(text);
        const video = ytres.videos[0];

        if (!video) {
            return m.reply("❀ Video no encontrado.", m);
        }

        const { title, thumbnail, timestamp, views, ago, url } = video;
        const vistas = parseInt(views).toLocaleString("es-ES") + " vistas";

        // Preparar información del video
        const infoMessage = `- 🎵 Título: ${title}
- ⏳ Duración: ${timestamp}
- 👀 Vistas: ${vistas}
- 📆 Subido: ${ago}
- 🔗 Enlace: ${url}`;

        // Obtener el thumbnail (opcional)
        let thumbBuffer;
        try {
            const thumbFile = await conn.getFile(thumbnail);
            thumbBuffer = thumbFile?.data;
        } catch (err) {
            console.error("Error al obtener el thumbnail:", err);
            thumbBuffer = null;
        }

        // Enviar información inicial del video
        const metadata = {
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: "Descargando audio...",
                    mediaType: 1,
                    previewType: 0,
                    mediaUrl: url,
                    sourceUrl: url,
                    thumbnail: thumbBuffer,
                    renderLargerThumbnail: true,
                },
            },
        };
        await conn.reply(m.chat, infoMessage, m, metadata,rcanal);

        // Descargar audio desde la API
        const apiResponse = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${url}`);
        const json = await apiResponse.json();

        if (!json.result || !json.result.download || !json.result.download.url) {
            throw new Error("Respuesta de la API no contiene el enlace de descarga.");
        }

        const downloadLink = json.result.download.url;

        // Enviar el audio
        await conn.sendMessage(
            m.chat,
            { audio: { url: downloadLink }, mimetype: "audio/mpeg" },
            { quoted: m }
        );

        await m.react("✅");
    } catch (error) {
        console.error("Error al manejar el comando:", error);
        await conn.reply(m.chat, "❀ No se pudo completar la descarga. Inténtalo más tarde.", m);
    }
};

handler.command = /^(play)$/i;

export default handler;
