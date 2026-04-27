// SPDX-License-Identifier: MIT
// Analista de padronização: detecta operadores soltos (==, !=), "as any" e angle-bracket assertions
import type { NodePath } from '@babel/traverse';
import type { Node } from '@babel/types';
import { traverse } from '@core/config';
import { filtrarOcorrenciasSuprimidas } from '@shared/helpers';

import type { Analista, Ocorrencia } from '@';
import { criarOcorrencia } from '@';

export const analistaPadronizador: Analista = {
  nome: 'padronizador',
  categoria: 'padronizacao',
  descricao: 'Detecta padrões não padronizados: operadores soltos (==, !=), "as any" e angle-bracket assertions',
  test: (relPath: string): boolean => {
    return /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(relPath);
  },
  aplicar: (src: string, relPath: string, ast: NodePath<Node> | null): Ocorrencia[] => {
    if (!src || !ast) return [];

    const ocorrencias: Ocorrencia[] = [];

    try {
      traverse(ast.node, {
        BinaryExpression(path: NodePath<import('@babel/types').BinaryExpression>) {
          const { node } = path;
          if (node.operator === '==' || node.operator === '!=') {
            // Ignorar comparações com null/undefined (convenção aceita)
            const isNullCheck = (n: import('@babel/types').Node) =>
              n.type === 'NullLiteral' || (n.type === 'Identifier' && n.name === 'undefined');
            if (isNullCheck(node.right) || isNullCheck(node.left)) {
              return;
            }

            const sugerido = node.operator === '==' ? '===' : '!==';
            ocorrencias.push(criarOcorrencia({
              tipo: 'problema-padronizacao',
              nivel: 'aviso',
              mensagem: `Operador "${node.operator}" pode ser padronizado para "${sugerido}"`,
              relPath,
              linha: node.loc?.start.line,
              coluna: node.loc?.start.column,
              sugestao: `Substitua "${node.operator}" por "${sugerido}" para comparação estrita`,
            }));
          }
        },
        TSAsExpression(path: NodePath<import('@babel/types').TSAsExpression>) {
          const { node } = path;
          if (node.typeAnnotation && node.typeAnnotation.type === 'TSAnyKeyword') {
            ocorrencias.push(criarOcorrencia({
              tipo: 'problema-padronizacao',
              nivel: 'aviso',
              mensagem: '"as any" detectado. Considere usar "as unknown" ou um tipo mais específico.',
              relPath,
              linha: node.loc?.start.line,
              coluna: node.loc?.start.column,
              sugestao: 'Substitua "as any" por "as unknown" ou um tipo mais específico para manter type-safety',
            }));
          }
        },
        TSTypeAssertion(path: NodePath<import('@babel/types').TSTypeAssertion>) {
          const { node } = path;
          ocorrencias.push(criarOcorrencia({
            tipo: 'problema-padronizacao',
            nivel: 'aviso',
            mensagem: 'Angle-bracket assertion detectada. Considere usar a sintaxe "as".',
            relPath,
            linha: node.loc?.start.line,
            coluna: node.loc?.start.column,
            sugestao: 'Use a sintaxe "value as Type" em vez de "<Type>value" para consistência com TSX',
          }));
        },
      });
    } catch {
      // Ignorar erros de traverse para não quebrar a análise
    }

    return filtrarOcorrenciasSuprimidas(ocorrencias, 'padronizador', src);
  },
};
