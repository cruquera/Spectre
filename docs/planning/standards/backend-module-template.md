# Template de Módulo Backend

> Estrutura obrigatória para todo novo módulo no ackend/src/modules/.

## Estrutura de Diretórios

`
backend/src/modules/<module-name>/
├── domain/
│   └── <entity>.ts              # Tipos puros (type/interface), zero dependências externas
├── application/
│   ├── <entity>-repository.ts   # Repository port (interface com métodos async)
│   └── <entities>-service.ts    # Service class que orquestra regras de negócio
└── infrastructure/
    └── prisma-<entity>-repository.ts  # Repository adapter (implementação Prisma)
`

## Regras

### domain/\*.ts
- Apenas export type e export interface
- Sem imports de frameworks (zero Prisma, zero Electron)
- Sem lógica de negócio (apenas definições de dados)

### application/<entity>-repository.ts
- export type NomeRepository = { ... } (interface, não class)
- Métodos assíncronos retornando Promise<T>
- Sem referências ao Prisma ou banco

### application/<entities>-service.ts
`	ypescript
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';

export class NomeService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: NomeRepository,
  ) {}

  public async metodo(...args): Promise<Result<T, AppError>> {
    // regras de negócio aqui
    return ok(resultado);
  }
}
`

- Construtor sempre recebe AppContext + Repository
- Métodos retornam Result<T, E> (evitar 
ever)
- Injeção manual (sem DI framework — Electron main process)

### infrastructure/prisma-<entity>-repository.ts
`	ypescript
import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';

export class PrismaNomeRepository implements NomeRepository {
  public constructor(private readonly db: UserPrismaClient) {}
  // implementações dos métodos
}
`

- Único parâmetro do construtor: db: UserPrismaClient
- Implementa a interface da port

### Registro no IPC (register-handlers.ts)

1. Importar o service e o repository
2. Instanciar no createServices()
3. Adicionar handler ipcMain.handle('modulo:acao', ...) com validação Zod
4. Adicionar getter no preload (pps/electron-preload/src/preload.ts)

## Checklist para Novo Módulo

- [ ] domain/<entity>.ts criado com tipos puros
- [ ] pplication/<entity>-repository.ts com interface da port
- [ ] pplication/<entities>-service.ts com classe service
- [ ] infrastructure/prisma-<entity>-repository.ts com adapter Prisma
- [ ] Service registrado em egister-handlers.ts
- [ ] IPC handler adicionado
- [ ] Getter adicionado no preload
- [ ] Tipos Zod adicionados em data-contracts/src/
- [ ] Rota adicionada em pp.routes.ts
- [ ] Getter adicionado em IpcService
- [ ] Teste unitário criado
- [ ] Teste de integração criado
- [ ] 
pm run lint — zero erros
- [ ] 
pm run test:unit — passando
