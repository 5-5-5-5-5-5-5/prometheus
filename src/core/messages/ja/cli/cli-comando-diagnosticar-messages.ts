// SPDX-License-Identifier: MIT

export const CliComandoDiagnosticarMensagens = {
  linhaEmBranco: '',
  fastModeTipo: '診断',
  sugestoesHeader: '┌── クイック提案 ─────────────────────────────────────────',
  sugestoesFooter: '└───────────────────────────────────────────────────────────────',
  nenhumaFlagRelevante: '関連するフラグが検出されませんでした — --help でオプションを確認してください。',
  detalheLinha: (texto: string) => `  ${texto}`,
  detalheSaidaEstruturada: '構造化出力: JSONを出力します (CI用)。--export と組み合わせてファイルを保存します。',
  detalheGuardian: 'Guardian: 完全性チェックを実行します (デプロイ推奨)。',
  detalheExecutive: 'Executive: 深刻な問題のみ表示します (会議用)。',
  detalheFull: 'Full: 詳細なレポートをローカルに生成します (長くなる場合があります)。',
  detalheFast: 'Fast: Workersを使用して並列処理します (大規模プロジェクトやCI用)。',
  detalheCompact: 'Compact: 進捗を統合し、要点のみ表示します。',
  detalheAutoFix: 'Auto-fix: 高速修正を適用します。注意して使用してください。',
  detalheAutoFixConservative: 'ショートカット: --auto-fix --auto-fix-mode conservative と同等',
  detalheIncludePatterns: (count: number, joined: string) => `インクルードパターン: ${count} (${joined})`,
  detalheExcludePatterns: (count: number, joined: string) => `除外パターン: ${count} (${joined})`,
  detalheExport: (relDir: string) => `エクスポート: サマリーを ./${relDir} に保存します (デフォルト)。`,
  detalheExportFull: 'Export-full: gzipシャードとマニフェストを生成します (巨大になる場合があります)。完全なダンプが必要な場合のみ使用してください。',
  detalheLogLevel: (logNivel: string) => `ログレベル: ${String(logNivel)} (--log-level debug でより詳細に表示)`,
  dicaPrefiraLogLevelDebug: 'ヒント: 従来の --debug/--dev よりも --log-level debug を推奨します。',
  dicaAutoFixConservative: 'ヒント: --auto-fix-conservative はショートカットです。明確にするために --auto-fix --auto-fix-mode conservative を明示することをお勧めします。',
  spinnerExecutando: '[スキャン] 診断を実行中...',
  spinnerFase: (titulo: string) => `[スキャン] ${titulo}...`,
  spinnerConcluido: '診断完了。',
  spinnerFalhou: '診断失敗。'
} as const;