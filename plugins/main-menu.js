import fs, { promises } from 'fs'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
try {
let d = new Date(new Date + 3600000)
let locale = 'es'
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length 
let more = String.fromCharCode(8206)
let readMore = more.repeat(850)   
let taguser = conn.getName(m.sender)
let user = global.db.data.users[m.sender]
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let menu = `*◈ ${user.registered === true ? user.name : `👉 ${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'verificar nombre.edad' : 'verify name.age'}`} ◈*
*˚₊·˚₊· ͟͟͞͞➳❥ @${m.sender.split("@")[0]}*
*˚₊·˚₊· ͟͟͞͞➳❥* ${packname}${conn.user.jid == global.conn.user.jid ? '' : `\n*˚₊·˚₊· ͟͟͞͞➳❥* 𝗦𝗨𝗕 𝗕𝗢𝗧 ⇢ *@${global.conn.user.jid.split`@`[0]}*`}
*☆═━┈◈ ╰ ${vs} ㎇ ╯ ◈┈━═☆*
*│* 
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal1()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ 
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙ 
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal2()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'serbot' : 'jadibot'}_
*│* ┊▸ ✦ ${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'bots' : 'subsbots'}_
*│* ┊▸ ✦ ${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pausarsb' : 'pausesb'}_
*│* ┊▸ ✦ ${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'eliminarsesion' : 'delsession'}_
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙  
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal3()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}tiktoksearch
*│* ┊▸ ✦ ${usedPrefix}yts
*│* ┊▸ ✦ ${usedPrefix}pinterest
*│* ┊▸ ✦ ${usedPrefix}pelisplus
*│* ┊▸ ✦ ${usedPrefix}xvideosearch
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙  
*│*
*╰ ㊂ ▸▸ _HERRAMIENTAS_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙  
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal4()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}play
*│* ┊▸ ✦ ${usedPrefix}play2
*│* ┊▸ ✦ ${usedPrefix}ytmp3
*│* ┊▸ ✦ ${usedPrefix}ytmp4
*│* ┊▸ ✦ ${usedPrefix}ytmp3doc
*│* ┊▸ ✦ ${usedPrefix}ytmp4doc
*│* ┊▸ ✦ ${usedPrefix}tiktok
*│* ┊▸ ✦ ${usedPrefix}spotify
*│* ┊▸ ✦ ${usedPrefix}facebook
*│* ┊▸ ✦ ${usedPrefix}instagram
*│* ┊▸ ✦ ${usedPrefix}gitclone
*│* ┊▸ ✦ ${usedPrefix}like
*│* ┊▸ ✦ ${usedPrefix}mediadire
*│* ┊▸ ✦ ${usedPrefix}terabox
*│* ┊▸ ✦ ${usedPrefix}soundclound
*│* ┊▸ ✦ ${usedPrefix}tiktokmp3
*│* ┊▸ ✦ ${usedPrefix}twitter
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙ 
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal5()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙ 
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal6()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙ 
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal7()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙ 
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal8()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙ 
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal9()}_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}bass_
*│* ┊▸ ✦ ${usedPrefix}blown_
*│* ┊▸ ✦ ${usedPrefix}deep_
*│* ┊▸ ✦ ${usedPrefix}earrape_
*│* ┊▸ ✦ ${usedPrefix}fast_
*│* ┊▸ ✦ ${usedPrefix}fat_
*│* ┊▸ ✦ ${usedPrefix}nightcore_
*│* ┊▸ ✦ ${usedPrefix}reverse_
*│* ┊▸ ✦ ${usedPrefix}robot_
*│* ┊▸ ✦ ${usedPrefix}slow_
*│* ┊▸ ✦ ${usedPrefix}smooth_
*│* ┊▸ ✦ ${usedPrefix}tupai_
*│* ┊▸ ✦ ${usedPrefix}audio8d_
*│* ┊▸ ✦ ${usedPrefix}echo_
*│* ┊▸ ✦ ${usedPrefix}distortion_
*│* ┊▸ ✦ ${usedPrefix}pitch_
*│* ┊▸ ✦ ${usedPrefix}reverb_
*│* ┊▸ ✦ ${usedPrefix}flanger_
*│* ┊▸ ✦ ${usedPrefix}apulsator_
*│* ┊▸ ✦ ${usedPrefix}tremolo_
*│* ┊▸ ✦ ${usedPrefix}chorus_
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal10()}_ ◂◂*
*│* ┊ 
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal11()}_ ◂◂*
*│* ┊ 
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
*│*
*╰ ㊂ ▸▸ _PARA CANALES_ ◂◂*
*│* ┊
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ┊▸ ✦ ${usedPrefix}
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
*│*
*╰ ㊂ ▸▸ _${lenguajeGB.smsMenuTotal12()}_ ◂◂*
*│* ┊ 
*│* ┊▸ ✦ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'respaldo' : 'backup'}_
*│* ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
 `.trim()
    
const vi = [
'https://i.ibb.co/Y7mhFdf/file.jpg',
'https://i.ibb.co/Y7mhFdf/file.jpg',
'https://i.ibb.co/Y7mhFdf/file.jpg'
]
try {
await conn.sendMessage(m.chat, { video: { url: vi.getRandom() }, gifPlayback: true, caption: menu, contextInfo: fakeChannel2 })
} catch (error) {
try {
await conn.sendMessage(m.chat, { image: { url: gataMenu.getRandom() }, gifPlayback: false, caption: menu, mentions: [m.sender, global.conn.user.jid] }, { quoted: fkontak }) 
} catch (error) {
try {
await conn.sendMessage(m.chat, { image: gataImg.getRandom(), gifPlayback: false, caption: menu, mentions: [m.sender, global.conn.user.jid] }, { quoted: fkontak }) 
} catch (error) {
try{
await conn.sendFile(m.chat, imagen5, 'menu.jpg', menu, fkontak, false, { mentions: [m.sender, global.conn.user.jid] })
} catch (error) {
return 
}}}} 
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}}

handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|menucompleto|allmenu|allm|m|\?)$/i
export default handler

function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
