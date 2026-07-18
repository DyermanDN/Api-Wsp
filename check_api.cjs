const { Client } = require('@botpress/client');
console.log(Object.keys(new Client({}).chat || {}));
