export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "الغالي";

        // 1. التفاعلات اللي ردتها (💘🌚💋💗)
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. إذا جانت الرسالة /start تطلع الواجهة
        if (text === '/start') {
            const welcomeText = `
✨ **هلا بيك يا بعد روحي نورت بوت مقتدى** ✨

أنا مساعدك الشخصي "تيلكرام" ذكاء اصطناعي بس بلمسة عراقية.
سولف وياي، تشاقى، اسأل.. أنا بالخدمة.

📌 **شنو أگدر أسوي؟**
• أرد عليك بلهجتنا الحلوة.
• أتفاعل وياك بالحب والحنان.
• أونسك بشقاي ومرحي.

⚠️ **ملاحظة:** خليك مؤدب حتى أحطك على راسي 🌚💋.
            `;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return; // هنا ننهي الدالة حتى ما يروح للذكاء الاصطناعي مرتين
        }

        // 3. إذا جان كلام عادي يروح للذكاء الاصطناعي (Groq)
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
                        content: `أنت 'تيلكرام مساعدك الشخصي'. عراقي مرح، خلقه وأخلاق جداً، ولطيف.
                        - رد بلهجة عراقية (مثلاً: يا بعد روحي، تدلل عيني، هلا بيك ${userName}).
                        - ومساعد أكواد بايثون وجميع أنواع البرمجة، خفيف دم ومحبوب وحنون وابتعد عن الغلط وايضا مخالف للثوانين وتساعد في صناعه هاكات للالعاب .
                        - رد على المستخدم بنفس أسلوبه مع إيموجيات متناسقة وية الرسالة.` 
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
        console.log("Error logic");
    }
            }
