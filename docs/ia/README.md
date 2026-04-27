---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
---

# IA-Powered Analysis - Prometheus v0.7.0

## Visão Geral

O Prometheus agora suporta análise de código assistida por IA através de integração com modelos LLM (Large Language Models).

## Funcionalidades

1. **Sugestões Inteligentes** - IA analisa o código e sugere melhorias
2. **Detecção de Padrões Avançados** - Identifica anti-padrões e problemas arquiteturais
3. **Refatoração Automática** - Sugestões de refatoração com código
4. **Análise de Segurança** - Detecção de vulnerabilidades assistida por IA

## Provedores Suportados

### Provedores Open-Source e Gratuitos

| Provedor           | Modelos                                                   | Preço                    | Como obter chave                         |
| ------------------ | --------------------------------------------------------- | ------------------------ | ---------------------------------------- |
| **Kyma API**       | Qwen3.6, MiniMax M2.5/M2.7, DeepSeek, Llama 4, Gemma 4    | $0.50 crédito grátis     | [kymaapi.com](https://kymaapi.com)       |
| **OpenRouter**     | Qwen3, DeepSeek-R1, Llama 3.3, MiniMax M2.5, 200+ modelos | Free tier disponível     | [openrouter.ai](https://openrouter.ai)   |
| **ModelsLab**      | MiniMax M2.5 (grátis)                                     | Free tier                | [modelslab.com](https://modelslab.com)   |
| **Hugging Face**   | Qwen3, DeepSeek, Mistral, Llama (open-source)             | Inference API free tier  | [huggingface.co](https://huggingface.co) |
| **Qwen (Alibaba)** | Qwen3-8B, Qwen3-32B, Qwen3-Coder                          | Free API via DashScope   | [aliyun.com](https://www.aliyun.com)     |
| **MiniMax**        | MiniMax M2.5, M2.7, Text-01                               | Free tier no app/website | [minimaxi.com](https://www.minimaxi.com) |

### Provedores Comerciais

| Provedor      | Modelos                 | Preço                             |
| ------------- | ----------------------- | --------------------------------- |
| **OpenAI**    | GPT-4, GPT-3.5          | Pago (mas tem free tier limitado) |
| **Anthropic** | Claude 3.5 Sonnet, Opus | Pago                              |
| **Google**    | Gemini 1.5 Pro, Flash   | Free tier generoso                |

### Local (Grátis, Privado)

| Provedor   | Modelos                                   | Requer           |
| ---------- | ----------------------------------------- | ---------------- |
| **Ollama** | Llama 3, Mistral, Qwen, DeepSeek (locais) | Instalação local |

## Configuração

### Exemplo 1: Kyma API (Recomendado - Múltiplos Modelos)

```json
{
  "ia": {
    "enabled": true,
    "provider": "kyma",
    "model": "qwen/qwen3.6-plus:free",
    "apiKeyEnv": "KYMA_API_KEY",
    "features": {
      "sugestoes": true,
      "padroesAvancados": true,
      "refatoracao": true,
      "segurancaIA": true
    }
  }
}
```

### Exemplo 2: OpenRouter (Qwen3 - Excelente para código)

```json
{
  "ia": {
    "enabled": true,
    "provider": "openrouter",
    "model": "qwen/qwen3-32b:free",
    "apiKeyEnv": "OPENROUTER_API_KEY"
  }
}
```

### Exemplo 3: MiniMax M2.5 (Rápido e eficiente)

```json
{
  "ia": {
    "enabled": true,
    "provider": "minimax",
    "model": "MiniMax-M2.5",
    "apiKeyEnv": "MINIMAX_API_KEY"
  }
}
```

### Exemplo 4: Qwen3 Local via Ollama (100% Grátis)

```json
{
  "ia": {
    "enabled": true,
    "provider": "local",
    "model": "qwen3:8b",
    "baseURL": "http://localhost:11434/v1/chat/completions"
  }
}
```

## Variáveis de Ambiente

Defina a chave da API correspondente:

```bash
# Kyma API (recomendado)
export KYMA_API_KEY="sua-chave-aqui"

# OpenRouter
export OPENROUTER_API_KEY="sua-chave-aqui"

# ModelsLab (MiniMax M2.5 grátis)
export MODELSLAB_API_KEY="sua-chave-aqui"

# Hugging Face
export HUGGINGFACE_API_KEY="sua-chave-aqui"

# Qwen (Alibaba Cloud)
export QWEN_API_KEY="sua-chave-aqui"

# MiniMax
export MINIMAX_API_KEY="sua-chave-aqui"
```

## Modelos Recomendados (Free Tier)

Para análise de código, estes são os melhores modelos gratuitos:

1. **Qwen3-32B** (OpenRouter) - Excelente para código, grande contexto (131K)
2. **MiniMax M2.5** (ModelsLab/Kyma) - Rápido, bom para sugestões
3. **Qwen3.6-Plus** (Kyma) - Contexto enorme (1M tokens)
4. **Llama 3.3-70B** (OpenRouter) - Balanceado
5. **DeepSeek-R1** (Kyma/OpenRouter) - Especializado em raciocínio

## Uso

Execute o Prometheus normalmente - os analistas de IA serão carregados automaticamente se habilitados:

```bash
npm start diagnosticar
```

## Exemplo de Saída

```
[IA Sugestões] Analisando src/index.ts...
  - Sugestão: Extrair função complexa para melhorar legibilidade
  - Confiança: 0.85

[IA Padrões] Detectado: God Class em src/App.tsx
  - Severidade: alta
  - Recomendação: Dividir classe em módulos menores

[IA Segurança] Vulnerabilidade: SQL Injection em src/db.ts
  - CWE-89: Use prepared statements
```

## Desenvolvimento

Para adicionar novos provedores de IA:

1. Adicione o provedor em `src/types/ia/llm-options.ts`
2. Implemente o método `call[Nome]()` em `src/shared/ia/llm-client.ts`
3. Atualize o switch case no método `chat()`
4. Documente o novo provedor em `docs/ia/README.md`
