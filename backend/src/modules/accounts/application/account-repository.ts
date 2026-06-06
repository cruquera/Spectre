import type { Account } from '../domain/account.js';

export interface AccountRepository {
  findAll(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  create(data: Omit<Account, 'id'>): Promise<Account>;
  update(id: string, data: Partial<Omit<Account, 'id' | 'userProfileId'>>): Promise<Account>;
  delete(id: string): Promise<void>;
}
