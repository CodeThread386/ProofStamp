require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    // 1. Create a user if not exists
    let user = await prisma.user.findUnique({ where: { email: 'testotp@test.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'testotp@test.com' }
      });
    }

    // 2. Request OTP
    console.log('Requesting OTP...');
    // We need to hit the real server or the mock one
    // But since we want to hit the REAL server, let's start it in a separate process or just use supertest?
    // Let's just use Prisma to mock the DB logic.
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
