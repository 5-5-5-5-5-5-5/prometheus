import type { LLMOptions } from '../ia/llm-options.js';

export interface IAPadroesAvancadosOptions {
  llm: LLMOptions;
}

export interface IARefatoracaoOptions {
  llm: LLMOptions;
}

export interface IASegurancaOptions {
  llm: LLMOptions;
}

export interface IASugestoesOptions {
  llm: LLMOptions;
}

export interface IAFactorOptions {
  llm: LLMOptions;
  features?: {
    sugestoes?: boolean;
    padroesAvancados?: boolean;
    refatoracao?: boolean;
    segurancaIA?: boolean;
  };
}