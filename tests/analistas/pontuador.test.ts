import { afterEach, describe, expect, it } from 'vitest';

import { grafoDependencias } from '@analistas/detectores/detector-dependencias.js';
import {
  pontuarTodos,
  pontuarTodosAvancado,
  scoreArquetipo,
  scoreArquetipoAvancado,
} from '@analistas/pontuadores/pontuador.js';

describe('pontuador', () => {
  afterEach(() => {
    grafoDependencias.clear();
  });

  it('pontua required, optional, patterns, dependências e penalidades', () => {
    grafoDependencias.set('src/index.ts', new Set(['express']));

    const def = {
      nome: 'api-rest-express',
      descricao: 'API express',
      requiredDirs: ['src', 'src/controllers'],
      optionalDirs: ['src/routes'],
      dependencyHints: ['express'],
      filePresencePatterns: ['server.ts'],
      forbiddenDirs: ['pages'],
      pesoBase: 1,
      rootFilesAllowed: ['package.json'],
    };

    const resultado = scoreArquetipo(def, [
      'src',
      'src/controllers/user.ts',
      'src/routes/index.ts',
      'server.ts',
      'pages/home.tsx',
      'package.json',
      'README.md',
    ]);

    expect(resultado.nome).toBe('api-rest-express');
    expect(resultado.matchedRequired).toContain('src');
    expect(resultado.matchedRequired).toContain('src/controllers');
    expect(resultado.matchedOptional).toContain('src/routes');
    expect(resultado.dependencyMatches).toContain('express');
    expect(resultado.filePadraoMatches).toContain('server.ts');
    expect(resultado.forbiddenPresent).toContain('pages');
    expect(resultado.anomalias.some((a) => a.path === 'README.md')).toBe(true);
    expect(resultado.score).toBeGreaterThan(0);
  });

  it('gera explicação e sugestão quando faltam itens obrigatórios de api-rest-express', () => {
    const def = {
      nome: 'api-rest-express',
      descricao: 'API express',
      requiredDirs: ['src/controllers'],
      optionalDirs: [],
      dependencyHints: ['express'],
      filePresencePatterns: [],
      forbiddenDirs: [],
      pesoBase: 1,
      rootFilesAllowed: [],
    };

    const resultado = scoreArquetipo(def, ['src/index.ts']);

    expect(resultado.missingRequired).toContain('src/controllers');
    expect(resultado.sugestaoPadronizacao).toContain('src/controllers');
    expect(resultado.explicacaoSimilaridade).toContain('api-rest-express');
  });

  it('pontuarTodos mantém apenas candidatos com algum sinal', () => {
    grafoDependencias.set('src/index.ts', new Set(['commander']));

    const resultados = pontuarTodos([
      'bin',
      'bin/index.ts',
      'src/cli/commands/run.ts',
      'package.json',
    ]);

    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.some((item) => item.nome === 'cli-modular')).toBe(true);
  });

  it('scoreArquetipoAvancado adiciona bônus contextuais e explicações', () => {
    grafoDependencias.set('src/index.ts', new Set(['express']));

    const def = {
      nome: 'api-rest-express',
      descricao: 'API express',
      requiredDirs: ['src', 'src/controllers'],
      optionalDirs: ['src/routes'],
      dependencyHints: ['express'],
      filePresencePatterns: [],
      forbiddenDirs: [],
      pesoBase: 1,
      rootFilesAllowed: [],
    };

    const base = scoreArquetipo(def, ['src', 'src/controllers/a.ts']);
    const avancado = scoreArquetipoAvancado(
      def,
      ['src', 'src/controllers/a.ts', 'src/routes/b.ts'],
      {
        frameworksDetectados: ['Express'],
        dependencias: ['express', 'cors', 'joi'],
        scripts: ['build'],
        detalhes: { testRunner: 'vitest', linter: 'eslint' },
        pastasPadrao: ['routes', 'controllers'],
        padroesArquiteturais: ['repository-service'],
        tecnologiasDominantes: ['backend-api'],
        complexidadeEstrutura: 'alta',
        funcoes: 20,
        classes: 10,
        variaveis: 30,
        tipos: [],
        arquivosConfiguracao: [],
        arquivosPadrao: [],
      },
    );

    expect(avancado.score).toBeGreaterThan(base.score);
    expect(avancado.explicacaoSimilaridade).toContain('Framework Express detectado');
    expect(avancado.explicacaoSimilaridade).toContain('Test runner detectado');
  });

  it('pontuarTodosAvancado também filtra por sinais válidos', () => {
    const resultados = pontuarTodosAvancado(
      ['bin/index.ts', 'package.json'],
      {
        frameworksDetectados: [],
        dependencias: [],
        scripts: [],
        detalhes: {},
        pastasPadrao: ['bin'],
        padroesArquiteturais: ['cli-patterns'],
        tecnologiasDominantes: [],
        complexidadeEstrutura: 'media',
        funcoes: 1,
        classes: 0,
        variaveis: 1,
        tipos: [],
        arquivosConfiguracao: [],
        arquivosPadrao: [],
      },
    );

    expect(resultados.length).toBeGreaterThan(0);
  });
});
