# 📚 Guia Completo de Comandos do Sensei

> Proveniência e Autoria: Este documento integra o projeto Sensei (licença MIT).
> Última atualização: 15 de janeiro de 2026

## 🎯 Visão Geral

O Sensei oferece diversos comandos para análise, diagnóstico e manutenção de projetos. Este guia detalha cada comando, suas opções e casos de uso.

**Requisitos:** Node.js >=25.0.0

## 📋 Índice de Comandos

1. [diagnosticar](#diagnosticar) - Análise completa do projeto
2. [guardian](#guardian) - Verificação de integridade
3. [podar](#podar) - Remoção de arquivos órfãos
4. [reestruturar](#reestruturar) - Reorganização de estrutura
5. [formatar](#formatar) - Formatação de código
6. [fix-types](#fix-types) - Correção de tipos inseguros
7. [metricas](#metricas) - Visualização de métricas
8. [perf](#perf) - Análise de performance
9. [analistas](#analistas) - Catálogo de analistas
10. [otimizar-svg](#otimizar-svg) - Otimização de SVGs
11. [atualizar](#atualizar) - Atualização segura
12. [reverter](#reverter) - Reversão de mudanças

---

## diagnosticar

Comando principal para análise completa do projeto.

### Uso Básico

```bash
sensei diagnosticar
```

Durante a execução, o Sensei exibe um indicador visual “🔎 Diagnóstico em execução...” para sinalizar processamento.

### Opções Principais

#### Modos de Execução

```bash
# Modo detalhado (mais informações)
sensei diagnosticar --full

# Modo compacto (padrão): consolida progresso e mostra o essencial
sensei diagnosticar --compact

# Modo executivo: apenas problemas críticos/alta prioridade
sensei diagnosticar --executive

# Apenas varredura (não prepara AST, sem análise completa)
sensei diagnosticar --scan-only
```

#### Formatos de Saída

```bash
# Saída JSON para ferramentas/automação
sensei diagnosticar --json

# Exportar resumo/manifest
sensei diagnosticar --export

# Exportar dump completo (fragmentado em shards)
sensei diagnosticar --export-full

# JSON ASCII (compat legada)
sensei diagnosticar --json-ascii
```

#### Filtros

```bash
# Incluir padrões
sensei diagnosticar --include "src/**" --include "scripts/**"

# Excluir padrões
sensei diagnosticar --exclude "**/*.test.*" --exclude "**/__tests__/**"

# Excluir testes rapidamente
sensei diagnosticar --exclude-tests
```

#### Auto-Fix

```bash
# Ativar auto-fix
sensei diagnosticar --auto-fix

# Modo conservador / agressivo / equilibrado
sensei diagnosticar --auto-fix-mode conservative
sensei diagnosticar --auto-fix-mode aggressive
sensei diagnosticar --auto-fix-mode balanced

# Atalhos
sensei diagnosticar --fix            # alias de --auto-fix
sensei diagnosticar --fix-safe       # alias de --auto-fix --auto-fix-mode conservative

# Dry-run (preview sem modificar)
SENSEI_ALLOW_MUTATE_FS=1 sensei diagnosticar --auto-fix --dry-run
```

#### Timeout e Performance

```bash
# Modo rápido (menos checks)
sensei diagnosticar --fast

# Confiar no compilador (reduz falsos positivos comuns)
sensei diagnosticar --trust-compiler

# Verificar ciclos com heurística extra
sensei diagnosticar --verify-cycles

# Ajustes de timeout via ambiente (por analista)
SENSEI_ANALISE_TIMEOUT_POR_ANALISTA_MS=60000 sensei diagnosticar
```

### Exemplos de Uso

```bash
# Padrão compacto com resumo útil
sensei diagnosticar --compact

# Detalhado (inclui amostra maior e blocos completos)
sensei diagnosticar --full

# Para CI/CD estruturado
sensei diagnosticar --json --export

# Correção automática segura
SENSEI_ALLOW_MUTATE_FS=1 sensei diagnosticar --fix-safe --dry-run
```

---

## guardian

Verificação de integridade dos arquivos via hashes.

### Uso Básico

```bash
# Criar baseline inicial
sensei guardian

# Verificar alterações
sensei guardian --diff
```

### Opções

```bash
# Saída JSON
sensei guardian --json

# Modo verbose
sensei guardian --verbose

# Aceitar alterações como novo baseline
sensei guardian --accept

# Forçar recriação do baseline
sensei guardian --force
```

### Status de Retorno

- `ok` - Nenhuma alteração detectada
- `baseline-criado` - Baseline criado pela primeira vez
- `baseline-aceito` - Alterações aceitas como novo baseline
- `alteracoes-detectadas` - Arquivos modificados detectados
- `erro` - Erro durante verificação

### Exemplos

```bash
# Verificação rápida no CI
sensei guardian --diff --json

# Criar baseline após mudanças válidas
sensei guardian --accept

# Debug detalhado
sensei guardian --diff --verbose
```

---

## podar

Remoção segura de arquivos órfãos (não referenciados).

### Uso Básico

```bash
# Dry-run (preview sem remover)
sensei podar --dry-run

# Remoção efetiva
sensei podar
```

### Opções

```bash
# Modo interativo (confirma cada arquivo)
sensei podar --interactive

# Saída JSON
sensei podar --json

# Verbose (mostrar análise detalhada)
sensei podar --verbose
```

### Exemplos

```bash
# Análise de arquivos órfãos
sensei podar --dry-run --verbose

# Limpeza automática
sensei podar --json

# Limpeza com confirmação
sensei podar --interactive
```

---

## metricas

Visualização de métricas e histórico agregado.

### Uso Básico

```bash
# Exibir métricas atuais
sensei metricas

# Formato JSON
sensei metricas --json
```

### Opções

```bash
# Exibir histórico
sensei metricas --history

# Comparar com período anterior
sensei metricas --compare

# Exportar para arquivo
sensei metricas --export metricas.json
```

### Exemplos

```bash
# Dashboard de métricas
sensei metricas --verbose

# Análise de tendências
sensei metricas --history --json

# Comparação temporal
sensei metricas --compare --full
```

---

## perf

Análise de performance e comparação de snapshots.

### Uso Básico

```bash
# Criar snapshot de performance
sensei perf snapshot

# Comparar snapshots
sensei perf compare
```

### Opções

```bash
# Comparar com baseline
sensei perf compare --baseline

# Saída JSON
sensei perf --json

# Limites personalizados
sensei perf compare --threshold 10
```

### Exemplos

```bash
# Benchmark antes de mudanças
sensei perf snapshot --name "antes-refactor"

# Benchmark depois e comparar
sensei perf snapshot --name "depois-refactor"
sensei perf compare antes-refactor depois-refactor

# Análise de regressão no CI
sensei perf compare --baseline --json
```

---

## analistas

Listar e documentar analistas disponíveis.

### Uso Básico

```bash
# Listar todos os analistas
sensei analistas

# Formato JSON
sensei analistas --json
```

### Opções

```bash
# Gerar documentação
sensei analistas --doc docs/ANALISTAS.md

# Mostrar apenas ativos
sensei analistas --active-only

# Incluir metadados
sensei analistas --full
```

### Exemplos

```bash
# Catálogo completo
sensei analistas --full --json

# Documentação automática
sensei analistas --doc docs/ANALISTAS-GERADO.md

# Debug de analistas
sensei diagnosticar --listar-analistas
```

---

## fix-types

Correção interativa de tipos inseguros (any/unknown).

### Uso Básico

```bash
# Modo interativo
sensei fix-types --interactive

# Auto-fix conservador
sensei fix-types --auto-fix --auto-fix-mode conservative
```

### Opções

```bash
# Mostrar diff antes de aplicar
sensei fix-types --show-diff

# Dry-run
sensei fix-types --dry-run

# Validar sintaxe após correção
sensei fix-types --validate-only

# Focar em tipo específico
sensei fix-types --tipo any
sensei fix-types --tipo unknown
```

### Exemplos

```bash
# Correção segura e interativa
sensei fix-types --interactive --show-diff

# Correção automática de 'any'
sensei fix-types --tipo any --auto-fix --dry-run

# Validação pós-correção
sensei fix-types --validate-only
```

---

## reestruturar

Reorganização de estrutura do projeto com plano de moves.

### Uso Básico

```bash
# Ver plano sem aplicar
sensei reestruturar --somente-plano

# Aplicar reestruturação
sensei reestruturar --auto
```

### Opções

```bash
# Organização por domains
sensei reestruturar --domains

# Organização flat
sensei reestruturar --flat

# Usar preset específico
sensei reestruturar --preset sensei
sensei reestruturar --preset node-community
sensei reestruturar --preset ts-lib

# Override de categoria
sensei reestruturar --categoria controller=handlers

# Filtros
sensei reestruturar --include "src/**" --exclude "**/*.test.*"
```

### Exemplos

```bash
# Preview de reestruturação
sensei reestruturar --somente-plano --verbose

# Aplicar com preset
sensei reestruturar --preset sensei --auto

# Reestruturar apenas uma pasta
sensei reestruturar --include "src/old-module/**" --auto
```

---

## formatar

Aplica formatação de código com Prettier ou motor interno.

### Uso Básico

```bash
# Verificar formatação
sensei formatar --check

# Aplicar formatação
sensei formatar --write
```

### Opções

```bash
# Escolher motor
sensei formatar --engine auto      # padrão (tenta Prettier, fallback interno)
sensei formatar --engine prettier  # força Prettier
sensei formatar --engine interno   # usa motor interno

# Filtros de arquivos
sensei formatar --include "src/**/*.ts"
sensei formatar --exclude "**/*.generated.*"
```

### Arquivos Suportados

- JavaScript/TypeScript: `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`
- Markup: `.html`, `.xml`
- Estilos: `.css`
- Dados: `.json`, `.yaml`, `.yml`
- Documentação: `.md`, `.markdown`
- Outros: `.py`, `.php`

### Exemplos

```bash
# Verificar tudo antes de commit
sensei formatar --check

# Formatar apenas arquivos TypeScript
sensei formatar --write --include "**/*.ts"

# CI: verificar formatação
sensei formatar --check || exit 1
```

---

## otimizar-svg

Otimiza arquivos SVG usando otimizador interno (compatível com svgo).

### Uso Básico

```bash
# Preview sem modificar
sensei otimizar-svg --dry

# Aplicar otimizações
sensei otimizar-svg --write
```

### Opções

```bash
# Diretório específico
sensei otimizar-svg --dir assets/icons

# Filtros
sensei otimizar-svg --include "**/*.svg"
sensei otimizar-svg --exclude "**/node_modules/**"
```

### Exemplos

```bash
# Analisar potencial de otimização
sensei otimizar-svg --dry --verbose

# Otimizar pasta de ícones
sensei otimizar-svg --dir src/assets/icons --write

# Otimizar SVGs específicos
sensei otimizar-svg --include "public/**/*.svg" --write
```

---

## atualizar

Atualiza o Sensei com verificação de integridade prévia via Guardian.

### Uso Básico

```bash
# Atualização local
sensei atualizar

# Atualização global
sensei atualizar --global
```

### Fluxo de Execução

1. Executa análise do projeto
2. Verifica integridade via Guardian
3. Se OK, executa `npm install sensei@latest`
4. Reporta sucesso/falha

### Exemplos

```bash
# Atualização segura
sensei atualizar

# Se Guardian detectar alterações, primeiro aceite:
sensei guardian --diff
sensei guardian --accept-baseline
sensei atualizar
```

---

## reverter

Gerencia o mapa de reversão para operações de reestruturação.

### Subcomandos

```bash
# Listar todos os moves registrados
sensei reverter listar

# Reverter arquivo específico
sensei reverter arquivo <caminho>

# Reverter move por ID
sensei reverter move <id>

# Limpar histórico de reversão
sensei reverter limpar
sensei reverter limpar --force
```

### Exemplos

```bash
# Ver histórico de moves
sensei reverter listar

# Reverter um arquivo movido
sensei reverter arquivo src/new-location/file.ts

# Reverter move específico
sensei reverter move abc123def

# Limpar tudo (cuidado!)
sensei reverter limpar --force
```

---

## histórico

Utilitários globais para gerenciar o histórico de interações do Sensei.

### Flags

```bash
sensei --historico         # Exibe resumo do histórico
sensei --limpar-historico  # Limpa o histórico persistido
```

O histórico é persistido em `~/.sensei/history.json`. Cada execução do CLI registra os argumentos usados.

## 🌍 Variáveis de Ambiente Globais

Aplicam-se a todos os comandos:

```bash
# Performance
export WORKER_POOL_MAX_WORKERS=4
export WORKER_POOL_BATCH_SIZE=10
export WORKER_POOL_TIMEOUT_MS=30000

# Logs
export LOG_ESTRUTURADO=true
export REPORT_SILENCE_LOGS=true
export LOG_LEVEL=info

# Segurança
export SAFE_MODE=true
export ALLOW_PLUGINS=false
export ALLOW_EXEC=false

# Pontuação
export PONTUACAO_MODO=conservador
export PONTUACAO_FATOR_ESCALA=2.0
```

---

## 🎯 Workflows Comuns

### Workflow de Desenvolvimento

```bash
# 1. Análise inicial
sensei diagnosticar --verbose

# 2. Correção de tipos
sensei fix-types --interactive

# 3. Verificação de integridade
sensei guardian --diff

# 4. Limpeza de órfãos
sensei podar --dry-run
sensei podar

# 5. Análise final
sensei diagnosticar --full --export relatorio-final.md
```

### Workflow de CI/CD

```bash
# 1. Build e análise
npm run build
sensei diagnosticar --json --silence > diagnostico.json

# 2. Verificação de integridade
sensei guardian --diff --json > guardian.json

# 3. Métricas
sensei metricas --json > metricas.json

# 4. Análise de performance
sensei perf compare --baseline --json > perf.json
```

### Workflow de Refatoração

```bash
# 1. Snapshot antes
sensei perf snapshot --name "antes-refactor"
sensei guardian

# 2. Fazer mudanças...

# 3. Análise após mudanças
sensei diagnosticar --full
sensei guardian --diff

# 4. Performance comparison
sensei perf compare antes-refactor --json

# 5. Aceitar se OK
sensei guardian --accept
```

---

## 🔧 Troubleshooting

### Erro: "Comando não encontrado"

```bash
# Recompilar
npm run build

# Usar caminho completo
node dist/bin/index.js diagnosticar

# Instalar globalmente
npm install -g .
```

### Erro: "Timeout de análise"

```bash
# Aumentar timeout
sensei diagnosticar --timeout 120

# Via variável
export SENSEI_ANALISE_TIMEOUT_POR_ANALISTA_MS=120000
sensei diagnosticar
```

### Performance Lenta

```bash
# Reduzir workers
export WORKER_POOL_MAX_WORKERS=1
sensei diagnosticar

# Restringir escopo
sensei diagnosticar --include "src/**" --exclude "**/*.test.*"
```

---

## 📖 Referências

- [README Principal](../README.md)
- [Sistema de Type Safety](TYPE-SAFETY-SYSTEM.md)
- [Filtros Include/Exclude](GUIA_FILTROS_SENSEI.md)
- [Configuração Local](CONFIGURAR-SENSEI-LOCAL.md)

---

**Última atualização:** 15 de janeiro de 2026
**Versão:** 0.3.0
