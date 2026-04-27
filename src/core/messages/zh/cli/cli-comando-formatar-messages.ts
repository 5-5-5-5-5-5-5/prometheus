// SPDX-License-Identifier: MIT

export const CliFormatarExtraMensagens = {
  titulo: ' 格式化',
  scanOnlyAtivo: 'SCAN_ONLY 模式已激活；格式化命令需要读取内容。',
  falhaFormatar: '格式化 {arquivo} 失败：{erro}',
  errosEncontrados: '错误：{total}',
  precisaFormatacao: '发现 {total} 个文件需要格式化。使用 --write 应用更改。',
  tudoFormatado: '全部已格式化。',
  arquivosFormatados: '已格式化 {total} 个文件。',
  nenhumaMudanca: '无需更改。',
} as const;
