import axios from 'axios';

const query = [
  'video%20divertido',           // videos divertidos
  'video%20viral',               // video viral
  'chistes%20latinos',           // chistes latinos
  'bailes%20latinos',            // bailes latinos
  'historias%20graciosas',       // historias graciosas
  'memes%20latinos',             // memes latinos
  'comedia%20latina',            // comedia latina
  'fails%20graciosos',           // fails graciosos
  'video%20de%20reto',           // videos de retos
  'videos%20de%20mascotas',      // videos de mascotas
  'tendencias%20de%20tik%20tok', // tendencias de tiktok
  'video%20de%20familia',        // videos de familia
  'humor%20latino',              // humor latino
  'videos%20de%20chismes',       // videos de chismes
  'videos%20de%20fiesta',        // videos de fiesta
  'videos%20de%20bromas',        // videos de bromas
  'videos%20de%20baile%20viral', // videos virales de baile
  'video%20de%20gente%20bailando', // videos de gente bailando
  'video%20de%20reaccion',       // videos de reacciones
  'tiktok%20graciosos',          // tiktok graciosos
  'video%20de%20viajes',         // videos de viajes
  'videos%20de%20comida',        // videos de comida
  'reto%20viral'                 // reto viral
];

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let searchQuery = args.join(' ');

  if (!searchQuery) {
    searchQuery = query[Math.floor(Math.random() * query.length)];
    m.reply('👀 *No se especificó un término, buscando un video aleatorio...*');
    return
  } else {
    m.reply(`👀 *Buscando videos sobre: ${searchQuery}*`);
    return
  }

  try {
    const a = await tiktoks(searchQuery); // Llamada a la función que obtiene el video
    console.log("Video obtenido:", a); // Log para ver los detalles del video
    let cap = a.title;
    await conn.sendMessage(m.chat, { video: { url: a.no_watermark }, caption: cap }, { quoted: m });
  } catch (err) {
    console.error("Error al obtener el video:", err); // Mejorar el registro de errores
    m.reply('❌ *Error al obtener el video.* Intenta de nuevo.');
  }
};

handler.help = ['tiktok <consulta>'];
handler.tags = ['downloader'];
handler.command = /^(tiktokrandon|tiktok)$/i;
handler.limit = true;
handler.register = true;

export default handler;

async function tiktoks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=es',  // Cambié el idioma a español
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      });

      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject('No se encontró ningún video.');
      } else {
        const gywee = Math.floor(Math.random() * videos.length);  // Elige un video aleatorio
        const videorndm = videos[gywee];

        const result = {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        };
        resolve(result);
      }
    } catch (error) {
      reject(error.message || 'Error desconocido.');
    }
  });
}

// Función que utiliza fetch para obtener datos de la API TikTok (para caso de URL)
async function tiktokdl(url) {
  try {
    let tikwm = `https://www.tikwm.com/api/?url=${url}?hd=1`;
    let response = await (await fetch(tikwm)).json();
    console.log("Respuesta de tiktokdl:", response); // Log de la respuesta de la URL
    return response;
  } catch (err) {
    console.error("Error en tiktokdl:", err); // Log de error si algo falla
    return null;
  }
}
