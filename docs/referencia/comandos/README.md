---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
---


# Referência de Comandos - Prometheus 📖

Guia completo e detalhado de todos os comandos disponíveis no Prometheus.

---

## 📋 Sumário de Comandos

| Comando             | Descrição                           | Categoria       |
| ------------------- | ----------------------------------- | --------------- |
| `diagnosticar`      | Análise completa do projeto         | Principal       |
| `guardian`          | Monitor de integridade estrutural   | Monitoramento   |
| `formatar`          | Formatação de código                | Manutenção      |
| `otimizar-svg`      | Otimização de arquivos SVG          | Manutenção      |
| `podar`             | Remoção de código morto             | Limpeza         |
| `reestruturar`      | Reestruturação inteligente          | Refatoração     |
| `atualizar`         | Atualização de padrões e estruturas | Manutenção      |
| `analistas`         | Listar e gerenciar analistas        | Consulta        |
| `metricas`          | Exibir métricas do projeto          | Consulta        |
| `fix-types`         | Correção de tipos inseguros         | Correção        |
| `licencas`          | Gestão de licenças de dependências  | Compliance      |
| `names`             | Extração de nomes de variáveis      | Mapeamento      |
| `rename`            | Renomeação em massa de variáveis    | Refatoração     |
| `reverter`          | Reversão de renomeações             | Reversão        |
| `perf`              | Benchmark de performance da CLI     | Performance     |
| `dashboard`         | Iniciar dashboard web interativo    | Visualização    |
| `plugins`           | Gerenciar plugins de análise        | Extensões       |

---

## 🔍 `prometheus diagnosticar`

Comando principal - analisa o projeto inteiro.

### Sintaxe

```bash
prometheus diagnosticar [opções]
```

### Opções

| Opção             | Tipo     | Padrão                    | Descrição                           |
| ----------------- | -------- | ------------------------- | ----------------------------------- | ---- | ------ | -------------------- |
| `--caminho`       | string   | `.`                       | Diretório raiz para análise         |
| `--profundidade`  | number   | Infinito                  | Profundidade máxima de diretórios   |
| `--extensoes`     | string[] | `ts,js,jsx,tsx`           | Extensões de arquivo                |
| `--excluir`       | string[] | `node_modules,dist,build` | Diretórios para ignorar             |
| `--analista`      | string[] | Todos                     | Analistas específicos a rodar       |
| `--relatorio`     | `json\   | markdown\                 | html\                               | csv` | `json` | Formato do relatório |
| `--saida`         | string   | `stdout`                  | Arquivo de saída                    |
| `--verbose`       | boolean  | `false`                   | Modo verbose (mais detalhes)        |
| `--debug`         | boolean  | `false`                   | Modo debug (muito detalhe)          |
| `--paralelo`      | number   | `4`                       | Workers paralelos                   |
| `--pode-corrigir` | boolean  | `false`                   | Mostrar O QUE PODERIA ser corrigido |
| `--cache`         | boolean  | `true`                    | Usar cache de análise               |

### Exemplos

```bash
# Análise básica
prometheus diagnosticar

# Apenas TypeScript
prometheus diagnosticar --extensoes ts

# Análise com saída JSON
prometheus diagnosticar --relatorio json --saida analise.json

# Verbose para debugging
prometheus diagnosticar --verbose

# Analistas específicos
prometheus diagnosticar --analista CodigoFragil --analista CodigoMorto

# Excluir diretórios extras
prometheus diagnosticar --excluir node_modules --excluir .git --excluir dist

# Análise paralela com 8 workers
prometheus diagnosticar --paralelo 8

# Mostrar o que PODERIA ser corrigido
prometheus diagnosticar --pode-corrigir
```

### Output Exemplo

```json
{
  "projeto": {
    "nome": "meu-projeto",
    "caminho": ".",
    "arquivos": {
      "total": 45,
      "analisados": 45,
      "pulados": 0
    },
    "linhas": 12500
  },
  "analistas": [
    {
      "nome": "CodigoFragil",
      "status": "sucesso",
      "ocorrencias": 12,
      "tempo": "245ms"
    }
  ],
  "resumo": {
    "totalProblemas": 47,
    "gravidade": {
      "critic": 3,
      "major": 15,
      "minor": 29
    }
  },
  "tempo_total": "2.3s"
}
```

---

## ✅ `prometheus corrigir`

Auto-fix automático de problemas.

### Sintaxe

```bash
prometheus corrigir [opções]
```

### Opções

