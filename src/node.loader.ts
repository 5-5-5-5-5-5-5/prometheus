// SPDX-License-Identifier: MIT
// Use "npm run sync-aliases" para atualizar os aliases

/**
 * Loader ESM Universal - src/
 * Resolver autossuficiente com todas as funcionalidades integradas
 */
import { existsSync } from 'node:fs';
import { join, resolve as resolvePath } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { ResolveContext, ResolveResult } from './types/core/config/config.js';

export type { ResolveContext, ResolveResult };

// Mapeamento de aliases baseado no tsconfig.json
const aliases: Record<string, string> = {
  '@core/': 'core/',
  '@shared/': 'shared/',
  '@analistas/': 'analistas/',
  '@relatorios/': 'relatorios/',
  '@guardian/': 'guardian/',
  '@licensas/': 'licensas/',
  '@cli/': 'cli/',
  '@zeladores/': 'zeladores/',
  '@types/types': 'types/index.ts',
  '@types/analistas': 'types/analistas/index.ts',
  '@types/guardian': 'types/guardian/index.ts',
  '@types/cli': 'types/cli/index.ts',
  '@types/core': 'types/core/index.ts',
  '@types/relatorios': 'types/relatorios/index.ts',
  '@types/shared': 'types/shared/index.ts',
  '@types/projeto': 'types/projeto/index.ts',
  '@types/': 'types/',
  '@src/': '',
  '@/': '',
  '@': 'types/index.ts',
};

export async function resolve(
  specifier: string,
  context: ResolveContext,
  nextResolve: (specifier: string, context: ResolveContext) => Promise<ResolveResult>
): Promise<ResolveResult> {
  // Se não é um alias, passa para o próximo resolver
  if (!specifier.startsWith('@')) {
    return nextResolve(specifier, context);
  }

  // Procura pelo alias correspondente (ordena por tamanho decrescente para priorizar match mais específico)
  let resolved: string | null = null;
  const sortedAliases = Object.entries(aliases).sort((a, b) => b[0].length - a[0].length);

  for (const [prefix, replacement] of sortedAliases) {
    const isExactMatch = specifier === prefix;
    const isPrefixMatch = prefix.endsWith('/') && specifier.startsWith(prefix);

    if (isExactMatch || isPrefixMatch) {
      const remaining = isExactMatch ? '' : specifier.slice(prefix.length);
      const newPath = replacement + remaining;

      // Determina o caminho base (assumindo que estamos em src/ ou dist/)
      const parentURL = context.parentURL;
      let basePath = '';

      if (parentURL) {
        const parentPath = new URL(parentURL).pathname;
        if (parentPath.includes('/dist/')) {
          basePath = resolvePath(parentPath.split('/dist/')[0], 'dist');
        } else if (parentPath.includes('/src/')) {
          basePath = resolvePath(parentPath.split('/src/')[0], 'src');
        } else {
          // Fallback para src/
          basePath = resolvePath(process.cwd(), 'src');
        }
      } else {
        basePath = resolvePath(process.cwd(), 'src');
      }

      let fullPath = join(basePath, newPath);

      // Se o arquivo termina em .js mas estamos no src, ele pode ser .ts
      if (basePath.endsWith('/src') && fullPath.endsWith('.js')) {
        const tsPath = `${fullPath.slice(0, -3)  }.ts`;
        const tsxPath = `${fullPath.slice(0, -3)  }.tsx`;
        if (existsSync(tsPath)) {
          fullPath = tsPath;
        } else if (existsSync(tsxPath)) {
          fullPath = tsxPath;
        }
      }

      // Tenta diferentes extensões se o caminho exato não existir
      const extensions = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
      let finalPath = fullPath;

      if (!existsSync(fullPath)) {
        let found = false;
        // Se já tem uma das extensões, tenta removê-la e testar as outras
        const currentExt = extensions.find(ext => fullPath.endsWith(ext));
        const pathSemExt = currentExt ? fullPath.slice(0, -currentExt.length) : fullPath;

        for (const ext of extensions) {
          const testPath = pathSemExt + ext;
          if (existsSync(testPath)) {
            finalPath = testPath;
            found = true;
            break;
          }
        }

        if (!found) {
          // Tenta como diretório com index
          for (const ext of extensions) {
            const testPath = join(pathSemExt, `index${  ext}`);
            if (existsSync(testPath)) {
              finalPath = testPath;
              break;
            }
          }
        }
      }

      resolved = pathToFileURL(finalPath).href;
      break;
    }
  }

  if (resolved) {
    return {
      url: resolved,
      shortCircuit: true,
    };
  }

  // Se não conseguiu resolver, passa para o próximo
  return nextResolve(specifier, context);
}
