// SPDX-License-Identifier: MIT

import type { FormatadorMinimoResult } from '@';

import { normalizarFimDeLinha, normalizarNewlinesFinais, removerBom } from './utils.js';

/* ────────────────────────── CSS Tokenizer ────────────────────────── */

type CssTokenKind = 'rule' | 'at-rule' | 'comment' | 'text';

function tokenizeCssBlocks(src: string): Array<{ kind: CssTokenKind; value: string }> {
  const out: Array<{ kind: CssTokenKind; value: string }> = [];
  let i = 0;

  const skipString = (quote: string): number => {
    let j = i + 1;
    while (j < src.length) {
      if (src[j] === '\\') { j += 2; continue; }
      if (src[j] === quote) { j++; break; }
      j++;
    }
    return j;
  };

  while (i < src.length) {
  /* -------------------------- block comments -------------------------- */
    if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      if (end === -1) {
        out.push({ kind: 'comment', value: src.slice(i) });
        break;
      }
      out.push({ kind: 'comment', value: src.slice(i, end + 2) });
      i = end + 2;
      continue;
    }

  /* -------------------------- strings -------------------------- */
    if (src[i] === '"' || src[i] === "'") {
      const start = i;
      i = skipString(src[i]);
      out.push({ kind: 'rule', value: src.slice(start, i) });
      continue;
    }

  /* -------------------------- parenthesised groups (url(...), calc(...), etc.) -------------------------- */
    if (src[i] === '(') {
      const parenStart = i;
      let depth = 1;
      i++;
      while (i < src.length && depth > 0) {
        if (src[i] === '(') depth++;
        else if (src[i] === ')') depth--;
        if (depth > 0) i++;
        else i++;
      }
      out.push({ kind: 'rule', value: src.slice(parenStart, i) });
      continue;
    }

  /* -------------------------- at-rules -------------------------- */
    if (src[i] === '@') {
      let depth = 0;
      const atStart = i;
      let blockStarted = false;
      while (i < src.length) {
        // skip parenthesised expressions inside at-rules
        if (src[i] === '(') {
          let pd = 1;
          i++;
          while (i < src.length && pd > 0) {
            if (src[i] === '(') pd++;
            else if (src[i] === ')') pd--;
            i++;
          }
          continue;
        }
        if (src[i] === '{') {
          depth++;
          blockStarted = true;
        }
        if (src[i] === '}') {
          if (depth === 0) { i++; break; }
          depth--;
          if (depth === 0 && blockStarted) { i++; break; }
        }
        if (src[i] === ';' && depth === 0) { i++; break; }
        i++;
      }
      out.push({ kind: 'at-rule', value: src.slice(atStart, i) });
      continue;
    }

  /* -------------------------- structural characters -------------------------- */
    if (src[i] === '{' || src[i] === '}' || src[i] === ';') {
      out.push({ kind: 'text', value: src[i] });
      i++;
      continue;
    }

  /* -------------------------- rule chunk (selectors / declarations) -------------------------- */
    {
      const ruleStart = i;
      while (
        i < src.length &&
        src[i] !== '{' &&
        src[i] !== '}' &&
        src[i] !== ';' &&
        src[i] !== '@' &&
        !(src[i] === '/' && src[i + 1] === '*')
      ) {
        // skip strings inside rule text
        if (src[i] === '"' || src[i] === "'") {
          i = skipString(src[i]);
          continue;
        }
        i++;
      }
      const chunk = src.slice(ruleStart, i);
      if (chunk.trim()) {
        out.push({ kind: 'rule', value: chunk });
      }
    }
  }
  return out;
}

/* ────────────────────────── Helpers ────────────────────────── */

/**
 * Find the colon that separates property from value, ignoring colons inside
 * parentheses (e.g. `url(data:image/png)`) and colons that are part of
 * pseudo-selectors (`:hover`, `::before`).
 */
