// SPDX-License-Identifier: MIT

export const CliComandoGuardianMensagens = {
  baselineNaoPermitidoFullScan: 'Não é permitido aceitar baseline em modo --full-scan. Remova a flag e repita.',
  diffMudancasDetectadas: (drift: number) => `Detectadas ${drift} mudança(s) desde o baseline.`,
  diffComoAceitarMudancas: 'Execute `sensei guardian --accept-baseline` para aceitar essas mudanças.',
  baselineCriadoComoAceitar: 'Execute `sensei guardian --accept-baseline` para aceitá-lo ou `sensei diagnosticar` novamente.'
} as const;