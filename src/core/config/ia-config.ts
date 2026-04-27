import type { IAConfig as IAConfigType,LLMProvider  } from '../../types/ia/llm-options.js';

export type { LLMProvider };
export type { IAConfigType as IAConfig };

export const defaultIAConfig: IAConfigType = {
  enabled: false,
  provider: 'kyma',
  model: 'qwen/qwen3.6-plus:free',
  apiKeyEnv: 'KYMA_API_KEY',
  features: {
    sugestoes: true,
    padroesAvancados: true,
    refatoracao: true,
    segurancaIA: true,
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
};
