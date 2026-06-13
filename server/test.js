const { issueAuthToken } = require('./src/utils/authTokens');
console.log(issueAuthToken({ id: 'test', passport: { id: 'pp', username: 'usr' } }));
