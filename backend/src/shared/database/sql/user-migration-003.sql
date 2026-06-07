CREATE TABLE IF NOT EXISTS "PortfolioAssetValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetClass" TEXT NOT NULL,
    "optionalTickerDescription" TEXT,
    "targetPercentage" REAL NOT NULL,
    "currentValue" REAL NOT NULL DEFAULT 0,
    "classTargetId" TEXT,
    "portfolioId" TEXT NOT NULL,
    CONSTRAINT "PortfolioAssetValue_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "InvestmentPortfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "LedgerEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL CHECK("eventType" IN ('INVESTMENT_CONTRIBUTION','ASSET_PURCHASE','ASSET_SALE','DIVIDEND_INCOME','INTEREST_INCOME','CRYPTO_STAKING','MANUAL_ADJUSTMENT')),
    "grossAmount" REAL NOT NULL,
    "feesAmount" REAL NOT NULL DEFAULT 0,
    "taxAmount" REAL NOT NULL DEFAULT 0,
    "netAmount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "assetValueId" TEXT NOT NULL,
    CONSTRAINT "LedgerEvent_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "InvestmentPortfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LedgerEvent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LedgerEvent_assetValueId_fkey" FOREIGN KEY ("assetValueId") REFERENCES "PortfolioAssetValue" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
