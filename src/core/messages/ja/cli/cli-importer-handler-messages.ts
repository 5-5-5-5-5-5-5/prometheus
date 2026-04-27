// SPDX-License-Identifier: MIT

export const CliImporterHandlerMensagens = {
  scannerIniciando: 'imports のチェックを開始しています...',
  barrelsFaltando: (qtd: number) => `tsconfig.json に ${qtd} 件の barrel が設定されていません。`,
  barrelsOk: 'Imports とエイリアスは正常です。',
  erroScan: (msg: string) => `imports のスキャン中にエラーが発生しました: ${msg}`
} as const;