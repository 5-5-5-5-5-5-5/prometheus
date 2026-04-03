import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { analisarArquivoMarkdown, detectorMarkdown } from '@analistas/plugins/detector-markdown.js';

describe('detectorMarkdown', () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  async function createTempFile(name: string, content: string) {
    tempDir ??= await mkdtemp(path.join(os.tmpdir(), 'sensei-md-'));
    const fullPath = path.join(tempDir, name);
    await writeFile(fullPath, content, 'utf8');
    return fullPath;
  }

  it('seleciona apenas arquivos markdown e retorna vazio sem fullPath', async () => {
    expect(detectorMarkdown.test('README.md')).toBe(true);
    expect(detectorMarkdown.test('src/app.ts')).toBe(false);
    await expect(detectorMarkdown.aplicar('# title', 'README.md', null)).resolves.toEqual([]);
  });

  it('detecta falta de proveniencia, licenca incompativel e referencias de risco', async () => {
    const fullPath = await createTempFile('guide.md', [
      '# Guia',
      'Trecho copiado do Stack Overflow com GPL e cessão de direitos.',
      'GPL license text here.',
      'Há cessão de direitos prevista.',
      'https://stackoverflow.com/questions/1',
    ].join('\n'));

    const ocorrencias = await detectorMarkdown.aplicar('', 'docs/guide.md', null, fullPath);
    const tipos = ocorrencias.map((item) => item.tipo);
    const mensagens = ocorrencias.map((item) => item.mensagem);

    expect(tipos).toContain('markdown-falta-proveniencia');
    expect(tipos).toContain('markdown-licenca-incompativel');
    expect(tipos).toContain('markdown-referencia-risco');
    expect(mensagens.some((msg) => msg.includes('Arquivo não possui aviso de Proveniência'))).toBe(true);
  });

  it('ignora arquivo whitelisted e respeita marcadores de risco/licenca', async () => {
    const fullPath = await createTempFile('copilot-instructions.md', [
      '# Proveniência e Autoria',
      '<!-- RISCO_REFERENCIA_OK -->',
      '<!-- sensei-ignore: license-check -->',
      'GPL',
      'Stack Overflow',
    ].join('\n'));

    const analise = await analisarArquivoMarkdown(fullPath, '.github/copilot-instructions.md', {
      checkLicenses: true,
      checkReferences: true,
      checkProveniencia: true,
      headerLines: 30,
    });

    expect(analise.whitelisted).toBe(true);
    expect(analise.problemas).toEqual([]);
  });

  it('trata falha de leitura como formato invalido', async () => {
    const analise = await analisarArquivoMarkdown('/tmp/arquivo-inexistente-sensei.md', 'docs/missing.md', {
      checkLicenses: true,
      checkReferences: true,
      checkProveniencia: true,
      headerLines: 30,
    });

    expect(analise.problemas).toHaveLength(1);
    expect(analise.problemas[0]?.tipo).toBe('formato-invalido');
  });

  it('considera aviso benigno de proveniencia sem gerar risco extra', async () => {
    const fullPath = await createTempFile('safe.md', [
      '# Proveniência e Autoria',
      'Este documento menciona cessão de direitos apenas no aviso padrão.',
    ].join('\n'));

    const analise = await analisarArquivoMarkdown(fullPath, 'docs/safe.md', {
      checkLicenses: true,
      checkReferences: true,
      checkProveniencia: true,
      headerLines: 30,
    });

    expect(analise.temProveniencia).toBe(true);
    expect(analise.problemas).toEqual([]);
  });
});
