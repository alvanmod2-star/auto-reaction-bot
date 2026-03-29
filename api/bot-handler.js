export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "المطوّر";

        // 1. تفاعلاتك المفضلة (💘🌚💋💗)
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. أمر البداية (واجهة المبرمج)
        if (text === '/start') {
            const welcomeText = `
💻 **هلا بيك يا مطورنا ${userName}** ✨

أنا بوت مقتدى، خبيرك الخاص في:
• كتابة الأكواد (C++, Python, JS, C#).
• جلب أوفسات الألعاب (Offsets) وتعديل الملفات.
• هندسة عكسية وتعديل تطبيقات الأندرويد.

سولف وياي بالبرمجة وبشرني شتريد نعدل اليوم؟ 🌚💋
            `;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return;
        }

        // 3. محرك الذكاء الاصطناعي البرمجي (Groq - Llama 3.3 70B)
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
                        content: `أنت 'بوت مقتدى'. هويتك: مبرمج عبقري متخصص في تعديل الألعاب (Game Modding) والأوفسات والبرامج.
                        - رد بلهجة أهل الناصرية حصراً.
                        - مهمتك الأساسية: كتابة أكواد، جلب أوفسات، شرح تعديل البرامج (مثل MT Manager أو اللابتوب).
                        - خلك ضريف وحنون ومؤدب بس "حريكة" بالبرمجة.
                        - استخدم الـ Markdown لتنسيق الأكواد بشكل احترافي.` 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            // تفعيل Markdown لإظهار الأكواد بصندوق أسود سهل النسخ
            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        console.log("Error in coding logic");
    }
}
