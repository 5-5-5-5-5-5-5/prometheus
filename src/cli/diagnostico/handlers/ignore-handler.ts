// SPDX-License-Identifier: MIT
import fs from 'node:fs';
import path from 'node:path';

import { getMessages } from '@core/messages';

import type { Ocorrencia, ScanIgnoreOptions } from '@';

const { CliIgnoreHandlerMensagens: msgs } = getMessages();

const COMMON_PATTERNS: Record<string, { patterns: string[]; hint: string }> = {
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
    patterns: ['*.log', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', 'pnpm-debug.log*', '.pnpm-debug.log*', 'lerna-debug.log*'],
    hint: 'Logs',
  },
  cache: {
    patterns: ['.cache/', '.parcel-cache/', '.turbo/', '.rollup.cache/', 'tsconfig.tsbuildinfo', '.tsbuildinfo'],
    hint: 'Cache directories',
  },
  langchain: {
    patterns: ['.langchain/', '.camelot/'],
    hint: 'AI/LLM caches',
  },
  misc: {
    patterns: ['.idea/', '.vscode/', '*.swp', '*.swo', '*~', '.bak/', '.tmp/', '.temp/'],
    hint: 'Editors & misc',
  },
};

function detectarTecnologias(baseDir: string, files: string[]): Set<string> {
  const tecnologias = new Set<string>();
  const lowerFiles = files.map(f => f.toLowerCase());

  if (lowerFiles.some(f => f.endsWith('package.json'))) tecnologias.add('node');
  if (lowerFiles.some(f => f.endsWith('requirements.txt') || f.endsWith('pyproject.toml') || f.endsWith('setup.py'))) tecnologias.add('python');
  if (lowerFiles.some(f => f.endsWith('go.mod'))) tecnologias.add('go');
  if (lowerFiles.some(f => f.endsWith('cargo.toml'))) tecnologias.add('rust');
  if (lowerFiles.some(f => f.endsWith('gemfile'))) tecnologias.add('ruby');
  if (lowerFiles.some(f => f.endsWith('composer.json'))) tecnologias.add('php');
  if (lowerFiles.some(f => f.endsWith('pom.xml') || f.endsWith('build.gradle'))) tecnologias.add('java');
  if (lowerFiles.some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) tecnologias.add('dotnet');

  return tecnologias;
}

async function escanearDir(dir: string, depth = 0, maxDepth = 3): Promise<string[]> {
  if (depth > maxDepth) return [];
  const entries: string[] = [];
  try {
    const items = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name === '.git') continue;
      const fullPath = path.join(dir, item.name);
      entries.push(fullPath);
      if (item.isDirectory() && depth < maxDepth) {
        const sub = await escanearDir(fullPath, depth + 1, maxDepth);
        entries.push(...sub);
      }
    }
  } catch {}
  return entries;
}

export async function scanIgnore(options: ScanIgnoreOptions): Promise<Ocorrencia[]> {
  const { baseDir } = options;
  const ocorrencias: Ocorrencia[] = [];
  const gitignorePath = path.join(baseDir, '.gitignore');

  const entries = await escanearDir(baseDir);
  const relativeFiles = entries.map(e => path.relative(baseDir, e));
  const tecnologias = detectarTecnologias(baseDir, relativeFiles);

  if (!fs.existsSync(gitignorePath)) {
    ocorrencias.push({
      tipo: 'problema-gitignore',
      nivel: 'aviso',
      mensagem: msgs.arquivoAusente,
      relPath: '.gitignore',
      linha: 0,
      coluna: 0,
      sugestao: 'Execute "prometheus ignore --all" para gerar um .gitignore completo.',
    });
    return ocorrencias;
  }

  const content = fs.readFileSync(gitignorePath, 'utf-8');
  const linhasExistentes = content.split('\n').map(l => l.trim()).filter(Boolean);

  const faltam: string[] = [];

  for (const [cat, { patterns }] of Object.entries(COMMON_PATTERNS)) {
    if (cat === 'node' && !tecnologias.has('node')) continue;
    if (cat === 'langchain' && !tecnologias.has('node')) continue;

    for (const pattern of patterns) {
      const found = linhasExistentes.some(l => l === pattern || l === pattern.replace(/\/$/, '') || l === pattern.replace(/.*\//, ''));
      if (!found) {
        faltam.push(pattern);
      }
    }
  }

  if (faltam.length > 0) {
    const sample = faltam.slice(0, 5);
    const mais = faltam.length > 5 ? ` (+${faltam.length - 5} outros)` : '';
    ocorrencias.push({
      tipo: 'problema-gitignore',
      nivel: 'info',
      mensagem: `${msgs.arquivoIncompleto(faltam.length)  } Ex: ${sample.join(', ')}${mais}`,
      relPath: '.gitignore',
      linha: 0,
      coluna: 0,
      sugestao: `Execute "prometheus ignore --all" para completar.`,
    });
  }

  return ocorrencias;
}