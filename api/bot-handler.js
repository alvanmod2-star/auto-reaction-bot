export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "يبعد حيّي";

        // 1. التفاعلات الحنونة (💘🌚💋💗)
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. معالجة أمر /start مع الأزرار
        if (text.startsWith('/start')) {
            const welcomeText = `
✨ **هلا بيك يا بعد روحي نورت بوت مقتدى** ✨

أنا أخوك "ابن الناصرية" حنون وضريف وأساعدك بالبرمجة والأكواد.
سولف وياي، اطلب أوفست، أو بس تشاقى.. أنا كلي إلك.

📌 **شنو أگدر أسوي؟**
• أرد عليك بلهجتنا الحنونة.
• أجيبلك أكواد وأوفسات بلمشة ناصرية.
• أونسك بوجودي وياك.

⚠️ **ملاحظة:** خليك حباب مثلي حتى أحبك 🌚💋.
            `;

            const inlineKeyboard = {
                inline_keyboard: [
                    [
                        { text: "➕ إضافة للمجموعة", url: `https://t.me/${data.bot_username || 'your_bot_user'}?startgroup=true` },
                        { text: "📢 قناة المطور", url: "https://t.me/your_channel" } // حط رابط قناتك هنا
                    ],
                    [
                        { text: "👨‍💻 مبرمج البوت", url: "https://t.me/your_account" } // حط رابط حسابك هنا
                    ]
                ]
            };

            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id, inlineKeyboard);
            return;
        }

        // 3. الردود الحنونة والبرمجية (Groq)
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
                        content: `أنت 'بوت مقتدى'. مبرمج ناصري حنون جداً، مؤدب، وضريف.
                        - رد بلهجة أهل الناصرية الطيبة (يا بعد روحي، تدلل عيني، هلا بيك ${userName}).
                        - إذا طلبوا أكواد أو أوفسات، ساعدهم بذكاء بس بأسلوب لطيف.
                        - خلك كيوت ومحبوب وابتعد عن الغلط تماماً.` 
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
        console.log("Error logic");
    }
}