function findPropertyColon(str: string): number {
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') depth++;
    else if (str[i] === ')') depth--;
    else if (str[i] === ':' && depth === 0) {
      const rest = str.slice(i + 1);
      const before = str.slice(0, i).trim();

      // Skip pseudo-elements: ::after, ::before, ::first-line, etc.
      if (/^::[a-zA-Z-]/.test(rest)) {
        // If "before" starts with --, it's a CSS custom property
        if (before.startsWith('--')) {
          return i;
        }
        // Otherwise skip - it's definitely a pseudo-element
        continue;
      }

      // Skip pseudo-classes: :hover, :first-child, :nth-child, etc.
      if (/^:[a-zA-Z-]/.test(rest)) {
        // If "before" starts with --, it's a CSS custom property
        if (before.startsWith('--')) {
          return i;
        }
        // If "before" is a short selector (likely an HTML tag like a, i, b, u, s)
        // or contains selector characters, skip - it's a pseudo-class
        if (before.length <= 2 || /[\s>+~\[*.#:]/.test(before)) {
          continue;
        }
        // "before" is longer - could be either property or selector
        // Default to skipping for safety (most colons in selectors are pseudo-classes)
        continue;
      }

      // Not a pseudo-selector - check if "before" is a CSS property
      // CSS properties don't contain selector characters
      if (
        before.length > 0 &&
        !before.includes(' ') &&
        !before.includes('>') &&
        !before.includes('+') &&
        !before.includes('~') &&
        !before.includes('[') &&
        !before.startsWith('.') &&
        !before.startsWith('#') &&
        !before.startsWith(':') &&
        !before.startsWith('@') &&
        !before.startsWith('&')
      ) {
        return i;
      }
      continue;
    }
  }
  return -1;
}

function isCssPropertyName(name: string): boolean {
  const t = name.trim();
  if (!t) return false;
  // CSS custom properties
  if (t.startsWith('--')) return true;
  // Common HTML tag names that are NOT CSS properties
  const commonTags = new Set([
    'a', 'b', 'i', 'u', 's', 'em', 'strong', 'code', 'span', 'div',
    'html', 'head', 'body', 'title', 'link', 'meta', 'script', 'style',
    'header', 'footer', 'nav', 'main', 'section', 'article', 'aside',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li',
    'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'label',
    'img', 'a', 'br', 'hr', 'pre', 'blockquote', 'iframe'
  ]);
  if (commonTags.has(t.toLowerCase())) return false;
  // Standard properties (possibly vendor-prefixed)
  if (/^-?[a-zA-Z][a-zA-Z0-9-]*$/.test(t)) return true;
  return false;
}

/* ────────────────────────── AST Types ────────────────────────── */

type CssItem =
  | { kind: 'prop'; prop: string; value: string }
  | { kind: 'comment'; text: string }
  | { kind: 'block'; selector: string; items: CssItem[] };

/* ────────────────────────── Parser ────────────────────────── */

function parseCssTokens(tokenList: Array<{ kind: string; value: string }>): CssItem[] {
  const items: CssItem[] = [];
  let currentSelector = '';

  function flushSelector() {
    if (currentSelector.trim()) {
      items.push({ kind: 'block', selector: currentSelector.trim(), items: [] });
      currentSelector = '';
    }
  }

  let idx = 0;
  while (idx < tokenList.length) {
    const tok = tokenList[idx];
    if (!tok) {
      idx++;
      continue;
    }

    if (tok.kind === 'comment') {
      items.push({ kind: 'comment', text: tok.value.trim() });
      idx++;
      continue;
    }

    if (tok.kind === 'text') {
      if (tok.value === '{') {
        flushSelector();
        const lastBlock = items[items.length - 1];
        if (lastBlock?.kind === 'block') {
          idx++;
          const innerTokens: Array<{ kind: string; value: string }> = [];
          let depth = 1;
          while (idx < tokenList.length && depth > 0) {
            const innerTok = tokenList[idx];
            if (!innerTok) {
              idx++;
              continue;
            }
            if (innerTok.kind === 'text') {
              if (innerTok.value === '{') depth++;
              else if (innerTok.value === '}') depth--;
            }
            if (depth > 0) innerTokens.push(innerTok);
            idx++;
          }
          lastBlock.items = parseCssTokens(innerTokens);
        } else {
          idx++;
        }
      } else if (tok.value === '}') {
        flushSelector();
        idx++;
      } else if (tok.value === ';') {
        idx++;
      } else {
        idx++;
      }
      continue;
    }

    if (tok.kind === 'at-rule') {
      const trimmed = tok.value.trim();
      if (trimmed.includes('{')) {
        const braceIdx = trimmed.indexOf('{');
        const selector = trimmed.slice(0, braceIdx).trim();
        const lastBrace = trimmed.lastIndexOf('}');
        const innerContent = lastBrace > braceIdx
          ? trimmed.slice(braceIdx + 1, lastBrace).trim()
          : '';
        const block: CssItem = { kind: 'block', selector, items: [] };
        if (innerContent) {
          const innerTokens = tokenizeCssBlocks(innerContent);
          block.items = parseCssTokens(innerTokens);
        }
        items.push(block);
      } else {
        // At-rule without block (e.g. @import, @charset, @namespace)
        // Treat as a property-like statement (no braces)
        const cleaned = trimmed.replace(/;[\s]*$/, '').trim();
        items.push({ kind: 'prop', prop: cleaned, value: '' });
      }
      idx++;
      continue;
    }

    if (tok.kind === 'rule') {
      const trimmed = tok.value.trim();
      if (!trimmed) { idx++; continue; }

      const colonIdx = findPropertyColon(trimmed);
      if (colonIdx > 0 && !trimmed.includes('{') && !trimmed.includes('}')) {
        const prop = trimmed.slice(0, colonIdx).trim();
        const value = trimmed.slice(colonIdx + 1).trim();

        if (isCssPropertyName(prop)) {
          items.push({ kind: 'prop', prop, value });
          idx++;
          continue;
        }
      }

      // It's a selector fragment
      currentSelector = (currentSelector ? `${currentSelector  } ` : '') + trimmed;
      idx++;
      continue;
    }

    idx++;
  }
  flushSelector();
  return items;
}

/* ────────────────────────── Renderer ────────────────────────── */

function renderCssItems(items: CssItem[], depth: number): string[] {
  const lines: string[] = [];
  const indent = (n: number) => '  '.repeat(Math.max(0, n));

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.kind === 'comment') {
      // Preserve multi-line comments
      const commentLines = item.text.split('\n');
      for (const cl of commentLines) {
        lines.push(`${indent(depth)}${cl.trim()}`);
      }
    } else if (item.kind === 'prop') {
      if (item.value === '') {
        // At-rule without block (e.g. @import url(...))
        lines.push(`${indent(depth)}${item.prop};`);
      } else {
        lines.push(`${indent(depth)}${item.prop}: ${item.value};`);
      }
    } else if (item.kind === 'block') {
      // Add blank line before top-level blocks (except the first)
      if (depth === 0 && i > 0) {
        const prevLine = lines[lines.length - 1];
        if (prevLine !== undefined && prevLine !== '') {
          lines.push('');
        }
      }

      lines.push(`${indent(depth)}${item.selector} {`);
      if (item.items.length > 0) {
        lines.push(...renderCssItems(item.items, depth + 1));
      }
      lines.push(`${indent(depth)}}`);
    }
  }
  return lines;
}

