const fs = require('fs');
const path = 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\index.js';
let content = fs.readFileSync(path, 'utf8');

const oldCarouselCode = `                if (reply.payload.type === 'carousel' && reply.payload.items) {
                    let text = "🎓 *Catálogo de Maestrías disponibles:*\\n\\n";
                    reply.payload.items.forEach((item, index) => {
                        text += \`🔸 *\${item.title}*\\n_\${item.subtitle}_\\n\\n\`;
                    });
                    text += "👉 *Escribe el nombre de la opción que te interesa para darte el brochure interactivo.*";
                    console.log(\`[BOTPRESS] Respondiendo Carrusel adaptado a WSP\`);
                    await message.reply(text);
                }`;

const newCarouselCode = `                if (reply.payload.type === 'carousel' && reply.payload.items) {
                    let text = "🎓 *Catálogo de Maestrías disponibles:*\\n\\n";
                    const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
                    reply.payload.items.forEach((item, index) => {
                        const emoji = index < 10 ? numberEmojis[index] : \`*\${index + 1}.*\`;
                        text += \`\${emoji} *\${item.title}*\\n_\${item.subtitle}_\\n\\n\`;
                    });
                    text += "👉 *Responde con el NÚMERO de la maestría (ejemplo: \\"1\\") para darte más información o el brochure interactivo.*";
                    console.log(\`[BOTPRESS] Respondiendo Carrusel interactivo adaptado a WSP\`);
                    await message.reply(text);
                }`;

if (content.includes(oldCarouselCode)) {
    content = content.replace(oldCarouselCode, newCarouselCode);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Patch de menú interactivo aplicado con éxito.');
} else {
    console.log('No se encontró el código antiguo. Puede que ya esté parcheado o haya cambiado.');
}
