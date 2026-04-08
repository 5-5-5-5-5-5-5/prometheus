// SPDX-License-Identifier: MIT

export const CliComandoGuardianMensagens = {
  baselineNaoPermitidoFullScan: 'Não é permitido aceitar baseline em modo --full-scan. Remova a flag e repita.',
  diffMudancasDetectadas: (drift: number) => `Detectadas ${drift} mudança(s) desde o baseline.`,
  diffComoAceitarMudancas: 'Execute `prometheus guardian --accept-baseline` para aceitar essas mudanças.',
  baselineCriadoComoAceitar: 'Execute `prometheus guardian --accept-baseline` para aceitá-lo ou `prometheus diagnosticar` novamente.'
} as const;