// SPDX-License-Identifier: MIT

import type { FormatadorMinimoResult } from '@';

import { limitarLinhasEmBranco,normalizarFimDeLinha, normalizarNewlinesFinais, removerBom } from './utils.js';

/* ────────────────────────── Dockerfile ────────────────────────── */

const DOCKER_KEYWORDS = new Set([
  'from', 'run', 'cmd', 'label', 'maintainer', 'expose', 'env',
  'add', 'copy', 'entrypoint', 'volume', 'user', 'workdir', 'arg',
  'onbuild', 'stopsignal', 'healthcheck', 'shell', 'as',
]);

export function formatarDockerfileMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const lines = normalized.split('\n');
  const out: string[] = [];
  let prevIsContinuation = false;

  for (const raw of lines) {
    const trimmed = raw.trim();

    // Empty lines
    if (!trimmed) {
      if (out.length > 0 && out[out.length - 1] !== '' && !prevIsContinuation) {
        out.push('');
      }
      prevIsContinuation = false;
      continue;
    }

    // Comments — preserve as-is
    if (trimmed.startsWith('#')) {
      out.push(trimmed);
      prevIsContinuation = false;
      continue;
    }

    // If this is a continuation of a previous line (after \), preserve indentation
    if (prevIsContinuation) {
      // Preserve original indentation for continuation lines
      const leadingSpaces = raw.match(/^(\s*)/)?.[1] ?? '';
      const indented = leadingSpaces.length >= 2
        ? leadingSpaces + trimmed
        : `    ${  trimmed}`; // Default 4-space indent for continuation
      out.push(indented);
      prevIsContinuation = trimmed.endsWith('\\');
      continue;
    }

    // Uppercase Docker keywords
    const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase() ?? '';
    if (DOCKER_KEYWORDS.has(firstWord)) {
      const upper = firstWord.toUpperCase();
      const rest = trimmed.slice(firstWord.length);
      out.push(`${upper}${rest}`);
    } else {
      out.push(trimmed);
    }

    prevIsContinuation = trimmed.endsWith('\\');
  }

  const formatted = normalizarNewlinesFinais(out.join('\n'));
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'dockerfile',
    formatted,
    changed: formatted !== baseline,
    reason: 'estilo-prometheus-dockerfile',
  };
}

/* ────────────────────────── Shell ────────────────────────── */

export function formatarShellMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const lines = normalized.split('\n');
  const out: string[] = [];
  let inHereDoc = false;
  let hereDocDelimiter = '';

  for (const raw of lines) {
    // Preserve indentation, only remove trailing whitespace
    const trimEnd = raw.replace(/[ \t]+$/, '');

    // In here-doc: preserve exactly as-is
    if (inHereDoc) {
      out.push(trimEnd);
      if (trimEnd.trim() === hereDocDelimiter) {
        inHereDoc = false;
        hereDocDelimiter = '';
      }
      continue;
    }

    // Empty lines
    if (!trimEnd.trim()) {
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('');
      }
      continue;
    }

    // Check for here-doc start
    const hereDocMatch = trimEnd.match(/<<-?\s*['"]?(\w+)['"]?/);
    if (hereDocMatch) {
      inHereDoc = true;
      hereDocDelimiter = hereDocMatch[1] ?? '';
    }

    out.push(trimEnd);
  }

  const { code: limitedBlanks } = limitarLinhasEmBranco(out.join('\n'), 2);
  const formatted = normalizarNewlinesFinais(limitedBlanks);
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'shell',
    formatted,
    changed: formatted !== baseline,
    reason: 'estilo-prometheus-shell',
  };
}