// SPDX-License-Identifier: MIT

export const CliPadronizadorHandlerMessages = {
  scannerStarting: 'Starting standardization check...',
  looseEquality: (qtd: number) => `Found ${qtd} use(s) of loose equality (==/!=).`,
  asAny: (qtd: number) => `Found ${qtd} use(s) of "as any".`,
  angleBracket: (qtd: number) => `Found ${qtd} angle-bracket type assertion(s).`,
  tudoPadronizado: 'No standardization problems found.',
  scanError: (msg: string) => `Error scanning standardization: ${msg}`
} as const;
export const CliPadronizadorHandlerMensagens = CliPadronizadorHandlerMessages;