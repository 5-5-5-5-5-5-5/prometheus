// SPDX-License-Identifier: MIT

export const CliComandoPadronizadorMensagens = {
  descricao: 'Standardizes operator usage in the project (e.g., ===, !==, ?? vs ||)',
  escaneando: 'Scanning files for non-standard patterns...',
  arquivoProcessado: 'Processed file: {path}',
  totalEncontrado: 'Found {total} occurrences that can be standardized.',
  alteracoesConcluidas: 'Standardization completed successfully in {total} files.',
  detalheOcorrencia: '[{linha}:{coluna}] Operator "{operador}" can be standardized to "{sugerido}".',
  asAnyEncontrado: '[{linha}:{coluna}] "as any" detected. Consider using "as unknown" or a more specific type.',
  erroProcessar: 'Error processing file {path}: {erro}'
} as const;