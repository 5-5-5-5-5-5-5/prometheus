export interface IASuggestion {
  arquivo: string;
  linha?: number;
  sugestao: string;
  explicacao: string;
  codigoSugerido?: string;
  confianca: number;
}

export interface IAPattern {
  nome: string;
  descricao: string;
  arquivos: string[];
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  recomendacao: string;
}

export interface IARefactoring {
  arquivo: string;
  descricao: string;
  codigoOriginal: string;
  codigoRefatorado: string;
  beneficios: string[];
  risco: 'baixo' | 'medio' | 'alto';
}

export interface IASecurityAnalysis {
  vulnerabilidade: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  arquivo: string;
  linha?: number;
  descricao: string;
  impacto: string;
  remediacao: string;
  cwe?: string;
}
