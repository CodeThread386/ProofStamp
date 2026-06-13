require('dotenv').config({ path: '../.env' });
const express = require('express');
const emailAuth = require('./src/routes/emailAuth');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use('/auth/email', emailAuth);
app.listen(3002, async () => {
  console.log('Server running on 3002');
  const axios = require('axios');
  try {
    const res = await axios.post('http://localhost:3002/auth/email/send-code', {
      email: 'rarealriree@gmail.com',
      purpose: 'login'
    });
    console.log('Send-code response:', res.data);
    
    // Now get the code from DB
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const records = await prisma.emailVerification.findMany();
    console.log('Email verifications:', records);
    
    if (records.length > 0) {
      // It's hashed, but we can check if it exists
      // The code is sent to email, we can't get it from DB. 
      // But wait, the email is sent via SMTP!
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
});
