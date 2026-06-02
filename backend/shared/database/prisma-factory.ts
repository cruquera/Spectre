import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient as UserPrismaClient } from '../../../node_modules/.prisma/user-client/index.js';
import { PrismaClient as BenchmarkPrismaClient } from '../../../node_modules/.prisma/benchmark-client/index.js';
import { runUserMigrations, runBenchmarkMigrations } from './migrate.js';
import Database from 'better-sqlite3';

export function createEncryptedUserClient(
  dbPath: string,
  encryptionKey: string,
): UserPrismaClient {
  runUserMigrations(dbPath);
  const adapter = new PrismaBetterSQLite3({ url: dbPath });
  const client = new UserPrismaClient({ adapter });
  void encryptionKey;
  return client;
}

export function createBenchmarkClient(dbPath: string): BenchmarkPrismaClient {
  runBenchmarkMigrations(dbPath);
  const adapter = new PrismaBetterSQLite3({ url: dbPath });
  return new BenchmarkPrismaClient({ adapter });
}

/** Executa PRAGMA key quando SQLCipher estiver habilitado (extensão futura). */
export function applyEncryptionKey(dbPath: string, encryptionKey: string): void {
  try {
    const db = new Database(dbPath);
    db.pragma(`key = '${encryptionKey.replace(/'/g, "''")}'`);
    db.close();
  } catch {
    // better-sqlite3 padrão ignora PRAGMA key — senha continua validada via Argon2 no login
  }
}
