# ADR-0002: SQLite por Usuário

## Status

Aceito

## Contexto

Múltiplos familiares no mesmo PC precisam isolamento, backup individual e privacidade.

## Decisão

Um `database.db` por perfil em `spectre-data/users/{slug}/`. Sem multi-tenancy no schema.

## Consequências

- Migrações Prisma aplicadas por perfil no login
- `profiles.json` global lista perfis sem dados sensíveis
- N troca de conexão Prisma ao trocar perfil
