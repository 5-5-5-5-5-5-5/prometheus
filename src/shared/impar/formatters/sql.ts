// SPDX-License-Identifier: MIT

import type { FormatadorMinimoResult } from '@';

import { normalizarFimDeLinha, normalizarNewlinesFinais, removerBom } from './utils.js';

/* ────────────────────────── Keywords ────────────────────────── */

const SQL_KEYWORDS = new Set([
  'select', 'from', 'where', 'insert', 'into', 'values', 'update', 'set',
  'delete', 'create', 'table', 'drop', 'alter', 'add', 'column', 'index',
  'join', 'left', 'right', 'inner', 'outer', 'on', 'and', 'or', 'not',
  'in', 'is', 'null', 'as', 'order', 'by', 'group', 'having', 'limit',
  'offset', 'union', 'all', 'distinct', 'case', 'when', 'then', 'else',
  'end', 'exists', 'between', 'like', 'asc', 'desc', 'primary', 'key',
  'foreign', 'references', 'constraint', 'default', 'check', 'unique',
  'if', 'begin', 'commit', 'rollback', 'transaction', 'grant', 'revoke',
  'with', 'recursive', 'over', 'partition', 'window', 'returning',
  'cascade', 'restrict', 'no', 'action', 'using', 'cross', 'natural',
  'full', 'replace', 'view', 'trigger', 'function', 'procedure',
  'declare', 'fetch', 'cursor', 'open', 'close', 'deallocate',
]);

const MAJOR_CLAUSE_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE',
  'CREATE', 'DROP', 'ALTER', 'ORDER BY', 'GROUP BY',
  'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'SET', 'VALUES',
  'INTO', 'BEGIN', 'COMMIT', 'ROLLBACK', 'WITH', 'RETURNING',
]);

const JOIN_KEYWORDS = new Set([
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'CROSS', 'NATURAL', 'FULL',
]);

/* ────────────────────────── Token types ────────────────────────── */

type SqlToken = {
  type: 'keyword' | 'ident' | 'string' | 'number' | 'op' | 'punct' | 'ws' | 'comment';
  value: string;
};

/* ────────────────────────── Tokenizer ────────────────────────── */

