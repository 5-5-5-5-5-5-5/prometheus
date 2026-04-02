# 🚀 Guia de Início Rápido do Sensei

> Proveniência e Autoria: Este documento integra o projeto Sensei (licença MIT).
> Última atualização: 15 de janeiro de 2026

---

## O que é o Sensei?

O **Sensei** é uma ferramenta de linha de comando (CLI) para analisar, diagnosticar e manter projetos JavaScript/TypeScript (e com suporte heurístico para outras linguagens). Ele identifica problemas de código, verifica integridade de arquivos e sugere melhorias estruturais.

**Requisitos:** Node.js >=25.0.0

Sugerimos usar um gerenciador de versões (nvm/fnm/volta). Exemplo com nvm:

```bash
nvm install 25
nvm use 25
# Confirme
node --version  # deve ser v25.x
```

O projeto também inclui um arquivo `.nvmrc` com o valor `25`. Ao clonar, execute `nvm use` para ativar automaticamente a versão correta.

---

## Instalação

### Opção 1: Instalação Global (Recomendada)

```bash
# Clone o repositório
git clone https://github.com/ossmoralus/sensei.git
cd sensei

# Instale as dependências e compile
npm install
npm run build

# Link global (permite usar 'sensei' de qualquer diretório)
npm link
```

### Opção 2: Instalação Local

```bash
# No diretório do seu projeto
npm install --save-dev /caminho/para/sensei

# Use via npx
npx sensei diagnosticar
```

### Opção 3: Teste Rápido (sem instalar)

```bash
# Requer Node.js 24+
npx github:ossmoralus/sensei diagnosticar --help
```

---

## Primeiro Diagnóstico

Execute o comando básico no diretório do seu projeto:

```bash
sensei diagnosticar
```

O Sensei irá:

1. 📁 **Varrer** todos os arquivos do projeto
2. 🔍 **Analisar** código em busca de problemas
3. 📊 **Exibir** um resumo com ocorrências encontradas

### Saída Típica

```
✅ Varredura concluída: 120 arquivos em 15 diretórios

📊 Resumo das 25 ocorrências:

  📋 Principais tipos:
     • problemas-teste: 18
     • tipo-inseguro-any: 4
     • problema-documentacao: 3

  📁 Top arquivos:
     • src/services/api.ts (5)
     • src/utils/helpers.ts (3)
     • tests/unit/api.test.ts (2)

✔ Diagnóstico concluído.
```

---

## Comandos Essenciais

### 1. Diagnóstico do Projeto

```bash
# Diagnóstico básico (modo compacto)
sensei diagnosticar

# Diagnóstico detalhado
sensei diagnosticar --full

# Apenas visualizar arquivos (sem análise)
sensei diagnosticar --scan-only
```

### 2. Exportar Resultados

```bash
# Saída JSON para CI/CD
sensei diagnosticar --json

# Exportar relatório para arquivo
sensei diagnosticar --export
```

### 3. Filtrar Análise

```bash
# Analisar apenas pasta src/
sensei diagnosticar --include "src/**"

# Excluir testes
sensei diagnosticar --exclude "**/*.test.ts"

# Combinação
sensei diagnosticar --include "src/**" --exclude "**/*.test.ts"
```

### 4. Correção Automática

```bash
# Correção conservadora (segura)
sensei diagnosticar --auto-fix --auto-fix-mode conservative

# Preview das correções (sem aplicar)
sensei diagnosticar --auto-fix --dry-run
```

### 5. Verificação de Integridade (Guardian)

```bash
# Criar baseline de hashes
sensei guardian

# Verificar alterações
sensei guardian --diff

# Aceitar alterações atuais
sensei guardian --accept
```

---

## Configuração Rápida

### Criar arquivo de configuração

```bash
# Criar sensei.config.json na raiz do projeto
cat > sensei.config.json << 'EOF'
{
  "INCLUDE_EXCLUDE_RULES": {
    "globalExcludeGlob": [
      "node_modules/**",
      "dist/**",
      "coverage/**"
    ]
  },
  "coverageGate": {
    "lines": 80,
    "functions": 80,
    "branches": 75,
    "statements": 80
  }
}
EOF
```

