import { describe, expect, it } from 'vitest';

import { analistaTodoComentarios } from '@analistas/js-ts/analista-todo-comments.js';

describe('analistaTodoComentarios', () => {
  it('filtra arquivos de teste, configuracao e extensoes nao suportadas', () => {
    expect(analistaTodoComentarios.test('src/app.ts')).toBe(true);
    expect(analistaTodoComentarios.test('tests/app.test.ts')).toBe(false);
    expect(analistaTodoComentarios.test('vitest.config.ts')).toBe(false);
    expect(analistaTodoComentarios.test('styles.css')).toBe(false);
    expect(analistaTodoComentarios.test('src/analistas/analista-todo-comments.ts')).toBe(false);
  });

  it('retorna null quando o codigo e invalido ou sem pendencias', () => {
    expect(analistaTodoComentarios.aplicar('', 'src/app.ts')).toBeNull();
    expect(analistaTodoComentarios.aplicar('const value = 1;', 'src/app.ts')).toBeNull();
  });

  it('detecta TODO e FIXME com severidade ajustada por contexto', () => {
    const src = [
      '// TODO: revisar fluxo de autenticação',
      '// FIXME: corrigir retorno nulo',
      'export const value = 1;',
    ].join('\n');

    const ocorrencias = analistaTodoComentarios.aplicar(src, 'src/shared/auth.ts') ?? [];

    expect(ocorrencias).toHaveLength(2);
    expect(ocorrencias[0]?.tipo).toBe('TODO-pendente');
    expect(ocorrencias[0]?.nivel).toBe('aviso');
    expect(ocorrencias[1]?.nivel).toBe('aviso');
    expect(ocorrencias[0]?.mensagem).toContain('TODO encontrado');
    expect(ocorrencias[1]?.mensagem).toContain('FIXME encontrado');
  });
});
