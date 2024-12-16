async function tiktokdl(url) {
    try {
      let tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
      let response = await (await fetch(tikwm)).json();
  
      if (response.code === 0 && response.data) {
        let data = response.data;
  
        let filteredData = {
          title: data.title,
          cover: data.cover,
          origin_cover: data.origin_cover,
          music_title: data.music_info.title,
          music_author: data.music_info.author,
          play_count: data.play_count,
          digg_count: data.digg_count,
          comment_count: data.comment_count,
          share_count: data.share_count,
          download_count: data.download_count,
          create_time: data.create_time,
          author_nickname: data.author.nickname,
          play_url: data.play,
          wmplay_url: data.wmplay,
          hdplay_url: data.hdplay,
        };
  
        let videoResponse = await fetch(data.play);
        if (!videoResponse.ok) {
          return null;
        }
        let buffer = await videoResponse.buffer();
        return buffer;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  
  let handler = async (m, { conn, args }) => {
    let url = args[0];
  
    if (!url) {
      m.reply("❌ *Debes proporcionar la URL de un video de TikTok.*");
      return;
    }
  
    try {
      const videoBuffer = await tiktokdl(url);
  
      if (videoBuffer) {
        conn.sendFile(m.chat, videoBuffer, 'video.mp4',listo, m);
      } else {
        m.reply("❌ *No se pudo obtener el archivo MP4 del video.*");
      }
    } catch (err) {
      m.reply("❌ *Hubo un error al obtener el video.*");
    }
  };
  
  handler.help = ['tiktok <url>'];
  handler.tags = ['downloader'];
  handler.command = /^(tiktok)$/i;
  
  export default handler;
  
