export const ExecutorExtraMensagens = {
  tecnicaGlobal: '全局技术 "{nome}"',
  erroTecnicaGlobal: '{prefixo} 全局技术 \'{nome}\' 出错: {erro}',
  stackTrace: '堆栈跟踪:',
  modoRapido: ' 已激活快速模式: 使用 Workers 并行处理',
  analiseRapidaConcluida: ' 快速分析完成: {arquivos} 个文件，耗时 {duracao}',
  arquivosAnalisados: '已分析文件: {total}',
  arquivoAtual: '{seta} 文件 {atual}/{total}: {arquivo}',
  progresso: '已分析文件: {atual}/{total}',
  timeoutGlobal: '超时: 全局分析员 \'{nome}\' 超过 {timeout}ms',
  timeoutAnalista: '超时: 分析员 \'{nome}\' 分析 {arquivo} 超过 {timeout}ms',
} as const;
