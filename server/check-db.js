require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({ where: { email: 'sarthaktrivedi386@gmail.com' } });
  console.log('User:', user);
  const v = await prisma.emailVerification.findMany({ where: { email: 'sarthaktrivedi386@gmail.com' } });
  console.log('Verifications:', v);
  process.exit(0);
}
check();
