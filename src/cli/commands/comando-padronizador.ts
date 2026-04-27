// SPDX-License-Identifier: MIT
import path from 'node:path';

import { generate, traverse } from '@core/config';
import { scanRepository } from '@core/execution';
import { getMessages } from '@core/messages';
import { decifrarSintaxe } from '@core/parsing';
import { formatarComPrettierProjeto } from '@shared/impar';
import { salvarEstado } from '@shared/persistence';
import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';

import { scanPadronizacao } from '../diagnostico/handlers/padronizador-handler.js';

const { CliComandoPadronizadorMensagens: msgs } = getMessages();

export function comandoPadronizador(
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Command {
  return new Command('padronizador')
    .description(msgs.descricao)
    .option('--scan', 'Apenas escaneia e reporta padrões não padronizados')
    .option('--replace', 'Aplica padronização automática com alta confiança')
    .action(async function (this: Command, opts: { scan?: boolean; replace?: boolean }) {
      await aplicarFlagsGlobais(
        this.parent && typeof this.parent.opts === 'function'
          ? this.parent.opts()
          : {},
      );

      if (!opts.scan && !opts.replace) {
        console.log(chalk.yellow('Por favor, especifique uma flag: --scan ou --replace'));
        return;
      }

      const spinner = ora(msgs.escaneando).start();
      const baseDir = process.cwd();

      try {
        if (!opts.replace) {
          const ocorrencias = await scanPadronizacao({ baseDir, silent: true });
          if (ocorrencias.length === 0) {
            spinner.succeed(msgs.totalEncontrado.replace('{total}', '0'));
            return;
          }
          const porArquivo = new Map<string, typeof ocorrencias>();
          for (const oc of ocorrencias) {
            if (!porArquivo.has(oc.relPath)) porArquivo.set(oc.relPath, []);
            porArquivo.get(oc.relPath)?.push(oc);
          }
          for (const [arquivo, ocorrenciasArquivo] of porArquivo) {
            console.log(chalk.cyan(`\n${msgs.arquivoProcessado.replace('{path}', arquivo)}`));
            for (const oc of ocorrenciasArquivo) {
              console.log(`  ${oc.mensagem}`);
            }
          }
          spinner.succeed(msgs.totalEncontrado.replace('{total}', String(ocorrencias.length)));
          return;
        }

        const fileMap = await scanRepository(baseDir, {
          includeContent: true,
          filter: (relPath) => /\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(relPath) && !relPath.includes('node_modules') && !relPath.includes('dist'),
        });

        const entries = Object.values(fileMap);
        let arquivosAfetados = 0;

        for (const entry of entries) {
          const relPath = entry.relPath;
          const code = typeof entry.content === 'string' ? entry.content : '';

          const ast = await decifrarSintaxe(code, path.extname(relPath), { relPath });
          if (!ast) continue;

          let modified = false;
          let fileOcorrencias = 0;
          const inconsistencias: string[] = [];

          traverse(ast, {
            BinaryExpression(p: import('@babel/traverse').NodePath<import('@babel/types').BinaryExpression>) {
              const { node } = p;
              if (node.operator === '==' || node.operator === '!=') {
                const isNullCheck = (n: import('@babel/types').Node) =>
                  n.type === 'NullLiteral' ||
                  (n.type === 'Identifier' && n.name === 'undefined');
                if (isNullCheck(node.right) || isNullCheck(node.left)) return;

                const sugerido = node.operator === '==' ? '===' : '!==';
                fileOcorrencias++;

                inconsistencias.push(msgs.detalheOcorrencia
                  .replace('{linha}', String(node.loc?.start.line || 0))
                  .replace('{coluna}', String(node.loc?.start.column || 0))
                  .replace('{operador}', node.operator)
                  .replace('{sugerido}', sugerido));
                node.operator = sugerido as '===' | '!==';
                modified = true;
              }
            },
            TSAsExpression(p: import('@babel/traverse').NodePath<import('@babel/types').TSAsExpression>) {
              const { node } = p;
              if (node.typeAnnotation && node.typeAnnotation.type === 'TSAnyKeyword') {
                fileOcorrencias++;
                inconsistencias.push(msgs.asAnyEncontrado
                  .replace('{linha}', String(node.loc?.start.line || 0))
                  .replace('{coluna}', String(node.loc?.start.column || 0)));
              }
            },
            TSTypeAssertion(p: import('@babel/traverse').NodePath<import('@babel/types').TSTypeAssertion>) {
              const { node } = p;
              fileOcorrencias++;
              const { expression, typeAnnotation } = node;
              p.replaceWith({
                type: 'TSAsExpression',
                expression,
                typeAnnotation,
              });
              modified = true;
            },
          });

          if (fileOcorrencias > 0 || modified) {
            arquivosAfetados++;
            const generated = generate(ast, {
              retainLines: true,
              comments: true,
            });

            const final = await formatarComPrettierProjeto({
              code: generated.code,
              relPath,
              baseDir,
            });

            const contentToWrite = final.ok ? final.formatted : generated.code;
            await salvarEstado(path.resolve(baseDir, relPath), contentToWrite);
          }
        }

        spinner.succeed(msgs.alteracoesConcluidas.replace('{total}', String(arquivosAfetados)));

      } catch (error) {
        spinner.fail(`Erro: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
}