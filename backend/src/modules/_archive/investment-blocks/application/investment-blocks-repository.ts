import type { BlockAsset, InvestmentBlock, MonthlyBlockSchedule } from '../domain/investment-blocks.js';

export type InvestmentBlocksRepository = {
  list(): Promise<InvestmentBlock[]>;
  getById(id: string): Promise<InvestmentBlock | null>;
  create(name: string): Promise<InvestmentBlock>;
  update(id: string, name: string): Promise<InvestmentBlock>;
  remove(id: string): Promise<void>;
  addBlockAssets(data: Array<{ assetId: string; blockId: string }>): Promise<void>;
  removeBlockAssets(blockId: string): Promise<void>;
  upsertMonthlyBlock(year: number, month: number, blockId: string): Promise<void>;
  getMonthlyBlock(year: number, month: number): Promise<{
    block: InvestmentBlock & { assets: BlockAsset[] };
  } | null>;
  getSchedule(year: number): Promise<MonthlyBlockSchedule[]>;
};
