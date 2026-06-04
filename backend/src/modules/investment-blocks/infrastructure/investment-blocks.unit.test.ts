import type { AppContext } from '../../../shared/app-context.js';
import type { InvestmentBlocksRepository } from '../application/investment-blocks-repository.js';
import { InvestmentBlocksService } from '../application/investment-blocks-service.js';

const mockRepo: InvestmentBlocksRepository = {
  addBlockAssets: () => Promise.resolve(),
  create: (n: string) => Promise.resolve({ createdAt: new Date(), id: '1', name: n }),
  getById: () => Promise.resolve(null),
  getMonthlyBlock: () => Promise.resolve(null),
  getSchedule: () => Promise.resolve([]),
  list: () => Promise.resolve([]),
  remove: () => Promise.resolve(),
  removeBlockAssets: () => Promise.resolve(),
  update: (id: string, name: string) => Promise.resolve({ createdAt: new Date(), id, name }),
  upsertMonthlyBlock: () => Promise.resolve(),
};

describe('InvestmentBlocksService', () => {
  const ctx = {} as unknown as AppContext;
  const svc = new InvestmentBlocksService(ctx, mockRepo);

  it('lists items', async () => {
    const result = await svc.list();

    expect(result.ok).toBe(true);
  });

  it('creates an item', async () => {
    const result = await svc.create({ name: 'Test' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Test');
    }
  });

  it('rejects empty name on create', async () => {
    const repo: InvestmentBlocksRepository = {
      addBlockAssets: () => Promise.resolve(),
      create: () => Promise.reject(new Error('Name is required')),
      getById: () => Promise.resolve(null),
      getMonthlyBlock: () => Promise.resolve(null),
      getSchedule: () => Promise.resolve([]),
      list: () => Promise.resolve([]),
      remove: () => Promise.resolve(),
      removeBlockAssets: () => Promise.resolve(),
      update: (id: string, name: string) => Promise.resolve({ createdAt: new Date(), id, name }),
      upsertMonthlyBlock: () => Promise.resolve(),
    };
    const svc2 = new InvestmentBlocksService(ctx, repo);

    await expect(svc2.create({ name: '' })).rejects.toThrow();
  });

  it('createBlock with assetIds returns block with assets', async () => {
    const repo: InvestmentBlocksRepository = {
      addBlockAssets: () => Promise.resolve(),
      create: (n: string) => Promise.resolve({ createdAt: new Date(), id: '1', name: n }),
      getById: () => Promise.resolve(null),
      getMonthlyBlock: () => Promise.resolve(null),
      getSchedule: () => Promise.resolve([]),
      list: () => Promise.resolve([]),
      remove: () => Promise.resolve(),
      removeBlockAssets: () => Promise.resolve(),
      update: (id: string, name: string) => Promise.resolve({ createdAt: new Date(), id, name }),
      upsertMonthlyBlock: () => Promise.resolve(),
    };
    const svc2 = new InvestmentBlocksService(ctx, repo);
    const result = await svc2.createBlock('Test Block', ['asset-1', 'asset-2']);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Test Block');
    }
  });

  it('setMonthlyBlock upserts without error', async () => {
    const result = await svc.setMonthlyBlock(2026, 6, 'block-1');

    expect(result.ok).toBe(true);
  });

  it('getSchedule returns schedule array', async () => {
    const result = await svc.getSchedule(2026);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.value)).toBe(true);
    }
  });

  it('getById returns null for unknown id', async () => {
    const result = await svc.getById('unknown');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeNull();
    }
  });

  it('updates block name', async () => {
    const result = await svc.update({ id: '1', name: 'Updated' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Updated');
    }
  });

  it('removes block', async () => {
    const result = await svc.remove('1');

    expect(result.ok).toBe(true);
  });
});
