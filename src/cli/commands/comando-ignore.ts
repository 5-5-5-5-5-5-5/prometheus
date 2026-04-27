// SPDX-License-Identifier: MIT

import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { chalk } from '@core/config';
import { messages } from '@core/messages';
import { Command } from 'commander';

import { ExitCode, sair } from '../helpers/exit-codes.js';

const { log } = messages;

const IGNORE_PATTERNS: Record<string, { patterns: string[]; hint: string }> = {
  node: {
    patterns: ['node_modules/', '.npm/', '.pnpm-store/', '.yarn/'],
    hint: 'Node.js dependencies',
  },
  build: {
    patterns: ['dist/', 'build/', 'out/', '.next/', '.nuxt/', '.output/', '.svelte-kit/', '.expo/', 'coverage/', '.nyc_output/'],
    hint: 'Build outputs',
  },
  env: {
    patterns: ['.env', '.env.local', '.env.development', '.env.production', '.env.*.local', '*.env'],
    hint: 'Environment files',
  },
  os: {
    patterns: ['Thumbs.db', '.DS_Store', '._*', '.Spotlight-V100', '.Trashes', 'ehthumbs.db', 'Desktop.ini', '~$*'],
    hint: 'OS files',
  },
  logs: {
    patterns: ['*.log', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', 'pnpm-debug.log*', '.pnpm-debug.log*', '.npm/', 'lerna-debug.log*'],
    hint: 'Logs',
  },
  cache: {
    patterns: ['.cache/', '.parcel-cache/', '.turbo/', '.embroider/', '.embroider/', '.rollup.cache/', 'tsconfig.tsbuildinfo', '.tsbuildinfo'],
    hint: 'Cache directories',
  },
  test: {
    patterns: ['.test.ts.snap', '.spec.ts.snap', '__snapshots__/', '*.snap'],
    hint: 'Test snapshots',
  },
  langchain: {
    patterns: ['.langchain/', '.camelot/', 'package-lock.json'],
    hint: 'AI/LLM caches',
  },
  misc: {
    patterns: ['.idea/', '.vscode/', '*.swp', '*.swo', '*~', '.bak/', '.tmp/', '.temp/', '.DS_Store'],
    hint: 'Editors & misc',
  },
};

function detectarTecnologias(baseDir: string, files: string[]): Set<string> {
  const tecnologias = new Set<string>();
  const lowerFiles = files.map(f => f.toLowerCase());

  if (lowerFiles.some(f => f.endsWith('package.json'))) tecnologias.add('node');
  if (lowerFiles.some(f => f.endsWith('requirements.txt') || f.endsWith('pyproject.toml') || f.endsWith('setup.py'))) tecnologias.add('python');
  if (lowerFiles.some(f => f.endsWith('go.mod'))) tecnologias.add('go');
  if (lowerFiles.some(f => f.endsWith('Cargo.toml'))) tecnologias.add('rust');
  if (lowerFiles.some(f => f.endsWith('Gemfile'))) tecnologias.add('ruby');
  if (lowerFiles.some(f => f.endsWith('composer.json'))) tecnologias.add('php');
  if (lowerFiles.some(f => f.endsWith('pom.xml') || f.endsWith('build.gradle'))) tecnologias.add('java');
  if (lowerFiles.some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) tecnologias.add('dotnet');
  if (lowerFiles.some(f => f.endsWith('cargo.lock'))) tecnologias.add('rust');
  if (lowerFiles.some(f => f.endsWith('yarn.lock'))) tecnologias.add('node');
  if (lowerFiles.some(f => f.endsWith('pnpm-lock.yaml'))) tecnologias.add('node');

  return tecnologias;
}

async function escanearDiretorio(dir: string, depth: number = 0, maxDepth: number = 3): Promise<string[]> {
  if (depth > maxDepth) return [];
  const entries: string[] = [];
  try {
    const items = await readdir(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name === '.git') continue;
      const fullPath = join(dir, item.name);
      entries.push(fullPath);
      if (item.isDirectory() && depth < maxDepth) {
        const sub = await escanearDiretorio(fullPath, depth + 1, maxDepth);
        entries.push(...sub);
      }
    }
  } catch {
    // ignora dirs inacessíveis
  }
  return entries;
}

async function detectarExistentes(baseDir: string): Promise<Set<string>> {
  const existentes = new Set<string>();
  try {
    const content = await readdir(baseDir);
    for (const f of content) {
      if (f.startsWith('.env')) existentes.add(f);
    }
  } catch {
    // ignora
  }
  return existentes;
}

export function comandoIgnore(): Command {
  return new Command('ignore')
    .description('Gera um .gitignore completo baseado nas tecnologias detectadas no projeto.')
    .option('-o, --output <path>', 'Caminho do arquivo .gitignore', '.gitignore')
    .option('-a, --all', 'Inclui TODOS os padrões, sem detecção automática', false)
    .option('-f, --force', 'Sobrescreve arquivo existente sem confirmação', false)
    .action(async (opts: { output?: string; all?: boolean; force?: boolean; }): Promise<void> => {
      const baseDir = process.cwd();
      const outputPath = join(baseDir, opts.output ?? '.gitignore');

      log.info(chalk.bold('Gerando .gitignore...'));

      try {
        const entries = await escanearDiretorio(baseDir);
        const relativeFiles = entries.map(e => e.replace(`${baseDir}/`, ''));
        const tecnologias = detectarTecnologias(baseDir, relativeFiles);
        const existentes = await detectarExistentes(baseDir);

        let categorias: string[];

        if (opts.all) {
          categorias = Object.keys(IGNORE_PATTERNS);
        } else {
          categorias = Object.keys(IGNORE_PATTERNS).filter(cat => {
            if (cat === 'env') return existentes.size > 0;
            if (cat === 'node') return tecnologias.has('node');
            if (cat === 'langchain') return tecnologias.has('node');
            return true;
          });
        }

        const linhas: string[] = [
          '# Gerado por prometheus-cli ignore',
          `# Data: ${new Date().toISOString()}`,
          '',
        ];

        for (const cat of categorias) {
          const { patterns, hint } = IGNORE_PATTERNS[cat];
          linhas.push(`# ${hint}`);
          linhas.push(...patterns);
          linhas.push('');
        }

        const conteudo = linhas.join('\n');

        try {
          const fs = await import('node:fs/promises');
          await fs.access(outputPath);
          if (!opts.force) {
            const readline = await import('node:readline/promises');
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            const answer = await rl.question(chalk.yellow(`Arquivo ${opts.output} já existe. Sobrescrever? (s/N): `));
            rl.close();
            if (answer.toLowerCase() !== 's') {
              log.info('Operação cancelada.');
              return;
            }
          }
        } catch {
          // arquivo não existe, cria normalmente
        }

        await writeFile(outputPath, conteudo, 'utf-8');
        log.sucesso(`Arquivo ${opts.output ?? '.gitignore'} gerado com sucesso!`);
        log.info(`${chalk.gray(`${categorias.length} categorias • ${linhas.filter(l => l && !l.startsWith('#')).length} padrões`)}`);
      } catch (error) {
        log.erro(`Erro ao gerar .gitignore: ${error instanceof Error ? error.message : String(error)}`);
        sair(ExitCode.Failure);
      }
    });
}