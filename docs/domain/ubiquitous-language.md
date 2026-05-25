# Linguagem Ubíqua

| Termo | Definição |
|-------|-----------|
| **Perfil** | Usuário local isolado (familiar) com DB e anexos próprios |
| **Instituição** | Banco ou corretora cadastrada |
| **Conta** | Conta em uma instituição, com moeda base |
| **Ativo** | Instrumento investível (ação, FII, crypto, etc.) |
| **Carteira** | Agrupamento lógico de contas e alocação alvo |
| **Categoria** | CRYPTO, FIXED_INCOME, VARIABLE_INCOME, REAL_ESTATE |
| **Alocação alvo** | Percentual desejado (categoria no portfolio; ativo na categoria) |
| **Desvio** | Diferença entre % real e % alvo |
| **Rebalanceamento** | Ação sugerida quando desvio ≥ limiar |
| **Bloco de investimento** | Conjunto de ativos elegíveis para aporte no mês |
| **Aporte** | Contribuição planejada com sugestão de distribuição |
| **Estratégia** | Plugin de regras que influencia sugestões de aporte |
| **Benchmark** | Série de referência (CDI, Ibovespa, etc.) — módulo isolado |
| **Nota de corretagem** | PDF no filesystem; metadata no DB |
| **Snapshot patrimonial** | Registro histórico do valor da carteira em uma data |

## Regra de alocação (ADR-0006)

- % de **categoria** = parcela do portfolio total (soma = 100%)
- % de **ativo** = parcela dentro da categoria (soma = 100% por categoria)
