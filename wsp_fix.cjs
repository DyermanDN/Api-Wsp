const fs = require('fs');
const path = 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\index.js';

let content = fs.readFileSync(path, 'utf8');

const regex = /for\s*\(const\s+reply\s+of\s+botReplies\)\s*\{[\s\S]*?(?=\}\s*catch\s*\(\s*error\s*\)\s*\{)/;

const newBlock = `for (const reply of botReplies) {
            if (reply.payload) {
                if (reply.payload.type === 'carousel' && reply.payload.items) {
                    let text = "🎓 *Catálogo de Maestrías disponibles:*\\n\\n";
                    reply.payload.items.forEach((item, index) => {
                        text += \`🔸 *\${item.title}*\\n_\${item.subtitle}_\\n\\n\`;
                    });
                    text += "👉 *Escribe el nombre de la opción que te interesa para darte el brochure interactivo.*";
                    console.log(\`[BOTPRESS] Respondiendo Carrusel adaptado a WSP\`);
                    await message.reply(text);
                } else if (reply.payload.type === 'choice' && reply.payload.text) {
                    let text = reply.payload.text + '\\n';
                    if (reply.payload.options) {
                        reply.payload.options.forEach((opt, index) => {
                            text += \`\\n\${index + 1}. \${opt.label}\`;
                        });
                    }
                    console.log(\`[BOTPRESS] Respondiendo Opciones:\\n\${text}\`);
                    await message.reply(text);
                } else if (reply.payload.text) {
                    console.log(\`[BOTPRESS] Respondiendo: \${reply.payload.text}\`);
                    await message.reply(reply.payload.text);
                } else {
                    console.log(\`[BOTPRESS] Ignorando tipo de payload desconocido:\`, reply.payload);
                }
            }
        }
    `;

content = content.replace(regex, newBlock);

fs.writeFileSync(path, content, 'utf8');
console.log('Puente de WhatsApp actualizado correctamente.');
