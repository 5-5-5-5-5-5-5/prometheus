// SPDX-License-Identifier: MIT
import fs from 'node:fs';
import path from 'node:path';

/**
 * Garante que o diretório que contém o arquivo especificado exista.
 */
export async function ensureDir(filePath: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
}
