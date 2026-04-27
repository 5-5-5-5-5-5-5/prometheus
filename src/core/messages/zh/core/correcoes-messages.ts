// SPDX-License-Identifier: MIT
/**
 * 自动修复消息
 *
 * 集中所有与以下相关的消息：
 * - 快速修复（fix-any-to-proper-type、fix-unknown 等）
 * - 管理员（导入、结构、类型）
 * - 自动修复总体
 */

import { buildTypesRelPathPosix, getTypesDirectoryDisplay } from '../../../config/conventions.js';
import { ICONES } from '../../shared/icons.js';

/**
 * 快速修复消息 - Any/Unknown
 */
export const MENSAGENS_CORRECAO_TIPOS = {
  // 快速修复的标题和描述
  fixAny: {
    title: '将 any 替换为安全类型',
    get description() { return `分析 any 的使用情况并推断/创建正确的类型到 ${getTypesDirectoryDisplay()}` }
  },
  fixUnknown: {
    title: '将 unknown 替换为具体类型',
    description: '检测类型守卫模式并创建专用类型'
  },
  // 验证消息
  validacao: {
    falha: (erros: string[]) => `验证失败：${erros.join(', ')}`,
    revisar: '请手动审查'
  },
  // 警告和建议
  warnings: {
    confiancaBaixa: (confianca: number) => `不安全类型（any），置信度过低（${confianca}%），不适合自动修复`,
    confiancaMedia: (confianca: number, tipoSugerido: string) => `检测到不安全类型。建议：${tipoSugerido}（置信度：${confianca}%）`,
    unknownApropriado: '此处使用 unknown 是合适的（通用输入或置信度低）',
    useTiposCentralizados: () => `请使用集中管理的类型（位于专用目录 ${getTypesDirectoryDisplay()}）`,
    criarTipoDedicado: (caminho: string) => `考虑在 ${buildTypesRelPathPosix(caminho)} 创建专用类型`,
    adicioneTypeGuards: () => `如果可能，请添加类型守卫或在 ${getTypesDirectoryDisplay()} 创建专用类型`
  },
  // 错误消息
  erros: {
    extrairNome: '无法提取变量名',
    variavelNaoUsada: '变量未使用 - 无法推断类型',
    analise: (erro: string) => `分析错误：${erro}`
  }
} as const;

/**
 * 自动修复消息
 */
export const MENSAGENS_AUTOFIX = {
  // 状态消息
  iniciando: (modo: string) => `${ICONES.acao.correcao} 开始自动修复（模式：${modo}）`,
  dryRun: `${ICONES.feedback.info} 模拟运行：模拟修复（不会应用任何更改）`,
  aplicando: (count: number) => `正在应用 ${count} 处修复...`,
  concluido: (aplicadas: number, falhas: number) => `${ICONES.nivel.sucesso} 自动修复完成：${aplicadas} 处已应用，${falhas} 处失败`,
  naoDisponivel: `${ICONES.feedback.info} 没有可用的自动修复`,
  // 标志和模式
  flags: {
    fixSafe: `${ICONES.comando.guardian} 检测到 --fix-safe 标志：启用保守模式`,
    requireMutateFS: `${ICONES.status.falha} 当前无法使用自动修复。`
  },
  // 进度日志
  logs: {
    modoConservador: `${ICONES.comando.guardian} 已激活保守模式 - 仅应用高置信度修复`,
    validacaoEslint: `${ICONES.acao.analise} 正在运行自动修复后的 ESLint 验证...`,
    arquivoMovido: (origem: string, destino: string) => `${ICONES.status.ok} 已移动：${origem} → ${destino}`,
    arquivoRevertido: (origem: string, destino: string) => `↩ 文件已还原：${destino} → ${origem}`,
    arquivoRevertidoConteudo: (origem: string, destino: string) => `↩ 文件已还原为原始内容：${destino} → ${origem}`
  },
  // 结果
  resultados: {
    sucesso: (count: number) => `${ICONES.status.ok} ${count} 个文件已修复`,
    falhas: (count: number) => `${ICONES.status.falha} ${count} 个文件出错`,
    erroArquivo: (arquivo: string, erro: string) => `${ICONES.status.falha} ${arquivo}：${erro}`
  },
  // 修复后提示
  dicas: {
    executarLint: `${ICONES.feedback.dica} 运行 \`npm run lint\` 验证修复`,
    executarBuild: `${ICONES.feedback.dica} 运行 \`npm run build\` 验证代码是否可以编译`,
    removerDryRun: `${ICONES.feedback.dica} 移除 --dry-run 以自动应用修复`,
    ajustarConfianca: `${ICONES.feedback.dica} 使用 --confidence <数字> 调整阈值（当前：85%）`
  }
} as const;

