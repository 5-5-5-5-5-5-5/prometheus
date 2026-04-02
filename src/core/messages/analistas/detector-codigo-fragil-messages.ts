// SPDX-License-Identifier: MIT

/**
 * @fileoverview Mensagens de diagnóstico para o detector de código frágil.
 * Fornece templates de texto para reportar fragilidades no código com
 * resumo de severidade e detalhes estruturados.
 */

import type { FragilidadesDetalhesArgs } from '../../../types/core/config/config.js';

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Erro desconhecido';
}
export const DetectorCodigoFragilMensagens = {
  fragilidadesResumo: (severidade: string, resumo: string, detalhes: FragilidadesDetalhesArgs) => `Fragilidades ${severidade}: ${resumo} | Detalhes: ${JSON.stringify(detalhes)}`,
  erroAnalisarCodigoFragil: (erro: ErroUnknown) => `Erro ao analisar código frágil: ${erroToMessage(erro)}`
} as const;