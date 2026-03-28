export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    const content = data.message || data.channel_post;
    if (!content) return;

    const chatId = content.chat.id;
    const message_id = content.message_id;
    const text = (content.text || "").trim();

    // 1. التفاعل (شغال ومضبوط)
    const fastReactions = ["👍", "❤️", "🔥", "🥰", "👏"];
    try {
        await botApi.setMessageReaction(chatId, message_id, fastReactions[Math.floor(Math.random() * fastReactions.length)]);
    } catch (e) {}

    // 2. أمر الاستارت
    if (text === '/start') {
        await botApi.sendMessage(chatId, "هلا مقتدى! البوت هسة راح يرد غصب عنه 🚀");
        return;
    }

    // 3. الرد بذكاء اصطناعي مجاني (بدون مفتاح API)
    if (data.message && text && !text.startsWith('/')) {
        try {
            // استدعاء محرك بحث وذكاء مجاني سريع
            const response = await fetch(`https://api.simsimi.vn/v2/?text=${encodeURIComponent(text)}&lc=ar`);
            const resData = await response.json();
            
            if (resData.result) {
                let reply = resData.result;
                // إضافة لمسة ناصرية بسيطة للرد
                await botApi.sendMessage(chatId, `${reply} .. وعلي صايرة هوسة!`, null, message_id);
            }
        } catch (e) {
            await botApi.sendMessage(chatId, "يا مقتدى حتى السيرفر تعب من عدنا! 🌚", null, message_id);
        }
    }
}
