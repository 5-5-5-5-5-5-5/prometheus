// SPDX-License-Identifier: MIT

export const CliPadronizadorHandlerMensagens = {
  scannerIniciando: 'Iniciando verificação de padronização...',
  looseEquality: (qtd: number) => `${qtd} uso(s) de loose equality (==/!=) encontrado(s).`,
  asAny: (qtd: number) => `${qtd} uso(s) de "as any" encontrado(s).`,
  angleBracket: (qtd: number) => `${qtd} type assertion(ões) angle-bracket encontrada(s).`,
  tudoPadronizado: 'Nenhum problema de padronização encontrado.',
  erroScan: (msg: string) => `Erro ao escanear padronização: ${msg}`
} as const;