// SPDX-License-Identifier: MIT
import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';

import { scanImports } from '../diagnostico/handlers/importer-handler.js';

const TSCONFIG_PATH = path.resolve(process.cwd(), 'tsconfig.json');
const SRC_DIR = path.resolve(process.cwd(), 'src');

function getBaseAliases(paths: Record<string, string[]>) {
  const bases: { prefix: string; target: string }[] = [];

  for (const [key, values] of Object.entries(paths)) {
    if (key.endsWith('/*') && values[0]?.endsWith('/*')) {
      bases.push({
        prefix: key.slice(0, -2),
        target: values[0].slice(0, -2),
      });
    }
  }

  try {
    const folders = fs.readdirSync(SRC_DIR).filter(f => fs.statSync(path.join(SRC_DIR, f)).isDirectory());
    for (const folder of folders) {
      const prefix = `@${folder}`;
      const target = `./src/${folder}`;
      if (!bases.some(b => b.prefix === prefix)) {
        bases.push({ prefix, target });
      }
    }
  } catch {}

  if (!bases.some(b => b.prefix === '@')) bases.push({ prefix: '@', target: './src/types/index' });
  if (!bases.some(b => b.prefix === '@/')) bases.push({ prefix: '@/', target: './src/' });
  if (!bases.some(b => b.prefix === '@src')) bases.push({ prefix: '@src', target: './src' });

  return bases.sort((a, b) => b.target.length - a.target.length);
}

function scanBarrels(originalBases: { prefix: string; target: string }[], removeWildcards = false) {
  const spinner = ora('Escaneando barrels...').start();
  const barrels: { alias: string; path: string }[] = [];

  const tsconfig = JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf-8'));
  const paths = tsconfig.compilerOptions.paths || {};

  function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        if (file === 'node_modules' || file === 'dist' || file.startsWith('.')) continue;
        walk(fullPath);
      } else if (file === 'index.ts') {
        const relativePath = `./${path.relative(process.cwd(), fullPath)}`;
        const folderPath = `./${path.relative(process.cwd(), dir)}`;

        if (folderPath.includes('/messages/') || (folderPath.endsWith('/messages') && !folderPath.endsWith('core/messages'))) {
            if (folderPath !== './src/core/messages') {
                continue;
            }
        }

        const base = originalBases.find(b => folderPath.startsWith(b.target));
        if (base) {
          const subFolder = folderPath.slice(base.target.length);
          let alias = base.prefix + (subFolder.startsWith('/') ? subFolder : (subFolder ? `/${subFolder}` : ''));

          if (alias.startsWith('@types')) {
             alias = alias.replace(/^@types/, '@projeto-types');
          }

          if (!paths[alias]) {
            barrels.push({ alias, path: relativePath });
          }
        }
      }
    }
  }

  walk(SRC_DIR);

  let changed = barrels.length > 0;
  if (removeWildcards) {
    for (const key of Object.keys(paths)) {
      if (key.endsWith('/*')) {
        delete paths[key];
        changed = true;
      }
    }
  }

  if (changed) {
    for (const barrel of barrels) {
      paths[barrel.alias] = [barrel.path];
    }

    const sortedPaths: Record<string, string[]> = {};
    Object.keys(paths).sort().forEach(key => {
      sortedPaths[key] = paths[key];
    });

    tsconfig.compilerOptions.paths = sortedPaths;
    fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(tsconfig, null, 2));
    spinner.succeed(`tsconfig.json atualizado: ${barrels.length} aliases adicionados${removeWildcards ? ' e wildcards removidos' : ''}.`);
  } else {
    spinner.info('Nenhum novo barrel encontrado.');
  }
}

