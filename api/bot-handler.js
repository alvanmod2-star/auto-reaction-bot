import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    let chatId, message_id, text;

    if (data.message || data.channel_post) {
        const content = data.message || data.channel_post;
        chatId = content.chat.id;
        message_id = content.message_id;
        text = content.text;

        // --- كود الاشتراك الإجباري ---
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
            } catch (e) { console.log("Error in Force Sub"); }
        }

        // --- الأوامر ---
        if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
            const keyboard = [[{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }]];
            await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from.first_name || 'حياتي'), keyboard);
        } else if (data.message && text === '/reactions') {
            await botApi.sendMessage(chatId, "✅ تم تفعيل وضع الرشق (20 تفاعل) للقنوات!");
        } else {
            // --- كود الرشق (هنا التصليح) ---
            if (!RestrictedChats.includes(chatId)) {
                if (data.channel_post) {
                    // رشق 20 تفاعل للمنشورات الجديدة بالقناة
                    const rashqList = ['👍', '❤️', '🔥', '🥰', '👏', '🤩', '🤔', '🤯', '😱', '⚡️', '🍓', '🎉', '😎', '😍', '🕊', '🤡', '💯', '🤣', '🌚', '❤️‍🔥'];
                    for (const emoji of rashqList) {
                        try {
                            await botApi.setMessageReaction(chatId, message_id, emoji);
                            await new Promise(r => setTimeout(r, 150));
                        } catch (e) { continue; }
                    }
                } else if (data.message) {
                    // تفاعل واحد عشوائي للمجموعات
                    await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                }
            }
        }
    }
}
