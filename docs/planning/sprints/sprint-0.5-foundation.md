# 🏃 Sprint 0.5: Fundação de Qualidade & Padronização

**Objetivo da Sprint:** Estabelecer o esqueleto de módulo, template de testes, script de scaffolding e adicionar verificação obrigatória no CI antes de qualquer nova feature.

---

## 🎨 UX/UI

- Documentar design tokens e padrão de componentes (cores spectre, layout shell, formulários)
- Criar shared/components/ com template de componente base (sp-card, sp-table, sp-form-field)

## ⚙️ Backend

- Criar script scripts/generate-module.mjs que gera automaticamente:
  - ackend/src/modules/<nome>/domain/<nome>.ts
  - ackend/src/modules/<nome>/application/<nome>-repository.ts
  - ackend/src/modules/<nome>/application/<nome>-service.ts
  - ackend/src/modules/<nome>/infrastructure/prisma-<nome>-repository.ts
  - ackend/src/modules/<nome>/infrastructure/<nome>.unit.test.ts
  - pps/angular-app/src/app/features/<nome>/<nome>.component.ts
  - pps/angular-app/src/app/features/<nome>/<nome>.component.html
  - pps/angular-app/src/app/features/<nome>/<nome>.component.spec.ts
  - 	ests/integration/<nome>.test.ts
  - Registrar rota em pp.routes.ts
  - Adicionar getter no IpcService
- Criar docs/planning/standards/backend-module-template.md

## 💻 Frontend

- Criar shared/components/sp-table com ordenação e formatação condicional
- Criar docs/planning/standards/frontend-module-template.md

## 🛡️ QA

- Implementar todos os testes retroativos (ver qa/retroactive-test-plan.md)
- Validar que 
pm run lint passa em toda a codebase
- Validar que 
pm run test:unit passa com 100% dos testes