function replaceImports(originalBases: { prefix: string; target: string }[]) {
  const spinner = ora('Substituindo imports...').start();
  const tsconfig = JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf-8'));
  const paths: Record<string, string[]> = tsconfig.compilerOptions.paths || {};

  const pathToAlias: Record<string, string> = {};

  function addAlias(target: string, alias: string) {
    const normTarget = target.startsWith('./') ? target : `./${target}`;
    const existing = pathToAlias[normTarget];
    if (!existing) {
        pathToAlias[normTarget] = alias;
        return;
    }
    if (alias.length < existing.length) {
        pathToAlias[normTarget] = alias;
    }
  }

  for (const [alias, targets] of Object.entries(paths)) {
    if (alias.includes('*')) continue;
    const target = targets[0];
    if (target) {
      const cleanTarget = target.replace(/\.(js|ts)$/, '');
      addAlias(target, alias);
      addAlias(cleanTarget, alias);
      if (target.endsWith('/index.ts')) {
        addAlias(target.slice(0, -9), alias);
      }
    }
  }

  let modifiedFilesCount = 0;

  function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            if (file === 'node_modules' || file === 'dist' || file.startsWith('.')) continue;
            walk(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let modified = false;

            const importExportRegex = /((?:import|export)\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"])|(import\(['"]([^'"]+)['"]\))/g;

            const relativeFileDir = `./${path.relative(process.cwd(), path.dirname(fullPath))}`;
            const fileBase = originalBases.find(b => relativeFileDir.startsWith(b.target) && b.prefix !== '@' && b.prefix !== '@/');

            content = content.replace(importExportRegex, (match, staticPart, staticPath, dynamicPart, dynamicPath) => {
                const importPath = staticPath || dynamicPath;
                if (!importPath || typeof importPath !== 'string') return match;

                if (!importPath.startsWith('.') && !importPath.startsWith('@')) return match;

                let resolvedPath = '';
                const cleanImportPath = importPath.replace(/\.(js|ts)$/, '');

                if (importPath.startsWith('.')) {
                    resolvedPath = `./${path.relative(process.cwd(), path.resolve(path.dirname(fullPath), cleanImportPath))}`;
                } else {
                    const base = originalBases.find(b => {
                        if (cleanImportPath === b.prefix) return true;
                        if (b.prefix.endsWith('/')) return cleanImportPath.startsWith(b.prefix);
                        return cleanImportPath.startsWith(`${b.prefix}/`);
                    });
                    if (base) {
                        const isExact = cleanImportPath === base.prefix;
                        const sub = isExact ? '' : cleanImportPath.slice(base.prefix.length + (base.prefix.endsWith('/') ? 0 : 1));
                        resolvedPath = base.target + (sub ? (base.target.endsWith('/') ? '' : '/') + sub : '');
                    }
                }

                if (resolvedPath) {
                    const normalizedResolved = resolvedPath.startsWith('./') ? resolvedPath : `./${resolvedPath}`;

                    let mustForceRelative = false;
                    if (fileBase) {
                        if (normalizedResolved.startsWith(fileBase.target)) {
                            mustForceRelative = true;
                        }
                    }

                    const cleanNormalized = normalizedResolved.replace(/\.(js|ts)$/, '');
                    const dirNormalized = path.dirname(normalizedResolved);

                    const candidates = [
                        `${normalizedResolved}.ts`,
                        `${normalizedResolved}/index.ts`,
                        normalizedResolved,
                        cleanNormalized,
                        dirNormalized,
                        `${dirNormalized}/index.ts`,
                    ];

                    let matchedAlias = '';
                    if (!mustForceRelative) {
                        for (const cand of candidates) {
                            if (pathToAlias[cand]) {
                                let candidateAlias = pathToAlias[cand];
                                if (candidateAlias.startsWith('@types')) {
                                    candidateAlias = candidateAlias.replace(/^@types/, '@projeto-types');
                                }

                                if (file === 'index.ts') {
                                    const relativeDir = `./${path.relative(process.cwd(), dir)}`;
                                    if (pathToAlias[relativeDir] === candidateAlias) {
                                        continue;
                                    }
                                }
                                matchedAlias = candidateAlias;
                                break;
                            }
                        }

                        if (!matchedAlias && importPath.startsWith('@types/')) {
                            matchedAlias = importPath.replace(/^@types\//, '@projeto-types/');
                        }
                    }

                    if (matchedAlias) {
                        if (matchedAlias !== importPath) {
                            modified = true;
                            return match.replace(importPath, matchedAlias);
                        }
                    } else {
                        const absoluteImportedPath = path.resolve(process.cwd(), resolvedPath);
                        let newRelativePath = path.relative(path.dirname(fullPath), absoluteImportedPath);
                        if (!newRelativePath.startsWith('.')) newRelativePath = `./${newRelativePath}`;

                        const fullTarget = path.resolve(process.cwd(), resolvedPath);
                        let finalPath = newRelativePath;

                        if (fs.existsSync(fullTarget) && fs.statSync(fullTarget).isDirectory()) {
                            finalPath = finalPath.endsWith('/') ? `${finalPath}index.js` : `${finalPath}/index.js`;
                        } else if (fs.existsSync(`${fullTarget}.ts`) || fs.existsSync(`${fullTarget}/index.ts`)) {
                             if (fs.existsSync(`${fullTarget}.ts`)) {
                                 finalPath += '.js';
                             } else {
                                 finalPath = finalPath.endsWith('/') ? `${finalPath}index.js` : `${finalPath}/index.js`;
                             }
                        } else {
                            if (!finalPath.endsWith('.js') && !finalPath.endsWith('.ts')) {
                                finalPath += '.js';
                            }
                        }

                        if (finalPath !== importPath) {
                            modified = true;
                            return match.replace(importPath, finalPath);
                        }
                    }
                }

                return match;
            });

            if (modified) {
                fs.writeFileSync(fullPath, content);
                modifiedFilesCount++;
            }
        }
    }
  }

  walk(SRC_DIR);
  spinner.succeed(`Processo concluído. ${modifiedFilesCount} arquivos atualizados.`);
}

export function comandoImporter(
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Command {
  return new Command('importer')
    .description('Gerencia aliases de barrels no tsconfig e atualiza imports no projeto')
    .option('--scan', 'Faz a varredura no projeto e atualiza o tsconfig.json')
    .option('--replace', 'Substitui os imports no projeto para usar os novos aliases')
    .action(async function (this: Command, opts: { scan?: boolean; replace?: boolean }) {
      try {
        await aplicarFlagsGlobais(
          this.parent && typeof this.parent.opts === 'function'
            ? this.parent.opts()
            : {},
        );

        if (!opts.scan && !opts.replace) {
          const baseDir = process.cwd();
          const ocorrencias = await scanImports({ baseDir, silent: true });
          if (ocorrencias.length === 0) {
            console.log(chalk.green('Nenhum problema de import encontrado.'));
            return;
          }
          console.log(chalk.yellow(`Encontrados ${ocorrencias.length} problema(s) de import:`));
          for (const oc of ocorrencias) {
            console.log(`  ${oc.mensagem}`);
            if (oc.sugestao) console.log(`    ${chalk.gray(oc.sugestao)}`);
          }
          console.log(chalk.cyan('\nExecute "prometheus importer --scan" para corrigir.'));
          return;
        }

        const tsconfigData = JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf-8'));
        const originalBases = getBaseAliases(tsconfigData.compilerOptions.paths || {});

        if (opts.scan && opts.replace) {
          scanBarrels(originalBases, false);
          replaceImports(originalBases);
          scanBarrels(originalBases, true);
        } else if (opts.scan) {
          scanBarrels(originalBases, true);
        } else if (opts.replace) {
          replaceImports(originalBases);
        }
      } catch (error) {
        console.error(chalk.red(`Erro fatal no importer: ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
      }
    });
}