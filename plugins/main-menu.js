import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import { xpRange } from '../lib/levelling.js'
let Styles = (text, style = 1) => {
  var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  var yStr = Object.freeze({
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
  });
  var replacer = [];
  xStr.map((v, i) => replacer.push({
    original: v,
    convert: yStr[style].split('')[i]
  }));
  var str = text.toLowerCase().split('');
  var output = [];
  str.map(v => {
    const find = replacer.find(x => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join('');
};
let tags = {
  'main': 'Principal',
  'start': 'Start',
  'dl': 'Descargas',
  'search': 'Busqueda',
  'rpg': 'rpg juegos',
  'fun': 'Funny',
  'sticker': 'ꜱᴛɪᴄᴋᴇʀ',
  'ai': 'Funciones ai',
  'tools': 'Herramientas',
  'group': 'Grupo',
  'owner': 'Owner',
  'enable': 'On/Off',
  'audio': 'Covertidores',
};
const defaultMenu = {
  before: `*\`һ᥆ᥣᥲ\`* *%name* *\`s᥆ᥡ ᥣᥡᥒ᥊ - ᥲі 𝗍ᥙ ᥲsіs𝗍ᥱᥒ𝗍ᥱ ᥎іr𝗍ᥙᥲᥣ ᥴrᥱᥲძ᥆ ⍴᥆r ძᥲrkᥴ᥆rᥱ , ᥱs𝗍ᥱ ᥱs ᥱᥣ mᥱᥒᥙ ᥴ᥆m⍴ᥣᥱ𝗍᥆ ძᥱ ᥣᥲs 𝖿ᥙᥒᥴі᥆ᥒᥱs 𝗊ᥙᥱ ⍴ᥙᥱძ᥆ һᥲᥴᥱr. ˙˚ʚ₍ ᐢ. ̫ .ᐢ ₎ɞ˚\`*

 ▧ *\`INFO USUARIO\`*
 │ » *Cliente:* %name
 │ » *Monedas:* %Monedas 🪙 
 │ » *Nivel:* %level
 │ » *Xp:* %exp / %maxexp
 │ » *TotalXp:* %totalexp
 └───···
 
 ▧ *\`INFO BOT\`*
 │ » *Modo:* %mode
 │ » *Prefijo:* [ *%_p* ]
 │ » *Rutina:* %muptime
 │ » *Database:*  %totalreg
 └───···
 
🍁 ᥣ і s 𝗍 ᥲ  ძ ᥱ  ᥴ ᥆ m ᥲ ᥒ ძ ᥆ s 🍁

`.trimStart(),
  header: '─₍🌩️₎❝┊ *%category* ┊❜❜ ˚ ͙۪۪̥◌',
  body: `┊꒱ 🍁   %cmd %islimit %isPremium`,
  footer: '╰─── –',
  after: `> ʟʏɴx ᴀɪ - ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴀʀᴋᴄᴏʀᴇ`,
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let tag = `@${m.sender.split("@")[0]}`
    let mode = global.opts["self"] ? "Privado" : "Publico"
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}

    let { age, exp, Monedas, level, role, money } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let ucpn = `${ucapan()}`
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let muptime
    if (process.send) {
      process.send('uptime')
      muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let uptime = clockString(process.uptime() * 1000); // Calcula el tiempo de actividad del bot en horas:minutos:segundos
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        Monedas: plugin.Monedas,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : ``) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%_p' + help)
                .replace(/%islimit/g, menu.limit ? '◜⭐◞' : '')
                .replace(/%isMonedas/g, menu.Monedas ? '◜🪙◞' : '')
                .replace(/%isPremium/g, menu.premium ? '◜🪪◞' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')

    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      "%": "%",
      p: uptime, 
      muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : "[unknown github url]",
      mode,
      _p,
      tag,
      name,
      level,
      name,
      totalreg,
      cmd: m.command,
      ucpn, mode, _p, money, age, tag, name, level, Monedas, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    };
    

    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    let images = [
      'https://i.ibb.co/Y7mhFdf/file.jpg',
    ];

    await m.react('🍁');

    for (let i = 0; i < images.length; i++) {
      await conn.sendFile(m.chat, images[i], `image${i + 1}.jpg`, text.trim(), m, rcanal);
    }

  } catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m)
  }
}

handler.command = ['allmenu', 'help', 'Help', 'Menu', 'menucompleto', 'menúcompleto', 'menú', 'menu']
handler.register = true
export default handler


const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

var ase = new Date();
var hour = ase.getHours();
switch (hour) {
  case 0: hour = 'una linda noche 🌙'; break;
  case 1: hour = 'una linda noche 💤'; break;
  case 2: hour = 'una linda noche 🦉'; break;
  case 3: hour = 'una linda mañana ✨'; break;
  case 4: hour = 'una linda mañana 💫'; break;
  case 5: hour = 'una linda mañana 🌅'; break;
  case 6: hour = 'una linda mañana 🌄'; break;
  case 7: hour = 'una linda mañana 🌅'; break;
  case 8: hour = 'una linda mañana 💫'; break;
  case 9: hour = 'una linda mañana ✨'; break;
  case 10: hour = 'un lindo dia 🌞'; break;
  case 11: hour = 'un lindo dia 🌨'; break;
  case 12: hour = 'un lindo dia ❄'; break;
  case 13: hour = 'un lindo dia 🌤'; break;
  case 14: hour = 'una linda tarde 🌇'; break;
  case 15: hour = 'una linda tarde 🥀'; break;
  case 16: hour = 'una linda tarde 🌹'; break;
  case 17: hour = 'una linda tarde 🌆'; break;
  case 18: hour = 'una linda noche 🌙'; break;
  case 19: hour = 'una linda noche 🌃'; break;
  case 20: hour = 'una linda noche 🌌'; break;
  case 21: hour = 'una linda noche 🌃'; break;
  case 22: hour = 'una linda noche 🌙'; break;
  case 23: hour = 'una linda noche 🌃'; break;
}
var greeting = "espero que tengas " + hour;

function ucapan() {
  const time = moment.tz('America/Lima').format('HH')
  let res = "Buenas Noches🌙"
  if (time >= 5) {
    res = "Buena Madrugada🌄"
  }
  if (time > 10) {
    res = "Buenos días☀️"
  }
  if (time >= 12) {
    res = "Buenas Tardes🌅"
  }
  if (time >= 19) {
    res = "Buenas Noches🌙"
  }
  return res
}
