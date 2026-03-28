import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text || "";

    // --- 1. كود الاشتراك الإجباري ---
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

    // --- 2. الرد الذكي بالذكاء الاصطناعي (Gemini) ---
    // يجاوب إذا چانت رسالة عادية بالخاص ومو أمر
    if (data.message && text && !text.startsWith('/')) {
        // هذا مفتاح API تجريبي (Gemini)
        const GEMINI_API_KEY = "AIzaSyD-YOUR_ACTUAL_KEY_HERE"; 
        
        try {
            const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت مساعد ذكي ملقب بـ "بوت مقتدى"، رد بلهجة عراقية ناصرية خفيفة وقصيرة ومرحة. المستخدم يقول لك: ${text}` }] }]
                })
            });

            const aiData = await aiResponse.json();
            if (aiData.candidates && aiData.candidates[0].content.parts[0].text) {
                const replyText = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, replyText, null, message_id);
            }
        } catch (e) {
            console.log("AI Error");
        }
    }

    // --- 3. الأوامر الأساسية ---
    if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
        const keyboard = [[{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }]];
        await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from?.first_name || 'حياتي'), keyboard);
        return;
    }

    // --- 4. التفاعل التلقائي (تفاعل واحد) ---
    if (!RestrictedChats.includes(chatId)) {
        try {
            await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
        } catch (e) { }
    }
}
