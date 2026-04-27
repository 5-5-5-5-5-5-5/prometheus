// SPDX-License-Identifier: MIT

export const CliIgnoreHandlerMessages = {
  scannerStarting: 'Starting .gitignore check...',
  fileMissing: '.gitignore file not found in the project.',
  fileIncomplete: (qtd: number) => `.gitignore incomplete: ${qtd} common pattern(s) missing.`,
  fileComplete: '.gitignore is complete.',
  scanError: (msg: string) => `Error scanning .gitignore: ${msg}`
} as const;
export const CliIgnoreHandlerMensagens = CliIgnoreHandlerMessages;