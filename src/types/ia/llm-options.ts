export type LLMProvider =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'local'
  | 'kyma'
  | 'modelslab'
  | 'openrouter'
  | 'huggingface'
  | 'minimax'
  | 'qwen'
  | 'ollama-cloud'
  | 'ollama-local';

export interface LLMOptions {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  apiKeyEnv?: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
  model: string;
}

export interface IAConfigFeatures {
  sugestoes: boolean;
  padroesAvancados: boolean;
  refatoracao: boolean;
  segurancaIA: boolean;
}

export interface IAConfigCache {
  enabled: boolean;
  ttl: number;
}

export interface IAConfig {
  enabled: boolean;
  provider: LLMProvider;
  model: string;
  apiKeyEnv?: string;
  baseURL?: string;
  features: IAConfigFeatures;
  cache: IAConfigCache;
}

export interface FetchResponseType {
  ok: boolean;
  statusText: string;
  json: () => Promise<unknown>;
}
