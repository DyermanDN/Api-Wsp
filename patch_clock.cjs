const fs = require('fs');
const path = 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\index.js';
let content = fs.readFileSync(path, 'utf8');

// Replace waitForBotpressReply signature and logic
content = content.replace(
    /async function waitForBotpressReply\(conversationId, userKey, bpUserId, afterDate\) \{[\s\S]*?return \[\];\n\}/,
    `async function waitForBotpressReply(conversationId, userKey, bpUserId, userMessageId) {
    const maxRetries = 15; // 30 segundos máximo
    
    for (let i = 0; i < maxRetries; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            const res = await fetch(\`https://chat.botpress.cloud/\$\{CLIENT_ID\}/conversations/\$\{conversationId\}/messages\`, {
                headers: { 'x-user-key': userKey }
            });
            const data = await res.json();
            const messages = data.messages || [];
            
            messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            
            const myMsgIndex = messages.findIndex(m => m.id === userMessageId);
            if (myMsgIndex !== -1) {
                const newMessages = messages.slice(myMsgIndex + 1).filter(m => m.userId !== bpUserId);
                if (newMessages.length > 0) {
                    return newMessages;
                }
            }
        } catch (err) {
            console.error("Error consultando mensajes a Botpress:", err.message);
        }
    }
    return [];
}`
);

// Replace message creation and calling waitForBotpressReply
content = content.replace(
    /const now = new Date\(\);\n\n        await fetch\(`https:\/\/chat.botpress.cloud\/\$\{CLIENT_ID\}\/messages`[\s\S]*?const botReplies = await waitForBotpressReply\(bpConversation.id, bpSession.key, bpSession.user.id, now\);/,
    `const msgRes = await fetch(\`https://chat.botpress.cloud/\$\{CLIENT_ID\}/messages\`, {
            method: 'POST',
            headers: { 'x-user-key': bpSession.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: bpConversation.id,
                payload: { type: 'text', text: message.body }
            })
        });
        const msgData = await msgRes.json();
        
        console.log(\`[BOTPRESS] Mensaje enviado a la nube. Esperando respuesta...\`);

        const botReplies = await waitForBotpressReply(bpConversation.id, bpSession.key, bpSession.user.id, msgData.message.id);`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Clock skew patch aplicado exitosamente.');
