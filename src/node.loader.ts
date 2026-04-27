// SPDX-License-Identifier: MIT
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Loader ESM Universal - Suporta aliases do tsconfig.json em tempo de execução.
 */

const aliases: Record<string, string> = {
  '@bin': 'bin/index.ts',
  '@cli': 'cli/index.ts',
  '@cli/commands': 'cli/commands/index.ts',
  '@cli/diagnostico': 'cli/diagnostico/index.ts',
  '@cli/diagnostico/exporters': 'cli/diagnostico/exporters/index.ts',
  '@cli/diagnostico/handlers': 'cli/diagnostico/handlers/index.ts',
  '@cli/handlers': 'cli/handlers/index.ts',
  '@cli/helpers': 'cli/helpers/index.ts',
  '@cli/options': 'cli/options/index.ts',
  '@cli/processing': 'cli/processing/index.ts',
  '@core/config': 'core/config/index.ts',
  '@core/config/auto': 'core/config/auto/index.ts',
  '@core/execution': 'core/execution/index.ts',
  '@core/messages': 'core/messages/index.ts',
  '@core/parsing': 'core/parsing/index.ts',
  '@core/registry': 'core/registry/index.ts',
  '@core/reporting': 'core/reporting/index.ts',
  '@core/schema': 'core/schema/index.ts',
  '@core/utils': 'core/utils/index.ts',
  '@core/workers': 'core/workers/index.ts',
  '@core/': 'core/',
  '@guardian': 'guardian/index.ts',
  '@guardian/': 'guardian/',
  '@licensas': 'licensas/index.ts',
  '@licensas/': 'licensas/',
  '@projeto-types': 'types/index.ts',
  '@projeto-types/analistas': 'types/analistas/index.ts',
  '@projeto-types/cli': 'types/cli/index.ts',
  '@projeto-types/comum': 'types/comum/index.ts',
  '@projeto-types/core': 'types/core/index.ts',
  '@projeto-types/core/messages': 'types/core/messages/index.ts',
  '@projeto-types/estrutura': 'types/estrutura/index.ts',
  '@projeto-types/guardian': 'types/guardian/index.ts',
  '@projeto-types/licensas': 'types/licensas/index.ts',
  '@projeto-types/projeto': 'types/projeto/index.ts',
  '@projeto-types/relatorios': 'types/relatorios/index.ts',
  '@projeto-types/shared': 'types/shared/index.ts',
  '@projeto-types/zeladores': 'types/zeladores/index.ts',
  '@projeto-types/': 'types/',
  '@relatorios': 'relatorios/index.ts',
  '@relatorios/': 'relatorios/',
  '@sdk': 'sdk/index.ts',
  '@shared': 'shared/index.ts',
  '@shared/data-processing': 'shared/data-processing/index.ts',
  '@shared/helpers': 'shared/helpers/index.ts',
  '@shared/impar': 'shared/impar/index.ts',
  '@shared/persistence': 'shared/persistence/index.ts',
  '@shared/plugins': 'shared/plugins/index.ts',
  '@shared/validation': 'shared/validation/index.ts',
  '@shared/': 'shared/',
  '@src/': '',
  '@zeladores': 'zeladores/index.ts',
  '@zeladores/': 'zeladores/',
  '@': 'types/index.ts',
  '@/': 'src/',
  '@analistas/arquitetos': 'analistas/arquitetos/index.ts',
  '@analistas/corrections/quick-fixes': 'analistas/corrections/quick-fixes/index.ts',
  '@analistas/corrections/type-safety': 'analistas/corrections/type-safety/index.ts',
  '@analistas/detectores': 'analistas/detectores/index.ts',
  '@analistas/estrategistas': 'analistas/estrategistas/index.ts',
  '@analistas/js-ts': 'analistas/js-ts/index.ts',
  '@analistas/plugins': 'analistas/plugins/index.ts',
  '@analistas/pontuadores': 'analistas/pontuadores/index.ts',
  '@analistas/registry': 'analistas/registry/index.ts',
  '@analistas/': 'analistas/',
};

export async function resolve(
  specifier: string,
  context: { parentURL?: string },
  nextResolve: (specifier: string, context: { parentURL?: string }) => Promise<{ url: string; shortCircuit: boolean }>
): Promise<{ url: string; shortCircuit: boolean }> {
  if (!specifier.startsWith('@')) {
    return nextResolve(specifier, context);
  }

  const sortedAliases = Object.entries(aliases).sort((a, b) => b[0].length - a[0].length);

  for (const [prefix, replacement] of sortedAliases) {
    const isExactMatch = specifier === prefix;
    const isPrefixMatch = prefix.endsWith('/') && specifier.startsWith(prefix);

    if (isExactMatch || isPrefixMatch) {
      const remaining = isExactMatch ? '' : specifier.slice(prefix.length);
      const newPath = replacement + remaining;

      let basePath = process.cwd();
      if (context.parentURL) {
        try {
          const parentPath = fileURLToPath(context.parentURL);
          if (parentPath.includes('/src/')) {
            basePath = join(parentPath.split('/src/')[0], 'src');
          } else if (parentPath.includes('/dist/')) {
            basePath = join(parentPath.split('/dist/')[0], 'dist');
          }
        } catch {}
      }

      const fullPath = join(basePath, newPath);
      let foundFile = '';

      const tryFile = (p: string) => {
        if (existsSync(p) && statSync(p).isFile()) {
          foundFile = p;
          return true;
        }
        return false;
      };

      const exts = ['.ts', '.js', '.tsx', '.mjs', '.cjs'];

      if (!tryFile(fullPath)) {
        for (const ext of exts) {
          if (tryFile(fullPath + ext)) break;
        }

        if (!foundFile && !fullPath.includes('.')) {
          for (const ext of exts) {
            if (tryFile(join(fullPath, `index${ext}`))) break;
          }
        }
      }

      if (foundFile) {
        return {
          url: pathToFileURL(foundFile).href,
          shortCircuit: true,
        };
      }
    }
  }

  return nextResolve(specifier, context);
}

export async function load(
  url: string,
  context: { format?: string },
  nextLoad: (url: string, context: { format?: string }) => Promise<{ format: string; source?: string }>
): Promise<{ format: string; source?: string }> {
  return nextLoad(url, context);
}