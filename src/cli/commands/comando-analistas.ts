// SPDX-License-Identifier: MIT
import path from 'node:path';

import { listarAnalistas, registroAnalistas } from '@analistas/registry/registry.js';
import { ExitCode, sair } from '@cli/helpers/exit-codes.js';
import { config } from '@core/config/config.js';
import { messages } from '@core/messages/index.js';
import { salvarEstado } from '@shared/persistence/persistencia.js';
import { Command } from 'commander';

const log = messages.log;

export function comandoAnalistas(): Command {
  return new Command('analistas').description('Lista analistas registrados e seus metadados atuais').option('-j, --json', 'Saída em JSON').option('-o, --output <arquivo>', 'Arquivo para exportar JSON de analistas').option('-d, --doc <arquivo>', 'Gera documentação Markdown dos analistas').action(async (opts: {
    json?: boolean;
    output?: string;
    doc?: string;
  }) => {
    try {
      if (process.env.PROMETHEUS_TEST_FAST === '1') {
        if (opts.json) {
          log.info(JSON.stringify({
            total: 0,
            analistas: [],
            meta: {
              fast: true,
              tipo: 'analistas'
            }
          }, null, 2));
          return;
        }
        log.info(messages.CliComandoAnalistasMensagens.fastModeTitulo);
        log.info(messages.CliComandoAnalistasMensagens.fastModeTotalZero);
        return;
      }
      const lista = listarAnalistas();
      // Geração de documentação markdown
      if (opts.doc) {
        const destinoDoc = path.isAbsolute(opts.doc) ? opts.doc : path.join(process.cwd(), opts.doc);
        const linhas: string[] = [];
        linhas.push(messages.CliComandoAnalistasMensagens.docMdTitulo);
        linhas.push('');
        linhas.push(messages.CliComandoAnalistasMensagens.docGeradoEm(new Date().toISOString()));
        linhas.push('');
        linhas.push(messages.CliComandoAnalistasMensagens.docTabelaHeader);
        linhas.push(messages.CliComandoAnalistasMensagens.docTabelaSeparador);
        for (const a of lista) {
          const registroOriginal = (registroAnalistas as Array<{
            nome: string;
            limites?: Record<string, number>;
            categoria?: string;
            descricao?: string;
          }>).find(r => r.nome === a.nome);
          let limitesStr = '';
          if (registroOriginal?.limites) {
            limitesStr = Object.entries(registroOriginal.limites).map(([k, v]) => `${k}:${v}`).join('<br>');
          }
          linhas.push(messages.CliComandoAnalistasMensagens.docLinhaAnalista(a.nome, a.categoria, a.descricao || '', limitesStr));
        }
        linhas.push('');
        await salvarEstado(destinoDoc, linhas.join('\n'));
        log.sucesso(messages.CliComandoAnalistasMensagens.docGerada(destinoDoc));
        return;
      }
      if (opts.output) {
        const destino = path.isAbsolute(opts.output) ? opts.output : path.join(process.cwd(), opts.output);
        await salvarEstado(destino, {
          geradoEm: new Date().toISOString(),
          total: lista.length,
          analistas: lista,
          configLimites: config.ANALISE_LIMITES ?? {}
        });
        log.sucesso(messages.CliComandoAnalistasMensagens.jsonExportado(destino));
        return;
      }
      if (opts.json) {
        log.info(JSON.stringify({
          total: lista.length,
          analistas: lista
        }, null, 2));
        return;
      }
      log.info(messages.CliComandoAnalistasMensagens.titulo);
      for (const a of lista) {
        log.info(messages.CliComandoAnalistasMensagens.linhaAnalista(a.nome, a.categoria, a.descricao));
      }
      log.info(messages.CliComandoAnalistasMensagens.tituloComIcone(messages.ICONES_DIAGNOSTICO.info));
      log.info(messages.CliComandoAnalistasMensagens.total(registroAnalistas.length));
    } catch (err) {
      log.erro(`Falha ao listar analistas: ${err instanceof Error ? err.message : String(err)}`);
      sair(ExitCode.Failure);
    }
  });
}