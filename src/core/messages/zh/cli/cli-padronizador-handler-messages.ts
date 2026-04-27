// SPDX-License-Identifier: MIT

export const CliPadronizadorHandlerMensagens = {
  scannerIniciando: '正在检查标准化...',
  looseEquality: (qtd: number) => `发现 ${qtd} 处使用宽松相等（==/!=）。`,
  asAny: (qtd: number) => `发现 ${qtd} 处使用 "as any"。`,
  angleBracket: (qtd: number) => `发现 ${qtd} 处使用尖括号类型断言。`,
  tudoPadronizado: '未发现标准化问题。',
  erroScan: (msg: string) => `扫描标准化时出错：${msg}`
} as const;