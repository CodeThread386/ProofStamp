require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const stamp = await prisma.stamp.findUnique({ where: { id: "PS-2026-99HC4" } });
  console.log("Stamp found:", stamp ? "YES" : "NO");
  if (stamp) console.log("tsaProviderName:", stamp.tsaProviderName);
}

main().finally(() => prisma.$disconnect());
