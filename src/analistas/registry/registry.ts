// SPDX-License-Identifier: MIT
// Analistas de melhorias e correções automáticas (unificado)
// Resolve analistas de correção automática dinamicamente para compatibilidade com múltiplas formas de export
// analistaFantasma not exported from js-ts/fantasma; that module provides detectarFantasmas used by zeladores
// Analistas especializados complementares
import { comSupressaoInline } from '@shared/helpers';

import type { Analista, EntradaRegistry, InfoAnalista, ModuloAnalista, Tecnica } from '@';

import { analistaAntiPadroesAsync } from '../detectores/detector-anti-padroes-async.js';
import { analistaArquitetura } from '../detectores/detector-arquitetura.js';
import { analistaCodigoFragil } from '../detectores/detector-codigo-fragil.js';
// Novos analistas refinados
import { analistaConstrucoesSintaticas } from '../detectores/detector-construcoes-sintaticas.js';
import * as detectorDependenciasMod from '../detectores/detector-dependencias.js';
import { analistaDuplicacoes } from '../detectores/detector-duplicacoes.js';
import * as detectorEstruturaMod from '../detectores/detector-estrutura.js';
import { detectorInterfacesInline } from '../detectores/detector-interfaces-inline.js';
import { analistaPadronizador } from '../detectores/detector-padronizador.js';
import { analistaSeguranca } from '../detectores/detector-seguranca.js';
import { detectorTiposInseguros } from '../detectores/detector-tipos-inseguros.js';
import { analistaVazamentoMemoria } from '../detectores/detector-vazamentos-memoria.js';
// Analistas contextuais inteligentes
import { analistaSugestoesContextuais } from '../estrategistas/sugestoes-contextuais.js';
// Analistas de IA (v0.7.0 - AI-Powered Analysis)
import { analistaComandosCli } from '../js-ts/analista-comandos-cli.js';
import { analistaFuncoesLongas } from '../js-ts/analista-funcoes-longas.js';
import { analistaPadroesUso } from '../js-ts/analista-padroes-uso.js';
import { analistaTodoComentarios } from '../js-ts/analista-todo-comments.js';
// Plugins opcionais (movidos para @analistas/plugins/)
import { analistaDocumentacao } from '../plugins/detector-documentacao.js';
import { detectorMarkdown } from '../plugins/detector-markdown.js';
import { discoverAnalistasPlugins } from './autodiscovery.js';

let analistaCorrecaoAutomatica: EntradaRegistry = undefined;
try {
  const mod = await import('../corrections/analista-pontuacao.js');
  // conservatively treat dynamic module shapes as unknown, avoid `any`
  const dynamicMod = mod as ModuloAnalista;
  analistaCorrecaoAutomatica = dynamicMod.analistaCorrecaoAutomatica ?? dynamicMod.analistas?.[0] ?? dynamicMod.default as EntradaRegistry ?? undefined;
} catch {
  // leave undefined - registry will tolerate undefined entries
}
const pluginsAutodiscovered = await discoverAnalistasPlugins();

// Registro central de analistas. Futuro: lazy loading, filtros por categoria.
const detectorDependencias = (detectorDependenciasMod as ModuloAnalista).detectorDependencias ?? (detectorDependenciasMod as ModuloAnalista).default ?? detectorDependenciasMod;
const detectorEstrutura = (detectorEstruturaMod as ModuloAnalista).detectorEstrutura ?? (detectorEstruturaMod as ModuloAnalista).default ?? detectorEstruturaMod;
export const registroAnalistas: (Analista | Tecnica)[] = [
// Analistas existentes
comSupressaoInline(detectorDependencias as unknown as Analista) as Tecnica, comSupressaoInline(detectorEstrutura as unknown as Analista) as Tecnica, comSupressaoInline(analistaFuncoesLongas as Analista), comSupressaoInline(analistaPadroesUso as unknown as Analista) as Tecnica, comSupressaoInline(analistaComandosCli as unknown as Analista) as Tecnica, comSupressaoInline(analistaTodoComentarios as unknown as Analista) as Tecnica,
// Novos analistas refinados
comSupressaoInline(analistaConstrucoesSintaticas), comSupressaoInline(analistaCodigoFragil), comSupressaoInline(analistaDuplicacoes), comSupressaoInline(analistaArquitetura),
// Analistas especializados complementares
// Analistas especializados complementares
comSupressaoInline(analistaAntiPadroesAsync as unknown as Analista), comSupressaoInline(analistaVazamentoMemoria as unknown as Analista), comSupressaoInline(analistaSeguranca), comSupressaoInline(analistaDocumentacao), comSupressaoInline(detectorMarkdown as unknown as Analista), comSupressaoInline(detectorTiposInseguros as unknown as Analista), comSupressaoInline(detectorInterfacesInline as unknown as Analista), comSupressaoInline(analistaPadronizador),
// Plugins autodiscovered em src/analistas/plugins/
...pluginsAutodiscovered.map(p => comSupressaoInline(p as unknown as Analista) as Tecnica),
// Analistas contextuais inteligentes
analistaSugestoesContextuais,
// Analistas de melhorias e correções automáticas
// If analistaCorrecaoAutomatica couldn't be resolved, skip the entry
...(analistaCorrecaoAutomatica ? [analistaCorrecaoAutomatica] : [])];
export function listarAnalistas(): InfoAnalista[] {
  return registroAnalistas.map(a => ({
    nome: (a as Analista).nome || 'desconhecido',
    categoria: (a as Analista).categoria || 'n/d',
    descricao: (a as Analista).descricao || ''
  }));
}
