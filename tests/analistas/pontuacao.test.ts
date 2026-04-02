import { describe, expect, it } from 'vitest';

import analistaPontuacao from '@analistas/corrections/pontuacao.js';

describe('analistaPontuacao', () => {
  it('aplica apenas a extensões suportadas', () => {
    expect(analistaPontuacao.test('src/file.ts')).toBe(true);
    expect(analistaPontuacao.test('README.md')).toBe(true);
    expect(analistaPontuacao.test('assets/icon.svg')).toBe(false);
  });

  it('não gera ocorrências para conteúdo vazio', () => {
    expect(analistaPontuacao.aplicar('', 'empty.ts')).toEqual([]);
  });

  it('detecta unicode inválido, pontuação repetida e espaçamento incorreto', () => {
    const src = 'Ol\u201cmundo\u201d !!Teste';
    const ocorrencias = analistaPontuacao.aplicar(src, 'arquivo.md');
    const tipos = ocorrencias.map((item) => item.tipo);

    expect(tipos).toContain('unicode-invalido');
    expect(tipos).toContain('pontuacao-repetida');
    expect(tipos).toContain('espacamento-incorreto');
    expect(ocorrencias.every((item) => item.relPath === 'arquivo.md')).toBe(true);
  });

  it('evita colapsar sinais quando eles aparecem apenas em string e comentário', () => {
    const src = ["const msg = '!!';", '// !! comentário mantido'].join('\n');

    const tipos = analistaPontuacao.aplicar(src, 'code.ts').map((item) => item.tipo);

    expect(tipos).not.toContain('pontuacao-repetida');
  });
});
