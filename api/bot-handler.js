/*!
 * © [2026] Malith-Rukshan. All rights reserved.
 * Edited for Muqtada - 20 Reactions Mode
 */

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
                    const forceSubKeyboard = [[{ "text": "📢 اضغط هنا للاشتراك بالقناة", "url": "https://t.me/DFD318" }]];
                    await botApi.sendMessage(chatId, "⚠️ | عذراً مقتدى، يجب الاشتراك بالقناة أولاً.\n\n👇 اشترك ثم ارسل /start", forceSubKeyboard);
                    return;
                }
            } catch (error) { console.log("خطأ اشتراك"); }
        }

        // --- الأوامر /start و /reactions ---
        if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
            const keyboard = [
                [{ "text": "➕ اضافة الى قناة ➕", "url": "https://t.me/Baugauhabot?startchannel=true" }],
                [{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }],
                [{ "text": "⭐ حسابي الشخصي", "url": "https://t.me/mu_312" }]
            ];
            await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from.first_name || 'حياتي'), keyboard);
            
        } else if (data.message && text === '/reactions') {
            await botApi.sendMessage(chatId, "✅ تم تفعيل وضع الـ 20 تفاعل المتفجر!");
        } else {
            // ==========================================
            // --- كود تفجير الـ 20 تفاعل الجديد ---
            // ==========================================
            if (!RestrictedChats.includes(chatId)) {
                // قائمة الـ 20 تفاعل اللي طلبتهن يا مقتدى
                const fireReactions = [
                    '👍', '❤️', '🔥', '🥰', '👏', '🤩', '🤔', '🤯', 
                    '😱', '⚡️', '🍓', '🎉', '😎', '😍', '🕊', '🤡', 
                    '💯', '🤣', '🌚', '❤️‍🔥'
                ];

                // تنفيذ التفاعلات واحد ورا الثاني
                for (const emoji of fireReactions) {
                    try {
                        await botApi.setMessageReaction(chatId, message_id, emoji);
                        // تأخير بسيط جداً (200 ملي ثانية) لحماية الحساب من الحظر
                        await new Promise(resolve => setTimeout(resolve, 200));
                    } catch (e) {
                        console.log("توقف التفاعل أو القناة لا تدعم هذا الإيموجي");
                    }
                }
            }
            // ==========================================
        }
    }
}
