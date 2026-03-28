export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = (content.text || "").trim();

    // 1. التفاعل (شغال عندك 100%)
    const fastReactions = ["👍", "❤️", "🔥", "🥰", "👏"];
    try {
        await botApi.setMessageReaction(chatId, message_id, fastReactions[Math.floor(Math.random() * fastReactions.length)]);
    } catch (e) {}

    // 2. أمر الاستارت
    if (text === '/start') {
        await botApi.sendMessage(chatId, "هلا مقتدى! البوت هسة انطلق بالذكاء الناصري 🚀");
        return;
    }

    // 3. الرد بـ Gemini (تعديل النسخة والموديل)
    if (data.message && text && !text.startsWith('/')) {
        const apiKey = "AIzaSyBmDxL3cI9mQhkHPApRTQnSnsGz4j6neDU"; 
        // غيرنا الرابط للنسخة v1 والموديل gemini-pro لأنه أضمن بالاستجابة هسة
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت بوت مقتدى، رد بلهجة أهل الناصرية وبكلمات قصيرة جداً ومرحة. رد على: ${text}` }] }]
                })
            });

            const aiData = await response.json();

            if (aiData.candidates && aiData.candidates[0].content) {
                const reply = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            } else {
                const errorMsg = aiData.error ? aiData.error.message : "خطأ بالاستجابة";
                await botApi.sendMessage(chatId, `جوجل تگول: ${errorMsg}`, null, message_id);
            }
        } catch (e) {
            console.log("Error");
        }
    }
}
