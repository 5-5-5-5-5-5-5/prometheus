// SPDX-License-Identifier: MIT
/**
 * Assistente de IA para Análise de GitHub Actions
 */

import type { Ocorrencia } from '@';

export interface SugestaoIA {
  tipo: string;
  prioridade: number;
  explicacao: string;
  exemplo: string;
  referencia?: string;
}

const EXPLICACOES_DETALHADAS: Record<string, SugestaoIA> = {
  'action-desatualizada': {
    tipo: 'seguranca',
    prioridade: 8,
    explicacao: 'Actions desatualizadas podem conter vulnerabilidades de segurança conhecidas. Sempre use a versao mais recente.',
    exemplo: 'actions/checkout@v2 -> actions/checkout@v4',
    referencia: 'https://github.com/actions/checkout'
  },
  'env-sensivel': {
    tipo: 'seguranca',
    prioridade: 10,
    explicacao: 'Secrets hardcoded no workflow podem ser expostos nos logs de execucao. Use secrets do GitHub.',
    exemplo: 'GITHUB_TOKEN deveria ser ${{ secrets.GITHUB_TOKEN }}',
    referencia: 'https://docs.github.com/en/actions/security-guides/about-secret-management'
  },
  'script-injection': {
    tipo: 'seguranca',
    prioridade: 10,
    explicacao: 'Dados de eventos GitHub podem ser manipulados por atacantes. Nunca use github.event diretamente em run.',
    exemplo: 'Use variaveis de ambiente em vez de ${{ github.event.pull_request.title }}',
    referencia: 'https://securitylab.github.com/research/github-actions-preventing-script-injections/'
  },
  'container-sem-user': {
    tipo: 'seguranca',
    prioridade: 7,
    explicacao: 'Containers rodando como root podem ser explorados. Defina um usuario nao-root.',
    exemplo: 'container: { image: node:20, options: --user 1000 }',
    referencia: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-a-docker-container-action'
  },
  'sudo': {
    tipo: 'seguranca',
    prioridade: 9,
    explicacao: 'sudo em GitHub Actions e necessario apenas raramente. Reveja a necessidade.',
    exemplo: 'Evite sudo; use imagens oficiais que ja rodam como root apenas quando necessario',
    referencia: 'https://github.com/actions/virtual-environments'
  },
  'matrix-sem-fail-fast': {
    tipo: 'performance',
    prioridade: 5,
    explicacao: 'Em matrices grandes, fail-fast: false permite ver todos os resultados mesmo se um job falhar.',
    exemplo: 'strategy:\n  fail-fast: false\n  matrix: ...',
    referencia: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#strategy'
  },
  'fetch-depth-desnecessario': {
    tipo: 'performance',
    prioridade: 4,
    explicacao: 'fetch-depth: 0 baixa todo o historico. Use fetch-depth: 1 para CI mais rapido.',
    exemplo: 'with:\n  fetch-depth: 1',
    referencia: 'https://github.com/actions/checkout'
  },
  'job-sem-timeout': {
    tipo: 'performance',
    prioridade: 6,
    explicacao: 'Jobs sem timeout podem ficar presos indefinidamente. Defina timeout-minutes.',
    exemplo: 'jobs:\n  build:\n    timeout-minutes: 30',
    referencia: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions'
  },
  'build-sem-parallelismo': {
    tipo: 'performance',
    prioridade: 7,
    explicacao: 'Jobs independentes devem rodar em paralelo para CI mais rapido.',
    exemplo: 'Remova needs: desnecessarios para permitir paralelismo',
    referencia: 'https://docs.github.com/en/actions/using-workflows/about-workflows#jobs'
  },
  'step-sem-nome': {
    tipo: 'boas-praticas',
    prioridade: 3,
    explicacao: 'Steps sem nome sao dificeis de seguir nos logs. Adicione name: para clareza.',
    exemplo: 'steps:\n  - name: Install dependencies',
    referencia: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions'
  },
  'job-sem-nome': {
    tipo: 'boas-praticas',
    prioridade: 3,
    explicacao: 'Jobs com IDs genetricos como job1 sao confusos. Use nomes semanticos.',
    exemplo: 'jobs:\n  build:\n    name: Build and test',
    referencia: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobs'
  },
  'token-com-permissao-excessiva': {
    tipo: 'seguranca',
    prioridade: 8,
    explicacao: 'permissions: write-all da acesso excessivo. Defina permissoes minimas.',
    exemplo: 'permissions:\n  contents: read\n  pull-requests: write',
    referencia: 'https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#example-defining-permissions'
  }
};

export interface ResultadoAnaliseIA {
  score: number;
  problemas: Ocorrencia[];
  explicacoes: SugestaoIA[];
  melhoria?: string;
  risco?: string;
}

export function analisarComIA(ocorrencias: Ocorrencia[]): ResultadoAnaliseIA {
  const explicacoes: SugestaoIA[] = [];
  let score = 100;
  let riskScore = 0;

  for (const oc of ocorrencias) {
    const tipoUpper = (oc.tipo || '').toUpperCase();
    let explicacao = EXPLICACOES_DETALHADAS[tipoUpper.toLowerCase().replace(/^GITHUB_ACTIONS_/, '')];

    if (!explicacao) {
      for (const [key, exp] of Object.entries(EXPLICACOES_DETALHADAS)) {
        if (tipoUpper.includes(key.toUpperCase())) {
          explicacao = exp;
          break;
        }
      }
    }

    if (explicacao) {
      if (!explicacoes.find(e => e.tipo === explicacao.tipo)) {
        explicacoes.push(explicacao);
      }
      score -= Math.max(1, 11 - explicacao.prioridade);
      riskScore += explicacao.prioridade;
    } else {
      score -= 2;
    }
  }

  const risco = riskScore >= 15 ? 'ALTO' : riskScore >= 8 ? 'MEDIO' : 'BAIXO';
  const melhoria = score < 50 ? 'Considere refatorar o workflow' : score < 80 ? 'Ha espaco para melhoria' : 'Workflow bem estruturado';

  return {
    score: Math.max(0, score),
    problemas: ocorrencias,
    explicacoes,
    melhoria,
    risco
  };
}
