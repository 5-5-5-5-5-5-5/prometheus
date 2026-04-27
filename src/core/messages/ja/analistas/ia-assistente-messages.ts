// SPDX-License-Identifier: MIT
/**
 * IA Assistant Messages for GitHub Actions Analysis (Japanese)
 *
 * Version 2.0.0 - Enhanced and robust message catalog
 * Supports multiple analysis contexts, severity levels, and actionable insights.
 */

export const IAAssistenteMensagens = {
  // Core metadata
  metadata: {
    titulo: 'インテリジェント GitHub Actions 分析',
    subtitulo: 'Prometheus AI で駆動',
    versao: '2.0.0',
    ultimaAtualizacao: '2026-01-01',
    linguagensSuportadas: ['en', 'pt', 'es', 'fr', 'de', 'ja', 'zh', 'ko'],
  },

  // Risk severity levels with detailed descriptions
  risco: {
    titulo: 'リスク評価 (Risk Assessment)',
    baixo: {
      level: 'LOW',
      label: '低リスク',
      description: 'ワークフロー構造良好、关键問題なし',
      cor: '#22c55e',
      icone: '',
      acao: 'ワークフロー構造良好 - 現在の実践を維持',
    },
    medio: {
      level: 'MEDIUM',
      label: '中リスク',
      description: '検出された問題に注意が必要 - 提案を確認',
      cor: '#f59e0b',
      icone: '️',
      acao: '検出された問題を確認し、提案された改善を実施',
    },
    alto: {
      level: 'HIGH',
      label: '高リスク',
      description: '即時対応が必要 - 重要なセキュリティまたは性能問題',
      cor: '#ef4444',
      icone: '',
      acao: '重要なセキュリティと性能の脆弱性に対処するために即時対応',
    },
    critico: {
      level: 'CRITICAL',
      label: '危急リスク',
      description: '緊急対応が必要 - ワークフローが破損または機能していない可能性あり',
      cor: '#7f1d1d',
      icone: '',
      acao: '直ちに介入が必要 - ワークフローが脆弱または破損している可能性あり',
    },
  },

  // Improvement recommendations
  melhoria: {
    titulo: '改善提案',
    bom: {
      level: 'EXCELLENT',
      label: '優秀 (>90)',
      descricao: 'ワークフロー構造良好、ベストプラクティス実装済み',
      acao: '現在の実践を維持し、事例として共有を検討',
      icone: '',
    },
    espaco: {
      level: 'GOOD',
      label: '良好 (70-90)',
      descricao: '改善の余地あり - 検出された問題を確認',
      acao: '提案を確認し、段階的に改善を実施',
      icone: '',
    },
    refatorar: {
      level: 'NEEDS IMPROVEMENT',
      label: '改善が必要 (50-70)',
      descricao: '複数の問題検出 - リファクタリング推奨',
      acao: 'ワークフローのリファクタリングを検討して複数の重大な問題に対処',
      icone: '',
    },
    criticar: {
      level: 'POOR',
      label: '要改善 (<50)',
      descricao: '重大な問題検出 - 即時対応が必要',
      acao: '直ちに包括的なレビューとリファクタリングが必要',
      icone: '',
    },
  },

  // Detailed issue explanations
  explicacoes: {
    titulo: '問題説明',
    seguranca: {
      code: 'explicacaoSeguranca',
      label: 'セキュリティ問題',
      descricao: 'ワークフロー設定でセキュリティ脆弱性を検出',
      severidade: '高',
      categorias: [
        'ハードコードされたシークレット',
        'インジェクション脆弱性',
        '過度な権限',
        '安全でない依存関係',
      ],
    },
    performance: {
      code: 'explicacaoPerformance',
      label: 'パフォーマンス問題',
      descricao: 'ワークフローでパフォーマンス最適化の機会を特定',
      severidade: '中',
      categorias: [
        '長時間実行中のジョブ',
        '非効率なマトリックス',
        'キャッシュの欠如',
        '過度な依存関係',
      ],
    },
    boasPraticas: {
      code: 'explicacaoBoasPraticas',
      label: 'ベストプラクティス違反',
      descricao: 'ワークフローがGitHub Actionsのベストプラクティスに準拠していない',
      severidade: '低',
      categorias: [
        '命名規則',
        'ドキュメント',
        'エラーハンドリング',
        'モジュール性',
      ],
    },
  },

  // Problem categories with detailed descriptions
  problemas: {
    titulo: '検出された問題',

    // Security related
    actionDesatualizada: {
      code: 'actionDesatualizada',
      label: '古いアクション',
      description: 'GitHub Actionが既知の脆弱性のある古いバージョンを使用',
      severity: '高',
      category: 'セキュリティ',
      recommendation: '最新バージョンに更新または公式リポジトリのアクションを使用',
    },
    envSensivel: {
      code: 'envSensivel',
      label: 'ハードコードされたシークレットを検出',
      description: 'シークレットやトークンがワークフローファイルで露出',
      severity: '危急',
      category: 'セキュリティ',
      recommendation: 'GitHub Secretsと環境変数を使用してハードコーディングを回避',
    },
    scriptInjection: {
      code: 'scriptInjection',
      label: 'スクリプトインジェクションのリスク',
      description: 'ワークフロースクリプトにコードインジェクションの脆弱性あり',
      severity: '危急',
      category: 'セキュリティ',
      recommendation: '入力検証を実装し、すべてのユーザー入力をサニタイズ',
    },
    containerSemUser: {
      code: 'containerSemUser',
      label: 'コンテナがrootで実行中',
      description: 'Dockerコンテナがrootユーザーで実行中',
      severity: '高',
      category: 'セキュリティ',
      recommendation: '非rootユーザーを作成し、そのユーザーでコンテナを実行するように設定',
    },
    tokenExcessivo: {
      code: 'tokenExcessivo',
      label: 'トークンの権限が過剰',
      description: 'GitHubトークンにワークフローに必要以上の権限あり',
      severity: '高',
      category: 'セキュリティ',
      recommendation: '最小権限の原則を適用 - 必要最小限の権限を付与',
    },

    // Performance related
    matrixSemFailFast: {
      code: 'matrixSemFailFast',
      label: 'Matrixにfail-fastが未設定',
      description: 'Matrix戦略が最初の失敗で停止せず、リソースを浪費',
      severity: '中',
      category: '性能',
      recommendation: 'matrix設定でfail-fast: trueを有効化',
    },
    fetchDepth0: {
      code: 'fetchDepth0',
      label: '不要なfetch-depth 0',
      description: '最近のコミットのみ必要なのに完全なgit履歴を取得',
      severity: '低',
      category: '性能',
      recommendation: 'チェックアウトを高速化するため、fetch-depthを2-5などの適切な数に設定',
    },
    timeoutAusente: {
      code: 'timeoutAusente',
      label: 'タイムアウト未指定',
      description: 'ジョブまたはステップにタイムアウト設定がなく、ワークフローがハングする可能性',
      severity: '中',
      category: '性能',
      recommendation: 'すべてのジョブと重要なステップに適切なタイムアウト値を設定',
    },
    buildSemParalelismo: {
      code: 'buildSemParalelismo',
      label: 'ジョブを並列実行可能',
      description: '独立したジョブが順次実行されるように設定',
      severity: '低',
      category: '性能',
      recommendation: '可能であれば並列実行を有効にするためにジョブ依存関係を構成',
    },

    // Best practices
    stepSemNome: {
      code: 'stepSemNome',
      label: 'ステップに説明性のある名前がありません',
      description: 'ワークフローのステップが明確に命名されておらず、可読性とデバッグが困難',
      severity: '低',
      category: 'ベストプラクティス',
      recommendation: 'すべてのワークフローステップに説明性のある名前を追加',
    },
    jobSemNome: {
      code: 'jobSemNome',
      label: 'ジョブに説明性のある名前がありません',
      description: 'ワークフロージョブに明確な命名規則が不足',
      severity: '低',
      category: 'ベストプラクティス',
      recommendation: 'すべてのワークフロージョブに一貫した命名規則を使用',
    },
    usoSudo: {
      code: 'usoSudo',
      label: 'sudo使用を検出',
      description: 'ワークフローでsudoが使用されており、権限の問題を示唆',
      severity: '中',
      category: 'ベストプラクティス',
      recommendation: 'ワークフローでsudoを使用する代わりに適切な権限を構成',
    },
  },

  // Action buttons and UI elements
  acoes: {
    titulo: '操作ボタン',
    analisar: 'AI 分析',
    analisar_detalhado: '詳細分析',
    explicacao: '説明を表示',
    ver_documentacao: 'ドキュメントを表示',
    corrigir: '修正を適用',
    corrigir_todos: 'すべての修正を適用',
    ignorar: '無視',
    ignorar_todos: 'すべての無視',
    exportar: 'レポートをエクスポート',
    compartilhar: '分析を共有',
    copiar: '修正をコピー',
    testar: '修正をテスト',
    reavaliar: '再評価',
    salvar: '保存',
    cancelar: 'キャンセル',
  },

  // Score system
  scores: {
    titulo: '分析スコア',
    excelente: {
      level: 'EXCELLENT',
      label: '優秀 (>90)',
      min: 90,
      max: 100,
      descricao: 'ワークフローはすべてのベストプラクティスに準拠し、关键問題なし',
      nota: 'A+',
      cor: '#22c55e',
    },
    bom: {
      level: 'GOOD',
      label: '良好 (70-90)',
      min: 70,
      max: 89,
      descricao: 'ワークフローは基本的に健全だが、改善の余地あり',
      nota: 'A',
      cor: '#3b82f6',
    },
    regular: {
      level: 'REGULAR',
      label: '通常 (50-70)',
      min: 50,
      max: 69,
      descricao: 'ワークフローにいくつかの問題があり、注意が必要',
      nota: 'B',
      cor: '#f59e0b',
    },
    ruim: {
      level: 'POOR',
      label: '要改善 (<50)',
      min: 0,
      max: 49,
      descricao: 'ワークフローに关键問題があり、立即対応が必要',
      nota: 'F',
      cor: '#ef4444',
    },
  },

  // Additional utility methods metadata
  utils: {
    getRiskColor: (level: string) => {
      const colors: Record<string, string> = {
        low: '#22c55e',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#7f1d1d',
      };
      return colors[level] || '#6b7280';
    },
    getRiskIcon: (level: string) => {
      const icons: Record<string, string> = {
        low: '',
        medium: '️',
        high: '',
        critical: '',
      };
      return icons[level] || '';
    },
    formatScore: (score: number) => {
      if (score >= 90) return `優秀 (${score}/100)`;
      if (score >= 70) return `良好 (${score}/100)`;
      if (score >= 50) return `通常 (${score}/100)`;
      return `要改善 (${score}/100)`;
    },
  },

} as const;

// Type exports for TypeScript integration
export type RiscoLevel = 'low' | 'medium' | 'high' | 'critical';
export type ProblemCategory = 'security' | 'performance' | 'best-practices';
export type LanguageCode = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko';

export interface IIASuggestion {
  problemCode: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: ProblemCategory;
  description: string;
  recommendation: string;
  icon?: string;
}

export interface IRelatorioIA {
  score: number;
  riskLevel: RiscoLevel;
  issues: string[];
  suggestions: IIASuggestion[];
  timestamp: Date;
  workflowName?: string;
  analysisType?: 'security' | 'performance' | 'comprehensive';
}

export interface IMetrics {
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  score: number;
  grade: string;
}
