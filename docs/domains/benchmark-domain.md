# Benchmark Domain

## Purpose

Compare portfolio performance against market benchmarks using the same contribution schedule.

## Available Benchmarks

- CDI
- IPCA
- Ibovespa
- S&P 500
- Nasdaq 100
- Bitcoin

## Behavior

- On app open: fetch latest quotes (only online dependency)
- Show timestamp of last update
- Button: "Update benchmarks"
- No internet: use local cache, inform user
- Show which base quote is being used

## Calculation

Compare actual portfolio value vs benchmark value using the same contributions on the same dates.
