// SPDX-License-Identifier: MIT

import type {
  ArquetipoDrift,
  ResultadoDeteccaoArquetipo,
  SnapshotEstruturaBaseline,
} from '../../index.js';

export interface EstruturaIdentificadaJson {
  melhores: ResultadoDeteccaoArquetipo[];
  baseline: SnapshotEstruturaBaseline | null;
  drift: ArquetipoDrift;
}
