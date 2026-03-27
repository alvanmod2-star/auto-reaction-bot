/*!
 * © [2026] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 * Modified for: Muqtada (Nasiriyah)
 */

import { startMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    let chatId, message_id, text;

    if (data.message || data.channel_post) {
        const content = data.message || data.channel_post;
        chatId = content.chat.id;
        message_id = content.message_id;
        text = content.text;

        // 1️⃣ --- كود الاشتراك الإجباري ---
        if (content.chat && content.chat.type === "private") {
            const channelUsername = "@DFD318"; 
            const botToken = "6379676688:AAFohKBLhQSYN9jdbZHKsZTkUEJvnxbbOnI";

            try {
                const userId = content.from.id;
                const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`);
                const checkData = await response.json();

                if (checkData.ok && (checkData.result.status === "left" || checkData.result.status === "kicked")) {
                    const forceSubKeyboard = [[{ "text": "📢 اشترك بالقناة لتفعيل البوت", "url": "https://t.me/DFD318" }]];
                    await botApi.sendMessage(chatId, "⚠️ | عذراً عزيزي، يجب عليك الاشتراك في القناة الرسمية أولاً.\n\n👇 اشترك ثم ارسل /start", forceSubKeyboard);
                    return; 
                }
            } catch (e) { console.log("Error in Force Sub"); }
        }

        // 2️⃣ --- أوامر البوت النصية ---
        if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
            const keyboard = [
                [{ "text": "➕ اضافة الى قناة", "url": `https://t.me/${botUsername}?startchannel=true` },
                 { "text": "➕ اضافة الى مجموعة", "url": `https://t.me/${botUsername}?startgroup=true` }],
                [{ "text": "📢 قناتي الرسمية", "url": "https://t.me/DFD318" }],
                [{ "text": "⭐ حسابي الشخصي", "url": "https://t.me/mu_312" }]
            ];
            await botApi.sendMessage(chatId, startMessage.replace('UserName', content.from.first_name || 'حياتي'), keyboard);
        } 
        else if (data.message && text === '/id') {
            const msg = `👤 **بياناتك يا بطل:**\n\n• الاسم: ${content.from.first_name}\n• الايدي: \`${content.from.id}\`\n• يوزرك: @${content.from.username || 'لا يوجد'}\n\n📢 @DFD318`;
            await botApi.sendMessage(chatId, msg);
        }
        else if (data.message && text === '/status' && content.from.id === 5794792675) {
            const date = new Date().toLocaleString('ar-IQ', { timeZone: 'Asia/Baghdad' });
            await botApi.sendMessage(chatId, `✅ البوت متصل وشغال!\n⏰ الوقت: ${date}\n📍 الموقع: الناصرية`);
        }
        else if (data.message && text === 'هلو') {
            await botApi.sendMessage(chatId, "هلوات عيوني، مقتدى يسلم عليك 🌹");
        }
        else if (data.message && text === '/reactions') {
            const reactions = Reactions.join(", ");
            await botApi.sendMessage(chatId, "✅ التفاعلات المفعلة: \n\n" + reactions);
        } 
        // 3️⃣ --- نظام التفاعل التلقائي (الأساسي) ---
        else {
            let threshold = 1 - (RandomLevel / 10);
            if (!RestrictedChats.includes(chatId)) {
                if (["group", "supergroup"].includes(content.chat.type)) {
                    if (Math.random() <= threshold) {
                        await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                    }
                } else {
                    await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                }
            }
        }
    } else if (data.pre_checkout_query) {
        await botApi.answerPreCheckoutQuery(data.pre_checkout_query.id, true);
        await botApi.sendMessage(data.pre_checkout_query.from.id, "شكرا لاستخدامك البوت ! 💝");
    }
}

        // 6️⃣ --- نظام التفاعل التلقائي (الأساسي) ---
        else {
            let threshold = 1 - (RandomLevel / 10);
            if (!RestrictedChats.includes(chatId)) {
                if (["group", "supergroup"].includes(content.chat.type)) {
                    if (Math.random() <= threshold) {
                        await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                    }
                } else {
                    await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                }
            }
        }
    } else if (data.pre_checkout_query) {
        await botApi.answerPreCheckoutQuery(data.pre_checkout_query.id, true);
    }
}
        } else {
            let threshold = 1 - (RandomLevel / 10);
            if (!RestrictedChats.includes(chatId)) {
                if (["group", "supergroup"].includes(content.chat.type)) {
                    if (Math.random() <= threshold) {
                        await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                    }
                } else {
                    await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                }
            }
        }
    } else if (data.pre_checkout_query) {
        await botApi.answerPreCheckoutQuery(data.pre_checkout_query.id, true);
        await botApi.sendMessage(data.pre_checkout_query.from.id, "شكرا لاستخدامك البوت ! 💝");
    }
}
