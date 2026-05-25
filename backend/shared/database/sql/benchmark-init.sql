CREATE TABLE "BenchmarkSeries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "benchmarkType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "BenchmarkSeries_symbol_source_benchmarkType_key" ON "BenchmarkSeries"("symbol", "source", "benchmarkType");

CREATE TABLE "BenchmarkDataPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seriesId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    CONSTRAINT "BenchmarkDataPoint_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "BenchmarkSeries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "BenchmarkDataPoint_seriesId_date_key" ON "BenchmarkDataPoint"("seriesId", "date");

CREATE TABLE "SyncJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seriesId" TEXT NOT NULL,
    "lastSyncAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    CONSTRAINT "SyncJob_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "BenchmarkSeries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
