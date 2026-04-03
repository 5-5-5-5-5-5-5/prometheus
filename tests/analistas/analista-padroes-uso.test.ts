import { parse } from '@babel/parser';
import { describe, expect, it } from 'vitest';

import {
  analistaPadroesUso,
  estatisticasUsoGlobal,
} from '@analistas/js-ts/analista-padroes-uso.js';
import { PadroesUsoMensagens } from '@core/messages/analistas/analista-padroes-uso-messages.js';

function createAst(src: string) {
  return parse(src, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });
}

function createScriptAst(src: string) {
  return parse(src, {
    sourceType: 'script',
    plugins: ['typescript', 'jsx'],
  });
}

describe('analistaPadroesUso', () => {
  it('seleciona apenas arquivos js/ts', () => {
    expect(analistaPadroesUso.test('src/app.ts')).toBe(true);
    expect(analistaPadroesUso.test('src/app.js')).toBe(true);
    expect(analistaPadroesUso.test('src/app.tsx')).toBe(false);
  });

  it('retorna null para arquivos de teste, configuracao ou ast invalido', () => {
    expect(analistaPadroesUso.aplicar('describe("x", () => {})', 'tests/app.test.ts', createAst('describe("x", () => {})'))).toBeNull();
    expect(analistaPadroesUso.aplicar('export default {}', 'vitest.config.ts', createAst('export default {}'))).toBeNull();
    expect(analistaPadroesUso.aplicar('const x = 1;', 'src/app.ts', { type: 'Identifier' } as never)).toBeNull();
  });

  it('detecta padroes desencorajados e atualiza estatisticas globais', () => {
    const src = [
      'var legacy = 1;',
      'let count = 0;',
      'const stable = 1;',
      'const dep = require("legacy");',
      'eval("run()");',
      'module.exports = stable;',
      'const anon = function () { return 1; };',
      'class Service {',
      '  handler = () => stable;',
      '}',
      'export { stable };',
    ].join('\n');

    const ocorrencias = analistaPadroesUso.aplicar(src, 'src/app.ts', createAst(src)) ?? [];
    const mensagens = ocorrencias.map((item) => item.mensagem);

    expect(mensagens).toContain(PadroesUsoMensagens.varUsage);
    expect(mensagens).toContain(PadroesUsoMensagens.letUsage);
    expect(mensagens).toContain(PadroesUsoMensagens.requireInTs);
    expect(mensagens).toContain(PadroesUsoMensagens.evalUsage);
    expect(mensagens).toContain(PadroesUsoMensagens.moduleExportsInTs);
    expect(mensagens).toContain(PadroesUsoMensagens.anonymousFunction);
    expect(mensagens).toContain(PadroesUsoMensagens.arrowAsClassMethod);

    expect(estatisticasUsoGlobal.vars['src/app.ts']).toBeGreaterThan(0);
    expect(estatisticasUsoGlobal.lets['src/app.ts']).toBeGreaterThan(0);
    expect(estatisticasUsoGlobal.consts['src/app.ts']).toBeGreaterThan(0);
    expect(estatisticasUsoGlobal.requires['src/app.ts']).toBeGreaterThan(0);
    expect(estatisticasUsoGlobal.exports['src/app.ts']).toBeGreaterThan(0);
    expect(estatisticasUsoGlobal.evals['src/app.ts']).toBeGreaterThan(0);
  });

  it('detecta uso de with em script', () => {
    const src = 'with (obj) { value = 1; }';

    const ocorrencias = analistaPadroesUso.aplicar(src, 'src/legacy.ts', createScriptAst(src)) ?? [];

    expect(ocorrencias.some((item) => item.mensagem === PadroesUsoMensagens.withUsage)).toBe(true);
    expect(estatisticasUsoGlobal.withs['src/legacy.ts']).toBeGreaterThan(0);
  });

  it('usa o ast vindo do contexto quando o ast direto nao e fornecido', () => {
    const src = 'var x = 1;';
    const ast = createAst(src);

    const ocorrencias = analistaPadroesUso.aplicar(src, 'src/context.ts', null, undefined, {
      arquivos: [{ relPath: 'src/context.ts', ast }],
    } as never) ?? [];

    expect(ocorrencias.some((item) => item.mensagem === PadroesUsoMensagens.varUsage)).toBe(true);
  });
});
