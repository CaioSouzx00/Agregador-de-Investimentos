/**
 * Formata um valor numérico para a moeda brasileira (BRL)
 * Exemplo: 15420.50 -> R$ 15.420,50
 */
export function formatCurrency(
  value: number | string | null | undefined,
  options?: { showPrefix?: boolean }
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return options?.showPrefix === false ? '0,00' : 'R$ 0,00';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: options?.showPrefix === false ? 'decimal' : 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);

  return formatted;
}

/**
 * Separa a moeda (R$) dos inteiros e centavos para layouts ricos de fintech
 */
export function splitCurrencyParts(value: number | string | null | undefined) {
  const formatted = formatCurrency(value, { showPrefix: true });
  const [prefix, numberPart] = formatted.split(/\s+/);
  const [integers, cents] = (numberPart || '0,00').split(',');

  return {
    prefix: prefix || 'R$',
    integers: integers || '0',
    cents: cents || '00',
  };
}
