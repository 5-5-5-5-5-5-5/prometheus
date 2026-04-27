// SPDX-License-Identifier: MIT

export const CliBinMensagens = {
  flagsInvalidas: 'Flags inválidas: {erro}',
  unhandledRejection: 'Prometheus: unhandled rejection',
  excecaoNaoCapturada: 'Exceção não capturada: {mensagem}',
  erroInicializacao: 'Erro ao inicializar o prometheus:',
  resumoConversa: {
    titulo: '\n RESUMO DA CONVERSA',
    total: 'Total: {total}',
    usuario: 'Usuário: {total}',
    prometheus: 'Prometheus: {total}',
    primeira: 'Primeira: {mensagem}',
    ultima: 'Última: {mensagem}',
  },
  historicoIndisponivel: 'Histórico indisponível.',
  historicoLimpo: 'Histórico limpo.',
} as const;
