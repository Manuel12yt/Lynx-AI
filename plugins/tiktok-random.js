import axios from 'axios';

const query = [
  'video%20divertido',           
  'video%20viral',               
  'chistes%20latinos',           
  'bailes%20latinos',            
  'historias%20graciosas',       
  'memes%20latinos',             
  'comedia%20latina',            
  'fails%20graciosos',           
  'video%20de%20reto',           
  'videos%20de%20mascotas',      
  'tendencias%20de%20tik%20tok', 
  'video%20de%20familia',        
  'humor%20latino',              
  'videos%20de%20chismes',       
  'videos%20de%20fiesta',        
  'videos%20de%20bromas',        
  'videos%20de%20baile%20viral', 
  'video%20de%20gente%20bailando', 
  'video%20de%20reaccion',       
  'tiktok%20graciosos',          
  'video%20de%20viajes',         
  'videos%20de%20comida',        
  'reto%20viral'                 
];

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let searchQuery = args.join(' ');

  if (!searchQuery) {
    searchQuery = query[Math.floor(Math.random() * query.length)];
  } else {
    m.reply(`👀 *Buscando videos sobre: ${searchQuery}*`);
  }

  try {
    const a = await tiktoks(searchQuery); // Llamada a la función que obtiene el video
    console.log("Video obtenido:", a); // Log para ver los detalles del video
    let cap = `🎥 *${a.title}*\n🔊 *Música:* [Escuchar Música](${a.music})`; // Adding music link and title
    await conn.sendMessage(m.chat, { 
      video: { url: a.no_watermark }, 
      caption: cap, 
      thumbnail: a.cover // Displaying the thumbnail image 
    }, { quoted: m });
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

async function tiktokdl(url) {
    try {
      // Ensure the URL is correctly formatted without redundant parameters
      let tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`; 
      let response = await (await fetch(tikwm)).json();
      
      // Log the response for debugging
      console.log("Respuesta de tiktokdl:", response); 
      
      // Check if the response contains the expected data
      if (response.code === 200) {
        return response; // Return the response containing video details
      } else {
        console.error("Error al obtener el video:", response.message);
        return null;
      }
    } catch (err) {
      console.error("Error en tiktokdl:", err); // Log of error in case of failure
      return null;
    }
  }
  
