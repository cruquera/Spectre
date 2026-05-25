# ADR-0004: Anexos no Filesystem

## Status

Aceito

## Contexto

Notas de corretagem e PDFs podem ser grandes; BLOB no SQLite prejudica backup e performance.

## Decisão

Binários em `attachments/`; banco guarda metadata, hash SHA-256, path relativo e vínculos.

## Consequências

- Backup = copiar pasta do usuário
- Path traversal deve ser validado no Main
- Integridade verificável por hash
