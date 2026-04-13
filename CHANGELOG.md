---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
---


# Changelog

Todas as mudanças notáveis deste repositório serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.6.0] - 2026-04-13

### Adicionado

- **Dashboard Web Interativo**:
  - Novo comando `prometheus dashboard` para iniciar interface web completa
  - Visualização de workflows GitHub Actions com análise em tempo real
  - Gráficos de saúde do projeto com métricas reais (segurança, performance, documentação, arquitetura, qualidade)
  - Representação visual de workflows com diagramas Mermaid
  - Sistema de notificações toast para feedback ao usuário
  - Loading states e tratamento de erros aprimorado

- **Métricas Automáticas do Projeto**:
  - Cálculo automático de scores baseado na estrutura real do projeto
  - Histórico de tendências com dados persistentes
  - Barra de progresso do Guardian com indicadores visuais dinâmicos
  - Cards informativos: segurança, performance, boas práticas, documentação

- **Melhorias de UX do Dashboard**:
  - Tooltips explicativos em todos os cards e métricas
  - Feedback visual durante carregamento de dados
  - Grafo Mermaid gerado dinamicamente baseado nos jobs do workflow
  - Interface responsiva para mobile e tablet

### Melhorado

- **API REST**:
  - Endpoint `/api/v1/repositorio/status` agora retorna métricas reais calculadas automaticamente
  - Endpoint `/api/v1/repositorio/metricas` para histórico de tendências
  - Melhor tratamento de erros HTTP em todos os endpoints

### Corrigido

- Dados mockados do radar chart substituídos por métricas reais do projeto
- Renderização do grafo Mermaid agora reflete jobs reais do workflow analisado
- Estados de loading e empty state em todas as views do dashboard

## [0.5.0] - 2026-03-15

### Adicionado

- Sistema de plugins para GitHub Actions com detecção de segurança e boas práticas
- Análise avançada de workflows com detecção de anti-padrões
- Integração com SDK para análise programática

### Melhorado

- Performance do scanner de arquivos otimizada com processamento paralelo
- Precisão dos detectores de código frágil e vazamentos de memória

## [0.4.3] - 2026-02-20

### Adicionado

- **Gerenciamento de Nomes de Variáveis**:
  - Novo comando `names`: Varre o projeto e extrai nomes de variáveis para mapeamento em `names/name.txt`.
  - Novo comando `rename`: Aplica renomeações de variáveis em massa baseadas no arquivo de mapeamento.
  - Script automatizado para sugestão de traduções (Português) para nomes de variáveis.

### Alterado

- **Segurança de Tipagem**:
  - Refinamento massivo de tipos `any` e `unknown` em todo o core e CLI via `fix-types`.
  - Melhoria na inferência de tipos em callbacks assíncronos e interfaces de plugins.
- **Robustez do Renomeador**:
  - Implementação de lista de nomes protegidos para evitar renomeação acidental de propriedades nativas (Node.js/JS).
  - Ajuste no gerador de código para evitar erros de sintaxe em casts do TypeScript.

### Corrigido

- **Erros de Compilação**: Correção de erros de sintaxe gerados pelo Babel em `analista-html.ts`, `detector-markdown.ts` e `processamento-diagnostico.ts`.
- **CLI**: Resolução do erro `ERR_INVALID_MODULE_SPECIFIER` na execução global do pacote via ESM loader.

## [0.3.9] - 2026-02-19

### Adicionado

- **Gerenciamento de Nomes de Variáveis**:
  - Novo comando `names`: Varre o projeto e extrai nomes de variáveis para mapeamento em `names/name.txt`.
  - Novo comando `rename`: Aplica renomeações de variáveis em massa baseadas no arquivo de mapeamento.
  - Script automatizado para sugestão de traduções (Português) para nomes de variáveis.

### Alterado

- **Segurança de Tipagem**:
  - Refinamento massivo de tipos `any` e `unknown` em todo o core e CLI via `fix-types`.
  - Melhoria na inferência de tipos em callbacks assíncronos e interfaces de plugins.
- **Robustez do Renomeador**:
  - Implementação de lista de nomes protegidos para evitar renomeação acidental de propriedades nativas (Node.js/JS).
  - Ajuste no gerador de código para evitar erros de sintaxe em casts do TypeScript.

### Corrigido

- **Erros de Compilação**: Correção de erros de sintaxe gerados pelo Babel em `analista-html.ts`, `detector-markdown.ts` e `processamento-diagnostico.ts`.
- **CLI**: Resolução do erro `ERR_INVALID_MODULE_SPECIFIER` na execução global do pacote via ESM loader.

