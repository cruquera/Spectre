# Módulo: Identity

## 1. Objetivo

Gerenciar perfis locais, autenticação PIN/senha, paths de dados e desbloqueio do banco criptografado.

## 2. Escopo

- CRUD de perfis (sem dados financeiros)
- Login/logout
- Derivação de chave Argon2id
- Inicialização de diretórios por usuário

## 3. Regras de negócio

- Perfis totalmente isolados
- `profiles.json` sem segredos
- Senha nunca persistida em plaintext

## 4. Arquitetura

`backend/modules/identity/` — domain, application, infrastructure.

## 5. Fluxos

1. Criar perfil → diretório + salt + hash
2. Login → derivar chave → abrir Prisma user client
3. Logout → fechar conexão

## 6. Entidades

`LocalProfile`, `ProfileRegistry`

## 7. Casos de uso

- `CreateProfileUseCase`
- `LoginUseCase`
- `ListProfilesUseCase`
- `LogoutUseCase`

## 8. Dependências

- `better-sqlite3-multiple-ciphers`
- `argon2`
- Prisma user schema

## 9. Testes

- Unit: derivação de chave, validação PIN
- Integration: criar perfil e abrir DB

## 10. Decisões técnicas

Ver ADR-0002, ADR-0005.
