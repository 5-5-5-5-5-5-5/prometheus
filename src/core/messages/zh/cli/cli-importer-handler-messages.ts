// SPDX-License-Identifier: MIT

export const CliImporterHandlerMensagens = {
  scannerIniciando: '正在检查 imports...',
  barrelsFaltando: (qtd: number) => `${qtd} 个 barrel 未在 tsconfig.json 中配置。`,
  barrelsOk: 'Imports 和别名正常。',
  erroScan: (msg: string) => `扫描 imports 时出错：${msg}`
} as const;