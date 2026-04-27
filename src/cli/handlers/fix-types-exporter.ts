// SPDX-License-Identifier: MIT
/**
 * Handler para exportação de relatórios de fix-types
 * Gera relatórios JSON padronizados
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { config } from '@core/config';
import { messages } from '@core/messages';

import type { CasoTipoInseguro, FixTypesExportOptions, FixTypesExportResult } from '@';

const log = messages.log;

// Re-export para compatibilidade
export type { CasoTipoInseguro, FixTypesExportOptions, FixTypesExportResult };

/**
 * Gera relatório JSON estruturado
 */
async function gerarRelatorioJson(caminho: string, options: FixTypesExportOptions): Promise<void> {
  const {
    casos,
    stats,
    minConfidence,
    verbose
  } = options;
  const total = stats.legitimo + stats.melhoravel + stats.corrigir;
  const mediaConfianca = total > 0 ? Math.round(stats.totalConfianca / total) : 0;
  const relatorio = {
    metadata: {
      timestamp: new Date().toISOString(),
      comando: 'fix-types',
      schemaVersion: '1.0.0',
      configuracao: {
        confianciaMinima: minConfidence,
        modoVerbose: verbose
      }
    },
    resumo: {
      totalCasos: total,
      mediaConfianca,
      distribuicao: {
        legitimo: {
          total: stats.legitimo,
          percentual: total > 0 ? Math.round(stats.legitimo / total * 100) : 0
        },
        melhoravel: {
          total: stats.melhoravel,
          percentual: total > 0 ? Math.round(stats.melhoravel / total * 100) : 0
        },
        corrigir: {
          total: stats.corrigir,
          percentual: total > 0 ? Math.round(stats.corrigir / total * 100) : 0
        }
      }
    },
    casos: casos.map(c => ({
      arquivo: c.arquivo,
      linha: c.linha,
      tipo: c.tipo,
      categoria: c.categoria,
      confianca: c.confianca,
      motivo: c.motivo,
      sugestao: c.sugestao,
      variantes: c.variantes || [],
      contexto: c.contexto
    })),
    // Agrupamentos úteis para análise
    analise: {
      porArquivo: agruparPorArquivo(casos),
      porCategoria: agruparPorCategoria(casos),
      altaPrioridade: casos.filter(c => c.categoria === 'corrigir' && c.confianca >= 85).map(c => ({
        arquivo: c.arquivo,
        linha: c.linha,
        confianca: c.confianca,
        sugestao: c.sugestao || c.motivo
      })),
      casosIncertos: casos.filter(c => c.confianca < 70 && c.variantes && c.variantes.length > 0).map(c => ({
        arquivo: c.arquivo,
        linha: c.linha,
        confianca: c.confianca,
        motivo: c.motivo,
        variantes: c.variantes
      }))
    }
  };
  await fs.writeFile(caminho, JSON.stringify(relatorio, null, 2));
}


/**
 * Agrupa casos por arquivo
 */
function agruparPorArquivo(casos: CasoTipoInseguro[]): Record<string, number> {
  return casos.reduce((acc, caso) => {
    acc[caso.arquivo] = (acc[caso.arquivo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Agrupa casos por categoria
 */
function agruparPorCategoria(casos: CasoTipoInseguro[]): Record<string, Array<{
  arquivo: string;
  linha?: number;
}>> {
  return casos.reduce((acc, caso) => {
    if (!acc[caso.categoria]) acc[caso.categoria] = [];
    acc[caso.categoria].push({
      arquivo: caso.arquivo,
      linha: caso.linha
    });
    return acc;
  }, {} as Record<string, Array<{
    arquivo: string;
    linha?: number;
  }>>);
}

/**
 * Exporta relatórios de fix-types (Markdown e JSON)
 *
 * @param options - Opções de exportação
 * @returns Caminhos dos arquivos gerados ou null em caso de erro
 */
export async function exportarRelatoriosFixTypes(options: FixTypesExportOptions): Promise<FixTypesExportResult | null> {
  if (!config.REPORT_EXPORT_ENABLED) {
    return null;
  }
  try {
    const {
      baseDir
    } = options;

    // Determinar diretório de saída
    const dir = typeof config.REPORT_OUTPUT_DIR === 'string' ? config.REPORT_OUTPUT_DIR : path.join(baseDir, 'reports');

    // Criar diretório se não existir
    await fs.mkdir(dir, {
      recursive: true
    });

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const nomeBase = `prometheus-fix-types-${ts}`;

    const caminhoJson = path.join(dir, `${nomeBase}.json`);
    await gerarRelatorioJson(caminhoJson, options);

    log.sucesso(messages.CliExportersMensagens.fixTypes.relatoriosExportadosTitulo);
    log.info(messages.CliExportersMensagens.fixTypes.caminhoJson(caminhoJson));
    return {
      json: caminhoJson,
      dir
    };
  } catch (error) {
    log.erro(messages.CliExportersMensagens.fixTypes.falhaExportar((error as Error).message));
    return null;
  }
}
