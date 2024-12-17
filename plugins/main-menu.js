import { promises } from 'fs';
import { join } from 'path';
import { xpRange } from '../lib/levelling.js';

const tags = {
  'img': '`🐉 imagenes 🐉`',
  'downloader': '`🎭 Descargas🎭`',
  'user': '`🤖 Usuario🤖`',
  'group': '`😼 Grupo😼`',
  'owner': '`👑 Creador 👑`',
  'enable': '`🔗 enable 🔗`',
  'rpg': '`🥷 juegos rpg 🥷`',
};

const defaultMenu = {
  before: `> 「 ${textbot} あ⁩ 」\n
╔──────¤◎¤──────╗
┋#     ✧ *Dark Bot - Ai ‹‹❑ౄ*
╚──────¤◎¤──────╝
╭━─━─━─≪𖣘≫─━─━─━╮
┃✰ ➬ *Usuario:* %name
┃✰ ➬ *Estrellas:* %limit
┃✰ ➬ *Nivel:* %level [ %xp4levelup Xp Para Subir De Nivel]
┃✰ ➬ *Xp:* %exp / %maxexp
┃✰ ➬ *TotalXp:* %totalexp
╰━─━─━─≪𖣘≫─━─━─━╯
╔──────¤◎¤──────╗
┋#    ✦   *𝐈 N F O  ‹‹❑ౄ*
╚──────¤◎¤──────╝
╭━─━─━─≪𖣘≫─━─━─━╮
┃✰ ➬ *Modo:* %mode
┃✰ ➬ *Prefijo:* [ *%_p* ]
┃✰ ➬ *Rutina:* %muptime 
┃✰ ➬ *Database:*  %totalreg
╰━─━─━─≪𖣘≫─━─━─━╯
   ⏤͟͟͞͞★Dark-Aiꗄ➺
◆━━━━━━━▣✦▣━━━━━━━━◆ 
%readmore
`.trimStart(),
  header: '╭─────⊹⊱≼「 *%category* 」≽⊰──────',
  body: '┃❯ ✧▻ %cmd %islimit %isPremium\n',
  footer: '╰─── ──⊹⊱≼≽⊰⊹══───═══╯',
  after: `© ${textbot}`,
};

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let tag = `@${m.sender.split("@")[0]}`;
    let mode = global.opts["self"] ? "Privado" : "Publico";
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {};
    let { exp, limit, level } = global.db.data.users[m.sender];
    let { min, xp, max } = xpRange(level, global.multiplier);
    let name = await conn.getName(m.sender);
    let d = new Date(new Date + 3600000);
    let locale = 'es';
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    let _uptime = process.uptime() * 1000;
    let muptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      };
    });

    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag;

    conn.menu = conn.menu ? conn.menu : {};
    let before = conn.menu.before || defaultMenu.before;
    let header = conn.menu.header || defaultMenu.header;
    let body = conn.menu.body || defaultMenu.body;
    let footer = conn.menu.footer || defaultMenu.footer;
    let after = conn.menu.after || defaultMenu.after;

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '◜⭐◞' : '')
                .replace(/%isPremium/g, menu.premium ? '◜🪪◞' : '')
                .trim();
            }).join('\n');
          }),
          footer
        ].join('\n');
      }),
      after
    ].join('\n');

    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : '';
    let replace = {
      "%": "%",
      p: _p,
      uptime: muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage || "[unknown github url]",
      mode,
      tag,
      name,
      level,
      limit,
      totalreg,
      readmore: readMore,
    };
    text = text.replace(new RegExp(`%(${Object.keys(replace).join('|')})`, 'g'), (_, name) => '' + replace[name]);

    await m.react('🌟');
    await conn.sendFile(m.chat, imagen1, 'thumbnail.jpg', text.trim(), m);

  } catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m);
    throw e;
  }
};

handler.command = ['allmenu', 'menucompleto', 'menúcompleto', 'menú', 'menu'];
handler.register = false;
export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
