import { beforeEach, describe, expect, it, vi } from 'vitest';

const scoreArquetipo = vi.fn();

vi.mock('@analistas/pontuadores/pontuador.js', () => ({
  scoreArquetipo,
}));

describe('detectarArquetipoNode', () => {
  beforeEach(() => {
    scoreArquetipo.mockReset();
  });

  it('retorna vazio quando não encontra package.json', async () => {
    const { detectarArquetipoNode } = await import(
      '@analistas/plugins/detector-node.js'
    );

    expect(detectarArquetipoNode(['src/index.ts'])).toEqual([]);
    expect(scoreArquetipo).not.toHaveBeenCalled();
  });

  it('pontua arquétipos e filtra apenas scores positivos', async () => {
    scoreArquetipo
      .mockReturnValueOnce({ nome: 'cli-modular', score: 12 })
      .mockReturnValue({ nome: 'outro', score: 0 });

    const { detectarArquetipoNode } = await import(
      '@analistas/plugins/detector-node.js'
    );
    const resultados = detectarArquetipoNode(['package.json', 'src/index.ts']);

    expect(scoreArquetipo).toHaveBeenCalled();
    expect(resultados).toEqual([{ nome: 'cli-modular', score: 12 }]);
  });
});
