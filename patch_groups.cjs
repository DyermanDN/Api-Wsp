const fs = require('fs');
const path = 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\index.js';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes("@g.us")) {
    content = content.replace("if (message.from === 'status@broadcast') return;", "if (message.from === 'status@broadcast') return;\n    if (message.from.includes('@g.us')) return; // Ignorar mensajes de grupos");
    fs.writeFileSync(path, content, 'utf8');
    console.log('Filtro de grupos añadido con éxito.');
} else {
    console.log('El filtro de grupos ya existe.');
}
