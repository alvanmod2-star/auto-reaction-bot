export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = (content.text || "").trim();

    // 1. التفاعل التلقائي (هذا مخلصين منه وشغال)
    try {
        const emojis = ["👍", "❤️", "🔥", "🥰", "👏"];
        await botApi.setMessageReaction(chatId, message_id, emojis[Math.floor(Math.random() * emojis.length)]);
    } catch (e) {}

    // 2. الرد بالذكاء الاصطناعي (باستخدام رابط الاستدعاء المباشر)
    if (data.message && text && !text.startsWith('/')) {
        const apiKey = "AIzaSyBmDxL3cI9mQhkHPApRTQnSnsGz4j6neDU"; 
        
        // جرب هذا الرابط المختصر والمباشر
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `رد كأنك ابن الناصرية وبكلمات قصيرة جداً ومضحكة على: ${text}` }] }]
                })
            });

            const resJson = await response.json();

            if (resJson.candidates && resJson.candidates[0].content) {
                const reply = resJson.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            } else {
                // لو قفل مرة ثانية، راح يطبع لنا الكود السري للخطأ
                await botApi.sendMessage(chatId, "مقتدى، السالفة عاندت! دزلي صورة باللي يطلع هسة.", null, message_id);
            }
        } catch (e) {
            console.log("Error");
        }
    }

    if (text === '/start') {
        await botApi.sendMessage(chatId, "هلا مقتدى! البوت هسة المفروض انفك نحسه غصب عنه 🚀");
    }
}
