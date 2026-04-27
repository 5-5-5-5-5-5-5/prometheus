// SPDX-License-Identifier: MIT
import path from 'node:path';

import { traverse } from '@core/config';
import { scanRepository } from '@core/execution';
import { getMessages } from '@core/messages';
import { decifrarSintaxe } from '@core/parsing';

import type { Ocorrencia, ScanPadronizacaoOptions } from '@';

const { CliComandoPadronizadorMensagens: msgs } = getMessages();

export async function scanPadronizacao(
  options: ScanPadronizacaoOptions,
): Promise<Ocorrencia[]> {
  const { baseDir } = options;
  const ocorrencias: Ocorrencia[] = [];

  const fileMap = await scanRepository(baseDir, {
    includeContent: true,
    filter: (relPath) =>
      /\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(relPath) &&
      !relPath.includes('node_modules') &&
      !relPath.includes('dist'),
  });

  for (const entry of Object.values(fileMap)) {
    const relPath = entry.relPath;
    const code = typeof entry.content === 'string' ? entry.content : '';

    const ast = await decifrarSintaxe(code, path.extname(relPath), { relPath });
    if (!ast) continue;

    traverse(ast, {
      BinaryExpression(p: import('@babel/traverse').NodePath<import('@babel/types').BinaryExpression>) {
        const { node } = p;
        if (node.operator === '==' || node.operator === '!=') {
          const isNullCheck = (n: import('@babel/types').Node) =>
            n.type === 'NullLiteral' ||
            (n.type === 'Identifier' && n.name === 'undefined');
          if (isNullCheck(node.right) || isNullCheck(node.left)) return;

          const linha = node.loc?.start.line ?? 0;
          const coluna = node.loc?.start.column ?? 0;
          ocorrencias.push({
            tipo: 'problema-padronizacao',
            nivel: 'aviso',
            mensagem: msgs.detalheOcorrencia
              .replace('{linha}', String(linha))
              .replace('{coluna}', String(coluna))
              .replace('{operador}', node.operator)
              .replace('{sugerido}', node.operator === '==' ? '===' : '!=='),
            relPath,
            linha,
            coluna,
            sugestao: `Use ${node.operator === '==' ? '===' : '!=='}`,
          });
        }
      },
      TSAsExpression(p: import('@babel/traverse').NodePath<import('@babel/types').TSAsExpression>) {
        const { node } = p;
        if (node.typeAnnotation && node.typeAnnotation.type === 'TSAnyKeyword') {
          const linha = node.loc?.start.line ?? 0;
          const coluna = node.loc?.start.column ?? 0;
          ocorrencias.push({
            tipo: 'problema-padronizacao',
            nivel: 'aviso',
            mensagem: msgs.asAnyEncontrado
              .replace('{linha}', String(linha))
              .replace('{coluna}', String(coluna)),
            relPath,
            linha,
            coluna,
            sugestao: 'Use "as unknown" ou tipagem adequada',
          });
        }
      },
      TSTypeAssertion(p: import('@babel/traverse').NodePath<import('@babel/types').TSTypeAssertion>) {
        const { node } = p;
        const linha = node.loc?.start.line ?? 0;
        const coluna = node.loc?.start.column ?? 0;
        ocorrencias.push({
          tipo: 'problema-padronizacao',
          nivel: 'aviso',
          mensagem: `[${linha}:${coluna}] Angle-bracket assertion detectada. Considere usar a sintaxe "as".`,
          relPath,
          linha,
          coluna,
          sugestao: 'Use "expression as Type" ao invés de "<Type>expression"',
        });
      },
    });
  }

  return ocorrencias;
}