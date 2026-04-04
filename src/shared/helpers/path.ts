import path from 'node:path';

/**
 * Normaliza caminhos de arquivo para usar barras (/) consistentemente.
 * Se useNativeNormalize for true, também aplica o path.normalize do Node antes da substituição de barras.
 */
export function normalizePath(p: string, useNativeNormalize = false): string {
  const normalized = useNativeNormalize ? path.normalize(p) : p;
  return normalized.replace(/\\/g, '/');
}
