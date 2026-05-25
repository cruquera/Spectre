# Segurança Local

## Autenticação

- Perfis locais com PIN/senha
- Argon2id para hash de verificação e derivação de chave do banco
- Sem autenticação online

## Banco de dados

- SQLite com extensão de criptografia (`better-sqlite3-multiple-ciphers`)
- Chave derivada da senha do perfil via Argon2id
- Salt por usuário armazenado separadamente (arquivo `.salt` no diretório do perfil)

## Electron

- `contextIsolation: true`
- `sandbox: true`
- `nodeIntegration: false` no renderer
- Preload expõe API mínima tipada

## Anexos

- Path traversal bloqueado na validação de paths
- SHA-256 para integridade de PDFs
- v1: proteção via ACL do Windows; criptografia por arquivo em fase futura

## Logs

- Produção: sem valores financeiros
- Dev: apenas IDs técnicos

## Benchmark

- Nunca recebe PII ou contexto de carteira
- Logs de sync sem `userId`
