#!/bin/bash
cd /home/italo/Laboratorio/sensei-dev

# src/core/messages/en/analistas/analista-comandos-cli-messages.ts
sed -i 's/^  detected:/  detectados:/g' src/core/messages/en/analistas/analista-comandos-cli-messages.ts

# src/core/messages/en/analistas/arquetipos-extra-messages.ts
sed -i 's/^  detected:/  detectada:/g' src/core/messages/en/analistas/arquetipos-extra-messages.ts
sed -i 's/^  files:/  detectado:/g' src/core/messages/en/analistas/arquetipos-extra-messages.ts
sed -i 's/^  run:/  execute:/g' src/core/messages/en/analistas/arquetipos-extra-messages.ts
sed -i 's/^  structure:/  raiz:/g' src/core/messages/en/analistas/arquetipos-extra-messages.ts

# src/core/messages/en/analistas/detector-arquitetura-messages.ts
sed -i 's/^  architecture:/  arquitetura:/g' src/core/messages/en/analistas/detector-arquitetura-messages.ts

# src/core/messages/en/analistas/detector-contexto-extra-messages.ts
sed -i 's/^  dependencies:/  completo:/g' src/core/messages/en/analistas/detector-contexto-extra-messages.ts

# src/core/messages/en/analistas/detector-dependencias-messages.ts
sed -i 's/^  detected:/  detectada:/g' src/core/messages/en/analistas/detector-dependencias-messages.ts

# src/core/messages/en/analistas/detector-estrutura-messages.ts
sed -i 's/^  detected:/  detectados:/g' src/core/messages/en/analistas/detector-estrutura-messages.ts

# src/core/messages/en/analistas/mapa-reversao-extra-messages.ts
sed -i 's/^  content:/  original:/g' src/core/messages/en/analistas/mapa-reversao-extra-messages.ts
sed -i 's/^  registered:/  registrado:/g' src/core/messages/en/analistas/mapa-reversao-extra-messages.ts
sed -i 's/^  reverted:/  revertido:/g' src/core/messages/en/analistas/mapa-reversao-extra-messages.ts
sed -i 's/^  saved:/  salvo:/g' src/core/messages/en/analistas/mapa-reversao-extra-messages.ts

# src/core/messages/en/cli/cli-arquetipo-handler-messages.ts
sed -i 's/^  archetype:/  arquetipo:/g' src/core/messages/en/cli/cli-arquetipo-handler-messages.ts
sed -i 's/^  detection:/  arquetipos:/g' src/core/messages/en/cli/cli-arquetipo-handler-messages.ts
sed -i 's/^  detectionError:/  devErroPrefixo:/g' src/core/messages/en/cli/cli-arquetipo-handler-messages.ts
sed -i 's/^  devErrorPrefix:/  erroDeteccao:/g' src/core/messages/en/cli/cli-arquetipo-handler-messages.ts
sed -i 's/^  saveFailure:/  falhaSalvar:/g' src/core/messages/en/cli/cli-arquetipo-handler-messages.ts
sed -i 's/^  timeoutDetection:/  timeoutDeteccao:/g' src/core/messages/en/cli/cli-arquetipo-handler-messages.ts

# src/core/messages/en/cli/cli-auto-fix-handler-messages.ts
sed -i 's/^  corrections:/  sugeridas:/g' src/core/messages/en/cli/cli-auto-fix-handler-messages.ts

# src/core/messages/en/cli/cli-bin-messages.ts
sed -i 's/^  exception:/  capturada:/g' src/core/messages/en/cli/cli-bin-messages.ts
sed -i 's/^  flags:/  erroInicializacao:/g' src/core/messages/en/cli/cli-bin-messages.ts

# src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  analystLine:/  docGerada:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  analysts:/  docGeradoEm:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  at:/  docLinhaAnalista:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  docAnalystLine:/  docMdTitulo:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  docGenerated:/  docTabelaHeader:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  docGeneratedAt:/  docTabelaSeparador:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  docMdTitle:/  em:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  docTableHeader:/  fastModeTitulo:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  docTableSeparator:/  jsonExportado:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  fastModeTitle:/  linhaAnalista:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  jsonExported:/  registrados:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  title:/  titulo:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts
sed -i 's/^  titleWithIcon:/  tituloComIcone:/g' src/core/messages/en/cli/cli-comando-analistas-messages.ts