## [0.3.8] - 2026-02-18

### Adicionado

- **Manutenção**: Documentação e CHANGELOG atualizados para refletir o estado real do projeto.
- **Refatoração**: Pequenas melhorias e correções de bugs.

## [0.3.6] - 2026-01-23

### Adicionado

- **Extração Avançada de Sinais**: Sistema inteligente de análise de sinais do projeto para reestruturação mais precisa
  - Detecção de padrões arquiteturais e tecnologias dominantes
  - Análise de complexidade estrutural para decisões estratégicas
  - Ajuste contextual de destinos baseado em sinais detectados
  - Integração com `OperarioEstrutura` para planejamento estratégico aprimorado

- **Validações Aprimoradas**: Melhorias em plugins de análise para CSS, HTML e XML
  - Validações de qualidade de código e acessibilidade
  - Verificações de segurança aprimoradas
  - Mensagens de validação expandidas

- **Sistema de Pontuação Contextual**: Mecanismo de pontuação que considera sinais avançados
  - Ajustes contextuais baseados na análise de projeto
  - Pontuação mais precisa para diferentes tipos de projeto

### Alterado

- **Configuração Lint-Staged**: Otimização da configuração para melhor legibilidade e performance
- **Mapeamento de Reversão**: Melhorias na organização de importações e consistência

### Corrigido

