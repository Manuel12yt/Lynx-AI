let handler = async (m, { conn, args, text }) => {
  let videoUrl = args[0]; // Get the TikTok video URL from the command

  if (!videoUrl) {
    return m.reply('❌ *Please provide a TikTok video URL.*');
  }

  try {
    const videoData = await tiktokdl(videoUrl); // Get the video details using tiktokdl

    if (videoData) {
      // Send the video to the user
      await conn.sendMessage(m.chat, { video: { url: videoData.videoUrl }, caption: videoData.title }, { quoted: m });
    } else {
      m.reply('❌ *Error retrieving video.*');
    }
  } catch (err) {
    console.error("Error in sending TikTok video:", err);
    m.reply('❌ *An error occurred while processing the video.*');
  }
};

handler.help = ['tiktok <url>'];
handler.tags = ['downloader'];
handler.command = /^(tiktokdl)$/i;
handler.limit = true;
handler.register = true;

export default handler;
