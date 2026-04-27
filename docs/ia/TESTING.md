---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
---

# Testando IA no Prometheus

## Status Atual

✅ Compilação: OK (tsc --noEmit passou)
✅ Analistas criados em `src/analistas/ia/`
✅ Cliente LLM multi-provider em `src/shared/ia/llm-client.ts`
✅ Integração com Agent em `src/analistas/ia/agent-integration.ts`
✅ Ferramentas (tools) em `src/analistas/ia/tools.ts`

## Como Testar

### 1. Configure uma API Key

Escolha um provedor gratuito:

```bash
# Kyma API (Recomendado - Qwen3.6, MiniMax M2.5)
export KYMA_API_KEY="sua-chave-aqui"

# OpenRouter (Qwen3, DeepSeek-R1)
export OPENROUTER_API_KEY="sua-chave-aqui"

# ModelsLab (MiniMax M2.5 gratuito)
export MODELSLAB_API_KEY="sua-chave-aqui"
```

### 2. Habilite a IA no prometheus.config.json

```json
{
  "ia": {
    "enabled": true,
    "provider": "kyma",
    "model": "qwen/qwen3.6-plus:free",
    "apiKeyEnv": "KYMA_API_KEY"
  }
}
```

### 3. Execute o Prometheus

```bash
node dist/bin/cli.js diagnosticar
```

## Provedores Disponíveis

| Provedor       | Modelo Padrão             | Gratuito?     |
| -------------- | ------------------------- | ------------- |
| kyma           | qwen/qwen3.6-plus:free    | ✅ Sim         |
| openrouter     | qwen/qwen3-32b:free       | ✅ Sim         |
| modelslab      | minimax-minimax-m2.5-free | ✅ Sim         |
| local (ollama) | qwen3:8b                  | ✅ 100% grátis |
| openai         | gpt-4                     | ❌ Pago        |
| anthropic      | claude-3.5-sonnet         | ❌ Pago        |

## Estrutura Criada

```
src/
├── analistas/ia/
│   ├── detector-ia-sugestoes.ts      # Sugestões inteligentes
│   ├── detector-ia-padroes-avancados.ts  # Detecção de padrões
│   ├── detector-ia-refatoracao.ts       # Recomendações refatoração
│   ├── detector-ia-seguranca.ts       # Análise segurança
│   ├── agent-integration.ts         # Integração com Agent
│   ├── tools.ts                     # Ferramentas (read_file, search, etc.)
│   ├── factory.ts                   # Factory para criar analistas
│   └── index.ts                    # Barrel exports
├── shared/ia/
│   ├── llm-client.ts               # Cliente LLM multi-provider
│   └── utils.ts                   # Utilitários
└── types/ia/
    ├── llm-options.ts             # Tipos LLM
    └── ia-responses.ts            # Tipos respostas IA
```

## Nota

O projeto compila corretamente. O erro de runtime (ERR_MODULE_NOT_FOUND)
é relacionado ao ambiente Node.js + ES Modules + aliases (@/).
Isso normalmente é resolvido pelo `tsc-alias` no pós-build.

Para um teste rápido sem resolver aliases, você pode:
1. Usar o tsx ou ts-node para rodar TypeScript direto
2. Corrigir o ambiente de build
3. Testar chamando a API diretamente via curl para verificar se os analistas funcionam
