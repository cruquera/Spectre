import fs from 'node:fs/promises';

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
  updateInvestmentBlockSchema,
} from '@spectre/data-contracts';
import { ipcMain } from 'electron';

import { AccountsService } from '../../modules/accounts/application/accounts-service.js';
import { PrismaAccountRepository } from '../../modules/accounts/infrastructure/prisma-account-repository.js';
import { AllocationService } from '../../modules/allocation/application/allocation-service.js';
import { PrismaAllocationRepository } from '../../modules/allocation/infrastructure/prisma-allocation-repository.js';
import { AnalyticsService } from '../../modules/analytics/application/analytics-service.js';
import { AssetsService } from '../../modules/assets/application/assets-service.js';
import { PrismaAssetRepository } from '../../modules/assets/infrastructure/prisma-asset-repository.js';
import { BenchmarkService } from '../../modules/benchmark/application/benchmark-service.js';
import { PrismaBenchmarkRepository } from '../../modules/benchmark/infrastructure/prisma-benchmark-repository.js';
import { BrokerageNotesService } from '../../modules/brokerage-notes/application/brokerage-notes-service.js';
import { PrismaBrokerageNoteRepository } from '../../modules/brokerage-notes/infrastructure/prisma-brokerage-note-repository.js';
import { ContributionService } from '../../modules/contribution-planning/application/contribution-service.js';
import { PrismaContributionRepository } from '../../modules/contribution-planning/infrastructure/prisma-contribution-repository.js';
import { DocumentsService } from '../../modules/documents/application/documents-service.js';
import { PrismaDocumentRepository } from '../../modules/documents/infrastructure/prisma-document-repository.js';
import { IdentityService } from '../../modules/identity/index.js';
import { ImportService } from '../../modules/import/application/import-service.js';
import { PrismaImportRepository } from '../../modules/import/infrastructure/prisma-import-repository.js';
import { InstitutionsService } from '../../modules/institutions/application/institutions-service.js';
import { PrismaInstitutionRepository } from '../../modules/institutions/infrastructure/prisma-institution-repository.js';
import { InvestmentBlocksService } from '../../modules/investment-blocks/application/investment-blocks-service.js';
import { PrismaInvestmentBlocksRepository } from '../../modules/investment-blocks/infrastructure/prisma-investment-blocks-repository.js';
import { MarketDataService } from '../../modules/market-data/application/market-data-service.js';
import { PrismaMarketDataRepository } from '../../modules/market-data/infrastructure/prisma-market-data-repository.js';
import { PatrimonyService } from '../../modules/patrimony-history/application/patrimony-service.js';
import { PrismaPatrimonyRepository } from '../../modules/patrimony-history/infrastructure/prisma-patrimony-repository.js';
import { PortfolioService } from '../../modules/portfolio/application/portfolio-service.js';
import { PrismaPortfolioRepository } from '../../modules/portfolio/infrastructure/prisma-portfolio-repository.js';
import { RebalancingService } from '../../modules/rebalancing/application/rebalancing-service.js';
import { TaxService } from '../../modules/tax/application/tax-service.js';
import { PrismaTaxRepository } from '../../modules/tax/infrastructure/prisma-tax-repository.js';
import { ValuationService } from '../../modules/valuation/application/valuation-service.js';
import { PrismaValuationRepository } from '../../modules/valuation/infrastructure/prisma-valuation-repository.js';
import type { AppContext } from '../app-context.js';
import { getBenchmarkDbPath } from '../database/paths.js';
import { createBenchmarkClient } from '../database/prisma-factory.js';
import { ok, toIpcResult } from '../kernel/result.js';

function lazyServices(ctx: AppContext) {
  let cache: ReturnType<typeof createServices> | null = null;

  return function getServices() {
    if (!cache) {
      cache = createServices(ctx);
    }

    return cache;
  };
}

function createServices(ctx: AppContext) {
  const db = ctx.getUserClient();
  const institutionsRepo = new PrismaInstitutionRepository(db);
  const investmentBlocksRepo = new PrismaInvestmentBlocksRepository(db);
  const accountsRepo = new PrismaAccountRepository(db);
  const assetsRepo = new PrismaAssetRepository(db);
  const portfolioRepo = new PrismaPortfolioRepository(db);
  const allocationRepo = new PrismaAllocationRepository(db);
  const valuationRepo = new PrismaValuationRepository(db);
  const marketDataRepo = new PrismaMarketDataRepository(db);
  const contributionRepo = new PrismaContributionRepository(db);
  const brokerageNotesRepo = new PrismaBrokerageNoteRepository(db);
  const taxRepo = new PrismaTaxRepository(db);
  const importRepo = new PrismaImportRepository(db);
  const documentsRepo = new PrismaDocumentRepository(db);
  const patrimonyRepo = new PrismaPatrimonyRepository(db);

  const valuation = new ValuationService(ctx, valuationRepo);
  const allocation = new AllocationService(ctx, allocationRepo, valuation);
  const benchmark = new BenchmarkService(ctx, new PrismaBenchmarkRepository(ctx.getBenchmarkClient()));
  const marketData = new MarketDataService(ctx, marketDataRepo, benchmark);
  const rebalancing = new RebalancingService(allocation);
  const portfolio = new PortfolioService(portfolioRepo);
  const patrimony = new PatrimonyService(ctx, patrimonyRepo, valuation);
  const analytics = new AnalyticsService(patrimony);
  const importSvc = new ImportService(ctx, importRepo, benchmark);

  return {
    institutions: new InstitutionsService(ctx, institutionsRepo),
    investmentBlocks: new InvestmentBlocksService(ctx, investmentBlocksRepo),
    accounts: new AccountsService(ctx, accountsRepo),
    assets: new AssetsService(ctx, assetsRepo),
    portfolio,
    allocation,
    valuation,
    benchmark,
    marketData,
    rebalancing,
    patrimony,
    analytics,
    contribution: new ContributionService(ctx, contributionRepo, allocation),
    brokerageNotes: new BrokerageNotesService(ctx, brokerageNotesRepo),
    tax: new TaxService(ctx, taxRepo),
    importSvc,
    documents: new DocumentsService(ctx, documentsRepo),
  };
}

