// SPDX-License-Identifier: MIT

/**
 * @fileoverview Mensagens de diagnóstico para o detector de construções sintáticas.
 * Fornece templates de texto para reportar construções sintáticas identificadas
 * e erros durante a análise.
 */

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Erro desconhecido';
}
export const DetectorConstrucoesSintaticasMensagens = {
  identificadas: (mensagemFinal: string) => `Construções sintáticas identificadas: ${mensagemFinal}`,
  erroAnalisar: (erro: ErroUnknown) => `Erro ao analisar construções sintáticas: ${erroToMessage(erro)}`
} as const;