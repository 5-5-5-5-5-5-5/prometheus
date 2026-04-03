import { parse } from '@babel/parser';
import { describe, expect, it } from 'vitest';

import {
  analistaComandosCli,
  extractHandlerInfo,
} from '@analistas/js-ts/analista-comandos-cli.js';

function createAst(src: string) {
  return {
    node: parse(src, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    }),
  } as never;
}

describe('analistaComandosCli', () => {
  it('extrai informacoes de handlers validos e rejeita casos invalidos', () => {
    const fnAst = parse('function run(a, b) { return a + b; }', {
      sourceType: 'module',
    }).program.body[0];
    const arrowExpr = parse('const fn = () => 1;', {
      sourceType: 'module',
    }).program.body[0];

    const info = extractHandlerInfo(fnAst);

    expect(info?.isAnonymous).toBe(false);
    expect(info?.totalParams).toBe(2);
    expect(extractHandlerInfo((arrowExpr as any).declarations[0].init)?.bodyBlock).toBeUndefined();
    expect(extractHandlerInfo(null)).toBeNull();
  });

  it('seleciona apenas arquivos js/ts fora de testes', () => {
    expect(analistaComandosCli.test('src/commands/run.ts')).toBe(true);
    expect(analistaComandosCli.test('tests/commands/run.test.ts')).toBe(false);
    expect(analistaComandosCli.test('src/style.css')).toBe(false);
  });

  it('detecta padroes problematicos em handlers commander', () => {
    const bodyStatements = Array.from({ length: 31 }, (_, i) => `const step${i} = ${i};`).join('\n');
    const src = [
      'import { Command } from "commander";',
      'const program = new Command();',
      'program.command("sync").action((a, b, c, d) => {',
      bodyStatements,
      '});',
      'program.command("sync").action(function named(ctx) {',
      '  try {',
      '    ctx.reply("ok");',
      '  } catch (error) {',
      '    throw error;',
      '  }',
      '});',
    ].join('\n');

    const ocorrencias = analistaComandosCli.aplicar(src, 'src/commands/sync.ts', createAst(src)) ?? [];
    const mensagens = ocorrencias.map((item) => item.mensagem);

    expect(mensagens.some((msg) => msg.includes('Comandos duplicados detectados: sync'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('função anônima'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('muitos parâmetros (4)'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('muito longo (31 statements)'))).toBe(true);
    expect(mensagens.some((msg) => msg.includes('não possui bloco try/catch'))).toBe(true);
  });

  it('reporta padrao ausente quando o arquivo parece CLI mas nao registra comandos', () => {
    const src = [
      'const args = process.argv.slice(2);',
      'export function parseArgs() {',
      '  return args.filter(Boolean);',
      '}',
    ].join('\n');

    const ocorrencias = analistaComandosCli.aplicar(src, 'src/commands/parse-args.ts', createAst(src)) ?? [];

    expect(ocorrencias).toHaveLength(1);
    expect(ocorrencias[0]?.mensagem).toContain('Possível arquivo de comando sem registro detectado');
  });

  it('reconhece registro generico via registerCommand sem emitir avisos de handler saudavel', () => {
    const src = [
      'function execute(ctx) {',
      '  try {',
      '    ctx.reply("done");',
      '  } catch (error) {',
      '    ctx.reply("fail");',
      '  }',
      '}',
      'registerCommand("deploy", execute);',
    ].join('\n');

    const ocorrencias = analistaComandosCli.aplicar(src, 'src/commands/deploy.ts', createAst(src)) ?? [];

    expect(ocorrencias).toEqual([]);
  });
});
