# Diretrizes Prisma

> Regras para models, migrations e repositories no Spectre.

## Schemas

O projeto possui **dois schemas Prisma**:

| Schema | Arquivo | Propósito |
|--------|---------|-----------|
| User | prisma/user-schema.prisma | Dados do usuário (carteiras, ativos, transações) |
| Benchmark | prisma/benchmark-schema.prisma | Dados de mercado (Yahoo Finance, BCB, IBGE) |

## Nomenclatura de Models

| Regra | Exemplo Correto | Exemplo Incorreto |
|-------|----------------|--------------------|
| PascalCase singular | InvestmentBlock | investment_blocks |
| Nome descritivo | ContributionSuggestion | Suggestion |
| Relacionamento explícito | lock InvestmentBlock @relation(...) | lockId String sem relação |

## Relacionamentos

Sempre definir ambos os lados da relação:

`prisma
model Parent {
  id     String    @id @default(cuid())
  children Child[]
}

model Child {
  id       String @id @default(cuid())
  parentId String
  parent   Parent @relation(fields: [parentId], references: [id], onDelete: Cascade)
}
`

- Usar onDelete: Cascade para consistência
- Usar @@unique([...]) para chave composta quando necessário
- Usar @@index([...]) para consultas frequentes

## Novos Models

Ao adicionar um novo model:

1. Adicionar no schema correto (user-schema ou enchmark-schema)
2. Rodar 
pm run prisma:migrate:user (ou enchmark)
3. Rodar 
pm run prisma:generate
4. Criar o repository seguindo o [template de módulo backend](backend-module-template.md)

## Métodos do Repository

| Operação | Método Prisma |
|----------|---------------|
| Criar | create({ data }) |
| Listar | indMany({ where, orderBy }) |
| Buscar único | indUnique({ where }) ou indFirst({ where, orderBy }) |
| Atualizar | update({ where, data }) |
| Upsert | upsert({ create, update, where }) |
| Deletar | delete({ where }) |
| Transação | $transaction([...]) para operações atômicas |

## Migrations

- Nome descritivo: 20250524000000_init → descrever no nome se possível
- Nunca editar migrations já aplicadas
- Para mudanças, criar nova migration

## Tipos no Repository

`	ypescript
import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
// ou
import type { PrismaClient as BenchmarkPrismaClient } from '../../../../node_modules/.prisma/benchmark-client/index.js';
`

Sempre importar o tipo, nunca instanciar o client no repository.
