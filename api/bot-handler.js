import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    if (!data.message && !data.channel_post) return;

    const content = data.message || data.channel_post;
    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text;
    const userId = content.from ? content.from.id : null;

    // 1. نظام الاشتراك الإجباري
    if (content.chat && content.chat.type === "private") {
        const channelUsername = "@DFD318"; 
        const botToken = "6379676688:AAFohKBLhQSYN9jdbZHKsZTkUEJvnxbbOnI";
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`);
            const checkData = await response.json();
            if (checkData.ok && (checkData.result.status === "left" || checkData.result.status === "kicked")) {
                await botApi.sendMessage(chatId, "⚠️ | اشترك بالقناة لتفعيل البوت:\n@DFD318");
                return;
            }
        } catch (e) { console.log("Sub Error"); }
    }

    // 2. أوامر الردود النصية
    if (text === '/start' || text === '/start@' + botUsername) {
        const keyboard = [[{ "text": "➕ اضافة", "url": `https://t.me/${botUsername}?startgroup=true` }]];
        await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from.first_name || 'بطل'), keyboard);
    } 
    else if (text === '/id') {
        await botApi.sendMessage(chatId, `👤 اسمك: ${content.from.first_name}\n🆔 ايديك: \`${userId}\``);
    }
    else if (text === 'هلو') {
        await botApi.sendMessage(chatId, "هلوات عيوني، مقتدى يسلم عليك 🌹");
    }
    else if (text === '/status' && userId === 5794792675) {
        await botApi.sendMessage(chatId, "✅ البوت شغال ومية مية بالناصرية!");
    }
    // 3. نظام التفاعلات التلقائي
    else {
        let threshold = 1 - (RandomLevel / 10);
        if (!RestrictedChats.includes(chatId)) {
            await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
        }
    }
}
