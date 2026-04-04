// SPDX-License-Identifier: MIT
import { criarOcorrencia, type Ocorrencia } from '@';

/**
 * Cria uma ocorrência de erro de análise padronizada.
 * Útil para capturar try/catch em detectores e analistas.
 */
export function criarErroAnalise(relPath: string, erro?: unknown): Ocorrencia {
  return criarOcorrencia({
    tipo: 'ERRO_ANALISE',
    nivel: 'aviso',
    mensagem: erro instanceof Error ? erro.message : 'Erro ao analisar arquivo',
    relPath,
    linha: 1,
  }) as Ocorrencia;
}
