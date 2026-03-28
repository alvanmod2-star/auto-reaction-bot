export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();

        // 1. تفاعل إيموجي حتى تعرف البوت استلم
        await botApi.setMessageReaction(chatId, message_id, "🔥").catch(() => {});

        if (text.startsWith('/')) return;

        // 2. طلب الرد من Groq (استخدام المفتاح الجديد)
        const GROQ_API_KEY = "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"; 
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", 
                messages: [
                    { 
                        role: "system", 
                        content: "أنت مساعد ذكي ملقب بـ 'بوت مقتدى'. رد بلهجة أهل الناصرية العراقية حصراً، وبكلمات مضحكة وقصيرة جداً وصريحة." 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        // 3. إرسال الرد للمستخدم
        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            await botApi.sendMessage(chatId, aiReply, null, message_id);
        } else {
            // رسالة في حال حدوث خطأ تقني بسيط
            await botApi.sendMessage(chatId, "مقتدى، السيرفر تعبان شوية، جرب مرة ثانية.");
        }

    } catch (e) {
        console.log("Error in Groq Handler");
    }
}