function tokenizeSql(src: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  let i = 0;

  while (i < src.length) {
    // -- line comments
    if (src[i] === '-' && src[i + 1] === '-') {
      const end = src.indexOf('\n', i);
      tokens.push({ type: 'comment', value: end === -1 ? src.slice(i) : src.slice(i, end) });
      i = end === -1 ? src.length : end;
      continue;
    }

    // /* block comments */
    if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      tokens.push({ type: 'comment', value: end === -1 ? src.slice(i) : src.slice(i, end + 2) });
      i = end === -1 ? src.length : end + 2;
      continue;
    }

    // strings
    if (src[i] === "'" || src[i] === '"') {
      const q = src[i] as '"' | "'";
      let j = i + 1;
      while (j < src.length && src[j] !== q) {
        if (src[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', value: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // numbers
    if (/\d/.test(src[i] ?? '') && (i === 0 || !/\w/.test(src[i - 1] ?? ''))) {
      let j = i;
      while (j < src.length && /[\d.]/.test(src[j] ?? '')) j++;
      tokens.push({ type: 'number', value: src.slice(i, j) });
      i = j;
      continue;
    }

    // identifiers / keywords
    if (/[a-zA-Z_]/.test(src[i] ?? '')) {
      let j = i;
      while (j < src.length && /[\w]/.test(src[j] ?? '')) j++;
      const word = src.slice(i, j);
      tokens.push({ type: SQL_KEYWORDS.has(word.toLowerCase()) ? 'keyword' : 'ident', value: word });
      i = j;
      continue;
    }

    // operators
    if (/[=<>!+\-*/%&|^~]/.test(src[i] ?? '')) {
      let j = i;
      while (j < src.length && /[=<>!+\-*/%&|^~]/.test(src[j] ?? '')) j++;
      tokens.push({ type: 'op', value: src.slice(i, j) });
      i = j;
      continue;
    }

    // punctuation
    if (/[(),.;:]/.test(src[i] ?? '')) {
      tokens.push({ type: 'punct', value: src[i] ?? '' });
      i++;
      continue;
    }

    // whitespace
    if (/\s/.test(src[i] ?? '')) {
      let j = i;
      while (j < src.length && /\s/.test(src[j] ?? '')) j++;
      tokens.push({ type: 'ws', value: src.slice(i, j) });
      i = j;
      continue;
    }

    // fallback
    i++;
  }

  return tokens;
}

/* ────────────────────────── Formatter ────────────────────────── */

export function formatarSqlMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const tokens = tokenizeSql(normalized);

  const out: string[] = [];
  let indent = 0;
  let lineStart = true;
  let inSelectClause = false;

  const pushIndent = () => '  '.repeat(indent);

  const peekKeyword = (from: number): string | null => {
    for (let k = from + 1; k < tokens.length; k++) {
      if (tokens[k]?.type === 'ws') continue;
      const tk = tokens[k];
      if (tk?.type === 'keyword') return String(tk.value).toUpperCase();
      return null;
    }
    return null;
  };

  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t];
    if (!tok) continue;

    // comments always on their own line
    if (tok.type === 'comment') {
      if (!lineStart) out.push('\n');
      out.push(`${pushIndent()}${tok.value.trim()}`);
      out.push('\n');
      lineStart = true;
      continue;
    }

    // skip whitespace (we control spacing)
    if (tok.type === 'ws') continue;

    if (tok.type === 'keyword') {
      const upper = tok.value.toUpperCase();

      // ORDER BY / GROUP BY compound keyword
      if (upper === 'ORDER' || upper === 'GROUP') {
        const next = peekKeyword(t);
        if (next === 'BY') {
          inSelectClause = false;
          if (!lineStart) out.push('\n');
          out.push(`${pushIndent()}${upper} BY`);
          lineStart = false;
          // skip the BY token
          for (let k = t + 1; k < tokens.length; k++) {
            if (tokens[k]?.type === 'ws') continue;
            const tk = tokens[k];
            if (tk?.type === 'keyword' && String(tk.value).toUpperCase() === 'BY') {
              t = k;
              break;
            }
            break;
          }
          continue;
        }
      }

      // Major clause keywords — new line
      if (MAJOR_CLAUSE_KEYWORDS.has(upper)) {
        if (upper === 'FROM' || upper === 'WHERE' || upper === 'HAVING' ||
            upper === 'LIMIT' || upper === 'OFFSET' || upper === 'SET' ||
            upper === 'RETURNING') {
          inSelectClause = false;
        }
        if (!lineStart) out.push('\n');
        out.push(`${pushIndent()}${upper}`);
        lineStart = false;
        if (upper === 'SELECT') inSelectClause = true;
        continue;
      }

      // JOIN keywords — new line
      if (JOIN_KEYWORDS.has(upper)) {
        inSelectClause = false;
        if (!lineStart) out.push('\n');
        out.push(`${pushIndent()}${upper}`);
        lineStart = false;
        continue;
      }

      // AND / OR — new line with extra indent
      if (upper === 'AND' || upper === 'OR') {
        out.push('\n');
        out.push(`${pushIndent()}  ${upper}`);
        lineStart = false;
        continue;
      }

      // ON — same line
      if (upper === 'ON') {
        out.push(` ${upper}`);
        lineStart = false;
        continue;
      }

      // Other keywords — inline
      if (lineStart) {
        out.push(`${pushIndent()}${upper}`);
      } else {
        out.push(` ${upper}`);
      }
      lineStart = false;
      continue;
    }

    // punctuation
    if (tok.type === 'punct') {
      if (tok.value === '(') {
        out.push(' (');
        indent++;
        out.push('\n');
        lineStart = true;
        continue;
      }
      if (tok.value === ')') {
        indent = Math.max(0, indent - 1);
        out.push('\n');
        out.push(`${pushIndent()})`);
        lineStart = false;
        continue;
      }
      if (tok.value === ',') {
        if (inSelectClause) {
          out.push(',\n');
          lineStart = true;
        } else {
          out.push(',');
        }
        continue;
      }
      if (tok.value === ';') {
        out.push(';\n');
        lineStart = true;
        inSelectClause = false;
        continue;
      }
      if (tok.value === '.') {
        out.push('.');
        continue;
      }
      out.push(tok.value);
      lineStart = false;
      continue;
    }

    // everything else (identifiers, strings, numbers, operators)
    if (lineStart) {
      out.push(`${pushIndent()}  ${tok.value}`);
    } else {
      out.push(` ${tok.value}`);
    }
    lineStart = false;
  }

  const raw = out.join('').replace(/\n{3,}/g, '\n\n').trimEnd();
  const formatted = normalizarNewlinesFinais(raw);
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'sql',
    formatted,
    changed: formatted !== baseline,
    reason: 'estilo-prometheus-sql',
  };
}