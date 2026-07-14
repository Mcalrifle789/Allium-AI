import { checkbox, confirm, input, password, select } from "@inquirer/prompts";
import chalk from "chalk";
import { defaultConfig, loadConfig, saveConfig, configPath } from "./config.js";
import { appMcpProviders, modelProviders, searchProviders, thirdPartyAccounts } from "./providers/catalog.js";
import type { AlliumConfig } from "./types.js";

export async function runSetup(): Promise<AlliumConfig> {
  console.log(chalk.magentaBright("\nAllium AI setup\n"));

  const current = loadConfig();
  const modelProviderId = await select({
    message: "Which model API provider should Allium use?",
    choices: modelProviders.map((provider) => ({
      name: `${provider.label}${provider.requiresKey ? " (API key)" : ""}`,
      value: provider.id,
      description: provider.notes
    })),
    default: current.modelProviderId
  });

  const modelProvider = modelProviders.find((provider) => provider.id === modelProviderId) ?? modelProviders[0]!;
  const apiKeys = { ...current.apiKeys };
  await promptForKey(apiKeys, modelProvider.envKey, modelProvider.keyLabel ?? modelProvider.label, modelProvider.requiresKey);

  const model = await select({
    message: `Which ${modelProvider.label} model should Allium use?`,
    choices: modelProvider.models.map((candidate) => ({ name: candidate, value: candidate })),
    default: current.model
  });

  const searchProviderId = await select({
    message: "Which internet search provider should Allium use?",
    choices: searchProviders.map((provider) => ({
      name: `${provider.label}${provider.requiresKey ? " (API key)" : ""}`,
      value: provider.id,
      description: provider.notes
    })),
    default: current.searchProviderId
  });
  const searchProvider = searchProviders.find((provider) => provider.id === searchProviderId);
  await promptForKey(apiKeys, searchProvider?.envKey, searchProvider?.label, searchProvider?.requiresKey ?? false);

  const selectedThirdPartyAccounts = await checkbox({
    message: "Connect accounts?",
    choices: thirdPartyAccounts.map((account) => ({
      name: account.label,
      value: account.id,
      checked: current.thirdPartyAccounts.includes(account.id),
      description: account.notes
    }))
  });

  for (const accountId of selectedThirdPartyAccounts) {
    const account = thirdPartyAccounts.find((candidate) => candidate.id === accountId);
    await promptForKey(apiKeys, account?.envKey, account?.label, Boolean(account?.envKey));
  }

  const selectedApps = await checkbox({
    message: "Apps: connect app MCPs?",
    choices: appMcpProviders.map((app) => ({
      name: app.label,
      value: app.id,
      checked: current.connectedApps.includes(app.id),
      description: app.notes
    }))
  });

  for (const appId of selectedApps) {
    const app = appMcpProviders.find((candidate) => candidate.id === appId);
    await promptForKey(apiKeys, app?.envKey, app?.label, Boolean(app?.envKey));
  }

  const desktopEnabled = await confirm({
    message: "Enable desktop-control tools?",
    default: current.desktopControl.enabled
  });

  const requireConfirmation = desktopEnabled
    ? await confirm({
      message: "Require confirmation before desktop actions?",
      default: current.desktopControl.requireConfirmation
    })
    : true;

  const customModel = await input({
    message: "Optional custom model override (press Enter to keep selected model)",
    default: ""
  });

  const config: AlliumConfig = {
    ...defaultConfig,
    ...current,
    modelProviderId,
    model: customModel.trim() || model,
    searchProviderId,
    apiKeys,
    thirdPartyAccounts: selectedThirdPartyAccounts,
    connectedApps: selectedApps,
    desktopControl: {
      enabled: desktopEnabled,
      requireConfirmation
    }
  };

  saveConfig(config);
  console.log(chalk.green(`\nAllium config saved to ${configPath}\n`));
  return config;
}

async function promptForKey(
  apiKeys: Record<string, string>,
  envKey: string | undefined,
  label: string | undefined,
  required: boolean
): Promise<void> {
  if (!required || !envKey) {
    return;
  }

  const existing = process.env[envKey] || apiKeys[envKey];
  const shouldEnter = !existing || await confirm({
    message: `${label ?? envKey} already has a key configured. Replace it?`,
    default: false
  });

  if (!shouldEnter) {
    return;
  }

  const value = await password({
    message: `Enter ${label ?? envKey} key`,
    mask: "*",
    validate: (candidate) => candidate.trim().length > 0 || "API key is required."
  });
  apiKeys[envKey] = value.trim();
}
