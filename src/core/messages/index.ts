// SPDX-License-Identifier: MIT
/**
 * Sistema de Mensagens Centralizado do Prometheus com Internacionalização
 *
 * Resolve mensagens no locale configurado.
 * Valores suportados: "pt" (padrão), "en", "zh", "ja".
 *
 * Prioridade de resolução do locale:
 *   1. Variável de ambiente PROMETHEUS_LOCALE (override explícito)
 *   2. Campo "locale" em prometheus.config.json (config.LOCALE)
 *   3. Padrão: "pt" (Português)
 *
 * Uso:
 *   import { messages, setLocale, getLocale, t, getMessages } from './index.js';
 *
 *   // Definir locale:
 *   setLocale('en');
 *
 *   // Acessar mensagens (resolve automaticamente pelo locale atual):
 *   messages.log
 *   messages.ExcecoesMensagens
 */

import fs from 'node:fs';
import path from 'node:path';

import * as enMessages from './en/index.js';
import * as jaMessages from './ja/index.js';
import * as ptMessages from './pt/index.js';
import * as zhMessages from './zh/index.js';

// ─── i18n Core ───────────────────────────────────────────────────────────────

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

// ─── Messages Proxy ──────────────────────────────────────────────────────────

type MessagesModule = typeof ptMessages;

const localeModules: Record<string, Record<string, unknown>> = {
  pt: ptMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
  zh: zhMessages as Record<string, unknown>,
  ja: jaMessages as Record<string, unknown>
};

export const messages = new Proxy({}, {
  get(_target: unknown, prop: string): unknown {
    const locale = getLocale();
    const mod = localeModules[locale] || localeModules.pt;
    return mod[prop];
  }
}) as MessagesModule;

export function getMessages(): MessagesModule {
  return messages;
}

export function getMessagesSync(): MessagesModule {
  return messages;
}

export async function preloadAllLocales(): Promise<void> {
  // Already loaded synchronously at module init
}

// Re-export all to maintain backward compatibility with direct imports
export * from './pt/index.js';
