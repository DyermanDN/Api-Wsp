const fs = require('fs');
const path = 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\index.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('await bp.createUser({ tags: {} })', "await bp.createUser({ tags: {}, integrationName: 'webchat' })");
content = content.replace('await bp.createConversation({ tags: {} })', "await bp.createConversation({ tags: {}, integrationName: 'webchat' })");

// Fallbacks if they were already modified in different ways
if (!content.includes('integrationName')) {
    content = content.replace('await bp.createUser({})', "await bp.createUser({ tags: {}, integrationName: 'webchat' })");
    content = content.replace('await bp.createConversation({})', "await bp.createConversation({ tags: {}, integrationName: 'webchat' })");
}

fs.writeFileSync(path, content, 'utf8');
console.log('integrationName añadido a index.js');
