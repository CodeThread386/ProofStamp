require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { encryptPrivateKey } = require('./src/utils/crypto');

const prisma = new PrismaClient();

function generatePassportId() {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PP-${year}-${random}`;
}

async function main() {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const passportId = generatePassportId();
    const encryptedPrivateKey = encryptPrivateKey(privateKey, {
      userId: 'pending',
      passportId,
    });

    console.log("Creating user...");
    const created = await prisma.user.create({
      data: {
        googleId: 'test-google-id-' + Date.now(),
        email: `test-${Date.now()}@example.com`,
        emailVerified: true,
        avatarUrl: null,
        passport: {
          create: {
            id: passportId,
            displayName: "Test User",
            publicKey,
            privateKey: encryptedPrivateKey,
          },
        },
      },
      include: { passport: true },
    });
    
    console.log("Created successfully:", created.id);
  } catch(e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
