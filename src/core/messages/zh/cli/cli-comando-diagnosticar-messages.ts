// SPDX-License-Identifier: MIT

export const CliComandoDiagnosticarMensagens = {
  linhaEmBranco: '',
  fastModeTipo: '诊断',
  sugestoesHeader: '┌── 快速建议 ─────────────────────────────────────────',
  sugestoesFooter: '└───────────────────────────────────────────────────────────────',
  nenhumaFlagRelevante: '未检测到相关标志 — 使用 --help 查看所有选项。',
  detalheLinha: (texto: string) => `  ${texto}`,
  detalheSaidaEstruturada: '结构化输出：打印 JSON（适用于 CI）。与 --export 结合以保存文件。',
  detalheGuardian: 'Guardian：执行完整性检查（推荐用于部署）。',
  detalheExecutive: 'Executive：仅显示严重问题（适合高层会议）。',
  detalheFull: 'Full：本地生成详细报告（可能较为冗长）。',
  detalheFast: 'Fast：使用工作线程并行处理（适合大型项目和 CI）。',
  detalheCompact: 'Compact：整合进度，仅显示要点。',
  detalheAutoFix: 'Auto-fix：应用快速修复。请谨慎使用。',
  detalheAutoFixConservative: '快捷方式：等同于 --auto-fix --auto-fix-mode conservative',
  detalheIncludePatterns: (count: number, joined: string) => `包含模式：${count} (${joined})`,
  detalheExcludePatterns: (count: number, joined: string) => `排除模式：${count} (${joined})`,
  detalheExport: (relDir: string) => `导出：摘要保存至 ./${relDir} (默认)。`,
  detalheExportFull: 'Export-full：生成 gzip 分片和 manifest（可能较大）。仅在需要完整转储时使用。',
  detalheLogLevel: (logNivel: string) => `日志级别：${String(logNivel)}（使用 --log-level debug 以获得更多详情）`,
  dicaPrefiraLogLevelDebug: '提示：建议使用 --log-level debug 而非传统的 --debug/--dev。',
  dicaAutoFixConservative: '提示：--auto-fix-conservative 是一个快捷方式；为了清晰起见，建议明确使用 --auto-fix --auto-fix-mode conservative。',
  spinnerExecutando: '[扫描] 正在运行诊断...',
  spinnerFase: (titulo: string) => `[扫描] ${titulo}...`,
  spinnerConcluido: '诊断完成。',
  spinnerFalhou: '诊断失败。'
} as const;