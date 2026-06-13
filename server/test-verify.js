require('dotenv').config({ path: '../.env' });
const express = require('express');
const emailAuth = require('./src/routes/emailAuth');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use('/auth/email', emailAuth);
app.listen(3003, async () => {
  console.log('Server running on 3003');
  const axios = require('axios');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const records = await prisma.emailVerification.findMany();
    // I don't know the plain code!
    // But what if the issue is in verify-code with bcrypt?
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
});
