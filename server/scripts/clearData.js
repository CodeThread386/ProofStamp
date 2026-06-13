require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting safe data cleanup...");

  // Delete all data in reverse dependency order
  

  
  // Audits & Webhooks
  await prisma.auditLog.deleteMany({});
  await prisma.webhookDelivery.deleteMany({});
  await prisma.webhookEndpoint.deleteMany({});
  
  // Notifications
  await prisma.userNotification.deleteMany({});
  
  // Blockchain
  await prisma.stampAnchor.deleteMany({});
  await prisma.blockchainAnchor.deleteMany({});
  
  // Takedowns & Monitors
  await prisma.takedown.deleteMany({});
  await prisma.monitorAlert.deleteMany({});
  await prisma.monitor.deleteMany({});
  
  // Stamps & Passports
  await prisma.stampVersion.deleteMany({});
  await prisma.stamp.deleteMany({});
  
  await prisma.apiKey.deleteMany({});
  await prisma.passport.deleteMany({});
  
  // Base Users & Verifications
  await prisma.emailVerification.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log("All user data cleared safely! Schema remains intact.");
}

main()
  .catch(e => {
    console.error("Error during cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
