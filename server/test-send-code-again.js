require('dotenv').config({ path: '../.env' });
const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:3001/auth/email/send-code', {
      email: 'sarthaktrivedi386@gmail.com',
      purpose: 'signup'
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

test();
