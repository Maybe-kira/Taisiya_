import mongoose from "mongoose";

const uri = "mongodb+srv://username:password@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB")).catch(err => console.error("Error connecting to MongoDB:", err));

const madaraSchema = new mongoose.Schema({
    groupId: String,
    userId: String,
    madara: String,
    messageCount: { type: Number, default: 0 } // عدد الرسائل
});

const Madara = mongoose.model("Madara", madaraSchema);

let handler = async function (msg, { conn: _, text, command, isAdmin }) {
    try {
        if (command === "الألقاب") {
            if (!msg.isGroup) {
                msg.reply("*⌘¦هـذا الأمـر لـلـمـجـمـوعـات فـقـط¦❌|*");
                return;
            }
            if (!isAdmin) {
                msg.reply("*⌘¦هـذا الأمـر لـلـمـشـرفـيـن فـقـط¦❌|*");
                return;
            }
            const data = await Madara.find({ groupId: msg.chat });
            if (data.length === 0) {
                msg.reply("*⌘¦لا يـوجـد الـقـاب مـسـجـلـة بـعـد¦🎯|*");
            } else {
                let list = "";
                data.forEach((item, index) => {
                    list += `${index + 1} - ${item.madara}\n`;
                });
                msg.reply(`*⌘¦عـدد الـمـسـجـلـيـن ${data.length}¦🧭|*\n *☾اسـتـخـدم .لقب وجـنـبـه الـلـقب الي تبي تشيك عليه☽*\n\n*⌘¦الألـقـاب الـمـسـجـلـة:*\n\n${list}`);
            }
        } else if (command === "تسجيل") {
            if (!msg.isGroup) {
                msg.reply("*⌘¦هـذا الأمـر لـلـمـجـمـوعـات فـقـط¦🧭|*");
                return;
            }
            if (!isAdmin) {
                msg.reply("*⌘¦هـذا الأمـر لـلـمـشـرفـيـن فـقـط¦🧭|*");
                return;
            }
            if (!msg.mentionedJid || !text || text.trim() === "") {
                msg.reply(`*❒═════﹝🧭﹞═════❒*
*⌘¦اسـتـخـدام خـاطـئ¦❌|*
*☾حـط الامـر مـع مـنـشـن شـخـص مـع الـلـقب☽*
*⌘¦مـثـال ↞.تسجيل @العضو كيرا*
*❒═════﹝🧭﹞═════❒*
*¦𝑃𝐴𝑇𝐶𝐻𝐸𝑅𝐴ـ𝐵𝛩𝑇☊¦*`);
                return;
            }

            const mentionedUser = msg.mentionedJid[0].replace("@s.whatsapp.net", "");
            const nicknames = text.trim().split(" ").slice(1).filter(item => item.trim() !== "");
            const nickname = nicknames.join(" ");
            if (!/\S/.test(nickname)) {
                msg.reply(`*❐═━━━═╊⊰🧭⊱╉═━━━═❐*
*⌘¦اسـتـخـدام خـاطـئ¦❌|*
*☾حـط الامـر مـع مـنـشـن شـخـص مـع الـلـقب☽*
*⌘¦مـثـال ↞.تسجيل @العضو كيرا*
*❒═════﹝🧭﹞═════❒*
*¦𝑃𝐴𝑇𝐶𝐻𝐸𝑅𝐴ـ𝐵𝛩𝑇☊¦*`);
                return;
            }

            const existingNickname = await Madara.findOne({
                madara: nickname,
                groupId: msg.chat
            });
            if (existingNickname) {
                const takenBy = await _.getName(existingNickname.userId + "@s.whatsapp.net");
                msg.reply(`*⌘¦الـلـقـب* ${nickname} *مأخوذ بواسطة :* ${takenBy}`);
            } else {
                await Madara.findOneAndUpdate(
                    { userId: mentionedUser, groupId: msg.chat },
                    { madara: nickname },
                    { upsert: true, new: true }
                );
                msg.reply(`*⌘¦تـم تسجيله بلقب* ${nickname} *بـنـجـاح ✅*`);
            }
        } else if (command === "حذف_لقب") {
            if (!msg.isGroup) {
                msg.reply("*⌘¦هـذا الأمـر لـلـمـجـمـوعـات فـقـط¦🧭|*");
                return;
            }
            if (!isAdmin) {
                msg.reply("*⌘¦هـذا الأمـر لـلـمـشـرفـيـن فـقـط¦❌|*");
                return;
            }
            if (!text || text.trim() === "") {
                msg.reply("*⌘¦يـجـب كـتـابـة اسـم الـلـقـب جـنـب الأمـر لـحـذفـه¦🧭|*");
                return;
            }
            const nicknameToDelete = text.trim();
            const deletedResult = await Madara.deleteOne({
                madara: nicknameToDelete,
                groupId: msg.chat
            });
            if (deletedResult.deletedCount > 0) {
                msg.reply(`*⌘¦تـم حـذف لـقـب* ${nicknameToDelete} *بـنـجـاح ✅*`);
            } else {
                msg.reply(`*⌘¦الـلـقـب* ${nicknameToDelete} *ماهو مأخوذ أصـلاً*`);
            }
        } else if (command === "لقبي") {
            try {
                const senderId = msg.sender.split("@")[0];
                const userNickname = await Madara.findOne({
                    userId: senderId,
                    groupId: msg.chat
                });
                if (userNickname && userNickname.madara) {
                    msg.reply(`*⌘¦لـقـبـك هـو :* ${userNickname.madara}`);
                } else {
                    msg.reply("*⌘¦لـم يـتـم تـسـجـيـلـك أصـلاً*");
                }
            } catch (error) {
                console.error("Error fetching user's nickname:", error);
                msg.reply("*⌘¦عـذرا. هـنـاك خـطـئ¦🧭|❌*");
            }
        } else if (command === "لقبه" && msg.mentionedJid) {
            if (!msg.mentionedJid || msg.mentionedJid.length === 0) {
                msg.reply("*⌘¦يـجـب كـتـابـة الأمـر وجـنـبـه مـنـشـن الـشـخـص الـمُـراد مـعـرفـة لـقـبـه¦🧭|*");
                return;
            }
            const userToCheck = msg.mentionedJid[0].replace("@s.whatsapp.net", "");
            const userNickname = await Madara.findOne({
                userId: userToCheck,
                groupId: msg.chat
            });
            if (userNickname) {
                msg.reply(`*⌘¦لـقـبـه هـو :* ${userNickname.madara}`);
            } else {
                msg.reply("*⌘¦لـم يـتـم تـسـجـيـلـه أصـلاً*");
            }
        } else if (command === "لقب") {
            if (!text || text.trim() === "") {
                msg.reply("*⌘¦يـجـب كـتـابـة الأمـر وجـنـبـه الـلـقـب لـمـعـرفـة اذا كـان أحـدٌ قـد أخـذهُ أو لا¦🧭|*”);
                return;
            }
            const nicknameToCheck = text.trim();
            const nicknameData = await madara.findOne({
                madara: nicknameToCheck,
                groupId: msg.chat
            });
            if (nicknameData) {
                const userTakingTheNickname = await _.getName(nicknameData.userId.split("@")[0]);
                msg.reply("*⌘¦الـلـقـب* " + nicknameToCheck + " *مـأخـوذ مـن:* " + userTakingTheNickname);
            } else {
                msg.reply("*⌘¦الـلـقـب* " + nicknameToCheck + " *مـتـوفـر*");
            }
        } else {}
    } catch (err) {
        console.error("خطأ", err);
    }
};
handler.command = ["الألقاب", "تسجيل", "لقبي", "لقبه", "حذف_لقب", "لقب"];
handler.tags = ["patchera"];
export default handler;
