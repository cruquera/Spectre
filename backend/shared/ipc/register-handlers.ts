import fs from 'node:fs/promises';

import { ipcMain } from 'electron';

import {
  benchmarkRequestSchema,
  captureSnapshotSchema,
  createAccountSchema,
  createAssetSchema,
  createInstitutionSchema,
  createInvestmentBlockSchema,
  createPortfolioSchema,
  createProfileRequestSchema,
  createQuoteSchema,
  createTransactionSchema,
  generateTaxPreviewSchema,
  healthcheckResponseSchema,
  importOperationsCsvSchema,
  importQuotesCsvSchema,
  loginRequestSchema,
  registerBrokerageNoteSchema,
  registerDocumentSchema,
  setAssetAllocationSchema,
  setCategoryAllocationSchema,
  setMonthlyBlockSchema,
  simulateContributionSchema,
} from '../../../data-contracts/dist/index.js';
import { AccountsService } from '../../modules/accounts/application/accounts-service.js';
import { AllocationService } from '../../modules/allocation/application/allocation-service.js';
import { AnalyticsService } from '../../modules/analytics/application/analytics-service.js';
import { AssetsService } from '../../modules/assets/application/assets-service.js';
import { BenchmarkService } from '../../modules/benchmark/application/benchmark-service.js';
import { BrokerageNotesService } from '../../modules/brokerage-notes/application/brokerage-notes-service.js';
import { ContributionService } from '../../modules/contribution-planning/application/contribution-service.js';
import { DocumentsService } from '../../modules/documents/application/documents-service.js';
import { IdentityService } from '../../modules/identity/application/identity-service.js';
import { ImportService } from '../../modules/import/application/import-service.js';
import { InstitutionsService } from '../../modules/institutions/application/institutions-service.js';
import { MarketDataService } from '../../modules/market-data/application/market-data-service.js';
import { PatrimonyService } from '../../modules/patrimony-history/application/patrimony-service.js';
import { PortfolioService } from '../../modules/portfolio/application/portfolio-service.js';
import { RebalancingService } from '../../modules/rebalancing/application/rebalancing-service.js';
import { TaxService } from '../../modules/tax/application/tax-service.js';
import { ValuationService } from '../../modules/valuation/application/valuation-service.js';
import type { AppContext } from '../app-context.js';
import { getBenchmarkDbPath } from '../database/paths.js';
import { createBenchmarkClient } from '../database/prisma-factory.js';
import { ok, toIpcResult } from '../kernel/result.js';

