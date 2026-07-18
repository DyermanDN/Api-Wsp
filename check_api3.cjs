const { Client } = require('@botpress/client');
require('dotenv').config({ path: 'C:\\\\DEV\\\\API_WSP\\\\whatsapp-bot\\\\.env' });
const bp = new Client({
    token: process.env.BOTPRESS_TOKEN,
    workspaceId: process.env.BOTPRESS_WORKSPACE_ID,
    botId: process.env.BOTPRESS_BOT_ID
});

async function test() {
    try {
        const bot = await bp.getBot({ id: process.env.BOTPRESS_BOT_ID });
        console.log('Bot Integrations:', bot.bot.integrations);
    } catch (e) {
        console.log('Error:', e.message);
    }
}
test();
