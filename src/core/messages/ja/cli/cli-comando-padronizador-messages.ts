// SPDX-License-Identifier: MIT

export const CliComandoPadronizadorMensagens = {
  descricao: 'プロジェクト内の演算子の使用を標準化（例：===、!==、?? vs ||）',
  escaneando: '標準化されていないパターンを検索中...',
  arquivoProcessado: '処理済みファイル：{path}',
  totalEncontrado: '{total} 件の標準化可能な出現が見つかりました。',
  alteracoesConcluidas: '標準化が完了しました（{total} ファイル）。',
  detalheOcorrencia: '[{linha}:{coluna}] 演算子 "{operador}" は "{sugerido}" に標準化できます。',
  asAnyEncontrado: '[{linha}:{coluna}] "as any" が検出されました。"as unknown" またはより具体的な型を使用してください。',
  erroProcessar: 'ファイル {path} の処理エラー：{erro}'
} as const;