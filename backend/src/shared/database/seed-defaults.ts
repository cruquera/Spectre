import type { PrismaClient as UserPrismaClient } from '../../../node_modules/.prisma/user-client/index.js';

export async function seedDefaults(client: UserPrismaClient): Promise<void> {
  void client;
}
