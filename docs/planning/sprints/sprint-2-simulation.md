# 🏃 Sprint 2: Pipeline Fim-a-Fim de Simulação de Aporte

**Objetivo da Sprint:** O usuário consegue ver o bloco do mês corrente, simular a distribuição de um valor e visualizar as sugestões em uma tabela interativa com formatação condicional.

---

## 🎨 UX/UI

- Design da tela "Aporte do Mês" com:
  - Header do bloco ativo
  - Card de patrimônio total
  - Input de valor disponível
  - Tabela de sugestões (colunas: Ativo, Símbolo, % Alvo, % Real, Desvio, Valor Sugerido, Ação)
- Estados: carregando, bloco não configurado para o mês, saldo zerado, simulação concluída

## ⚙️ Backend

- Endpoint contribution:getCurrentMonthBlock que retorna o bloco agendado + ativos + seus desvios atuais
- Endpoint contribution:getAvailableCash que soma posições de FIXED_INCOME com liquidez diária
- Orquestrar pipeline: bloco → desvios → sugestões → expor suggestions com deviation e ealPercent embutidos
- **Padronização obrigatória:** Todos os novos endpoints devem seguir o template de módulo

## 💻 Frontend

- Componente contribution-simulator com tabela Tailwind:
  - Fundo verde para "COMPRAR" (desvio negativo ≥ threshold)
  - Fundo cinza para "AGUARDAR"
  - Exibir valor total a aportar, custo de corretagem deduzido
  - Indicador de bloco rotativo (ex: "📦 Bloco 2/3 — Ações Defensivas")

## 🛡️ QA

- Cenário: Simular com saldo menor que corretagem → sugestões vazias
- Cenário: Mês sem bloco configurado → schedule retorna null → array vazio + toast
- Cenário: Testar cálculo com catTotal = 0 → sem NaN
