// SPDX-License-Identifier: MIT

import type { Dirent } from 'node:fs';

import type { FileEntryWithAst } from '@';

import type { GuardianResult } from '../../guardian/resultado.js';

export interface AmbienteExecucao {
  arquivosValidosSet: Set<string>;
  guardian: GuardianResult;
}

export type ReportNivel = 'info' | 'aviso' | 'erro' | 'sucesso';

export interface ReportEvent {
  /** Código estável para i18n/mapeamento de mensagens (ex.: ARQ_PADRAO) */
  code?: string;
  /** Tipo de ocorrência (ex.: analise-arquitetura) */
  tipo: string;
  nivel?: ReportNivel;
  /** Mensagem final (quando já formatada) */
  mensagem?: string;
  /** Dados estruturados para formar a mensagem no reporter */
  data?: Record<string, unknown>;
  relPath: string;
  linha?: number;
  coluna?: number;
  origem?: string;
}

export type ReporterFn = (event: ReportEvent) => void;

export interface ContextoExecucao {
  baseDir: string;
  arquivos: FileEntryWithAst[];
  ambiente?: AmbienteExecucao;
  /**
   * Canal opcional para reportar ocorrências de forma desacoplada de mensagens.
   * Atenção: não deve ser serializado/replicado para Worker Threads (funções não são clonáveis).
   */
  report?: ReporterFn;
}

export interface InquisicaoOptions {
  includeContent?: boolean;
  incluirMetadados?: boolean;
  skipExec?: boolean;
}

export interface ScanOptions {
  includeContent?: boolean;
  includeAst?: boolean;
  filter?: (relPath: string, entry: Dirent) => boolean;
  onProgress?: (msg: string) => void;
}
