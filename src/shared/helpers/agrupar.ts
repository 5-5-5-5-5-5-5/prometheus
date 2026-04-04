// SPDX-License-Identifier: MIT

/**
 * Agrupa itens de um array por uma chave calculada.
 */
export function agruparPor<T>(
  items: T[],
  chave: (item: T) => string
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = chave(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
