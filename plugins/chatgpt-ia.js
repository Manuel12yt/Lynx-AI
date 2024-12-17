import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `❀ Por favor, ingresa un texto para realizar la consulta.`, m);
  }

  try {
    await m.react('🕓');

    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/chatgpt?text=${encodeURIComponent(
      text
    )}`;
    const response = await fetch(apiUrl);
    const data = await response.text(); // Procesamos la respuesta como texto

    if (!data) {
      await m.react('❌');
      return conn.reply(m.chat, `❀ No se pudo obtener una respuesta de la API.`, m);
    }

    await m.react('✅');
    conn.reply(m.chat, `🤖 *Respuesta de la API*:\n\n${data.replace(/\+/g, ' ')}`, m); // Reemplazamos los "+" por espacios
  } catch (error) {
    console.error(error);
    await m.react('⚠️');
    conn.reply(
      m.chat,
      `❀ Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.`,
      m
    );
  }
};

handler.help = ['chatgpt *<texto>*'];
handler.tags = ['ai'];
handler.command = ['chatgpt', 'ai'];
handler.limit = true;
handler.register = true;

export default handler;
