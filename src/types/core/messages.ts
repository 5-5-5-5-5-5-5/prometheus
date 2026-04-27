// SPDX-License-Identifier: MIT
/**
 * Tipos para sistema de mensagens, logs e relatórios
 */

export type PrioridadeNivel = 'critica' | 'alta' | 'media' | 'baixa';
export type Nivel = 'info' | 'sucesso' | 'erro' | 'aviso' | 'debug';
export type LogLevel = Nivel;

export interface FormatOptions {
  nivel: Nivel;
  mensagem: string;
  sanitize?: boolean;
}

/**
 * Interface para blocos de log (dados)
 */
export interface LogBlockData {
  titulo: string;
  linhas: string[];
  nivel?: Nivel;
}

/**
 * Interface para o logger com extensões de bloco
 */
export interface LogComBloco {
  info: (msg: string) => void;
  sucesso: (msg: string) => void;
  erro: (msg: string) => void;
  aviso: (msg: string) => void;
  debug: (msg: string) => void;
  imprimirBloco: (titulo: string, linhas: string[], estilo?: unknown, largura?: number) => void;
  calcularLargura: (titulo: string, linhas: string[], larguraMax?: number) => number;
}

/**
 * Contexto de log adaptativo
 */
export type LogContext = 'simples' | 'medio' | 'complexo' | 'ci';
export type LogTemplate = string;
export type LogData = Record<string, unknown>;

/**
 * Métricas do projeto para adaptação de log
 */
export interface ProjetoMetricas {
  totalArquivos: number;
  linguagens: string[];
  estruturaComplexidade: 'simples' | 'media' | 'complexa';
  temCI: boolean;
  temTestes: boolean;
  temDependencias: boolean;
}

/**
 * Configuração de prioridade de problemas
 */
export interface ConfigPrioridade {
  prioridade: PrioridadeNivel;
  icone: string;
  descricao?: string;
}

/**
 * Configuração de agrupamento inteligente por padrão de mensagem
 */
export interface AgrupamentoConfig {
  padrao: RegExp;
  categoria: string;
  titulo: string;
  prioridade?: PrioridadeNivel;
  icone?: string;
  acaoSugerida?: string;
}

/**
 * Metadados estendidos para relatório
 */
export interface MetadadosRelatorioEstendido {
  dataISO: string;
  duracao: number;
  totalArquivos: number;
  totalOcorrencias: number;
  manifestFile?: string;
  relatoriosDir?: string;
}

/**
 * Configuração de filtros (sistema de supressão para OCORRÊNCIAS)
 */
export interface FiltrosConfig {
  suppressRules?: string[];
  suppressByQuickFixId?: string[];
  suppressBySeverity?: Record<string, boolean>;
  suppressByPath?: string[];
  suppressByFilePattern?: string[];
}

/**
 * JSON com metadados versionados
 */
export interface JsonComMetadados<T> {
  _metadata: {
    schema: string;
    versao: string;
    geradoEm: string;
    descricao?: string;
  };
  dados: T;
}

/**
 * Tipo para valores de mensagens (string ou objeto com label/descricao)
 */
export interface CampoMensagem {
  label: string;
  descricao: string;
}

export interface SecaoMensagemComCampos {
  label: string;
  descricao: string;
  campos: Record<string, string>;
}

export type ValorMensagem = string | CampoMensagem | SecaoMensagemComCampos;
