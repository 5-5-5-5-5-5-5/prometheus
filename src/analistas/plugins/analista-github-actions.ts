// SPDX-License-Identifier: MIT

/**
 * @fileoverview Analista de qualidade para workflows do GitHub Actions (v0.6.0)
 */

import { parseDocument } from 'yaml';

import type { Analista, ContextoExecucao, Ocorrencia,ProblemaWorkflow } from '@';

export interface DeteccaoCustom {
  nome: string;
  descricao: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  testar: (workflow: unknown, context: { conteudo: string, caminhos: string[] }) => ProblemaWorkflow[] | Promise<ProblemaWorkflow[]>;
  corrigir?: (workflow: string) => { conteudo: string; descricao: string } | null;
}

interface WorkflowStep {
  name?: string;
  uses?: string;
  with?: {
    path?: string;
    'fetch-depth'?: number | string;
    'cache-from'?: string;
    'cache-to'?: string;
    [k: string]: unknown;
  };
  env?: Record<string, unknown>;
  run?: string;
}

interface WorkflowJob {
  name?: string;
  needs?: string | string[];
  strategy?: { matrix?: unknown; 'fail-fast'?: unknown };
  container?: unknown;
  steps?: WorkflowStep[];
}

interface WorkflowNode extends Record<string, unknown> {
  container?: unknown;
  strategy?: { matrix?: unknown; 'fail-fast'?: unknown };
  jobs?: Record<string, WorkflowJob>;
  steps?: WorkflowStep[];
  uses?: string;
  run?: string;
}

const detectoresRegistrados: DeteccaoCustom[] = [];

export function registrarDetectorGithubActions(detector: DeteccaoCustom): void {
  detectoresRegistrados.push(detector);
}

export const analistaGithubActions: Analista = {
  nome: 'github-actions',
  categoria: 'workflows',
  descricao: 'Analista avançado de workflows do GitHub Actions com suporte a plugins',
  test: (relPath: string) => relPath.startsWith('.github/workflows/') || relPath.endsWith('.yml') || relPath.endsWith('.yaml'),


  async aplicar(conteudo: string, relPath: string, _ast: unknown = null, _fc?: string, contexto?: ContextoExecucao): Promise<Ocorrencia[]> {
    const ocorrencias: Ocorrencia[] = [];
    try {
      const doc = parseDocument(conteudo);
      const workflow = doc.toJS();
      const problemas = await executarDetectoresNativos(workflow, conteudo);

      const caminhos = contexto?.arquivos.map(f => f.relPath) || [];
      const plugResults = await Promise.all(detectoresRegistrados.map(d => Promise.resolve(d.testar(workflow, { conteudo, caminhos })).catch(() => [])));

      const todos = [...problemas, ...plugResults.flat()];

      for (const p of todos) {
        ocorrencias.push({
          tipo: `GITHUB_ACTIONS_${p.tipo.toUpperCase().replace(/-/g, '_')}`,
          mensagem: p.descricao,
          relPath,
          linha: p.linha || 1,
          coluna: 1,
          sugestao: p.sugestao || '',
          nivel: p.severidade === 'critica' || p.severidade === 'alta' ? 'erro' : (p.severidade === 'media' ? 'aviso' : 'info'),
        });
      }
    } catch {
      // Basic regex fallback if YAML fails
    }
    return ocorrencias;
  },
};

export const analistaGithubActionsGlobal: Analista = {
  nome: 'github-actions-global',
  categoria: 'workflows',
  descricao: 'Governança Global do GitHub',
  test: () => false,
  async aplicar(_c, _p, _a, _f, ctx?: ContextoExecucao): Promise<Ocorrencia[]> {
    if (!ctx) return [];
    const ores: Ocorrencia[] = [];
    const paths = ctx.arquivos.map(f => f.relPath);

    // CODEOWNERS
    if (!paths.some(p => /CODEOWNERS/i.test(p))) {
      ores.push({ tipo: 'GITHUB_ACTIONS_CODEOWNERS_MISSING', mensagem: 'CODEOWNERS faltando', relPath: '.github/', linha: 0, coluna: 0, nivel: 'info' });
    }

    // README
    const readme = ctx.arquivos.find(f => /README\.md/i.test(f.relPath));
    const content = readme ? (readme.content as string | null) || '' : '';
    if (readme && !/Code of Conduct|Código de Conduta/i.test(content)) {
      ores.push({ tipo: 'GITHUB_ACTIONS_DOC_GOVERNANCE_MISSING', mensagem: 'README sem Código de Conduta', relPath: readme.relPath, linha: 1, coluna: 0, nivel: 'info' });
    }

    // Stale Bot
    if (!paths.some(p => /stale/i.test(p))) {
      ores.push({ tipo: 'GITHUB_ACTIONS_STALE_BOT_MISSING', mensagem: 'Stale bot faltando', relPath: '.github/workflows/', linha: 0, coluna: 0, nivel: 'info' });
    }

    // Release
    if (!paths.some(p => /release|deploy/i.test(p))) {
      ores.push({ tipo: 'GITHUB_ACTIONS_RELEASE_AUTOMATION_MISSING', mensagem: 'Release automation faltando', relPath: '.github/workflows/', linha: 0, coluna: 0, nivel: 'info' });
    }

    return ores;
  }
};

