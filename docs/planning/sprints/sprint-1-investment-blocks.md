# 🏃 Sprint 1: Extração do Contexto InvestmentBlocks + Segurança Matemática

**Objetivo da Sprint:** Isolar o bounded context de blocos de investimento e eliminar bugs silenciosos de aritmética financeira.

---

## 🎨 UX/UI

- Wireframe da tela de "Configuração de Blocos" (CRUD: criar/editar/excluir blocos, associar ativos, definir prioridade)
- Mockup do calendário mensal mostrando qual bloco está ativo em cada mês

## ⚙️ Backend

- Migrar tipos InvestmentBlock, BlockAsset, MonthlyBlockSchedule de contribution-planning/domain/ para o novo módulo investment-blocks/domain/
- Extrair InvestmentBlockService e PrismaInvestmentBlockRepository com operações CRUD completas
- Adicionar validação: percentOf() com guard if catTotal === 0 → early return com warning em llocation-calculator.ts

## 💻 Frontend

- Substituir formulário raw de "criar bloco" por componente dedicado investment-block-editor com select múltiplo de ativos e reordenação por prioridade

## 🛡️ QA

- Cenário: Criar bloco com 0 ativos → deve retornar erro de validação (Zod já exige min(1))
- Cenário: Categoria sem valuation (ex: REAL_ESTATE sem posições) → ealPercent deve ser 0 e deviation = -targetPercent, sem NaN
- Executar 
pm run lint — zero erros
- Executar 
pm run test:unit — 100% passando
