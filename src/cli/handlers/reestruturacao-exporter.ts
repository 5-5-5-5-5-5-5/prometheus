// SPDX-License-Identifier: MIT
/**
 * Handler para exportação de relatórios de reestruturação
 * Gera relatórios JSON padronizados
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { config } from '@core/config';
import { messages } from '@core/messages';
import { gerarRelatorioReestruturarJson } from '@relatorios';

import type { MovimentoEstrutural, ReestruturacaoExportOptions, ReestruturacaoExportResult } from '@';

const log = messages.log;

export type { ReestruturacaoExportOptions, ReestruturacaoExportResult };

function normalizarMovimentos(movimentos: ReestruturacaoExportOptions['movimentos']): MovimentoEstrutural[] {
  return movimentos.map(m => {
    if ('de' in m && 'para' in m) {
      return {
        de: m.de,
        para: m.para
      };
    }
    if ('atual' in m && 'ideal' in m) {
      return {
        de: m.atual,
        para: m.ideal ?? m.atual
      };
    }
    return {
      de: '',
      para: ''
    };
  });
}

export async function exportarRelatoriosReestruturacao(options: ReestruturacaoExportOptions): Promise<ReestruturacaoExportResult | null> {
  if (!config.REPORT_EXPORT_ENABLED) {
    return null;
  }
  try {
    const {
      baseDir,
      movimentos,
      simulado,
      origem,
      preset,
      conflitos
    } = options;

    // Determinar diretório de saída
    const dir = typeof config.REPORT_OUTPUT_DIR === 'string' ? config.REPORT_OUTPUT_DIR : path.join(baseDir, 'reports');

    // Criar diretório se não existir
    await fs.mkdir(dir, {
      recursive: true
    });

    // Gerar timestamp único para os arquivos
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const nomeBase = `prometheus-reestruturacao-${ts}`;

    const movimentosNormalizados = normalizarMovimentos(movimentos);

    const caminhoJson = path.join(dir, `${nomeBase}.json`);
    await gerarRelatorioReestruturarJson(caminhoJson, movimentosNormalizados, {
      simulado,
      origem,
      preset,
      conflitos
    });

    const modo = simulado ? '(dry-run) ' : '';
    log.sucesso(messages.CliExportersMensagens.reestruturacao.relatoriosExportados(modo, dir));
    return {
      json: caminhoJson,
      dir
    };
  } catch (error) {
    const modo = options.simulado ? '(dry-run) ' : '';
    log.erro(messages.CliExportersMensagens.reestruturacao.falhaExportar(modo, (error as Error).message));
    return null;
  }
}