import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    if (!data.message && !data.channel_post) return;

    const content = data.message || data.channel_post;
    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text;
    const userId = content.from ? content.from.id : null;

    // 1️⃣ --- كود الاشتراك الإجباري (للحسابات الخاصة) ---
    if (content.chat && content.chat.type === "private") {
        const channelUsername = "@DFD318"; 
        const botToken = "6379676688:AAFohKBLhQSYN9jdbZHKsZTkUEJvnxbbOnI";
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`);
            const checkData = await response.json();
            if (checkData.ok && (checkData.result.status === "left" || checkData.result.status === "kicked")) {
                const forceSubKeyboard = {
                    inline_keyboard: [[{ "text": "📢 اشترك بالقناة لتفعيل البوت", "url": "https://t.me/DFD318" }]]
                };
                await botApi.sendMessage(chatId, "⚠️ | عذراً عزيزي، يجب عليك الاشتراك في القناة الرسمية أولاً.\n\n👇 اشترك ثم ارسل /start", { reply_markup: forceSubKeyboard });
                return;
            }
        } catch (e) { console.log("Sub Error"); }
    }

    // 2️⃣ --- أوامر البوت (الردود النصية مع الأزرار) ---
    if (text === '/start' || text === '/start@' + botUsername) {
        const keyboard = {
            inline_keyboard: [
                [{ "text": "➕ اضافة الى قناة", "url": `https://t.me/${botUsername}?startchannel=true` },
                 { "text": "➕ اضافة الى مجموعة", "url": `https://t.me/${botUsername}?startgroup=true` }],
                [{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }],
                [{ "text": "⭐ حسابي الشخصي", "url": "https://t.me/mu_312" }]
            ]
        };
        await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from.first_name || 'بطل'), { reply_markup: keyboard });
    } 
    else if (text === '/id') {
        const msg = `👤 **بياناتك يا بطل:**\n\n• الاسم: ${content.from.first_name}\n• الايدي: \`${userId}\`\n• يوزرك: @${content.from.username || 'لا يوجد'}\n\n📢 @DFD318`;
        await botApi.sendMessage(chatId, msg, { parse_mode: "Markdown" });
    }
    else if (text === 'هلو') {
        await botApi.sendMessage(chatId, "هلوات عيوني، مقتدى يسلم عليك 🌹");
    }
    else if (text === '/status' && userId === 5794792675) {
        await botApi.sendMessage(chatId, "✅ البوت شغال ومية مية يا ابن الناصرية!");
    }
    
    // 3️⃣ --- نظام التفاعل التلقائي (إذا لم يكن هناك أمر) ---
    else {
        let threshold = 1 - (RandomLevel / 10);
        if (!RestrictedChats.includes(chatId)) {
            // التفاعل يشتغل بالكروبات والقنوات والحساب الخاص
            if (Math.random() <= threshold) {
                await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
            }
        }
    }
}
