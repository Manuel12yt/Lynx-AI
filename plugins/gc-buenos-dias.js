import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    // React con un emoji al mensaje
    m.react('🌞');

    // Lista de mensajes
    const messages = [
        "*¡Buenos días! 💛 Espero que tu día esté lleno de alegría y oportunidades brillantes.*\n> ",
        "*¡Buenos días! ☀️ Que este nuevo día te traiga sonrisas y momentos inolvidables.*\n> ",
        "*¡Buenos días! 🌟 Espero que hoy encuentres belleza en cada pequeño detalle.*\n> ",
        "*¡Buenos días! ✨ Que este día esté lleno de inspiración y que cada paso te acerque a tus sueños.*\n> ",
        "*¡Buenos días! 🌷 Espero que hoy sea un día lleno de luz y amor.*\n> ",
        "*¡Buenos días! 👑 Que el día de hoy esté lleno de alegría y oportunidades para crecer.*\n> "
    ];

    // Seleccionar un mensaje aleatorio
    let randomMessage = messages[Math.floor(Math.random() * messages.length)];

    if (m.isGroup) {
        let videos = [
            'https://files.catbox.moe/h5yort.mp4',             
            'https://files.catbox.moe/yxhxlr.gif',             
            'https://files.catbox.moe/auwqb2.gif',
            'https://files.catbox.moe/lmg19k.gif',
            'https://files.catbox.moe/9kquev.gif',
            'https://files.catbox.moe/uizfay.gif',
            'https://files.catbox.moe/n4zegz.mp4',
            'https://qu.ax/iioMV.mp4',
            'https://qu.ax/JgSvx.mp4',
            'https://qu.ax/dvrKi.mp4',
            'https://qu.ax/TZuhK.mp4'
        ];

        // Seleccionar un video aleatorio
        const video = videos[Math.floor(Math.random() * videos.length)];

        // Envía el video y el mensaje correspondiente
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, rcanal, fake, caption: randomMessage }, { quoted: m });
    }
}

handler.help = ['dias/days'];
handler.tags = ['group'];
handler.command = ['dias','días','dia','día','days'];
handler.group = true;

export default handler;