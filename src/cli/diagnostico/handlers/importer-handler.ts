// SPDX-License-Identifier: MIT
import fs from 'node:fs';
import path from 'node:path';

import { getMessages } from '@core/messages';

import type { Ocorrencia, ScanImportsOptions } from '@';

const { CliImporterHandlerMensagens: msgs } = getMessages();

function getBaseAliases(tsPaths: Record<string, string[]>): { prefix: string; target: string }[] {
  const bases: { prefix: string; target: string }[] = [];

  for (const [key, values] of Object.entries(tsPaths)) {
    if (key.endsWith('/*') && values[0]?.endsWith('/*')) {
      bases.push({
        prefix: key.slice(0, -2),
        target: values[0].slice(0, -2),
      });
    }
  }

  const srcDir = path.resolve(process.cwd(), 'src');
  try {
    const folders = fs.readdirSync(srcDir).filter(f =>
      fs.statSync(path.join(srcDir, f)).isDirectory(),
    );
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

async function walkFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
        results.push(...(await walkFiles(fullPath)));
      } else if (/\.(ts|js)$/.test(entry.name)) {
        results.push(fullPath);
      }
    }
  } catch {}
  return results;
}

export async function scanImports(options: ScanImportsOptions): Promise<Ocorrencia[]> {
  const { baseDir } = options;
  const ocorrencias: Ocorrencia[] = [];

  const tsconfigPath = path.resolve(baseDir, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) return ocorrencias;

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  const paths: Record<string, string[]> = tsconfig.compilerOptions?.paths || {};
  const originalBases = getBaseAliases(paths);

  const barrelMap = new Map<string, { alias: string; path: string }>();

  const srcDir = path.resolve(baseDir, 'src');
  const allFiles = await walkFiles(srcDir);

  for (const fullPath of allFiles) {
    if (path.basename(fullPath) !== 'index.ts') continue;
    const relativePath = `./${path.relative(baseDir, fullPath)}`;
    const folderPath = `./${path.relative(baseDir, path.dirname(fullPath))}`;

    if (folderPath.includes('/messages/') || (folderPath.endsWith('/messages') && folderPath !== './src/core/messages')) continue;

    const base = originalBases.find(b => folderPath.startsWith(b.target));
    if (base) {
      const subFolder = folderPath.slice(base.target.length);
      let alias = base.prefix + (subFolder.startsWith('/') ? subFolder : (subFolder ? `/${subFolder}` : ''));
      if (alias.startsWith('@types')) alias = alias.replace(/^@types/, '@projeto-types');
      if (!paths[alias]) {
        barrelMap.set(relativePath, { alias, path: relativePath });
      }
    }
  }

  if (barrelMap.size > 0) {
    for (const [barrelPath] of barrelMap) {
      ocorrencias.push({
        tipo: 'problema-import',
        nivel: 'aviso',
        mensagem: msgs.barrelsFaltando(barrelMap.size),
        relPath: barrelPath,
        linha: 0,
        coluna: 0,
        sugestao: `Execute "prometheus importer --scan" para adicionar o alias`,
      });
    }
  }

  return ocorrencias;
}