#!/usr/bin/env node
import React from "react";
import { Command } from "commander";
import { render } from "ink";
import chalk from "chalk";
import { App } from "./ui/App.js";
import { loadConfig } from "./config.js";
import { runSetup } from "./setup.js";
import { commandSkills } from "./commands.js";
import { appMcpProviders, modelProviders, searchProviders } from "./providers/catalog.js";

const program = new Command();

program
  .name("allium")
  .description("Allium AI local terminal assistant")
  .version("0.1.0")
  .action(() => {
    render(<App initialConfig={loadConfig()} />);
  });

program
  .command("setup")
  .description("Configure model provider, model, search provider, API keys, and desktop controls")
  .action(async () => {
    await runSetup();
  });

program
  .command("providers")
  .description("List supported model and search providers")
  .action(() => {
    console.log(chalk.magentaBright("Model providers"));
    for (const provider of modelProviders) {
      console.log(`- ${provider.id}: ${provider.label} (${provider.protocol})`);
    }
    console.log(chalk.magentaBright("\nSearch providers"));
    for (const provider of searchProviders) {
      console.log(`- ${provider.id}: ${provider.label}`);
    }
  });

program
  .command("commands")
  .description("List Allium slash commands")
  .action(() => {
    for (const command of commandSkills) {
      console.log(`${command.name.padEnd(18)} ${command.category.padEnd(9)} ${command.description}`);
    }
  });

program
  .command("apps")
  .description("List supported app MCP providers")
  .action(() => {
    console.log(chalk.magentaBright("App MCP providers"));
    for (const app of appMcpProviders) {
      console.log(`- ${app.id}: ${app.label} (${app.envKey})`);
    }
  });

await program.parseAsync(process.argv);
