# Accounts Domain

## Purpose

Manage financial institution accounts that serve as funding sources for investment portfolios.

## Predefined Institutions

- Banco Inter
- Banco Safra
- Nubank
- Nomad
- Banco Inter Global

## Fields

- `id`, `institution`, `alias`, `currency`, `createdAt`, `updatedAt`

## Currencies

- BRL, USD, EUR, GBP

## Rules

- An account can fund multiple portfolios
- Currency is per account (conversion happens at portfolio level)
