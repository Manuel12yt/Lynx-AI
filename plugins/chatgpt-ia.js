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

    conn.reply(m.chat, `🤖 ${data.result}`, m, rcanal);

  } catch {

  }
};

handler.help = ['chatgpt *<texto>*'];
handler.tags = ['tols'];
handler.command = ['chatgpt', 'ai'];
handler.register = true;

export default handler;
