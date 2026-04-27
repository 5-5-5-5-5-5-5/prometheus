// SPDX-License-Identifier: MIT

import type { FormatadorMinimoResult } from '@';

import { limitarLinhasEmBranco,normalizarFimDeLinha, normalizarNewlinesFinais, removerBom } from './utils.js';

/**
 * Kotlin formatter — preserva a indentação original do arquivo.
 * Apenas faz limpeza segura: trailing whitespace, linhas em branco excessivas,
 * e normalização de fim de linha.
 *
 * Não tenta re-indentar pois isso pode quebrar alinhamento,
 * multi-line strings, e padrões específicos de formatação do Kotlin.
 */
export function formatarKotlinMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const lines = normalized.split('\n');
  const out: string[] = [];

  for (const raw of lines) {
    // Remove trailing whitespace, preserving leading whitespace
    out.push(raw.replace(/[ \t]+$/, ''));
  }

  const { code: limitado, changed: changedBlanks } = limitarLinhasEmBranco(out.join('\n'), 2);
  const formatted = normalizarNewlinesFinais(limitado);
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'kotlin',
    formatted,
    changed: formatted !== baseline,
    reason: changedBlanks ? 'estilo-prometheus-kotlin' : 'normalizacao-basica',
  };
}