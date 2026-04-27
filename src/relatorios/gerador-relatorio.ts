// SPDX-License-Identifier: MIT
// Gerador de relatórios: Markdown e JSON
import { getMessages } from '@core/messages';

import type { GeradorMarkdownOptions, Ocorrencia, ResultadoInquisicaoCompleto } from '@';

export async function gerarRelatorioMarkdown(resultado: ResultadoInquisicaoCompleto, outputCaminho: string, modoBrief = false, options?: GeradorMarkdownOptions): Promise<void> {
  const { gerarHeaderRelatorio, gerarSecaoGuardian, gerarTabelaOcorrencias, gerarTabelaResumoTipos, RelatorioMensagens } = getMessages();

  const {
    totalArquivos = 0,
    ocorrencias = [],
    guardian,
    timestamp = Date.now(),
    duracaoMs = 0,
    metricas
  } = (resultado || {}) as ResultadoInquisicaoCompleto;
  const dataISO = new Date(timestamp).toISOString();

  // Se modo brief, usar filtro inteligente
  if (modoBrief) {
    const {
      processarRelatorioResumo,
      gerarRelatorioMarkdownResumo
    } = await import('./filtro-inteligente.js');
    const relatorioResumo = processarRelatorioResumo(ocorrencias);
    await gerarRelatorioMarkdownResumo(relatorioResumo, outputCaminho);
    return;
  }
  const ocorrenciasOrdenadas: Ocorrencia[] = [...ocorrencias].sort((a, b) => {
    const ra = String(a.relPath ?? '');
    const rb = String(b.relPath ?? '');
    const cmp = ra.localeCompare(rb);
    if (cmp !== 0) return cmp;
    const la = typeof a.linha === 'number' ? a.linha : Number.MAX_SAFE_INTEGER;
    const lb = typeof b.linha === 'number' ? b.linha : Number.MAX_SAFE_INTEGER;
    return la - lb;
  });

  // Extrair dados do Guardian
  const guardianData = guardian && typeof guardian === 'object' ? {
    status: 'status' in guardian ? String((guardian as Record<string, unknown>).status) : 'não executada',
    timestamp: 'timestamp' in guardian ? String((guardian as Record<string, unknown>).timestamp) : '—',
    totalArquivos: 'totalArquivos' in guardian ? String((guardian as Record<string, unknown>).totalArquivos) : '—'
  } : {
    status: 'não executada',
    timestamp: '—',
    totalArquivos: '—'
  };

  // Montar o header usando template centralizado
  const lines: string[] = [];
  lines.push(...gerarHeaderRelatorio({
    dataISO,
    duracao: duracaoMs,
    totalArquivos,
    totalOcorrencias: ocorrencias.length
  }));

  // Adicionar métricas importantes no início para desenvolvedor
  if (metricas) {
    lines.push('## Métricas do Projeto');
    lines.push('');
    lines.push('| Métrica | Valor |');
    lines.push('|--------|-------|');
    if (metricas.totalArquivos !== undefined) {
      lines.push(`| Total de Arquivos | ${metricas.totalArquivos} |`);
    }
    if (metricas.tempoParsingMs !== undefined) {
      lines.push(`| Tempo de Parsing | ${(metricas.tempoParsingMs / 1000).toFixed(2)}s |`);
    }
    if (metricas.tempoAnaliseMs !== undefined) {
      lines.push(`| Tempo de Análise | ${(metricas.tempoAnaliseMs / 1000).toFixed(2)}s |`);
    }
    if (metricas.cacheAstHits !== undefined && metricas.cacheAstMiss !== undefined) {
      const hitRate = metricas.cacheAstMiss > 0 ? (metricas.cacheAstHits / (metricas.cacheAstHits + metricas.cacheAstMiss) * 100).toFixed(1) : '100';
      lines.push(`| Cache AST | ${hitRate}% (${metricas.cacheAstHits} hits / ${metricas.cacheAstMiss} miss) |`);
    }
    // Top analistas por duração
    if (metricas.analistas && metricas.analistas.length > 0) {
      lines.push('');
      lines.push('### Analistas mais lentos');
      lines.push('');
      lines.push('| Analista | Duração | Ocorrências |');
      lines.push('|----------|---------|------------|');
      const topAnalistas = [...metricas.analistas].sort((a, b) => (b.duracaoMs || 0) - (a.duracaoMs || 0)).slice(0, 5);
      for (const a of topAnalistas) {
        lines.push(`| ${a.nome} | ${(a.duracaoMs || 0).toFixed(0)}ms | ${a.ocorrencias || 0} |`);
      }
    }
    lines.push('');
    lines.push('---\n');
  }

  // Se houver manifest, adiciona link e sumário rápido
  if (options && options.manifestFile && options.relatoriosDir) {
    const relPath = options.manifestFile;
    lines.push(`**${RelatorioMensagens.principal.secoes.metadados.arquivoManifest}:** \`${relPath}\`  `);
    lines.push('');
    lines.push(`> ${RelatorioMensagens.principal.secoes.metadados.notaManifest}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Seção Guardian usando template
  lines.push(...gerarSecaoGuardian(guardianData));

  // Sumário das ocorrências por tipo usando template
  const tiposContagem: Record<string, number> = {};
  for (const ocorrencia of ocorrencias) {
    const tipo = ocorrencia && (ocorrencia as Ocorrencia).tipo || 'desconhecido';
    tiposContagem[String(tipo)] = (tiposContagem[String(tipo)] || 0) + 1;
  }
  lines.push(...gerarTabelaResumoTipos(tiposContagem, 10));

  // Tabela com ocorrências usando template
  lines.push('---');
  lines.push('');
  lines.push(`## ${RelatorioMensagens.principal.secoes.ocorrencias.titulo} (amostra)`);
  lines.push('');
  const AMOSTRA_MAX = 2000;
  const sample = ocorrenciasOrdenadas.slice(0, AMOSTRA_MAX);
  lines.push(...gerarTabelaOcorrencias(sample));
  if (ocorrenciasOrdenadas.length > AMOSTRA_MAX) {
    lines.push('');
    lines.push(`> Mostrando apenas ${AMOSTRA_MAX} ocorrências. Para ver todas, consulte os shards listados no manifest.`);
  }
  const {
    salvarEstado
  } = await import('@shared/persistence');
  await salvarEstado(outputCaminho, lines.join('\n'));
}
export async function gerarRelatorioJson(resultado: ResultadoInquisicaoCompleto, outputCaminho: string): Promise<void> {
  // Importar sistema de versionamento
  const {
    criarRelatorioComVersao
  } = await import('@core/schema');

  // Criar relatório versionado (mantemos metadados, mas salvamos os dados brutos para compatibilidade)
  const relatorioVersionado = criarRelatorioComVersao(resultado, undefined, 'Relatório completo de diagnóstico do Prometheus');
  const {
    salvarEstado
  } = await import('@shared/persistence');
  await salvarEstado(outputCaminho, relatorioVersionado.dados ?? resultado);
}