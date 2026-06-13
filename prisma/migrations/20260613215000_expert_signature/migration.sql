-- AlterTable
ALTER TABLE "Passport" ADD COLUMN "ekycId" TEXT;
ALTER TABLE "Passport" ADD COLUMN "ekycName" TEXT;
ALTER TABLE "Passport" ADD COLUMN "ekycProvider" TEXT;
ALTER TABLE "Passport" ADD COLUMN "ekycVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Stamp" ADD COLUMN "expertId" TEXT;
ALTER TABLE "Stamp" ADD COLUMN "expertName" TEXT;
ALTER TABLE "Stamp" ADD COLUMN "expertSignature" TEXT;
ALTER TABLE "Stamp" ADD COLUMN "expertSignatureDate" TIMESTAMP(3);
