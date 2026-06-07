CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institutionName" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userProfileId" TEXT NOT NULL,
    CONSTRAINT "Account_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PortfolioTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "strategy" TEXT NOT NULL DEFAULT 'FREE_ALLOCATION',
    "baseCurrency" TEXT NOT NULL DEFAULT 'BRL',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "benchmark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userProfileId" TEXT NOT NULL,
    CONSTRAINT "PortfolioTemplate_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PortfolioAssetTarget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetClass" TEXT NOT NULL CHECK("assetClass" IN ('cash_reserve','fixed_income_post','fixed_income_pre','fixed_income_inflation','debentures','investment_funds','retirement_funds','real_estate_funds','etf_brazil','etf_global','stock_picking_b3','stock_picking_nasdaq','stock_picking_nyse','stock_picking_europe','stock_picking_asia','reits','commodities','precious_metals','crypto','alternative_assets')),
    "optionalTickerDescription" TEXT,
    "allocationPercentage" REAL NOT NULL,
    "minimumInvestment" REAL NOT NULL DEFAULT 0,
    "fractionalAllowed" BOOLEAN NOT NULL DEFAULT true,
    "lotSize" INTEGER NOT NULL DEFAULT 1,
    "templateId" TEXT NOT NULL,
    CONSTRAINT "PortfolioAssetTarget_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PortfolioTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "InvestmentPortfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    CONSTRAINT "InvestmentPortfolio_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InvestmentPortfolio_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PortfolioTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
