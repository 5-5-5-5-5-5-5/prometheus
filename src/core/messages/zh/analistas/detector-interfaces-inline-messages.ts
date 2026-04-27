// SPDX-License-Identifier: MIT

/**
 * @fileoverview 内联接口检测器的诊断消息。
 * 提供文本模板，建议将内联类型和接口
 * 提取到专用的类型文件，以及检测重复类型。
 */

import type { TipoDuplicadoArgs } from '@projeto-types/analistas';

export const DetectorInterfacesInlineMensagens = {
  moverTipoParaTipos: (nomeTipo: string, tiposDir = 'src/tipos') => `将类型 '${nomeTipo}' 移至 ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  interfaceExportadaParaTipos: (nomeInterface: string, tiposDir = 'src/tipos') => `导出的接口 '${nomeInterface}' 应位于 ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  interfaceComplexaParaTipos: (nomeInterface: string, tiposDir = 'src/tipos') => `复杂接口 '${nomeInterface}' 应移至 ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  tipoDuplicado: (args: TipoDuplicadoArgs) => `类型 {${args.propriedades.join(', ')}...} 重复 ${args.totalOcorrencias} 次 ${args.contextoDesc} - 提取为 '${args.nomesSugeridos}Type'`
} as const;
