// SPDX-License-Identifier: MIT

export const CliComandoAnalistasMensagens = {
  fastModeTitulo: '\n 已注册的分析器（快速模式）：\n',
  fastModeTotalZero: '\n总计：0',
  docMdTitulo: '# 已注册的分析器',
  docGeradoEm: (iso: string) => `生成时间：${iso}`,
  docTabelaHeader: '| 名称 | 分类 | 描述 | 限制 |',
  docTabelaSeparador: '| ---- | --------- | --------- | ------- |',
  docLinhaAnalista: (nome: string, categoria: string, descricao: string, limitesStr: string) => `| ${nome} | ${categoria} | ${descricao} | ${limitesStr} |`,
  docGerada: (destinoDoc: string) => ` 分析器文档已生成于 ${destinoDoc}`,
  jsonExportado: (destino: string) => ` 已导出分析器 JSON 到 ${destino}`,
  titulo: '\n 已注册的分析器：\n',
  linhaAnalista: (nome: string, categoria: string, descricao?: string) => `- ${nome}（${categoria}）${descricao ? `：${descricao}` : ''}`,
  tituloComIcone: (iconeInfo: string) => `${iconeInfo} 已注册的分析器：`,
  total: (n: number) => `\n总计：${n}`
} as const;