/**
 * 分析报告消息
 */
export const MENSAGENS_RELATORIOS_ANALISE = {
  asyncPatterns: {
    titulo: `${ICONES.relatorio.resumo} Async/Await 模式分析`,
    padroes: `\n${ICONES.relatorio.resumo} 代码使用模式：`,
    recomendacoes: `\n${ICONES.feedback.dica} 修复建议：\n`,
    critico: `${ICONES.nivel.erro} 严重（立即审查）：`,
    alto: `\n${ICONES.feedback.atencao} 高（在当前迭代中审查）：`,
    salvo: (caminho: string) => `${ICONES.nivel.sucesso} 异步报告已保存到：${caminho}`
  },
  fixTypes: {
    analiseSalva: `${ICONES.arquivo.json} 详细分析已保存到：.prometheus/fix-types-analise.json`,
    possibilidades: `└─ ${ICONES.acao.analise} 其他可能性：`,
    sugestao: (texto: string) => `└─ ${ICONES.feedback.dica} ${texto}`,
    exportado: `${ICONES.arquivo.doc} fix-types 报告已导出：`
  },
  guardian: {
    baselineAceito: `${ICONES.status.ok} Guardian：基线已手动接受（--aceitar）。`,
    exportado: `${ICONES.arquivo.doc} Guardian 报告已导出：`
  }
} as const;

/**
 * 原型消息
 */
export const MENSAGENS_ARQUETIPOS_HANDLER = {
  timeout: `${ICONES.feedback.atencao} 原型检测超时`,
  salvo: (caminho: string) => `${ICONES.status.ok} 自定义原型已保存到 ${caminho}`,
  falha: `${ICONES.feedback.atencao} 无法通过原型生成计划。`,
  falhaEstrategista: `${ICONES.feedback.atencao} 策略师未能建议计划。`,
  falhaGeral: `${ICONES.feedback.atencao} 总体计划失败。`
} as const;

/**
 * 插件消息
 */
export const MENSAGENS_PLUGINS = {
  registrado: (nome: string, extensoes: string[]) => `${ICONES.status.ok} 插件 ${nome} 已注册，扩展：${extensoes.join(', ')}`,
  configAtualizada: `${ICONES.acao.correcao} 注册表配置已更新`,
  erroParsear: (linguagem: string, erro: string) => `${ICONES.feedback.atencao} 解析 ${linguagem} 出错：${erro}`
} as const;

/**
 * 执行器消息
 */
export const MENSAGENS_EXECUTOR = {
  analiseCompleta: (tecnica: string, arquivo: string, duracao: string) => `${ICONES.arquivo.arquivo} '${tecnica}' 分析了 ${arquivo}，耗时 ${duracao}`
} as const;

/**
 * 整合导出
 */
export const MENSAGENS_CORRECOES = {
  fixTypes: MENSAGENS_CORRECAO_TIPOS,
  autofix: MENSAGENS_AUTOFIX,
  relatorios: MENSAGENS_RELATORIOS_ANALISE,
  arquetipos: MENSAGENS_ARQUETIPOS_HANDLER,
  plugins: MENSAGENS_PLUGINS,
  executor: MENSAGENS_EXECUTOR
} as const;
