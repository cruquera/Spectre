CREATE TABLE IF NOT EXISTS "PortfolioProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userProfileId" TEXT NOT NULL,
    CONSTRAINT "PortfolioProject_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL CHECK("type" IN ('STOCKPICKING','CRYPTO','DEBENTURE','INVESTMENT_FUND','PENSION_FUND','FII','ETF','BDR','TREASURY')),
    "targetPercentage" REAL NOT NULL,
    "initialValue" REAL NOT NULL DEFAULT 0,
    "name" TEXT,
    "portfolioProjectId" TEXT NOT NULL,
    CONSTRAINT "Asset_portfolioProjectId_fkey" FOREIGN KEY ("portfolioProjectId") REFERENCES "PortfolioProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "RealPortfolioAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actualValue" REAL NOT NULL,
    "assetId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RealPortfolioAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RealPortfolioAsset_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RealPortfolioAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "PortfolioProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