### Suprimir falsos positivos

Use comentários inline para suprimir ocorrências específicas:

```typescript
// @sensei-disable-next-line tipo-inseguro-any
const dados: any = respostaExterna;

// @sensei-disable hardcoded-secrets
const configKey = "chave_configuracao_publica";
```

---

## Opções de Linha de Comando

### Flags Principais

| Flag          | Descrição                           |
| ------------- | ----------------------------------- |
| `--full`      | Modo detalhado com mais informações |
| `--compact`   | Modo compacto (padrão)              |
| `--json`      | Saída em formato JSON               |
| `--export`    | Exportar relatório para arquivo     |
| `--scan-only` | Apenas varrer arquivos, sem análise |

### Filtros

| Flag                 | Descrição                                 |
| -------------------- | ----------------------------------------- |
| `--include "padrão"` | Incluir arquivos que correspondem ao glob |
| `--exclude "padrão"` | Excluir arquivos que correspondem ao glob |
| `--exclude-tests`    | Excluir arquivos de teste                 |

### Correções

| Flag              | Descrição                                      |
| ----------------- | ---------------------------------------------- |
| `--auto-fix`      | Ativar correções automáticas                   |
| `--auto-fix-mode` | Modo: `conservative`, `balanced`, `aggressive` |
| `--dry-run`       | Preview das correções sem aplicar              |

### Níveis de Log

| Flag                | Descrição     |
| ------------------- | ------------- |
| `--log-level info`  | Nível padrão  |
| `--log-level debug` | Mais detalhes |
| `--log-level warn`  | Apenas avisos |
| `--log-level error` | Apenas erros  |

---

## Casos de Uso Comuns

### Integração com CI/CD

```yaml
# .github/workflows/sensei.yml
name: Sensei CI

on: [push, pull_request]

jobs:
  diagnostico:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Instalar Sensei
        run: |
          npm install
          npm run build

      - name: Executar Diagnóstico
        run: npx sensei diagnosticar --json --export
```

### Monorepo

```bash
# Analisar um pacote específico
sensei diagnosticar --include "packages/my-package/**"

# Analisar múltiplos pacotes
sensei diagnosticar \
  --include "packages/core/**" \
  --include "packages/utils/**"
```

### Código Legado

```json
// sensei.config.json
{
  "rules": {
    "tipo-inseguro": {
      "exclude": ["src/legacy/**"]
    }
  }
}
```

---

## Próximos Passos

1. 📖 Leia o [Guia de Comandos](guias/GUIA-COMANDOS.md) completo
2. ⚙️ Configure o [Guia de Configuração](guias/GUIA-CONFIGURACAO.md)
3. 🔒 Entenda a [Segurança](arquitetura/SEGURANCA.md) do sistema
4. 🧪 Explore o [Sistema de Type Safety](arquitetura/TYPE-SAFETY.md)

---

## Ajuda Rápida

```bash
# Ver todos os comandos disponíveis
sensei --help

# Ajuda de um comando específico
sensei diagnosticar --help

# Listar analistas disponíveis
sensei analistas --listar
```

---

## Problemas Comuns

### "Comando não encontrado"

```bash
# Certifique-se de ter feito o link global
npm link

# Ou use npx
npx sensei diagnosticar
```

### "Muitos falsos positivos"

1. Use `--exclude` para filtrar arquivos de teste
2. Configure `testPatterns.allowAnyType: true` para testes
3. Use `// @sensei-disable-next-line` para casos específicos

### "Análise muito lenta"

```bash
# Use modo rápido
sensei diagnosticar --fast

# Limite o escopo
sensei diagnosticar --include "src/**"

# Aumente workers (paralelização)
WORKER_POOL_MAX_WORKERS=4 sensei diagnosticar
```

---

**Versão:** 0.2.0 | **Licença:** MIT
