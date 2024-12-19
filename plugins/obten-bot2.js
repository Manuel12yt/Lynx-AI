const handler = async (m, { conn }) => {
    m.reply(m.chat, `${global.text}`, m, fake);
};

global.text = `*¿QUIERES A LynxAI EN TU GRUPO?* 🔥

!! *¡Sencillo!, lo único que pedimos :*!! 🙂‍↔️

Haz que 10 amigos o conocidos sigan el canal. Una vez que lo hagan, envíame una captura de pantalla de que ya siguen el canal y reenvíame la captura junto con el link de tus grupos donde quieras que el bot se agregue 🎁

*Envia las capturas a este número:* +51968382008.

*Si no te responden en ese número, únete al siguiente grupo:* https://chat.whatsapp.com/HXJWm03iLG19F89PPWE7mO

*Link de canal que deben seguir:* 👇

https://whatsapp.com/channel/
`;

handler.command = /^(tenerbot2)$/i;
handler.tags = ['serbot'];
handler.help = ['tenerbot2 *<el bot para tu grupo>*'];

export default handler;