| Opção       | Tipo    | Padrão   | Descrição                         |
| ----------- | ------- | -------- | --------------------------------- |
| `--auto`    | boolean | `false`  | Aplicar correções automaticamente |
| `--revisar` | boolean | `false`  | Revisar antes de aplicar          |
| `--tipo`    | string  | Todos    | Tipo específico para corrigir     |
| `--arquivo` | string  | Todos    | Arquivo específico                |
| `--backup`  | boolean | `true`   | Criar backup antes                |
| `--dry-run` | boolean | `false`  | Simular sem aplicar               |

### Exemplos

```bash
# Ver o que pode ser corrigido
prometheus corrigir

# Aplicar todas as correções
prometheus corrigir --auto

# Revisar antes de aplicar
prometheus corrigir --revisar

# Corrigir apenas variáveis não usadas
prometheus corrigir --tipo variavel-nao-usada --auto

# Dry-run: simular sem aplicar
prometheus corrigir --dry-run

# Apenas um arquivo
prometheus corrigir --arquivo src/main.ts --auto

# Sem backup (cuidado!)
prometheus corrigir --auto --backup false
```

### Output

```
✓ Corrigido: src/api/handler.ts
  - Variável 'temp' removida (linha 12)
  - 2 console.log removidos (linhas 45, 67)

✓ Corrigido: src/utils/parser.ts
  - 3 espaços em branco limpos

✗ Falha: src/config.ts (requer revisão manual)
  - Função muito longa (89 linhas)

Resumo: 23 arquivos corrigidos, 2 falhas
```

---

## 👮 `prometheus guardian`

Monitor contínuo de saúde do projeto.

### Sintaxe

```bash
prometheus guardian [subcomando] [opções]
```

### Subcomandos

#### `prometheus guardian --baseline`

Estabelecer baseline (snapshot inicial):

```bash
prometheus guardian --baseline
# Cria .prometheus-baseline.json

prometheus guardian --baseline --arquivo custom-baseline.json
```

#### `prometheus guardian --verificar`

Verificar mudanças desde baseline:

```bash
prometheus guardian --verificar

# Com arquivo custom
prometheus guardian --verificar --arquivo baseline.json

# Modo verbose
prometheus guardian --verificar --verbose
```

#### `prometheus guardian --monitorar`

Monitorar continuamente (watch mode):

```bash
prometheus guardian --monitorar

# Intervalo customizado (segundos)
prometheus guardian --monitorar --intervalo 30

# Parar com Ctrl+C
```

#### `prometheus guardian --confirmar`

Confirmar mudanças e atualizar baseline:

```bash
prometheus guardian --confirmar

# Com arquivo custom
prometheus guardian --confirmar --arquivo baseline.json
```

### Exemplo de Workflow

```bash
# 1. Estabelecer baseline
prometheus guardian --baseline

# 2. Fazer mudanças no código
# ... editar arquivos ...

# 3. Verificar o que mudou
prometheus guardian --verificar

# 4. Se OK, confirmar
prometheus guardian --confirmar

# 5. Monitorar durante desenvolvimento
prometheus guardian --monitorar
```

### Arquivo Baseline

```json
{
  "timestamp": "2026-02-15T10:30:00Z",
  "projeto": "meu-projeto",
  "metrics": {
    "total_arquivos": 45,
    "total_linhas": 12500,
    "total_problemas": 47
  },
  "hashes": {
    "src/main.ts": "abc123def456...",
    "src/api.ts": "ghi789jkl012..."
  }
}
```

---

## 🖥️ `prometheus dashboard`

Iniciar o dashboard web interativo.

### Sintaxe

```bash
prometheus dashboard [opções]
```

### Opções

| Opção        | Tipo   | Padrão | Descrição                        |
| ------------ | ------ | ------ | -------------------------------- |
| `--port`     | number | `3000` | Porta para o servidor web        |

### Exemplos

```bash
prometheus dashboard
prometheus dashboard --port 8080
```

### Funcionalidades do Dashboard

- Visualização de workflows GitHub Actions
- Gráficos de saúde do projeto
- Métricas automáticas (segurança, performance, documentação, arquitetura, qualidade)
- Histórico de tendências
- Ferramentas rápidas (diagnosticar, otimizar SVG)

---

## 🔌 `prometheus plugins`

Gerenciar plugins de análise.

### Sintaxe

```bash
prometheus plugins [subcomando] [opções]
```

### Subcomandos

#### `prometheus plugins listar`

Listar plugins instalados:

```bash
prometheus plugins listar
```

#### `prometheus plugins instalar <nome>`

Instalar um plugin:

```bash
prometheus plugins instalar nome-do-plugin
```

