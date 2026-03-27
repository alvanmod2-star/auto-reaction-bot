
import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    if (!data.message && !data.channel_post) return;

    const content = data.message || data.channel_post;
    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text ? content.text.toLowerCase() : "";
    const userId = content.from ? content.from.id : null;

    // --- الرد على هلو ---
    if (text === 'هلو' || text === 'هلا') {
        await botApi.sendMessage(chatId, "هلوات عيوني مقتدى يسلم عليك 🌹");
        return; 
    }

    // --- الرد على الايدي ---
    if (text.includes('/id')) {
        await botApi.sendMessage(chatId, `👤 اسمك: ${content.from.first_name}\n🆔 ايديك: ${userId}`);
        return;
    }

    // --- الرد على الستارت ---
    if (text.includes('/start')) {
        const keyboard = {
            inline_keyboard: [[{ "text": "📢 قناتي", "url": "https://t.me/DFD318" }]]
        };
        await botApi.sendMessage(chatId, "أهلاً بك في بوت مقتدى الناصري!", { reply_markup: keyboard });
        return;
    }

    // --- إذا مو أمر، تفاعل ---
    let threshold = 1 - (RandomLevel / 10);
    if (!RestrictedChats.includes(chatId)) {
        if (Math.random() <= threshold) {
            await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
        }
    }
}
