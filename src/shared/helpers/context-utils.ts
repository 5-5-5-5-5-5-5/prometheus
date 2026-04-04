// SPDX-License-Identifier: MIT

/**
 * Verifica se a posição no código está dentro de uma string literal.
 * Trata aspas simples, duplas e template strings (backticks), lidando com caracteres de escape.
 */
export function isInString(code: string, position: number): boolean {
  // Normaliza line endings para \n (Windows compatibility)
  const normalizedCodigo = code.replace(/\r\n/g, '\n');
  const before = normalizedCodigo.substring(0, position);

  // Conta aspas simples, duplas e template strings, ignorando aspas escapadas
  const singleQuotesBefore = (before.match(/(?<!\\)'/g) || []).length;
  const doubleQuotesBefore = (before.match(/(?<!\\)"/g) || []).length;
  const templateQuotesBefore = (before.match(/(?<!\\)`/g) || []).length;

  // Se número ímpar de aspas antes, está dentro de string
  return (
    singleQuotesBefore % 2 === 1 ||
    doubleQuotesBefore % 2 === 1 ||
    templateQuotesBefore % 2 === 1
  );
}

/**
 * Verifica se a posição no código está dentro de um comentário (line ou block).
 */
export function isInComment(code: string, position: number): boolean {
  // Normaliza line endings para \n (Windows compatibility)
  const normalizedCodigo = code.replace(/\r\n/g, '\n');
  const lines = normalizedCodigo.split('\n');
  let pos = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineInicio = pos;
    const lineFim = pos + line.length;

    if (position >= lineInicio && position <= lineFim) {
      // Verifica comentário inline (//)
      const posInLine = position - lineInicio;
      const commentInicio = line.indexOf('//');

      // Se há // na linha E a posição está depois do //, está em comentário
      if (commentInicio !== -1 && posInLine >= commentInicio) {
        return true;
      }

      // Verifica comentário de bloco (/* */)
      const blockInicio = normalizedCodigo.lastIndexOf('/*', position);
      const blockFim = normalizedCodigo.indexOf('*/', position);
      if (blockInicio !== -1 && (blockFim === -1 || blockFim > position)) {
        return true;
      }
      return false;
    }
    pos = lineFim + 1; // +1 para o \n
  }
  return false;
}

/**
 * Verifica se a posição está em string ou comentário.
 */
export function isInStringOrComment(code: string, position: number): boolean {
  return isInString(code, position) || isInComment(code, position);
}
