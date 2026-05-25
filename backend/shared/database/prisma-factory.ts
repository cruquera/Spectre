import Database from 'better-sqlite3-multiple-ciphers';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient as UserPrismaClient } from '../../../node_modules/.prisma/user-client/index.js';
import { PrismaClient as BenchmarkPrismaClient } from '../../../node_modules/.prisma/benchmark-client/index.js';
import { runUserMigrations, runBenchmarkMigrations } from './migrate.js';

export function openUserDatabase(dbPath: string, encryptionKey: string): Database.Database {
  const sqlite = new Database(dbPath);
  sqlite.pragma(`key = '${escapePragmaKey(encryptionKey)}'`);
  runUserMigrations(sqlite);
  return sqlite;
}

export function createEncryptedUserClient(
  dbPath: string,
  encryptionKey: string,
): UserPrismaClient {
  const sqlite = openUserDatabase(dbPath, encryptionKey);
  const adapter = new PrismaBetterSqlite3(sqlite);
  return new UserPrismaClient({ adapter });
}

export function openBenchmarkDatabase(dbPath: string): Database.Database {
  const sqlite = new Database(dbPath);
  runBenchmarkMigrations(sqlite);
  return sqlite;
}

export function createBenchmarkClient(dbPath: string): BenchmarkPrismaClient {
  const sqlite = openBenchmarkDatabase(dbPath);
  const adapter = new PrismaBetterSqlite3(sqlite);
  return new BenchmarkPrismaClient({ adapter });
}

function escapePragmaKey(key: string): string {
  return key.replace(/'/g, "''");
}
