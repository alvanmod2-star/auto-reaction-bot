export async function onUpdate(data, botApi) {
    try {
        const content = data.message || data.channel_post;
        if (!content || !content.text) return;

        const chatId = content.chat.id;
        const message_id = content.message_id;
        const text = content.text.trim();

        // 1. التفاعل (شغال عندك)
        await botApi.setMessageReaction(chatId, message_id, "👍").catch(() => {});

        if (text === '/start') {
            await botApi.sendMessage(chatId, "هلا مقتدى! البوت هسة نطق بالمفتاح الجديد 🚀");
            return;
        }

        // 2. الرد الذكي (استخدام الموديل العام لتجنب خطأ Not Found)
        if (!text.startsWith('/')) {
            const apiKey = "AIzaSyB2VrseqlXOGA7cCiD_QGj2LUU5YaYsfBs"; // مفتاحك الشغال
            // استخدمنا أضمن رابط بالعالم هسة
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `رد بلهجة أهل الناصرية وبكلمة وحدة مضحكة على: ${text}` }] }]
                })
            });

            const aiData = await response.json();

            if (aiData.candidates && aiData.candidates[0].content) {
                const reply = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            } else {
                // إذا عاندت، يطبع لك الخطأ حتى نعرف شنسوي
                const msg = aiData.error ? aiData.error.message : "عطل فني";
                await botApi.sendMessage(chatId, "جوجل تگول: " + msg);
            }
        }
    } catch (e) {}
}
