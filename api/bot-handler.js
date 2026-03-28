// --- نظام رشق البوتات المتعددة (نسخة محسنة) ---
if (data.channel_post && !RestrictedChats.includes(chatId)) {
    const emojis = ['👍', '❤️']; 

    for (let i = 0; i < botTokens.length; i++) {
        try {
            const token = botTokens[i];
            const emoji = emojis[i] || '🔥';

            // طلب التفاعل
            const res = await fetch(`https://api.telegram.org/bot${token}/setMessageReaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: message_id,
                    reaction: [{ type: 'emoji', emoji: emoji }]
                })
            });
            
            const result = await res.json();
            if (!result.ok) {
                console.log(`❌ البوت ${i+1} فشل: ${result.description}`);
            } else {
                console.log(`✅ البوت ${i+1} نجح بوضع ${emoji}`);
            }

            // تأخير 300 ملي ثانية بين البوتات
            await new Promise(r => setTimeout(r, 300));

        } catch (e) {
            console.log(`❌ خطأ بالاتصال للبوت ${i+1}`);
        }
    }
}
