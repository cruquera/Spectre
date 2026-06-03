export type AssetCategory = 'CRYPTO' | 'FIXED_INCOME' | 'VARIABLE_INCOME' | 'REAL_ESTATE';

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  assetType: string;
  category: AssetCategory;
  currency: string;
  metadata: string;
};
