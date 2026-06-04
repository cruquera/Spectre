import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

export function runUserMigrations(dbPath: string): void {
  const db = new Database(dbPath);

  try {
    if (tableExists(db, 'UserProfile')) return;
    db.exec(loadSql('user-init.sql'));
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
