let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let name = conn.getName(m.sender);
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0];
    let message = `*✿┇ الامـر غـلـط سـوي نـقطـة وبـدون فـواصـل ┇✿*`;

    conn.sendFile(m.chat, 'https://telegra.ph/file/fcb03ca7c027822e545e2.jpg', 'image.jpg', message, m);
};

handler.customPrefix = /^(ميزو 2|ميزو 1|ميزو)$/i;
handler.command = new RegExp;

export default handler;
