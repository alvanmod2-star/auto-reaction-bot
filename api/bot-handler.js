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

        if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
            // تصحيح الأقواس هنا لتكون مصفوفة أزرار صحيحة
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
