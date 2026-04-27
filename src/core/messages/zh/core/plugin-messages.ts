// SPDX-License-Identifier: MIT
// @prometheus-disable seguranca vulnerabilidade-seguranca
/**
* 插件分析器消息
*
* 集中化所有插件消息:
* - React
* - React Hooks
* - Tailwind
* - CSS
* - HTML
* - Python
*/
  /* -------------------------- React 消息 -------------------------- */
export const ReactMensagens = {
linkTargetBlank: '带有 target="_blank" 的链接缺少 rel="noreferrer"/"noopener"。',
dangerouslySetInnerHTML: '发现使用 dangerouslySetInnerHTML；请确认是否必要。',
imgWithoutAlt: '图片缺少 alt 属性 (可访问性)。',
httpFetch: '检测到未使用 TLS 的 HTTP 调用；建议使用 HTTPS。',
hardcodedCredential: '可能存在硬编码凭据；请使用环境变量。',
locationHrefRedirect: '直接赋值给 location.href；请验证来源以防止开放重定向。',
listItemNoKey: '列表 (map) 中的项目缺少 key 属性。',
indexAsKey: '使用索引作为 key (可能导致重排序问题)。',
inlineHandlerJsx: '在 JSX 中检测到内联处理函数；建议使用稳定函数 (useCallback) 或提取到渲染外部。',
deprecatedLifecycleMethod: (name: string) => `已废弃的生命周期方法: ${name}。请使用 componentDidMount、componentDidUpdate 或 hooks。`,
complexInlineStyles: '检测到复杂的内联样式。考虑使用 CSS 模块或 styled-components 以获得更好的性能和组织。'
} as const;
  /* -------------------------- React Hooks 消息 -------------------------- */
export const ReactHooksMensagens = {
useEffectNoDeps: 'useEffect 缺少依赖数组 (请评估依赖项以避免循环)。',
memoCallbackNoDeps: 'Hook 缺少依赖数组 (useMemo/useCallback)。',
hookInConditional: '在条件语句中声明了 Hook (违反了 Hooks 规则)。'
} as const;
  /* -------------------------- Tailwind 消息 -------------------------- */
export const TailwindMensagens = {
conflictingClasses: (key: string, tokens: string[]) => `可能的 ${key} 冲突 (${tokens.slice(0, 4).join(', ')})。请检查重复。`,
repeatedClass: (token: string) => `检测到重复的类 (${token})。建议移除冗余。`,
importantUsage: (token: string) => `在 (${token}) 中检测到使用 ! (important)。建议使用工具类或作用域增强，而非 important。`,
variantConflict: (prop: string, variants: string[]) => `${prop} 可能存在变体冲突 (变体: ${variants.slice(0, 6).join(', ')})。请检查顺序/作用域。`,
dangerousArbitraryValue: (token: string) => `带有潜在危险的 url 任意值 (${token})。避免使用 javascript:/data:text/html。`,
arbitraryValue: (token: string) => `带有任意值的类 (${token})。请确认是否符合设计。`
} as const;
  /* -------------------------- CSS 消息 -------------------------- */
export const CssMensagens = {
duplicatePropertySame: (prop: string) => `检测到重复属性且值相同 (${prop}): 错误。`,
duplicatePropertyDifferent: (prop: string, prev: string, curr: string) => `重复属性 (${prop}) 但值不同。可能错误: "${prev}" 与 "${curr}"。`,
importantUsage: '检测到使用 !important；建议使用适当的选择器优先级。',
httpImport: '检测到通过 HTTP 导入；建议使用 HTTPS 或本地打包。',
httpUrl: 'url() 中通过 HTTP 引用外部资源；建议使用 HTTPS。',
unifySelectors: (selectors: string[], propsCount: number) => `选择器 (${selectors.slice(0, 6).join(', ')}) 的 CSS 规则相同 (${propsCount} 个属性)。建议统一/集中为工具类或共享选择器。`,
idSelectorPreferClass: (selector: string) => `检测到 ID 选择器 (${selector})。为复用和一致性考虑，请尽可能使用类。`,
invalidProperty: (prop: string) => `无效或未知的 CSS 属性 (${prop})。请检查拼写或浏览器支持。`,
malformedSelector: (selector: string) => `格式错误/无效的 CSS 选择器 (${selector})。可能导致渲染问题。`,
emptyRule: '检测到空的 CSS 规则。请移除没有声明的规则。',
vendorPrefixDeprecated: (prop: string) => `已弃用的厂商前缀 (${prop})。请在支持时使用标准属性。`,
cssHackDetected: (hack: string) => `检测到 CSS hack (${hack})。请考虑现代方法或特性查询。`
} as const;
  /* -------------------------- HTML 消息 -------------------------- */
