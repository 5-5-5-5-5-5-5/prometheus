// SPDX-License-Identifier: MIT
/**
 * Tipos para sistema de correções automáticas
 */

import type { Ocorrencia } from '../../comum/ocorrencias.js';

export interface CorrecaoResult {
  sucesso: boolean;
  arquivo: string;
  linhasModificadas: number;
  erro?: string;
}

export interface CorrecaoConfig {
  dryRun: boolean;
  minConfianca: number;
  verbose: boolean;
  interactive: boolean;
}

export interface ResultadoAnaliseEstrutural {
  sucesso: boolean;
  arquivosAnalisados: number;
  problemas: Ocorrencia[];
  sugestoes: string[];
}