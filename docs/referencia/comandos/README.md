---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
---


# Referência de Comandos - Prometheus

Guia completo e detalhado de todos os comandos disponíveis no Prometheus.

---

##  Sumário de Comandos

| Comando             | Descrição                              | Categoria       |
| ------------------- | -------------------------------------- | --------------- |
| `diagnosticar`      | Análise completa do projeto            | Principal       |
| `guardian`          | Monitor de integridade estrutural      | Monitoramento   |
| `formatar`          | Formatação de código                   | Manutenção      |
| `otimizar-svg`      | Otimização de arquivos SVG             | Manutenção      |
| `podar`             | Remoção de código morto                | Limpeza         |
| `reestruturar`      | Reestruturação inteligente             | Refatoração     |
| `atualizar`         | Atualização de padrões e estruturas    | Manutenção      |
| `analistas`         | Listar e gerenciar analistas           | Consulta        |
| `metricas`          | Exibir métricas do projeto             | Consulta        |
| `fix-types`         | Correção de tipos inseguros            | Correção        |
| `licencas`          | Gestão de licenças de dependências     | Compliance      |
| `names`             | Extração de nomes de variáveis         | Mapeamento      |
| `rename`            | Renomeação em massa de variáveis       | Refatoração     |
| `reverter`          | Reversão de renomeações                | Reversão        |
| `perf`              | Benchmark de performance da CLI        | Performance     |
| `ignore`            | Gera .gitignore baseado em tecnologias | Utilitário      |
| `importer`          | Analisa imports e path aliases         | Análise         |
| `padronizador`      | Escaneia e aplica padrões de código    | Refatoração     |

| `plugins` | Gerenciar plugins de análise | Extensões |

---

##  `prometheus diagnosticar`

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

##  `prometheus guardian`

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


##  `prometheus plugins`

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

##  `prometheus ignore`

Gera um arquivo `.gitignore` completo baseado nas tecnologias detectadas no projeto.

### Sintaxe

```bash
prometheus ignore [opções]
```

### Opções

| Opção             | Tipo    | Padrão       | Descrição                                   |
| ----------------- | ------- | ------------ | ------------------------------------------- |
| `-o, --output`    | string  | `.gitignore` | Caminho do arquivo .gitignore               |
| `-a, --all`       | boolean | `false`      | Inclui TODOS os padrões, sem detecção       |
| `-f, --force`     | boolean | `false`      | Sobrescreve arquivo existente sem confirmar |

### Exemplos

```bash
# Gera .gitignore com detecção automática
prometheus ignore

# Define caminho customizado
prometheus ignore -o .gitignore-personalizado

# Inclui todos os padrões possíveis
prometheus ignore --all

# Sobrescreve sem confirmar
prometheus ignore --force
```

---

##  `prometheus importer`

Analisa imports e path aliases do projeto TypeScript/JavaScript.

### Sintaxe

```bash
prometheus importer [opções]
```

### Opções

| Opção            | Tipo    | Padrão   | Descrição                            |
| ---------------- | ------- | -------- | ------------------------------------ |
| `--verbose`      | boolean | `false`  | Exibe detalhes dos imports           |
| `--output`       | string  | -        | Arquivo de saída JSON                |
| `--only-missing` | boolean | `false`  | Mostra apenas imports não resolvidos |

### Exemplos

```bash
# Análise básica
prometheus importer

# Com detalhes
prometheus importer --verbose

# Exportar para JSON
prometheus importer --output imports.json

# Apenas imports não resolvidos
prometheus importer --only-missing
```

### Output Exemplo

```json
{
  "totalImports": 156,
  "resolved": 148,
  "unresolved": 8,
  "aliases": {
    "@core": "./src/core",
    "@shared": "./src/shared"
  }
}
```

---

##  `prometheus padronizador`

Escaneia o código e reporta padrões não padronizados. Pode aplicar correções automáticas.

### Sintaxe

```bash
prometheus padronizador [opções]
```

### Opções

| Opção       | Tipo    | Padrão   | Descrição                           |
| ----------- | ------- | -------- | ----------------------------------- |
| `--scan`    | boolean | `false`  | Apenas escaneia e reporta           |
| `--replace` | boolean | `false`  | Aplica padronização automática      |

### Exemplos

```bash
# Apenas escanear e relatar
prometheus padronizador --scan

# Aplicar correções automáticas
prometheus padronizador --replace
```

---

##  `prometheus names`

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

##  `prometheus rename`

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

## ↩ `prometheus reverter`

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

##  `prometheus analistas`

Lista analistas registrados e seus metadados atuais.

### Sintaxe

```bash
prometheus analistas [opções]
```

### Opções

| Opção          | Tipo    | Descrição                                |
| -------------- | ------- | ---------------------------------------- |
| `-j, --json`   | boolean | Saída em formato JSON                    |
| `-o, --output` | string  | Arquivo para exportar JSON de analistas  |
| `-d, --doc`    | string  | Gera documentação Markdown dos analistas |

### Exemplos

```bash
# Listar todos os analistas
prometheus analysts

# Saída em JSON
prometheus analysts --json

# Exportar para arquivo
prometheus analysts --output analistas.json

# Gerar documentação Markdown
prometheus analysts --doc docs/analistas.md
```

### Output Exemplo

```
┌─────────────────┬──────────────────────────────┬────────┐
│ Analista        │ Descrição                    │ Status │
├─────────────────┼──────────────────────────────┼────────┤
│ CodigoFragil    │ Detecta código frágil        │ ativo  │
│ CodigoMorto     │ Identifica código morto      │ ativo  │
│ Duplicacao      │ Encontra duplicação          │ ativo  │
└─────────────────┴──────────────────────────────┴────────┘
Total: 12 analistas
```

---

##  Dicas Úteis

### 1. Pipeline de Análise Completa

```bash
#!/bin/bash

echo " Iniciando análise completa..."

# 1. Verificar baseline
prometheus guardian --verificar

# 2. Análise detalhada
prometheus diagnosticar --verbose --paralelo 8 --relatorio json --saida analysis.json

# 3. Confirmar mudanças
prometheus guardian --confirmar

echo " Análise completa finalizada!"
```

### 2. CI/CD Integration

```bash
# Falhar se problemas críticos
prometheus diagnosticar --analista-critico > /dev/null
if [ $? -ne 0 ]; then
  echo " Problemas críticos encontrados"
  exit 1
fi

echo " CI Check passou"
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

##  Troubleshooting

### Comando não encontrado

```bash
# Verificar instalação
which prometheus
npm list -g prometheus

# Reinstalar
npm install -g prometheus
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

##  Referências

- [Exemplos de Uso](../exemplos/EXEMPLOS-USO.md)
- [Documentação Completa](../INDICE.md)
- [Criar Analista](../desenvolvimento/analistas/CRIAR-ANALISTA.md)
