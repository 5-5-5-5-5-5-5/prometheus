// SPDX-License-Identifier: MIT

import { analistaGithubActions, analistaGithubActionsGlobal, registrarDetectorGithubActions } from '@analistas/plugins';
import type { ResultadoAnaliseSdk } from '@projeto-types/comum';

import type { Ocorrencia } from '@';

export type ResultadoAnalise = ResultadoAnaliseSdk;

/**
 * Calcula score baseado em ocorrências encontradas
 */
function calcularScore(ocorrencias: Ocorrencia[]): number {
  if (!ocorrencias.length) return 100;
  let penalidade = 0;
  for (const o of ocorrencias) {
    switch (o.nivel) {
      case 'erro': penalidade += 10; break;
      case 'aviso': penalidade += 5; break;
      case 'info': penalidade += 2; break;
    }
  }
  return Math.max(0, 100 - penalidade);
}

/**
 * Prometheus SDK Principal
 * Fornece acesso programático aos analistas e sistema de plugins
 */
export const PrometheusSDK = {
  /**
   * Analisa um conteúdo de workflow individual
   */
  async analisarGithubActions(conteudo: string, relPath: string = '.github/workflows/main.yml'): Promise<ResultadoAnalise> {
    const startTime = Date.now();
    try {
      const res = await analistaGithubActions.aplicar(conteudo, relPath, null, undefined, undefined);
      const ocorrencias = Array.isArray(res) ? res : [];
      const score = calcularScore(ocorrencias);
      const sugestoes = ocorrencias.filter(o => o.sugestao).map(o => o.sugestao).filter((s): s is string => Boolean(s));
      return {
        score,
        problemas: ocorrencias,
        sugestoes,
        tempoAnalise: Date.now() - startTime
      };
    } catch {
      return {
        score: 0,
        problemas: [],
        sugestoes: [],
        tempoAnalise: Date.now() - startTime
      };
    }
  },

  /**
   * Analisa um repositório completo (Contexto global)
   */
  async analisarRepositorio(contexto: unknown): Promise<Ocorrencia[]> {
    try {
      const res = await analistaGithubActionsGlobal.aplicar('', '', null, undefined, contexto as import('@').ContextoExecucao);
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },

  /**
   * Registra um novo plugin de detector
   */
  registrarDetector: registrarDetectorGithubActions
};