export const HtmlMensagens = {
// 结构
doctype: '文档未声明 <!DOCTYPE html>。',
htmlLang: '<html> 元素缺少 lang 属性 (可访问性)。',
metaCharset: '文档中缺少 <meta charset="utf-8">。',
viewport: '缺少用于响应式的 viewport meta。',
title: '文档未定义 <title>。',
// 链接
linkTargetBlank: '带有 target="_blank" 的链接缺少 rel="noreferrer"/"noopener"。',
linkNoHref: '链接缺少有效的 href 或处理函数 (UX)。请使用 <button> 或 role="button"。',
// 图片
imgWithoutAlt: '图片缺少 alt 属性或可访问性 (WCAG 2.1)。',
imgWithoutLoading: '图片缺少 loading 属性 (性能)。建议使用 loading="lazy"。',
imgWithoutDimensions: '图片缺少 width/height (布局偏移)。请设置尺寸以防止 CLS。',
// 表单
formWithoutMethod: '表单未指定 method (GET/POST)。',
formWithoutAction: '表单缺少 action 或用于处理的 data-attribute。',
inputWithoutLabel: 'Input 缺少 name、id 或 aria-label (可访问性/可用性)。',
passwordWithoutAutocomplete: '密码字段未指定 autocomplete (安全)。',
inputWithoutType: 'Input 未指定 type (默认为 text，但请显式声明)。',
// 处理函数
inlineHandler: '检测到内联处理函数 (on*)。建议使用外部监听器或带 JS 的 data-attributes。',
// 脚本/样式
inlineScript: '检测到内联脚本。建议使用外部文件以获得更好的缓存和 CSP。',
inlineStyle: '检测到内联样式。建议使用外部 CSS 文件以获得更好的缓存。',
scriptWithoutDefer: '脚本缺少 defer/async。可能阻塞渲染；建议使用 defer。',
// 可访问性
headingSkipped: (current: number, expected: number) => `跳过了标题: h${current} 缺少前置的 h${expected} (语义结构)。`,
buttonWithoutText: '按钮缺少文本或 aria-label (可访问性)。',
tableWithoutCaption: '表格缺少 <caption> 或 aria-label (可访问性)。',
iframeWithoutTitle: 'Iframe 缺少 title (可访问性)。',
// 性能
largeInlineScript: '内联脚本过大。请移至外部文件。',
multipleH1: '检测到多个 <h1>。为 SEO/可访问性考虑，每页仅使用一个。'
} as const;
  /* -------------------------- XML 消息 -------------------------- */
export const XmlMensagens = {
xmlPrologAusente: 'XML 缺少 <?xml ...?> 声明 (可选，但可提高兼容性)。',
doctypeDetectado: 'XML 包含 <!DOCTYPE>。请注意 XXE 向量 (外部实体)。',
doctypeExternoDetectado: 'XML 包含带外部标识符 (SYSTEM/PUBLIC) 的 DOCTYPE。如果解析器不安全，XXE 风险很高。',
entidadeDetectada: 'XML 包含 <!ENTITY>。请检查是否存在扩展/XXE 风险。',
entidadeExternaDetectada: 'XML 包含外部实体 (SYSTEM/PUBLIC)。如果解析器不安全，XXE 风险很高。',
entidadeParametroDetectada: 'XML 包含参数实体 (<!ENTITY % ...>)。可能用于 XXE/DTD 注入；请仔细审查。',
xincludeDetectado: 'XML 包含 XInclude (<xi:include>)。可能加载外部资源；请验证来源和解析器。',
namespaceUndeclared: (prefix: string) => `使用了命名空间前缀 "${prefix}" 但未声明 xmlns:${prefix}。`,
invalidXmlStructure: '检测到无效的 XML 结构 (未关闭或嵌套不当的标签)。',
encodingMismatch: (declared: string, detected: string) => `声明的编码 (${declared}) 与检测到的 (${detected}) 不匹配。`,
largeEntityExpansion: '可能存在非常大的实体扩展。Billion Laughs 攻击风险。',
cdataInAttribute: '在属性值中检测到 CDATA (XML 中无效)。'
} as const;
  /* -------------------------- 格式化器消息 (MIN) -------------------------- */
