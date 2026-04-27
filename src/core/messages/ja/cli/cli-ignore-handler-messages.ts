// SPDX-License-Identifier: MIT

export const CliIgnoreHandlerMensagens = {
  scannerIniciando: '.gitignore のチェックを開始しています...',
  arquivoAusente: 'プロジェクトに .gitignore ファイルが見つかりません。',
  arquivoIncompleto: (qtd: number) => `.gitignore が不完全です：${qtd} 件の共通パターンが不足しています。`,
  arquivoCompleto: '.gitignore は完了です。',
  erroScan: (msg: string) => `.gitignore のスキャン中にエラーが発生しました: ${msg}`
} as const;