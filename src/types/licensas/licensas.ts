// SPDX-License-Identifier: MIT
/**
 * Tipos para o módulo de licenciamento (licensas).
 */

export interface LicensasScanOptions {
  root?: string;
  includeDev?: boolean;
}

export interface PackageInfo {
  name: string;
  version: string;
  license: string;
  repository: string | null;
  private: boolean;
  licenseArquivo: string | null;
  licenseText: string | null;
  path: string;
}

export interface ScanResult {
  generatedAt: string;
  totalPackages: number;
  totalFiltered: number;
  licenseCounts: Record<string, number>;
  packages: PackageInfo[];
  problematic: PackageInfo[];
}

export interface DisclaimerOptions {
  root?: string;
  disclaimerPath?: string;
  dryRun?: boolean;
}

export interface DisclaimerAddResult {
  updatedArquivos: string[];
}

export interface DisclaimerVerifyResult {
  missing: string[];
}

export interface GenerateNoticesOptions {
  root?: string;
  ptBr?: boolean;
  output?: string;
}

/**
 * Metadados de pacote para renderização de notices
 */
export interface RenderPackageMeta {
  licenses?: string | string[];
  publisher?: string;
  email?: string;
  repository?: string;
  licenseArquivo?: string;
  path?: string;
}

/**
 * Resultado de busca de arquivo de licença
 */
export interface LicenseFileResult {
  file: string;
  path: string;
  text: string | null;
}
