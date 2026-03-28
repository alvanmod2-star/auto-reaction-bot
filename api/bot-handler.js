export async function onUpdate(data, botApi, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();

        // 1. تفاعل سريع حتى نعرف البوت استلم
        await botApi.setMessageReaction(chatId, message_id, "🫡").catch(() => {});

        if (text.startsWith('/')) return;

        // 2. استخدام Groq API (بطل الناصرية الجديد)
        const GROQ_KEY = "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";
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "أنت ابن الناصرية، رد بلهجة أهل الناصرية حصراً، بكلمات قصيرة جداً ومضحكة." },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        // 3. إرسال الرد
        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            await botApi.sendMessage(chatId, aiReply, null, message_id);
        }

    } catch (e) {
        // إذا صار خطأ ما يوكع البوت
    }
}
