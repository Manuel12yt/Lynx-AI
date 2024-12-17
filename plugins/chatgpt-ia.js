import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `❀ Por favor, ingresa un texto para realizar la consulta.`, m, rcanal);
  }

  try {
    await m.react('🕓');

    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(text)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    let result = data.result;

    // Detectar si el texto está en inglés y traducirlo al español
    const langApiUrl = `https://apis-starlights-team.koyeb.app/starlight/translate?text=${encodeURIComponent(result)}&to=es`;
    const langResponse = await fetch(langApiUrl);
    const langData = await langResponse.json();

    if (langData && langData.translation) {
      result = langData.translation;
    }

    conn.reply(m.chat, `🤖 ${result}`, m, rcanal);

  } catch {
    
  }
};

handler.help = ['chatgpt *<texto>*'];
handler.tags = ['tols'];
handler.command = ['chatgpt', 'ai'];
handler.register = true;

export default handler;
