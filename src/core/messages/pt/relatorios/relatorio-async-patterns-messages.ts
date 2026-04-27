export const RelatorioAsyncPatternsMensagens = {
  totalOcorrencias: 'Total de ocorrências unhandled-async: {total}',
  topArquivos: '\n TOP {total} Arquivos com Mais Promises Não Tratadas:\n',
  promiseSemTratamento: '   └─ {total} promise(s) sem tratamento de erro',
  prioridade: '   └─ Prioridade: {nivel}\n',
  distribuicaoCategoria: '\n Distribuição por Categoria:\n',
  categoriaStats: '  {categoria}: {arquivos} arquivos, {promises} promises',
  proximosPassos: '\n Próximos Passos:\n',
  passo1: '1. Revisar arquivos CRÍTICOS e adicionar .catch() ou try/catch',
  passo2: '2. Para arquivos com muitas ocorrências, considerar refatoração',
  passo3: '3. Validar se promises têm tratamento em nível superior',
  passo4: '4. Adicionar testes para garantir robustez\n',
  recomendacoes: {
    proximosPassos: [
      'Revisar arquivos CRÍTICOS e adicionar .catch() ou try/catch',
      'Para arquivos com muitas ocorrências, considerar refatoração',
      'Validar se promises têm tratamento em nível superior',
      'Adicionar testes para garantir robustez',
    ],
  },
} as const;
