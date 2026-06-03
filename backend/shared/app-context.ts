import type { PrismaClient as BenchmarkPrismaClient } from '../../node_modules/.prisma/benchmark-client/index.js';
import type { PrismaClient as UserPrismaClient } from '../../node_modules/.prisma/user-client/index.js';

export type SessionState = {
  slug: string;
  displayName: string;
}

export class AppContext {
  private userClient: UserPrismaClient | null = null;
  private benchmarkClient: BenchmarkPrismaClient | null = null;
  private session: SessionState | null = null;
  private readonly dataRoot: string;

  constructor(dataRoot: string) {
    this.dataRoot = dataRoot;
  }

  getDataRoot(): string {
    return this.dataRoot;
  }

  getSession(): SessionState | null {
    return this.session;
  }

  setSession(session: SessionState | null): void {
    this.session = session;
  }

  getUserClient(): UserPrismaClient {
    if (!this.userClient) {
      throw new Error('Database not unlocked. Please login.');
    }

    return this.userClient;
  }

  setUserClient(client: UserPrismaClient | null): void {
    this.userClient = client;
  }

  getBenchmarkClient(): BenchmarkPrismaClient {
    if (!this.benchmarkClient) {
      throw new Error('Benchmark database not initialized.');
    }

    return this.benchmarkClient;
  }

  setBenchmarkClient(client: BenchmarkPrismaClient | null): void {
    this.benchmarkClient = client;
  }

  requireSession(): SessionState {
    if (!this.session) {
      throw new Error('No active session');
    }

    return this.session;
  }
}
