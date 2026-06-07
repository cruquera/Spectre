CREATE TABLE IF NOT EXISTS "AllocationSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "snapshotDate" DATETIME NOT NULL,
    "totalValue" REAL NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AllocationSnapshot_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "InvestmentPortfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "AllocationSnapshot_portfolioId_snapshotDate_key" ON "AllocationSnapshot" ("portfolioId", "snapshotDate");
