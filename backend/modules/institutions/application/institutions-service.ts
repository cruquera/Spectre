import type { InstitutionRepository } from './institution-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { Institution } from '../domain/institution.js';

export class InstitutionsService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly institutionRepo: InstitutionRepository,
  ) {}

  public async list(): Promise<Result<Institution[], never>> {
    const institutions = await this.institutionRepo.list();

    return ok(institutions);
  }

  public async create(name: string, type: 'BANK' | 'BROKER'): Promise<Result<Institution, never>> {
    const institution = await this.institutionRepo.create(name, type);

    return ok(institution);
  }

  public async delete(id: string): Promise<Result<void, never>> {
    await this.institutionRepo.delete(id);

    return ok(undefined);
  }
}