export const FormatadorMensagens = {
naoFormatado: (parser: string, detalhes?: string) => {
const base = `文件似乎未格式化 (解析器: ${parser})。建议使用 Prometheus 格式化器规范化。`;
if (!detalhes) return base;
return `${base} (${detalhes})`;
},
parseErro: (parser: string, err: string) => `验证内部格式化失败 (解析器: ${parser}): ${err}`
} as const;
  /* -------------------------- SVG 消息 (优化) -------------------------- */
export const SvgMensagens = {
naoPareceSvg: '.svg 文件不包含有效的 <svg> 标签。',
semViewBox: '检测到 SVG 缺少 viewBox (可能影响响应式)。',
scriptInline: 'SVG 包含 <script>。安全风险: 避免带有嵌入式脚本的 SVG。',
eventoInline: 'SVG 包含内联处理函数 (on*)。避免在资产中使用内联事件。',
javascriptUrl: 'SVG 在 URL/href 中包含 javascript:。安全风险。',
podeOtimizar: (originalBytes: number, optimizedBytes: number, mudancas: string[]) => `SVG 可优化 (${originalBytes}B → ${optimizedBytes}B)。更改: ${mudancas.join(', ')}。`
} as const;
  /* -------------------------- CSS-in-JS 消息 -------------------------- */
export const CssInJsMensagens = {
detectedStyledComponents: '检测到 styled-components 模式 (CSS-in-JS)。',
detectedStyledJsx: '检测到 styled-jsx 模式 (React 中的 CSS-in-JS)。',
globalStyles: (fonte: 'styled-components' | 'styled-jsx') => `检测到全局样式 (${fonte})。请尽可能使用局部作用域。`,
importantUsage: '在 CSS-in-JS 中检测到使用 !important；建议使用适当的选择器优先级。',
httpUrl: 'url() 中通过 HTTP 引用外部资源；建议使用 HTTPS。'
} as const;
  /* -------------------------- Python 消息 -------------------------- */
export const PythonMensagens = {
// 导入与依赖
missingTypeHints: '检测到函数缺少类型提示；请添加类型提示以提高可读性。',
hardcodedString: (string: string) => `检测到硬编码字符串 (${string.slice(0, 30)}...)；建议使用常量。`,
httpWithoutVerify: '检测到 HTTP 请求缺少 verify=True；请验证 SSL 证书。',
sqlInjection: '可能存在 SQL 注入；请使用预处理语句。',
// 代码质量
broadExcept: '检测到通用异常 (except:)；请指定具体异常。',
bareRaise: '检测到 raise 缺少上下文；请始终传递异常以保持堆栈跟踪。',
passInExcept: '在 except 块中使用 pass；请实现适当的错误处理。',
// 最佳实践
printInsteadOfLog: '检测到 print()；生产环境建议使用 logging 模块。',
evalUsage: '检测到 eval()；请避免使用 eval - 安全漏洞。',
execUsage: '检测到 exec()；请避免使用 exec - 安全漏洞。',
subprocessShellTrue: '检测到 subprocess 使用 shell=True；存在命令注入风险。建议使用 args 列表和 shell=False。',
pickleUsage: '检测到 pickle load(s)；请勿反序列化不受信任的数据 (RCE)。建议使用安全格式 (JSON)。',
yamlUnsafeLoad: '检测到 yaml.load 缺少安全 Loader；建议使用 yaml.safe_load (防止执行)。',
globalKeyword: '检测到使用 global 关键字；建议作为参数传递。',
mutableDefault: '检测到参数使用可变的默认值 (list/dict)；建议使用 None 作为默认值。',
// 性能
listComprehensionOpportunity: '检测到可使用列表推导式的循环。',
loopingOverDict: '遍历字典未使用 .items()；建议使用 .items()。'
} as const;
  /* -------------------------- 严重级别 -------------------------- */
export const SeverityNiveis = {
error: '错误',
warning: '警告',
info: '信息',
suggestion: '建议'
} as const;
  /* -------------------------- 分析员类别/类型 -------------------------- */
export const AnalystTipos = {
react: 'react/规则',
reactHooks: 'react-hooks/规则',
tailwind: 'tailwindcss/规则',
css: 'css/规则',
html: 'html/规则',
python: 'python/规则',
xml: 'xml/规则',
formatador: '格式化器/规则',
svg: 'svg/规则',
cssInJs: 'css-in-js/规则'
} as const;
export const AnalystOrigens = {
react: '分析员-react',
reactHooks: '分析员-react-hooks',
tailwind: '分析员-tailwind',
css: '分析员-css',
html: '分析员-html',
python: '分析员-python',
xml: '分析员-xml',
formatador: '分析员-格式化器',
svg: '分析员-svg',
cssInJs: '分析员-css-in-js'
} as const;
