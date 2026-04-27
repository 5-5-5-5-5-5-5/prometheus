// SPDX-License-Identifier: MIT

export const CliImporterHandlerMessages = {
  scannerStarting: 'Starting imports check...',
  barrelsMissing: (qtd: number) => `${qtd} barrel(s) missing in tsconfig.json.`,
  barrelsOk: 'Imports and aliases are up to date.',
  scanError: (msg: string) => `Error scanning imports: ${msg}`
} as const;
export const CliImporterHandlerMensagens = CliImporterHandlerMessages;