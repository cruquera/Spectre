import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OLD_TABLES = [
  'Account',
  'Institution',
  'AssetIdentifier',
  'Asset',
  'PortfolioAccount',
  'Portfolio',
  'CategoryAllocation',
  'AssetTargetAllocation',
  'Position',
  'TransactionLot',
  'Transaction',
  'InvestmentBlock',
  'BlockAsset',
  'MonthlyBlockSchedule',
  'ContributionSuggestion',
  'ContributionPlan',
  'StrategyConfig',
  'Quote',
  'ExchangeRate',
  'BrokerageNoteOperation',
  'BrokerageNote',
  'FinancialDocument',
  'PatrimonySnapshot',
  'RebalanceAnalysis',
  'TaxReport',
];

function loadSql(filename: string): string {
  const candidates = [
    path.join(__dirname, 'sql', filename),
    path.join(process.cwd(), 'backend', 'shared', 'database', 'sql', filename),
    path.join(process.cwd(), 'dist', 'shared', 'database', 'sql', filename),
  ];

  for (const p of candidates) {
    try {
      return readFileSync(p, 'utf-8');
    } catch {
      continue;
    }
  }
  throw new Error(`SQL file not found: ${filename}`);
}

function tableExists(db: Database.Database, table: string): boolean {
  const row = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
    .get(table) as { name: string } | undefined;

  return !!row;
}

function columnExists(db: Database.Database, table: string, column: string): boolean {
  const columns = db.pragma(`table_info("${table}")`) as Array<{ name: string }>;

  return columns.some((c) => c.name === column);
}

function dropOldTables(db: Database.Database): void {
  for (const table of OLD_TABLES) {
    db.exec(`DROP TABLE IF EXISTS "${table}"`);
  }
  db.exec(`DROP TABLE IF EXISTS "UserProfile"`);
}

export function runUserMigrations(dbPath: string): void {
  const db = new Database(dbPath);

  try {
    if (!tableExists(db, 'UserProfile')) {
      db.exec(loadSql('user-init.sql'));

      return;
    }

    if (!columnExists(db, 'UserProfile', 'tourCompleted')) {
      dropOldTables(db);
      db.exec(loadSql('user-init.sql'));

      return;
    }

    if (!tableExists(db, 'Account')) {
      db.exec(loadSql('user-migration-001.sql'));
    } else if (!tableExists(db, 'PortfolioProject')) {
      db.exec(loadSql('user-migration-002.sql'));
    }
  } finally {
    db.close();
  }
}

export function runBenchmarkMigrations(dbPath: string): void {
  const db = new Database(dbPath);

  try {
    if (tableExists(db, 'BenchmarkSeries')) return;
    db.exec(loadSql('benchmark-init.sql'));
  } finally {
    db.close();
  }
}
