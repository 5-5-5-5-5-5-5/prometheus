---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
---

<img src="svg/banner-prometheus.svg" width="100%"/>

---

<div align="center">

---

<img src="svg/badge-beta.svg"/>
<img src="svg/badge-stable.svg"/>
<img src="svg/badge-prs-welcome.svg"/>
<img src="svg/badge-maintained.svg"/>

---

---

<img src="svg/badge-versao.svg"/>
<img src="svg/badge-node.svg"/>
<img src="svg/badge-typescript.svg"/>
<a href="https://github.com/5-5-5-5-5-5-5/prometheus/issues">
<img src="svg/badge-issues.svg"/>
</a>
</div>

---

<div align="center">

**[ Começar Rápido](#-começar-rápido) - • - [ Documentação](#-documentação-completa) - • - [ Exemplos](#-exemplos) - • - [ Instalar](#instalação) - • - [ Contribuir](#-desenvolvimento)**

</div>

---

##  Sumário

- [ Características](#-características-principais)
- [ Começar Rápido](#-começar-rápido)
- [ Instalação](#instalação)
- [ Fluxo Recomendado](#fluxo-recomendado)
- [ Configuração](#configuração)
- [ Comandos Disponíveis](#-comandos-disponíveis)
- [ Documentação Completa](#-documentação-completa)
- [ Exemplos](#-exemplos)
- [ Arquitetura](#-estrutura-do-projeto)
- [‍ Desenvolvimento](#-desenvolvimento)
- [ Contribuir](#-desenvolvimento)
- [ Suporte](#-suporte)

##  Características Principais

Prometheus oferece uma suite completa de ferramentas para análise e manutenção de código:

###  Análise Inteligente

- **Diagnóstico Completo**: Detecta problemas de qualidade, segurança e arquitetura
- **15+ Analisadores Especializados**: Código frágil, duplicação, complexidade, performance, vazamentos de memória, tipos inseguros, etc.
- **18+ Plugins Multi-linguagem**: React, CSS, HTML, Python, Shell, SQL, Tailwind, XML, SVG, e mais
- **Sistema de Registro Inteligente**: Descoberta automática de analistas built-in e plugins customizados
- **Multi-linguagem**: JavaScript/TypeScript nativo + HTML, CSS, XML, Python, PHP, Shell, SQL (Java/Kotlin disponíveis)

###  Manutenção Assistida

- **Auto-fix Seguro**: Correções automáticas com validação de segurança (comando `corrigir`)
- **Guardian**: Monitoramento contínuo de saúde do projeto com baselines e verificação de integridade
- **Reestruturação**: Reorganização automática de código seguindo padrões arquiteturais
- **Poda Inteligente**: Identificação e limpeza de arquivos órfãos e código morto
- **Fix Types**: Correção automática de tipos inseguros (`any`, `unknown`)
- **Formatação**: Formatação automática seguindo padrões do projeto
- **Names/Rename**: Extração e renomeação em massa de variáveis com mapeamento inteligente
- **Reverter**: Gerenciamento de mapa de reversão para moves aplicados

###  Relatórios Profissionais

- **Múltiplos Formatos**: JSON, Markdown, HTML, CSV com export sharded para projetos grandes
- **Análise Arquitetural**: Detecção de padrões arquiteturais e dependências
- **Métricas Detalhadas**: Complexidade ciclomática, duplicação, cobertura, performance com histórico
- **Baseline de Performance**: Snapshots e comparação de performance ao longo do tempo
- **Scan de Licenças**: Verificação de licenças de dependências e geração de THIRD-PARTY-NOTICES

###  Extensível

- **Plugin System**: Crie analistas customizados com autodiscovery automático
- **API Modular**: Use Prometheus como biblioteca em seu código
- **Registry Pattern**: Descoberta dinâmica de componentes
- **Worker Pool**: Processamento paralelo com workers para performance em projetos grandes
- **Schema Versioning**: Relatórios versionados com compatibilidade backward

---

##  Começar Rápido

### Instalação Básica

```bash
npm install -g prometheus
prometheus --version
```

### Seu Primeiro Comando

```bash
# Analyse seu projeto
cd seu-projeto
prometheus diagnosticar

# Ver resultado em JSON
prometheus diagnosticar --relatorio json

# Mostrar apenas problemas críticos
prometheus diagnosticar --gravidade critic
```

### Próximos Passos

```bash
# Revisar o que pode ser corrigido automaticamente
prometheus corrigir --revisar

# Aplicar correções automáticas
prometheus corrigir --auto

# Estabelecer baseline de saúde do projeto
prometheus guardian --baseline

# Verificar mudanças após edições
prometheus guardian --verificar

# Extrair nomes de variáveis para mapeamento
prometheus names

# Renomear variáveis em massa
prometheus rename
```

 **Quer aprender mais?** Veja [Guia de Início Rápido](./docs/guias/GUIA-INICIO-RAPIDO.md) para tutorial completo.

---

##  Visão Geral

O Prometheus foi projetado para operar como ferramenta de análise estática e manutenção assistida de repositórios. O projeto combina:

- **diagnóstico** de qualidade e estrutura via `prometheus diagnosticar`
- **verificação contínua** de integridade via `prometheus guardian`
- **reorganização estrutural** via `prometheus reestruturar`
- **poda inteligente** de arquivos órfãos via `prometheus podar`
- **correções automáticas** via `prometheus corrigir` e `prometheus fix-types`
- **gerenciamento de nomes** via `prometheus names` e `prometheus rename`
- **gestão de reversões** via `prometheus reverter`
- **métricas e performance** via `prometheus metricas` e `prometheus perf`
- **utilitários avançados** para formatação, licenças, otimização SVG e mais

**Versão atual**: v0.4.3
**Runtime**: Node.js >= 24.14.1
**Licença**: MIT-0
**Linguagem**: TypeScript 6.0+

## Instalação

###  npm (Recomendado)

**Uso Global**
```bash
npm install -g prometheus
prometheus --help
```

**Uso Local (Projeto)**
```bash
npm install --save-dev prometheus
npx prometheus --help
```

###  Do Repositório

**Clone e Setup Local**
```bash
git clone https://github.com/5-5-5-5-5-5-5/prometheus.git
cd prometheus
npm install                    # Instalar dependências
npm run build                  # Compilar TypeScript
npm link                       # Link global para desenvolvimento
prometheus --help
```

**Usar como Dependência Local**
```bash
npm install --save-dev /caminho/para/prometheus
npx prometheus --help
```

###  Verificar Instalação

```bash
# Versão
prometheus --version

# Listar comandos
prometheus --help

# Listar analistas disponíveis
prometheus analista --listar
```

###  Docker (Opcional)

```bash
# Build da imagem
docker build -t prometheus:latest .

# Usar container
docker run --rm -v $(pwd):/project prometheus diagnosticar
```

---

###  Fluxo Recomendado

#### 1⃣ Diagnóstico Inicial

Analise seu projeto para descobrir problemas:

```bash
# Análise básica
prometheus diagnosticar

# Modo verbose para mais detalhes
prometheus diagnosticar --verbose

# Exportar para arquivo JSON
prometheus diagnosticar --relatorio json --saida analise.json

# Apenas problemas críticos
prometheus diagnosticar --gravidade critic
```

#### 2⃣ Estabelecer Baseline de Saúde

Criar snapshot inicial para comparações futuras:

```bash
# Estabelecer baseline
prometheus guardian --baseline

# Verificar mudanças após edições
prometheus guardian --verificar

# Confirmar mudanças se aprovadas
prometheus guardian --confirmar
```

#### 3⃣ Correções Automáticas

Aplicar fixes com segurança:

```bash
# Ver o que pode ser corrigido
prometheus corrigir

# Revisar mudanças antes de aplicar
prometheus corrigir --revisar

# Aplicar automaticamente
prometheus corrigir --auto

# Corrigir tipos inseguros (any, unknown)
prometheus fix-types --auto
```

#### 4⃣ Monitoramento Contínuo

Ativar monitoramento em tempo real:

```bash
# Monitorar em modo watch
prometheus guardian --monitorar

# Gerar relatórios periódicos
prometheus diagnosticar --relatorio markdown --saida RELATORIO.md

# Ver métricas históricas
prometheus metricas

# Baseline de performance
prometheus perf snapshot --baseline
prometheus perf compare
```

#### 5⃣ Manutenção de Nomes (Opcional)

Extrair e renomear variáveis:

```bash
# Extrair nomes de variáveis
prometheus names

# Renomear variáveis em massa
prometheus rename --apply

# Reverter mudanças se necessário
prometheus reverter listar
```

---

##  Configuração

O arquivo principal de configuração é [`prometheus.config.json`](./prometheus.config.json) na raiz do projeto.

### Blocos de Configuração

| Bloco                   | Descrição                    | Exemplo                                    |
| ----------------------- | ---------------------------- | ------------------------------------------ |
| `INCLUDE_EXCLUDE_RULES` | Globs para incluir/excluir   | `"globalExcludeGlob": ["node_modules/**"]` |
| `nameConventions`       | Convenções de nomenclatura   | Validar padrões de nomes                   |
| `coverageGate`          | Limites de cobertura         | Mínimo 80% cobertura                       |
| `languageSupport`       | Linguagens a analisar        | TypeScript, JavaScript, Python, etc        |
| `suppress`              | Suprimir avisos              | IDs de avisos a ignorar                    |
| `rules`                 | Regras customizadas          | Rules específicas do projeto               |
| `testPatterns`          | Padrões de arquivos de teste | `**/*.test.ts`, `**/*.spec.ts`             |
| `fastMode`              | Otimizações de performance   | Skip de checagens caras                    |

### Configuração Mínima

```json
{
  "prometheus": {
    "locale": "pt",
    "verbose": true,
    "exclude": [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      ".git/**"
    ],

    "INCLUDE_EXCLUDE_RULES": {
      "globalExcludeGlob": [
        "node_modules/**",
        "dist/**",
        "build/**",
        "coverage/**"
      ]
    },

    "REPO_ARQUETIPO": "cli-modular",

    "languageSupport": {
      "javascript": { "enabled": true },
      "typescript": { "enabled": true },
      "html": { "enabled": true },
      "css": { "enabled": true }
    }
  }
}
```

Para configuração completa, veja [GUIA-CONFIGURACAO.md](./docs/guias/GUIA-CONFIGURACAO.md).

---

##  Comandos Disponíveis

### Comandos Principais

| Comando        | Descrição                                   | Exemplo de Uso                      |
| -------------- | ------------------------------------------- | ----------------------------------- |
| `diagnosticar` | Análise completa do projeto                 | `prometheus diagnosticar --verbose` |
| `corrigir`     | Auto-fix com validação de segurança         | `prometheus corrigir --auto`        |
| `guardian`     | Monitoramento contínuo de integridade       | `prometheus guardian --baseline`    |
| `reestruturar` | Reorganizar estrutura do código             | `prometheus reestruturar`           |
| `podar`        | Remover código morto/arquivos órfãos        | `prometheus podar`                  |
| `fix-types`    | Corrigir tipos inseguros (`any`, `unknown`) | `prometheus fix-types --auto`       |
| `formatar`     | Formatação automática do código             | `prometheus formatar --write`       |
| `analistas`    | Listar/info sobre analistas                 | `prometheus analistas --listar`     |

### Comandos de Nomes e Renomeação

| Comando    | Descrição                    | Exemplo de Uso               |
| ---------- | ---------------------------- | ---------------------------- |
| `names`    | Extrair nomes de variáveis   | `prometheus names`           |
| `rename`   | Aplicar renomeações em massa | `prometheus rename --apply`  |
| `reverter` | Gerenciar mapa de reversão   | `prometheus reverter listar` |

### Comandos de Métricas e Performance

| Comando    | Descrição                            | Exemplo de Uso                        |
| ---------- | ------------------------------------ | ------------------------------------- |
| `metricas` | Histórico de execuções               | `prometheus metricas`                 |
| `perf`     | Baseline e comparação de performance | `prometheus perf snapshot --baseline` |

### Comandos de Licenças

| Comando    | Descrição                        | Exemplo de Uso             |
| ---------- | -------------------------------- | -------------------------- |
| `licencas` | Scan de licenças de dependências | `prometheus licencas scan` |

### Comandos Utilitários

| Comando        | Descrição             | Exemplo de Uso            |
| -------------- | --------------------- | ------------------------- |
| `otimizar-svg` | Otimizar arquivos SVG | `prometheus otimizar-svg` |
| `atualizar`    | Atualizar Prometheus  | `prometheus atualizar`    |

### Ajuda Detalhada

```bash
# Ver todos os comandos
prometheus --help

# Ajuda de comando específico
prometheus diagnosticar --help
prometheus corrigir --help
prometheus guardian --help
```

Para referência completa de comandos, veja [Referência de Comandos](./docs/referencia/comandos/README.md).

---

##  Exemplos

### Diagnóstico

```bash
# Análise padrão
prometheus diagnosticar

# Modo verbose
prometheus diagnosticar --verbose

# Apenas problemas críticos
prometheus diagnosticar --gravidade critic

# Exportar como JSON
prometheus diagnosticar --relatorio json --saida analise.json

# Exportar como Markdown
prometheus diagnosticar --relatorio markdown --saida RELATORIO.md
```

### Auto-fix

```bash
# Ver o que pode ser corrigido
prometheus corrigir

# Revisar antes de aplicar
prometheus corrigir --revisar

# Aplicar todas as correções
prometheus corrigir --auto

# Apenas tipo específico
prometheus corrigir --tipo variavel-nao-usada --auto
```

### Guardian - Monitoramento

```bash
# Estabelecer baseline
prometheus guardian --baseline

# Verificar mudanças
prometheus guardian --verificar

# Modo monitor (watch)
prometheus guardian --monitorar

# Confirmar mudanças
prometheus guardian --confirmar
```

### Relatórios e Métricas

```bash
# Análise com exportação JSON
prometheus diagnosticar --relatorio json --saida analise.json

# Exportar como Markdown
prometheus diagnosticar --relatorio markdown --saida RELATORIO.md

# Ver métricas históricas
prometheus metricas

# Baseline de performance
prometheus perf snapshot --baseline

# Comparar performance
prometheus perf compare
```

### Nomes e Renomeação

```bash
# Extrair nomes de variáveis do projeto
prometheus names

# Renomear variáveis usando mapeamento
prometheus rename

# Reverter renomeações aplicadas
prometheus reverter listar
prometheus reverter --help
```

### Licenças e Compliance

```bash
# Scan de licenças de dependências
prometheus licencas scan

# Gerar arquivo THIRD-PARTY-NOTICES
prometheus licencas notices generate

# Adicionar disclaimer de proveniência
prometheus licencas disclaimer add

# Verificar disclaimers
prometheus licencas disclaimer verify
```

 **Mais exemplos?** Veja [Exemplos de Uso](./docs/exemplos/EXEMPLOS-USO.md).

---

##  Documentação Completa

Prometheus possui documentação extensiva e atualizada:

###  Para Começar

- **[Guia de Início Rápido](./docs/guias/GUIA-INICIO-RAPIDO.md)** - Tutorial de 10 minutos
- **[Guia de Configuração](./docs/guias/GUIA-CONFIGURACAO.md)** - Customizar seu setup
- **[Guia de Comandos](./docs/guias/GUIA-COMANDOS.md)** - Referência completa

###  Para Arquitetos

- **[Árvore Arquitetural](./docs/arquitetura/ARVORE-ARQUITETURAL.md)** - Estrutura visual completa
- **[Type Safety](./docs/arquitetura/TYPE-SAFETY.md)** - Garantias de tipo
- **[Segurança](./docs/arquitetura/SEGURANCA.md)** - Práticas de segurança
- **[Sistema de Erros](./docs/arquitetura/SISTEMA-ERROS.md)** - Tratamento de erros

### ‍ Para Desenvolvedores

- **[Como Criar Analistas](./docs/desenvolvimento/analistas/CRIAR-ANALISTA.md)** - Guia prático (6 passos)
- **[Estrutura de Código](./docs/desenvolvimento/estrutura-codigo/README.md)** - Organização do src/
- **[Padrões de Desenvolvimento](./docs/desenvolvimento/PADROES.md)** - Convenções e boas práticas
- **[Sistema de Plugins](./docs/desenvolvimento/SISTEMA-PLUGINS.md)** - Como estender

###  Referência

- **[Referência de Comandos](./docs/referencia/comandos/README.md)** - Todos os comandos detalhados
- **[Exemplos de Uso](./docs/exemplos/EXEMPLOS-USO.md)** - Casos reais e CI/CD
- **[Roadmap](./docs/roadmap/ROADMAP.md)** - Futuro do projeto
- **[Índice Completo](./docs/INDICE.md)** - Navegação por tópico

###  Desenvolvimento

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Como contribuir
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** - Código de conduta
- **[SECURITY.md](./SECURITY.md)** - Política de segurança

---

##  Estrutura do Projeto

```
prometheus-dev/
├── src/                          # Código-fonte principal
│   ├── bin/                      # Entry points da CLI
│   │   ├── index.ts              # Bootstrap com ESM loader
│   │   └── cli.ts                # Ponto de entrada principal
│   │
│   ├── cli/                      # Interface de linha de comando
│   │   ├── commands/             # Implementação de todos os comandos
│   │   ├── diagnostico/          # Handlers, filtros e exporters
│   │   ├── handlers/             # Exporters especializados
│   │   ├── helpers/              # Funções auxiliares
│   │   ├── options/              # Flags e validações
│   │   ├── processing/           # Processamento de resultados
│   │   ├── index.ts              # Registro de comandos
│   │   └── processamento-diagnostico.ts
│   │
│   ├── core/                     # Núcleo do sistema
│   │   ├── config/               # Configuração e validação
│   │   ├── execution/            # Motor de execução
│   │   ├── messages/             # Sistema i18n (PT, EN, ZH, JA)
│   │   └── shared/               # Utilitários compartilhados
│   │
│   ├── analistas/                # Sistema de análise
│   │   ├── detectores/           # 15+ detectores built-in
│   │   │   ├── detector-codigo-fragil.ts
│   │   │   ├── detector-duplicacoes.ts
│   │   │   ├── detector-performance.ts
│   │   │   ├── detector-seguranca.ts
│   │   │   ├── detector-vazamentos-memoria.ts
│   │   │   └── ...
│   │   │
│   │   ├── plugins/              # 18+ plugins multi-linguagem
│   │   │   ├── analista-react.ts
│   │   │   ├── analista-css.ts
│   │   │   ├── analista-html.ts
│   │   │   ├── analista-python.ts
│   │   │   ├── analista-shell.ts
│   │   │   ├── analista-sql.ts
│   │   │   └── ...
│   │   │
│   │   ├── arquitetos/           # Análise arquitetural
│   │   ├── estrategistas/        # Análise estratégica
│   │   ├── pontuadores/          # Sistema de pontuação
│   │   ├── corrections/          # Correções automáticas
│   │   └── registry/             # Sistema de registro
│   │
│   ├── zeladores/                # Executores de ações
│   │   ├── index.ts
│   │   └── zelador-imports.ts
│   │
│   ├── guardian/                 # Monitor de saúde
│   ├── relatorios/               # Geradores de relatórios
│   ├── licensas/                 # Gestão de licenças
│   ├── shared/                   # Código compartilhado
│   ├── types/                    # TypeScript definitions
│   └── node.loader.ts            # ESM loader customizado
│
├── tests/                        # Testes unitários (Vitest)
├── docs/                         # Documentação completa
│   ├── guias/                    # Guias operacionais
│   ├── arquitetura/              # Arquitetura e design
│   ├── desenvolvimento/          # Guias para desenvolvedores
│   ├── referencia/               # Referência técnica
│   ├── exemplos/                 # Casos de uso práticos
│   ├── roadmap/                  # Roadmap do projeto
│   ├── INDICE.md                 # Índice completo navegável
│   └── README.md                 # Overview da documentação
│
├── .github/                      # Configuração CI/CD
├── svg/                          # Badges e assets visuais
├── prometheus.config.json        # Configuração do projeto
├── package.json                  # Metadados e scripts
├── tsconfig.json                 # Configuração TypeScript
├── vitest.config.ts              # Configuração de testes
├── eslint.config.js              # Configuração ESLint
└── README.md                     # Este arquivo
```

### Parsers e Linguagens Suportadas

| Linguagem   | Parser          | Status                       |
| ----------- | --------------- | ---------------------------- |
| JavaScript  | Babel           | Nativo                       |
| TypeScript  | Babel           | Nativo                       |
| HTML        | htmlparser2     | Nativo                       |
| CSS         | css-tree        | Nativo                       |
| XML         | fast-xml-parser | Nativo                       |
| Python      | Heurístico      | Nativo                       |
| PHP         | Heurístico      | Nativo                       |
| Shell       | Heurístico      | Plugin                       |
| SQL         | Heurístico      | Plugin                       |
| Java        | java-parser     | Disponível (desabilitado)    |
| Kotlin      | Heurístico      | Disponível (desabilitado)    |

Para detalhes sobre cada diretório, veja [Estrutura de Código](./docs/desenvolvimento/estrutura-codigo/README.md).

---

## ‍ Desenvolvimento

### Setup para Desenvolvimento

```bash
# 1. Clone o repositório
git clone https://github.com/5-5-5-5-5-5-5/prometheus.git
cd prometheus

# 2. Instale dependências
npm install

# 3. Build e Link global
npm run build
npm link

# 4. Teste
prometheus --version
```

### Scripts Disponíveis

#### Build e Desenvolvimento

```bash
npm run build          # Compilar TypeScript (limpa dist/ antes)
npm run typecheck      # Verificação de tipos sem compilar
npm run lint           # ESLint com auto-fix
npm run test           # Rodar testes (Vitest)
npm run test:watch     # Testes em modo watch
npm run coverage       # Testes com relatório de cobertura
```

#### Execução do Prometheus

```bash
npm start              # Executar Prometheus
npm run diagnosticar   # Análise do projeto
npm run diagnosticar:json  # Análise com saída JSON
npm run formatar       # Formatar código automaticamente
npm run reestruturar   # Reorganizar estrutura
npm run podar          # Poda de código morto
npm run fix-types      # Corrigir tipos inseguros
npm run guardian       # Executar Guardian
```

#### Métricas e Performance

```bash
npm run metricas       # Ver histórico de métricas
npm run perf:baseline  # Criar baseline de performance
npm run perf:compare   # Comparar com baseline
npm run perf:gate      # Gate de performance (threshold 0)
```

#### Licenças e Compliance

```bash
npm run scan           # Scan de licenças de dependências
npm run scan:root      # Scan a partir da raiz
npm run add            # Adicionar disclaimer de licença
npm run notices        # Gerar THIRD-PARTY-NOTICES.txt
npm run verify         # Verificar disclaimers
```

#### Nomes e Renomeação

```bash
npm run name           # Extrair nomes de variáveis
npm run rename         # Aplicar renomeações
```

### Verificar Qualidade do Código

```bash
# Executar análise completa do projeto
npm run diagnosticar

# Verificação de tipos
npm run typecheck

# Lint e formatação
npm run lint

# Testes unitários
npm run test

# Cobertura de testes
npm run coverage

# Gate de performance (antes de commit)
npm run perf:gate
```

### Padrões de Desenvolvimento

Ao contribuir, siga os padrões em [PADROES.md](./docs/desenvolvimento/PADROES.md):

- TypeScript type-safe (sem `any` ou `unknown` sem necessidade)
- Nomes descritivos em camelCase/PascalCase
- JSDoc para funções públicas e APIs
- Testes com cobertura > 80%
- Sem console.log em produção (use sistema de mensagens)
- Imports organizados e ordenados
- Padrões arquiteturais (Registry, Strategy, Singleton)

---

##  Desenvolvimento & Contribuição

Prometheus é um projeto open-source e recebe contribuições de toda a comunidade.

### Como Contribuir

1. **Leia** [CONTRIBUTING.md](./CONTRIBUTING.md)
2. **Fork** o repositório
3. **Cria branch** para sua feature (`git checkout -b feature/sua-feature`)
4. **Commit** mudanças (`git commit -m 'Add: sua feature'`)
5. **Push** para os branches (`git push origin feature/sua-feature`)
6. **Abra Pull Request**

### Tipos de Contribuição

- **Bug fixes** - Reportar e corrigir bugs
- **Novas features** - Analistas, comandos, melhorias
- **Documentação** - Guias, exemplos, explanação
- **Testes** - Aumentar cobertura
- **Padrões** - Melhorias de qualidade

### Criando um Novo Analista ou Detector

A contribuição mais comum e valiosa é criar novos analisadores:

```bash
# 1. Crie o arquivo do detector em src/analistas/detectores/
# ou plugin em src/analistas/plugins/
# Exemplo: src/analistas/detectores/detector-meu-analista.ts

# 2. Implemente seguindo o guia:
# Veja [CRIAR-ANALISTA.md](./docs/desenvolvimento/analistas/CRIAR-ANALISTA.md)

# 3. Adicione testes
# tests/analistas/detector-meu-analista.test.ts

# 4. Registro é automático via autodiscovery
# Plugins com prefixo "analista-" ou "detector-" são descobertos automaticamente

# 5. Teste seu analista
npm run test
npm run diagnosticar
```

### Recursos para Desenvolvedores

- [Como Criar Analistas](./docs/desenvolvimento/analistas/CRIAR-ANALISTA.md) - Guia com 6 passos
- [Estrutura de Código](./docs/desenvolvimento/estrutura-codigo/README.md) - Mapa do src/
- [Padrões de Desenvolvimento](./docs/desenvolvimento/PADROES.md) - Convenções
- [Sistema de Plugins](./docs/desenvolvimento/SISTEMA-PLUGINS.md) - Como estender

---

##  Suporte

### Documentação

- [Documentação Completa](./docs/)
- [Guia de Início Rápido](./docs/guias/GUIA-INICIO-RAPIDO.md)
- [Exemplos de Uso](./docs/exemplos/EXEMPLOS-USO.md)
- [Arquitetura](./docs/arquitetura/ARVORE-ARQUITETURAL.md)

### Comunidade

- [Reportar Bug](https://github.com/5-5-5-5-5-5-5/prometheus/issues)
- [Solicitar Feature](https://github.com/5-5-5-5-5-5-5/prometheus/issues/new?labels=enhancement)
- [Discussões](https://github.com/5-5-5-5-5-5-5/prometheus/discussions)
- [Contribuir](./CONTRIBUTING.md)

### Links Importantes

| Link                                                                | Descrição        |
| ------------------------------------------------------------------- | ---------------- |
| [ npm Package](https://www.npmjs.com/package/prometheus)            | Instalar via npm |
| [ GitHub Repository](https://github.com/5-5-5-5-5-5-5/prometheus)   | Código-fonte     |
| [ Issues](https://github.com/5-5-5-5-5-5-5/prometheus/issues)       | Reportar bugs    |
| [ Releases](https://github.com/5-5-5-5-5-5-5/prometheus/releases)   | Versões          |
| [ License](./LICENSE)                                               | MIT-0            |

---

##  Roadmap & Versioning

### Versioning

Prometheus segue [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes (v1.0.0, v2.0.0)
- **MINOR**: Novas features compatíveis (v0.4.0, v0.5.0)
- **PATCH**: Bug fixes e melhorias (v0.4.1, v0.4.2)

### Histórico de Versões

- **v0.4.3** (Atual) - Estabilidade, correções de bugs, melhorias de performance
- **v0.4.2** - Melhorias de estabilidade e documentação
- **v0.4.1** - Correções de bugs
- **v0.4.0** - Refinamento de tipos e robustez
- **v0.3.9** - Gerenciamento de nomes (names/rename), segurança de tipagem
- **v0.3.6** - Extração avançada de sinais, validações aprimoradas
- **v0.3.0** - Novos comandos, plugins multi-linguagem, Node.js 24+
- **v0.2.0** - Worker Pool, Schema Versioning, Pontuação Adaptativa
- **v0.1.0** - Lançamento inicial

### Roadmap Futuro

- **v0.5.0** - Sistema extensível de analistas completo, APIs públicas
- **v0.6.0** - Dashboard Web para visualização de relatórios
- **v0.7.0** - Análise assistida por IA
- **v1.0.0** - Estabilidade completa e API pública consolidada

 Veja [ROADMAP.md](./docs/roadmap/ROADMAP.md) para detalhes completos.

---

##  Verificação de Qualidade

O Prometheus é mantido em altos padrões de qualidade:

- TypeScript 6.0+ (type-safe, sem `any` desnecessários)
- Testes com Vitest (cobertura target: 80%+)
- ESLint 9.x + configuração strict
- Worker Pool para processamento paralelo
- Schema Versioning em relatórios JSON
- Pontuação Adaptativa baseada no tamanho do projeto
- Sistema i18n (PT, EN, ZH, JA)
- Segurança auditada (CodeQL, path traversal protection)
- Performance benchmarked (snapshots e gates)
- Sem dependências externas desnecessárias

### Dependências Principais

| Dependência     | Uso                   | Versão   |
| --------------- | --------------------- | -------- |
| @babel/parser   | Parsing JS/TS         | ^7.29.2  |
| commander       | CLI framework         | ^14.0.3  |
| chalk           | Terminal colorido     | ^5.6.2   |
| micromatch      | Pattern matching      | ^4.0.8   |
| css-tree        | Parsing CSS           | ^3.2.1   |
| htmlparser2     | Parsing HTML          | ^12.0.0  |
| fast-xml-parser | Parsing XML           | ^5.5.11  |
| java-parser     | Parsing Java          | ^3.0.1   |
| ora             | Spinners de progresso | ^9.3.0   |
| vitest          | Framework de testes   | ^4.1.4   |

---

##  Licença & Atribuição

Prometheus é licenciado sob **MIT-0** (veja [LICENSE](./LICENSE)).

- Sem restrições de uso, modificação ou distribuição
- Sem atribuição necessária (mas apreciada!)
- Sem garantias (use por sua conta e risco)

Dependências de terceiros listadas em [THIRD-PARTY-NOTICES.txt](./THIRD-PARTY-NOTICES.txt).

---

<div align="center">

**Feito com ‍🩹 para os iniciantes**

[ Topo](#prometheus)
