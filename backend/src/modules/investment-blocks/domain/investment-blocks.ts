export type InvestmentBlock = {
  id: string;
  name: string;
  createdAt: Date;
};

export type BlockAsset = {
  id: string;
  blockId: string;
  assetId: string;
  priority: number | null;
};

export type MonthlyBlockSchedule = {
  id: string;
  year: number;
  month: number;
  blockId: string;
};
