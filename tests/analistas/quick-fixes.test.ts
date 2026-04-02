import { describe, expect, it } from 'vitest';

import {
  fixAnyToProperTipo,
  fixUnknownToSpecificTipo,
} from '@analistas/corrections/quick-fixes/index.js';

describe('quick-fixes type safety', () => {
  it('não aplica fix de any em comentários, node_modules e arquivos de definição', () => {
    const commentCode = '// : any\nconst x = 1;';
    const matchComment = /:\s*any\b/g.exec(commentCode);
    expect(matchComment).not.toBeNull();
    expect(
      fixAnyToProperTipo.shouldApply(
        matchComment!,
        commentCode,
        commentCode,
        'src/file.ts',
      ),
    ).toBe(false);

    const code = 'const value: any = input;';
    const match = /:\s*any\b/g.exec(code);
    expect(match).not.toBeNull();
    expect(
      fixAnyToProperTipo.shouldApply(match!, code, code, 'types/index.d.ts'),
    ).toBe(false);
    expect(
      fixAnyToProperTipo.shouldApply(
        match!,
        code,
        code,
        '/workspace/node_modules/pkg/index.ts',
      ),
    ).toBe(false);
  });

  it('não aplica fix de any em assinatura genérica suportada e preserva fix síncrono como no-op', () => {
    const genericFunctionCode = 'function parse<T>(value: T): any { return value; }';
    const match = /:\s*any\b/g.exec(genericFunctionCode);
    expect(match).not.toBeNull();
    expect(
      fixAnyToProperTipo.shouldApply(
        match!,
        genericFunctionCode,
        genericFunctionCode,
        'src/file.ts',
      ),
    ).toBe(false);
    expect(fixAnyToProperTipo.fix(match!, genericFunctionCode)).toBe(
      genericFunctionCode,
    );
  });

  it('não aplica fix de unknown em arquivos de definição, vendor reconhecido e contexto genérico', () => {
    const genericCode = 'function parse<T = unknown>(value: T) { return value; }';
    const genericMatch = /:\s*unknown\b/g.exec('const x: unknown = y;');
    expect(genericMatch).not.toBeNull();

    expect(
      fixUnknownToSpecificTipo.shouldApply(
        genericMatch!,
        'const x: unknown = y;',
        '',
        'types/index.d.ts',
      ),
    ).toBe(false);
    expect(
      fixUnknownToSpecificTipo.shouldApply(
        genericMatch!,
        'const x: unknown = y;',
        '',
        '/workspace/vendor/file.ts',
      ),
    ).toBe(false);

    const contextMatch = /unknown\b/g.exec(genericCode);
    expect(contextMatch).not.toBeNull();
    expect(
      fixUnknownToSpecificTipo.shouldApply(
        contextMatch!,
        genericCode,
        genericCode,
        'src/file.ts',
      ),
    ).toBe(false);
  });

  it('mantém código original no fix síncrono de unknown', () => {
    const code = 'const payload: unknown = input;';
    const match = /:\s*unknown\b/g.exec(code);

    expect(match).not.toBeNull();
    expect(fixUnknownToSpecificTipo.fix(match!, code)).toBe(code);
  });
});
