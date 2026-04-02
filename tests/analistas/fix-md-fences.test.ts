import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  fixFences,
  guessLang,
  scanAndApplyFixMdFences,
} from '@analistas/corrections/fix-md-fences.js';

const tempDirs: string[] = [];

describe('fix-md-fences', () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map(async (dir) => {
        await import('node:fs/promises').then(({ rm }) =>
          rm(dir, { recursive: true, force: true }),
        );
      }),
    );
  });

  it('detecta linguagem de blocos comuns', () => {
    expect(guessLang('{ "name": "sensei" }')).toBe('json');
    expect(guessLang('$env:CI = "true"')).toBe('powershell');
    expect(guessLang('#!/usr/bin/env bash\nnpm run build')).toBe('bash');
    expect(guessLang('export const x = 1')).toBe('ts');
    expect(guessLang('conteudo livre')).toBe('text');
  });

  it('adiciona linguagem inferida a cercas markdown sem info string', () => {
    const input = ['Antes', '```', 'npm run build', '```', 'Depois'].join('\n');

    expect(fixFences(input)).toBe(
      ['Antes', '```bash', 'npm run build', '```', 'Depois'].join('\n'),
    );
  });

  it('escaneia markdowns elegíveis e ignora diretórios excluídos', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'sensei-md-'));
    tempDirs.push(root);

    await mkdir(path.join(root, 'docs', 'legado'), { recursive: true });
    await mkdir(path.join(root, 'guides'), { recursive: true });
    await mkdir(path.join(root, 'node_modules', 'pkg'), { recursive: true });

    const alvo = path.join(root, 'guides', 'README.md');
    const legado = path.join(root, 'docs', 'legado', 'old.md');
    const ignorado = path.join(root, 'node_modules', 'pkg', 'README.md');

    await writeFile(alvo, ['```', 'npm test', '```'].join('\n'), 'utf8');
    await writeFile(legado, ['```', 'npm run lint', '```'].join('\n'), 'utf8');
    await writeFile(ignorado, ['```', 'npm run build', '```'].join('\n'), 'utf8');

    const changed = await scanAndApplyFixMdFences(root);

    expect(changed).toBe(1);
    await expect(readFile(alvo, 'utf8')).resolves.toContain('```bash');
    await expect(readFile(legado, 'utf8')).resolves.not.toContain('```bash');
    await expect(readFile(ignorado, 'utf8')).resolves.not.toContain('```bash');
  });
});