export function registerIpcHandlers(ctx: AppContext): void {
  const identity = new IdentityService(ctx);
  const getServices = lazyServices(ctx);

  ipcMain.handle('system:healthcheck', () => {
    const data = {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    };

    healthcheckResponseSchema.parse(data);

    return toIpcResult(ok(data));
  });

  ipcMain.handle('system:initBenchmarkDb', async () => {
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
      await identity.createProfile(input.displayName, input.username, input.password),
    );
  });

  ipcMain.handle('identity:login', async (_e, raw) => {
    const input = loginRequestSchema.parse(raw);

    return toIpcResult(await identity.login(input.username, input.password));
  });

  ipcMain.handle('identity:logout', async () => toIpcResult(await identity.logout()));

  ipcMain.handle('institutions:list', async () => toIpcResult(await getServices().institutions.list()));
  ipcMain.handle('institutions:create', async (_e, raw) => {
    const input = createInstitutionSchema.parse(raw);

    return toIpcResult(await getServices().institutions.create(input.name, input.type));
  });

  ipcMain.handle('accounts:list', async (_e, institutionId?: string) =>
    toIpcResult(await getServices().accounts.list(institutionId)),
  );
  ipcMain.handle('accounts:create', async (_e, raw) => {
    const input = createAccountSchema.parse(raw);

    return toIpcResult(
      await getServices().accounts.create(input.institutionId, input.name, input.currency),
    );
  });

  ipcMain.handle('assets:list', async (_e, category?: string) =>
    toIpcResult(await getServices().assets.list(category as never)),
  );
  ipcMain.handle('assets:create', async (_e, raw) => {
    const input = createAssetSchema.parse(raw);

    return toIpcResult(await getServices().assets.create(input));
  });

  ipcMain.handle('portfolio:list', async () => toIpcResult(await getServices().portfolio.list()));
  ipcMain.handle('portfolio:create', async (_e, raw) => {
    const input = createPortfolioSchema.parse(raw);

    return toIpcResult(
      await getServices().portfolio.create(input.name, input.baseCurrency, input.accountIds),
    );
  });
  ipcMain.handle('portfolio:createTransaction', async (_e, raw) => {
    const input = createTransactionSchema.parse(raw);

    return toIpcResult(await getServices().portfolio.createTransaction(input));
  });
  ipcMain.handle('portfolio:listPositions', async (_e, accountId?: string) =>
    toIpcResult(await getServices().portfolio.listPositions(accountId)),
  );

  ipcMain.handle('allocation:setCategory', async (_e, raw) => {
    const input = setCategoryAllocationSchema.parse(raw);

    return toIpcResult(
      await getServices().allocation.setCategoryTarget(
        input.portfolioId,
        input.category,
        input.targetPercent,
      ),
    );
  });
  ipcMain.handle('allocation:setAsset', async (_e, raw) => {
    const input = setAssetAllocationSchema.parse(raw);

    return toIpcResult(
      await getServices().allocation.setAssetTarget(
        input.portfolioId,
        input.assetId,
        input.targetPercent,
      ),
    );
  });
  ipcMain.handle('allocation:analyze', async (_e, portfolioId: string, threshold: number = 5) =>
    toIpcResult(await getServices().allocation.analyze(portfolioId, threshold)),
  );

  ipcMain.handle('benchmark:sync', async (_e, raw) => {
    const input = benchmarkRequestSchema.parse(raw);

    return toIpcResult(await getServices().benchmark.sync(input));
  });
  ipcMain.handle('benchmark:listCached', async (_e, raw) => {
    const input = benchmarkRequestSchema.parse(raw);

    return toIpcResult(await getServices().benchmark.listCached(input));
  });

  ipcMain.handle('marketData:syncBenchmark', async (_e, assetId: string, ticker: string) =>
    toIpcResult(await getServices().marketData.syncFromBenchmark(assetId, ticker)),
  );

  ipcMain.handle('marketData:createQuote', async (_e, raw) => {
    const input = createQuoteSchema.parse(raw);

    return toIpcResult(
      await getServices().marketData.createManualQuote(
        input.assetId,
        input.price,
        input.currency,
        input.asOf,
      ),
    );
  });

  ipcMain.handle('contribution:createBlock', async (_e, raw) => {
    const input = createInvestmentBlockSchema.parse(raw);

    return toIpcResult(await getServices().contribution.createBlock(input.name, input.assetIds));
  });
  ipcMain.handle('contribution:setMonthlyBlock', async (_e, raw) => {
    const input = setMonthlyBlockSchema.parse(raw);

    return toIpcResult(
      await getServices().contribution.setMonthlyBlock(input.year, input.month, input.blockId),
    );
  });
  ipcMain.handle('contribution:simulate', async (_e, raw) => {
    const input = simulateContributionSchema.parse(raw);

    return toIpcResult(
      await getServices().contribution.simulate(
        input.portfolioId,
        input.amount,
        input.currency,
        input.year,
        input.month,
      ),
    );
  });

  ipcMain.handle('rebalancing:analyze', async (_e, portfolioId: string, threshold: number = 5) =>
    toIpcResult(await getServices().rebalancing.analyze(portfolioId, threshold)),
  );

  ipcMain.handle('brokerageNotes:list', async () =>
    toIpcResult(await getServices().brokerageNotes.list()),
  );
  ipcMain.handle('brokerageNotes:register', async (_e, raw) => {
    const input = registerBrokerageNoteSchema.parse(raw);

    return toIpcResult(
      await getServices().brokerageNotes.register(
        input.brokerId,
        input.noteDate,
        input.fileName,
        input.base64Content,
      ),
    );
  });

  ipcMain.handle('patrimony:capture', async (_e, raw) => {
    const input = captureSnapshotSchema.parse(raw);

    return toIpcResult(await getServices().patrimony.captureSnapshot(input.portfolioId));
  });
  ipcMain.handle('patrimony:list', async (_e, portfolioId: string) =>
    toIpcResult(await getServices().patrimony.listHistory(portfolioId)),
  );

  ipcMain.handle('investmentBlocks:list', async () => toIpcResult(await getServices().investmentBlocks.list()));
  ipcMain.handle('investmentBlocks:getById', async (_e, id: string) =>
    toIpcResult(await getServices().investmentBlocks.getById(id)),
  );
  ipcMain.handle('investmentBlocks:create', async (_e, raw) => {
    const input = createInvestmentBlockSchema.parse(raw);

    return toIpcResult(await getServices().investmentBlocks.createBlock(input.name, input.assetIds));
  });
  ipcMain.handle('investmentBlocks:update', async (_e, raw) => {
    const input = updateInvestmentBlockSchema.parse(raw);

    return toIpcResult(await getServices().investmentBlocks.update(input));
  });
  ipcMain.handle('investmentBlocks:remove', async (_e, raw: { id: string }) =>
    toIpcResult(await getServices().investmentBlocks.remove(raw.id)),
  );
  ipcMain.handle('investmentBlocks:setMonthlyBlock', async (_e, raw) => {
    const input = setMonthlyBlockSchema.parse(raw);

    return toIpcResult(await getServices().investmentBlocks.setMonthlyBlock(input.year, input.month, input.blockId));
  });
  ipcMain.handle('investmentBlocks:getSchedule', async (_e, year: number) =>
    toIpcResult(await getServices().investmentBlocks.getSchedule(year)),
  );

  ipcMain.handle('tax:preview', async (_e, raw) => {
    const input = generateTaxPreviewSchema.parse(raw);

    return toIpcResult(await getServices().tax.generatePreview(input.year));
  });

  ipcMain.handle('import:quotesCsv', async (_e, raw) => {
    const input = importQuotesCsvSchema.parse(raw);

    return toIpcResult(await getServices().importSvc.importQuotesCsv(input.csvContent));
  });
  ipcMain.handle('import:syncFx', async (_e, from: string, to: string, ticker: string) =>
    toIpcResult(await getServices().importSvc.syncFxFromBenchmark(from, to, ticker)),
  );

  ipcMain.handle('import:operationsCsv', async (_e, raw) => {
    const input = importOperationsCsvSchema.parse(raw);

    return toIpcResult(
      await getServices().importSvc.importOperationsCsv(input.accountId, input.csvContent),
    );
  });

  ipcMain.handle('documents:list', async () => toIpcResult(await getServices().documents.list()));
  ipcMain.handle('documents:register', async (_e, raw) => {
    const input = registerDocumentSchema.parse(raw);

    return toIpcResult(
      await getServices().documents.register(
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

    return toIpcResult(await getServices().valuation.getPortfolioValue(portfolioId, p.baseCurrency));
  });

  ipcMain.handle('analytics:portfolioEvolution', async (_e, portfolioId: string) =>
    toIpcResult(await getServices().analytics.portfolioEvolution(portfolioId)),
  );
}
