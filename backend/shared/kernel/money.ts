export type CurrencyCode = string;

export type Money = {
  amount: number;
  currency: CurrencyCode;
}

export function convertMoney(
  money: Money,
  rate: number,
  targetCurrency: CurrencyCode,
): Money {
  return {
    amount: money.amount * rate,
    currency: targetCurrency,
  };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error('Cannot add money with different currencies without FX');
  }

  return { amount: a.amount + b.amount, currency: a.currency };
}
