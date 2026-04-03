import { describe, expect, it } from 'vitest';

import { analistaFuncoesLongas } from '@analistas/js-ts/analista-funcoes-longas.js';

describe('analistaFuncoesLongas', () => {
  it('detecta funcao longa, muitos parametros e falta de comentario em AST simples', () => {
    const ocorrencias = analistaFuncoesLongas.aplicar('export function run() {}', 'src/app.ts', {
      body: [{
        type: 'FunctionDeclaration',
        params: [{}, {}, {}, {}, {}],
        loc: { start: { line: 1 }, end: { line: 40 } },
        leadingComments: [],
      }],
    } as never);

    expect(ocorrencias.map((item) => item.tipo)).toEqual(expect.arrayContaining([
      'FUNCAO_LONGA',
      'MUITOS_PARAMETROS',
      'FUNCAO_SEM_COMENTARIO',
    ]));
  });

  it('nao exige comentario em arquivos de teste e ignora loc invalido', () => {
    const ocorrencias = analistaFuncoesLongas.aplicar('test()', 'tests/app.test.ts', {
      body: [
        {
          type: 'FunctionDeclaration',
          params: [{}, {}, {}, {}, {}, {}, {}],
          loc: { start: { line: 1 }, end: { line: 70 } },
          leadingComments: [],
        },
        {
          type: 'FunctionDeclaration',
          params: [],
          loc: { start: { line: 0 }, end: { line: 0 } },
          leadingComments: [],
        },
      ],
    } as never);

    expect(ocorrencias.some((item) => item.tipo === 'FUNCAO_SEM_COMENTARIO')).toBe(false);
    expect(ocorrencias.some((item) => item.tipo === 'FUNCAO_LONGA')).toBe(true);
    expect(ocorrencias.some((item) => item.tipo === 'MUITOS_PARAMETROS')).toBe(true);
  });

  it('analisa recursivamente quando recebe um NodePath com traverse', () => {
    const nested = {
      type: 'FunctionExpression',
      params: [],
      loc: { start: { line: 10 }, end: { line: 12 } },
      leadingComments: [{ value: '* documented' }],
    };

    const fakePath = {
      node: {
        type: 'FunctionDeclaration',
        params: [],
        loc: { start: { line: 1 }, end: { line: 2 } },
        leadingComments: [{ value: '* documented' }],
      },
      traverse(visitors: Record<string, (path: unknown) => void>) {
        visitors.FunctionExpression({
          node: nested,
          traverse() {},
        });
      },
    };

    const ocorrencias = analistaFuncoesLongas.aplicar('code', 'src/app.ts', fakePath as never);

    expect(ocorrencias.some((item) => item.tipo === 'FUNCAO_ANINHADA')).toBe(false);
  });

  it('marca aninhamento excessivo quando a funcao interna ultrapassa o limite', () => {
    const veryNested = {
      type: 'ArrowFunctionExpression',
      params: [],
      loc: { start: { line: 20 }, end: { line: 21 } },
      leadingComments: [{ value: '* documented' }],
    };

    const fakePath = {
      node: {
        type: 'FunctionDeclaration',
        params: [],
        loc: { start: { line: 1 }, end: { line: 2 } },
        leadingComments: [{ value: '* documented' }],
      },
      traverse(visitors: Record<string, (path: unknown) => void>) {
        visitors.FunctionDeclaration({
          node: veryNested,
          traverse(innerVisitors: Record<string, (path: unknown) => void>) {
            innerVisitors.FunctionDeclaration({
              node: veryNested,
              traverse(lastVisitors: Record<string, (path: unknown) => void>) {
                lastVisitors.FunctionDeclaration({
                  node: veryNested,
                  traverse(finalVisitors: Record<string, (path: unknown) => void>) {
                    finalVisitors.FunctionDeclaration({
                      node: veryNested,
                      traverse() {},
                    });
                  },
                });
              },
            });
          },
        });
      },
    };

    const ocorrencias = analistaFuncoesLongas.aplicar('code', 'src/app.ts', fakePath as never);

    expect(ocorrencias.some((item) => item.tipo === 'FUNCAO_ANINHADA')).toBe(true);
  });
});