# src/core/messages/en/cli/cli-comando-diagnosticar-messages.ts
sed -i 's/^  output:/  estruturada:/g' src/core/messages/en/cli/cli-comando-diagnosticar-messages.ts

# src/core/messages/en/cli/cli-comando-guardian-messages.ts
sed -i 's/^  baselineCreatedHowToAccept:/  baselineCriadoComoAceitar:/g' src/core/messages/en/cli/cli-comando-guardian-messages.ts
sed -i 's/^  baselineNotAllowedFullScan:/  baselineNaoPermitidoFullScan:/g' src/core/messages/en/cli/cli-comando-guardian-messages.ts
sed -i 's/^  diffChangesDetected:/  diffComoAceitarMudancas:/g' src/core/messages/en/cli/cli-comando-guardian-messages.ts
sed -i 's/^  diffHowToAcceptChanges:/  diffMudancasDetectadas:/g' src/core/messages/en/cli/cli-comando-guardian-messages.ts

# src/core/messages/en/cli/cli-comando-metricas-messages.ts
sed -i 's/^  averages:/  historicoExportado:/g' src/core/messages/en/cli/cli-comando-metricas-messages.ts
sed -i 's/^  blankLine:/  linhaEmBranco:/g' src/core/messages/en/cli/cli-comando-metricas-messages.ts
sed -i 's/^  executionLine:/  linhaExecucao:/g' src/core/messages/en/cli/cli-comando-metricas-messages.ts
sed -i 's/^  historyExported:/  linhaTopAnalista:/g' src/core/messages/en/cli/cli-comando-metricas-messages.ts
sed -i 's/^  topAnalystLine:/  medias:/g' src/core/messages/en/cli/cli-comando-metricas-messages.ts
sed -i 's/^  topAnalystsTitle:/  tituloTopAnalistas:/g' src/core/messages/en/cli/cli-comando-metricas-messages.ts

# src/core/messages/en/cli/cli-comando-otimizar-svg-messages.ts
sed -i 's/^  read:/  lidos:/g' src/core/messages/en/cli/cli-comando-otimizar-svg-messages.ts
sed -i 's/^  savings:/  potencial:/g' src/core/messages/en/cli/cli-comando-otimizar-svg-messages.ts

# src/core/messages/en/cli/cli-comando-perf-messages.ts
sed -i 's/^  titleSnapshotComparisonWithIcon:/  tituloComparacaoSnapshotsComIcone:/g' src/core/messages/en/cli/cli-comando-perf-messages.ts

# src/core/messages/en/cli/cli-comando-podar-messages.ts
sed -i 's/^  confirmRemoval:/  confirmarRemocao:/g' src/core/messages/en/cli/cli-comando-podar-messages.ts
sed -i 's/^  detected:/  detectados:/g' src/core/messages/en/cli/cli-comando-podar-messages.ts
sed -i 's/^  errorDuringPruning:/  erroDurantePoda:/g' src/core/messages/en/cli/cli-comando-podar-messages.ts
sed -i 's/^  noDebris:/  inicio:/g' src/core/messages/en/cli/cli-comando-podar-messages.ts
sed -i 's/^  orphanFileLine:/  linhaArquivoOrfao:/g' src/core/messages/en/cli/cli-comando-podar-messages.ts
sed -i 's/^  orphansDetected:/  nenhumaSujeira:/g' src/core/messages/en/cli/cli-comando-podar-messages.ts
sed -i 's/^  pruning:/  orfaosDetectados:/g' src/core/messages/en/cli/cli-comando-podar-messages.ts
sed -i 's/^  start:/  poda:/g' src/core/messages/en/cli/cli-comando-podar-messages.ts

# src/core/messages/en/cli/cli-comando-reestruturar-messages.ts
sed -i 's/^  canceledPromptError:/  canceladoErroPrompt:/g' src/core/messages/en/cli/cli-comando-reestruturar-messages.ts
sed -i 's/^  canceledUseAuto:/  canceladoUseAuto:/g' src/core/messages/en/cli/cli-comando-reestruturar-messages.ts