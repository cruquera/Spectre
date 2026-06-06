import type { PortfolioProject, Asset } from '../domain/portfolio-project.js';

export interface PortfolioProjectRepository {
  findAll(): Promise<PortfolioProject[]>;
  findById(id: string): Promise<PortfolioProject | null>;
  create(data: { name: string; userProfileId: string; assets: Array<{ type: string; targetPercentage: number; initialValue: number; name?: string | null }> }): Promise<PortfolioProject>;
  update(id: string, data: { name?: string; assets?: Array<{ id?: string; type: string; targetPercentage: number; initialValue: number; name?: string | null }> }): Promise<PortfolioProject>;
  delete(id: string): Promise<void>;
}
