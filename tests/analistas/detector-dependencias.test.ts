import { parse } from '@babel/parser';
import { describe, expect, it } from 'vitest';

import {
  detectorDependencias,
  grafoDependencias,
  importsUsadosDinamicamente,
  isUsadoEmRegistroDinamico,
} from '@analistas/detectores/detector-dependencias.js';

function createAst(src: string) {
  return {
    node: parse(src, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    }),
  } as never;
}

describe('detectorDependencias', () => {
  it('detecta uso dinamico por padroes comuns de registro', () => {
    const src = [
      'registry.register(myPlugin);',
      'app.use(myPlugin);',
      'client.on("ready", myPlugin);',
      'const reducers = { myPlugin };',
    ].join('\n');

    expect(isUsadoEmRegistroDinamico(src, 'myPlugin')).toBe(true);
    expect(isUsadoEmRegistroDinamico(src, 'otherPlugin')).toBe(false);
  });

  it('retorna vazio sem AST e so aceita ts/js', () => {
    expect(detectorDependencias.test('src/app.ts')).toBe(true);
    expect(detectorDependencias.test('src/app.js')).toBe(true);
    expect(detectorDependencias.test('src/app.tsx')).toBe(false);
    expect(detectorDependencias.aplicar('import x from "y";', 'src/app.ts', null)).toEqual([]);
  });

  it('detecta import externo, caminho relativo longo, js em ts, arquivo inexistente e uso misto', () => {
    grafoDependencias.clear();
    importsUsadosDinamicamente.clear();

    const src = [
      'import ext from "lodash";',
      'import missing from "../../../../missing.js";',
      'const legacy = require("chalk");',
      'const local = require("../../../../ghost.js");',
    ].join('\n');

    const ocorrencias = detectorDependencias.aplicar(src, 'src/module.ts', createAst(src), undefined, {
      arquivos: [{ relPath: 'src/module.ts' }],
    } as never);
    const mensagens = ocorrencias.map((item) => item.mensagem);

    expect(mensagens.some((msg) => msg.includes('dependência externa: \'lodash\''))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Import relativo sobe muitos diretórios'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Importação de arquivo .js em TypeScript'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Importação de arquivo inexistente'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Require de dependência externa: \'chalk\''))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Require relativo sobe muitos diretórios'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Require de arquivo .js em TypeScript'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('Require de arquivo inexistente'))).toBe(true);
    expect(mensagens).toContain('Uso misto de require e import no mesmo arquivo. Padronize para um só estilo.');
  });

  it('ignora import type no grafo e registra imports usados dinamicamente', () => {
    grafoDependencias.clear();
    importsUsadosDinamicamente.clear();

    const src = [
      'import type { Foo } from "./types";',
      'import plugin from "./plugin";',
      'registry.register(plugin);',
    ].join('\n');

    detectorDependencias.aplicar(src, 'src/runtime.ts', createAst(src), undefined, {
      arquivos: [{ relPath: 'src/runtime.ts' }, { relPath: 'src/plugin.ts' }, { relPath: 'src/types.ts' }],
    } as never);

    expect(grafoDependencias.get('src/runtime.ts')).toEqual(new Set(['src/plugin.ts']));
    expect(importsUsadosDinamicamente.get('src/runtime.ts')).toEqual(new Set(['plugin']));
  });

  it('detecta ciclo circular simples e complexo no grafo', () => {
    grafoDependencias.clear();
    importsUsadosDinamicamente.clear();

    grafoDependencias.set('src/b.ts', new Set(['src/c.ts']));
    grafoDependencias.set('src/c.ts', new Set(['src/a.ts']));

    const selfSrc = 'import self from "./self";';
    const selfOcc = detectorDependencias.aplicar(selfSrc, 'src/self.ts', createAst(selfSrc), undefined, {
      arquivos: [{ relPath: 'src/self.ts' }],
    } as never);
    expect(selfOcc.some((item) => item.mensagem.includes('Importação circular detectada'))).toBe(true);

    const src = 'import b from "./b";';
    const ocorrencias = detectorDependencias.aplicar(src, 'src/a.ts', createAst(src), undefined, {
      arquivos: [{ relPath: 'src/a.ts' }, { relPath: 'src/b.ts' }, { relPath: 'src/c.ts' }],
    } as never);

    expect(ocorrencias.some((item) => item.mensagem.includes('Dependência circular detectada'))).toBe(true);
    expect(ocorrencias.some((item) => item.contexto?.includes('src/a.ts'))).toBe(true);
  });
});
