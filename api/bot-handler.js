export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim().toLowerCase();
        const userName = message.from ? message.from.first_name : "الغالي";

        // 1. التفاعلات التلقائية (💘🌚💋💗)
        const myReactions = ["💘", "🌚", "💋", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. أوامر الصيد (سداسي/سباعي)
        if (text === 'صيد' || text === '/hunt') {
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789_";
            let foundUsers = [];
            
            // توليد 5 يوزرات سداسية/سباعية عشوائية كنموذج فحص سريع
            for (let i = 0; i < 5; i++) {
                let len = Math.floor(Math.random() * 2) + 6; // 6 أو 7
                let user = "";
                for (let j = 0; j < len; j++) user += chars.charAt(Math.floor(Math.random() * chars.length));
                foundUsers.push(`\`${user}\``);
            }

            const huntText = `🚀 **جارِ الصيد يا وحش الناصرية...**\n\n🎯 يوزرات مقترحة للفحص (سداسي/سباعي):\n${foundUsers.join('\n')}\n\n💡 استخدم سكربت البايثون اللي عندك لفحص المتاح منها هسة!`;
            await botApi.sendMessage(chatId, huntText, "Markdown", message_id);
            return;
        }

        // 3. واجهة البداية /start
        if (text === '/start') {
            const welcomeText = `✨ **هلا بيك يا بعد روحي مقتدى نورت** ✨\n\nأنا بوتك المطور بذكاء GROK واللمسة العراقية.\n\n📌 **شنو اگدر أسوي؟**\n• أرد عليك بلهجتنا (سولف وياي).\n• أتفاعل وية رسائلك تلقائياً 🌚.\n• أساعدك بصيد اليوزرات (اكتب 'صيد').\n• أصمم لك أكواد وهاكات 🚀.\n\nتفضل اسأل أي شي يا غالي 💋.`;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return;
        }

        // 4. الذكاء الاصطناعي (GROK / Llama-3.3)
        const GROQ_KEY = "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";
        
        const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                        content: `أنت 'مساعد مقتدى الشخصي'. عراقي من الناصرية، مرح جداً، خفيف دم، وحنون.
                        - رد بلهجة عراقية قحة (يا بعد روحي، تدلل عيني، نورت يا وحش).
                        - أنت خبير برمجة بايثون وصناعة هاكات ألعاب (مثل سابوي وتيك توك).
                        - إذا سألك مقتدى عن الصيد، شجعه وأعطيه نصائح احترافية.
                        - استخدم إيموجيات (🌚, 💋, 🚀, 🔥) بكثرة.` 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await aiResponse.json();

        if (resData.choices && resData.choices[0].message) {
            const reply = resData.choices[0].message.content;
            await botApi.sendMessage(chatId, reply, null, message_id);
        }

    } catch (e) {
        console.log("Error in Maktada Bot Logic");
    }
}
