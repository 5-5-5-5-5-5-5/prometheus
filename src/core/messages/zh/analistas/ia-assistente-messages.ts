// SPDX-License-Identifier: MIT
/**
 * IA Assistant Messages for GitHub Actions Analysis (Chinese)
 *
 * Version 2.0.0 - Enhanced and robust message catalog
 * Supports multiple analysis contexts, severity levels, and actionable insights.
 */

export const IAAssistenteMensagens = {
  // Core metadata
  metadata: {
    titulo: '智能 GitHub Actions 分析',
    subtitulo: '由 Prometheus AI 提供支持',
    versao: '2.0.0',
    ultimaAtualizacao: '2026-01-01',
    linguagensSuportadas: ['en', 'pt', 'es', 'fr', 'de', 'ja', 'zh', 'ko'],
  },

  // Risk severity levels with detailed descriptions
  risco: {
    titulo: '风险评估 (Risk Assessment)',
    baixo: {
      level: 'LOW',
      label: '低风险',
      description: '工作流程结构良好，无关键问题',
      cor: '#22c55e',
      icone: '',
      acao: '工作流程结构良好 - 保持当前实践',
    },
    medio: {
      level: 'MEDIUM',
      label: '中等风险',
      description: '需要关注发现的问题 - 审查建议',
      cor: '#f59e0b',
      icone: '️',
      acao: '审查发现的问题并应用建议的改进',
    },
    alto: {
      level: 'HIGH',
      label: '高风险',
      description: '需要立即行动 - 存在关键安全或性能问题',
      cor: '#ef4444',
      icone: '',
      acao: '立即采取行动解决关键安全和性能漏洞',
    },
    critico: {
      level: 'CRITICAL',
      label: '危急风险',
      description: '需要紧急行动 - 工作流程可能已被破坏或无法运行',
      cor: '#7f1d1d',
      icone: '',
      acao: '立即干预 - 工作流程可能易受攻击或已损坏',
    },
  },

  // Improvement recommendations
  melhoria: {
    titulo: '改进建议',
    bom: {
      level: 'EXCELLENT',
      label: '优秀 (>90)',
      descricao: '工作流程结构良好，已实施最佳实践',
      acao: '继续保持当前实践并考虑分享作为示例',
      icone: '',
    },
    espaco: {
      level: 'GOOD',
      label: '良好 (70-90)',
      descricao: '有改进空间 - 查看发现的问题',
      acao: '审查建议并逐步实施改进',
      icone: '',
    },
    refatorar: {
      level: 'NEEDS IMPROVEMENT',
      label: '需要改进 (50-70)',
      descricao: '发现多个问题 - 建议重构',
      acao: '考虑全面重构以解决多个关键问题',
      icone: '',
    },
    criticar: {
      level: 'POOR',
      label: '较差 (<50)',
      descricao: '发现关键问题 - 需要立即关注',
      acao: '立即进行全面的审查和重构',
      icone: '',
    },
  },

  // Detailed issue explanations
  explicacoes: {
    titulo: '问题解释',
    seguranca: {
      code: 'explicacaoSeguranca',
      label: '安全问题',
      descricao: '在工作流程配置中检测到安全漏洞',
      severidade: '高',
      categorias: [
        '硬编码密钥',
        '注入漏洞',
        '权限过高',
        '不安全的依赖',
      ],
    },
    performance: {
      code: 'explicacaoPerformance',
      label: '性能问题',
      descricao: '在工作流程中识别出性能优化机会',
      severidade: '中',
      categorias: [
        '运行缓慢的作业',
        '低效的矩阵',
        '缺少缓存',
        '过多的依赖',
      ],
    },
    boasPraticas: {
      code: 'explicacaoBoasPraticas',
      label: '最佳实践违规',
      descricao: '工作流程未遵循GitHub Actions的最佳实践',
      severidade: '低',
      categorias: [
        '命名约定',
        '文档',
        '错误处理',
        '模块化',
      ],
    },
  },

  // Problem categories with detailed descriptions
  problemas: {
    titulo: '已识别问题',

    // Security related
    actionDesatualizada: {
      code: 'actionDesatualizada',
      label: '过时的 Action',
      description: 'GitHub Action 使用了已知漏洞的过时版本',
      severity: '高',
      category: '安全',
      recommendation: '更新到最新版本或使用官方仓库的 Action',
    },
    envSensivel: {
      code: 'envSensivel',
      label: '检测到硬编码密钥',
      description: '敏感凭证或令牌在工作流程文件中暴露',
      severity: '危急',
      category: '安全',
      recommendation: '使用 GitHub Secrets 和环境变量代替硬编码值',
    },
    scriptInjection: {
      code: 'scriptInjection',
      label: '脚本注入风险',
      description: '工作流程脚本可能存在代码注入漏洞',
      severity: '危急',
      category: '安全',
      recommendation: '实施输入验证并清理所有用户输入',
    },
    containerSemUser: {
      code: 'containerSemUser',
      label: '容器以 root 身份运行',
      description: 'Docker 容器配置为以 root 用户运行',
      severity: '高',
      category: '安全',
      recommendation: '创建非 root 用户并配置容器以该用户运行',
    },
    tokenExcessivo: {
      code: 'tokenExcessivo',
      label: '令牌权限过多',
      description: 'GitHub 令牌拥有工作流程所需的过多权限',
      severity: '高',
      category: '安全',
      recommendation: '应用最小权限原则 - 授予所需的最小权限',
    },

    // Performance related
    matrixSemFailFast: {
      code: 'matrixSemFailFast',
      label: 'Matrix 未配置 fail-fast',
      description: 'Matrix 策略未能在首次失败时停止，浪费资源',
      severity: '中',
      category: '性能',
      recommendation: '在 matrix 配置中启用 fail-fast: true',
    },
    fetchDepth0: {
      code: 'fetchDepth0',
      label: '不必要的 fetch-depth 0',
      description: '获取完整的 git 历史记录，而只需要最近的提交',
      severity: '低',
      category: '性能',
      recommendation: '设置 fetch-depth 为合理的数字（例如 2-5）以加快检出速度',
    },
    timeoutAusente: {
      code: 'timeoutAusente',
      label: '未指定超时',
      description: '作业或步骤缺少超时配置，可能导致工作流程挂起',
      severity: '中',
      category: '性能',
      recommendation: '为所有作业和关键步骤配置适当的超时值',
    },
    buildSemParalelismo: {
      code: 'buildSemParalelismo',
      label: '作业可并行运行',
      description: '独立作业配置为顺序运行',
      severity: '低',
      category: '性能',
      recommendation: '配置作业依赖以在可能时启用并行执行',
    },

    // Best practices
    stepSemNome: {
      code: 'stepSemNome',
      label: '步骤缺少描述性名称',
      description: '工作流程步骤缺乏清晰命名，降低可读性和调试',
      severity: '低',
      category: '最佳实践',
      recommendation: '为所有工作流程步骤添加描述性名称',
    },
    jobSemNome: {
      code: 'jobSemNome',
      label: '作业缺少描述性名称',
      description: '工作流程作业缺少清晰的命名约定',
      severity: '低',
      category: '最佳实践',
      recommendation: '为所有工作流程作业使用一致的命名约定',
    },
    usoSudo: {
      code: 'usoSudo',
      label: '检测到 sudo 使用',
      description: '工作流程使用 sudo，可能表明权限问题',
      severity: '中',
      category: '最佳实践',
      recommendation: '配置适当的权限而不是在工作流程中使用 sudo',
    },
  },

  // Action buttons and UI elements
  acoes: {
    titulo: '操作按钮',
    analisar: 'AI 分析',
    analisar_detalhado: '详细分析',
    explicacao: '查看解释',
    ver_documentacao: '查看文档',
    corrigir: '应用修复',
    corrigir_todos: '应用所有修复',
    ignorar: '忽略',
    ignorar_todos: '忽略所有',
    exportar: '导出报告',
    compartilhar: '分享分析',
    copiar: '复制修复',
    testar: '测试修复',
    reavaliar: '重新评估',
    salvar: '保存',
    cancelar: '取消',
  },

  // Score system
  scores: {
    titulo: '分析分数',
    excelente: {
      level: 'EXCELLENT',
      label: '优秀 (>90)',
      min: 90,
      max: 100,
      descricao: '工作流程遵循所有最佳实践，无关键问题',
      nota: 'A+',
      cor: '#22c55e',
    },
    bom: {
      level: 'GOOD',
      label: '良好 (70-90)',
      min: 70,
      max: 89,
      descricao: '工作流程有较小问题但基本健全',
      nota: 'A',
      cor: '#3b82f6',
    },
    regular: {
      level: 'REGULAR',
      label: '一般 (50-70)',
      min: 50,
      max: 69,
      descricao: '工作流程有多个问题需要关注',
      nota: 'B',
      cor: '#f59e0b',
    },
    ruim: {
      level: 'POOR',
      label: '较差 (<50)',
      min: 0,
      max: 49,
      descricao: '工作流程有关键问题需要立即关注',
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
      if (score >= 90) return `优秀 (${score}/100)`;
      if (score >= 70) return `良好 (${score}/100)`;
      if (score >= 50) return `一般 (${score}/100)`;
      return `较差 (${score}/100)`;
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
