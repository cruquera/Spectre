#!/usr/bin/env node

/**
 * Spectre Module Scaffolder
 *
 * Usage:
 *   node scripts/generate-module.mjs --name <module-name> [--feature <true|false>]
 *
 * Examples:
 *   node scripts/generate-module.mjs --name investment-blocks
 *   node scripts/generate-module.mjs --name tax-report --feature false
 *
 * What it generates:
 *   Backend: domain, application, infrastructure layers + unit test
 *   Frontend: standalone component + spec
 *   Integration test file
 *   Wires IPC handlers, routes, IpcService getters, preload API
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
const nameArg = args.find((a) => a.startsWith("--name="))?.split("=")[1]
  ?? args[args.indexOf("--name") + 1];
const featureArg = args.find((a) => a.startsWith("--feature="))?.split("=")[1]
  ?? args[args.indexOf("--feature") + 1];
const generateFeature = featureArg !== "false";

if (!nameArg) {
  console.error("Usage: node scripts/generate-module.mjs --name <module-name> [--feature true|false]");
  process.exit(1);
}

const MODULE_NAME = nameArg.toLowerCase().replace(/[^a-z0-9-]/g, "-");
const MODULE_CAMEL = MODULE_NAME.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const MODULE_PASCAL = MODULE_CAMEL.charAt(0).toUpperCase() + MODULE_CAMEL.slice(1);

const PATHS = {
  backend: join(ROOT, "backend", "src", "modules", MODULE_NAME),
  frontend: join(ROOT, "apps", "angular-app", "src", "app", "features", MODULE_NAME),
  integrationTest: join(ROOT, "tests", "integration", `${MODULE_NAME}.test.ts`),
  registerHandlers: join(ROOT, "backend", "src", "shared", "ipc", "register-handlers.ts"),
  preload: join(ROOT, "apps", "electron-preload", "src", "preload.ts"),
  appRoutes: join(ROOT, "apps", "angular-app", "src", "app", "app.routes.ts"),
  ipcService: join(ROOT, "apps", "angular-app", "src", "app", "core", "services", "ipc.service.ts"),
  dataContracts: join(ROOT, "data-contracts", "src", `${MODULE_NAME}.ts`),
  prismaSchema: join(ROOT, "prisma", "user-schema.prisma"),
};

const TEMPLATES = {
  domain: (name, pascal) => `export type ${pascal} = {
  id: string;
  name: string;
  createdAt: Date;
};
`,
  repository: (name, pascal) => `import type { ${pascal} } from '../domain/${name}.js';

export type ${pascal}Repository = {
  list(): Promise<${pascal}[]>;
  create(name: string): Promise<${pascal}>;
};
`,
  service: (name, pascal) => `import type { ${pascal}Repository } from './${name}-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { ${pascal} } from '../domain/${name}.js';

export class ${pascal}Service {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: ${pascal}Repository,
  ) {}

  public async list(): Promise<Result<${pascal}[], never>> {
    const items = await this.repo.list();

    return ok(items);
  }

  public async create(input: { name: string }): Promise<Result<${pascal}, never>> {
    const entity = await this.repo.create(input.name);

    return ok(entity);
  }
}
`,
  prismaRepo: (name, pascal, camel) => {
    const dbProp = camel.replace(/s$/, ''); // singular Prisma model property
    return `import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { ${pascal}Repository } from '../application/${name}-repository.js';
import type { ${pascal} } from '../domain/${name}.js';

export class Prisma${pascal}Repository implements ${pascal}Repository {
  public constructor(private readonly db: UserPrismaClient) {}

  public list(): Promise<${pascal}[]> {
    return this.db.${dbProp}.findMany({ orderBy: { name: 'asc' } });
  }

  public create(name: string): Promise<${pascal}> {
    return this.db.${dbProp}.create({ data: { name } });
  }
}
`;
  },
  unitTest: (name, pascal) => `import type { AppContext } from '../../../shared/app-context.js';
import type { ${pascal}Repository } from '../application/${name}-repository.js';
import { ${pascal}Service } from '../application/${name}-service.js';

const mockRepo: ${pascal}Repository = {
  create: (n: string) => Promise.resolve({ createdAt: new Date(), id: '1', name: n }),
  list: () => Promise.resolve([]),
};

describe('${pascal}Service', () => {
  const ctx = {} as unknown as AppContext;
  const svc = new ${pascal}Service(ctx, mockRepo);

  it('lists items', async () => {
    const result = await svc.list();

    expect(result.ok).toBe(true);
  });

  it('creates an item', async () => {
    const result = await svc.create({ name: 'Test' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Test');
    }
  });

  it('rejects empty name on create', async () => {
    const repo: ${pascal}Repository = {
      create: () => Promise.reject(new Error('Name is required')),
      list: () => Promise.resolve([]),
    };
    const svc2 = new ${pascal}Service(ctx, repo);

    await expect(svc2.create({ name: '' })).rejects.toThrow();
  });
});
`,
  componentTs: (name, pascal, camel) => `import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './${name}.component.html',
})
export class ${pascal}Component implements OnInit {
  public readonly data = signal<Array<{ id: string; name: string }> | null>(null);
  public readonly loading = signal(false);
  public form!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', (c: AbstractControl) => Validators.required(c)],
    });
  }

  public async load(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await this.ipc.${camel}.list();

      if (res.success) this.data.set(res.data as never);
    } finally {
      this.loading.set(false);
    }
  }

  public async create(): Promise<void> {
    const v = this.form.value as { name: string };
    const res = await this.ipc.${camel}.create(v);

    if (res.success) await this.load();
  }
}
`,
  componentHtml: (name, pascal) => `<h2 class="text-2xl font-bold mb-4">${pascal}</h2>

@if (loading()) {
  <div class="text-spectre-muted">Carregando...</div>
} @else if (data() === null) {
  <form class="grid grid-cols-2 gap-2 max-w-lg" [formGroup]="form" (ngSubmit)="create()">
    <input formControlName="name" placeholder="Nome" class="col-span-2 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
    <button type="submit" class="col-span-2 px-4 py-2 rounded bg-spectre-accent text-sm" [disabled]="form.invalid">Criar</button>
  </form>
} @else {
  <table class="w-full text-sm">
    <thead>
      <tr class="text-left text-spectre-muted">
        <th class="pb-2">ID</th>
        <th class="pb-2">Nome</th>
      </tr>
    </thead>
    <tbody>
      @for (item of data(); track item.id) {
        <tr class="border-t border-slate-700">
          <td class="py-2">{{ item.id }}</td>
          <td class="py-2">{{ item.name }}</td>
        </tr>
      }
    </tbody>
  </table>
}
`,
  componentSpec: (name, pascal) => `import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ${pascal}Component } from './${name}.component';

describe('${pascal}Component', () => {
  let _component: ${pascal}Component;
  let fixture: ComponentFixture<${pascal}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${pascal}Component],
    }).compileComponents();

    fixture = TestBed.createComponent(${pascal}Component);
    _component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the form', () => {
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h2')?.textContent).toContain('${pascal}');
  });
});
`,
  integrationTest: (name, pascal) => `import { PrismaClient as UserPrismaClient } from '../../backend/node_modules/.prisma/user-client/index.js';

describe('${pascal} Integration', () => {
  let db: UserPrismaClient;

  beforeAll(async () => {
    db = new UserPrismaClient({
      datasources: { db: { url: 'file:./test.db' } },
    });
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it('should be testable with real database', () => {
    expect(db).toBeDefined();
  });
});
`,
};

const camel = MODULE_CAMEL.charAt(0).toLowerCase() + MODULE_CAMEL.slice(1);

function write(path, content) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, content, "utf-8");
  console.log("  v " + path.replace(ROOT, "").replace(/\\\\/g, "/"));
}

function generateBackend() {
  console.log("\\n  --- Backend Module ---");
  write(join(PATHS.backend, "domain", `${MODULE_NAME}.ts`), TEMPLATES.domain(MODULE_NAME, MODULE_PASCAL));
  write(join(PATHS.backend, "application", `${MODULE_NAME}-repository.ts`), TEMPLATES.repository(MODULE_NAME, MODULE_PASCAL));
  write(join(PATHS.backend, "application", `${MODULE_NAME}-service.ts`), TEMPLATES.service(MODULE_NAME, MODULE_PASCAL, camel));
  write(join(PATHS.backend, "infrastructure", `prisma-${MODULE_NAME}-repository.ts`), TEMPLATES.prismaRepo(MODULE_NAME, MODULE_PASCAL, camel));
  write(join(PATHS.backend, "infrastructure", `${MODULE_NAME}.unit.test.ts`), TEMPLATES.unitTest(MODULE_NAME, MODULE_PASCAL));
}

function generateFrontend() {
  if (!generateFeature) return;
  console.log("\\n  --- Frontend Feature ---");
  write(join(PATHS.frontend, `${MODULE_NAME}.component.ts`), TEMPLATES.componentTs(MODULE_NAME, MODULE_PASCAL, camel));
  write(join(PATHS.frontend, `${MODULE_NAME}.component.html`), TEMPLATES.componentHtml(MODULE_NAME, MODULE_PASCAL));
  write(join(PATHS.frontend, `${MODULE_NAME}.component.spec.ts`), TEMPLATES.componentSpec(MODULE_NAME, MODULE_PASCAL));
}

function generateIntegrationTest() {
  console.log("\\n  --- Integration Test ---");
  write(PATHS.integrationTest, TEMPLATES.integrationTest(MODULE_NAME, MODULE_PASCAL));
}

function wireRegisterHandlers() {
  const path = PATHS.registerHandlers;
  if (!existsSync(path)) return console.warn("  w " + path + " not found, skip wiring");
  let content = readFileSync(path, "utf-8").replace(/\r/g, '');
  const importService = `import { ${MODULE_PASCAL}Service } from '../../modules/${MODULE_NAME}/application/${MODULE_NAME}-service.js';`;
  const importRepo = `import { Prisma${MODULE_PASCAL}Repository } from '../../modules/${MODULE_NAME}/infrastructure/prisma-${MODULE_NAME}-repository.js';`;
  if (!content.includes(importService)) {
    content = content.replace(
      /(import \{ PrismaInstitutionRepository \} from '\.\.\/\.\.\/modules\/institutions\/infrastructure\/prisma-institution-repository\.js';)/,
      "$1\n" + importService + "\n" + importRepo,
    );
  }
  const repoVar = `const ${camel}Repo = new Prisma${MODULE_PASCAL}Repository(db);`;
  if (!content.includes(repoVar)) {
    content = content.replace(
      /(const institutionsRepo = new PrismaInstitutionRepository\(db\);)/,
      "$1\n  " + repoVar,
    );
  }
  const returnBlock = content.match(/return \{[\s\S]+?\};/);
  if (returnBlock && !returnBlock[0].includes(camel)) {
    content = content.replace(
      /(\s+institutions: new InstitutionsService\(ctx, institutionsRepo\),)/,
      "$1\n    " + camel + ": new " + MODULE_PASCAL + 'Service(ctx, ' + camel + 'Repo),',
    );
  }
  const ipcHandler = "ipcMain.handle('" + camel + ":list', async () => toIpcResult(await getServices()." + camel + ".list()));";
  if (!content.includes(ipcHandler)) {
    content = content.replace(
      /(ipcMain\.handle\('tax:preview')/,
      ipcHandler + "\n\n  $1",
    );
  }
  writeFileSync(path, content, "utf-8");
  console.log("  v wired IPC handler in register-handlers.ts");
}

function wirePreload() {
  const path = PATHS.preload;
  if (!existsSync(path)) return;
  let content = readFileSync(path, "utf-8").replace(/\r/g, '');
  const apiBlock = "  " + camel + ": {\n    create: (data: unknown) => ipcRenderer.invoke('" + camel + ":create', data),\n    list: () => ipcRenderer.invoke('" + camel + ":list'),\n  },";
  if (!content.includes(camel + ": {")) {
    content = content.replace(
      /( {2}invoke<T>)/,
      apiBlock + "\n$1",
    );
  }
  writeFileSync(path, content, "utf-8");
  console.log("  v wired preload API in preload.ts");
}

function wireAppRoutes() {
  if (!generateFeature) return;
  const path = PATHS.appRoutes;
  if (!existsSync(path)) return;
  let content = readFileSync(path, "utf-8").replace(/\r/g, '');
  const routeBlock = "      {\n        loadComponent: () =>\n          import('./features/" + MODULE_NAME + "/" + MODULE_NAME + ".component').then((m) => m." + MODULE_PASCAL + "Component),\n        path: '" + MODULE_NAME + "',\n      },";
  if (!content.includes("path: '" + MODULE_NAME + "'")) {
    content = content.replace(
      /(\s+)({\s*\n\s+loadComponent: \(\) =>\n\s+import\('\.\/features\/settings)/,
      routeBlock + "\n$1$2",
    );
  }
  writeFileSync(path, content, "utf-8");
  console.log("  v wired route in app.routes.ts");
}

function wireIpcService() {
  if (!generateFeature) return;
  const path = PATHS.ipcService;
  if (!existsSync(path)) return;
  let content = readFileSync(path, "utf-8").replace(/\r/g, '');
  const getter = "  public get " + camel + "(): Window['spectre']['" + camel + "'] {\n    return this.api." + camel + ";\n  }";
  if (!content.includes("get " + camel + "()")) {
    content = content.replace(
      /(public get institutions\(\): Window\['spectre'\]\['institutions'\] \{\n {4}return this\.api\.institutions;\n {2}\})/,
      "$1\n\n" + getter,
    );
  }
  writeFileSync(path, content, "utf-8");
  console.log("  v wired getter in ipc.service.ts");
}

console.log("\\nSpectre Module Scaffolder");
console.log("  Module: " + MODULE_NAME + " (" + MODULE_PASCAL + ")");
console.log("  Feature: " + (generateFeature ? "yes" : "no"));
generateBackend();
generateFrontend();
generateIntegrationTest();
console.log("\\n  --- Wiring ---");
wireRegisterHandlers();
wirePreload();
wireAppRoutes();
wireIpcService();
console.log("\\n  ✅ Module '" + MODULE_NAME + "' generated successfully!");
console.log("  Next steps:");
console.log("    1. Add Prisma model for '" + camel + "' in prisma/user-schema.prisma");
console.log("    2. Run: npm run prisma:migrate:user");
console.log("    3. Add Zod schemas in data-contracts/src/" + MODULE_NAME + ".ts");
console.log("    4. Fill business logic in " + MODULE_PASCAL + "Service");
console.log("    5. Run: npm run lint && npm run test:unit\\n");
