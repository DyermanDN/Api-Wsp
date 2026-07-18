const { Client } = require('@botpress/client');
require('dotenv').config({ path: 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\.env' });
const bp = new Client({
    token: process.env.BOTPRESS_TOKEN,
    workspaceId: process.env.BOTPRESS_WORKSPACE_ID,
    botId: process.env.BOTPRESS_BOT_ID
});

async function test() {
    try {
        console.log('Test 3: webhook');
        await bp.createUser({ tags: {}, integrationName: 'webhook' });
        console.log('Exito webhook');
    } catch (e) {
        console.log('Error webhook:', e.message);
    }
}
test();
