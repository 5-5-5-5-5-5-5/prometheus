import { describe, expect, it } from 'vitest';

import { analistaDocumentacao } from '@analistas/plugins/detector-documentacao.js';

describe('analistaDocumentacao', () => {
  it('analisa apenas extensoes javascript/typescript', () => {
    expect(analistaDocumentacao.test('src/app.ts')).toBe(true);
    expect(analistaDocumentacao.test('src/app.mjs')).toBe(true);
    expect(analistaDocumentacao.test('src/app.css')).toBe(false);
  });

  it('agrega problemas de documentacao por prioridade em arquivo de biblioteca publica', () => {
    const src = [
      'export function publicApi(value: any) {',
      '  const x = 42;',
      '  // TODO 2022: remover fallback',
      '  return value + x;',
      '}',
    ].join('\n');

    const ocorrencias = analistaDocumentacao.aplicar(src, 'src/shared/public-api.ts', null);
    const mensagens = ocorrencias.map((item) => item.mensagem);

    expect(ocorrencias.length).toBeGreaterThanOrEqual(2);
    expect(mensagens.some((msg) => msg.includes('media'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('baixa'))).toBe(true);
  });

  it('reduz aviso para info em arquivos de teste/configuracao', () => {
    const src = 'export default function setup(value: any) { return value; }';

    const ocorrencias = analistaDocumentacao.aplicar(src, 'tests/setup.test.ts', null);

    expect(ocorrencias).toHaveLength(1);
    expect(ocorrencias[0]?.nivel).toBe('info');
  });

  it('considera problemas encontrados via AST para export default e classe publica', () => {
    const problemas = analistaDocumentacao.aplicar('export default class Service {}', 'src/core/service.ts', {
      traverse(visitors: Record<string, (path: any) => void>) {
        visitors.ExportDefaultDeclaration({
          node: {
            declaration: {
              type: 'FunctionDeclaration',
              loc: { start: { line: 3, column: 1 } },
            },
            leadingComments: [],
          },
        });

        visitors.ClassDeclaration({
          node: {
            id: { name: 'Service' },
            body: { body: [{}, {}, {}, {}] },
            loc: { start: { line: 10, column: 0 } },
            leadingComments: [],
          },
          parent: { type: 'ExportNamedDeclaration' },
        });
      },
    } as never);

    expect(problemas.some((item) => item.mensagem.includes('media'))).toBe(true);
  });

  it('retorna vazio quando nao ha codigo para analisar', () => {
    const ocorrencias = analistaDocumentacao.aplicar('', 'src/app.ts', null);

    expect(ocorrencias).toEqual([]);
  });
});
