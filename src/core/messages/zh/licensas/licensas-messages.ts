export const LicensasMensagens = {
  generatedNotices: '已生成声明:',
  disclaimerInserted: '已向以下文件插入免责声明:',
  missingDisclaimer: '以下文件缺少免责声明:',
  allIncludeDisclaimer: '所有 Markdown 文件均已包含免责声明。',
  erroObterLicenca: '无法通过缓存、API 或 npx 获取许可证信息',
  disclaimerNaoEncontrado: '未找到免责声明: {caminho}',
  validacaoContexto: '[验证] 验证失败{contexto}，使用回退方案',
  exclusaoInsegura: ' 部分排除模式被认为不安全，已被忽略: {padroes}',
  erroValidarSeguranca: ' 验证修复 {fixId} 的安全性时出错: {erro}',
  detectorMarkdownPath: 'detector-markdown: 未为 {arquivo} 提供 fullPath',
} as const;