/* ────────────────────────── Public API ────────────────────────── */

export function formatarCssMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const tokens = tokenizeCssBlocks(normalized);
  const treeItems = parseCssTokens(tokens);
  const outLines = renderCssItems(treeItems, 0);
  const formatted = normalizarNewlinesFinais(outLines.join('\n').replace(/\n{3,}/g, '\n\n'));
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'css',
    formatted,
    changed: formatted !== baseline,
    reason: 'estilo-prometheus-css',
  };
}

export function formatarScssMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const lines = normalized.split('\n');
  const out: string[] = [];
  let indent = 0;
  let inMultilineComment = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? '';
    const trimmed = raw.trim();

    // --- empty lines ---
    if (!trimmed) {
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('');
      }
      continue;
    }

    // --- multi-line comments ---
    if (inMultilineComment) {
      out.push(`${'  '.repeat(indent)}${trimmed}`);
      if (trimmed.includes('*/')) {
        inMultilineComment = false;
      }
      continue;
    }

    if (trimmed.startsWith('/*') && !trimmed.includes('*/')) {
      inMultilineComment = true;
      out.push(`${'  '.repeat(indent)}${trimmed}`);
      continue;
    }

    // --- single-line comments ---
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.includes('*/'))) {
      out.push(`${'  '.repeat(indent)}${trimmed}`);
      continue;
    }

    // --- closing brace ---
    if (trimmed === '}' || trimmed.startsWith('}')) {
      indent = Math.max(0, indent - 1);
      out.push(`${'  '.repeat(indent)}${trimmed}`);
      continue;
    }

    // --- opening brace at end of line ---
    if (trimmed.endsWith('{')) {
      // Add blank line before nested rules (but not the first rule)
      if (out.length > 0 && out[out.length - 1] !== '' && !out[out.length - 1]?.trim().startsWith('//') && !out[out.length - 1]?.trim().startsWith('/*')) {
        const prevTrimmed = (out[out.length - 1] ?? '').trim();
        if (prevTrimmed !== '' && !prevTrimmed.endsWith('{') && prevTrimmed !== '}') {
          out.push('');
        }
      }
      const selector = trimmed.slice(0, -1).trim();
      out.push(`${'  '.repeat(indent)}${selector} {`);
      indent++;
      continue;
    }

    // --- line contains { inline ---
    if (trimmed.includes('{')) {
      const parts = trimmed.split('{');
      const selector = parts[0]?.trim() ?? '';
      out.push(`${'  '.repeat(indent)}${selector} {`);
      indent++;
      const rest = parts.slice(1).join('{').replace(/\s+/g, ' ').trim();
      if (rest && rest !== '}') {
        const declarations = rest.replace(/}.*$/, '').split(';').filter(p => p.trim());
        for (const decl of declarations) {
          const td = decl.trim();
          if (td && td !== '}') {
            const colonIdx = td.indexOf(':');
            if (colonIdx > 0) {
              const prop = td.slice(0, colonIdx).trim();
              const value = td.slice(colonIdx + 1).replace(/;$/, '').trim();
              out.push(`${'  '.repeat(indent)}${prop}: ${value};`);
            } else {
              out.push(`${'  '.repeat(indent)}${td.endsWith(';') ? td : `${td};`}`);
            }
          }
        }
      }
      if (rest.includes('}')) {
        indent = Math.max(0, indent - 1);
        out.push(`${'  '.repeat(indent)}}`);
      }
      continue;
    }

    // --- declarations and at-rules ---
    if (trimmed.startsWith('@')) {
      // SCSS at-rule without block (e.g. @import, @include, @use, @extend)
      out.push(`${'  '.repeat(indent)}${trimmed.endsWith(';') ? trimmed : `${trimmed};`}`);
      continue;
    }

    if (trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0) {
        const prop = trimmed.slice(0, colonIdx).trim();
        const rest = trimmed.slice(colonIdx + 1).trim();
        const value = rest.endsWith(';') ? rest.slice(0, -1).trim() : rest;
        out.push(`${'  '.repeat(indent)}${prop}: ${value};`);
        continue;
      }
    }

    // --- everything else ---
    out.push(`${'  '.repeat(indent)}${trimmed.endsWith(';') ? trimmed : trimmed}`);
  }

  const formatted = normalizarNewlinesFinais(out.join('\n'));
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'scss',
    formatted,
    changed: formatted !== baseline,
    reason: 'estilo-prometheus-scss',
  };
}

export function formatarLessMinimo(code: string): FormatadorMinimoResult {
  return formatarScssMinimo(code);
}
