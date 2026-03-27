/*!
 * © [2026] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

import { startMessage, donateMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    let chatId, message_id, text;

    if (data.message || data.channel_post) {
        const content = data.message || data.channel_post;
        chatId = content.chat.id;
        message_id = content.message_id;
        text = content.text;

        // ==========================================
        // --- بداية كود الاشتراك الإجباري ---
        // ==========================================
        if (content.chat && content.chat.type === "private") {
            const channelUsername = "@DFD318"; // يوزر قناتك
            const botToken = "ضع_توكن_البوت_هنا"; // 🔴 امسح هذي الكلمة وحط توكن بوتك مكانها

            try {
                const userId = content.from.id;
                // فحص اشتراك المستخدم في القناة
                const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`);
                const checkData = await response.json();

                // إذا كان المستخدم غير مشترك، أو غادر القناة، أو مطرود
                if (checkData.ok && (checkData.result.status === "left" || checkData.result.status === "kicked")) {
                    const forceSubKeyboard = [
                        [
                            { "text": "📢 اضغط هنا للاشتراك بالقناة", "url": "https://t.me/DFD318" }
                        ]
                    ];
                    
                    await botApi.sendMessage(chatId, "⚠️ | عذراً عزيزي، يجب عليك الاشتراك في القناة الرسمية أولاً لتتمكن من استخدام البوت.\n\n👇 اشترك الآن ثم ارسل /start", forceSubKeyboard);
                    return; // إيقاف البوت هنا وعدم إرسال أي رسالة أخرى حتى يشترك
                }
            } catch (error) {
                console.log("خطأ في التحقق من الاشتراك");
            }
        }
        // ==========================================
        // --- نهاية كود الاشتراك الإجباري ---
        // ==========================================

        if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
            const keyboard = [
                [
                    { "text": "➕ اضافة الى قناة ➕", "url": "https://t.me/Baugauhabot?startchannel=true" },
                    { "text": "➕ اضافة الى مجموعة ➕", "url": "https://t.me/Baugauhabot?startgroup=true" }
                ],
                [
                    { "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }
                ],
                [
                    { "text": "⭐ حسابي الشخصي", "url": "https://t.me/mu_312" }
                ]
            ];

            await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from.first_name || 'حياتي'), keyboard);
            
        } else if (data.message && text === '/reactions') {
            const reactions = Reactions.join(", ");
            await botApi.sendMessage(chatId, "✅ تم تفعيل التفاعلات : \n\n" + reactions);
        } else {
            let threshold = 1 - (RandomLevel / 10);
            if (!RestrictedChats.includes(chatId)) {
                if (["group", "supergroup"].includes(content.chat.type)) {
                    if (Math.random() <= threshold) {
                        await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                    }
                } else {
                    await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                }
            }
        }
    } else if (data.pre_checkout_query) {
        await botApi.answerPreCheckoutQuery(data.pre_checkout_query.id, true);
        await botApi.sendMessage(data.pre_checkout_query.from.id, "شكرا لاستخدامك البوت ! 💝");
    }
}
