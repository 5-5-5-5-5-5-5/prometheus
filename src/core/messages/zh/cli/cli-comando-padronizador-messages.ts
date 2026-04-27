// SPDX-License-Identifier: MIT

export const CliComandoPadronizadorMensagens = {
  descricao: '标准化项目中运算符的使用（例如：===、!==、?? vs ||）',
  escaneando: '正在扫描文件以查找不符合标准的模式...',
  arquivoProcessado: '已处理的文件：{path}',
  totalEncontrado: '发现 {total} 个可以标准化的实例。',
  alteracoesConcluidas: '标准化成功完成，共处理 {total} 个文件。',
  detalheOcorrencia: '[{linha}:{coluna}] 运算符 "{operador}" 可以标准化为 "{sugerido}"。',
  asAnyEncontrado: '[{linha}:{coluna}] 检测到 "as any"。建议使用 "as unknown" 或更具体的类型。',
  erroProcessar: '处理文件 {path} 时出错：{erro}'
} as const;