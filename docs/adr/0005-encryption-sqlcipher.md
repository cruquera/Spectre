# ADR-0005: Criptografia do Banco (SQLCipher-compatible)

## Status

Aceito

## Contexto

Dados financeiros locais precisam proteção se o disco for acessado.

## Decisão

- Argon2id para derivação de chave a partir do PIN/senha do perfil
- `better-sqlite3-multiple-ciphers` com `PRAGMA key` na abertura
- Prisma via driver adapter `@prisma/adapter-better-sqlite3`
- Salt por perfil em arquivo `.salt` no diretório do usuário

## Alternativas rejeitadas

- Senha em plaintext no `profiles.json`
- Criptografia só de campos — insuficiente para metadados estruturados

## Consequências

- PoC na Fase 0 valida abertura/fechamento do DB
- Performance aceitável para uso desktop
