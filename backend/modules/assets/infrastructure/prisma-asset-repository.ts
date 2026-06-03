import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { AssetRepository } from '../application/asset-repository.js';
import type { Asset, AssetCategory } from '../domain/asset.js';

export class PrismaAssetRepository implements AssetRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async list(category?: AssetCategory): Promise<Asset[]> {
    return this.db.asset.findMany({
      orderBy: { symbol: 'asc' },
      where: category ? { category } : undefined,
    });
  }

  public async create(data: {
    symbol: string;
    name: string;
    assetType: string;
    category: AssetCategory;
    currency: string;
  }): Promise<Asset> {
    return this.db.asset.create({ data });
  }
}
