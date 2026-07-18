const fs = require('fs');
const path = 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\index.js';

let content = fs.readFileSync(path, 'utf8');

if (!content.includes('EXPRESS SERVER PARA OUTBOUND')) {
    const apiCode = `

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
        const chatId = \`\${cleanPhone}@c.us\`;
        
        console.log(\`[OUTBOUND] Enviando mensaje automático a \${chatId}...\`);
        
        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            console.log(\`[OUTBOUND] El número \${chatId} no está registrado en WhatsApp.\`);
            return res.status(404).json({ error: 'Número no registrado en WhatsApp.' });
        }

        await client.sendMessage(chatId, text);
        console.log(\`[OUTBOUND] ¡Mensaje enviado con éxito a \${phone}!\`);
        
        return res.status(200).json({ success: true, message: 'Mensaje enviado.' });
    } catch (error) {
        console.error('[OUTBOUND] Error al enviar mensaje:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(\`\\n🚀 Servidor Outbound (API) de WhatsApp escuchando en http://localhost:\${PORT}\`);
});
`;

    fs.appendFileSync(path, apiCode, 'utf8');
    console.log('API Express agregada a index.js con éxito.');
} else {
    console.log('La API Express ya estaba configurada.');
}
