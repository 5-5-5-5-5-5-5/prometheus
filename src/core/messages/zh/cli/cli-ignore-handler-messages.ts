// SPDX-License-Identifier: MIT

export const CliIgnoreHandlerMensagens = {
  scannerIniciando: '正在检查 .gitignore...',
  arquivoAusente: '项目中未找到 .gitignore 文件。',
  arquivoIncompleto: (qtd: number) => `.gitignore 不完整：缺少 ${qtd} 个常见模式。`,
  arquivoCompleto: '.gitignore 已完整。',
  erroScan: (msg: string) => `扫描 .gitignore 时出错：${msg}`
} as const;