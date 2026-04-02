import { describe, expect, it } from 'vitest';

import { ARQUETIPOS, normalizarCaminho } from '@analistas/estrategistas/arquetipos-defs.js';

describe('arquetipos-defs', () => {
  it('normaliza separadores de caminho para posix', () => {
    expect(normalizarCaminho('src\\analistas\\plugins')).toBe(
      'src/analistas/plugins',
    );
  });

  it('expõe arquétipos conhecidos com estrutura mínima consistente', () => {
    const nomes = ARQUETIPOS.map((item) => item.nome);

    expect(nomes).toContain('cli-modular');
    expect(nomes).toContain('monorepo-packages');
    expect(nomes).toContain('vue-spa');
    expect(new Set(nomes).size).toBe(ARQUETIPOS.length);

    for (const arquetipo of ARQUETIPOS) {
      expect(arquetipo.nome.length).toBeGreaterThan(0);
      expect(arquetipo.descricao.length).toBeGreaterThan(0);
      expect(arquetipo.pesoBase).toBeGreaterThan(0);
      expect(Array.isArray(arquetipo.requiredDirs)).toBe(true);
      expect(Array.isArray(arquetipo.optionalDirs)).toBe(true);
    }
  });

  it('mantém restrições específicas para o arquétipo cli-modular', () => {
    const cliModular = ARQUETIPOS.find((item) => item.nome === 'cli-modular');

    expect(cliModular).toBeDefined();
    expect(cliModular?.requiredDirs).toContain('bin');
    expect(cliModular?.filePresencePatterns).toContain('bin/index.ts');
    expect(cliModular?.dependencyHints).toContain('commander');
    expect(cliModular?.forbiddenDirs).toContain('pages');
  });
});

