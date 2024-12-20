const axios = require('axios');
const yts = require('yt-search');

module.exports = async function (anita, msg, args) {
    try {
        if (args.length === 0) {
            return anita.sendMessage(msg.from, { text: 'Por favor, proporciona el texto para buscar en YouTube.' });
        }

        // Realizar búsqueda en YouTube
        const searchQuery = args.join(' ');
        const searchResults = await yts(searchQuery);

        if (!searchResults || searchResults.videos.length === 0) {
            return anita.sendMessage(msg.from, { text: 'No se encontraron resultados en YouTube.' });
        }

        // Obtener el primer resultado
        const video = searchResults.videos[0];
        const videoUrl = video.url;

        // Consultar la API para obtener los datos del video
        const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const apiResponse = await axios.get(apiUrl);

        if (!apiResponse.data.status || !apiResponse.data.data.download.url) {
            return anita.sendMessage(msg.from, { text: 'No se pudo obtener el enlace de descarga del MP3.' });
        }

        const { image_max_resolution, download } = apiResponse.data.data;
        const { url: downloadUrl, size } = download;

        // Enviar detalles del video
        await anita.sendMessage(msg.from, {
            image: { url: image_max_resolution },
            caption: `🎧 *${video.title}*\n📦 *Tamaño*: ${size}\n🔗 *Enlace*: ${videoUrl}`,
        });

        // Descargar el MP3
        const audioResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

        // Enviar el archivo MP3
        await anita.sendMessage(msg.from, {
            audio: { buffer: audioResponse.data },
            mimetype: 'audio/mpeg',
        });

        console.log('MP3 enviado correctamente.');
    } catch (error) {
        console.error('Error al procesar el comando:', error.message);
        anita.sendMessage(msg.from, { text: 'Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.' });
    }
};
