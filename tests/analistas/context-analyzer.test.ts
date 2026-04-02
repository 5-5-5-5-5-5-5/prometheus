import { describe, expect, it } from 'vitest';

import {
  extractLineContext,
  extractVariableName,
  getDomainFromFilePath,
  isDefinitionFile,
  isInComment,
  isInString,
  isInStringOrComment,
  isLegacyOrVendorFile,
  isTypeScriptContext,
  isTypeScriptFile,
  isUnknownInGenericContext,
  toKebabCase,
} from '@analistas/corrections/type-safety/context-analyzer.js';

describe('context-analyzer', () => {
  it('detecta string, comentário e combinação de ambos', () => {
    const code = [
      "const msg = 'hello';",
      'const value = 1; // comentario',
      'const tail = 2;',
    ].join('\n');

    expect(isInString(code, code.indexOf('hello'))).toBe(true);
    expect(isInComment(code, code.indexOf('comentario'))).toBe(true);
    expect(isInStringOrComment(code, code.indexOf('hello'))).toBe(true);
    expect(isInStringOrComment(code, code.indexOf('tail'))).toBe(false);
  });

  it('reconhece contexto TypeScript suportado para retorno genérico', () => {
    const code = 'function parse<T>(value: T): unknown { return value; }';
    expect(isTypeScriptContext(code, code.indexOf(': unknown'))).toBe(true);
  });

  it('identifica arquivos vendor/legado e arquivos TypeScript', () => {
    expect(isLegacyOrVendorFile('/workspace/legacy/file.ts')).toBe(true);
    expect(isLegacyOrVendorFile('/workspace/legacy/file.min.js')).toBe(true);
    expect(isLegacyOrVendorFile('/workspace/node_modules/pkg/index.ts')).toBe(
      true,
    );
    expect(isDefinitionFile('src/types/index.d.ts')).toBe(true);
    expect(isTypeScriptFile('src/app.tsx')).toBe(true);
    expect(isTypeScriptFile('src/app.js')).toBe(false);
  });

  it('detecta unknown em contextos genéricos legítimos', () => {
    expect(
      isUnknownInGenericContext(
        'function parse<T>(input: unknown): T { return input as T; }',
        25,
      ),
    ).toBe(true);
    expect(
      isUnknownInGenericContext(
        'type Payload = Record<string, unknown>;',
        'type Payload = Record<string, unknown>;'.indexOf('unknown'),
      ),
    ).toBe(true);
  });

  it('extrai domínio, nome de variável, linha e converte para kebab-case', () => {
    const code = 'const userData: unknown = payload;\nconst nextLine = true;';
    const match = /userData\s*:\s*unknown/.exec(code);

    expect(match).not.toBeNull();
    expect(extractVariableName(match!, code)).toBe('userData');
    expect(extractLineContext(code, code.indexOf('nextLine'))).toBe(
      'const nextLine = true;',
    );
    expect(getDomainFromFilePath('src/payments/service/file.ts')).toBe(
      'payments',
    );
    expect(getDomainFromFilePath('misc/file.ts')).toBe('shared');
    expect(toKebabCase('UserData_Value')).toBe('user-data-value');
  });
});
