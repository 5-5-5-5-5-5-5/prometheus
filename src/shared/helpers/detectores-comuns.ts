// SPDX-License-Identifier: MIT
import { LIMITES_PADRAO } from '@core/config/limites.js';
import { isContextoDocumentacao } from '@shared/contexto-projeto.js';

import type { ResultadoSegredo } from '../../types/analistas/detectores.js';

export type { ResultadoSegredo };

/**
 * Calcula a entropia de Shannon de uma string.
 * Útil para distinguir tokens/chaves reais de strings comuns.
 */
export function calcularEntropia(str: string): number {
  const frequencias = new Map<string, number>();
  for (const char of str) {
    frequencias.set(char, (frequencias.get(char) || 0) + 1);
  }
  let entropia = 0;
  for (const freq of frequencias.values()) {
    const prob = freq / str.length;
    entropia -= prob * Math.log2(prob);
  }
  return entropia;
}

/**
 * Verifica se uma linha parece conter um placeholder seguro.
 */
export function isPlaceholderSuspeito(linha: string): boolean {
  const placeholdersComuns = ['<YOUR_', '<FOO>', '<BAR>', 'REPLACE_ME', 'EXAMPLE_', 'PLACEHOLDER', 'your_', 'example', 'sample', 'demo', 'test', 'fake', 'dummy', 'mock'];
  const linhaLower = linha.toLowerCase();
  return placeholdersComuns.some(p => linhaLower.includes(p.toLowerCase()));
}

/**
 * Heurística para detectar segredos hardcoded em linhas de código.
 */
export function detectarSegredosHardcoded(src: string, relPath: string): ResultadoSegredo[] {
  if (isContextoDocumentacao(relPath)) return [];

  const resultados: ResultadoSegredo[] = [];
  const linhas = src.split('\n');

  // Whitelist de padrões comuns de nomenclatura (não são secrets)
  const padroesNomenclatura = ['_role_', '_config_', '_key_', '_type_', '_name_', '_prefix_', '_suffix_', 'squad_', 'channel_', 'guild_'];

  linhas.forEach((linha, index) => {
    // Ignorar variáveis comuns que não são secrets
    const isNonSecretChave = /\b(migration|cache|hash|dedupe|lookup|map|index)key\b/i.test(linha);
    if (isNonSecretChave || isPlaceholderSuspeito(linha)) return;

    const padraoSegredo = /\b(password|pwd|pass|secret|key|token|api_key|apikey)\b\s*[:=]\s*['"`]([^'"`\s]{3,})/i;
    const match = linha.match(padraoSegredo);

    if (match) {
      const campo = String(match[1] || '').toLowerCase();
      const valor = match[2];

      // Ignorar template strings dinâmicas
      if (linha.includes('${') || /`[^`]*\$\{[^}]+\}/.test(linha)) return;

      // Ignorar se contiver padrões de nomenclatura comuns
      if (padroesNomenclatura.some(p => valor.toLowerCase().includes(p.toLowerCase()))) return;

      const entropia = calcularEntropia(valor);
      const temAltaEntropia = entropia > LIMITES_PADRAO.SEGURANCA.ENTROPIA_SHANNON_ALTA;

      // Heurística de confiança: tokens longos com alta entropia tendem a ser reais
      if (valor.length > 20 && temAltaEntropia) {
        resultados.push({
          campo,
          valor,
          linha: index + 1,
          confianca: 'alta'
        });
      } else if (valor.length > 8 && temAltaEntropia) {
        resultados.push({
          campo,
          valor,
          linha: index + 1,
          confianca: 'media'
        });
      }
    }
  });

  return resultados;
}

/**
 * Detecta comentários TODO/FIXME.
 */
export function detectarComentariosPendentes(src: string): Array<{ tipo: 'TODO' | 'FIXME', linha: number, texto: string }> {
  const resultados: Array<{ tipo: 'TODO' | 'FIXME', linha: number, texto: string }> = [];
  const linhas = src.split('\n');

  linhas.forEach((linha, index) => {
    const match = linha.match(/\/\/\s*(TODO|FIXME)[:\s]*(.*)/i) || linha.match(/\/\*\s*(TODO|FIXME)[:\s]*(.*)\*\//i);
    if (match) {
      resultados.push({
        tipo: match[1].toUpperCase() as 'TODO' | 'FIXME',
        linha: index + 1,
        texto: match[2].trim()
      });
    }
  });

  return resultados;
}

/**
 * Detecta console.log e similares.
 */
export function detectarLogsDebug(src: string): Array<{ linha: number, metodo: string }> {
  const resultados: Array<{ linha: number, metodo: string }> = [];
  const linhas = src.split('\n');

  linhas.forEach((linha, index) => {
    const match = linha.match(/console\.(log|debug|info|warn|error)\s*\(/);
    if (match && !linha.trim().startsWith('//')) {
      resultados.push({
        linha: index + 1,
        metodo: match[1]
      });
    }
  });

  return resultados;
}
