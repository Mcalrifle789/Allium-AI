import { checkbox, confirm, input, password, select } from "@inquirer/prompts";
import chalk from "chalk";
import { defaultConfig, loadConfig, saveConfig, configPath } from "./config.js";
import { modelProviders, searchProviders, thirdPartyAccounts } from "./providers/catalog.js";
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

  const selectedThirdPartyAccounts = await checkbox({
    message: "Connect any third-party CLI accounts?",
    choices: thirdPartyAccounts.map((account) => ({
      name: account.label,
      value: account.id,
      checked: current.thirdPartyAccounts.includes(account.id),
      description: account.notes
    }))
  });

  const apiKeys = { ...current.apiKeys };
  for (const provider of [
    modelProvider,
    searchProviders.find((provider) => provider.id === searchProviderId)
  ]) {
    if (!provider?.requiresKey || !provider.envKey) {
      continue;
    }

    const existing = process.env[provider.envKey] || apiKeys[provider.envKey];
    const shouldEnter = !existing || await confirm({
      message: `${provider.label} already has a key configured. Replace it?`,
      default: false
    });

    if (shouldEnter) {
      const label = "keyLabel" in provider ? provider.keyLabel : provider.envKey;
      const value = await password({
        message: `Enter ${label ?? provider.envKey}`,
        mask: "*",
        validate: (candidate) => candidate.trim().length > 0 || "API key is required."
      });
      apiKeys[provider.envKey] = value.trim();
    }
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
    desktopControl: {
      enabled: desktopEnabled,
      requireConfirmation
    }
  };

  saveConfig(config);
  console.log(chalk.green(`\nAllium config saved to ${configPath}\n`));
  return config;
}
