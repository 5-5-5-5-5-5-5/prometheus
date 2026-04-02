import { describe, expect, it } from 'vitest';

import { analistaSvg } from '@analistas/plugins/analista-svg.js';

describe('analistaSvg', () => {
  it('seleciona apenas arquivos svg', () => {
    expect(analistaSvg.test('assets/icon.svg')).toBe(true);
    expect(analistaSvg.test('assets/icon.png')).toBe(false);
  });

  it('reporta arquivo inválido quando não encontra tag svg', async () => {
    const ocorrencias = await analistaSvg.aplicar('texto qualquer', 'broken.svg');

    expect(ocorrencias).toHaveLength(1);
    expect(ocorrencias?.[0]?.mensagem).toContain('não contém uma tag <svg>');
  });

  it('detecta riscos de segurança e ausência de viewBox', async () => {
    const src = [
      '<svg width="10" height="10">',
      '<script>alert(1)</script>',
      '<rect onclick="run()" />',
      '<a href="javascript:alert(1)">x</a>',
      '</svg>',
    ].join('\n');
    const ocorrencias = await analistaSvg.aplicar(src, 'unsafe.svg');
    const mensagens = (ocorrencias ?? []).map((item) => item.mensagem);

    expect(mensagens.some((m) => m.includes('contém <script>'))).toBe(true);
    expect(mensagens.some((m) => m.includes('handlers inline'))).toBe(true);
    expect(mensagens.some((m) => m.includes('javascript:'))).toBe(true);
    expect(mensagens.some((m) => m.includes('sem viewBox'))).toBe(true);
  });
});

