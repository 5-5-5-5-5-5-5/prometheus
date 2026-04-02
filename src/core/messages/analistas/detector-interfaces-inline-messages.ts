// SPDX-License-Identifier: MIT

/**
 * @fileoverview Mensagens de diagnóstico para o detector de interfaces inline.
 * Fornece templates de texto para sugerir a extração de tipos e interfaces
 * inline para arquivos dedicados de tipos, além de detectar tipos duplicados.
 */

import type { TipoDuplicadoArgs } from '../../../types/analistas/detectores.js';

export const DetectorInterfacesInlineMensagens = {
  moverTipoParaTipos: (nomeTipo: string, tiposDir = 'src/tipos') => `Mover tipo '${nomeTipo}' para ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  interfaceExportadaParaTipos: (nomeInterface: string, tiposDir = 'src/tipos') => `Interface '${nomeInterface}' exportada deve estar em ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  interfaceComplexaParaTipos: (nomeInterface: string, tiposDir = 'src/tipos') => `Interface '${nomeInterface}' complexa deve ser movida para ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  tipoDuplicado: (args: TipoDuplicadoArgs) => `Tipo {${args.propriedades.join(', ')}...} duplicado ${args.totalOcorrencias}x ${args.contextoDesc} - extrair como '${args.nomesSugeridos}Type'`
} as const;