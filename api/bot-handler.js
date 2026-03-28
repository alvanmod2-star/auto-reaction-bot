export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = (content.text || "").trim();

    // 1. التفاعل التلقائي (شغال عندك 100%)
    try {
        const emojis = ["👍", "❤️", "🔥", "🥰", "👏"];
        await botApi.setMessageReaction(chatId, message_id, emojis[Math.floor(Math.random() * emojis.length)]);
    } catch (e) {}

    // 2. الرد بالذكاء الاصطناعي - محاولة أخيرة برابط عام
    if (data.message && text && !text.startsWith('/')) {
        const apiKey = "AIzaSyBmDxL3cI9mQhkHPApRTQnSnsGz4j6neDU"; 
        // استخدمنا أحدث رابط متاح حالياً
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `رد بلهجة أهل الناصرية وبسرعة على: ${text}` }] }]
                })
            });

            const resJson = await response.json();

            if (resJson.candidates && resJson.candidates[0].content) {
                const reply = resJson.candidates[0].content.parts[0].text;
                await botApi.sendMessage(chatId, reply, null, message_id);
            } else {
                // إذا جوجل عاندت، البوت راح يرد من عنده حتى لا يضل معلّق
                const backUpReplies = ["هلة بمقتدى الغالي.. جوجل اليوم قافلة وياي!", "تدلل يا ناصري، بس خل يصفى بال جوجل وأرد عليك.", "مقتدى، السيرفر تعبان والنت زربان!"];
                await botApi.sendMessage(chatId, backUpReplies[Math.floor(Math.random() * backUpReplies.length)], null, message_id);
            }
        } catch (e) {
            await botApi.sendMessage(chatId, "أكو خلل بالشبكة يا مقتدى.. صبراً!", null, message_id);
        }
    }

    if (text === '/start') {
        await botApi.sendMessage(chatId, "هلا مقتدى! البوت هسة المفروض انفك نحسه 🚀");
    }
        }