async function executarDetectoresNativos(wf: unknown, raw: string): Promise<ProblemaWorkflow[]> {
  const probs: ProblemaWorkflow[] = [];
  if (!wf) return probs;

  // Handle various snippet styles for tests
  const candidates = Array.isArray(wf) ? wf : [wf];

  for (const item of candidates) {
    if (typeof item === 'object' && item !== null) {
      analisarEstrutura(item as WorkflowNode, probs);
    }
  }

  // Final check for raw string patterns (like sudo)
  if (/sudo\s+/.test(raw)) {
    probs.push({ tipo: 'uso-sudo', descricao: 'Uso de sudo detectado', severidade: 'alta' });
  }
  if (raw.includes('pull_request_target:')) {
    probs.push({ tipo: 'estrutura-workflow', descricao: 'Uso de pull_request_target', severidade: 'alta' });
  }

  return probs;
}

function analisarEstrutura(wf: WorkflowNode, probs: ProblemaWorkflow[]) {
  // Container (Root level for snippets)
  if (wf.container && typeof wf.container === 'string') {
    probs.push({ tipo: 'container-sem-user', descricao: 'Container sem user', severidade: 'media' });
  }

  // Strategy
  if (wf.strategy?.matrix && wf.strategy['fail-fast'] === undefined) {
    probs.push({ tipo: 'matrix-sem-fail-fast', descricao: 'Matrix sem fail-fast', severidade: 'baixa' });
  }

  // Detect Secrets in generic maps (for environment snippets in tests)
  for (const [k, v] of Object.entries(wf)) {
    if (/(KEY|TOKEN|SECRET|PASSWORD)/i.test(k) && v && typeof v !== 'object' && !String(v).includes('${{')) {
      probs.push({ tipo: 'env-sensivel', descricao: `Secret hardcoded em ${k}`, severidade: 'critica' });
    }
  }

  // Jobs
  if (wf.jobs) {
    const jobEntries = Object.entries(wf.jobs);

    for (const [id, job] of jobEntries) {
      if (job?.strategy?.matrix && job.strategy['fail-fast'] === undefined) {
        probs.push({ tipo: 'matrix-sem-fail-fast', descricao: `Job ${id} sem fail-fast`, severidade: 'baixa' });
      }
      if (job?.container && typeof job.container === 'string') {
        probs.push({ tipo: 'container-sem-user', descricao: 'Container rodando como root', severidade: 'media' });
      }

      // --- v0.4.5: Job sem nome descritivo ---
      if (/^(job\d+|step\d+|build\d*|test\d*|j\d+)$/i.test(id) && !job?.name) {
        probs.push({ tipo: 'job-sem-nome', descricao: `Job '${id}' usa ID genérico sem campo 'name'`, severidade: 'baixa', sugestao: 'Usar nomes semânticos como build-backend, test-integration' });
      }

      if (job?.steps) {
        for (const s of job.steps) analisarStep(s, probs);

        // --- v0.4.5: Steps sem nome ---
        analisarStepsSemNome(job.steps, probs);
      }
    }

    // --- v0.4.5: Build sem parallelismo ---
    analisarParalelismo(jobEntries, probs);

    // --- v0.4.5: Download desnecessário de artifacts ---
    analisarDownloadArtifacts(jobEntries, probs);

    // --- v0.4.5: Múltiplas instalações de dependências ---
    analisarMultiplasInstalacoesDeps(jobEntries, probs);
  }

  // Se forem passos diretos na raiz (snippet)
  if (wf.steps && Array.isArray(wf.steps)) {
    for (const s of wf.steps) analisarStep(s, probs);
    analisarStepsSemNome(wf.steps, probs);
  }

  // Direct steps (if snippet is a list)
  if (wf.uses || wf.run) analisarStep(wf as WorkflowStep, probs);
}

