// SPDX-License-Identifier: MIT
/**
 * Convenções do projeto analisado (paths e utilitários).
 *
 * Objetivo: evitar hardcodes como "src/tipos" espalhados em detectores e correções.
 */

import path from 'node:path';

import type { NameConventionsConfig } from '../../types/core/config/config.js';
import { config } from './config.js';

function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

function trimSlashes(p: string): string {
  return p.replace(/^\/*/, '').replace(/\/*$/, '');
}

export function getTypesDirectoryRelPosix(): string {
  const raw = (
    config as unknown as { conventions?: { typesDirectory?: unknown }; nameConventions?: { typesDirectory?: unknown } }
  );
  // Prioriza nameConventions (ex: 'types') sobre conventions (ex: 'src/tipos') pois é a nova forma configurável
  const s = (typeof raw.nameConventions?.typesDirectory === 'string' && raw.nameConventions.typesDirectory.trim()) ||
    (typeof raw.conventions?.typesDirectory === 'string' && raw.conventions.typesDirectory.trim()) ||
    'src/tipos';
  return trimSlashes(toPosix(s));
}

export function getTypesDirectoryDisplay(): string {
  const base = getTypesDirectoryRelPosix();
  return base.endsWith('/') ? base : `${base}/`;
}

export function isInsideTypesDirectory(relPath: string): boolean {
  const norm = trimSlashes(toPosix(relPath));
  const base = getTypesDirectoryRelPosix();

  // 1. Verificação direta pelo caminho configurado (que já considera prioridade e fallback)
  if (norm === base || norm.startsWith(`${base}/`)) {
    return true;
  }

  // 2. Verificação por variantes (ex: reconhecer 'types' se estiver configurado 'tipos' ou vice-versa)
  return isInsideDirectory(relPath, 'typesDirectory');
}

/**
 * Verifica se um caminho está dentro de um diretório específico baseado em convenções e variantes.
 */
export function isInsideDirectory(relPath: string, key: keyof NameConventionsConfig): boolean {
  const norm = trimSlashes(toPosix(relPath));
  const expected = getExpectedDirectoryName(key);

  // 1. Verificação direta pelo nome configurado
  if (expected && (norm === expected || norm.split('/').some(seg => seg === expected))) {
    return true;
  }

  // 2. Verificação por variantes (idiomas, abreviações, etc)
  const pattern = getDirVariantPattern(key);
  const segments = norm.split('/');
  return segments.some(seg => pattern.test(seg));
}

export function isInsideTestsDirectory(relPath: string): boolean {
  return isInsideDirectory(relPath, 'testsDirectory');
}

export function isInsideDocsDirectory(relPath: string): boolean {
  return isInsideDirectory(relPath, 'docsDirectory');
}

export function isInsideConfigDirectory(relPath: string): boolean {
  return isInsideDirectory(relPath, 'configDirectory');
}

export function isInsideScriptsDirectory(relPath: string): boolean {
  return isInsideDirectory(relPath, 'scriptsDirectory');
}

export function isInsideUtilsDirectory(relPath: string): boolean {
  return isInsideDirectory(relPath, 'utilsDirectory');
}

export function buildTypesRelPathPosix(relInsideTypesDir: string): string {
  const base = getTypesDirectoryRelPosix();
  const inside = trimSlashes(toPosix(relInsideTypesDir));
  return inside ? `${base}/${inside}` : base;
}

/**
 * Constrói um path de filesystem (com separador do SO) para um arquivo dentro do diretório de tipos.
 *
 * Ex.: base 'app/types' + 'shared/user.ts' => 'app/types/shared/user.ts' (join do SO)
 */
export function buildTypesFsPath(relInsideTypesDir: string): string {
  const relPosix = buildTypesRelPathPosix(relInsideTypesDir);
  return path.join(...relPosix.split('/'));
}

// --- Name Conventions ---

export type { NameConventionsConfig };

const DIR_VARIANT_PATTERNS: Record<keyof NameConventionsConfig, RegExp> = {
  typesDirectory: /types|tipos/i,
  testsDirectory: /tests?|testes|spec/i,
  docsDirectory: /docs?|doc|documentacao/i,
  srcDirectory: /src|source|codigo/i,
  configDirectory: /config|cfg|conf|settings/i,
  scriptsDirectory: /scripts?|scripts|bin/i,
  distDirectory: /dist|build|out|release/i,
  assetsDirectory: /assets?|static|public|resources/i,
  utilsDirectory: /utils?|helpers?|lib|libs|tools/i,
  servicesDirectory: /services?|svc|apis/i,
  componentsDirectory: /components?|comps?|widgets|ui/i,
  modelsDirectory: /models?|entities|schemas?/i,
  middlewareDirectory: /middlewares?|middleware|interceptors?/i,
  routesDirectory: /routes?|paths?|endpoints?/i,
  controllersDirectory: /controllers?|handlers?|actions/i,
  viewsDirectory: /views?|pages?|screens?|templates?/i,
  stylesDirectory: /styles?|css|scss|sass|themes?/i,
  imagesDirectory: /images?|imgs?|assets\/img|icons?|media/i,
  localesDirectory: /locales?|i18n|translations?|lang|l10n/i
};

export function getNameConventions(): NameConventionsConfig {
  return (
    config as unknown as { nameConventions?: NameConventionsConfig }
  ).nameConventions ?? {};
}

export function getExpectedDirectoryName(key: keyof NameConventionsConfig): string {
  const conventions = getNameConventions();
  return conventions[key] ?? '';
}

export function getAllExpectedDirNames(): { key: keyof NameConventionsConfig; expected: string }[] {
  const conventions = getNameConventions();
  return Object.entries(conventions)
    .filter(([, v]) => typeof v === 'string' && (v as string).trim().length > 0)
    .map(([k, v]) => ({ key: k as keyof NameConventionsConfig, expected: v as string }));
}

export function getDirVariantPattern(key: keyof NameConventionsConfig): RegExp {
  return DIR_VARIANT_PATTERNS[key] ?? /^$/;
}
