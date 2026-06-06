import type { AssetType as PrismaAssetType } from '../../../../node_modules/.prisma/user-client/index.js';
import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { PortfolioProject, Asset } from '../domain/portfolio-project.js';
import type { PortfolioProjectRepository } from '../application/portfolio-project-repository.js';

function toDomain(prisma: {
  id: string;
  name: string;
  userProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  assets: Array<{
    id: string;
    type: string;
    targetPercentage: number;
    initialValue: number;
    name: string | null;
    portfolioProjectId: string;
  }>;
}): PortfolioProject {
  return {
    id: prisma.id,
    name: prisma.name,
    userProfileId: prisma.userProfileId,
    createdAt: prisma.createdAt,
    updatedAt: prisma.updatedAt,
    assets: prisma.assets.map((a) => ({
      id: a.id,
      type: a.type as Asset['type'],
      targetPercentage: a.targetPercentage,
      initialValue: a.initialValue,
      name: a.name,
      portfolioProjectId: a.portfolioProjectId,
    })),
  };
}

export class PrismaPortfolioProjectRepository implements PortfolioProjectRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async findAll(): Promise<PortfolioProject[]> {
    const projects = await this.db.portfolioProject.findMany({
      include: { assets: true },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map(toDomain);
  }

  public async findById(id: string): Promise<PortfolioProject | null> {
    const project = await this.db.portfolioProject.findUnique({
      include: { assets: true },
      where: { id },
    });

    return project ? toDomain(project) : null;
  }

  public async create(
    data: { name: string; userProfileId: string; assets: Array<{ type: string; targetPercentage: number; initialValue: number; name: string | null }> },
  ): Promise<PortfolioProject> {
    const project = await this.db.portfolioProject.create({
      data: {
        name: data.name,
        userProfileId: data.userProfileId,
        assets: {
          create: data.assets.map((a) => ({
            type: a.type as PrismaAssetType,
            targetPercentage: a.targetPercentage,
            initialValue: a.initialValue,
            name: a.name,
          })),
        },
      },
      include: { assets: true },
    });

    return toDomain(project);
  }

  public async update(
    id: string,
    data: { name?: string; assets?: Array<{ id?: string; type: string; targetPercentage: number; initialValue: number; name?: string | null }> },
  ): Promise<PortfolioProject> {
    if (data.assets) {
      await this.db.asset.deleteMany({ where: { portfolioProjectId: id } });

      for (const a of data.assets) {
        await this.db.asset.create({
          data: {
            type: a.type as PrismaAssetType,
            targetPercentage: a.targetPercentage,
            initialValue: a.initialValue,
            name: a.name ?? null,
            portfolioProjectId: id,
          },
        });
      }
    }

    const project = await this.db.portfolioProject.update({
      where: { id },
      data: { name: data.name },
      include: { assets: true },
    });

    return toDomain(project);
  }

  public async delete(id: string): Promise<void> {
    await this.db.portfolioProject.delete({ where: { id } });
  }
}
