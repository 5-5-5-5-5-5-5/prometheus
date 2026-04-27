// SPDX-License-Identifier: MIT
/**
 * Handler para exportação de relatórios de poda
 * Gera relatórios JSON padronizados
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { config } from '@core/config';
import { messages } from '@core/messages';
import { gerarRelatorioPodaJson } from '@relatorios';

import type { PodaExportOptions, PodaExportResult } from '@';

const log = messages.log;

export type { PodaExportOptions, PodaExportResult };

export async function exportarRelatoriosPoda(options: PodaExportOptions): Promise<PodaExportResult | null> {
  if (!config.REPORT_EXPORT_ENABLED) {
    return null;
  }
  try {
    const {
      baseDir,
      podados,
      pendentes
    } = options;

    const dir = typeof config.REPORT_OUTPUT_DIR === 'string' ? config.REPORT_OUTPUT_DIR : path.join(baseDir, 'reports');

    await fs.mkdir(dir, {
      recursive: true
    });

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const nomeBase = `prometheus-poda-${ts}`;

    const caminhoJson = path.join(dir, `${nomeBase}.json`);
    await gerarRelatorioPodaJson(caminhoJson, podados, pendentes);

    log.sucesso(messages.CliExportersMensagens.poda.relatoriosExportados(dir));
    return {
      json: caminhoJson,
      dir
    };
  } catch (error) {
    log.erro(messages.CliExportersMensagens.poda.falhaExportar((error as Error).message));
    throw error;
  }
}
