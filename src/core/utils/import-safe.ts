// SPDX-License-Identifier: MIT
import { config } from '../config/config.js';
import { resolverPluginSeguro } from '../config/seguranca.js';
import { messages } from '../messages/index.js';

export async function importarModuloSeguro(baseDir: string, pluginRel: string): Promise<unknown> {
  if (config.SAFE_MODE && !config.ALLOW_PLUGINS) {
    throw new Error(messages.ExcecoesMensagens.pluginsDesabilitadosSafeMode);
  }
  const resolvido = resolverPluginSeguro(baseDir, pluginRel);
  if (resolvido.erro) throw new Error(messages.ExcecoesMensagens.pluginBloqueado(resolvido.erro));
  if (!resolvido.caminho) throw new Error(messages.ExcecoesMensagens.caminhoPluginNaoResolvido);
  // permite que o chamador capture exceções do plugin
  return import(resolvido.caminho);
}