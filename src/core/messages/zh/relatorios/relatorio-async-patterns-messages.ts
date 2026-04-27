export const RelatorioAsyncPatternsMensagens = {
  totalOcorrencias: '未处理异步的出现项总计: {total}',
  topArquivos: '\n 未处理 Promise 最多的前 {total} 个文件:\n',
  promiseSemTratamento: '   └─ {total} 个 promise 缺少错误处理',
  prioridade: '   └─ 优先级: {nivel}\n',
  distribuicaoCategoria: '\n 按类别分布:\n',
  categoriaStats: '  {categoria}: {arquivos} 个文件, {promises} 个 promise',
  proximosPassos: '\n 后续步骤:\n',
  passo1: '1. 审查严重级别的文件并添加 .catch() 或 try/catch',
  passo2: '2. 对于出现项较多的文件，考虑重构',
  passo3: '3. 验证 promise 是否在更高层级有处理',
  passo4: '4. 添加测试以确保健壮性\n',
  recomendacoes: {
    proximosPassos: [
      '审查严重级别的文件并添加 .catch() 或 try/catch',
      '对于出现项较多的文件，考虑重构',
      '验证 promise 是否在更高层级有处理',
      '添加测试以确保健壮性',
    ],
  },
} as const;
