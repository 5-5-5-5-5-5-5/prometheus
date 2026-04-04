// SPDX-License-Identifier: MIT

/**
 * Divide o conteúdo de um arquivo em linhas de forma compatível com diferentes sistemas operacionais.
 */
export function splitLines(src: string): string[] {
  return src.split(/\r?\n/);
}
