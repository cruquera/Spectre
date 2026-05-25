# Módulo: Tax (Fase 9)

## 1. Objetivo

Base para IR Brasil — preview de vendas na v1; declaração completa em fase posterior.

## 7. Casos de uso

- `TaxService.generatePreview(year)`
- `TaxService.listReports`

## 3. Regras de negócio (futuro)

- FIFO via `TransactionLot`
- Compensação de perdas
- Informes para IRPF
