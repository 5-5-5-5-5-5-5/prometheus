// SPDX-License-Identifier: MIT

import type { FormatadorMinimoResult } from '@';

import { limitarLinhasEmBranco,normalizarFimDeLinha, normalizarNewlinesFinais, removerBom } from './utils.js';

/**
 * Go formatter — preserva a indentação original do arquivo (gofmt usa tabs).
 * Apenas faz limpeza segura: trailing whitespace, linhas em branco excessivas,
 * normalização de fim de linha.
 */
export function formatarGoMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const lines = normalized.split('\n');
  const out: string[] = [];

  for (const raw of lines) {
    // Remove trailing whitespace, preserving leading whitespace (tabs)
    out.push(raw.replace(/[ \t]+$/, ''));
  }

  const { code: limitado, changed: changedBlanks } = limitarLinhasEmBranco(out.join('\n'), 2);
  const formatted = normalizarNewlinesFinais(limitado);
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'go',
    formatted,
    changed: formatted !== baseline,
    reason: changedBlanks ? 'estilo-prometheus-go' : 'normalizacao-basica',
  };
}