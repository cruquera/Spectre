import type { PrismaClient as UserPrismaClient } from '../../../node_modules/.prisma/user-client/index.js';

export async function seedDefaultStrategies(client: UserPrismaClient): Promise<void> {
  const existing = await client.strategy.findUnique({
    where: { key: 'weighted-rebalance' },
  });

  if (existing) return;

  await client.strategy.create({
    data: {
      isActive: true,
      key: 'weighted-rebalance',
      name: 'Rebalanceamento Ponderado',
      version: '1.0.0',
    },
  });
}