export function registerIpcHandlers(ctx: AppContext): void {
  const identity = new IdentityService(ctx);
  const institutions = new InstitutionsService(ctx);
  const accounts = new AccountsService(ctx);
  const assets = new AssetsService(ctx);
  const portfolio = new PortfolioService(ctx);
  const allocation = new AllocationService(ctx);
  const benchmark = new BenchmarkService(ctx);
  const marketData = new MarketDataService(ctx);
  const contribution = new ContributionService(ctx);
  const rebalancing = new RebalancingService(ctx);
  const brokerageNotes = new BrokerageNotesService(ctx);
  const patrimony = new PatrimonyService(ctx);
  const tax = new TaxService(ctx);
  const importSvc = new ImportService(ctx);
  const documents = new DocumentsService(ctx);
  const analytics = new AnalyticsService(ctx);
  const valuation = new ValuationService(ctx);

  void ipcMain.handle('system:healthcheck', () => {
    const data = {
  status: 'ok' as const,
  timestamp: new Date().toISOString(),
  version: '0.1.0'
};

    healthcheckResponseSchema.parse(data);

    return toIpcResult(ok(data));
  });

  void ipcMain.handle('system:initBenchmarkDb', async () => {
    const dbPath = getBenchmarkDbPath(ctx.getDataRoot());

    await fs.mkdir(dbPath.replace(/[^/\\]+$/, ''), { recursive: true });
    const client = createBenchmarkClient(dbPath);

    await client.$connect();
    ctx.setBenchmarkClient(client);

    return toIpcResult(ok(undefined));
  });
  ipcMain.handle('identity:listProfiles', async () =>
    toIpcResult(await identity.listProfiles()),
  );
  ipcMain.handle('identity:createProfile', async (_e, raw) => {
    const input = createProfileRequestSchema.parse(raw);

    return toIpcResult(
      await identity.createProfile(input.displayName, input.slug, input.password),
    );
  });
  ipcMain.handle('identity:login', async (_e, raw) => {
    const input = loginRequestSchema.parse(raw);

    return toIpcResult(await identity.login(input.slug, input.password));
  });
  ipcMain.handle('identity:logout', async () => toIpcResult(await identity.logout()));
  ipcMain.handle('institutions:list', async () => toIpcResult(await institutions.list()));
  ipcMain.handle('institutions:create', async (_e, raw) => {
    const input = createInstitutionSchema.parse(raw);

    return toIpcResult(await institutions.create(input.name, input.type));
  });
  ipcMain.handle('accounts:list', async (_e, institutionId?: string) =>
    toIpcResult(await accounts.list(institutionId)),
  );
  ipcMain.handle('accounts:create', async (_e, raw) => {
    const input = createAccountSchema.parse(raw);

    return toIpcResult(
      await accounts.create(input.institutionId, input.name, input.currency),
    );
  });
  ipcMain.handle('assets:list', async (_e, category?: string) =>
    toIpcResult(await assets.list(category as never)),
  );
  ipcMain.handle('assets:create', async (_e, raw) => {
    const input = createAssetSchema.parse(raw);

    return toIpcResult(await assets.create(input));
  });
  ipcMain.handle('portfolio:list', async () => toIpcResult(await portfolio.list()));
  ipcMain.handle('portfolio:create', async (_e, raw) => {
    const input = createPortfolioSchema.parse(raw);

    return toIpcResult(
      await portfolio.create(input.name, input.baseCurrency, input.accountIds),
    );
  });
  ipcMain.handle('portfolio:createTransaction', async (_e, raw) => {
    const input = createTransactionSchema.parse(raw);

    return toIpcResult(await portfolio.createTransaction(input));
  });
  ipcMain.handle('portfolio:listPositions', async (_e, accountId?: string) =>
    toIpcResult(await portfolio.listPositions(accountId)),
  );
  ipcMain.handle('allocation:setCategory', async (_e, raw) => {
    const input = setCategoryAllocationSchema.parse(raw);

    return toIpcResult(
      await allocation.setCategoryTarget(
        input.portfolioId,
        input.category,
        input.targetPercent,
      ),
    );
  });
  ipcMain.handle('allocation:setAsset', async (_e, raw) => {
  ),
  );,
  const input = setAssetAllocationSchema.parse(raw);

    return toIpcResult(
      await allocation.setAssetTarget(
        input.portfolioId,
  input.assetId,
  input.targetPercent
});
  ipcMain.handle('allocation:analyze', async (_e, portfolioId: string, threshold = 5) =>
    toIpcResult(await allocation.analyze(portfolioId, threshold)),
  );
  ipcMain.handle('benchmark:sync', async (_e, raw) => {
    const input = benchmarkRequestSchema.parse(raw);

    return toIpcResult(await benchmark.sync(input));
  });
  ipcMain.handle('benchmark:listCached', async (_e, raw) => {
    const input = benchmarkRequestSchema.parse(raw);

    return toIpcResult(await benchmark.listCached(input));
  });
  ipcMain.handle('marketData:syncBenchmark', async (_e, assetId: string, ticker: string) =>
    toIpcResult(await marketData.syncFromBenchmark(assetId, ticker)),
  );
  ipcMain.handle('marketData:createQuote', async (_e, raw) => {
    const input = createQuoteSchema.parse(raw);

    return toIpcResult(
      await marketData.createManualQuote(
        input.assetId,
        input.price,
        input.currency,
        input.asOf,
      ),
    );
  });
  ipcMain.handle('contribution:createBlock', async (_e, raw) => {
    const input = createInvestmentBlockSchema.parse(raw);

    return toIpcResult(await contribution.createBlock(input.name, input.assetIds));
  });
  ipcMain.handle('contribution:setMonthlyBlock', async (_e, raw) => {
    const input = setMonthlyBlockSchema.parse(raw);

    return toIpcResult(
      await contribution.setMonthlyBlock(input.year, input.month, input.blockId),
    );
  });
  ipcMain.handle('contribution:simulate', async (_e, raw) => {
  ),
  );,
  const input = simulateContributionSchema.parse(raw);

    return toIpcResult(
      await contribution.simulate(
        input.portfolioId,
  input.amount,
  input.currency,
  input.month,
  input.year
});
  ipcMain.handle('rebalancing:analyze', async (_e, portfolioId: string, threshold = 5) =>
    toIpcResult(await rebalancing.analyze(portfolioId, threshold)),
  );
  ipcMain.handle('brokerageNotes:list', async () =>
    toIpcResult(await brokerageNotes.list()),
  );
  ipcMain.handle('brokerageNotes:register', async (_e, raw) => {
    const input = registerBrokerageNoteSchema.parse(raw);

    return toIpcResult(
      await brokerageNotes.register(
        input.brokerId,
        input.noteDate,
        input.fileName,
        input.base64Content,
      ),
    );
  });
  ipcMain.handle('patrimony:capture', async (_e, raw) => {
    const input = captureSnapshotSchema.parse(raw);

    return toIpcResult(await patrimony.captureSnapshot(input.portfolioId));
  });
  ipcMain.handle('patrimony:list', async (_e, portfolioId: string) =>
    toIpcResult(await patrimony.listHistory(portfolioId)),
  );
  ipcMain.handle('tax:preview', async (_e, raw) => {
    const input = generateTaxPreviewSchema.parse(raw);

    return toIpcResult(await tax.generatePreview(input.year));
  });
  ipcMain.handle('import:quotesCsv', async (_e, raw) => {
    const input = importQuotesCsvSchema.parse(raw);

    return toIpcResult(await importSvc.importQuotesCsv(input.csvContent));
  });
  ipcMain.handle('import:syncFx', async (_e, from: string, to: string, ticker: string) =>
    toIpcResult(await importSvc.syncFxFromBenchmark(from, to, ticker)),
  );
  ipcMain.handle('import:operationsCsv', async (_e, raw) => {
    const input = importOperationsCsvSchema.parse(raw);

    return toIpcResult(
      await importSvc.importOperationsCsv(input.accountId, input.csvContent),
    );
  });
  ipcMain.handle('documents:list', async () => toIpcResult(await documents.list()));
  ipcMain.handle('documents:register', async (_e, raw) => {
    const input = registerDocumentSchema.parse(raw);

    return toIpcResult(
      await documents.register(
        input.documentType,
        input.documentDate,
        input.fileName,
        input.base64Content,
      ),
    );
  });
  ipcMain.handle('valuation:getPortfolioValue', async (_e, portfolioId: string) => {
    const db = ctx.getUserClient();
    const p = await db.portfolio.findUniqueOrThrow({ where: { id: portfolioId } });

    return toIpcResult(await valuation.getPortfolioValue(portfolioId, p.baseCurrency));
  });
  ipcMain.handle('analytics:portfolioEvolution', async (_e, portfolioId: string) =>
    toIpcResult(await analytics.portfolioEvolution(portfolioId)),
  );
}
