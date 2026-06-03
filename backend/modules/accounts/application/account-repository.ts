import type { Account } from '../domain/account.js';

export type AccountRepository = {
  list(institutionId?: string): Promise<Account[]>;
  create(institutionId: string, name: string, currency: string): Promise<Account>;
}
