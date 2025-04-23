-- DropIndex
DROP INDEX "Wallet_name_key";

-- CreateIndex
CREATE INDEX "Wallet_name_idx" ON "Wallet"("name");
