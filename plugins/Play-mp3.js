// [ ❀ PLAY ]
import fetch from "node-fetch";
import yts from "yt-search";

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(m.chat, "❀ Ingresa un link de YouTube válido", m);
    }

    await m.react("🕓");

    try {
        // Buscar el video en YouTube
        let ytres = await yts(text);
        let video = ytres.videos[0];

        if (!video) {
            return m.reply("❀ Video no encontrado");
        }

        let { title, thumbnail, timestamp, views, ago, url } = video;
        let vistas = parseInt(views).toLocaleString("es-ES") + " vistas";

        let HS = `- Duración: ${timestamp}
- Vistas: ${vistas}
- Subido: ${ago}
- Enlace: ${url}`;

        // Obtener el thumbnail
        let thumbBuffer;
        try {
            let thumbFile = await conn.getFile(thumbnail);
            thumbBuffer = thumbFile?.data;
        } catch (err) {
            console.error("Error al obtener el thumbnail:", err);
            thumbBuffer = null; // Continuar sin thumbnail si falla
        }

        // Enviar información del video
        let JT = {
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: "",
                    mediaType: 1,
                    previewType: 0,
                    mediaUrl: url,
                    sourceUrl: url,
                    thumbnail: thumbBuffer,
                    renderLargerThumbnail: true,
                },
            },
        };

        await conn.reply(m.chat, HS, m, JT);

        // Descargar audio desde la API
        try {
            let apiResponse = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${url}`);
            let json = await apiResponse.json();

            if (!json.result || !json.result.download) {
                throw new Error("No se encontró la propiedad 'download' en la respuesta de la API.");
            }

            let downloadLink = json.result.download;
            if (typeof downloadLink !== "string" || !downloadLink.startsWith("http")) {
                throw new Error("El enlace de descarga no es válido.");
            }

            // Enviar el audio
            await conn.sendMessage(
                m.chat,
                { audio: { url: downloadLink }, mimetype: "audio/mpeg" },
                { quoted: m }
            );
            await m.react("✅");
        } catch (error) {
            console.error("Error al descargar el audio:", error);
            await conn.reply(m.chat, "❀ No se pudo descargar el audio. Inténtalo más tarde.", m);
        }
    } catch (error) {
        console.error("Error general:", error);
        await conn.reply(m.chat, "❀ Ocurrió un error inesperado. Inténtalo más tarde.", m);
    }
};

handler.command = /^(play)$/i;

export default handler;
