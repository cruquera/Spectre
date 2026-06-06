import type { PortfolioTemplate } from '../domain/portfolio-template.js';

export type PortfolioTemplateRepository = {
  findAll(): Promise<PortfolioTemplate[]>;
  findById(id: string): Promise<PortfolioTemplate | null>;
  create(data: {
    name: string;
    description?: string | null;
    strategy?: string;
    benchmark?: string | null;
    baseCurrency?: string;
    isDefault?: boolean;
    userProfileId: string;
    targets: Array<{
      assetClass: string;
      optionalTickerDescription?: string | null;
      allocationPercentage: number;
      classTargetId?: string | null;
      minimumInvestment?: number;
      fractionalAllowed?: boolean;
      lotSize?: number;
    }>;
  }): Promise<PortfolioTemplate>;
  update(
    id: string,
    data: {
      name?: string;
      description?: string | null;
      strategy?: string;
      benchmark?: string | null;
      baseCurrency?: string;
      isDefault?: boolean;
      targets?: Array<{
        id?: string;
        assetClass: string;
        optionalTickerDescription?: string | null;
        allocationPercentage: number;
        classTargetId?: string | null;
        minimumInvestment?: number;
        fractionalAllowed?: boolean;
        lotSize?: number;
      }>;
    },
  ): Promise<PortfolioTemplate>;
  delete(id: string): Promise<void>;
};
