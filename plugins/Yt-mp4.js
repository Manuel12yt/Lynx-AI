// *[ ❀ YTMP4 ]*
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❀ Ingresa un link de YouTube válido`, m,rcanal);

  await m.react('🕓');

  try {
    let api = await (await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${text}`)).json();
    let dl_url = api.data.dl;
    await conn.sendMessage(m.chat, { video: { url: dl_url }, caption: `*Aqui tiene ฅ^•ﻌ•^ฅ*` },{ quoted: m });

    await m.react('✅');
  } catch (error) {
    await m.react('❌');
  }
};

handler.help = ['ytmp4 *<url>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp4'];
handler.register = true;

export default handler;
