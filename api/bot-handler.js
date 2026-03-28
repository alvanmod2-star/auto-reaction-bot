export async function onUpdate(data, botApi) {
    try {
        const content = data.message || data.channel_post;
        if (!content || !content.text) return;

        const chatId = content.chat.id;
        const message_id = content.message_id;
        const text = content.text.trim();

        // 1. التفاعل التلقائي (إيموجي)
        const emojis = ["👍", "❤️", "🔥", "🥰", "👏"];
        await botApi.setMessageReaction(chatId, message_id, emojis[Math.floor(Math.random() * emojis.length)]).catch(() => {});

        // 2. أمر الاستارت
        if (text === '/start') {
            await botApi.sendMessage(chatId, "هلا مقتدى! البوت هسة نطق بالمفتاح الجديد 🚀");
            return;
        }

        // 3. الرد بالذكاء (Gemini)
        if (!text.startsWith('/')) {
            const apiKey = "AIzaSyB2VrseqlXOGA7cCiD_QGj2LUU5YaYsfBs"; 
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت بوت ذكي، رد بلهجة أهل الناصرية وبكلمات قصيرة جداً. رد على: ${text}` }] }]
                })
            });

            const aiData = await response.json();

            if (aiData.candidates && aiData.candidates[0].content) {
                const reply = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            } else {
                // إذا أكو مشكلة بالمفتاح، راح يگولك فوراً
                const msg = aiData.error ? aiData.error.message : "عطل فني بجوجل";
                await botApi.sendMessage(chatId, "مقتدى، جوجل تگول: " + msg);
            }
        }
    } catch (e) {
        console.log("Global Error");
    }
}
