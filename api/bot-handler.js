export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();

        // 1. تفاعل حتى نعرف البوت عايش
        await botApi.setMessageReaction(chatId, message_id, "⚡").catch(() => {});

        if (text.startsWith('/')) return;

        // 2. استخدام ذكاء اصطناعي بديل (بدون Gemini)
        // هذا رابط مباشر لموديل Mistral - سريع ومجاني للطلبات البسيطة
        const url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // إذا عندك حساب Hugging Face حط توكن هنا، إذا ما عندك جرب بدونه (يشتغل لعدد محدد)
                'Authorization': 'Bearer hf_vSLLpXmXvJqWpWpWpWpWpWpWpW' 
            },
            body: JSON.stringify({
                inputs: `رد بكلمة وحدة بلهجة ناصرية مضحكة جداً على: ${text}`,
                parameters: { max_new_tokens: 10 }
            })
        });

        const resData = await response.json();

        // 3. الرد على المستخدم
        if (resData && resData[0] && resData[0].generated_text) {
            let aiReply = resData[0].generated_text.split(':').pop().trim();
            await botApi.sendMessage(chatId, aiReply, null, message_id);
        } else {
            // إذا فشل البديل، نرجع نعاتب حظنا بكلمة ناصرية ثابتة
            await botApi.sendMessage(chatId, "أني اعتذر مقتدى، السيرفرات اليوم عطلانة"، null, message_id);
        }

    } catch (e) {
        console.log("Error in alternative AI");
    }
}
