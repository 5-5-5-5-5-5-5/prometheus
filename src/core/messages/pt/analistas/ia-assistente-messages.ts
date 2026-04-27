// SPDX-License-Identifier: MIT
/**
 * Mensagens do Assistente de IA para Análise de GitHub Actions
 *
 * Versão aprimorada e robusta do catálogo de mensagens.
 * Suporta múltiplos contextos de análise, níveis de severidade e insights acionáveis.
 * Versão: 2.0.0
 */

export const IAAssistenteMensagens = {
  // Metadados principais
  metadata: {
    titulo: 'Análise Inteligente de GitHub Actions',
    subtitulo: 'Impulsionado por IA do Prometheus',
    versao: '2.0.0',
    ultimaAtualizacao: '2026-01-01',
    linguagensSuportadas: ['en', 'pt', 'es', 'fr', 'de', 'ja', 'zh', 'ko'],
  },

  // Níveis de severidade com descrições detalhadas
  risco: {
    titulo: 'Avaliação de Risco',
    baixo: {
      level: 'BAIXO',
      label: 'Risco BAIXO',
      descricao: 'Workflow bem estruturado sem problemas críticos',
      cor: '#22c55e',
      icone: '',
      acao: 'Workflow bem estruturado - manter práticas atuais',
    },
    medio: {
      level: 'MÉDIO',
      label: 'Risco MÉDIO',
      descricao: 'Atenção necessária aos problemas encontrados - revisar recomendações',
      cor: '#f59e0b',
      icone: '️',
      acao: 'Revisar os problemas identificados e aplicar melhorias sugeridas',
    },
    alto: {
      level: 'ALTO',
      label: 'Risco ALTO',
      descricao: 'Ação imediata necessária - problemas críticos de segurança ou performance',
      cor: '#ef4444',
      icone: '',
      acao: 'Tomar ação imediata para abordar vulnerabilidades críticas de segurança e performance',
    },
    critico: {
      level: 'CRÍTICO',
      label: 'Risco CRÍTICO',
      descricao: 'Ação de emergência necessária - workflow pode estar comprometido ou infuncional',
      cor: '#7f1d1d',
      icone: '',
      acao: 'Intervenção imediata necessária - workflow pode estar vulnerável ou quebrado',
    },
  },

  // Recomendações de melhoria
  melhoria: {
    titulo: 'Recomendações de Melhoria',
    bom: {
      level: 'EXCELENTE',
      label: 'Excelente (>90)',
      descricao: 'Workflow bem estruturado com práticas recomendadas implementadas',
      acao: 'Manter práticas atuais e considerar compartilhamento como exemplo',
      icone: '',
    },
    espaco: {
      level: 'BOM',
      label: 'Bom (70-90)',
      descricao: 'Há espaço para melhoria - revisar os problemas encontrados',
      acao: 'Revisar recomendações e implementar melhorias gradualmente',
      icone: '',
    },
    refatorar: {
      level: 'PRECISA DE MELHORIA',
      label: 'Precisa de Melhoria (50-70)',
      descricao: 'Múltiplos problemas detectados - refatoração recomendada',
      acao: 'Considerar refatoração completa para abordar múltiplos problemas críticos',
      icone: '',
    },
    criticar: {
      level: 'RUIM',
      label: 'Ruim (<50)',
      descricao: 'Problemas críticos detectados - workflow requer atenção imediata',
      acao: 'Revisão e refatoração completas necessárias imediatamente',
      icone: '',
    },
  },

  // Explicações detalhadas dos problemas
  explicacoes: {
    titulo: 'Explicações dos Problemas',
    seguranca: {
      code: 'explicacaoSeguranca',
      label: 'Problema de Segurança',
      descricao: 'Vulnerabilidade de segurança detectada na configuração do workflow',
      severidade: 'alta',
      categorias: [
        'senhas-hardcodeadas',
        'vulnerabilidades-injecao',
        'permissoes-excessivas',
        'dependencias-inseguras',
      ],
    },
    performance: {
      code: 'explicacaoPerformance',
      label: 'Problema de Performance',
      descricao: 'Oportunidades de otimização de performance identificadas no workflow',
      severidade: 'média',
      categorias: [
        'jobs-lentos',
        'matriz-ineficiente',
        'cache-missing',
        'dependencias-excessivas',
      ],
    },
    boasPraticas: {
      code: 'explicacaoBoasPraticas',
      label: 'Violação de Boas Práticas',
      descricao: 'Workflow não segue práticas recomendadas estabelecidas do GitHub Actions',
      severidade: 'baixa',
      categorias: [
        'convencoes-nomeacao',
        'documentacao',
        'tratamento-erros',
        'modularidade',
      ],
    },
  },

  // Categorias de problemas com descrições detalhadas
  problemas: {
    titulo: 'Problemas Identificados',

    // Problemas relacionados à segurança
    actionDesatualizada: {
      code: 'actionDesatualizada',
      label: 'Action Desatualizada',
      descricao: 'Ação GitHub está usando uma versão desatualizada com vulnerabilidades conhecidas',
      severidade: 'alta',
      categoria: 'seguranca',
      recomendacao: 'Atualizar para a versão mais recente ou usar ações do repositório oficial',
    },
    envSensivel: {
      code: 'envSensivel',
      label: 'Secret Hardcodeado Detectado',
      descricao: 'Credenciais ou tokens sensíveis expostos nos arquivos de workflow',
      severidade: 'critico',
      categoria: 'seguranca',
      recomendacao: 'Usar GitHub Secrets e variáveis de ambiente em vez de valores hardcodeados',
    },
    scriptInjection: {
      code: 'scriptInjection',
      label: 'Risco de Injeção de Script',
      descricao: 'Vulnerabilidade potencial de injeção de código em scripts do workflow',
      severidade: 'critico',
      categoria: 'seguranca',
      recomendacao: 'Implementar validação de entrada e sanitizar todos os inputs de usuário',
    },
    containerSemUser: {
      code: 'containerSemUser',
      label: 'Container Rodando como Root',
      descricao: 'Container Docker configurado para rodar como usuário root',
      severidade: 'alta',
      categoria: 'seguranca',
      recomendacao: 'Criar usuário não-root e configurar container para rodar com esse usuário',
    },
    tokenExcessivo: {
      code: 'tokenExcessivo',
      label: 'Token com Permissões Excessivas',
      descricao: 'Token do GitHub tem mais permissões do que o necessário para o workflow',
      severidade: 'alta',
      categoria: 'seguranca',
      recomendacao: 'Aplicar princípio do menor privilégio - conceder permissões mínimas necessárias',
    },

    // Problemas relacionados a performance
    matrixSemFailFast: {
      code: 'matrixSemFailFast',
      label: 'Matrix Sem Fail-Fast',
      descricao: 'Estratégia de matrix não para na primeira falha, desperdiçando recursos',
      severidade: 'média',
      categoria: 'performance',
      recomendacao: 'Ativar fail-fast: true na configuração da matrix',
    },
    fetchDepth0: {
      code: 'fetchDepth0',
      label: 'Fetch-Depth 0 Desnecessário',
      descricao: 'Busca do histórico completo do git quando apenas commits recentes são necessários',
      severidade: 'baixa',
      categoria: 'performance',
      recomendacao: 'Configurar fetch-depth para um número razoável (ex: 2-5) para checkout mais rápido',
    },
    timeoutAusente: {
      code: 'timeoutAusente',
      label: 'Timeout Não Especificado',
      descricao: 'Job ou step carece de configuração de timeout, podendo travar workflow',
      severidade: 'média',
      categoria: 'performance',
      recomendacao: 'Configurar valores apropriados de timeout para todos os jobs e steps críticos',
    },
    buildSemParalelismo: {
      code: 'buildSemParalelismo',
      label: 'Jobs Podem Rodar em Paralelo',
      descricao: 'Jobs independentes estão configurados para rodar sequencialmente',
      severidade: 'baixa',
      categoria: 'performance',
      recomendacao: 'Configurar dependências de jobs para permitir execução paralela quando possível',
    },

    // Problemas de melhores práticas
    stepSemNome: {
      code: 'stepSemNome',
      label: 'Step Sem Nome Descritivo',
      descricao: 'Step do workflow carece de nomeação clara, reduzindo legibilidade e depuração',
      severidade: 'baixa',
      categoria: 'best-practices',
      recomendacao: 'Adicionar nomes descritivos a todos os steps do workflow',
    },
    jobSemNome: {
      code: 'jobSemNome',
      label: 'Job Sem Nome Descritivo',
      descricao: 'Job do workflow carece de convenção de nomenclatura clara',
      severidade: 'baixa',
      categoria: 'best-practices',
      recomendacao: 'Usar convenção de nomenclatura consistente para todos os jobs',
    },
    usoSudo: {
      code: 'usoSudo',
      label: 'Uso de sudo Detectado',
      descricao: 'Workflow usa sudo, o que pode indicar problemas de permissão',
      severidade: 'média',
      categoria: 'best-practices',
      recomendacao: 'Configurar permissões apropriadas em vez de usar sudo nos workflows',
    },
  },

  // Botões de ação e elementos de UI
  acoes: {
    titulo: 'Botões de Ação',
    analisar: 'Analisar com IA',
    analisar_detalhado: 'Análise Detalhada',
    explicacao: 'Ver Explicação',
    ver_documentacao: 'Ver Documentação',
    corrigir: 'Aplicar Correção',
    corrigir_todos: 'Aplicar Todas as Correções',
    ignorar: 'Ignorar',
    ignorar_todos: 'Ignorar Todos',
    exportar: 'Exportar Relatório',
    compartilhar: 'Compartilhar Análise',
    copiar: 'Copiar Correção',
    testar: 'Testar Correção',
    reavaliar: 'Reavaliar',
    salvar: 'Salvar',
    cancelar: 'Cancelar',
  },

  // Sistema de pontuação
  scores: {
    titulo: 'Pontuação de Análise',
    excelente: {
      level: 'EXCELENTE',
      label: 'Excelente (>90)',
      min: 90,
      max: 100,
      descricao: 'Workflow segue todas as melhores práticas sem problemas críticos',
      nota: 'A+',
      cor: '#22c55e',
    },
    bom: {
      level: 'BOM',
      label: 'Bom (70-90)',
      min: 70,
      max: 89,
      descricao: 'Workflow tem problemas menores mas é fundamentalmente sólido',
      nota: 'A',
      cor: '#3b82f6',
    },
    regular: {
      level: 'REGULAR',
      label: 'Regular (50-70)',
      min: 50,
      max: 69,
      descricao: 'Workflow tem vários problemas que precisam de atenção',
      nota: 'B',
      cor: '#f59e0b',
    },
    ruim: {
      level: 'RUIM',
      label: 'Ruim (<50)',
      min: 0,
      max: 49,
      descricao: 'Workflow tem problemas críticos requerendo atenção imediata',
      nota: 'F',
      cor: '#ef4444',
    },
  },

  // Mensagens auxiliares
  mensagens: {
    avaliacaoConcluida: 'Avaliação concluída com sucesso',
    analiseIniciada: 'Análise iniciada...',
    analiseConcluida: 'Análise concluída',
    exportacaoConcluida: 'Relatório exportado com sucesso',
    semProblemas: 'Nenhum problema crítico encontrado',
    workflowSaudavel: 'Workflow saudável - continue as boas práticas',
    revisaoNecessaria: 'Revisão necessária - siga as recomendações',
  },

  // Ferramentas e utilitários
  utils: {
    getCorRisco: (level: string) => {
      const cores: Record<string, string> = {
        low: '#22c55e',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#7f1d1d',
      };
      return cores[level] || '#6b7280';
    },
    getIconeRisco: (level: string) => {
      const icones: Record<string, string> = {
        low: '',
        medium: '️',
        high: '',
        critical: '',
      };
      return icones[level] || '';
    },
    formatarPontuacao: (score: number) => {
      if (score >= 90) return `Excelente (${score}/100)`;
      if (score >= 70) return `Bom (${score}/100)`;
      if (score >= 50) return `Regular (${score}/100)`;
      return `Ruim (${score}/100)`;
    },
    obterCategoria: (code: string) => {
      const categorias: Record<string, string> = {
        security: 'segurança',
        performance: 'performance',
        'best-practices': 'melhores-praticas',
      };
      return categorias[code] || 'desconhecido';
    },
  },

} as const;

// Tipos exportados para TypeScript
export type RiscoLevel = 'low' | 'medium' | 'high' | 'critical';
export type CategoriaProblema = 'security' | 'performance' | 'best-practices';
export type CodigoLinguagem = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko';

export interface ISugestaoIA {
  code: string;
  problemCode: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: CategoriaProblema;
  description: string;
  recommendation: string;
  icon?: string;
}

export interface IRelatorioIA {
  score: number;
  riskLevel: RiscoLevel;
  issues: string[];
  suggestions: ISugestaoIA[];
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
