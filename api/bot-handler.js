import { startMessage } from './constants.js';

// قائمة توكنات البوتات مالتك
const botTokens = [
    "6939721323:AAG9eDCNgz3Kct9APMRfrZUCDDSJfKbu8tc", // البوت الأول
    "8661211841:AAF2bqXrvz3oT_Xd4oQhpTJqFdpD-Dzh5TU"  // البوت الثاني
];

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    // التأكد من وجود رسالة أو منشور قناة
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text || "";

    // --- 1. أوامر البوت الأساسي ---
    if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
        const keyboard = [[{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }]];
        await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from?.first_name || 'حياتي'), keyboard);
        return;
    }

    // --- 2. نظام رشق التفاعلات للبوتين ---
    if (data.channel_post && !RestrictedChats.includes(chatId)) {
        const emojis = ['👍', '❤️']; // البوت الأول ينطي لايك، الثاني ينطي قلب

        for (let i = 0; i < botTokens.length; i++) {
            try {
                const token = botTokens[i];
                const emoji = emojis[i] || '🔥';

                // إرسال طلب التفاعل لكل بوت بشكل منفصل
                await fetch(`https://api.telegram.org/bot${token}/setMessageReaction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: message_id,
                        reaction: [{ type: 'emoji', emoji: emoji }]
                    })
                });
                
                // تأخير بسيط بيناتهم
                await new Promise(r => setTimeout(r, 200));
            } catch (e) {
                console.log("Error with bot " + (i + 1));
            }
        }
    }
}
