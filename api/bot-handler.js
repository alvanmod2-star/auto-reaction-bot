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

        // 2. معالجة أمر /start (الواجهة)
        if (text === '/start') {
            const welcomeText = `
✨ **هلا بيك يا بعد روحي نورت بوت مقتدى** ✨

أنا مساعدك الشخصي " الكيوت " ذكاء اصطناعي بس بلمسة ناصرية حارة.
سولف وياي، تشاقى، اسأل.. أنا بالخدمة يروح الروح ❤️ .

📌 **شنو أگدر أسوي؟**
• أرد عليك بلهجتنا الحلوة.
• أتفاعل وياك بالحب والحنان.
• أونسك بشقاي ومرحي.

⚠️ **ملاحظة:** خليك مؤدب حتى أحطك على راسي 🌚💋.
            `;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return;
        }

        // 3. استخدام Groq للردود الذكية والمرحة
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
                        content: `أنت 'بوت مقتدى'. ابن ناصرية مرح، مؤدب، وحنون.
                        - رد بلهجة أهل الناصرية (مثلاً: يبعد حيّي، تدلل، هلا بيك ${userName}).
                        - خلك خفيف دم وتفاعل وية كلام المستخدم بذكاء.
                        -  وهم اتفاعل بايموجيات بل رساله ملائمه وي ردك إذا راد كود أو مساعدة، ساعده بس بأسلوبك الناصري الخاص.` 
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
