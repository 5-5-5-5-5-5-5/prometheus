// SPDX-License-Identifier: MIT
/**
 * Tipos para o conselheiro senseial
 */

/**
 * Contexto para emissão de conselhos sensei
 */
export interface ConselhoContextoSenseial {
  hora?: number;
  arquivosParaCorrigir?: number;
  arquivosParaPodar?: number;
  totalOcorrenciasAnaliticas?: number;
  integridadeGuardian?: string;
}
