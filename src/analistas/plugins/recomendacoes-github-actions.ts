// SPDX-License-Identifier: MIT
/**
 * Motor de Recomendações de Workflows para GitHub Actions
 */

import type { DeteccaoCustom } from './analista-github-actions.js';

export interface RecomendacaoWorkflow {
  nome: string;
  descricao: string;
  template: string;
  tags: string[];
  importancia: 'essential' | 'recomendado' | 'opcional';
}

const CI_NODE = `name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test`;

const CI_PYTHON = `name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements-dev.txt
      - run: pytest`;

const RELEASE = `name: Release
on:
  push:
    tags:
      - 'v*'
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true`;

const STALE = `name: Stale
on:
  schedule:
    - cron: '0 0 * * *'
jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v9
        with:
          days-before-stale: 60
          days-before-close: 7`;

const DOCKER = `name: Docker
on:
  push:
    branches: [main]
jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          cache-from: type=gha
          cache-to: type=gha,mode=max`;

export const TEMPLATES_WORKFLOW: RecomendacaoWorkflow[] = [
  { nome: 'CI - Node.js', descricao: 'Workflow de CI para Node.js', template: CI_NODE, tags: ['node', 'npm', 'javascript'], importancia: 'essential' },
  { nome: 'CI - Python', descricao: 'Workflow de CI para Python', template: CI_PYTHON, tags: ['python', 'pip'], importancia: 'essential' },
  { nome: 'Release', descricao: 'Release automatizado', template: RELEASE, tags: ['release', 'deploy'], importancia: 'recomendado' },
  { nome: 'Stale Bot', descricao: 'Gerencia issues stale', template: STALE, tags: ['maintenance', 'stale'], importancia: 'recomendado' },
  { nome: 'Docker Build', descricao: 'Build de imagem Docker', template: DOCKER, tags: ['docker', 'container'], importancia: 'recomendado' }
];

export function detectarContextoProjeto(arquivos: Array<{ relPath: string; content?: string }>): string[] {
  const tags: string[] = [];
  const pkg = arquivos.find(f => f.relPath === 'package.json');
  if (pkg?.content) {
    try {
      const pkgJson = JSON.parse(pkg.content);
      tags.push('node');
      if (pkgJson.dependencies?.express || pkgJson.dependencies?.fastify) tags.push('express', 'api');
      if (pkgJson.dependencies?.next || pkgJson.dependencies?.react) tags.push('react', 'frontend');
      if (pkgJson.dependencies?.prisma) tags.push('database');
    } catch { /* ignore */ }
  }
  const requirements = arquivos.find(f => f.relPath === 'requirements.txt');
  if (requirements?.content) tags.push('python', 'pip');
  const dockerfile = arquivos.find(f => f.relPath === 'Dockerfile');
  if (dockerfile?.content) tags.push('docker');
  return tags;
}

export function getRecomendacoes(contexto: { arquivos: Array<{ relPath: string; content?: string }> }): RecomendacaoWorkflow[] {
  const tagsProjeto = detectarContextoProjeto(contexto.arquivos);
  const scores: Array<{ template: RecomendacaoWorkflow; score: number }> = [];
  for (const template of TEMPLATES_WORKFLOW) {
    let score = 0;
    for (const tagProj of tagsProjeto) {
      if (template.tags.includes(tagProj)) score += 1;
    }
    if (score > 0) {
      const peso = { essential: 3, recomendado: 2, opcional: 1 }[template.importancia] || 1;
      scores.push({ template, score: score + peso });
    }
  }
  return scores.sort((a, b) => b.score - a.score).map(s => s.template);
}

export const detectorAcoesDesatualizadas: DeteccaoCustom = {
  nome: 'actions-desatualizadas',
  descricao: 'Detecta GitHub Actions desatualizadas',
  severidade: 'media',
  testar: (workflow) => {
    const resultados: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return resultados;
    const actionsAntigas: Record<string, string> = {
      'actions/checkout@v2': 'actions/checkout@v4',
      'actions/setup-node@v2': 'actions/setup-node@v4',
      'actions/setup-python@v1': 'actions/setup-python@v5'
    };
    const wfJson = JSON.stringify(workflow);
    for (const [antiga, nova] of Object.entries(actionsAntigas)) {
      if (wfJson.includes(antiga)) {
        resultados.push({ tipo: 'action-desatualizada', descricao: `${antiga  } -> use ${  nova}`, linha: 1, sugestao: `Atualize para ${  nova}`, severidade: 'media' });
      }
    }
    return resultados;
  }
};