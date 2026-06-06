import type { AssetRepository } from './asset-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { Asset, AssetCategory } from '../domain/asset.js';

export class AssetsService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly assetRepo: AssetRepository,
  ) {}

  public async list(category?: AssetCategory): Promise<Result<Asset[], never>> {
    const assets = await this.assetRepo.list(category);

    return ok(assets);
  }

  public async create(data: {
    symbol: string;
    name: string;
    assetType: string;
    category: AssetCategory;
    currency: string;
  }): Promise<Result<Asset, never>> {
    const asset = await this.assetRepo.create(data);

    return ok(asset);
  }
}
