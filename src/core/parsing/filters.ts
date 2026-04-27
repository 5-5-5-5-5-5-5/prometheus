// SPDX-License-Identifier: MIT
import type { FiltrosConfig, Ocorrencia, OcorrenciaParseErro } from '@';

// Re-exporta o tipo para compatibilidade
export type { FiltrosConfig };

/**
 * Aplica supressão às ocorrências baseado na configuração.
 * IMPORTANTE: Isso é para filtrar SAÍDA/RELATÓRIOS, não varredura de arquivos.
 */
export function aplicarSupressaoOcorrencias(ocorrencias: Array<OcorrenciaParseErro | Ocorrencia>, filtros: FiltrosConfig | undefined): Ocorrencia[] {
  if (!filtros) {
    return ocorrencias as Ocorrencia[];
  }

  const suppressObj = (filtros as Record<string, unknown>).suppress as Record<string, unknown> | undefined;
  const suppressRules = filtros.suppressRules || (suppressObj?.rules as string[] | undefined);
  const suppressBySeverity = filtros.suppressBySeverity || (suppressObj?.severity as Record<string, boolean> | undefined);
  const suppressByPath = filtros.suppressByPath || (suppressObj?.paths as string[] | undefined);
  const suppressByFilePattern = filtros.suppressByFilePattern || (suppressObj?.filePatterns as string[] | undefined);

  const filtradas = ocorrencias.filter(ocorrencia => {
    const tipo = (ocorrencia as Ocorrencia).tipo || '';
    const relPath = ocorrencia.relPath || '';
    const nivel = ocorrencia.nivel || '';
    const mensagem = (ocorrencia as Ocorrencia).mensagem || '';

    // Suprime por tipo/regra (verifica tanto o tipo quanto a mensagem)
    if (suppressRules?.some((rule: string) => tipo.includes(rule) || mensagem.includes(rule))) {
      return false;
    }

    // Suprime por severidade
    if (suppressBySeverity && suppressBySeverity[nivel]) {
      return false;
    }

    // Suprime por caminho (glob patterns)
    if (suppressByPath?.some((pattern: string) => {
      const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
      return regex.test(relPath);
    })) {
      return false;
    }

    // Suprime por padrão de arquivo
    if (suppressByFilePattern?.some((pattern: string) => {
      const fileNome = relPath.split('/').pop() || '';
      const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
      return regex.test(fileNome);
    })) {
      return false;
    }
    return true;
  });
  return filtradas as Ocorrencia[];
}