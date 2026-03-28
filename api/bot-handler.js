export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();

        // 1. التفاعلات الحنونة والضريفة اللي ردتها
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        if (text.startsWith('/')) return;

        // 2. استخدام Groq للردود الحنونة
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
                        content: "أنت 'بوت مقتدى'. ابن نصرية ضريف جداً، لسانك حلو، وحنون بشكل مو طبيعي. رد بلهجة أهل الناصرية وبكلمات دافئة ومضحكة (مثلاً: يبعد حيّي، يا بعد جبدي، فدوة لهل طول). خلك رومانسي وضريف وابتعد عن الرسميات والأكواد." 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            await botApi.sendMessage(chatId, aiReply, null, message_id);
        }

    } catch (e) {
        // حماية البوت من التوقف
    }
}
