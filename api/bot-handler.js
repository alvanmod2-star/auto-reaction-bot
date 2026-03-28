export async function onUpdate(data, botApi) {
    try {
        const content = data.message || data.channel_post;
        if (!content || !content.text) return;

        const chatId = content.chat.id;
        const message_id = content.message_id;
        const text = content.text.trim();

        // 1. التفاعل السريع (حتى تعرف البوت استلم)
        await botApi.setMessageReaction(chatId, message_id, "🔥").catch(() => {});

        if (text.startsWith('/')) return;

        const apiKey = "AIzaSyB2VrseqlXOGA7cCiD_QGj2LUU5YaYsfBs"; // مفتاحك الشغال
        
        // مصفوفة موديلات - إذا فشل واحد يجرب الثاني
        const models = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro"
        ];

        let success = false;

        for (const model of models) {
            if (success) break;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `رد بكلمة ناصرية وحدة بس على: ${text}` }] }]
                    })
                });

                const aiData = await response.json();

                if (aiData.candidates && aiData.candidates[0].content) {
                    const reply = aiData.candidates[0].content.parts[0].text;
                    await botApi.sendMessage(chatId, reply, null, message_id);
                    success = true;
                }
            } catch (e) {}
        }

        if (!success) {
            await botApi.sendMessage(chatId, "مقتدى، ولا موديل رهم! الرابط جاي يتغير، صبرك عليّ.");
        }

    } catch (e) {}
}
