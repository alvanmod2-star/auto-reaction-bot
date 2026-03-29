export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "المطوّر";

        // 1. التفاعلات (💘🌚💋💗) - سويتها بـ await حتى يكملها ويروح للي بعدها
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. معالجة أمر /start
        if (text === '/start') {
            const welcomeText = `
💻 **هلا بيك يا مطورنا ${userName}** ✨

أنا بوت مقتدى، خبيرك الخاص في الأكواد والأوفسات.
سولف وياي بالبرمجة وبشرني شتريد نعدل اليوم؟ 🌚💋
            `;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return;
        }

        // 3. جلب الرد من الذكاء الاصطناعي (Groq)
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
                        content: "أنت 'بوت مقتدى'. مبرمج ناصري خبير بالأكواد والأوفسات وتعديل الألعاب. رد بلهجة أهل الناصرية حصراً وبأسلوب مرح وحنون. استخدم Markdown للأكواد." 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await response.json();

        // 4. إرسال الرد (هنا جانت المشكلة وهسة انحلت)
        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        console.log("Error logic");
    }
    }
