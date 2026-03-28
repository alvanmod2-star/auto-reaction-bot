export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();

        // 1. التفاعل (حتى نكسر النحس)
        await botApi.setMessageReaction(chatId, message_id, "👍").catch(() => {});

        // 2. الرد بالذكاء (Gemini)
        if (!text.startsWith('/')) {
            // المفتاح مالتك الجديد اللي نسخته
            const apiKey = "AIzaSyB2VrseqlXOGA7cCiD_QGj2LUU5YaYsfBs"; 
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت بوت مقتدى، رد بلهجة أهل الناصرية وبكلمات قصيرة جداً ومرحة. رد على: ${text}` }] }]
                })
            });

            const resData = await response.json();

            if (resData.candidates && resData.candidates[0].content) {
                const aiReply = resData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, aiReply, null, message_id);
            }
        }
    } catch (e) {
        // إذا رجع الخطأ، راح نعرف إنه من الـ API نفسه
        console.log("Error inside handler");
    }
}
