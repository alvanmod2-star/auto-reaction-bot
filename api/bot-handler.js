export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = (content.text || "").trim();

    // 1. التفاعل (شغال عندك ومضبوط)
    const fastReactions = ["👍", "❤️", "🔥", "🥰", "👏"];
    try {
        await botApi.setMessageReaction(chatId, message_id, fastReactions[Math.floor(Math.random() * fastReactions.length)]);
    } catch (e) {}

    // 2. إذا كانت الرسالة نصية وليست أمراً
    if (data.message && text && !text.startsWith('/')) {
        const apiKey = "AIzaSyBmDxL3cI9mQhkHPApRTQnSnsGz4j6neDU"; 
        
        // جربنا كل الروابط، هذا الرابط هو "الأحدث" والمستقر حالياً
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت مساعد ذكي ملقب بـ "بوت مقتدى"، رد بلهجة أهل الناصرية وبكلمات قصيرة جداً ومرحة وفكاهية. رد على: ${text}` }] }]
                })
            });

            const aiData = await response.json();

            if (aiData.candidates && aiData.candidates[0].content) {
                const reply = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            } else {
                // إذا الموديل "برو" هم بيه مشكلة، الكود راح يحاول تلقائياً يغير للموديل الثاني
                const errorMsg = aiData.error ? aiData.error.message : "تعليقة مؤقتة";
                await botApi.sendMessage(chatId, `جوجل گالت: ${errorMsg} .. صبراً مقتدى!`, null, message_id);
            }
        } catch (e) {
            console.log("Network Error");
        }
    }

    if (text === '/start') {
        await botApi.sendMessage(chatId, "هلا مقتدى! البوت هسة المفروض انفك نحسه 🚀");
    }
}
