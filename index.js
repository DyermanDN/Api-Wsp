require('dotenv').config();
const { Client: WhatsAppClient, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const CLIENT_ID = '282b5aa2-003a-4024-842d-7fa78fd4aa4a'; // Webchat Integration ID for MEDI-BOT

// Mapas para almacenar los datos de sesión de Botpress (user, key, conversation)
const userMap = new Map();
const conversationMap = new Map();

const client = new WhatsAppClient({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('\n======================================================');
    console.log('¡CÓDIGO QR GENERADO! ESCANÉALO CON TU WHATSAPP:');
    console.log('======================================================\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n✅ ¡El Bot de WhatsApp está conectado y listo!');
    console.log('✅ Escuchando mensajes para enviarlos a Botpress...\n');
});

// Función de polling para esperar la respuesta de Botpress usando Chat API
async function waitForBotpressReply(conversationId, userKey, bpUserId, userMessageId) {
    const maxRetries = 15; // 30 segundos máximo
    
    for (let i = 0; i < maxRetries; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            const res = await fetch(`https://chat.botpress.cloud/${CLIENT_ID}/conversations/${conversationId}/messages`, {
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
}

client.on('message', async (message) => {
    if (message.from === 'status@broadcast') return;
    if (message.from.includes('@g.us')) return; // Ignorar mensajes de grupos

    console.log(`\n[WHATSAPP] Recibido de ${message.from}: ${message.body}`);

    try {
        let bpSession = userMap.get(message.from);
        if (!bpSession) {
            const res = await fetch(`https://chat.botpress.cloud/${CLIENT_ID}/users`, { method: 'POST', body: '{}' });
            bpSession = await res.json();
            userMap.set(message.from, bpSession);
        }

        let bpConversation = conversationMap.get(message.from);
        if (!bpConversation) {
            const res = await fetch(`https://chat.botpress.cloud/${CLIENT_ID}/conversations`, {
                method: 'POST', body: '{}', headers: { 'x-user-key': bpSession.key }
            });
            const data = await res.json();
            bpConversation = data.conversation;
            conversationMap.set(message.from, bpConversation);
        }

        const msgRes = await fetch(`https://chat.botpress.cloud/${CLIENT_ID}/messages`, {
            method: 'POST',
            headers: { 'x-user-key': bpSession.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: bpConversation.id,
                payload: { type: 'text', text: message.body }
            })
        });
        const msgData = await msgRes.json();
        
        console.log(`[BOTPRESS] Mensaje enviado a la nube. Esperando respuesta...`);

        const botReplies = await waitForBotpressReply(bpConversation.id, bpSession.key, bpSession.user.id, msgData.message.id);
        
        for (const reply of botReplies) {
            if (reply.payload) {
                if (reply.payload.type === 'carousel' && reply.payload.items) {
                    let text = "🎓 *Catálogo de Maestrías disponibles:*\n\n";
                    const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
                    reply.payload.items.forEach((item, index) => {
                        const emoji = index < 10 ? numberEmojis[index] : `*${index + 1}.*`;
                        text += `${emoji} *${item.title}*\n_${item.subtitle}_\n\n`;
                    });
                    text += "👉 *Responde con el NÚMERO de la maestría (ejemplo: \"1\") para darte más información o el brochure interactivo.*";
                    console.log(`[BOTPRESS] Respondiendo Carrusel interactivo adaptado a WSP`);
                    await message.reply(text);
                } else if (reply.payload.type === 'choice' && reply.payload.text) {
                    let text = reply.payload.text + '\n';
                    if (reply.payload.options) {
                        reply.payload.options.forEach((opt, index) => {
                            text += `\n${index + 1}. ${opt.label}`;
                        });
                    }
                    console.log(`[BOTPRESS] Respondiendo Opciones:\n${text}`);
                    await message.reply(text);
                } else if (reply.payload.text) {
                    console.log(`[BOTPRESS] Respondiendo: ${reply.payload.text}`);
                    await message.reply(reply.payload.text);
                } else {
                    console.log(`[BOTPRESS] Ignorando tipo de payload desconocido:`, reply.payload);
                }
            }
        }
    } catch (error) {
        console.error("❌ Error en el flujo con Botpress:", error.message);
    }
});

client.initialize();


// ==== EXPRESS SERVER PARA OUTBOUND (MENSAJES SALIENTES) ====
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-message', async (req, res) => {
    try {
        const { phone, text } = req.body;
        if (!phone || !text) {
            return res.status(400).json({ error: 'Faltan datos: phone y text' });
        }
        
        let cleanPhone = phone.toString().replace(/[^0-9]/g, '');
        const chatId = `${cleanPhone}@c.us`;
        
        console.log(`[OUTBOUND] Enviando mensaje automático a ${chatId}...`);
        
        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            console.log(`[OUTBOUND] El número ${chatId} no está registrado en WhatsApp.`);
            return res.status(404).json({ error: 'Número no registrado en WhatsApp.' });
        }

        await client.sendMessage(chatId, text);
        console.log(`[OUTBOUND] ¡Mensaje enviado con éxito a ${phone}!`);
        
        return res.status(200).json({ success: true, message: 'Mensaje enviado.' });
    } catch (error) {
        console.error('[OUTBOUND] Error al enviar mensaje:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor Outbound (API) de WhatsApp escuchando en http://localhost:${PORT}`);
});
