import { describe, expect, it } from 'vitest';

import { detectarArquetipoXML } from '@analistas/plugins/detector-xml.js';

describe('detectarArquetipoXML', () => {
  it('retorna vazio quando não há xml', () => {
    expect(detectarArquetipoXML(['src/index.ts'])).toEqual([]);
  });

  it('detecta projeto web baseado em arquivos xml conhecidos', () => {
    const resultados = detectarArquetipoXML([
      'web.xml',
      'sitemap.xml',
      'src/index.ts',
    ]);

    expect(resultados).toHaveLength(1);
    expect(resultados[0]?.nome).toBe('web-xml-project');
  });

  it('detecta projeto de configuração xml genérico com vários arquivos', () => {
    const resultados = detectarArquetipoXML([
      'a.xml',
      'b.xml',
      'c.xml',
      'src/index.ts',
    ]);

    expect(resultados).toHaveLength(1);
    expect(resultados[0]?.nome).toBe('xml-config-project');
  });
});

