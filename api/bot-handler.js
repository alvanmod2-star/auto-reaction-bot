import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

// قائمة التوكنات (البوت الحالي والجديد)
const botTokens = [
    "6939721323:AAG9eDCNgz3Kct9APMRfrZUCDDSJfKbu8tc", // البوت الأول
    "8661211841:AAF2bqXrvz3oT_Xd4oQhpTJqFdpD-Dzh5TU"  // البوت الثاني (الجديد)
];

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    let chatId, message_id, text;

    if (data.message || data.channel_post) {
        const content = data.message || data.channel_post;
        chatId = content.chat.id;
        message_id = content.message_id;
        text = content.text;

        // --- الأوامر ---
        if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
            const keyboard = [[{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }]];
            await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from.first_name || 'حياتي'), keyboard);
        } else {
            // --- نظام رشق البوتات المتعددة ---
            if (data.channel_post && !RestrictedChats.includes(chatId)) {
                
                // التفاعلات اللي راح يوزعها البوتات (كل بوت ياخذ واحد)
                const emojis = ['👍', '❤️']; 

                for (let i = 0; i < botTokens.length; i++) {
                    try {
                        const token = botTokens[i];
                        const emoji = emojis[i] || '🔥'; // إذا خلصت الإيموجيات يحط نار

                        // طلب خارجي لكل بوت حتى يتفاعل بشكل منفصل
                        await fetch(`https://api.telegram.org/bot${token}/setMessageReaction`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                message_id: message_id,
                                reaction: [{ type: 'emoji', emoji: emoji }]
                            })
                        });
                        
                        console.log(`✅ البوت رقم ${i+1} تفاعل بـ ${emoji}`);
                    } catch (e) {
                        console.log(`❌ فشل البوت رقم ${i+1}`);
                    }
                }
            }
        }
    }
}
