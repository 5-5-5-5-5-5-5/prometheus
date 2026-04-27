// SPDX-License-Identifier: MIT
// @prometheus-disable tipo-permissivo-object
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import type { RunEndUpdate, RunStartInput } from '@projeto-types/shared';

import type { PrometheusContextState, PrometheusRunRecord } from '@';

// Re-exporta para compatibilidade com código existente
export type { PrometheusContextState, PrometheusRunRecord, RunEndUpdate, RunStartInput };

export class PrometheusContextMemory {
  private state: PrometheusContextState = {
    schemaVersion: 1,
    lastRuns: [],
    preferences: Object.create(null) as Record<string, unknown>
  };
  constructor(private maxRuns = 20, private persistCaminho?: string) { }
  async init(): Promise<void> {
    if (!this.persistCaminho) return;
    try {
      const raw = await readFile(this.persistCaminho, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<PrometheusContextState>;
      if (parsed && parsed.schemaVersion === 1) {
        this.state = {
          // @prometheus-disable: tipo-literal-inline-complexo
          schemaVersion: 1,
          lastRuns: Array.isArray(parsed.lastRuns) ? parsed.lastRuns as PrometheusRunRecord[] : [],
          preferences: parsed.preferences && typeof parsed.preferences === 'object' ? parsed.preferences as Record<string, unknown> : Object.create(null) as Record<string, unknown>
        };
      }
    } catch {
      // mantém defaults
    }
  }
  getState(): PrometheusContextState {
    return {
      // @prometheus-disable: tipo-literal-inline-complexo
      schemaVersion: 1,
      lastRuns: [...this.state.lastRuns],
      preferences: {
        ...this.state.preferences
      }
    };
  }
  getLastRun(): PrometheusRunRecord | undefined {
    return this.state.lastRuns[this.state.lastRuns.length - 1];
  }
  getPreference<T = unknown>(key: string): T | undefined {
    return this.state.preferences[key] as T | undefined;
  }
  async setPreference(key: string, value: unknown): Promise<void> {
    this.state.preferences[key] = value;
    await this.persist();
  }
  async recordRunStart(
    input: RunStartInput): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const record: PrometheusRunRecord = {
      id,
      timestamp: input.timestamp ?? new Date().toISOString(),
      cwd: input.cwd,
      argv: [...input.argv],
      version: input.version
    };
    this.state.lastRuns.push(record);
    if (this.state.lastRuns.length > this.maxRuns) {
      this.state.lastRuns = this.state.lastRuns.slice(-this.maxRuns);
    }
    await this.persist();
    return id;
  }
  async recordRunEnd(id: string,
    update: RunEndUpdate): Promise<void> {
    const idx = this.state.lastRuns.findIndex(r => r.id === id);
    if (idx === -1) return;
    const prev = this.state.lastRuns[idx];
    this.state.lastRuns[idx] = {
      ...prev,
      ok: update.ok,
      exitCode: update.exitCode,
      durationMs: update.durationMs,
      error: update.error
    };
    await this.persist();
  }
  async clear(): Promise<void> {
    this.state.lastRuns = [];
    this.state.preferences = Object.create(null) as Record<string, unknown>;
    await this.persist();
  }
  private async persist(): Promise<void> {
    if (!this.persistCaminho) return;
    try {
      await mkdir(dirname(this.persistCaminho), {
        recursive: true
      });
      await writeFile(this.persistCaminho, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch {
      // ignore persist errors
    }
  }
}

export async function getDefaultContextMemory(): Promise<PrometheusContextMemory> {
  const persistCaminho = join(process.cwd(), '.prometheus', 'context.json');
  const mem = new PrometheusContextMemory(20, persistCaminho);
  await mem.init();
  return mem;
}