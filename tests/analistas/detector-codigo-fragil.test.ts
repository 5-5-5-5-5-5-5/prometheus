import { parse } from '@babel/parser';
import { describe, expect, it } from 'vitest';

import { analistaCodigoFragil } from '@analistas/detectores/detector-codigo-fragil.js';

function createAst(src: string) {
  return parse(src, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });
}

describe('analistaCodigoFragil', () => {
  it('seleciona apenas arquivos js/ts e ignora pastas abandonadas', () => {
    expect(analistaCodigoFragil.test('src/app.ts')).toBe(true);
    expect(analistaCodigoFragil.test('src/app.jsx')).toBe(true);
    expect(analistaCodigoFragil.test('src/.deprecados/app.ts')).toBe(false);
    expect(analistaCodigoFragil.test('src/style.css')).toBe(false);
  });

  it('retorna vazio sem ast ou sem conteudo', () => {
    expect(analistaCodigoFragil.aplicar('', 'src/app.ts', null)).toEqual([]);
    expect(analistaCodigoFragil.aplicar('const x = 1;', 'src/app.ts', null)).toEqual([]);
  });

  it('agrega fragilidades de texto e de AST por severidade', () => {
    const longFunctionBody = Array.from({ length: 40 }, (_, i) => `console.log(${i});`).join('\n');
    const nestedIfs = [
      'if (a) {',
      '  if (b) {',
      '    if (c) {',
      '      if (d) {',
      '        value = 42;',
      '      }',
      '    }',
      '  }',
      '}',
    ].join('\n');
    const complexLines = Array.from({ length: 8 }, () => 'if (flag) {').join('\n');
    const closing = Array.from({ length: 8 }, () => '}').join('\n');
    const src = [
      '// TODO: revisar implementação crítica',
      'console.log("debug");',
      'promise.then(() => work());',
      'const regex = /(one)(two)(three)(four)(five)(six)(seven)(eight)(nine)(ten)(eleven)/g;',
      'function longTask() {',
      longFunctionBody,
      '}',
      'try {',
      '  run();',
      '} catch (err) {}',
      'try {',
      '  run();',
      '} catch (err) { console.log(err); }',
      'const typed: any = value;',
      nestedIfs,
      complexLines,
      closing,
    ].join('\n');

    const ocorrencias = analistaCodigoFragil.aplicar(src, 'src/fragil.ts', createAst(src));
    const mensagens = ocorrencias.map((item) => item.mensagem);

    expect(mensagens.some((msg) => msg.includes('Fragilidades baixa'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('console-log'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('todo-comment'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('magic-number'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Fragilidades media'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('catch-vazio'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('catch-apenas-log'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('any-explicito'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('funcao-longa'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('promise-sem-catch'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('regex-complexa'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('if-muito-aninhado'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Fragilidades alta'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('complexidade-cognitiva'))).toBe(true);
  });

  it('aceita ast preColetado e respeita supressao inline', () => {
    const src = [
      '// @sensei-disable-next-line codigo-fragil',
      'const x = 1;',
    ].join('\n');

    const ocorrencias = analistaCodigoFragil.aplicar(src, 'src/pre.ts', {
      preColetado: [{
        tipo: 'magic-number',
        linha: 2,
        coluna: 0,
        severidade: 'baixa',
        contexto: 'Número mágico detectado',
      }],
    });

    expect(ocorrencias).toEqual([]);
  });
});
