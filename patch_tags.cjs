const fs = require('fs');
const path = 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\index.js';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('await bp.createUser({})', 'await bp.createUser({ tags: {} })');
content = content.replace('await bp.createConversation({})', 'await bp.createConversation({ tags: {} })');
content = content.replace(`        await bp.createMessage({
            conversationId: bpConversation.id,
            userId: bpUser.id,
            payload: {
                type: 'text',
                text: message.body
            }
        });`, `        await bp.createMessage({
            conversationId: bpConversation.id,
            userId: bpUser.id,
            tags: {},
            payload: {
                type: 'text',
                text: message.body
            }
        });`);

fs.writeFileSync(path, content, 'utf8');
console.log('Tags añadidos a index.js correctamente.');
