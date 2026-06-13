require('dotenv').config({ path: './.env' });
const { createUserWithPassport } = require('./server/src/services/userProvisioning');

async function test() {
  try {
    const user = await createUserWithPassport({
      email: 'test-signup-' + Date.now() + '@example.com',
      displayName: 'Test User'
    });
    console.log('User created:', user.id);
  } catch (err) {
    console.error('Error creating user:', err);
  }
}
test();
