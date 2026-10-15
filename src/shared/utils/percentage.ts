/**
 * Formata um valor numérico para porcentagem
 * Exemplo: 12.345 -> +12,35% ou -5.2 -> -5,20%
 */
export function formatPercentage(
  value: number | string | null | undefined,
  options?: {
    showSign?: boolean;
    decimals?: number;
  }
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0,00%';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const decimals = options?.decimals ?? 2;
  const showSign = options?.showSign ?? true;

  const formattedNum = Math.abs(numValue).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (numValue > 0 && showSign) {
    return `+${formattedNum}%`;
  } else if (numValue < 0) {
    return `-${formattedNum}%`;
  }

  return `${formattedNum}%`;
}
