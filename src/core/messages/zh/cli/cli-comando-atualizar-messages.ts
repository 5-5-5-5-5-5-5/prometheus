// SPDX-License-Identifier: MIT

export const CliAtualizarExtraMensagens = {
  descricao: '在完整性保持的情况下更新 Prometheus',
  iniciandoAtualizacao: '\n 开始更新流程...\n',
  guardianIntegridadeValidada: '{icone} Guardian：完整性已验证。继续更新。',
  guardianBaselineAlterado: ' Guardian 生成了新的基线或检测到更改。谨慎继续。',
  recomendadoGuardianDiff: '建议：更新前执行 `prometheus guardian --diff` 和 `prometheus guardian --accept-baseline`。',
  falhaAplicarFlags: '应用标志失败：{erro}',
} as const;
