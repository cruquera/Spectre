import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { InstitutionRepository } from '../application/institution-repository.js';
import type { Institution } from '../domain/institution.js';

export class PrismaInstitutionRepository implements InstitutionRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async list(): Promise<Institution[]> {
    return this.db.institution.findMany({ orderBy: { name: 'asc' } });
  }

  public async create(name: string, type: 'BANK' | 'BROKER'): Promise<Institution> {
    return this.db.institution.create({ data: { name, type } });
  }

  public async delete(id: string): Promise<void> {
    await this.db.institution.delete({ where: { id } });
  }
}
