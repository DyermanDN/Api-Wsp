const axios = require('axios');
const CLIENT_ID = '282b5aa2-003a-4024-842d-7fa78fd4aa4a';

async function test() {
    try {
        console.log('Creating user...');
        const { data: userData } = await axios.post(`https://chat.botpress.cloud/${CLIENT_ID}/users`, {});
        console.log('User created:', userData.user.id);
        
        console.log('Creating conversation...');
        const { data: convData } = await axios.post(`https://chat.botpress.cloud/${CLIENT_ID}/conversations`, {}, {
            headers: { 'x-user-key': userData.key }
        });
        console.log('Conversation created:', convData.conversation.id);
        
        console.log('Sending message...');
        const { data: msgData } = await axios.post(`https://chat.botpress.cloud/${CLIENT_ID}/messages`, {
            conversationId: convData.conversation.id,
            payload: { type: 'text', text: 'Hello from API!' }
        }, {
            headers: { 'x-user-key': userData.key }
        });
        console.log('Message sent:', msgData.message.id);
    } catch (e) {
        console.error('Error:', e.response ? e.response.data : e.message);
    }
}
test();
