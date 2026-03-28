import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text || "";

    // --- 1. كود الاشتراك الإجباري لقناتك ---
    if (content.chat && content.chat.type === "private") {
        const channelUsername = "@DFD318";
        const botToken = "6939721323:AAG9eDCNgz3Kct9APMRfrZUCDDSJfKbu8tc";
        try {
            const userId = content.from.id;
            const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`);
            const checkData = await response.json();
            if (checkData.ok && (checkData.result.status === "left" || checkData.result.status === "kicked")) {
                const keyboard = [[{ "text": "📢 اضغط هنا للاشتراك بالقناة", "url": "https://t.me/DFD318" }]];
                await botApi.sendMessage(chatId, "⚠️ | عذراً مقتدى، اشترك بالقناة أولاً ثم ارسل /start", keyboard);
                return;
            }
        } catch (e) { console.log("Error Force Sub"); }
    }

    // --- 2. الأوامر الأساسية ---
    if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
        const keyboard = [
            [{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }],
            [{ "text": "⭐ حسابي الشخصي", "url": "https://t.me/mu_312" }]
        ];
        await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from?.first_name || 'حياتي'), keyboard);
        return;
    }

    // --- 3. التفاعل الطبيعي (تفاعل واحد فقط) ---
    if (!RestrictedChats.includes(chatId)) {
        try {
            // يختار إيموجي واحد عشوائي وينزله
            await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
        } catch (e) {
            console.log("Error sending reaction");
        }
    }
}
