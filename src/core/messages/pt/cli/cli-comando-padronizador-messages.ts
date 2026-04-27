// SPDX-License-Identifier: MIT

export const CliComandoPadronizadorMensagens = {
  descricao: 'Padroniza o uso de operadores no projeto (ex: ===, !==, ?? vs ||)',
  escaneando: 'Escaneando arquivos em busca de padrões não padronizados...',
  arquivoProcessado: 'Arquivo processado: {path}',
  totalEncontrado: 'Foram encontradas {total} ocorrências que podem ser padronizadas.',
  aplicandoAlteracoes: 'Aplicando alterações automáticas...',
  alteracoesConcluidas: 'Padronização concluída com sucesso em {total} arquivos.',
  detalheOcorrencia: '[{linha}:{coluna}] Operador "{operador}" pode ser padronizado para "{sugerido}".',
  asAnyEncontrado: '[{linha}:{coluna}] "as any" detectado. Considere usar "as unknown" ou um tipo mais específico.',
  erroProcessar: 'Erro ao processar arquivo {path}: {erro}'
};
