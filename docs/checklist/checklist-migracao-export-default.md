# Checklist: Migração de export default para export named

## Objetivo
Migrar todos os `export default` para `export named` (export const/function X) para:
- Melhor tree-shaking
- Melhor IDE support
- Consistência com projetos modernos

## Arquivos para migrar (37 total)

### Fase 1: Core Config (3 arquivos)
| # | Arquivo | Padrão Atual | Padrão Novo | Dependências |
|---|--------|-----------|-------------|-------------|
| 1 | `src/core/config/chalk-safe.ts` | `export default chalk;` | `export { chalk };` | ~15 imports |
| 2 | `src/core/config/index.ts` | `export default configDefault;` | `export { configDefault };` | 1 import |
| 3 | `src/core/config/auto/auto-fix-config.ts` | `export default AUTO_CORRECAO...;` | `export { AUTO_CORRECAO... };` | 1 import |

### Fase 2: Shared Plugins (4 arquivos)
| # | Arquivo | Padrão Atual | Padrão Novo | Dependências |
|---|--------|-----------|-------------|-------------|
| 4 | `src/shared/plugins/core-plugin.ts` | `export default corePlugin;` | `export function corePlugin() { return new CorePlugin(); }` | 4 imports |
| 5 | `src/shared/data-processing/index.ts` | `export default dataProcessing;` | `export { dataProcessing };` | N/A |
| 6 | `src/shared/data-processing/fragmentar-relatorio.ts` | `export default fragmentarRelatorio;` | `export { fragmentarRelatorio };` | 1 import |

### Fase 3: Mensagens (9 arquivos - mesma estrutura)
| # | Arquivo | Ação |
|---|--------|------|
| 7 | `src/core/messages/shared/icons.ts` | `export default ICONES` → `export { ICONES }` |
| 8 | `src/core/messages/pt/ui/sugestoes.ts` | `export default SUGESTOES` → `export { SUGESTOES }` |
| 9 | `src/core/messages/pt/core/correcoes-messages.ts` | `export default MENSAGENS_CORRECOES` → `export { MENSAGENS_CORRECOES }` |
| 10 | `src/core/messages/en/ui/sugestoes.ts` | `export default SUGESTOES` → `export { SUGESTOES }` |
| 11 | `src/core/messages/en/core/correcoes-messages.ts` | `export default MENSAGENS_CORRECOES` → `export { MENSAGENS_CORRECOES }` |
| 12 | `src/core/messages/zh/ui/sugestoes.ts` | `export default SUGESTOES` → `export { SUGESTOES }` |
| 13 | `src/core/messages/zh/core/correcoes-messages.ts` | `export default MENSAGENS_CORRECOES` → `export { MENSAGENS_CORRECOES }` |
| 14 | `src/core/messages/ja/ui/sugestoes.ts` | `export default SUGESTOES` → `export { SUGESTOES }` |
| 15 | `src/core/messages/ja/core/correcoes-messages.ts` | `export default MENSAGENS_CORRECOES` → `export { MENSAGENS_CORRECOES }` |

### Fase 4: Analistas Plugins (12 arquivos)
| # | Arquivo | Ação |
|---|--------|------|
| 16 | `src/analistas/plugins/analista-xml.ts` | `export default analistaXml` → `export function analistaXml() { return criarAnalista({...}); }` |
| 17 | `src/analistas/plugins/analista-tailwind.ts` | `export default analistaTailwind` → `export function analistaTailwind() {...}` |
| 18 | `src/analistas/plugins/analista-svg.ts` | `export default analistaSvg` → `export function分析师Svg() {...}` |
| 19 | `src/analistas/plugins/analista-react.ts` | `export default analistaReact` → `export function analistaReact() {...}` |
| 20 | `src/analistas/plugins/analista-python.ts` | `export default analistaPython` → `export function analistaPython() {...}` |
| 21 | `src/analistas/plugins/analista-react-hooks.ts` | `export default analistaReactHooks` → `export function analistaReactHooks() {...}` |
| 22 | `src/analistas/plugins/analista-html.ts` | `export default analistaHtml` → `export function analistaHtml() {...}` |
| 23 | `src/analistas/plugins/analista-shell.ts` | `export default analistaShell` → `export function分析师Shell() {...}` |
| 24 | `src/analistas/plugins/analista-css.ts` | `export default analistaCss` → `export function分析师Css() {...}` |
| 25 | `src/analistas/plugins/analista-formater.ts` | `export default analistaFormatador` → `export function分析师Formatador() {...}` |
| 26 | `src/analistas/plugins/analista-css-in-js.ts` | `export default analistaCssInJs` → `export function分析师CssInJs() {...}` |
| 27 | `src/analistas/plugins/analista-sql.ts` | `export default analistaSql` → `export function分析师Sql() {...}` |

### Fase 5: Analistas Detectores (5 arquivos)
| # | Arquivo | Ação |
|---|--------|------|
| 28 | `src/analistas/detectores/index.ts` | `export default detectores` → `export function detectores() {...}` |
| 29 | `src/analistas/detectores/detector-vazamentos-memoria.ts` | `export default分析师...` → `export function分析师VazamentoMemoria()` |
| 30 | `src/analistas/detectores/detector-anti-padroes-async.ts` | `export default分析师...` → `export function分析师AntiPadroesAsync()` |
| 31 | `src/analistas/detectores/detector-interfaces-inline.ts` | `export default ANALISTA` → `export const ANALISTA = {...}` |
| 32 | `src/analistas/detectores/detector-tipos-inseguros.ts` | `export default ANALISTA` → `export const ANALISTA = {...}` |

### Fase 6: Miscellaneous (5 arquivos)
| # | Arquivo | Ação |
|---|--------|------|
| 33 | `src/analistas/js-ts/analista-todo-comments.ts` | `export default分析师...` → `export function分析师TodoComentarios()` |
| 34 | `src/analistas/corrections/index.ts` | `export default分析师...` → `export function分析师CorrecaoAutomatica()` |
| 35 | `src/licensas/normalizer.ts` | `export default normalizeLicense` → `export { normalizeLicense }` |
| 36 | `src/licensas/generate-notices.ts` | `export default generateNotices` → `export { generateNotices }` |
| 37 | `src/licensas/disclaimer.ts` | `export default disclaimerModule` → `export function disclaimerModule()` |

---

## Como executar cada fase

### Passo 1: Migrar o export no arquivo origem
```bash
# Exemplo para chalk-safe.ts
# Antes:
export default chalk;
# Depois:
export { chalk };
```

### Passo 2: Atualizar os imports dependentes
```bash
# Antes:
import chalk from '@core/config/chalk-safe.js';
# Depois:
import { chalk } from '@core/config/chalk-safe.js';
```

### Passo 3: Testar build
```bash
npm run build
```

### Passo 4: Se houver erro, corregir manualmente
```bash
# Corrigir imports quebrados
git diff --name-only | xargs grep -l "Cannot find"
```

---

## Categorias de migração

### Tipo A: export { X } (simples)
- chalk, configDefault, ICONES, SUGESTOES, etc.
- Quando o export é um objeto/constante já definido

### Tipo B: export function X() (factory)
- Analistas que usam `criarAnalista({...})`
- Precisa envolver em função e retornar o objeto

### Tipo C: export const X (constante)
- detector-tipos-inseguros, detector-interfaces-inline
- Apenas adicionar `export` antes do `const`

---

## Não migrar (arquivos .d.ts)
- `src/types/postcss-scss.d.ts`
- `src/types/core/utils/xxhashjs.d.ts`

Estes são arquivos de declaração de tipos para bibliotecas externas.