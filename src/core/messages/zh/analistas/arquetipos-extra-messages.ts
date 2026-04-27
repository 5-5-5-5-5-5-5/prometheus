export const ArquetiposExtraMensagens = {
  naoEncontrado: ' 在 {novo} 或 {legado} 中未找到自定义原型',
  salvo: ' 自定义原型已保存到 {caminho}',
  projetoPersonalizado: ' 检测到自定义项目："{nome}"',
  descricaoPersonalizado: 'Prometheus 识别出不匹配官方原型的项目结构，\n但您可以创建自定义原型以获得优化的建议！',
  estruturaDetectada: ' 检测到的结构：',
  arquivosRaiz: ' 根目录文件：',
  dicaCriar: ' 要创建自定义原型，请运行：',
  comandoCriar: '   prometheus diagnosticar --criar-arquetipo',
  explicacaoCriar: '这将基于当前结构创建 \'prometheus.repo.arquetipo.json\' 文件，\nPrometheus 将使用该文件在保持最佳实践的同时提供个性化建议。',
  validacao: {
    nomeObrigatorio: '项目名称为必填项',
    arquetipoObrigatorio: '必须指定基础官方原型',
    arquetipoNaoEncontrado: '未找到官方原型 \'{arquetipo}\'。可用选项：{disponiveis}',
    estruturaObrigatoria: '自定义结构为必填项',
    diretoriosArray: '目录必须是数组',
    arquivosChaveArray: '关键文件必须是数组',
  },
  melhoresPraticas: {
    srcOrganizado: '保持源代码在 src/ 中有序组织',
    testesDedicados: '将测试分离到专用目录',
    documenteApis: '记录 API 和重要功能',
  },
} as const;
