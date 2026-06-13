require('dotenv').config({ path: './.env' });
const { sendVerificationCode } = require('./server/src/services/email');

async function test() {
  console.log('Testing Gmail API...');
  const result = await sendVerificationCode('sarthaktrivedi386@gmail.com', '123456', 'signup');
  console.log('Result:', result);
}
test();
