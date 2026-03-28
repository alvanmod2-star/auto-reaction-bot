export async function onUpdate(data, botApi, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();

        // 1. تفاعل ذكي (إيموجي البحث)
        await botApi.setMessageReaction(chatId, message_id, "🌐").catch(() => {});

        if (text.startsWith('/')) return;

        // 2. استخدام Groq - موديل Llama 3.3 (الأقوى للروابط والمعلومات)
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
                        content: `أنت 'بوت مقتدى'. صرت هسة موسوعة روابط ومعلومات. 
                        مهمتك:
                        1. توفر روابط مباشرة وموثوقة (GitHub, Google, تحميل برامج، إلخ).
                        2. تشرح أي شي تقني أو برمجي بدقة.
                        3. تسولف بلهجة أهل الناصرية حصراً (مثلاً: يبعد حيّي، تدلل، هاك هذا الرابط).
                        4. إذا الرابط طويل، حاول تخليه بشكل مرتب.` 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            
            // إرسال الرد مع دعم الـ Markdown للروابط والكود
            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        console.log("Error");
    }
}
