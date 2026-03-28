export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = (content.text || "").trim();

    // 1. التفاعل التلقائي (شغال 100%)
    const fastReactions = ["👍", "❤️", "🔥", "🥰", "👏"];
    try {
        await botApi.setMessageReaction(chatId, message_id, fastReactions[Math.floor(Math.random() * fastReactions.length)]);
    } catch (e) {}

    // 2. إذا كانت الرسالة أمر استارت
    if (text === '/start') {
        await botApi.sendMessage(chatId, "هلا مقتدى! هسة البوت راح يرد عليك ناصري أصلي 🚀");
        return;
    }

    // 3. الرد بذكاء اصطناعي (Gemini) - النسخة المضمونة
    if (data.message && text && !text.startsWith('/')) {
        const apiKey = "AIzaSyBmDxL3cI9mQhkHPApRTQnSnsGz4j6neDU"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت مساعد ذكي ملقب بـ "بوت مقتدى"، رد بلهجة أهل الناصرية وبكلمات قصيرة جداً ومرحة. الرد على: ${text}` }] }]
                })
            });

            const aiData = await response.json();

            if (aiData.candidates && aiData.candidates[0].content) {
                const reply = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            } else {
                // لو الـ API بيه مشكلة فعلية راح يگولك
                await botApi.sendMessage(chatId, "مقتدى، المفتاح مالي يحتاج تفعيل من جوجل! ⚠️", null, message_id);
            }
        } catch (e) {
            console.log("Gemini Error");
        }
    }
                    }
