export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();

        // 1. التفاعل التلقائي (شغال عندك تمام)
        await botApi.setMessageReaction(chatId, message_id, "👍").catch(() => {});

        if (text.startsWith('/')) return;

        // 2. طلب الذكاء الاصطناعي برابط "مضمون"
        const apiKey = "AIzaSyB2VrseqlXOGA7cCiD_QGj2LUU5YaYsfBs"; // مفتاحك الجديد
        
        // غيرنا الرابط إلى gemini-1.5-flash-latest (الأكثر استقراراً هسة)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `رد بكلمة وحدة بلهجة أهل الناصرية مضحكة على: ${text}` }] }]
            })
        });

        const resData = await response.json();

        // 3. معالجة الرد أو إظهار الخطأ الحقيقي
        if (resData.candidates && resData.candidates[0].content) {
            const reply = resData.candidates[0].content.parts[0].text;
            await botApi.sendMessage(chatId, reply, null, message_id);
        } else if (resData.error) {
            // إذا جوجل رفضت، راح تگول لنا السبب بوضوح
            await botApi.sendMessage(chatId, "جوجل تگول: " + resData.error.message);
        }

    } catch (e) {}
}
