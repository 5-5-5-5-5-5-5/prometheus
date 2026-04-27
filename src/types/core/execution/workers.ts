// SPDX-License-Identifier: MIT
/**
 * Tipos para sistema de Worker Pool
 */

import type { MetricaAnalista } from '../../analistas/metricas.js';
import type { Tecnica } from '../../comum/analistas.js';
import type { FileEntryWithAst } from '../../comum/file-entries.js';
import type { Ocorrencia } from '../../comum/ocorrencias.js';
import type { ContextoExecucao } from './ambiente.js';

/**
 * Opções de configuração do Worker Pool
 */
export interface WorkerPoolOptions {
  /** Número máximo de workers simultâneos (padrão: número de CPUs) */
  maxWorkers?: number;
  /** Tamanho do lote de arquivos por worker (padrão: 10) */
  batchSize?: number;
  /** Timeout por analista em ms (padrão: valor do config) */
  timeoutMs?: number;
  /** Se deve usar workers (padrão: true se disponível) */
  enabled?: boolean;
  /** Estratégia de processamento: auto, sequential, parallel, streaming */
  strategy?: 'auto' | 'sequential' | 'parallel' | 'streaming';
  /** Se deve fazer parsing inline dentro do worker */
  parseInline?: boolean;
}

/**
 * Tarefa a ser executada por um worker
 */
export interface WorkerTask {
  files: FileEntryWithAst[];
  techniques: Tecnica[] | SerializedTechnique[];
  context: ContextoExecucao;
  workerId: number;
  timeoutMs?: number;
  parseInline?: boolean;
  extensions?: string[];
  batchSize?: number;
}

export interface SerializedTechnique {
  nome?: string;
  test?: (relPath: string) => boolean;
  global?: boolean;
  _hasTest?: boolean;
  _testSource?: string | null;
  [key: string]: unknown;
}

/**
 * Resultado da execução de um worker
 */
export interface WorkerResult {
  workerId: number;
  occurrences: Ocorrencia[];
  metrics: MetricaAnalista[];
  processedArquivos: number;
  errors: string[];
  duration: number;
  cacheStats?: { hits: number; misses: number };
}

/**
 * Resultado consolidado do processamento de arquivos
 */
export interface ProcessFilesResult {
  occurrences: Ocorrencia[];
  metrics: MetricaAnalista[];
  totalProcessed: number;
  duration: number;
  cacheStats?: { hits: number; misses: number };
}