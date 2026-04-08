export const ArquetiposExtraMensagens = {
  naoEncontrado: '⚠️ Arquétipo personalizado não encontrado em {novo} nem {legado}',
  salvo: '✅ Arquétipo personalizado salvo em {caminho}',
  projetoPersonalizado: '🌟 Projeto personalizado detectado: "{nome}"',
  descricaoPersonalizado: 'O Prometheus identificou uma estrutura de projeto que não corresponde a arquétipos oficiais,\nmas você pode criar um arquétipo personalizado para receber sugestões otimizadas!',
  estruturaDetectada: '📁 Estrutura detectada:',
  arquivosRaiz: '📄 Arquivos na raiz:',
  dicaCriar: '💡 Para criar seu arquétipo personalizado, execute:',
  comandoCriar: '   prometheus diagnosticar --criar-arquetipo',
  explicacaoCriar: 'Isso criará um arquivo \'prometheus.repo.arquetipo.json\' com base na estrutura atual,\nque o Prometheus usará para oferecer sugestões personalizadas mantendo as melhores práticas.',
  validacao: {
    nomeObrigatorio: 'Nome do projeto é obrigatório',
    arquetipoObrigatorio: 'Arquétipo oficial base é obrigatório',
    arquetipoNaoEncontrado: 'Arquétipo oficial \'{arquetipo}\' não encontrado. Use: {disponiveis}',
    estruturaObrigatoria: 'Estrutura personalizada é obrigatória',
    diretoriosArray: 'Diretórios devem ser um array',
    arquivosChaveArray: 'Arquivos-chave devem ser um array',
  },
  melhoresPraticas: {
    srcOrganizado: 'Mantenha código fonte organizado em src/',
    testesDedicados: 'Separe testes em pasta dedicada',
    documenteApis: 'Documente APIs e funcionalidades importantes',
  },
} as const;
