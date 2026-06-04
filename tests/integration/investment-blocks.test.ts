import { PrismaClient as UserPrismaClient } from '../../backend/node_modules/.prisma/user-client/index.js';

describe('InvestmentBlocks Integration', () => {
  let db: UserPrismaClient;

  beforeAll(async () => {
    db = new UserPrismaClient({
      datasources: { db: { url: 'file:./test.db' } },
    });
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it('should be testable with real database', () => {
    expect(db).toBeDefined();
  });
});
