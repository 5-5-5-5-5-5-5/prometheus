// SPDX-License-Identifier: MIT
/**
 * Analista Multi-Plataforma de CI/CD
 * Suporta GitHub Actions, GitLab CI, CircleCI, Azure DevOps, Jenkins
 */

import { parseDocument } from 'yaml';

import type { Ocorrencia } from '@';

export type PlataformaCI = 'github-actions' | 'gitlab-ci' | 'circleci' | 'azure-devops' | 'jenkins';

export interface ConfiguracaoPipeline {
  plataforma: PlataformaCI;
  arquivo: string;
  Jobs?: Record<string, unknown>;
  stages?: string[];
  steps?: Array<{ name?: string; script?: string; uses?: string }>;
}

/**
 * Detecta a plataforma de CI/CD baseada no conteúdo do arquivo
 */
export function detectarPlataforma(conteudo: string): PlataformaCI | null {
  if (conteudo.includes('on:') && conteudo.includes('jobs:')) {
    if (conteudo.includes('.gitlab-ci') || conteudo.includes('stages:')) {
      return 'gitlab-ci';
    }
    if (conteudo.includes('version:') && conteudo.includes('jobs:')) {
      return 'circleci';
    }
    if (conteudo.includes('pool:') && conteudo.includes('steps:')) {
      return 'azure-devops';
    }
    if (conteudo.includes('pipeline') && conteudo.includes('agent:')) {
      return 'jenkins';
    }
    return 'github-actions';
  }
  return null;
}

/**
 * Analisa GitLab CI (.gitlab-ci.yml)
 */
function analisarGitLabCI(conteudo: string): Ocorrencia[] {
  const problemas: Ocorrencia[] = [];
  try {
    const doc = parseDocument(conteudo);
    const wf = doc.toJS();

    if (!wf?.stages) {
      problemas.push({
        tipo: 'GITLAB_STAGES_MISSING',
        nivel: 'aviso',
        mensagem: 'GitLab CI sem stages definido - usa stages padrão',
        relPath: '',
        linha: 1
      });
    }

    if (wf?.image && !wf?.image?.includes(':')) {
      problemas.push({
        tipo: 'GITLAB_IMAGE_TAG_MISSING',
        nivel: 'aviso',
        mensagem: 'Image sem tag - usar tag específica para reprodutibilidade',
        relPath: '',
        linha: 1
      });
    }
  } catch {
    problemas.push({
      tipo: 'GITLAB_PARSE_ERROR',
      nivel: 'erro',
      mensagem: 'Erro ao fazer parse do arquivo GitLab CI',
      relPath: '',
      linha: 1
    });
  }
  return problemas;
}

/**
 * Analisa CircleCI (.circleci/config.yml)
 */
function analisarCircleCI(conteudo: string): Ocorrencia[] {
  const problemas: Ocorrencia[] = [];
  try {
    const doc = parseDocument(conteudo);
    const wf = doc.toJS();

    if (!wf?.jobs) {
      problemas.push({
        tipo: 'CIRCLECI_JOBS_MISSING',
        nivel: 'aviso',
        mensagem: 'CircleCI sem jobs definidos',
        relPath: '',
        linha: 1
      });
    }

    const jobs = wf?.jobs || {};
    for (const [jobName, job] of Object.entries(jobs)) {
      if (job && typeof job === 'object') {
        const jobObj = job as { parallel?: boolean };
        if (!jobObj?.parallel) {
          problemas.push({
            tipo: 'CIRCLECI_NO_PARALLEL',
            nivel: 'info',
            mensagem: `Job ${jobName} pode usar paralelismo`,
            relPath: '',
            linha: 1
          });
        }
      }
    }
  } catch {
    problemas.push({
      tipo: 'CIRCLECI_PARSE_ERROR',
      nivel: 'erro',
      mensagem: 'Erro ao fazer parse do arquivo CircleCI',
      relPath: '',
      linha: 1
    });
  }
  return problemas;
}

/**
 * Analisa Azure DevOps (azure-pipelines.yml)
 */
function analisarAzureDevOps(conteudo: string): Ocorrencia[] {
  const problemas: Ocorrencia[] = [];
  try {
    const doc = parseDocument(conteudo);
    const wf = doc.toJS();

    if (!wf?.trigger) {
      problemas.push({
        tipo: 'AZURE_TRIGGER_MISSING',
        nivel: 'info',
        mensagem: 'Azure Pipeline sem trigger definido - usa trigger padrão (all branches)',
        relPath: '',
        linha: 1
      });
    }

    if (!wf?.pool?.vmImage) {
      problemas.push({
        tipo: 'AZURE_POOL_MISSING',
        nivel: 'aviso',
        mensagem: 'Azure Pipeline sem pool definido',
        relPath: '',
        linha: 1
      });
    }
  } catch {
    problemas.push({
      tipo: 'AZURE_PARSE_ERROR',
      nivel: 'erro',
      mensagem: 'Erro ao fazer parse do Azure Pipeline',
      relPath: '',
      linha: 1
    });
  }
  return problemas;
}

/**
 * Analisa Jenkins (Jenkinsfile)
 */
function analisarJenkins(conteudo: string): Ocorrencia[] {
  const problemas: Ocorrencia[] = [];

  if (!conteudo.includes('pipeline')) {
    problemas.push({
      tipo: 'JENKINS_NOT_DECLARATIVE',
      nivel: 'aviso',
      mensagem: 'Jenkinsfile não usa sintaxe declarativa',
      relPath: '',
      linha: 1
    });
  }

  if (!conteudo.includes('agent') && !conteudo.includes('node')) {
    problemas.push({
      tipo: 'JENKINS_AGENT_MISSING',
      nivel: 'aviso',
      mensagem: 'Jenkinsfile sem agent definido',
      relPath: '',
      linha: 1
    });
  }

  if (conteudo.includes('sh "') && !conteudo.includes('set -e')) {
    problemas.push({
      tipo: 'JENKINS_NO_ERR_FAIL',
      nivel: 'info',
      mensagem: 'Stages sem set -e para falhar em erros',
      relPath: '',
      linha: 1
    });
  }

  return problemas;
}

/**
 * Analisa qualquer pipeline de CI/CD
 */
export function analisarPipeline(conteudo: string, plataforma?: PlataformaCI | null): Ocorrencia[] {
  const plataformaDetectada = plataforma || detectarPlataforma(conteudo);

  switch (plataformaDetectada) {
    case 'gitlab-ci':
      return analisarGitLabCI(conteudo);
    case 'circleci':
      return analisarCircleCI(conteudo);
    case 'azure-devops':
      return analisarAzureDevOps(conteudo);
    case 'jenkins':
      return analisarJenkins(conteudo);
    case 'github-actions':
    default:
      return [];
  }
}

/**
 * Retorna score unificado para qualquer plataforma
 */
export function calcularScorePlataforma(problemas: Ocorrencia[]): number {
  if (!problemas.length) return 100;
  let penalidade = 0;
  for (const oc of problemas) {
    switch (oc.nivel) {
      case 'erro': penalidade += 10; break;
      case 'aviso': penalidade += 5; break;
      case 'info': penalidade += 2; break;
    }
  }
  return Math.max(0, 100 - penalidade);
}
