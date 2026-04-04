// SPDX-License-Identifier: MIT

/**
 * Limites e thresholds padrão para análise de código e detectores.
 * Centraliza "números mágicos" para facilitar a configuração e overrides.
 */

export const LIMITES_PADRAO = {
  // Limites de código para detector-codigo-fragil e analista-funcoes-longas
  CODIGO: {
    MAX_LINHAS_FUNCAO: 30,
    MAX_PARAMETROS_FUNCAO: 4,
    MAX_PARAMETROS_CRITICO: 6,
    MAX_NESTED_CALLBACKS: 2,
    MAX_COMPLEXIDADE_COGNITIVA: 15,
    MAX_REGEX_LENGTH: 50,
    MAX_ANINHAMENTO_IF: 3,
    MAX_LINHAS_ARQUIVO: 300
  },

  // Limites para detecção de arquivos fantasmas (ghost files)
  GUARDIAN: {
    DIAS_INATIVIDADE_GHOST: 45
  },

  // Thresholds de segurança e entropia
  SEGURANCA: {
    ENTROPIA_SHANNON_ALTA: 3.5
  },

  // Configurações de auto-fix
  AUTO_FIX: {
    CONFIANCA_MINIMA: 75,
    TIMEOUT_PADRAO_MS: 60000,
    TIMEOUT_TESTE_MS: 1000
  },

  // Timeouts globais
  TIMEOUTS: {
    ANALISTA_PADRAO_MS: 30000,
    ARQUETIPO_DETECCAO_MS: 30000
  }
} as const;
