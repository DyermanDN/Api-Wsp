const { Client } = require('@botpress/client');
require('dotenv').config({ path: 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\.env' });
const bp = new Client({
    token: process.env.BOTPRESS_TOKEN,
    workspaceId: process.env.BOTPRESS_WORKSPACE_ID,
    botId: process.env.BOTPRESS_BOT_ID
});

async function test() {
    try {
        console.log('Test 1: whatsapp');
        await bp.createUser({ tags: {}, integrationName: 'whatsapp' });
        console.log('Exito whatsapp');
    } catch (e) {
        console.log('Error whatsapp:', e.message);
    }
    
    try {
        console.log('Test 2: telegram');
        await bp.createUser({ tags: {}, integrationName: 'telegram' });
        console.log('Exito telegram');
    } catch (e) {
        console.log('Error telegram:', e.message);
    }
}
test();
