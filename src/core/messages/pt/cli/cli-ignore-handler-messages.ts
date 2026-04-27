// SPDX-License-Identifier: MIT

export const CliIgnoreHandlerMensagens = {
  scannerIniciando: 'Iniciando verificação de .gitignore...',
  arquivoAusente: '.gitignore não encontrado no projeto.',
  arquivoIncompleto: (qtd: number) => `.gitignore incompleto: ${qtd} padrão(ões) comum(ns) ausentes.`,
  arquivoCompleto: '.gitignore está completo.',
  erroScan: (msg: string) => `Erro ao escanear .gitignore: ${msg}`
} as const;