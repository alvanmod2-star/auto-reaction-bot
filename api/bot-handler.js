export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const text = message.text.trim();

        // 1. التفاعل (إيموجي) - حتى نتأكد إن البوت سمعك
        await botApi.setMessageReaction(chatId, message.message_id, "🔥").catch(() => {});

        // 2. إذا مو أمر استارت، جاوبه بالناصرية
        if (!text.startsWith('/')) {
            const apiKey = "AIzaSyB2VrseqlXOGA7cCiD_QGj2LUU5YaYsfBs"; 
            // الرابط المباشر والأضمن حالياً
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `رد بلهجة أهل الناصرية وبكلمات قصيرة جداً ومضحكة على: ${text}` }] }]
                })
            });

            const resData = await response.json();

            if (resData.candidates && resData.candidates[0].content) {
                const aiReply = resData.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, aiReply, null, message.message_id);
            } else {
                // لو جوجل ردت بخطأ، راح يطبع لك "كلمة السر" مال الخطأ
                const errorInfo = resData.error ? resData.error.message : "جوجل قافلة";
                await botApi.sendMessage(chatId, `يا مقتدى، جوجل تگول: ${errorInfo}`);
            }
        }
    } catch (e) {
        // إذا الكود انضرب تماماً
        console.log("Error in Handler");
    }
}
