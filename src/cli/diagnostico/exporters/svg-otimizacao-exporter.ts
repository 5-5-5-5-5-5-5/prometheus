// SPDX-License-Identifier: MIT
import path from 'node:path';

import type { SvgExportParams } from '@projeto-types/relatorios';
import { otimizarSvgLikeSvgo, shouldSugerirOtimizacaoSvg } from '@shared/impar';

import type { SvgCandidate, SvgDirectoryStats, SvgExportResult } from '@';

export type { SvgCandidate, SvgExportResult };
function formatBytes(bytes: number): string {
if (!Number.isFinite(bytes) || bytes < 0) return String(bytes);
if (bytes < 1024) return `${bytes}B`;
const kb = bytes / 1024;
if (kb < 1024) return `${kb.toFixed(1)}KB`;
const mb = kb / 1024;
return `${mb.toFixed(1)}MB`;
}
/**
* Gera e escreve o relatório de otimização de SVG no diretório de relatórios
*/
export async function exportarRelatorioSvgOtimizacao(params: SvgExportParams): Promise<SvgExportResult> {
const {
entries,
relatoriosDir,
ts
} = params;
const candidatos: SvgCandidate[] = [];
for (const e of entries) {
if (!e || typeof e.relPath !== 'string') continue;
if (!/\.svg$/i.test(e.relPath)) continue;
if (typeof e.content !== 'string') continue;
if (!/<svg\b/i.test(e.content)) continue;
const opt = otimizarSvgLikeSvgo({
svg: e.content
});
const shouldSuggest = opt.changed && opt.originalBytes > opt.optimizedBytes && shouldSugerirOtimizacaoSvg(opt.originalBytes, opt.optimizedBytes);
if (!shouldSuggest) continue;
const savedBytes = opt.originalBytes - opt.optimizedBytes;
candidatos.push({
relPath: e.relPath,
dir: path.posix.dirname(e.relPath),
originalBytes: opt.originalBytes,
optimizedBytes: opt.optimizedBytes,
savedBytes,
mudancas: opt.mudancas,
temViewBox: /\bviewBox\s*=\s*['"][^'"]+['"]/i.test(e.content)
});
}
const totalEconomiaBytes = candidatos.reduce((acc, c) => acc + c.savedBytes, 0);
const porDir = new Map<string, SvgDirectoryStats>();
for (const c of candidatos) {
const key = c.dir;
const existing = porDir.get(key);
if (!existing) {
porDir.set(key, {
count: 1,
totalSaved: c.savedBytes,
exemplos: [c]
});
} else {
existing.count += 1;
existing.totalSaved += c.savedBytes;
if (existing.exemplos.length < 10) existing.exemplos.push(c);
}
}
const outputCaminho = path.join(relatoriosDir, `prometheus-svg-otimizacao-${ts}.json`);
const dirsOrdenados = Array.from(porDir.entries()).sort((a, b) => b[1].totalSaved - a[1].totalSaved);
const topArquivos = [...candidatos].sort((a, b) => b.savedBytes - a.savedBytes).slice(0, 30);

const report = {
  metadata: {
    timestamp: new Date().toISOString(),
    tipo: 'svg-otimizacao'
  },
  resumo: {
    totalArquivos: candidatos.length,
    economiaTotalBytes: totalEconomiaBytes,
    economiaTotalFormatada: formatBytes(totalEconomiaBytes)
  },
  porDiretorio: dirsOrdenados.map(([dir, info]) => ({
    diretorio: dir,
    arquivos: info.count,
    economiaBytes: info.totalSaved,
    economiaFormatada: formatBytes(info.totalSaved)
  })),
  topArquivos
};
const {
promises: fs
} = await import('node:fs');
await fs.mkdir(relatoriosDir, {
recursive: true
});
await fs.writeFile(outputCaminho, JSON.stringify(report, null, 2), 'utf-8');
return {
outputCaminho,
totalArquivos: candidatos.length,
totalEconomiaBytes
};
}
