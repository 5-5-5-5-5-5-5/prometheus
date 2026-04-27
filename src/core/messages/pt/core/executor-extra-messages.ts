export const ExecutorExtraMensagens = {
  tecnicaGlobal: 'Técnica global "{nome}"',
  erroTecnicaGlobal: '{prefixo} Erro na técnica global \'{nome}\': {erro}',
  stackTrace: 'Stack trace:',
  modoRapido: ' Modo rápido ativado: processamento paralelo com Workers',
  analiseRapidaConcluida: ' Análise rápida concluída: {arquivos} arquivos em {duracao}',
  arquivosAnalisados: 'Arquivos analisados: {total}',
  arquivoAtual: '{seta} Arquivo {atual}/{total}: {arquivo}',
  progresso: 'Arquivos analisados: {atual}/{total}',
  timeoutGlobal: 'Timeout: analista global \'{nome}\' excedeu {timeout}ms',
  timeoutAnalista: 'Timeout: analista \'{nome}\' excedeu {timeout}ms para {arquivo}',
} as const;
