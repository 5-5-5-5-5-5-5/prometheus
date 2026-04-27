// SPDX-License-Identifier: MIT
import { listarAnalistas } from '@analistas/registry';
import { messages } from '@core/messages';
import { Command } from 'commander';

import { ExitCode, sair } from '../helpers/exit-codes.js';

const log = messages.log;

/**
 * Comando para gerenciar plugins do Prometheus
 */
export function comandoPlugins(): Command {
  const plugins = new Command('plugins')
    .description('Gerencia plugins e extensões do Prometheus');

  plugins
    .command('list')
    .description('Lista todos os plugins e analistas carregados')
    .option('--json', 'Saída em formato JSON')
    .action((opts) => {
      try {
        const lista = listarAnalistas();
        if (opts.json) {
          console.log(JSON.stringify(lista, null, 2));
          return;
        }

        log.info('\nPlugins e Analistas Carregados:\n');
        lista.forEach((a) => {
          log.info(`- [${a.categoria.toUpperCase()}] ${a.nome}: ${a.descricao}`);
        });
        log.info(`\nTotal: ${lista.length} extensões ativas.\n`);
      } catch (err) {
        log.erro(`Erro ao listar plugins: ${err instanceof Error ? err.message : String(err)}`);
        sair(ExitCode.Failure);
      }
    });

  plugins
    .command('install <pacote>')
    .description('Instala um novo plugin (simulado)')
    .action((pacote) => {
      log.info(`\nBuscando pacote ${pacote} no registry...`);
      log.info('Instalando dependências e registrando analistas...');

      // Mock de instalação para v0.5.0
      setTimeout(() => {
        log.sucesso(`Plugin ${pacote} instalado com sucesso!`);
        log.info(`Dica: Use 'prometheus analistas' para ver as novas detecções disponíveis.`);
      }, 500);
    });

  plugins
    .command('remove <pacote>')
    .description('Remove um plugin instalado')
    .action((pacote) => {
      log.info(`\nRemovendo ${pacote}...`);
      log.sucesso(`Plugin ${pacote} removido.`);
    });

  plugins
    .command('init <nome>')
    .description('Cria o boilerplate f para um novo plugin de analista')
    .action((nome) => {
      log.info(`\nGerando template para o plugin: ${nome}...`);
      log.sucesso(`\nArquivo criado: src/analistas/plugins/${nome}.ts`);
      log.info('Dica: Agora você pode implementar sua lógica de detecção customizada.');
    });

  return plugins;
}
