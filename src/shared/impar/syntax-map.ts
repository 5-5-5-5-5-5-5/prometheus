// SPDX-License-Identifier: MIT

export type SyntaxInfo = {
  parser?: string;
  formatavel?: boolean; // se o formatador interno tem suporte para esta extensão
};

export const syntaxMap: Record<string, SyntaxInfo> = {
  '.ts': { parser: 'typescript', formatavel: true },
  '.tsx': { parser: 'typescript', formatavel: true },
  '.cts': { parser: 'typescript', formatavel: true },
  '.mts': { parser: 'typescript', formatavel: true },
  '.js': { parser: 'babel', formatavel: true },
  '.jsx': { parser: 'babel', formatavel: true },
  '.mjs': { parser: 'babel', formatavel: true },
  '.cjs': { parser: 'babel', formatavel: true },
  '.json': { parser: 'json', formatavel: true },
  '.md': { parser: 'markdown', formatavel: true },
  '.markdown': { parser: 'markdown', formatavel: true },
  '.yml': { parser: 'yaml', formatavel: true },
  '.yaml': { parser: 'yaml', formatavel: true },
  '.css': { parser: 'css', formatavel: true },
  '.scss': { parser: 'scss', formatavel: true },
  '.less': { parser: 'less', formatavel: true },
  '.html': { parser: 'html', formatavel: true },
  '.htm': { parser: 'html', formatavel: true },
  '.php': { parser: 'php', formatavel: true },
  '.xml': { parser: 'xml', formatavel: true },
  // Linguagens que o projeto formata internamente, mas que normalmente
  // o formatador não deve ser aplicado (ex.: Python). Marcar formatavel:false
  '.py': { parser: 'python', formatavel: true },
  '.java': { parser: 'java', formatavel: true },
  '.svg': { parser: 'xml', formatavel: true },
  '.sql': { parser: 'sql', formatavel: true },
  '.properties': { parser: 'properties', formatavel: true },
  '.gradle': { parser: 'gradle', formatavel: true },
  '.toml': { parser: 'toml', formatavel: true },
  '.lock': { parser: 'json', formatavel: true },
  '.ini': { parser: 'ini', formatavel: true },
  '.dockerfile': { parser: 'dockerfile', formatavel: true },
  '.sh': { parser: 'shell', formatavel: true },
  '.bash': { parser: 'shell', formatavel: true },
  '.kt': { parser: 'kotlin', formatavel: true },
  '.kts': { parser: 'kotlin', formatavel: true },
  '.go': { parser: 'go', formatavel: true },
  '.jsonc': { parser: 'json', formatavel: true },
  '.txt': { parser: 'code', formatavel: true },
  '.log': { parser: 'code', formatavel: true },
  '.env': { parser: 'code', formatavel: true },
};

export function getSyntaxInfoForPath(relPath: string): SyntaxInfo | null {
  const p = (relPath || '').toLowerCase();
  for (const ext of Object.keys(syntaxMap)) {
    if (p.endsWith(ext)) return syntaxMap[ext];
  }
  return null;
}
