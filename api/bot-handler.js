import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text || "";

    // 1. أمر الاستارت (شغال بالخاص والمجموعات)
    if (data.message && (text === '/start' || text.startsWith('/start'))) {
        const keyboard = [[{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }]];
        await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from?.first_name || 'حياتي'), keyboard);
        // التفاعل بعد الاستارت
        await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
        return;
    }

    // 2. الرد الذكي (فقط بالخاص والمجموعات)
    if (data.message && text && !text.startsWith('/')) {
        const GEMINI_API_KEY = "AIzaSyDiTD-uOIX69bewR59dBRo-MTw_mugQ3SM"; 
        
        try {
            const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت مساعد ذكي ملقب بـ "بوت مقتدى"، رد بلهجة عراقية ناصرية فكاهية وقصيرة جداً. رد على: ${text}` }] }]
                })
            });

            const aiData = await aiResponse.json();
            if (aiData.candidates && aiData.candidates[0].content.parts[0].text) {
                const replyText = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, replyText, null, message_id);
            }
        } catch (e) { console.log("AI Error"); }
    }

    // 3. التفاعل التلقائي (شغال بكل مكان: قنوات، مجموعات، خاص)
    if (!RestrictedChats.includes(chatId)) {
        try {
            await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
        } catch (e) { 
            console.log("Reaction Error"); 
        }
    }
}