function analisarStep(s: WorkflowStep, probs: ProblemaWorkflow[]) {
  if (!s) return;
  // Pinning
  if (s.uses && /@v\d+/.test(s.uses) && !s.uses.startsWith('actions/')) {
    probs.push({ tipo: 'falta-sha-pinning', descricao: 'Pinning por SHA faltando', severidade: 'media' });
  }
  // Upload
  if (s.uses?.includes('upload-artifact') && s.with?.path?.includes('.env')) {
    probs.push({ tipo: 'upload-sensivel', descricao: 'Upload de .env', severidade: 'critica' });
  }
  // Env
  if (s.env) {
    for (const [k, v] of Object.entries(s.env)) {
      if (/(KEY|TOKEN|SECRET|PASSWORD)/i.test(k) && v && typeof v !== 'object' && !String(v).includes('${{')) {
        probs.push({ tipo: 'env-sensivel', descricao: `Env ${k} hardcoded`, severidade: 'critica' });
      }
    }
  }
  // Injection
  if (s.run && /\$\{\{\s*github\.event\./.test(s.run)) {
    probs.push({ tipo: 'script-injection', descricao: 'Script injection', severidade: 'alta' });
  }

  // --- v0.4.5: Docker build sem layer caching ---
  if (s.uses && /docker\/build-push-action/.test(s.uses)) {
    const hasCacheFrom = s.with?.['cache-from'] !== undefined;
    const hasCacheTo = s.with?.['cache-to'] !== undefined;
    if (!hasCacheFrom && !hasCacheTo) {
      probs.push({ tipo: 'docker-sem-layer-cache', descricao: 'Docker build sem cache de layers configurado', severidade: 'media', sugestao: 'Adicionar cache-from e cache-to para otimizar builds Docker' });
    }
  }

  // --- v0.4.5: Checkout com fetch-depth: 0 desnecessário ---
  if (s.uses && /actions\/checkout/.test(s.uses) && s.with) {
    const fd = s.with['fetch-depth'];
    if (fd === 0 || fd === '0') {
      probs.push({ tipo: 'fetch-depth-desnecessario', descricao: 'checkout com fetch-depth: 0 baixa todo o histórico do repositório', severidade: 'baixa', sugestao: 'Usar fetch-depth: 1 (default) a menos que precise do histórico completo para tags/changelog' });
    }
  }
}

/**
 * v0.4.5: Detecta steps sem campo 'name'
 */
function analisarStepsSemNome(steps: WorkflowStep[], probs: ProblemaWorkflow[]) {
  for (const s of steps) {
    if (!s || s.name) continue;
    if (s.uses || s.run) {
      const ident = s.uses ? `uses: ${s.uses}` : 'run command';
      probs.push({ tipo: 'step-sem-nome', descricao: `Step sem campo 'name' (${ident})`, severidade: 'baixa', sugestao: 'Adicionar campo name: para melhor legibilidade nos logs do Actions' });
    }
  }
}

/**
 * v0.4.5: Detecta jobs que poderiam rodar em paralelo mas têm 'needs' desnecessário
 * Heurística: se todos os jobs têm 'needs' formando uma cadeia linear, sugere paralelismo
 */
function analisarParalelismo(jobEntries: [string, WorkflowJob][], probs: ProblemaWorkflow[]) {
  if (jobEntries.length < 3) return;

  let totalWithNeeds = 0;
  for (const [, job] of jobEntries) {
    if (job?.needs) totalWithNeeds++;
  }

  // Se todos os jobs (exceto o primeiro) dependem do anterior em cadeia linear
  if (totalWithNeeds === jobEntries.length - 1) {
    probs.push({ tipo: 'build-sem-parallelismo', descricao: 'Todos os jobs estão em cadeia linear — considere paralelizar jobs independentes', severidade: 'media', sugestao: 'Remover dependências (needs) desnecessárias para permitir execução paralela' });
  }
}

/**
 * v0.4.5: Detecta múltiplos download-artifact em jobs diferentes
 */
function analisarDownloadArtifacts(jobEntries: [string, WorkflowJob][], probs: ProblemaWorkflow[]) {
  let downloadCount = 0;
  for (const [, job] of jobEntries) {
    if (!job?.steps) continue;
    for (const s of job.steps) {
      if (s.uses && /download-artifact/.test(s.uses)) downloadCount++;
    }
  }
  if (downloadCount >= 3) {
    probs.push({ tipo: 'download-artifacts-desnecessario', descricao: `${downloadCount} download-artifact encontrados — considere consolidar artifacts`, severidade: 'baixa', sugestao: 'Consolidar artifacts ou usar cache compartilhado' });
  }
}

/**
 * v0.4.5: Detecta npm ci/npm install em múltiplos jobs sem cache compartilhado
 */
function analisarMultiplasInstalacoesDeps(jobEntries: [string, WorkflowJob][], probs: ProblemaWorkflow[]) {
  let installCount = 0;
  let hasCacheStep = false;

  for (const [, job] of jobEntries) {
    if (!job?.steps) continue;
    let jobHasInstall = false;
    for (const s of job.steps) {
      if (s.run && /\b(npm\s+(ci|install)|yarn\s+install|pnpm\s+install)\b/.test(s.run)) {
        jobHasInstall = true;
      }
      if (s.uses && /actions\/cache/.test(s.uses)) {
        hasCacheStep = true;
      }
    }
    if (jobHasInstall) installCount++;
  }

  if (installCount >= 2 && !hasCacheStep) {
    probs.push({ tipo: 'multiplas-instalacoes-deps', descricao: `Instalação de dependências em ${installCount} jobs sem cache compartilhado`, severidade: 'media', sugestao: 'Usar actions/cache ou artifact de node_modules para evitar instalações duplicadas' });
  }
}
