-- Email-only signups have no Google ID. The original init migration created
-- "User"."googleId" as NOT NULL, but the Prisma schema later made it optional
-- (String?) without a corresponding migration. Drop the constraint so users can
-- register via the email code flow. The unique index is retained; Postgres
-- treats multiple NULLs as distinct, so several email-only users are allowed.
ALTER TABLE "User" ALTER COLUMN "googleId" DROP NOT NULL;
