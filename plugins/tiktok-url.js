async function tiktokdl(url) {
  try {
    // Asegúrate de que la URL esté correctamente formateada
    let tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`; 
    let response = await (await fetch(tikwm)).json();
    
    // Mostrar la respuesta en la consola
    console.log("Respuesta de la API:", response);
    
    // Opcional: Retornar la respuesta si necesitas trabajar con ella después
    return response;
  } catch (err) {
    console.error("Error al obtener el video:", err); // Mostrar error si falla
    return null;
  }
}

// Handler que recibe la URL y muestra el resultado de la API en consola
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let url = args[0];  // Suponiendo que el primer argumento sea la URL de TikTok

  if (!url) {
    m.reply("❌ *Debes proporcionar la URL de un video de TikTok.*");
    return;
  }

  // Llamada a la función tiktokdl con la URL proporcionada
  try {
    const response = await tiktokdl(url);

    if (response) {
      console.log("Datos obtenidos de la API de TikTok:", response);
      // Aquí puedes enviar un mensaje si lo deseas, por ejemplo:
      // m.reply(`🔍 *Título:* ${response.title}`);
    } else {
      m.reply("❌ *No se pudo obtener la información del video.*");
    }
  } catch (err) {
    console.error("Error en la llamada al handler:", err);
    m.reply("❌ *Hubo un error al obtener el video.*");
  }
};

// Definir el comando y el handler
handler.help = ['tiktok <url>'];  // Comando con la URL como argumento
handler.tags = ['downloader'];     // Etiquetas del comando
handler.command = /^(tiktok)$/i;  // Comando que se puede invocar

export default handler;
