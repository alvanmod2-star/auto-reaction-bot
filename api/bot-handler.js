export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = content.text || "";

    // 1. التفاعل التلقائي (شغال عندك 100%)
    const fastReactions = ["👍", "❤️", "🔥", "🥰", "👏", "⚡️"];
    const randomEmoji = fastReactions[Math.floor(Math.random() * fastReactions.length)];
    try {
        await botApi.setMessageReaction(chatId, message_id, randomEmoji);
    } catch (e) {}

    // 2. أمر الاستارت (رد محدد)
    if (text === '/start') {
        await botApi.sendMessage(chatId, "هلا مقتدى! البوت هسة جاهز للرد الذكي والناصرية 🚀");
        return; // ننهي التنفيذ هنا حتى ما يروح للذكاء الاصطناعي بنفس اللحظة
    }

    // 3. الرد بالذكاء الاصطناعي (لكل الرسائل العادية)
    if (data.message && text && !text.startsWith('/')) {
        const apiKey = "AIzaSyBmDxL3cI9mQhkHPApRTQnSnsGz4j6neDU"; 
        
        try {
            const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `أنت بوت مقتدى، رد بلهجة أهل الناصرية وبكلمات قصيرة جداً ومرحة على: ${text}` }] }]
                })
            });

            const aiData = await aiResponse.json();
            
            if (aiData.candidates && aiData.candidates[0].content) {
                const reply = aiData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            }
        } catch (e) {
            console.log("AI Error");
        }
    }
}
