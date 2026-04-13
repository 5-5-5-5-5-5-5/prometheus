---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
---


# Guia de Início Rápido

Este guia cobre o menor caminho para instalar, executar e validar o Prometheus no estado atual do projeto.

## Requisitos

- `Node.js >= 24.12.0`
- `npm`
- um repositório com arquivos fonte para análise

## Instalação

### Desenvolvimento local

```bash
git clone https://github.com/5-5-5-5-5-5-5/prometheus.git
cd prometheus
npm install
npm run build
```

### Expor o binário localmente

```bash
npm link
prometheus --help
```

### Uso sem link global

```bash
node dist/bin/index.js --help
```

## Primeira execução

### Diagnóstico básico

```bash
prometheus diagnosticar
```

### Diagnóstico detalhado

```bash
prometheus diagnosticar --full
```

### Saída JSON para automação

```bash
prometheus diagnosticar --json --export
```

## Filtros de análise

```bash
prometheus diagnosticar --include "src/**"
prometheus diagnosticar --exclude "**/*.test.ts"
prometheus diagnosticar --include "src/**" --exclude "**/*.spec.ts"
prometheus diagnosticar --exclude-tests
```

## Integridade com Guardian

### Criar ou aceitar baseline

```bash
prometheus guardian --accept-baseline
```

### Verificar diferenças

```bash
prometheus guardian --diff
```

### Verificação estruturada para CI

```bash
prometheus guardian --diff --json
```

## Correções e manutenção

### Quick fixes no diagnóstico

```bash
prometheus diagnosticar --show-fixes
prometheus diagnosticar --fix-safe
```

### Correção específica de tipos inseguros

```bash
prometheus fix-types --dry-run
prometheus fix-types --target src --confidence 90
```

### Reestruturação em modo seguro

```bash
prometheus reestruturar --somente-plano --preset prometheus
```

## Formatação e SVG

```bash
prometheus formatar --check
prometheus formatar --write
prometheus otimizar-svg --dry
prometheus otimizar-svg --write
```

## Arquivos gerados

O projeto usa por padrão:

- `relatorios/` para exportações de diagnóstico e `fix-types`
- `prometheus.config.json` para configuração versionada
- baseline do Guardian conforme o fluxo do comando `guardian`

## Próximos passos

- Consulte o [Guia de Comandos](./GUIA-COMANDOS.md) para todos os subcomandos.
- Consulte o [Guia de Configuração](./GUIA-CONFIGURACAO.md) para ajustar regras, filtros e suporte de linguagem.


