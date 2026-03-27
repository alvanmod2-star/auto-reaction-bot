import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    if (!data.message && !data.channel_post) return;

    const content = data.message || data.channel_post;
    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text ? content.text.trim() : "";
    const userId = content.from ? content.from.id : null;

    // 1. الأوامر (الستارت والأيدي)
    if (text.startsWith('/start')) {
        const keyboard = {
            inline_keyboard: [
                [{ "text": "📢 قناتي", "url": "https://t.me/DFD318" }, { "text": "⭐ المطور", "url": "https://t.me/mu_312" }]
            ]
        };
        await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from.first_name || 'بطل'), { reply_markup: keyboard });
    } 
    else if (text.startsWith('/id')) {
        await botApi.sendMessage(chatId, `👤 اسمك: ${content.from.first_name}\n🆔 ايديك: \`${userId}\``);
    }
    else if (text === 'هلو') {
        await botApi.sendMessage(chatId, "هلوات عيوني 🌹");
    }
    // 2. نظام التفاعل
    else {
        let threshold = 1 - (RandomLevel / 10);
        if (!RestrictedChats.includes(chatId)) {
            if (Math.random() <= threshold) {
                await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
            }
        }
    }
}
