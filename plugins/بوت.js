let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let name = conn.getName(m.sender);
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0];
    let message = `*✿┇اهـلًا مـعـك بـوت مـيـزوهـارا للمـساعـدة اكــتب الـاوامـر او تـضيف البـوت اكتـب المـطور ┇✿*`;

    conn.sendFile(m.chat, 'https://telegra.ph/file/fcb03ca7c027822e545e2.jpg', 'image.jpg', message, m);
};

handler.customPrefix = /^(اوامر|بوت)$/i;
handler.command = new RegExp;

export default handler;
