// ... الكود السابق (الاشتراك الإجباري والأوامر)

        } else if (data.message && text === '/reactions') {
            await botApi.sendMessage(chatId, "✅ تم تفعيل وضع رشق الـ 20 تفاعل بنجاح!");
        } else {
            // --- كود الرشق للقنوات ---
            if (data.channel_post && !RestrictedChats.includes(chatId)) {
                
                // قائمة الرشق (تقدر تضيف لحد 20)
                const rashqList = [
                    '👍', '❤️', '🔥', '🥰', '👏', '🤩', '🤔', '🤯', 
                    '😱', '⚡️', '🍓', '🎉', '😎', '😍', '🕊', '🤡', 
                    '💯', '🤣', '🌚', '❤️‍🔥'
                ];

                // حلقة تكرار لإرسال كل التفاعلات على نفس الرسالة
                for (const emoji of rashqList) {
                    try {
                        // إرسال التفاعل
                        await botApi.setMessageReaction(chatId, message_id, emoji);
                        
                        // تأخير بسيط جداً (150 ملي ثانية) لضمان وصول الرشق بدون حظر
                        await new Promise(resolve => setTimeout(resolve, 150));
                    } catch (e) {
                        // إذا القناة ما تدعم إيموجي معين، يطفر للي بعده
                        continue; 
                    }
                }
            } else if (data.message && !RestrictedChats.includes(chatId)) {
                // إذا كانت رسالة عادية بمجموعة، يكتفي بتفاعل واحد عشوائي (اختياري)
                await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
            }
        }
// ... تكملة الملف
