export async function onUpdate(data, botApi) {
    try {
        // دعم الرسائل من الخاص والمجموعات
        const message = data.message || data.channel_post || data.edited_message;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "المطوّر";

        // 1. التفاعلات (💘🌚💋💗) - سويتها أول خطوة حتى تضمنها
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. معالجة أمر /start
        if (text.startsWith('/start')) {
            const welcomeText = `
💻 **هلا بيك بـ بوت مقتدى المبرمج** ✨

أنا خبيرك بالأكواد والأوفسات وتعديل الألعاب.
• أشتغل بالخاص وبالمجموعات يبعد حيّي.
• دزلي أي كود أو أوفست وأنا أعدله الك.

بشرني شتريد نعدل اليوم؟ 🌚💋
            `;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return;
        }

        // 3. الاتصال بـ Groq (تأكد إن المفتاح مو مسرب بـ GitHub)
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
                        content: `أنت 'بوت مقتدى'. مبرمج ناصري خبير جداً بالأكواد (C++, Python) والأوفسات.
                        - رد بلهجة أهل الناصرية حصراً وبأسلوب مرح وحنون.
                        - استخدم الـ Markdown للأكواد.
                        - ساعد ${userName} في كل ما يخص البرمجة وتعديل الألعاب.` 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        if (!response.ok) throw new Error("API Error");

        const resData = await response.json();

        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        // إذا صار خطأ بالمجموعات يطبع لوق بسيط
        console.log("Error in Group/Private Logic");
    }
            }
