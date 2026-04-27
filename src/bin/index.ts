#!/usr/bin/env node
// SPDX-License-Identifier: MIT
import fs from 'node:fs';
import { register } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Bootstrap: Registro do loader ESM programaticamente.
 * Isso permite que o Prometheus suporte aliases do tsconfig.json em tempo de execução
 * sem a necessidade de passar flags --loader na linha de comando.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// No ambiente de desenvolvimento (src/), o loader está em src/node.loader.ts
// No ambiente de build (dist/), o loader está em dist/node.loader.js
const projetoRaiz = resolve(__dirname, '..', '..');
let loaderCaminho = resolve(projetoRaiz, 'src', 'node.loader.ts');

if (!fs.existsSync(loaderCaminho)) {
  const distRaiz = resolve(__dirname, '..');
  loaderCaminho = resolve(distRaiz, 'node.loader.js');
}

const loaderUrl = pathToFileURL(loaderCaminho).toString();

try {
  register(loaderUrl, pathToFileURL('./'));
} catch {
  console.warn('Aviso: Não foi possível registrar o loader ESM automaticamente. Aliases podem não funcionar.');
}

/**
 * Lógica principal do CLI
 */
async function mainCli() {
  const { Command } = await import('commander');
  const { registrarComandos } = await import('@cli');
  const { comandoPerf } = await import('@cli/commands');
  const { ExitCode, sair } = await import('@cli/helpers');
  const { chalk, aplicarConfigParcial, inicializarConfigDinamica } = await import('@core/config');
  const { getMessages } = await import('@core/messages');
  const { getDefaultContextMemory } = await import('@shared');
  const { lerArquivoTexto } = await import('@shared/persistence');
  const { extrairMensagemErro } = await import('@');

  const { log, CliBinMensagens } = getMessages();
  const program = new Command();

  async function getVersion(): Promise<string> {
    try {
      const packageCaminho = resolve(__dirname, '..', '..', 'package.json');
      const raw = await lerArquivoTexto(packageCaminho);
      const pkg = raw ? JSON.parse(raw) : ({} as Record<string, unknown>);
      return (pkg && (pkg as { version?: string }).version) || '0.0.0';
    } catch (err) {
      log.debug(`Erro ao obter versão: ${err instanceof Error ? err.message : String(err)}`);
      return '0.0.0';
    }
  }

  async function aplicarFlagsGlobais(opts: unknown) {
    const { sanitizarFlags } = await import('@shared/validation');
    try {
      sanitizarFlags(opts as Record<string, unknown>);
    } catch (e) {
      console.error(chalk.red(CliBinMensagens.flagsInvalidas.replace('{erro}', (e as Error).message)));
      sair(ExitCode.InvalidUsage);
    }

    const flags = opts as { verbose?: boolean; debug?: boolean; profile?: boolean };
    if (flags.verbose || flags.debug) {
      process.env.PROMETHEUS_LOG_LEVEL = flags.debug ? 'debug' : 'info';
    }

    if (Object.keys(flags).length) {
      aplicarConfigParcial(flags);
    }
  }

  try {
    const version = await getVersion();

    program
      .name('prometheus')
      .version(version)
      .description('C.L.I modular para análise, diagnóstico e manutenção de projetos')
      .option('-v, --verbose', 'Exibe logs detalhados')
      .option('--debug', 'Habilita modo de debug')
      .option('--profile', 'Habilita profiling de performance')
      .hook('preAction', async (thisCommand) => {
        await aplicarFlagsGlobais(thisCommand.opts());
      });

    registrarComandos(program, (o) => aplicarFlagsGlobais(o));
    program.addCommand(comandoPerf());

    await inicializarConfigDinamica();
    await getDefaultContextMemory();

    await program.parseAsync(process.argv);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code;
      if (code.startsWith('commander.')) return;
    }
    const mensagem = extrairMensagemErro(err);
    console.error(chalk.red(`\n${CliBinMensagens.erroInicializacao} ${mensagem}`));
    if (process.env.PROMETHEUS_LOG_LEVEL === 'debug') console.error(err);
    sair(ExitCode.Critical);
  }
}

mainCli().catch((err) => {
  console.error('Erro fatal na inicialização:', err);
  process.exit(1);
});
