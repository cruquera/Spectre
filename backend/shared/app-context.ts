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

  public constructor(dataRoot: string) {
    this.dataRoot = dataRoot;
  }

  public getDataRoot(): string {
    return this.dataRoot;
  }

  public getSession(): SessionState | null {
    return this.session;
  }

  public setSession(session: SessionState | null): void {
    this.session = session;
  }

  public getUserClient(): UserPrismaClient {
    if (!this.userClient) {
      throw new Error('Database not unlocked. Please login.');
    }

    return this.userClient;
  }

  public setUserClient(client: UserPrismaClient | null): void {
    this.userClient = client;
  }

  public getBenchmarkClient(): BenchmarkPrismaClient {
    if (!this.benchmarkClient) {
      throw new Error('Benchmark database not initialized.');
    }

    return this.benchmarkClient;
  }

  public setBenchmarkClient(client: BenchmarkPrismaClient | null): void {
    this.benchmarkClient = client;
  }

  public requireSession(): SessionState {
    if (!this.session) {
      throw new Error('No active session');
    }

    return this.session;
  }
}
