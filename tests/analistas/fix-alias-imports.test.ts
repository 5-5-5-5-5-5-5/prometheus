import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  aplicarFixAliasImports,
  scanAndApplyFix,
} from '@analistas/corrections/fix-alias-imports.js';

const tempDirs: string[] = [];

describe('fix-alias-imports', () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map(async (dir) => {
        await import('node:fs/promises').then(({ rm }) =>
          rm(dir, { recursive: true, force: true }),
        );
      }),
    );
  });

  it('não altera arquivos que não são TypeScript', async () => {
    const result = await aplicarFixAliasImports(
      'src/example.js',
      "import x from '@types/types.js';",
    );

    expect(result.changed).toBe(false);
    expect(result.content).toContain('@types/types.js');
  });

  it('substitui imports antigos de @types/types.js em arquivos .ts', async () => {
    const result = await aplicarFixAliasImports(
      'src/example.ts',
      "import type { Algo } from '@types/types.js';",
    );

    expect(result.changed).toBe(true);
    expect(result.content).toContain("from 'types'");
  });

  it('varre src e tests e persiste apenas arquivos alterados', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'sensei-alias-'));
    tempDirs.push(root);

    await mkdir(path.join(root, 'src'), { recursive: true });
    await mkdir(path.join(root, 'tests'), { recursive: true });

    const srcFile = path.join(root, 'src', 'one.ts');
    const testFile = path.join(root, 'tests', 'two.ts');
    const untouched = path.join(root, 'src', 'three.ts');

    await writeFile(
      srcFile,
      "import type { A } from '@types/types.js';\nexport const a = 1;\n",
      'utf8',
    );
    await writeFile(
      testFile,
      "import type { B } from '@types/types.js';\nexport const b = 2;\n",
      'utf8',
    );
    await writeFile(untouched, "export const c = 'ok';\n", 'utf8');

    const changed = await scanAndApplyFix(root);

    expect(changed).toBe(2);
    await expect(readFile(srcFile, 'utf8')).resolves.toContain("from 'types'");
    await expect(readFile(testFile, 'utf8')).resolves.toContain("from 'types'");
    await expect(readFile(untouched, 'utf8')).resolves.toBe("export const c = 'ok';\n");
  });
});

