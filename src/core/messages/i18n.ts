// SPDX-License-Identifier: MIT
/**
 * Motor de Internacionalização (i18n) Centralizado
 *
 * Responsável por carregar arquivos de tradução em JSON e fornecer
 * acesso às mensagens baseando-se no locale configurado.
 */

import fs from 'node:fs';
import path from 'node:path';

let cache: Record<string, Record<string, unknown>> = {};
let currentLocale: string = 'pt';

const SUPPORTED_LOCALES = ['pt', 'en', 'zh', 'ja'];

function detectLocale(): string {
  if (process.env.PROMETHEUS_LOCALE) {
    const envLocale = process.env.PROMETHEUS_LOCALE.toLowerCase();
    if (SUPPORTED_LOCALES.includes(envLocale)) {
      return envLocale;
    }
  }

  try {
    const configPath = path.join(process.cwd(), 'prometheus.config.json');
    if (fs.existsSync(configPath)) {
      const conteudo = fs.readFileSync(configPath, 'utf-8');
      const json = JSON.parse(conteudo);
      const confLocale = (json.locale || json.locales || json.LOCALE)?.toLowerCase();
      if (confLocale && SUPPORTED_LOCALES.includes(confLocale)) {
        return confLocale;
      }
    }
  } catch {
    // Ignora erros (arquivo inexistente ou JSON inválido)
  }

  return 'pt';
}

export function getLocale(): string {
  return currentLocale;
}

export function setLocale(locale: string): void {
  const normalized = locale.toLowerCase();
  currentLocale = SUPPORTED_LOCALES.includes(normalized) ? normalized : 'pt';
  cache = {};
}

export function initLocale(): void {
  currentLocale = detectLocale();
}

initLocale();

export function carregarMensagens(locale: string): Record<string, unknown> {
  if (cache[locale]) {
    return cache[locale];
  }

  const caminho = path.join(process.cwd(), 'src', 'core', 'messages', 'locales', `${locale}.json`);

  try {
    if (fs.existsSync(caminho)) {
      const conteudo = fs.readFileSync(caminho, 'utf-8');
      cache[locale] = JSON.parse(conteudo);
      return cache[locale];
    }
  } catch (e) {
    console.error(`Erro ao carregar mensagens para locale "${locale}":`, e);
  }

  return locale !== 'pt' ? carregarMensagens('pt') : {};
}

export function t(key: string, locale: string, vars?: Record<string, string | number>): string {
  const mensagens = carregarMensagens(locale);
  const valor = key.split('.').reduce((obj: unknown, k: string) => {
    if (obj && typeof obj === 'object' && k in obj) {
      return (obj as Record<string, unknown>)[k];
    }
    return undefined;
  }, mensagens);

  if (typeof valor !== 'string') {
    return key;
  }

  if (!vars) return valor;

  return valor.replace(/{(\w+)}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
