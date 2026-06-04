# 🏃 Sprint 3: Ciclo de Vida do Plano (Simular → Confirmar → Executar)

**Objetivo da Sprint:** O usuário pode revisar, confirmar e executar um plano de aporte, gerando automaticamente as transações no portfolio e registrando o snapshot patrimonial.

---

## 🎨 UX/UI

- Desenho do fluxo de confirmação:
  - Tela de revisão com resumo ("Você está prestes a aportar R$ 1.200 distribuídos em 3 ativos")
  - Botões "Confirmar e Executar" / "Cancelar"
- Histórico de planos anteriores com status (SIMULATED / EXECUTED / CANCELLED) e data

## ⚙️ Backend

- Implementar confirmPlan(planId):
  1. Validar que plano está SIMULATED
  2. Criar transações BUY no portfolio para cada sugestão > 0
  3. Capturar snapshot patrimonial (PatrimonySnapshot)
  4. Atualizar status para EXECUTED
  5. Usar Prisma. para atomicidade
- Endpoint contribution:listPlans(portfolioId) para histórico

## 💻 Frontend

- Modal de confirmação com detalhes do plano e botão "Executar"
- Página de histórico com filtros por mês/status
- Indicador visual de plano já executado no mês (bloquear nova simulação)

## 🛡️ QA

- Cenário: Confirmar plano 2x → segunda chamada retorna erro "Plano já executado"
- Cenário: Transação gerada com quantidade correta a partir de suggestedAmount / unitPrice
- Cenário: Teste de integração com SQLite :memory: validando rollback em falha
