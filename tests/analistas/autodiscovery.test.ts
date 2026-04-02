import { describe, expect, it } from 'vitest';

import { discoverAnalistasPlugins } from '@analistas/registry/autodiscovery.js';

describe('discoverAnalistasPlugins', () => {
  it('descobre plugins válidos do diretório de analistas', async () => {
    const plugins = await discoverAnalistasPlugins();
    const nomes = plugins
      .map((item) => ('nome' in item ? item.nome : ''))
      .filter(Boolean);

    expect(plugins.length).toBeGreaterThan(0);
    expect(nomes).toContain('analista-svg');
    expect(nomes).toContain('analista-formatador');
    expect(new Set(nomes).size).toBe(nomes.length);
  });
});

