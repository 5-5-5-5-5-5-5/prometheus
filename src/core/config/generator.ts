// SPDX-License-Identifier: MIT
import generatorModule from '@babel/generator';

/**
 * Wrapper resiliente para o `@babel/generator` lidando com variações de ESM/CJS.
 */
type GeneratorFn = (...a: unknown[]) => { code: string; map?: unknown };

const _generatorModule: unknown = generatorModule;

export function generate(...args: unknown[]): { code: string; map?: unknown } {
  const mod = _generatorModule as unknown;
  let fn: GeneratorFn | undefined;

  if (typeof mod === 'function') {
    fn = mod as GeneratorFn;
  } else if (
    mod &&
    typeof (mod as { default?: unknown }).default === 'function'
  ) {
    fn = (mod as { default: unknown }).default as GeneratorFn;
  } else if (
    mod &&
    typeof (mod as { generate?: unknown }).generate === 'function'
  ) {
    fn = (mod as { generate: unknown }).generate as GeneratorFn;
  }

  if (!fn) {
    throw new TypeError(
      'Babel generator não é uma função — verifique a resolução de módulo.',
    );
  }

  return fn(...args);
}
