// SPDX-License-Identifier: MIT
/**
 * Tipos centralizados para relatórios
 * Todos os tipos relacionados a geração de relatórios (MD/JSON)
 */

// PrioridadeNivel é definido em filtro-config, mas vamos duplicar aqui para evitar dependência circular
import type { PrioridadeNivel } from '../core/messages.js';
import type { Ocorrencia } from '../index.js';

  /* -------------------------- ANÁLISE ASYNC PATTERNS -------------------------- */

export type { AsyncAnalysisOptions, AsyncAnalysisReport, AsyncArquivoRanqueado, AsyncCategoria, AsyncCategoriaStats, AsyncCriticidade, AsyncIssuesArquivo } from './async-analysis.js';

  /* -------------------------- CONSELHEIRO PROMETHEUS -------------------------- */

export type { ConselhoContextoPrometheus } from './conselheiro.js';

  /* -------------------------- ESTRUTURA -------------------------- */

export type { AlinhamentoItemDiagnostico } from './estrutura.js';

  /* -------------------------- FRAGMENTAÇÃO (movido de shared/) -------------------------- */

export type { FileEntryFragmentacao, FragmentOptions, Manifest, ManifestPart as ManifestPartFragmentacao, RelatorioCompleto as RelatorioCompletoFragmentacao } from './fragmentacao.js';

  /* -------------------------- LEITOR (movido de shared/) -------------------------- */

export type { LeitorRelatorioOptions } from './leitor.js';

  /* -------------------------- PROCESSAMENTO -------------------------- */

export * from './processamento.js';

  /* -------------------------- FILTRO INTELIGENTE -------------------------- */

/**
 * Problema agrupado com priorização inteligente
 */
export interface ProblemaAgrupado {
  categoria: string;
  prioridade: PrioridadeNivel;
  icone: string;
  titulo: string;
  quantidade: number;
  ocorrencias: Ocorrencia[];
  resumo: string;
  acaoSugerida?: string;
}

/**
 * Estatísticas do relatório resumido
 */
export interface EstatisticasResumo {
  totalOcorrencias: number;
  arquivosAfetados: number;
  problemasPrioritarios: number;
  problemasAgrupados: number;
}

/**
 * Relatório resumido com problemas agrupados e priorizados
 */
export interface RelatorioResumo {
  problemasCriticos: ProblemaAgrupado[];
  problemasAltos: ProblemaAgrupado[];
  problemasOutros: ProblemaAgrupado[];
  estatisticas: EstatisticasResumo;
}

/**
 * Resumo executivo para tomada de decisão rápida
 */
export interface ResumoExecutivo {
  problemasCriticos: number;
  problemasAltos: number;
  vulnerabilidades: number;
  quickFixes: number;
  recomendacao: 'verde' | 'amarelo' | 'vermelho';
  mensagem: string;
  detalhes: ProblemaAgrupado[];
}

  /* -------------------------- SVG OTIMIZAÇÃO -------------------------- */

/**
 * Parâmetros para exportação de relatório SVG
 */
export interface SvgExportParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entries: any[];
  relatoriosDir: string;
  ts: string;
}

/**
 * Resultado de otimização SVG
 */
export interface SvgOtimizacaoResult {
  changed: boolean;
  originalBytes: number;
  optimizedBytes: number;
  mudancas: string[];
  parser: string;
  ok: boolean;
}

  /* -------------------------- GERADOR DE RELATÓRIO -------------------------- */

/**
 * Opções para geração de relatório Markdown
 */
export interface GeradorMarkdownOptions {
  manifestFile?: string;
  relatoriosDir?: string;
  ts?: string;
  hadFull?: boolean;
}

/**
 * Metadados do relatório
 */
export interface MetadadosRelatorio {
  dataISO: string;
  duracao: number;
  totalArquivos: number;
  totalOcorrencias: number;
}

/**
 * Informações do Guardian para relatório
 */
export interface GuardianInfo {
  status: string;
  timestamp: string;
  totalArquivos: string;
}

  /* -------------------------- REESTRUTURAÇÃO -------------------------- */

/**
 * Movimento estrutural de arquivo/diretório
 */
export interface MovimentoEstrutural {
  de: string;
  para: string;
}

/**
 * Opções para relatório de reestruturação
 */
export interface OpcoesRelatorioReestruturar {
  simulado?: boolean;
  origem?: string;
  preset?: string;
  conflitos?: number;
}

  /* -------------------------- PODA -------------------------- */

/**
 * Opções para relatório de poda
 */
export interface OpcoesRelatorioPoda {
  simulado?: boolean;
}

  /* -------------------------- ALINHAMENTO -------------------------- */

/**
 * Item de alinhamento estrutural
 */
export interface AlinhamentoItem {
  tipo: 'pasta' | 'arquivo';
  origem: string;
  destino: string;
  status: 'sugerido' | 'aplicado' | 'ignorado';
  razao?: string;
}

  /* -------------------------- CONSELHEIRO PROMETHEUS -------------------------- */

/**
 * Contexto para emissão de conselhos prometheus
 */
export interface ConselhoContexto {
  totalArquivos: number;
  totalOcorrencias: number;
  problemasCriticos: number;
  arquetipo?: string;
  linguagensPrincipais: string[];
}

/**
 * Conselho do sistema prometheusal
 */
export interface Conselho {
  categoria: 'seguranca' | 'qualidade' | 'performance' | 'manutencao' | 'arquitetura';
  prioridade: PrioridadeNivel;
  titulo: string;
  descricao: string;
  acoes: string[];
  recursos?: string[];
}

/**
 * Estrutura de relatório completo para fragmentação
 */
export interface RelatorioCompleto {
  resultado?: {
    ocorrencias?: Ocorrencia[];
    fileEntries?: Array<{
      relPath?: string;
      fullCaminho?: string;
      path?: string;
      content?: string;
      [k: string]: unknown;
    }>;
    [k: string]: unknown;
  };
  ocorrencias?: Ocorrencia[];
  fileEntries?: Array<{
    relPath?: string;
    fullCaminho?: string;
    path?: string;
    content?: string;
    [k: string]: unknown;
  }>;
  [k: string]: unknown;
}

/**
 * Parte do manifesto de relatório fragmentado
 */
export interface ManifestPart {
  file: string;
  items: number;
  sizeBytes: number;
  compressed?: boolean;
  [k: string]: unknown;
}
