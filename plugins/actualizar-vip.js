import { execSync } from 'child_process';

var handler = async (m, { conn, text }) => {
  // Reacciona al mensaje
  m.react('🚀');

  try {
    // Ejecuta el comando git pull
    const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
    let messager = stdout.toString();

    // Mensajes personalizados según la salida
    if (messager.includes('Already up to date.')) {
      messager = '🌹 Ya estoy actualizada a la última versión.';
    } else if (messager.includes('Updating')) {
      messager = '🍒 Procesando, espere un momento mientras me actualizo.\n\n' + stdout.toString();
    }

    // Responde con el mensaje adecuado
    conn.reply(m.chat, messager, m);

  } catch {
    try {
      // Verifica si hay conflictos locales
      const status = execSync('git status --porcelain');

      if (status.length > 0) {
        const conflictedFiles = status
          .toString()
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            if (
              line.includes('.npm/') ||
              line.includes('.cache/') ||
              line.includes('tmp/') ||
              line.includes('LynxAISession/') ||
              line.includes('npm-debug.log')
            ) {
              return null; // Excluye archivos innecesarios
            }
            return '→ ' + line.slice(3); // Extrae el nombre del archivo
          })
          .filter(Boolean); // Elimina valores nulos

        if (conflictedFiles.length > 0) {
          const errorMessage = `💭 Se han hecho cambios locales que entran en conflicto con las actualizaciones del repositorio. Para actualizar, reinstala el bot o realiza las actualizaciones manualmente.\n\n✰ *ARCHIVOS EN CONFLICTO*\n\n${conflictedFiles.join('\n')}`;
          await conn.reply(m.chat, errorMessage, m,rcanal);
          return;
        }
      }
    } catch (error) {
      // Manejo de errores en conflictos o estado
      console.error(error);
      let errorMessage = '⚠ Ocurrió un error inesperado.';
      if (error.message) {
        errorMessage += '\n⚠ Mensaje de error: ' + error.message;
      }
      await conn.reply(m.chat, errorMessage, m);
    }
  }
};

// Configuración del handler
handler.help = ['actualizar'];
handler.tags = ['owner'];
handler.command = ['a'];
handler.rowner = true;

export default handler;
