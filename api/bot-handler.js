import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text || "";

    // 1. التفاعل التلقائي (يشتغل أولاً وقبل كل شيء لضمان عمل البوت)
    if (!RestrictedChats.includes(chatId)) {
        try {
            await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
        } catch (e) { console.log("Reaction Error"); }
    }

    // 2. أوامر البوت (Start / Reactions)
    if (data.message && text.startsWith('/')) {
        if (text.includes('start')) {
            await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from?.first_name || 'حياتي'));
        } else if (text.includes('reactions')) {
            await botApi.sendMessage(chatId, "✅ التفاعلات شابة نار!");
        }
        return;
    }

    // 3. الرد الذكي (بالمجموعات والخاص فقط)
    if (data.message && text && !text.startsWith('/')) {
        const apiKey = "AIzaSyDiTD-uOIX69bewR59dBRo-MTw_mugQ3SM";
        try {
            const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت مساعد ذكي ملقب بـ "بوت مقتدى"، رد بلهجة أهل الناصرية وبكلمات قصيرة جداً ومرحة على: ${text}` }] }]
                })
            });

            const aiData = await aiResponse.json();
            if (aiData.candidates && aiData.candidates[0].content.parts[0].text) {
                const reply = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            }
        } catch (e) {
            // إذا فشل الذكاء الاصطناعي، يرسل إيموجي حتى ما يبقى صامت
            await botApi.sendMessage(chatId, "شبيك صافن عليّ؟ 🌚", null, message_id);
        }
    }
}
