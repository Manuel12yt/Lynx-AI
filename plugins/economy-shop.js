
const xpperyenes = 350;
const handler = async (m, {conn, command, args}) => {
  let count = command.replace(/^buy/i, '');
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xpperyenes) : parseInt(count) : args[0] ? parseInt(args[0]) : 1;
  count = Math.max(1, count);
  if (global.db.data.users[m.sender].exp >= xpperyenes * count) {
    global.db.data.users[m.sender].exp -= xpperyenes * count;
    global.db.data.users[m.sender].yenes += count;
    conn.reply(m.chat, `
╔═══════⩽✰⩾═══════╗
║    𝐍𝐨𝐭𝐚 𝐃𝐞 𝐏𝐚𝐠𝐨 
╠═══════⩽✰⩾═══════╝
║╭──────────────┄
║│ *Compra Nominal* : + ${count} 💴
║│ *Gastado* : -${xpperyenes * count} XP
║╰──────────────┄
╚═══════⩽✰⩾═══════╝`, m, rcanal);
  } else conn.reply(m.chat, `😔 Lo siento, no tienes suficiente *XP* para comprar *${count}* Yenes 💴`, m, rcanal);
};
handler.help = ['Buy', 'Buyall'];
handler.tags = ['economy'];
handler.register = true
handler.command = ['buy', 'buyall'];

handler.disabled = false;

export default handler;
