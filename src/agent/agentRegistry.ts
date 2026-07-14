import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AlliumAgent } from "../types.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function slugifyAgentName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "agent";
}

export function createAgent(name: string): AlliumAgent {
  const id = slugifyAgentName(name);
  const agent: AlliumAgent = {
    id,
    name: name.trim(),
    description: "Custom Allium agent.",
    createdAt: new Date().toISOString()
  };

  const agentsDir = join(packageRoot, "agents", id);
  mkdirSync(agentsDir, { recursive: true });
  writeFileSync(
    join(agentsDir, "agent.json"),
    `${JSON.stringify(agent, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(
    join(agentsDir, "README.md"),
    `# ${agent.name}\n\nCustom Allium agent stored locally in this project.\n`,
    "utf8"
  );

  return agent;
}

export function findAgent(agents: AlliumAgent[], nameOrId: string): AlliumAgent | undefined {
  const normalized = slugifyAgentName(nameOrId);
  return agents.find((agent) => agent.id === normalized || slugifyAgentName(agent.name) === normalized);
}
