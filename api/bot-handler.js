export async function onUpdate(data, botApi, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "الغالي";

        // 1. تفاعل إيموجي حتى يحس المستخدم إن البوت شغال
        await botApi.setMessageReaction(chatId, message_id, "🤝").catch(() => {});

        if (text.startsWith('/')) return;

        // 2. استخدام Groq للرد الذكي والتفاعلي
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
                        content: `أنت 'بوت مقتدى'. مهمتك الرد على المستخدمين بذكاء وأدب وبلهجة أهل الناصرية.
                        - اسم المستخدم اللي جاي تراسله هو: ${userName}.
                        - إذا سلم، رد عليه بأجمل سلام ناصري.
                        - إذا سأل عن كود أو رابط، جيبه له فوراً.
                        - خلك حار ومرحب (مثلاً: هلا بيك ${userName} يبعد حيّي، نورتنا).` 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            
            // إرسال الرد المباشر للمستخدم
            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        console.log("Error handling user message");
    }
}