- **Segurança HTML**: Correção de expressão regular vulnerável na filtragem HTML (Code Scanning Alert #47)
- **Validações de Segurança**: Reforço das verificações de segurança em análise de HTML

### Interno

- **Tipos Expandidos**: Novos campos em `SinaisProjetoAvancados` para detecção de padrões e tecnologias
- **Mensagens de Plugin**: Expansão das mensagens de validação para melhor feedback

## [0.3.5] - 2026-01-23

## [0.3.4] - 2026-01-23

### Adicionado

- **Manutenção**: Documentação e CHANGELOG atualizados para refletir o estado real do projeto.
- **Refatoração**: Pequenas melhorias e correções de bugs.

## [0.3.3] - 2026-01-21

### Adicionado

- Melhoria na estabilidade da saída JSON do comando `diagnosticar` para integração em CI.
- Testes adicionais e validações em analistas que processam arquivos Markdown.

### Alterado

- Redução de falsos positivos em deteções de async não tratado em fluxos assíncronos.

### Corrigido

- Tratamento de erros assíncronos em `mapa-reversao` e correções menores em logs e mensagens.

## [0.3.2] - 2026-01-19

### Adicionado

- Script `md:add-disclaimer` para inserir aviso de proveniência em arquivos Markdown.
- Utilitários de manutenção para geração e verificação de relatórios.

### Alterado

- Melhorias na geração de relatórios e pequenas otimizações de performance.

### Corrigido

- Ajustes em documentação e comentários internos; correções de pequenos bugs em scripts.

## [0.3.1] - 2026-01-17

### Adicionado

- Baseline de testes e ajustes iniciais na configuração do CI para validação de analistas.

### Corrigido

- Correções em flags do CLI (`--export`, `--json`) e comportamento de exportação de relatórios.

## [0.3.0] - 2026-01-15

### Adicionado

- **Novos Comandos CLI**:
  - `formatar` — Aplica formatação estilo Prometheus (whitespace, seções, finais de linha) com suporte a Prettier
  - `otimizar-svg` — Otimiza SVGs do projeto usando otimizador interno (svgo-like)
  - `atualizar` — Atualiza o Prometheus verificando integridade via Guardian antes
  - `reverter` — Gerencia mapa de reversão para moves aplicados (listar, arquivo, move, limpar)

- **Novos Analistas e Detectores**:
  - `detector-arquitetura` — Análise de padrões arquiteturais
  - `detector-codigo-fragil` — Identifica código frágil e propenso a bugs
  - `detector-construcoes-sintaticas` — Detecta construções sintáticas problemáticas
  - `detector-duplicacoes` — Identifica código duplicado
  - `detector-interfaces-inline` — Detecta interfaces inline que deveriam ser extraídas
  - `detector-contexto-inteligente` — Análise contextual avançada
  - `detector-fantasmas` — Detecta arquivos órfãos e não utilizados
  - `detector-performance` — Identifica problemas de performance

- **Plugins Multi-linguagem**:
  - `analista-react` e `analista-react-hooks` — Análise específica para React
  - `analista-tailwind` — Análise de classes Tailwind
  - `analista-css` e `analista-css-in-js` — Análise de estilos
  - `analista-html` e `analista-xml` — Análise de markup
  - `analista-svg` — Análise e otimização de SVGs
  - `analista-python` — Suporte heurístico para Python
  - `detector-markdown` — Validação de arquivos Markdown
  - `detector-documentacao` — Análise de qualidade de documentação

- **Sistema de Supressão Inline**: `@prometheus-disable-next-line <regra>` funciona para todos os analistas

- **Modos de Execução Expandidos**:
  - `--executive` — Modo executivo (apenas problemas críticos/alta prioridade)
  - `--compact` — Modo compacto (consolida progresso e mostra o essencial)
  - `--trust-compiler` — Confia no compilador para reduzir falsos positivos

- **Suporte a Mais Linguagens**: PHP, Python (heurístico)

### Alterado

- **Node.js 24+**: Agora requer Node.js >= 24.0.4
- **Refatoração do Sistema de Mensagens**: Mensagens centralizadas por domínio
- **Melhoria no Sistema de Pontuação**: Ajustes contextuais mais precisos
- **Guardian**: Integração mais profunda com comandos de atualização

### Corrigido

- Normalização de line endings para compatibilidade Windows/Linux
- Falsos positivos em detecção de segredos em arquivos de documentação
- Tratamento de placeholders em strings de configuração

### Removido

- Dependência circular interna em `prometheus: file:prometheus-0.3.0.tgz` (problema de empacotamento)

---

## [0.2.0] - 2025-08-28

### Adicionado

- **Pool de Workers**: Sistema completo de paralelização por arquivo para melhorar performance em projetos grandes
  - Classe WorkerPool com gerenciamento de workers paralelos
  - Sistema de lotes configurável (batchSize padrão: 10 arquivos por worker)
  - Timeout individual por analista (30s padrão) com cancelamento automático
  - Fallback automático para processamento sequencial quando workers desabilitados
  - Worker executor em JavaScript puro para threads separadas
  - Configuração centralizada via variáveis de ambiente
  - Função de conveniência `processarComWorkers()` para fácil integração
  - Estatísticas detalhadas do pool (workers ativos, erros, duração)
  - Testes completos com 9 cenários cobrindo configuração e processamento

- **Sistema de Schema Versioning**: Versionamento completo dos relatórios JSON
  - Metadados de versão (`_schema`) em todos os relatórios JSON
  - Validação automática de schema com compatibilidade backward
  - Migração automática de relatórios legados
  - Utilitários para leitura de relatórios versionados
  - Integração com `gerador-relatorio.ts` e `relatorio-arquetipos.ts`
  - Testes completos (27 testes passando)

- **Sistema de Pontuação Adaptativa**: Pontuação inteligente baseada no tamanho do projeto
  - Constantes adaptativas baseadas em número de arquivos e diretórios
  - Sistema de fatores escaláveis (1x a 5x) para diferentes tamanhos de projeto
  - Configuração centralizada em `configuracao-pontuacao.ts` com 3 modos
  - Pesos de arquétipo recalibrados para maior realismo
  - Sistema de confiança inteligente com ajustes contextuais

- **Correção Crítica**: Exclusão padrão de `node_modules` no comando `diagnosticar`
  - Aplicação automática de padrões de exclusão padrão quando nenhum filtro é especificado
  - Redução de ~70% nos arquivos escaneados (2111 → 633 arquivos)
  - Manutenção da compatibilidade com filtros explícitos
  - Validação através de testes específicos

### Alterado

- **Correção de Exclusão Padrão**: Comando `diagnosticar` agora aplica corretamente padrões de exclusão padrão (`node_modules/**`, `dist/**`, `coverage/**`, etc.) quando nenhum filtro explícito é fornecido
- **Timeout por Analista**: Implementado timeout individual de 30 segundos por analista com cancelamento automático

### Corrigido

- **Problema de Exclusão**: Correção crítica onde `node_modules` era escaneado mesmo sem filtros explícitos devido a configuração vazia de `CLI_EXCLUDE_PATTERNS`

## [0.1.0] - 2025-08-18

### Adicionado

- CLI inicial com comandos: `diagnosticar`, `guardian`, `podar`, `analistas`, `perf`.
- Biblioteca inicial de analistas (padrões de uso, funções longas, TODOs, estrutura, dependências).
- Guardian com baseline e diffs; saída `--json`.

### Infra

- CI: lint, typecheck, testes, cobertura e gates.
- Licenças e avisos de terceiros; scripts utilitários.

---
