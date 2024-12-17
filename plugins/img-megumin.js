import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
await m.react('🕓')
try {
let res = await fetch('https://api.waifu.pics/sfw/megumin')
if (!res.ok) return
let json = await res.json()
if (!json.url) return
await conn.sendFile(m.chat, json.url, 'thumbnail.jpg', listo, m)
await m.react('✅')
} catch {
await m.react('✖️')
}}
handler.help = ['megumin']
handler.tags = ['img']
handler.command = ['megumin']
//handler.limit = 1
handler.register = true 

export default handler
