import { describe, expect, it } from 'vitest';

import { listarAnalistas, registroAnalistas } from '@analistas/registry/registry.js';

describe('registry', () => {
  it('expõe um catálogo de analistas com metadados básicos', () => {
    expect(registroAnalistas.length).toBeGreaterThan(0);

    const lista = listarAnalistas();

    expect(lista.length).toBe(registroAnalistas.length);
    expect(lista.some((item) => item.nome === 'sugestoes-contextuais')).toBe(
      true,
    );
    expect(
      lista.every(
        (item) =>
          typeof item.nome === 'string' &&
          typeof item.categoria === 'string' &&
          typeof item.descricao === 'string',
      ),
    ).toBe(true);
  });
});
