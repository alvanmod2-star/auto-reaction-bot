// مصفوفة بسيطة لحفظ الذاكرة (ملاحظة: بالـ Workers الذاكرة تمسح بعد فترة، للثبات الدائم نحتاج KV)
let chatHistory = {}; 

export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "الغالي";

        // 1. التفاعلات (💘🌚💋💗)
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. أمر البداية والواجهة
        if (text === '/start') {
            chatHistory[chatId] = []; // تصفير الذاكرة عند البدء من جديد
            const welcomeText = `
✨ **هلا بيك يا بعد روحي نورت "تيلكرام مساعدك الشخصي"** ✨

أنا أخوك بلمسة عراقية، مبرمج وذكي وأتذكر كلامك.
سولف وياي، اطلب أكواد، أو بس دردش.. أنا كلي إلك.

📌 **شنو أگدر أسوي؟**
• أتذكر السوالف القديمة (مثل جيمناي).
• أساعدك بكل لغات البرمجة (Python وغيرها).
• أرد بلهجة عراقية حنينة ومرحة.

بشرني شعدنا اليوم؟ 🌚💋
            `;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return;
        }

        // 3. إدارة الذاكرة (History)
        if (!chatHistory[chatId]) chatHistory[chatId] = [];
        
        // إضافة رسالة المستخدم للذاكرة
        chatHistory[chatId].push({ role: "user", content: text });

        // نخلي الذاكرة قصيرة حتى ما يثقل الطلب (آخر 10 رسائل مثلاً)
        if (chatHistory[chatId].length > 10) chatHistory[chatId].shift();

        // 4. إرسال المحادثة كاملة لـ Groq
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
                        content: `أنت 'تيلكرام مساعدك الشخصي'. عراقي مرح، حكيم وأخلاق جداً.
                        - رد بلهجة عراقية حنينة (يا بعد روحي، تدلل، عيوني ${userName}).
                        - أنت خبير أكواد بايثون وجميع أنواع البرمجة.
                        - رد بإيموجيات متناسقة وكن حنوناً ومرحاً.
                        - تذكر دائماً سياق المحادثة السابق للرد بذكاء.` 
                    },
                    ...chatHistory[chatId] // هنا نمرر كل المحادثة السابقة
                ]
            })
        });

        const resData = await response.json();

        if (resData.choices && resData.choices[0].message) {
            const aiReply = resData.choices[0].message.content;
            
            // إضافة رد البوت للذاكرة حتى يتذكره بالمرة الجاية
            chatHistory[chatId].push({ role: "assistant", content: aiReply });

            await botApi.sendMessage(chatId, aiReply, "Markdown", message_id);
        }

    } catch (e) {
        console.log("Error in chat logic");
    }
}
