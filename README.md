# Sensei CLI

> Proveniência e Autoria: Este documento integra o projeto Sensei (licença MIT).
> Nada aqui implica cessão de direitos morais/autorais.
> Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
> Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.

---

## 🌟 Status do Projeto

**Versão Atual:** 0.3.9 | **Node.js:** >=24.12.0 | **Licença:** MIT

[![Stars](https://img.shields.io/github/stars/5-5-5-0-0/sensei?style=social)](https://github.com/5-5-5-0-0/sensei/stargazers)
[![Forks](https://img.shields.io/github/forks/5-5-5-0-0/sensei?style=social)](https://github.com/5-5-5-0-0/sensei/network/members)
[![Issues](https://img.shields.io/github/issues/5-5-5-0-0/sensei)](https://github.com/5-5-5-0-0/sensei/issues)
[![Contributors](https://img.shields.io/github/contributors/5-5-5-0-0/sensei)](https://github.com/5-5-5-0-0/sensei/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/5-5-5-0-0/sensei/blob/main/CONTRIBUTING.md)

## 🚀 Demo Rápido

```bash
# Teste em 30 segundos sem instalar (requer Node.js 24+)
npx github:md-555/sensei diagnosticar --help
```

## 💡 Por que usar o Sensei?

- ⚡ **Performance**: Pool de workers para análise paralela de projetos grandes
- 🔒 **Segurança**: Guardian verifica integridade de arquivos via hashing
- 📊 **Métricas Inteligentes**: Pontuação adaptativa baseada no tamanho do projeto
- 🌐 **Multi-linguagem**: Suporte completo a JS/TS + suporte heurístico para tailwind/css/html/xml
- 🛠️ **Modular**: Sistema de analistas extensível com detecção automática de padrões
- 📈 **CI/CD Ready**: Outputs JSON estruturados para integração com pipelines

---

Sensei é uma CLI modular para analisar, diagnosticar e manter projetos (JS/TS e multi-stack leve). Entrega diagnósticos estruturais, verificação de integridade (Guardian), sugestão de reorganização e métricas — tudo com contratos JSON para CI.

---

> Nota de cobertura: Gate local transitório configurado em **70%** (por métrica) em `sensei.config.json` para acelerar a adição incremental de testes. No **CI Principal** o gate é forçado para **90%** via variáveis de ambiente (`COVERAGE_GATE_*`). Arquivos listados em `scripts/coverage-exclude.json` serão reintegrados gradualmente.

## 🚀 Instalação e Primeiros Passos

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/5-5-5-0-0/sensei.git
cd sensei

# Instale dependências e compile
npm install
npm run build

# Primeiro teste - diagnóstico completo
node dist/bin/index.js diagnosticar --json
```

**Windows (PowerShell):**

```powershell
git clone https://github.com/5-5-5-0-0/sensei.git; cd sensei; npm install; npm run build; node dist/bin/index.js diagnosticar --json
```

### Instalação Global (Opcional)

```bash
# Instala globalmente para usar em qualquer projeto
npm install -g .

# Agora você pode usar apenas 'sensei' ao invés de 'node dist/bin/index.js'
sensei diagnosticar --json
```

### Primeiro Uso - Comandos Essenciais

```bash
# Diagnóstico completo do projeto atual
sensei diagnosticar

# Ver apenas problemas críticos (modo executivo)
sensei diagnosticar --executive

# Análise rápida (apenas varredura, sem correções)
sensei diagnosticar --scan-only

# Saída estruturada para CI/CD
sensei diagnosticar --json

# Verificar integridade dos arquivos
sensei guardian --diff
```

## ✨ Capacidades

- Diagnóstico de padrões & estrutura (`diagnosticar`)
- Verificação de integridade via hashes (`guardian`)
- Sugestão de reorganização segura (plano de reorganização)
- Poda de arquivos órfãos (`podar`)
- Relatórios & métricas agregadas (`metricas`)
- Pool de Workers (paralelização por arquivo)
- Schema Versioning (compatibilidade backward)
- Pontuação Adaptativa (tamanho do projeto)

---

### ✨ Principais Funcionalidades

O sistema de análise inclui uma vasta gama de analistas e detectores para uma cobertura completa do projeto:

| Categoria       | Analistas e Detectores                                                                                                                                                                                                                                                                                                                           |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquitetura** | `analista-estrutura`, `diagnostico-projeto`, `estrategista-estrutura`, `sinais-projeto-avancados`, `sinais-projeto`                                                                                                                                                                                                                              |
| **Correções**   | `analista-pontuacao`, `analista-quick-fixes`, `auto-fix-engine`, `corretor-estrutura`, `fix-alias-imports`, `fix-md-fences`, `mapa-reversao`, `poda`, `pontuacao-fix`, `reescrever-testes-aliases`                                                                                                                                               |
| **Detectores**  | `detector-arquetipos`, `detector-arquitetura`, `detector-codigo-fragil`, `detector-construcoes-sintaticas`, `detector-contexto-inteligente`, `detector-dependencias`, `detector-duplicacoes`, `detector-estrutura`, `detector-fantasmas`, `detector-interfaces-inline`, `detector-performance`, `detector-seguranca`, `detector-tipos-inseguros` |
| **JS/TS**       | `analista-comandos-cli`, `analista-funcoes-longas`, `analista-padroes-uso`, `analista-todo-comments`, `orquestrador-arquetipos`                                                                                                                                                                                                                  |
| **Plugins**     | `analista-css-in-js`, `analista-css`, `analista-formater`, `analista-html`, `analista-python`, `analista-react-hooks`, `analista-react`, `analista-svg`, `analista-tailwind`, `analista-xml`, `detector-documentacao`, `detector-markdown`, `detector-node`, `detector-qualidade-testes`, `detector-xml`                                         |

#### Pool de Workers (desde v0.2.0)

```bash
# Paralelização automática ativada por padrão
sensei diagnosticar

# Configuração manual
WORKER_POOL_MAX_WORKERS=4 sensei diagnosticar
```

#### Sistema de Supressão Inline

```typescript
// @sensei-disable-next-line hardcoded-secrets
const apiKey = "development-key-only";
```

---

Benefícios gerais:

- Performance: redução de ~70% nos arquivos processados
- Compatibilidade: filtros explícitos continuam funcionando
- Segurança: evita análise acidental de dependências

## ⚡ Flags Essenciais para Iniciantes

### Modos de Execução

```bash
# Modo seguro (recomendado para começar)
sensei diagnosticar --safe-mode

# Modo verbose (mais detalhes)
sensei diagnosticar --verbose

# Modo silencioso (menos output)
sensei diagnosticar --silence

# Apenas varredura (não executa correções)
sensei diagnosticar --scan-only
```

### Saídas Diferentes

```bash
# Saída JSON para ferramentas/automação
sensei diagnosticar --json

# Saída compacta (menos detalhes)
sensei diagnosticar --compacto

# Modo executivo (apenas problemas críticos)
sensei diagnosticar --executive

# Exportar relatório para arquivo
sensei diagnosticar --export relatorio.md
```

### Debug e Desenvolvimento

```bash
# Modo debug (informações detalhadas)
sensei diagnosticar --debug

# Ver apenas erros
sensei diagnosticar --only-errors

# Timeout personalizado (em segundos)
sensei diagnosticar --timeout 60
```

## 📋 Workflows de Desenvolvimento

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Compilar projeto
npm run build

# Executar testes
npm test

# Verificar cobertura
npm run coverage

# Executar lint e formatação
npm run lint
npm run format:fix
```

### CI/CD Básico

```bash
# Build e testes
npm run build
npm test

# Análise completa
sensei diagnosticar --json

# Verificar integridade
sensei guardian --diff --json
```

### Debug de Problemas

```bash
# Modo debug completo
sensei diagnosticar --debug --verbose

# Apenas um tipo específico de análise
sensei diagnosticar --include "src/**/*.ts" --debug

# Ver logs detalhados
DEBUG=* sensei diagnosticar
```

## 🔧 Troubleshooting Comum

### "Comando não encontrado"

```bash
# Verifique se está no diretório correto
pwd
ls -la dist/bin/

# Recompile o projeto
npm run build

# Use caminho completo
node ./dist/bin/index.js diagnosticar
```

### "Erro de permissão"

```bash
# No Linux/Mac
chmod +x dist/bin/index.js

# Ou use node diretamente
node dist/bin/index.js diagnosticar
```

### "Timeout de análise"

```bash
# Aumente o timeout
sensei diagnosticar --timeout 120

# Ou via variável
SENSEI_ANALISE_TIMEOUT_POR_ANALISTA_MS=60000 sensei diagnosticar
```

### "Muitos arquivos analisados"

```bash
# Restrinja a análise
sensei diagnosticar --include "src/**" --exclude "**/*.test.*"

# Use modo scan-only para preview
sensei diagnosticar --scan-only
```

### "Problemas de performance"

```bash
# Reduza workers
WORKER_POOL_MAX_WORKERS=1 sensei diagnosticar

# Use modo conservador
# Use modo conservador
PONTUACAO_MODO=conservador sensei diagnosticar
```

## 📚 Comandos Principais

| Comando        | Descrição                             | Uso Comum                              |
| -------------- | ------------------------------------- | -------------------------------------- |
| `diagnosticar` | Análise completa do projeto           | `sensei diagnosticar --json`          |
| `guardian`     | Verificação de integridade            | `sensei guardian --diff`              |
| `podar`        | Remoção segura de arquivos órfãos     | `sensei podar --dry-run`              |
| `reestruturar` | Reorganização de estrutura do projeto | `sensei reestruturar --somente-plano` |
| `formatar`     | Formatação de código                  | `sensei formatar --write`             |
| `fix-types`    | Correção de tipos inseguros           | `sensei fix-types --dry-run`          |
| `metricas`     | Visualizar métricas agregadas         | `sensei metricas --json`              |
| `perf`         | Análise de performance                | `sensei perf compare`                 |
| `analistas`    | Listar analistas disponíveis          | `sensei analistas --json`             |
| `otimizar-svg` | Otimização de arquivos SVG            | `sensei otimizar-svg --write`         |
| `atualizar`    | Atualização segura do Sensei         | `sensei atualizar`                    |
| `reverter`     | Reverter mudanças de reestruturação   | `sensei reverter listar`              |
| `names`        | Extrair nomes para tradução           | `sensei names`                        |
| `rename`       | Aplicar renomeação de variáveis       | `sensei rename`                       |

## 🧪 Testes

```bash
npm run format:fix; npm run lint; npm test
```

Cobertura local:

```bash
npm run coverage && npm run coverage:gate
```

Gate no CI: aplicado somente no workflow `CI Principal` com 90% (env). Documentação de timeout: `docs/TESTING-VITEST-TIMEOUT.md`.

## 🎯 Filtros Include/Exclude (Controle o que analisar)

### Exemplos Práticos

```bash
# Analisar apenas arquivos TypeScript
sensei diagnosticar --include "**/*.ts" --include "**/*.tsx"

# Analisar apenas uma pasta específica
sensei diagnosticar --include "src/**/*"

# Excluir testes e documentação
sensei diagnosticar --exclude "**/*.test.*" --exclude "**/*.spec.*" --exclude "docs/**"

# Analisar apenas arquivos modificados recentemente (git)
sensei diagnosticar --include "$(git diff --name-only HEAD~1)"

# Misturar include e exclude
sensei diagnosticar --include "src/**/*.ts" --exclude "src/**/*.test.ts"
```

### Regras Importantes

- **`--include` tem prioridade** sobre `--exclude` e ignores padrão
- **`node_modules` é ignorado por padrão** - use `--include "node_modules/**"` para analisá-lo
- **Grupos de include**: dentro do grupo é AND, entre grupos é OR
- **Padrões glob** seguem sintaxe minimatch

### Casos de Uso Comuns

```bash
# Apenas código fonte (excluindo testes e config)
sensei diagnosticar --include "src/**" --include "lib/**" --exclude "**/*.test.*"

# Apenas arquivos JavaScript/TypeScript
sensei diagnosticar --include "**/*.{js,ts,jsx,tsx,mjs,cjs}"

# Excluir diretórios comuns
sensei diagnosticar --exclude "node_modules/**" --exclude "dist/**" --exclude ".git/**" --exclude "coverage/**"

# Análise focada em uma feature específica
# Análise focada em uma feature específica
sensei diagnosticar --include "src/features/auth/**" --include "src/components/auth/**"
```

## 🌍 Variáveis de Ambiente Essenciais

### Performance e Paralelização

```bash
# Número de workers (padrão: auto)
export WORKER_POOL_MAX_WORKERS=4

# Tamanho do lote de processamento
export WORKER_POOL_BATCH_SIZE=10

# Timeout por analista (30s padrão)
export WORKER_POOL_TIMEOUT_MS=30000
```

### Modo de Pontuação

```bash
# Modo: padrao, conservador, permissivo
export PONTUACAO_MODO=conservador

# Fator de escala personalizado
export PONTUACAO_FATOR_ESCALA=2.0

# Pesos para frameworks específicos
export PONTUACAO_PESO_FRAMEWORK=1.05
export PONTUACAO_PESO_TYPESCRIPT=1.03
```

### Logs e Debug

```bash
# Silenciar logs durante JSON
export REPORT_SILENCE_LOGS=true

# Logs estruturados
export LOG_ESTRUTURADO=true

# Modo de desenvolvimento
export DEV_MODE=true
```

### Configurações de Segurança

```bash
# Modo seguro (desabilita operações perigosas)
export SAFE_MODE=true

# Permitir plugins
export ALLOW_PLUGINS=false

# Permitir execução de comandos
export ALLOW_EXEC=false
```

### Exemplos de Uso

**Para desenvolvimento local:**

```bash
export DEV_MODE=true
export WORKER_POOL_MAX_WORKERS=2
export PONTUACAO_MODO=conservador
sensei diagnosticar --verbose
```

**Para CI/CD:**

```bash
export SAFE_MODE=true
export REPORT_SILENCE_LOGS=true
export WORKER_POOL_MAX_WORKERS=4
sensei diagnosticar --json
```

**Para análise rápida:**

```bash
export WORKER_POOL_MAX_WORKERS=1
export PONTUACAO_MODO=permissivo
sensei diagnosticar --scan-only
```

````

## 📚 Comandos

- `diagnosticar` — análise completa do projeto
- `guardian` — baseline e diff de integridade
- `podar` — remoção segura de arquivos órfãos
- `reestruturar` — plano de reorganização de estrutura
- `formatar` — formatação de código (Prettier/interno)
- `fix-types` — correção automática de tipos inseguros (any/unknown)
- `analistas` — catálogo de analistas (`--json`, `--doc`)
- `metricas` — histórico agregado de métricas
- `perf` — snapshots e comparação de performance
- `otimizar-svg` — otimização de arquivos SVG
- `atualizar` — atualização segura com verificação de integridade
- `reverter` — gerenciamento de mapa de reversão para reestruturação
- `names` — extração de nomes de variáveis para mapeamento (estrutura fragmentada em `names/`, espelhando `src/`; use `--legacy` para gerar também `names/name.txt`)
- `rename` — aplicação de renomeações em massa (lê `names/name.txt` se existir, senão agrega todos os `names/**/*.txt`)

## ⚙️ Flags globais

- `--silence`, `--verbose`, `--export`, `--debug`, `--scan-only`, `--json`

## 🔗 Linguagens Suportadas

- **Primário (AST Babel completo)**: `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`
- **Analisadores Específicos**: `.html`, `.css`, `.xml`, `.svg`, `.md`
- **Heurístico/Leve**: `.kt`, `.kts`, `.java`, `.gradle`, `.py`, `.php`

*Nota: Analistas que dependem de nós Babel atuam apenas em linguagens suportadas pelo Babel; demais arquivos são processados por plugins específicos quando disponíveis.*

## 🔐 Segurança (Plugins)

- Whitelist de extensões (`.js`, `.mjs`, `.cjs`, `.ts`)
- Sanitização de paths e validação de globs

## 🧾 Saída JSON (Políticas)

- Em `--json`, logs verbosos são silenciados até a emissão do objeto final
- Unicode fora do ASCII básico é escapado como `\uXXXX` (inclui pares substitutos para caracteres fora do BMP)
- Quando o Guardian não é executado, retornos usam status padrão coerente (ex.: `"nao-verificado"`), mantendo o shape estável

## 📜 Saída `guardian --json` (Resumo)

```json
{ "status": "ok|baseline-criado|baseline-aceito|alteracoes-detectadas|erro" }
````

## ⚙️ Configuração

Os arquivos de configuração ficam na raiz do projeto e são carregados em tempo de execução.

### sensei.config.json (principal)

Exemplo (trecho real):

```json
{
  "INCLUDE_EXCLUDE_RULES": {
    "globalExcludeGlob": [
      "node_modules/**",
      "**/node_modules/**",
      ".pnpm/**",
      "**/.sensei/**",
      "dist/**",
      "**/dist/**",
      "coverage/**",
      "**/coverage/**",
      "build/**",
      "**/build/**",
      "**/*.log",
      "**/*.lock",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "**/.git/**",
      "preview-sensei/**",
      "tests/fixtures/**"
    ],
    "globalInclude": [],
    "globalExclude": [],
    "dirRules": {},
    "defaultExcludes": null
  },
  "ESTRUTURA_ARQUIVOS_RAIZ_MAX": 50,
  "REPO_ARQUETIPO": "sensei-self",
  "STRUCTURE_AUTO_FIX": false,
  "REPORT_EXPORT_ENABLED": false,
  "coverageGate": {
    "lines": 70,
    "functions": 70,
    "branches": 70,
    "statements": 70
  }
}
```

Campos úteis:

- INCLUDE_EXCLUDE_RULES: controle de include/exclude (globs)
- ESTRUTURA_ARQUIVOS_RAIZ_MAX: máximo de arquivos raiz exibidos
- REPO_ARQUETIPO: arquétipo base de referência
- STRUCTURE_AUTO_FIX: ativa técnicas mutáveis (off por padrão)
- coverageGate: limiares de cobertura por métrica (90%)

### sensei.config.safe.json (modo seguro)

Exemplo (trecho real):

````json
{
  "SAFE_MODE": true,
  "ALLOW_PLUGINS": false,
  "ALLOW_EXEC": false,
  "ALLOW_MUTATE_FS": false,
  "STRUCTURE_AUTO_FIX": false,
  "REPORT_EXPORT_ENABLED": false,
  "SENSEI_ALLOW_EXEC": 1,
  "SENSEI_ANALISE_TIMEOUT_POR_ANALISTA_MS": 10000,
  "productionDefaults": {
    "NODE_ENV": "development",
    "SENSEI_MAX_ANALYST_TIMEOUT_MS": 10000,
    "WORKER_POOL_MAX_WORKERS": 2,
    "WORKER_POOL_BATCH_SIZE": 10,
    "SENSEI_WORKER_HEARTBEAT_MS": 5000,
    "LOG_ESTRUTURADO": false,
    "REPORT_SILENCE_LOGS": true
  }
}
```

Recomendações:

- Mantenha SAFE_MODE habilitado em CI e ambientes compartilhados
- Ajuste productionDefaults para limitar workers/silenciar logs em pipelines

### sensei.repo.arquetipo.json (perfil do repositório)

Exemplo (trecho real):

```json
{
  "arquetipoOficial": "cli-modular",
  "descricao": "Projeto personalizado: sensei",
  "estruturaPersonalizada": {
    "arquivosChave": [
      "eslint.config.js",
      "package.json",
      "README.md",
      "tmp-debug-e2e.js",
      "vitest.config.ts"
    ],
    "diretorios": [
      ".husky",
      ".husky/_",
      ".vscode",
      "docs",
      "docs/branches",
      "docs/features",
      "docs/partials",
      "docs/perf",
      "docs/tests",
      "scripts",
      "src",
      "src/@types",
      "src/analistas",
      "src/arquitetos",
      "src/bin",
      "src/cli",
      "src/guardian",
      "src/nucleo",
      "src/relatorios",
      "src/tipos",
      "src/zeladores",
      "temp-fantasma",
      "temp-fantasma/src",
      "tests",
      "tests/analistas",
      "tests/arquitetos",
      "tests/cli",
      "tests/guardian",
      "tests/nucleo",
      "tests/raiz",
      "tests/relatorios",
      "tests/tipos",
      "tests/tmp",
      "tests/zeladores"
    ],
    "padroesNomenclatura": { "tests": "*.test.*" }
  },
  "melhoresPraticas": {
    "evitar": ["temp/", "cache/", "*.log"],
    "notas": [
      "Mantenha código fonte organizado em src/",
      "Separe testes em pasta dedicada",
      "Documente APIs e funcionalidades importantes"
    ],
    "recomendado": ["src/", "tests/", "docs/", "README.md", ".env.example"]
  },
  "metadata": { "criadoEm": "2025-09-06T22:15:41.078Z", "versao": "1.0.0" },
  "nome": "sensei"
}
```

Dicas:

- Ajuste “diretorios” para refletir o layout real do seu repositório
- Use “arquivosChave” para reforçar detecção de estrutura
- “arquetipoOficial” ajuda comparações e drift na detecção

### Variáveis de ambiente (.env)

Você pode configurar o Sensei via variáveis de ambiente (úteis para CI e ajustes locais). Um arquivo de exemplo está disponível em `.env.example`.

Principais variáveis:

- Pool de Workers:
  - `WORKER_POOL_ENABLED` (true|false)
  - `WORKER_POOL_MAX_WORKERS` (número ou `auto`)
  - `WORKER_POOL_BATCH_SIZE` (número)
  - `WORKER_POOL_TIMEOUT_MS` (ms por analista; padrão 30000)
  - `SENSEI_WORKER_HEARTBEAT_MS` (ms; batimento do worker)
- Tempo de análise:
  - `SENSEI_ANALISE_TIMEOUT_POR_ANALISTA_MS` (ms)
  - `SENSEI_MAX_ANALYST_TIMEOUT_MS` (ms; alias compatível)
- Pontuação Adaptativa:
  - `PONTUACAO_MODO` (padrao|conservador|permissivo)
  - `PONTUACAO_FATOR_ESCALA` (override numérico)
  - `PONTUACAO_PESO_FRAMEWORK` (ex.: 1.05)
  - `PONTUACAO_PESO_TYPESCRIPT` (ex.: 1.03)
- Logs/JSON:
  - `REPORT_SILENCE_LOGS` (silenciar logs ao montar JSON)
  - `LOG_ESTRUTURADO` (true|false)
- Gate de Cobertura (CI vs local):
  - Local: valores do `coverageGate` (70% transitório)
  - CI Principal: override via `COVERAGE_GATE_LINES/FUNCTIONS/BRANCHES/STATEMENTS=90`

Exemplos rápidos:

```bash
# Bash / Linux / macOS
export WORKER_POOL_MAX_WORKERS=4
export PONTUACAO_MODO=conservador
export COVERAGE_GATE_LINES=90
sensei diagnosticar --json
```

```powershell
# Windows PowerShell
$env:WORKER_POOL_MAX_WORKERS = 4
$env:PONTUACAO_MODO = "conservador"
$env:COVERAGE_GATE_LINES = 90
sensei diagnosticar --json
```

## 📖 Leituras Adicionais

- [Documentação Completa](docs/README.md)
- [Guia de Início Rápido](docs/guias/GUIA-INICIO-RAPIDO.md)
- [Guia de Comandos](docs/guias/GUIA-COMANDOS.md)
- [Guia de Configuração](docs/guias/GUIA-CONFIGURACAO.md)
- [Sistema de Segurança](docs/arquitetura/SEGURANCA.md)
- [Type Safety](docs/arquitetura/TYPE-SAFETY.md)
- [Novidades v0.3.0](docs/releases/v0.3.0.md)
- [Novidades v0.2.0](docs/releases/v0.2.0.md)

---

## 📄 Licença

``
MIT. Avisos de terceiros: `THIRD-PARTY-NOTICES.txt`.
``
### 5-5-5-0-0
# sensei
# sensei
