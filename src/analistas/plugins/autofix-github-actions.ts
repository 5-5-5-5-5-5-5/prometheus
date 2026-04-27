// SPDX-License-Identifier: MIT
/**
 * Auto-fixers para problemas comuns em GitHub Actions Workflows
 */

import type { DeteccaoCustom } from './analista-github-actions.js';

export interface AutoFixResult {
  conteudo: string;
  descricao: string;
  applied: boolean;
}

/**
 * Auto-fixer para actions desatualizadas
 */
export const autofixActionDesatualizada: DeteccaoCustom = {
  nome: 'autofix-action-desatualizada',
  descricao: 'Atualiza actions para versão mais recente',
  severidade: 'media',
  testar: (workflow) => {
    const probs: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return probs;
    const acoes: Record<string, string> = {
      'actions/checkout@v2': 'actions/checkout@v4',
      'actions/checkout@v3': 'actions/checkout@v4',
      'actions/setup-node@v2': 'actions/setup-node@v4',
      'actions/setup-node@v3': 'actions/setup-node@v4',
      'actions/setup-python@v1': 'actions/setup-python@v5',
      'actions/setup-python@v4': 'actions/setup-python@v5'
    };
    const wfJson = JSON.stringify(workflow);
    for (const [antiga, nova] of Object.entries(acoes)) {
      if (wfJson.includes(antiga)) {
        probs.push({ tipo: 'action-desatualizada', descricao: `Atualizar ${  antiga  } para ${  nova}`, linha: 1, sugestao: nova, severidade: 'media' });
      }
    }
    return probs;
  },
  corrigir: (conteudo) => {
    let novoConteudo = conteudo;
    const acoes: Record<string, string> = {
      'actions/checkout@v2': 'actions/checkout@v4',
      'actions/checkout@v3': 'actions/checkout@v4',
      'actions/setup-node@v2': 'actions/setup-node@v4',
      'actions/setup-node@v3': 'actions/setup-node@v4',
      'actions/setup-python@v1': 'actions/setup-python@v5',
      'actions/setup-python@v4': 'actions/setup-python@v5'
    };
    let applied = false;
    for (const [antiga, nova] of Object.entries(acoes)) {
      if (novoConteudo.includes(antiga)) {
        novoConteudo = novoConteudo.replace(antiga, nova);
        applied = true;
      }
    }
    return applied ? { conteudo: novoConteudo, descricao: 'Actions atualizadas para versão mais recente' } : null;
  }
};

/**
 * Auto-fixer para timeout
 */
export const autofixTimeout: DeteccaoCustom = {
  nome: 'autofix-timeout',
  descricao: 'Adiciona timeout em jobs',
  severidade: 'media',
  testar: (workflow) => {
    const probs: Array<{ tipo: string; descricao: string; linha: number; sugestao: string; severidade: 'baixa' | 'media' | 'alta' | 'critica' }> = [];
    if (!workflow || typeof workflow !== 'object') return probs;
    if (Object.keys(workflow).includes('jobs')) {
      probs.push({ tipo: 'job-sem-timeout', descricao: 'Job sem timeout', linha: 1, sugestao: 'Adicionar timeout-minutes: 30', severidade: 'media' });
    }
    return probs;
  },
  corrigir: (conteudo) => {
    if (conteudo.includes('timeout-minutes:')) return null;
    const lines = conteudo.split('\n');
    const newLines: string[] = [];
    for (const line of lines) {
      newLines.push(line);
      if (line.includes('runs-on:') && !line.includes('timeout-minutes:')) {
        newLines.splice(newLines.length - 1, 0, '      timeout-minutes: 30');
      }
    }
    return { descricao: 'timeout-minutes: 30 adicionado', conteudo: newLines.join('\n') };
  }
};

/**
 * Aplica todos os auto-fixes disponíveis
 */
export function aplicarAutoFixes(conteudo: string): { conteudo: string; correcoes: string[] } {
  const correcoes: string[] = [];
  let novoConteudo = conteudo;
  const fixers = [autofixActionDesatualizada,];
  for (const fixer of fixers) {
    if (fixer.corrigir) {
      const resultado = fixer.corrigir(novoConteudo);
      if (resultado) {
        novoConteudo = resultado.conteudo;
        correcoes.push(resultado.descricao);
      }
    }
  }
  return { conteudo: novoConteudo, correcoes };
}