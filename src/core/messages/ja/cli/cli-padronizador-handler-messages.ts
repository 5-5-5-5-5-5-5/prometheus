// SPDX-License-Identifier: MIT

export const CliPadronizadorHandlerMensagens = {
  scannerIniciando: '標準化のチェックを開始しています...',
  looseEquality: (qtd: number) => `弱い等価演算子（==/!=）の使用が ${qtd} 件見つかりました。`,
  asAny: (qtd: number) => `"as any" の使用が ${qtd} 件見つかりました。`,
  angleBracket: (qtd: number) => `アングルブラケット型アサーションが ${qtd} 件見つかりました。`,
  tudoPadronizado: '標準化の問題は見つかりませんでした。',
  erroScan: (msg: string) => `標準化のスキャン中にエラーが発生しました: ${msg}`
} as const;