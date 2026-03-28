export async function onUpdate(data, botApi, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "يبعد حيّي";

        // 1. تفاعل إيموجي ضريف
        await botApi.setMessageReaction(chatId, message_id, "🤣").catch(() => {});

        if (text.startsWith('/')) return;

        // 2. استخدام مفتاح Groq
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
                    { 
                        role: "system", 
                        content: `أنت 'بوت مقتدى'. مبرمج خبير وموسوعة روابط، وبنفس الوقت ابن ناصرية ضريف وشقاوجي.
                        - رد بلهجة أهل الناصرية (مثلاً: هاا شني، يبعد طوايفي، دهاك استلم).
                        - إذا طلبوا كود أو روابط، انطيهمياها بذكاء بس اتمضحك وياهم.
                        - لا تصير رسمي، خلك فكاهي وسوالفك تونس ${userName}.` 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        // في حال حدوث خطأ
        console.log("Error logic");
    }
}
