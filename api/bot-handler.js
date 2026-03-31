// مصفوفة الذاكرة لازم تكون برا حتى تحاول تحافظ على السياق
let chatHistory = []; 

export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "المطوّر";

        // 1. التفاعلات (💘🌚💋💗)
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. أمر البداية والواجهة
        if (text === '/start') {
            chatHistory = []; // تصفير الذاكرة للبدء من جديد
            const welcomeText = `هلا بيك يا بعد روحي مقتدى 🌚💋\nأنا مساعدك الشخصي، اسألني عن أي كود بايثون أو أوفست وأنا أتذكرك دائماً.`;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return;
        }

        // 3. إدارة سياق المحادثة (الذاكرة)
        chatHistory.push({ role: "user", content: text });
        if (chatHistory.length > 8) chatHistory.shift(); // نحفظ آخر 8 رسايل حتى ما يثقل

        // 4. طلب الرد من Groq
        const GROQ_KEY = "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";
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + GROQ_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `أنت 'تيلكرام مساعدك الشخصي'. عراقي من أهل الناصرية، مرح، حنون، وخبير برمجة (Python).
                        - رد بلهجة عراقية حنينة ومؤدبة.
                        - تذكر اسم المستخدم: ${userName}.
                        - جاوب على الأكواد والأوفسات بذكاء.` 
                    },
                    ...chatHistory
                ]
            })
        });

        const resData = await response.json();

        // 5. إرسال الرد (التأكد من وصول النص)
        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            chatHistory.push({ role: "assistant", content: aiReply });
            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        // في حال حدوث خطأ بالسيرفر يرسل تنبيه بسيط
        console.log("Error logic");
    }
    }
