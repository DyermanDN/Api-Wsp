const CLIENT_ID = '282b5aa2-003a-4024-842d-7fa78fd4aa4a';

async function test() {
    try {
        console.log('Creating user...');
        const userRes = await fetch(`https://chat.botpress.cloud/${CLIENT_ID}/users`, { method: 'POST', body: '{}' });
        const userData = await userRes.json();
        
        console.log('Creating conversation...');
        const convRes = await fetch(`https://chat.botpress.cloud/${CLIENT_ID}/conversations`, {
            method: 'POST', body: '{}', headers: { 'x-user-key': userData.key }
        });
        const convData = await convRes.json();
        
        console.log('Listing messages...');
        const listRes = await fetch(`https://chat.botpress.cloud/${CLIENT_ID}/conversations/${convData.conversation.id}/messages`, {
            headers: { 'x-user-key': userData.key }
        });
        const listData = await listRes.json();
        console.log('Messages:', listData);
    } catch (e) {
        console.error('Error:', e.message);
    }
}
test();
