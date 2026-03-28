export async function onUpdate(data, botApi) {
    const content = data.message || data.channel_post;
    if (!content || !content.text) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text.trim();

    // 1. التفاعل التلقائي (اللايكات)
    try {
        const emojis = ["👍", "❤️", "🔥", "🥰", "👏"];
        await botApi.setMessageReaction(chatId, message_id, emojis[Math.floor(Math.random() * emojis.length)]);
    } catch (e) {}

    // 2. الرد الذكي (ابن الناصرية) باستخدام المفتاح الجديد
    if (!text.startsWith('/')) {
        const apiKey = "AIzaSyB2VrseqlXOGA7cCiD_QGj2LUU5YaYsfBs"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت مساعد ذكي ملقب بـ "بوت مقتدى"، رد بلهجة أهل الناصرية العراقية الأصيلة، وبكلمات قصيرة جداً ومرحة. رد على: ${text}` }] }]
                })
            });

            const aiData = await response.json();

            if (aiData.candidates && aiData.candidates[0].content) {
                const reply = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            }
        } catch (e) {
            console.log("AI Error");
        }
    }

    if (text === '/start') {
        await botApi.sendMessage(chatId, "هلا مقتدى! المفتاح الجديد شغال 100% وهسة البوت صار ابن ولايتك 🚀");
    }
}
