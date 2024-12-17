let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    const user = global.db?.data?.users?.[m.sender] || {};
    const { exp = 0, limit = 0, level = 0 } = user;
    const { min, xp, max } = xpRange(level, global.multiplier || 1);

    const name = await conn.getName(m.sender);
    const d = new Date();
    const locale = 'es';
    const _uptime = process.uptime() * 1000;
    const muptime = clockString(_uptime);
    const totalreg = Object.keys(global.db?.data?.users || {}).length;
    const mode = global.opts?.['self'] ? 'Privado' : 'Público';

    const help = Object.values(global.plugins || {}).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
    }));

    const menu = [
      defaultMenu.before,
      ...Object.keys(tags).map(tag => {
        const cmds = help.filter(menu => menu.tags.includes(tag) && menu.help).map(menu => {
          return menu.help.map(cmd => {
            return defaultMenu.body
              .replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)
              .replace(/%islimit/g, menu.limit ? '◜⭐◞' : '')
              .replace(/%isPremium/g, menu.premium ? '◜🪪◞' : '');
          }).join('\n');
        }).join('\n');

        return `${defaultMenu.header.replace(/%category/g, tags[tag])}\n${cmds}\n${defaultMenu.footer}`;
      }),
      defaultMenu.after,
    ].join('\n');

    const replace = {
      '%': '%',
      p: _p,
      uptime: muptime,
      name,
      level,
      limit,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      totalreg,
      mode,
      readmore: readMore,
    };

    const text = menu.replace(new RegExp(`%(${Object.keys(replace).join('|')})`, 'g'), (_, key) => replace[key] || '');

    // Enviar solo texto del menú
    await conn.reply(m.chat, text.trim(), m);
  } catch (e) {
    console.error('Error al generar el menú:', e);
    await conn.reply(m.chat, '❎ Lo sentimos, ocurrió un error al generar el menú.', m);
  }
};
