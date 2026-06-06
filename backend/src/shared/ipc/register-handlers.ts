import {
  createAccountSchema,
  createPortfolioTemplateSchema,
  createProfileRequestSchema,
  loginRequestSchema,
  updateOnboardingStepSchema,
} from '@spectre/data-contracts';
import { ipcMain } from 'electron';

import { AccountsService, PrismaAccountRepository } from '../../modules/accounts/index.js';
import { IdentityService } from '../../modules/identity/index.js';
import { OnboardingService } from '../../modules/onboarding/index.js';
import { PortfolioTemplateService, PrismaPortfolioTemplateRepository } from '../../modules/portfolio-template/index.js';
import type { AppContext } from '../app-context.js';
import { AppError, err, ok, toIpcResult } from '../kernel/result.js';

export function registerIpcHandlers(ctx: AppContext): void {
  const identity = new IdentityService(ctx);
  const onboarding = new OnboardingService(ctx);

  const getAccountsService = () => {
    const db = ctx.getUserClient();

    return new AccountsService(ctx, new PrismaAccountRepository(db));
  };

  const getPortfolioTemplateService = () => {
    const db = ctx.getUserClient();

    return new PortfolioTemplateService(ctx, new PrismaPortfolioTemplateRepository(db));
  };

  ipcMain.handle('identity:listProfiles', async () =>
    toIpcResult(await identity.listProfiles()),
  );

  ipcMain.handle('identity:createProfile', async (_e, raw) => {
    const input = createProfileRequestSchema.parse(raw);

    return toIpcResult(
      await identity.createProfile(input.displayName, input.username, input.password),
    );
  });

  ipcMain.handle('identity:login', async (_e, raw) => {
    const input = loginRequestSchema.parse(raw);

    return toIpcResult(await identity.login(input.username, input.password));
  });

  ipcMain.handle('identity:logout', async () => toIpcResult(await identity.logout()));

  ipcMain.handle('identity:session', () => {
    const session = ctx.getSession();

    if (session) {
      return toIpcResult(ok(session));
    }

    return toIpcResult(err(new AppError('NO_SESSION', 'Not logged in')));
  });

  ipcMain.handle('onboarding:getState', async () => toIpcResult(await onboarding.getState()));
  ipcMain.handle('onboarding:updateStep', async (_e, raw) => {
    const input = updateOnboardingStepSchema.parse(raw);

    return toIpcResult(await onboarding.updateStep(input.step));
  });
  ipcMain.handle('onboarding:complete', async () => toIpcResult(await onboarding.complete()));
  ipcMain.handle('onboarding:abort', async () => toIpcResult(await onboarding.abort()));

  ipcMain.handle('accounts:list', async () =>
    toIpcResult(await getAccountsService().list()),
  );
  ipcMain.handle('accounts:create', async (_e, raw) => {
    const input = createAccountSchema.parse(raw);

    return toIpcResult(
      await getAccountsService().create(input.institutionName, input.nickname, input.currency),
    );
  });
  ipcMain.handle('accounts:update', async (_e, id: string, raw: unknown) => {
    const input = createAccountSchema.partial().parse(raw);

    return toIpcResult(await getAccountsService().update(id, input));
  });
  ipcMain.handle('accounts:delete', async (_e, id: string) =>
    toIpcResult(await getAccountsService().delete(id)),
  );

  ipcMain.handle('portfolioTemplates:list', async () =>
    toIpcResult(await getPortfolioTemplateService().list()),
  );
  ipcMain.handle('portfolioTemplates:findById', async (_e, id: string) =>
    toIpcResult(await getPortfolioTemplateService().findById(id)),
  );
  ipcMain.handle('portfolioTemplates:create', async (_e, raw) => {
    const input = createPortfolioTemplateSchema.parse(raw);

    return toIpcResult(
      await getPortfolioTemplateService().create(input.name, input.targets, input.benchmark, input.strategy, input.description, input.baseCurrency, input.isDefault),
    );
  });
  ipcMain.handle('portfolioTemplates:update', async (_e, id: string, raw: unknown) => {
    const input = createPortfolioTemplateSchema.partial().parse(raw);

    return toIpcResult(await getPortfolioTemplateService().update(id, input));
  });
  ipcMain.handle('portfolioTemplates:delete', async (_e, id: string) =>
    toIpcResult(await getPortfolioTemplateService().delete(id)),
  );
}
