// SPDX-License-Identifier: MIT
import type { Command } from 'commander';

import {
  comandoAnalistas,
  comandoAtualizar,
  comandoDiagnosticar,
  comandoFormatar,
  comandoGuardian,
  comandoIgnore,
  comandoImporter,
  comandoLicencas,
  comandoMetricas,
  comandoNames,
  comandoOtimizarSvg,
  comandoPadronizador,
  comandoPlugins,
  comandoPodar,
  comandoReestruturar,
  comandoRename,
  criarComandoFixTypes,
  registrarComandoReverter,
} from './commands/index.js';

export function registrarComandos(
  program: Command,
  aplicarFlagsGlobais: (opts: unknown) => void,
): void {
  program.addCommand(comandoDiagnosticar(aplicarFlagsGlobais));
  program.addCommand(comandoGuardian(aplicarFlagsGlobais));
  program.addCommand(comandoFormatar(aplicarFlagsGlobais));
  program.addCommand(comandoOtimizarSvg(aplicarFlagsGlobais));
  program.addCommand(comandoPodar(aplicarFlagsGlobais));
  program.addCommand(comandoPadronizador(aplicarFlagsGlobais));
  program.addCommand(comandoReestruturar(aplicarFlagsGlobais));
  program.addCommand(comandoAtualizar(aplicarFlagsGlobais));
  program.addCommand(comandoAnalistas());
  program.addCommand(comandoMetricas());
  program.addCommand(criarComandoFixTypes());
  program.addCommand(comandoLicencas());
  program.addCommand(comandoPlugins());
  program.addCommand(comandoNames(aplicarFlagsGlobais));
  program.addCommand(comandoRename(aplicarFlagsGlobais));
  program.addCommand(comandoImporter(aplicarFlagsGlobais));
  program.addCommand(comandoIgnore());
  registrarComandoReverter(program);
}
