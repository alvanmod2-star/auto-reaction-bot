export async function onUpdate(data, botApi, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const text = message.text.trim();

        // 1. تفاعل سريع (إيموجي) حتى نعرفه استلم
        await botApi.setMessageReaction(chatId, message.message_id, "🔥").catch(() => {});

        // 2. إذا مو أمر، جاوبه بالذكاء الاصطناعي
        if (!text.startsWith('/')) {
            // هسة راح ياخذ المفتاح من المتغيرات اللي ضفناها بالـ Cloudflare
            const apiKey = env.GEMINI_API_KEY || "AIzaSyB2VrseqlXOGA7cCiD_QGj2LUU5YaYsfBs";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `رد بلهجة أهل الناصرية وبكلمة وحدة بس على: ${text}` }] }]
                })
            });

            const result = await response.json();

            if (result.candidates && result.candidates[0].content) {
                const aiReply = result.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, aiReply, null, message.message_id);
            } else {
                // إذا أكو خطأ من جوجل، يطبع لنا شنو المشكلة
                const errorMsg = result.error ? result.error.message : "جوجل بعدها صافنة";
                await botApi.sendMessage(chatId, `يا مقتدى جوجل تگول: ${errorMsg}`);
            }
        }
    } catch (e) {
        console.log("Global Worker Error");
    }
}
