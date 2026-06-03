export type Transaction = {
  id: string;
  accountId: string;
  assetId: string;
  type: string;
  quantity: number;
  unitPrice: number;
  fees: number;
  taxes: number;
  tradeDate: Date;
  settlementDate: Date | null;
  currency: string;
  fxRate: number | null;
};
