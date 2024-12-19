const handler = async (m, { conn }) => {
    m.reply(m.chat, `${global.text}`, m, fake);
};

handler.command = /^(tenerbot2)$/i;
handler.tags = ['serbot'];
handler.help = ['tenerbot2 *<el bot para tu grupo>*'];

export default handler;
