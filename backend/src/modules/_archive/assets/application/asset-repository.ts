import type { Asset, AssetCategory } from '../domain/asset.js';

export type AssetRepository = {
  list(category?: AssetCategory): Promise<Asset[]>;
  create(data: {
    symbol: string;
    name: string;
    assetType: string;
    category: AssetCategory;
    currency: string;
  }): Promise<Asset>;
}
