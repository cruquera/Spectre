# Setup de desenvolvimento

```bash
npm install
npm run prisma:generate
npm run build
```

## Desenvolvimento com hot reload

Terminal 1:
```bash
cd apps/angular-app && npm run start:angular
```

Terminal 2:
```bash
set SPECTRE_DEV=1
npm run start -w @spectre/electron-main
```

## Dados locais

`%USERPROFILE%\spectre-data\`
