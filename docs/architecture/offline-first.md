# Arquitetura Offline-First

## Princípio

Todas as operações de patrimônio, carteira, aportes e documentos funcionam **sem rede**.

## Exceção: Benchmark

O módulo Benchmark pode buscar séries externas quando o usuário solicita sincronização e há conectividade.

Após sync, dados ficam em `spectre-data/app/benchmark-cache.db` e o restante do app lê **somente o cache**.

## Market Data (carteira)

Cotações da carteira usam três fontes offline:

1. **Manual** — usuário informa preço
2. **Importação** — CSV/planilha local
3. **Benchmark cache** — via ACL (apenas `ticker` + `periodo`)

## Sincronização

- Manual por série/ticker
- Não há background sync obrigatório na v1
- Falha de rede não bloqueia uso do app

## Persistência

- SQLite por perfil em `users/{slug}/database.db`
- Anexos PDF no filesystem
- `profiles.json` sem segredos
