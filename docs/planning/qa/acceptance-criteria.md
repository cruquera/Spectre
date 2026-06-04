# Criterios de Aceite (Given/When/Then)

> Criterios de aceite por funcionalidade, formato BDD.

## Sprint 1 — InvestmentBlocks

### Criacao de Bloco
```gherkin
Dado que o usuario informou um nome "Bloco Cripto" e os ativos ["BTC", "ETH"]
Quando o sistema criar o bloco
Entao o bloco deve ter um id unico, nome "Bloco Cripto" e 2 assets vinculados
```

### Bloco sem Ativos
```gherkin
Dado que o usuario informou um nome "Bloco Vazio" e nenhum ativo
Quando o sistema validar a requisicao
Entao deve retornar erro de validacao "assetIds must contain at least 1 element"
```

### Categoria sem Valuation
```gherkin
Dado que a categoria REAL_ESTATE tem targetPercent 10% mas valor 0
Quando o sistema calcular os desvios
Entao realPercent deve ser 0 e deviation -10 (sem NaN)
```

## Sprint 2 — Simulacao

### Aporte com Saldo
```gherkin
Dado que o bloco do mes contem 2 ativos subalocados
E o usuario informou amount = R$ 1000 e corretagem = R$ 10
Quando o sistema simular a distribuicao
Entao as sugestoes devem existir
E a soma dos valores sugeridos deve ser ≤ R$ 990
```

### Mes sem Bloco
```gherkin
Dado que nenhum bloco foi configurado para o mes vigente
Quando o usuario tentar simular um aporte
Entao o sistema deve exibir "Nenhum bloco configurado para este mes"
E retornar array vazio de sugestoes
```

## Sprint 3 — Ciclo de Vida

### Confirmacao de Plano
```gherkin
Dado que existe um plano com status SIMULATED com 3 sugestoes
Quando o usuario confirmar a execucao
Entao o plano deve ter status EXECUTED
E 3 transacoes BUY devem ser criadas no portfolio
E um snapshot patrimonial deve ser registrado
```

### Dupla Confirmacao
```gherkin
Dado que um plano ja foi executado (status EXECUTED)
Quando o usuario tentar confirma-lo novamente
Entao o sistema deve retornar erro "Plano ja executado"
```

## Sprint 4 — Dashboard

### Calendario Anual
```gherkin
Dado que o usuario configurou Bloco 1 em jan, Bloco 2 em fev
Quando o sistema exibir o schedule do ano
Entao deve mostrar Bloco 1 para janeiro e Bloco 2 para fevereiro
```

## Sprint 5 — Analytics

### Impacto de Aporte
```gherkin
Dado que o usuario executou 3 aportes nos ultimos 3 meses
Quando o sistema calcular o impacto
Entao deve mostrar a reducao do desvio de cada ativo proporcional ao valor aportado
```