#### `prometheus plugins remover <nome>`

Remover um plugin:

```bash
prometheus plugins remover nome-do-plugin
```

---

## 📝 `prometheus names`

Extrair nomes de variáveis do projeto.

### Sintaxe

```bash
prometheus names [opções]
```

### Opções

| Opção        | Tipo    | Descrição                                |
| ------------ | ------- | ---------------------------------------- |
| `--legacy`   | boolean | Gera também arquivo único names/name.txt |

### Exemplos

```bash
prometheus names
prometheus names --legacy
```

---

## ✏️ `prometheus rename`

Aplicar renomeações de variáveis em massa.

### Sintaxe

```bash
prometheus rename [opções]
```

### Exemplos

```bash
prometheus rename
```

---

## ↩️ `prometheus reverter`

Reverter renomeações aplicadas.

### Sintaxe

```bash
prometheus reverter [opções]
```

### Exemplos

```bash
prometheus reverter
```

---

## 📚 `prometheus analista`

Informações sobre analistas disponíveis.

### Subcomandos

#### `prometheus analista --listar`

Listar todos os analistas:

```bash
prometheus analista --listar

# Output:
# CodigoFragil      - Detecta código frágil (ts, js)
# CodigoMorto       - Identifica código morto (ts, js)
# Duplicacao        - Encontra duplicação (ts, js, python)
# ...
```

#### `prometheus analista --info NOME`

Informações detalhadas:

```bash
prometheus analista --info CodigoFragil

# Output:
# Nome: CodigoFragil
# Descrição: Detecta padrões de código frágil
# Linguagens: typescript, javascript
# Problemas detectados: 12
# Tempo: 245ms
# Referência: docs/analistas/codigo-fragil.md
```

#### `prometheus analista --status`

Status de todos os analistas:

```bash
prometheus analista --status

# Mostra qual está habilitado/desabilitado
```

#### `prometheus analista --test NOME`

Testar um analista específico:

```bash
prometheus analista --test CodigoFragil

# Executa em arquivo de teste
# Mostra se está funcionando
```

### Opções

```bash
--info              string    Nome do analista
--listar           boolean   Listar todos
--status           boolean   Status de cada um
--test             string    Testar um analista
--arquivo          string    Arquivo para teste
--habilitados      boolean   Apenas habilitados
--linguagem        string    Filtrar por linguagem
```

---

## 🎯 Dicas Úteis

### 1. Pipeline de Análise Completa

```bash
#!/bin/bash

echo "🔍 Iniciando análise completa..."

# 1. Verificar baseline
prometheus guardian --verificar

# 2. Análise detalhada
prometheus diagnosticar --verbose --paralelo 8 --relatorio json --saida analysis.json

# 3. Auto-fix (com revisão)
prometheus corrigir --revisar

# 4. Gerar relatórios
prometheus relatorio arquitetura --saida docs/ARQUITETURA.md
prometheus relatorio padroes --saida docs/PADROES.md

# 5. Confirmar mudanças
prometheus guardian --confirmar

echo "✅ Análise completa finalizada!"
```

### 2. CI/CD Integration

```bash
# Falhar se problemas críticos
prometheus diagnosticar --analista-critico > /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Problemas críticos encontrados"
  exit 1
fi

echo "✅ CI Check passou"
```

### 3. Pre-commit Hook

```bash
#!/bin/bash
prometheus diagnosticar --arquivo . --tipo critic
exit $?
```

### 4. Monitoramento Automatizado

```bash
# Cron job (diária)
0 2 * * * prometheus diagnosticar --relatorio json --saida ~/prometheus-daily.json
```

---

## 🚨 Troubleshooting

### Comando não encontrado

```bash
# Verificar instalação
which prometheus
npm list -g prometheus

# Reinstalar
npm install -g prometheus
```

### Config não carregada

```bash
# Validar config
prometheus config --validar

# Resetar
prometheus config --reset --force
```

### Análise muito lenta

```bash
# Aumentar workers
prometheus diagnosticar --paralelo 8

# Reduzir escopo
prometheus diagnosticar --caminho src --profundidade 3
```

### Saída truncada

```bash
# Redirecionar para arquivo
prometheus diagnosticar --relatorio json --saida output.json

# Ou usar less
prometheus diagnosticar | less
```

---

## 📚 Referências

- [Exemplos de Uso](../exemplos/EXEMPLOS-USO.md)
- [Documentação Completa](../INDICE.md)
- [Criar Analista](../desenvolvimento/analistas/CRIAR-ANALISTA.md)
