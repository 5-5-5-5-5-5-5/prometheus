// SPDX-License-Identifier: MIT
/**
 * IA Assistant Messages for GitHub Actions Analysis
 *
 * Enhanced and robust message catalog for AI assistant functionality.
 * Supports multiple analysis contexts, severity levels, and actionable insights.
 * Version: 2.0.0
 */

export const IAAssistenteMensagens = {
  // Core metadata
  metadata: {
    titulo: 'Intelligent GitHub Actions Analysis',
    subtitle: 'Powered by Prometheus IA',
    version: '2.0.0',
    lastUpdated: '2026-01-01',
    supportedLanguages: ['en', 'pt', 'es', 'fr', 'de', 'ja', 'zh', 'ko'],
  },

  // Risk severity levels with detailed descriptions
  risco: {
    titulo: 'Risk Assessment',
    baixo: {
      level: 'LOW',
      label: 'LOW Risk',
      description: 'Well structured workflow with no critical issues',
      color: '#22c55e',
      icon: '',
      action: 'Workflow is properly structured - maintain current practices',
    },
    medio: {
      level: 'MEDIUM',
      label: 'MEDIUM Risk',
      description: 'Attention needed to issues found - review recommendations',
      color: '#f59e0b',
      icon: '️',
      action: 'Review identified issues and apply suggested improvements',
    },
    alto: {
      level: 'HIGH',
      label: 'HIGH Risk',
      description: 'Immediate action required - critical security or performance issues',
      color: '#ef4444',
      icon: '',
      action: 'Take immediate action to address critical security and performance vulnerabilities',
    },
    critico: {
      level: 'CRITICAL',
      label: 'CRITICAL Risk',
      description: 'Emergency action required - workflow may be compromised or non-functional',
      color: '#7f1d1d',
      icon: '',
      action: 'Immediate intervention required - workflow may be vulnerable or broken',
    },
  },

  // Improvement recommendations
  melhoria: {
    titulo: 'Improvement Recommendations',
    bom: {
      level: 'EXCELLENT',
      label: 'Excellent (>90)',
      description: 'Workflow is well-structured with best practices implemented',
      action: 'Continue maintaining current practices and consider sharing as example',
      icon: '',
    },
    espaco: {
      level: 'GOOD',
      label: 'Good (70-90)',
      description: 'Room for improvement - some issues detected but workflow functional',
      action: 'Review recommendations and implement improvements gradually',
      icon: '',
    },
    refatorar: {
      level: 'NEEDS IMPROVEMENT',
      label: 'Needs Improvement (50-70)',
      description: 'Multiple issues detected - refactoring recommended',
      action: 'Consider comprehensive refactoring to address multiple critical issues',
      icon: '',
    },
    criticar: {
      level: 'POOR',
      label: 'Poor (<50)',
      description: 'Critical issues detected - workflow requires immediate attention',
      action: 'Immediate comprehensive review and refactoring required',
      icon: '',
    },
  },

  // Detailed issue explanations
  explicacoes: {
    titulo: 'Issue Explanations',
    security: {
      code: 'explicacaoSeguranca',
      label: 'Security Issue',
      description: 'Potential security vulnerability detected in workflow configuration',
      severity: 'high',
      categories: [
        'hardcoded-secrets',
        'injection-vulnerabilities',
        'excessive-permissions',
        'unsafe-dependencies',
      ],
    },
    performance: {
      code: 'explicacaoPerformance',
      label: 'Performance Issue',
      description: 'Workflow performance optimization opportunities identified',
      severity: 'medium',
      categories: [
        'long-running-jobs',
        'inefficient-matrix',
        'missing-caching',
        'excessive-dependencies',
      ],
    },
    bestPractices: {
      code: 'explicacaoBoasPraticas',
      label: 'Best Practice Violation',
      description: 'Workflow does not follow established GitHub Actions best practices',
      severity: 'low',
      categories: [
        'naming-conventions',
        'documentation',
        'error-handling',
        'modularity',
      ],
    },
  },

  // Problem categories with detailed descriptions
  problemas: {
    titulo: 'Identified Issues',

    // Security related
    actionDesatualizada: {
      code: 'actionDesatualizada',
      label: 'Outdated Action',
      description: 'GitHub Action is using an outdated version with known vulnerabilities',
      severity: 'high',
      category: 'security',
      recommendation: 'Update to latest version or use official repository actions',
    },
    envSensivel: {
      code: 'envSensivel',
      label: 'Hardcoded Secret Detected',
      description: 'Sensitive credentials or tokens are exposed in workflow files',
      severity: 'critical',
      category: 'security',
      recommendation: 'Use GitHub Secrets and environment variables instead of hardcoded values',
    },
    scriptInjection: {
      code: 'scriptInjection',
      label: 'Script Injection Risk',
      description: 'Potential code injection vulnerability in workflow scripts',
      severity: 'critical',
      category: 'security',
      recommendation: 'Implement input validation and sanitize all user inputs',
    },
    containerSemUser: {
      code: 'containerSemUser',
      label: 'Container Running as Root',
      description: 'Docker container is configured to run as root user',
      severity: 'high',
      category: 'security',
      recommendation: 'Create non-root user and configure container to run as that user',
    },
    tokenExcessivo: {
      code: 'tokenExcessivo',
      label: 'Token with Excessive Permissions',
      description: 'GitHub token has more permissions than necessary for workflow',
      severity: 'high',
      category: 'security',
      recommendation: 'Apply principle of least privilege - grant minimal required permissions',
    },

    // Performance related
    matrixSemFailFast: {
      code: 'matrixSemFailFast',
      label: 'Matrix Without Fail-Fast',
      description: 'Matrix strategy does not stop on first failure, wasting resources',
      severity: 'medium',
      category: 'performance',
      recommendation: 'Enable fail-fast: true in matrix configuration',
    },
    fetchDepth0: {
      code: 'fetchDepth0',
      label: 'Unnecessary Fetch-Depth 0',
      description: 'Fetching entire git history when only recent commits are needed',
      severity: 'low',
      category: 'performance',
      recommendation: 'Set fetch-depth to a reasonable number (e.g., 2-5) for faster checkout',
    },
    timeoutAusente: {
      code: 'timeoutAusente',
      label: 'Timeout Not Specified',
      description: 'Job or step lacks timeout configuration, potentially hanging workflow',
      severity: 'medium',
      category: 'performance',
      recommendation: 'Configure appropriate timeout values for all jobs and critical steps',
    },
    buildSemParalelismo: {
      code: 'buildSemParalelismo',
      label: 'Jobs Could Run in Parallel',
      description: 'Independent jobs are configured to run sequentially',
      severity: 'low',
      category: 'performance',
      recommendation: 'Configure job dependencies to enable parallel execution where possible',
    },

    // Best practices
    stepSemNome: {
      code: 'stepSemNome',
      label: 'Step Without Descriptive Name',
      description: 'Workflow step lacks clear naming, reducing readability and debugging',
      severity: 'low',
      category: 'best-practices',
      recommendation: 'Add descriptive names to all workflow steps for better traceability',
    },
    jobSemNome: {
      code: 'jobSemNome',
      label: 'Job Without Descriptive Name',
      description: 'Workflow job lacks clear naming convention',
      severity: 'low',
      category: 'best-practices',
      recommendation: 'Use consistent naming convention for all workflow jobs',
    },
    usoSudo: {
      code: 'usoSudo',
      label: 'sudo Usage Detected',
      description: 'Workflow uses sudo which may indicate permission issues',
      severity: 'medium',
      category: 'best-practices',
      recommendation: 'Configure proper permissions instead of using sudo in workflows',
    },
  },

  // Action buttons and UI elements
  acoes: {
    titulo: 'Action Buttons',
    analisar: 'Analyze with AI',
    analisar_detalhado: 'Detailed Analysis',
    explicacao: 'View Explanation',
    ver_documentacao: 'See Documentation',
    corrigir: 'Apply Correction',
    corrigir_todos: 'Apply All Corrections',
    ignorar: 'Ignore',
    ignorar_todos: 'Ignore All',
    exportar: 'Export Report',
    compartilhar: 'Share Analysis',
    copiar: 'Copy Fix',
    testar: 'Test Fix',
  },

  // Score system
  scores: {
    titulo: 'Analysis Score',
    excelente: {
      level: 'EXCELLENT',
      label: 'Excellent (>90)',
      min: 90,
      max: 100,
      description: 'Workflow follows all best practices with no critical issues',
      grade: 'A+',
      color: '#22c55e',
    },
    bom: {
      level: 'GOOD',
      label: 'Good (70-90)',
      min: 70,
      max: 89,
      description: 'Workflow has minor issues but is fundamentally sound',
      grade: 'A',
      color: '#3b82f6',
    },
    regular: {
      level: 'REGULAR',
      label: 'Regular (50-70)',
      min: 50,
      max: 69,
      description: 'Workflow has several issues that need attention',
      grade: 'B',
      color: '#f59e0b',
    },
    ruim: {
      level: 'POOR',
      label: 'Poor (<50)',
      min: 0,
      max: 49,
      description: 'Workflow has critical issues requiring immediate attention',
      grade: 'F',
      color: '#ef4444',
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
      if (score >= 90) return `Excellent (${score}/100)`;
      if (score >= 70) return `Good (${score}/100)`;
      if (score >= 50) return `Regular (${score}/100)`;
      return `Poor (${score}/100)`;
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

export interface IIAReport {
  score: number;
  riskLevel: RiscoLevel;
  issues: string[];
  suggestions: IIASuggestion[];
  timestamp: Date;
}
