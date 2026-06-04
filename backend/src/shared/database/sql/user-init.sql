CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Account_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "AssetIdentifier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "AssetIdentifier_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX "Strategy_key_key" ON "Strategy"("key");

CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL DEFAULT 'BRL',
    "strategyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Portfolio_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "PortfolioAccount" (
    "portfolioId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    CONSTRAINT "PortfolioAccount_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("portfolioId", "accountId")
);

CREATE TABLE "CategoryAllocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetPercent" REAL NOT NULL,
    CONSTRAINT "CategoryAllocation_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CategoryAllocation_portfolioId_category_key" ON "CategoryAllocation"("portfolioId", "category");

CREATE TABLE "AssetTargetAllocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "targetPercent" REAL NOT NULL,
    CONSTRAINT "AssetTargetAllocation_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssetTargetAllocation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "AssetTargetAllocation_portfolioId_assetId_key" ON "AssetTargetAllocation"("portfolioId", "assetId");

CREATE TABLE "Position" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "averageCost" REAL NOT NULL,
    "costCurrency" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Position_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Position_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Position_accountId_assetId_key" ON "Position"("accountId", "assetId");

CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unitPrice" REAL NOT NULL,
    "fees" REAL NOT NULL DEFAULT 0,
    "taxes" REAL NOT NULL DEFAULT 0,
    "tradeDate" DATETIME NOT NULL,
    "settlementDate" DATETIME,
    "currency" TEXT NOT NULL,
    "fxRate" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "TransactionLot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "remainingQty" REAL NOT NULL,
    "costBasis" REAL NOT NULL,
    "acquiredAt" DATETIME NOT NULL,
    CONSTRAINT "TransactionLot_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "InvestmentBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BlockAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blockId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "priority" INTEGER,
    CONSTRAINT "BlockAsset_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "InvestmentBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlockAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "BlockAsset_blockId_assetId_key" ON "BlockAsset"("blockId", "assetId");

CREATE TABLE "MonthlyBlockSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "blockId" TEXT NOT NULL,
    CONSTRAINT "MonthlyBlockSchedule_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "InvestmentBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "MonthlyBlockSchedule_year_month_key" ON "MonthlyBlockSchedule"("year", "month");

CREATE TABLE "ContributionPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "plannedDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContributionPlan_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ContributionSuggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "suggestedAmount" REAL NOT NULL,
    "rationale" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "ContributionSuggestion_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ContributionPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContributionSuggestion_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "StrategyConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "strategyId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "parameters" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "StrategyConfig_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StrategyConfig_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "StrategyConfig_strategyId_portfolioId_key" ON "StrategyConfig"("strategyId", "portfolioId");

CREATE TABLE "Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "asOf" DATETIME NOT NULL,
    "source" TEXT NOT NULL,
    CONSTRAINT "Quote_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Quote_assetId_asOf_idx" ON "Quote"("assetId", "asOf");

CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "asOf" DATETIME NOT NULL,
    "source" TEXT NOT NULL
);
CREATE INDEX "ExchangeRate_fromCurrency_toCurrency_asOf_idx" ON "ExchangeRate"("fromCurrency", "toCurrency", "asOf");

CREATE TABLE "BrokerageNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hashSha256" TEXT NOT NULL,
    "relativePath" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,
    "noteDate" DATETIME NOT NULL,
    "parsedStatus" TEXT NOT NULL DEFAULT 'MANUAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BrokerageNote_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "BrokerageNoteOperation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noteId" TEXT NOT NULL,
    "transactionId" TEXT,
    "description" TEXT,
    CONSTRAINT "BrokerageNoteOperation_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "BrokerageNote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BrokerageNoteOperation_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "FinancialDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hashSha256" TEXT NOT NULL,
    "relativePath" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PatrimonySnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "totalValue" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "breakdown" TEXT NOT NULL DEFAULT '{}',
    "capturedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PatrimonySnapshot_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RebalanceAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "thresholdPercent" REAL NOT NULL,
    "results" TEXT NOT NULL DEFAULT '{}',
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RebalanceAnalysis_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "TaxReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
