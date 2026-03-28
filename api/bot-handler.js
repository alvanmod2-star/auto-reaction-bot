export async function onUpdate(data, botApi, env) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim();
        const userName = message.from ? message.from.first_name : "يبعد حيّي";

        // 1. تفاعل سريع (إيموجي يضحك لأن البوت ضريف)
        await botApi.setMessageReaction(chatId, message_id, "🤣").catch(() => {});

        // 2. مفتاح Groq (تأكد إنه مو مسرب أو محذوف)
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
                        content: `أنت 'بوت مقتدى'. شخصيتك: ابن نصرية، لسانك ينقط عسل وشقاوة.
                        - رد بلهجة أهل الناصرية القوية (مثلاً: هااا شني، يبعد طوايفي، دهاك استلم).
                        - إذا طلبوا كود أو روابط، انطيهمياها بذكاء بس اتمضحك وياهم.
                        
