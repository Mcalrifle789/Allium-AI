import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import type { AlliumConfig } from "./types.js";

export const configDir = join(homedir(), ".allium");
export const configPath = join(configDir, "config.json");

export const defaultConfig: AlliumConfig = {
  modelProviderId: "openrouter",
  model: "anthropic/claude-sonnet-4",
  searchProviderId: "duckduckgo",
  mode: "plan",
  apiKeys: {},
  thirdPartyAccounts: [],
  desktopControl: {
    enabled: false,
    requireConfirmation: true
  }
};

export function loadConfig(): AlliumConfig {
  if (!existsSync(configPath)) {
    return defaultConfig;
  }

  const parsed = JSON.parse(readFileSync(configPath, "utf8")) as Partial<AlliumConfig>;
  return {
    ...defaultConfig,
    ...parsed,
    apiKeys: parsed.apiKeys ?? {},
    thirdPartyAccounts: parsed.thirdPartyAccounts ?? [],
    desktopControl: {
      ...defaultConfig.desktopControl,
      ...(parsed.desktopControl ?? {})
    }
  };
}

export function saveConfig(config: AlliumConfig): void {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  try {
    chmodSync(configPath, 0o600);
  } catch {
    // Windows may ignore POSIX mode bits; the file still lives in the user profile.
  }
}

export function getConfiguredKey(config: AlliumConfig, envKey?: string): string | undefined {
  if (!envKey) {
    return undefined;
  }

  return process.env[envKey] || config.apiKeys[envKey];
}

export function redact(value: string | undefined): string {
  if (!value) {
    return "not set";
  }

  if (value.length <= 8) {
    return "set";
  }

  return `${value.slice(0, 3)}...${value.slice(-4)}`;
}
