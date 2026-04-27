// SPDX-License-Identifier: MIT
/**
 * Executor de worker para processamento paralelo de arquivos
 * Este arquivo é executado em threads separadas pelos Worker Threads
 * Formato ESM (compatível com "type": "module")
 *
 * Melhorias:
 * - Parsing inline dentro do worker
 * - Cache de AST em memória
 * - Retry automático em caso de falha
 * - Yield para não bloquear event loop
 * - Tratamento de erros robusto
 * - Métricas de performance
 * - Suporte a streaming para projetos imensos
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { parentPort,workerData } from 'node:worker_threads';

interface WorkerData {
  files?: FileEntryWorker[];
  techniques?: TecnicaWorker[];
  contexto?: unknown;
  timeoutMs?: number;
  parseInline?: boolean;
  extensions?: string[];
}

interface FileEntryWorker {
  relPath: string;
  content: string | null;
  fullCaminho: string;
  ast?: unknown;
  mtimeMs?: number;
}

interface TecnicaWorker {
  nome?: string;
  aplicar?: (content: string, relPath: string, ast: unknown, fullPath: string, contexto: unknown) => unknown;
  test?: (relPath: string) => boolean;
  global?: boolean;
}

interface OcorrenciaWorker {
  arquivo: string;
  linha: number;
  coluna: number;
  tipo: string;
  mensagem: string;
  severidade: string;
  tecnica?: string;
  contexto?: Record<string, unknown>;
}

interface TempoWorker {
  tecnica: string;
  duracaoMs: number;
}

interface FileResultado {
  arquivo: string;
  ocorrencias: OcorrenciaWorker[];
  tempos: TempoWorker[];
  erros: string[];
}

interface ResultadoProcessamento {
  sucesso: boolean;
  arquivo: string;
  ocorrencias: OcorrenciaWorker[];
  tempoProcessamento: number;
  erros: string[];
  tempos: TempoWorker[];
}

interface WorkerMessage {
  type?: string;
  ts?: number;
  workerId?: number;
  sucesso?: boolean;
  resultados?: ResultadoProcessamento[];
  occurrences?: OcorrenciaWorker[];
  metrics?: TempoWorker[];
  processedArquivos?: number;
  duration?: number;
  erro?: string;
  stack?: string;
  cacheStats?: { hits: number; misses: number };
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 100;
const YIELD_INTERVAL = 5;
const HEARTBEAT_MS = 3000;
const MAX_CACHE_SIZE = 500;

const EXTENSIONS_WITH_AST = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.java', '.kt', '.kts', '.gradle', '.gradle.kts',
  '.xml', '.html', '.htm', '.css'
]);

const astCache = new Map<string, { ast: unknown; mtimeMs: number }>();
let cacheHits = 0;
let cacheMisses = 0;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function yieldEventLoop(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delayMs: number = RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await sleep(delayMs * (attempt + 1));
      }
    }
  }
  throw lastError;
}

async function parseFileInline(
  relPath: string,
  content: string | null,
  fullCaminho: string,
  parseInline: boolean,
  extensions?: string[]
): Promise<{ content: string; ast: unknown }> {
  const ext = path.extname(relPath).toLowerCase();
  const exts = extensions || Array.from(EXTENSIONS_WITH_AST);

  const effectiveContent = content || '';
  const needsParsing = exts.includes(ext) || ext === '.ts' || ext === '.tsx';

  if (!parseInline || !needsParsing) {
    return { content: effectiveContent, ast: null };
  }

  const cacheKey = `${relPath}:${fullCaminho}`;
  let stats: fs.Stats | undefined;

  try {
    stats = await fs.promises.stat(fullCaminho);
  } catch {
    // ignore
  }

  const cached = astCache.get(cacheKey);
  if (cached && stats && cached.mtimeMs === stats.mtimeMs) {
    cacheHits++;
    return { content: effectiveContent, ast: cached.ast };
  }

  cacheMisses++;

  let ast: unknown = null;
  try {
    const babel = await import('@babel/parser');
    if (typeof babel.parse === 'function') {
      const parseOptions: Record<string, unknown> = {
        sourceType: 'module',
        allowAwaitOutsideFunction: true,
        allowImportExportEverywhere: true
      };

      if (ext === '.ts' || ext === '.tsx' || ext === '.d.ts') {
        parseOptions.plugins = ['typescript', 'jsx'];
      } else if (ext === '.jsx') {
        parseOptions.plugins = ['jsx'];
      }

      ast = babel.parse(effectiveContent, parseOptions);
    }
  } catch {
    ast = { parseError: true };
  }

  if (astCache.size >= MAX_CACHE_SIZE) {
    const firstKey = astCache.keys().next().value;
    if (firstKey) astCache.delete(firstKey);
  }

  astCache.set(cacheKey, { ast, mtimeMs: stats?.mtimeMs || Date.now() });

  return { content: effectiveContent, ast };
}

async function executarTecnicaEmArquivo(
  tecnica: TecnicaWorker,
  arquivo: FileEntryWorker,
  contexto: unknown,
  timeoutMs: number
): Promise<OcorrenciaWorker[]> {
  if (typeof tecnica?.aplicar !== 'function') return [];

  const { content, ast } = await parseFileInline(
    arquivo.relPath,
    arquivo.content,
    arquivo.fullCaminho,
    true,
    (workerData as WorkerData)?.extensions
  );

  const execPromise = tecnica.aplicar(content, arquivo.relPath, ast, arquivo.fullCaminho, contexto) as Promise<OcorrenciaWorker[]>;

  if (timeoutMs && timeoutMs > 0) {
    return Promise.race([
      execPromise,
      new Promise<OcorrenciaWorker[]>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout: tecnica '${tecnica.nome}' excedeu ${timeoutMs}ms`)),
          timeoutMs
        )
      )
    ]).catch((err: Error) => {
      return [{
        arquivo: arquivo.relPath,
        linha: 1,
        coluna: 1,
        tipo: 'ERRO_EXECUCAO',
        mensagem: `Erro ao executar técnica ${tecnica.nome}: ${err.message}`,
        severidade: 'erro',
        tecnica: tecnica.nome,
        contexto: {
          erro: err.message,
          stack: err.stack
        }
      }];
    });
  }

  try {
    return await execPromise as OcorrenciaWorker[];
  } catch (erro: unknown) {
    const err = erro as Error;
    return [{
      arquivo: arquivo.relPath,
      linha: 1,
      coluna: 1,
      tipo: 'ERRO_EXECUCAO',
      mensagem: `Erro ao executar técnica ${tecnica.nome}: ${err.message}`,
      severidade: 'erro',
      tecnica: tecnica.nome,
      contexto: {
        erro: err.message,
        stack: err.stack
      }
    }];
  }
}

async function processarLoteStreaming(
  files: FileEntryWorker[],
  contexto: unknown,
  batchSize: number = 10
): Promise<ResultadoProcessamento[]> {
  const resultados: ResultadoProcessamento[] = [];
  const timeoutMs = Number(workerData?.timeoutMs) || 0;
  const startTime = Date.now();

  const techniques = Array.isArray(workerData?.techniques)
    ? workerData.techniques as TecnicaWorker[]
    : [];

  const batches: FileEntryWorker[][] = [];
  for (let i = 0; i < files.length; i += batchSize) {
    batches.push(files.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async (file): Promise<ResultadoProcessamento> => {
      const fileResultado: FileResultado = {
        arquivo: file.relPath,
        ocorrencias: [],
        tempos: [],
        erros: []
      };

      for (const tecnica of techniques) {
        if (tecnica.test && !tecnica.test(file.relPath)) continue;
        if (tecnica.global) continue;

        try {
          const inicio = Date.now();
          const out = await withRetry(
            () => executarTecnicaEmArquivo(tecnica, file, contexto, timeoutMs),
            MAX_RETRIES,
            RETRY_DELAY_MS
          );
          const dur = Date.now() - inicio;
          if (out && Array.isArray(out)) fileResultado.ocorrencias.push(...out);
          fileResultado.tempos.push({
            tecnica: tecnica.nome || 'unknown',
            duracaoMs: dur
          });
        } catch (err: unknown) {
          const error = err as Error;
          fileResultado.erros.push(String(error.message));
          fileResultado.ocorrencias.push({
            arquivo: file.relPath,
            linha: 1,
            coluna: 1,
            tipo: 'ERRO_EXECUCAO',
            mensagem: `Erro ao executar técnica ${tecnica.nome}: ${error.message}`,
            severidade: 'erro',
            tecnica: tecnica.nome,
            contexto: { erro: error.message, stack: error.stack }
          });
        }
      }

      return {
        sucesso: fileResultado.erros.length === 0,
        arquivo: file.relPath,
        ocorrencias: fileResultado.ocorrencias,
        tempoProcessamento: Date.now() - startTime,
        erros: fileResultado.erros,
        tempos: fileResultado.tempos
      };
    });

    const batchResults = await Promise.all(batchPromises);
    resultados.push(...batchResults);

    await yieldEventLoop();
  }

  return resultados;
}

async function processarLote(
  files: FileEntryWorker[],
  contexto: unknown
): Promise<ResultadoProcessamento[]> {
  const resultados: ResultadoProcessamento[] = [];
  const timeoutMs = Number(workerData?.timeoutMs) || 0;
  const startTime = Date.now();

  const techniques = Array.isArray(workerData?.techniques)
    ? workerData.techniques as TecnicaWorker[]
    : [];

  let fileCount = 0;

  for (const file of files) {
    const fileResultado: FileResultado = {
      arquivo: file.relPath,
      ocorrencias: [],
      tempos: [],
      erros: []
    };

    for (const tecnica of techniques) {
      if (tecnica.test && !tecnica.test(file.relPath)) continue;
      if (tecnica.global) continue;

      try {
        const inicio = Date.now();
        const out = await withRetry(
          () => executarTecnicaEmArquivo(tecnica, file, contexto, timeoutMs),
          MAX_RETRIES,
          RETRY_DELAY_MS
        );
        const dur = Date.now() - inicio;
        if (out && Array.isArray(out)) fileResultado.ocorrencias.push(...out);
        fileResultado.tempos.push({
          tecnica: tecnica.nome || 'unknown',
          duracaoMs: dur
        });
      } catch (err: unknown) {
        const error = err as Error;
        fileResultado.erros.push(String(error.message));
        fileResultado.ocorrencias.push({
          arquivo: file.relPath,
          linha: 1,
          coluna: 1,
          tipo: 'ERRO_EXECUCAO',
          mensagem: `Erro ao executar técnica ${tecnica.nome}: ${error.message}`,
          severidade: 'erro',
          tecnica: tecnica.nome,
          contexto: { erro: error.message, stack: error.stack }
        });
      }
    }

    fileCount++;
    if (fileCount % YIELD_INTERVAL === 0) {
      await yieldEventLoop();
    }

    resultados.push({
      sucesso: fileResultado.erros.length === 0,
      arquivo: file.relPath,
      ocorrencias: fileResultado.ocorrencias,
      tempoProcessamento: Date.now() - startTime,
      erros: fileResultado.erros,
      tempos: fileResultado.tempos
    });
  }

  return resultados;
}

const port = parentPort;

async function main(): Promise<void> {
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  try {
    const wd = workerData as WorkerData;
    const contexto = wd?.contexto;
    const files = Array.isArray(wd?.files) ? wd.files as FileEntryWorker[] : [];
    const useStreaming = files.length > 1000;

    if (typeof port?.postMessage === 'function') {
      heartbeatInterval = setInterval(() => {
        try {
          port.postMessage({
            type: 'heartbeat',
            ts: Date.now(),
            workerId: process.pid,
            memory: process.memoryUsage().heapUsed,
            cacheSize: astCache.size
          } as WorkerMessage);
        } catch {
          // ignore
        }
      }, HEARTBEAT_MS);
    }

    const startTime = Date.now();
    const resultados = useStreaming
      ? await processarLoteStreaming(files, contexto, 10)
      : await processarLote(files, contexto);
    const duration = Date.now() - startTime;

    const occurrences = resultados.flatMap(r => r.ocorrencias || []);
    const metrics = resultados.flatMap(r => r.tempos || []);
    const errors = resultados.flatMap(r => r.erros || []);

    port?.postMessage({
      sucesso: true,
      resultados,
      workerId: process.pid,
      occurrences,
      metrics,
      processedArquivos: files.length,
      duration,
      errors,
      cacheStats: { hits: cacheHits, misses: cacheMisses }
    } as WorkerMessage);
  } catch (erro: unknown) {
    const err = erro as Error;
    try {
      port?.postMessage({
        sucesso: false,
        erro: err.message,
        stack: err.stack,
        workerId: process.pid
      } as WorkerMessage);
    } catch {
      // ignore
    }
  } finally {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    astCache.clear();
  }
}

main().catch((erro: unknown) => {
  const err = erro as Error;
  port?.postMessage({
    sucesso: false,
    erro: err.message,
    stack: err.stack,
    workerId: process.pid
  } as WorkerMessage);
});