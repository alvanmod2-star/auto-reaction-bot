export async function onUpdate(data, botApi, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "بعد روحي";

        // 1. تفاعل إيموجي يضحك
        await botApi.setMessageReaction(chatId, message_id, "😂").catch(() => {});

        // 2. استخدام مفتاح Groq القوي
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
                        content: `أنت 'بوت مقتدى'. شخصيتك: ابن ناصرية، لسانك حلو، شقاوجي وظريف جداً.
                        - لازم ترد بلهجة الناصرية القح (مثلاً: يبعد طوايفي، شبيك عيني، هاك استلم).
                        - إذا أحد سألك عن كود، اكتبه إله بس اتمضحك وياه شوية.
                        - إذا أحد طلب رابط، جيب الرابط وگله 'هذا الرابط يبعد حيّي لا تدوخ'.
                        - لا تختصر الردود بشكل يضوج، خل سوالفك تونس ${userName}.` 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            
            // إرسال الرد الظريف
            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        // إذا صار خطأ ما يوكف البوت
    }
}
