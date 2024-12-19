import { execSync, spawn } from 'child_process';

let handler = async (m, { conn, text }) => {
    m.react(done);
    
    if (conn.user.jid == conn.user.jid) {
        try {
            let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
            conn.reply(m.chat, stdout.toString(), m, fake, rcanal);
            
            conn.reply(m.chat, 'Actualización completada. Reiniciando el bot...', m, fake, rcanal);
            
            spawn(process.argv[0], process.argv.slice(1), {
                cwd: process.cwd(),
                detached: true,
                stdio: 'inherit'
            });
            
            process.exit(0);

        } catch (error) {
            conn.reply(m.chat, 'Hubo un error al actualizar el bot: ' + error.message, m, fake, rcanal);
        }
    }
};

handler.help = ['reset'];
handler.tags = ['owner'];
handler.command = ['reset'];
handler.rowner = true;

export default handler;
