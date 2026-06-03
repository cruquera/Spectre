import type { Institution } from '../domain/institution.js';

export type InstitutionRepository = {
  list(): Promise<Institution[]>;
  create(name: string, type: 'BANK' | 'BROKER'): Promise<Institution>;
  delete(id: string): Promise<void>;
}
