// SPDX-License-Identifier: MIT

import type { FormatadorMinimoResult } from '@';

import {normalizarFimDeLinha, normalizarNewlinesFinais, removerBom } from './utils.js';

/* ────────────────────────── TOML ────────────────────────── */

export function formatarTomlMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const lines = normalized.split('\n');
  const out: string[] = [];
  let currentSection: Array<{ key: string; value: string; comment: string }> = [];

  const flushSection = () => {
    if (currentSection.length > 0) {
      const realEntries = currentSection.filter(e => !e.comment);
      const maxKeyLen = realEntries.length > 0
        ? Math.max(...realEntries.map(e => e.key.length))
        : 0;
      for (const entry of currentSection) {
        if (entry.comment) {
          out.push(entry.comment);
        } else {
          const paddedKey = entry.key.padEnd(maxKeyLen);
          out.push(`${paddedKey} = ${entry.value}`);
        }
      }
      currentSection = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      flushSection();
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('');
      }
      continue;
    }

    // Comments
    if (trimmed.startsWith('#')) {
      if (currentSection.length > 0 && currentSection[currentSection.length - 1] && !currentSection[currentSection.length - 1].comment) {
        currentSection.push({ key: '', value: '', comment: trimmed });
      } else {
        flushSection();
        out.push(trimmed);
      }
      continue;
    }

    // Sections: [section] or [[array-of-tables]]
    if (/^\[/.test(trimmed)) {
      flushSection();

      // Add blank line before sections (except at start)
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('');
      }

      const isArrayOfTables = /^\[\[/.test(trimmed);
      if (isArrayOfTables) {
        const inner = trimmed.replace(/^\[\[/, '').replace(/\]\]$/, '').trim();
        out.push(`[[${inner}]]`);
      } else {
        const inner = trimmed.replace(/^\[/, '').replace(/\]$/, '').trim();
        out.push(`[${inner}]`);
      }
      continue;
    }

    // Key-value pairs
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      currentSection.push({ key, value: val, comment: '' });
      continue;
    }

    out.push(trimmed);
  }

  flushSection();
  const formatted = normalizarNewlinesFinais(out.join('\n'));
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'toml',
    formatted,
    changed: formatted !== baseline,
    reason: 'estilo-prometheus-toml',
  };
}

/* ────────────────────────── INI ────────────────────────── */

export function formatarIniMinimo(code: string): FormatadorMinimoResult {
  const normalized = normalizarFimDeLinha(removerBom(code));
  const lines = normalized.split('\n');
  const out: string[] = [];
  let currentSection: Array<{ key: string; value: string; comment: string }> = [];

  const flushSection = () => {
    if (currentSection.length > 0) {
      const realEntries = currentSection.filter(e => !e.comment);
      const maxKeyLen = realEntries.length > 0
        ? Math.max(...realEntries.map(e => e.key.length))
        : 0;
      for (const entry of currentSection) {
        if (entry.comment) {
          out.push(entry.comment);
        } else {
          const paddedKey = entry.key.padEnd(maxKeyLen);
          out.push(`${paddedKey} = ${entry.value}`);
        }
      }
      currentSection = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushSection();
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('');
      }
      continue;
    }

    if (trimmed.startsWith('#') || trimmed.startsWith(';')) {
      if (currentSection.length > 0 && currentSection[currentSection.length - 1] && !currentSection[currentSection.length - 1].comment) {
        currentSection.push({ key: '', value: '', comment: trimmed });
      } else {
        flushSection();
        out.push(trimmed);
      }
      continue;
    }

    if (/^\[/.test(trimmed) && /\]$/.test(trimmed)) {
      flushSection();

      // Blank line before section (except at start)
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('');
      }

      const inner = trimmed.slice(1, -1).trim();
      out.push(`[${inner}]`);
      continue;
    }

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      currentSection.push({ key, value: val, comment: '' });
      continue;
    }

    out.push(trimmed);
  }

  flushSection();
  const formatted = normalizarNewlinesFinais(out.join('\n'));
  const baseline = normalizarNewlinesFinais(normalized);
  return {
    ok: true,
    parser: 'ini',
    formatted,
    changed: formatted !== baseline,
    reason: 'estilo-prometheus-ini',
  };
}