import { describe, expect, it } from 'vitest';

import { analistaFormatador } from '@analistas/plugins/analista-formater.js';

describe('analistaFormatador', () => {
  it('seleciona apenas extensões suportadas', () => {
    expect(analistaFormatador.test('README.md')).toBe(true);
    expect(analistaFormatador.test('data.json')).toBe(true);
    expect(analistaFormatador.test('config.yaml')).toBe(true);
    expect(analistaFormatador.test('icon.svg')).toBe(false);
  });

  it('retorna null quando o conteúdo já está formatado', async () => {
    const src = '# Titulo\n\nConteudo\n';

    await expect(analistaFormatador.aplicar(src, 'README.md')).resolves.toBeNull();
  });

  it('gera aviso quando detecta arquivo não formatado', async () => {
    const src = '# Titulo\nConteudo';
    const ocorrencias = await analistaFormatador.aplicar(src, 'README.md');

    expect(ocorrencias).toHaveLength(1);
    expect(ocorrencias?.[0]?.nivel).toBe('aviso');
    expect(ocorrencias?.[0]?.tipo).toBe('formatador/regra');
    expect(ocorrencias?.[0]?.mensagem).toContain('não estar formatado');
  });
});

