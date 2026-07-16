export function formatWalletBalance(balance: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance)
  } catch {
    return `${currency} ${balance.toFixed(2)}`
  }
}
