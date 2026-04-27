// SPDX-License-Identifier: MIT
/**
 * Otimizações de Performance para Prometheus
 * Inclui caching, lazy loading e processamento paralelo
 */

import fs from 'node:fs';
import path from 'node:path';

import { parseDocument } from 'yaml';

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutos

interface CacheEntry {
  hashConteudo: string;
  timestamp: number;
  score: number;
  problemas: string[];
}

const cacheGlobal = new Map<string, CacheEntry>();

/**
 * Gera hash simples para conteúdo
 */
function gerarHash(conteudo: string): string {
  let hash = 0;
  for (let i = 0; i < conteudo.length; i++) {
    const char = conteudo.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

/**
 * obtém do cache ou null se expirado/não existe
 */
export function getCachedResult(chave: string): { score: number; problemas: string[] } | null {
  const entry = cacheGlobal.get(chave);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cacheGlobal.delete(chave);
    return null;
  }

  return { score: entry.score, problemas: entry.problemas };
}

/**
 * Salva resultado no cache em memória
 */
export function setCachedResult(chave: string, score: number, problemas: string[]): void {
  cacheGlobal.set(chave, {
    hashConteudo: gerarHash(chave),
    timestamp: Date.now(),
    score,
    problemas
  });
}

/**
 * Limpa cache expirado
 */
export function limparCacheExpirado(): number {
  let count = 0;
  const now = Date.now();
  for (const [chave, entry] of cacheGlobal.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      cacheGlobal.delete(chave);
      count++;
    }
  }
  return count;
}

/**
 * Carregador lazy de detectores
 */
const detectoresCarregados = new Set<string>();

export function carregarDetector(nome: string): Promise<unknown> | null {
  if (detectoresCarregados.has(nome)) return null;

  detectoresCarregados.add(nome);
  return import(`@analistas/plugins/analista-${nome}.js`);
}

export function isCarregado(nome: string): boolean {
  return detectoresCarregados.has(nome);
}

/**
 * Processamento paralelo de workflows
 */
export interface ResultadoParalelo {
  arquivo: string;
  score: number;
  problemas: number;
  tempoMs: number;
}

export async function analisarParallelo(
  arquivos: string[],
  analyser: (conteudo: string, arquivo: string) => Promise<{ score: number; problemas: number }>
): Promise<ResultadoParalelo[]> {
  const promises = arquivos.map(async (arquivo) => {
    const inicio = Date.now();
    try {
      const conteudo = fs.readFileSync(arquivo, 'utf-8');
      const resultado = await analyser(conteudo, arquivo);
      return {
        arquivo: path.basename(arquivo),
        score: resultado.score,
        problemas: resultado.problemas,
        tempoMs: Date.now() - inicio
      };
    } catch {
      return {
        arquivo: path.basename(arquivo),
        score: 0,
        problemas: 1,
        tempoMs: Date.now() - inicio
      };
    }
  });

  return Promise.all(promises);
}

/**
 * Estatísticas de performance
 */
export function getEstatisticasPerformance(): {
  cacheSize: number;
  detectoresloaded: number;
  hitRate: number;
} {
  return {
    cacheSize: cacheGlobal.size,
    detectoresloaded: detectoresCarregados.size,
    hitRate: 0
  };
}

/**
 * Otimiza parsing de YAML paralelo
 */
export function processarYAMLParalelo(conteudos: string[]): Promise<unknown[]> {
  return Promise.all(
    conteudos.map(c => {
      try {
        const doc = parseDocument(c);
        return doc.toJS();
      } catch {
        return null;
      }
    })
  );
}
