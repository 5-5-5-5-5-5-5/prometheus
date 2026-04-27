// SPDX-License-Identifier: MIT

export const CliBinMensagens = {
  flagsInvalidas: '无效的标志：{erro}',
  unhandledRejection: 'Prometheus：未处理的拒绝',
  excecaoNaoCapturada: '未捕获的异常：{mensagem}',
  erroInicializacao: '初始化 Prometheus 时出错：',
  resumoConversa: {
    titulo: '\n 对话摘要',
    total: '总计：{total}',
    usuario: '用户：{total}',
    prometheus: 'Prometheus：{total}',
    primeira: '第一条：{mensagem}',
    ultima: '最后一条：{mensagem}',
  },
  historicoIndisponivel: '历史记录不可用。',
  historicoLimpo: '历史记录已清除。',
} as const;
