// SPDX-License-Identifier: MIT
/**
 * Handler para exportação de relatórios do Guardian
 * Gera relatórios JSON padronizados
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { config } from '@core/config';
import { messages } from '@core/messages';

import type { GuardianBaseline, GuardianExportOptions, GuardianExportResult } from '@';

const log = messages.log;

// Re-export para compatibilidade
export type { GuardianBaseline, GuardianExportOptions, GuardianExportResult };

/**
 * Gera relatório JSON estruturado
 */
async function gerarRelatorioJson(caminho: string, options: GuardianExportOptions): Promise<void> {
  const {
    status,
    baseline,
    drift,
    erros,
    warnings
  } = options;
  const relatorio = {
    metadata: {
      timestamp: new Date().toISOString(),
      comando: 'guardian',
      schemaVersion: '1.0.0'
    },
    status,
    baseline: baseline || null,
    drift: drift || null,
    issues: {
      erros: erros || [],
      warnings: warnings || [],
      totalErros: erros?.length || 0,
      totalWarnings: warnings?.length || 0
    },
    resumo: {
      integridadeOk: status === 'ok' || status === 'baseline-criada',
      requerAtencao: (erros?.length || 0) > 0,
      drift: drift ? drift.alterouArquetipo : false
    }
  };
  await fs.writeFile(caminho, JSON.stringify(relatorio, null, 2));
}


/**
 * Exporta relatórios do Guardian (Markdown e JSON)
 *
 * @param options - Opções de exportação
 * @returns Caminhos dos arquivos gerados ou null em caso de erro
 */
export async function exportarRelatoriosGuardian(options: GuardianExportOptions): Promise<GuardianExportResult | null> {
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
    const nomeBase = `prometheus-guardian-${ts}`;

    const caminhoJson = path.join(dir, `${nomeBase}.json`);
    await gerarRelatorioJson(caminhoJson, options);

    log.sucesso(messages.CliExportersMensagens.guardian.relatoriosExportadosTitulo);
    log.info(messages.CliExportersMensagens.guardian.caminhoJson(caminhoJson));
    return {
      json: caminhoJson,
      dir
    };
  } catch (error) {
    log.erro(messages.CliExportersMensagens.guardian.falhaExportar((error as Error).message));
    return null;
  }
}
