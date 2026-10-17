/**
 * Utilitários para formatação e manipulação de moeda brasileira (R$).
 */

export function formatCurrencyInput(value: string): string {
  // Remove tudo que não for dígito
  const digits = value.replace(/\D/g, '');

  if (!digits) return '';

  // Converte para centavos
  const numberValue = parseInt(digits, 10) / 100;

  // Formata no padrão brasileiro
  return numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrencyToNumber(formatted: string): number {
  if (!formatted) return 0;
  // Remove pontos de milhar e substitui vírgula por ponto
  const clean = formatted.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateDiscount(currentPriceStr: string, oldPriceStr: string): {
  percent: number;
  savings: string;
} | null {
  const current = parseCurrencyToNumber(currentPriceStr);
  const old = parseCurrencyToNumber(oldPriceStr);

  if (old > 0 && current > 0 && old > current) {
    const diff = old - current;
    const percent = Math.round((diff / old) * 100);
    const savings = diff.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return { percent, savings };
  }
  return null;
}
