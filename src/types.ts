export type Mode = "plan" | "build";

export type ProviderKind = "model" | "search" | "desktop" | "account";

export type ProviderProtocol =
  | "openai-compatible"
  | "openai-responses"
  | "anthropic"
  | "gemini"
  | "cli"
  | "local"
  | "custom";

export interface ModelProvider {
  id: string;
  label: string;
  kind: "model";
  protocol: ProviderProtocol;
  baseUrl?: string;
  envKey?: string;
  keyLabel?: string;
  models: string[];
  modelListUrl?: string;
  notes?: string;
  requiresKey: boolean;
}

export interface SearchProvider {
  id: string;
  label: string;
  kind: "search";
  envKey?: string;
  baseUrl?: string;
  notes?: string;
  requiresKey: boolean;
}

export interface ThirdPartyAccount {
  id: string;
  label: string;
  command: string;
  notes: string;
  envKey?: string;
}

export interface AppMcpProvider {
  id: string;
  label: string;
  envKey: string;
  notes: string;
}

export interface AlliumAgent {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface AlliumConfig {
  modelProviderId: string;
  model: string;
  searchProviderId: string;
  mode: Mode;
  apiKeys: Record<string, string>;
  thirdPartyAccounts: string[];
  connectedApps: string[];
  activeAgentId: string;
  runningAgentIds: string[];
  agents: AlliumAgent[];
  desktopControl: {
    enabled: boolean;
    requireConfirmation: boolean;
  };
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CommandSkill {
  name: string;
  category: string;
  description: string;
}
