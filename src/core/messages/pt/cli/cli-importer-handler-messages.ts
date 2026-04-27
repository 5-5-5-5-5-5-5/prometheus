// SPDX-License-Identifier: MIT

export const CliImporterHandlerMensagens = {
  scannerIniciando: 'Iniciando verificação de imports...',
  barrelsFaltando: (qtd: number) => `${qtd} barrel(s) faltando no tsconfig.json.`,
  barrelsOk: 'Imports e aliases em dia.',
  erroScan: (msg: string) => `Erro ao escanear imports: ${msg}`
} as const;