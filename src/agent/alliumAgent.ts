import type { AlliumConfig, ChatMessage } from "../types.js";
import { getModelProvider, getSearchProvider } from "../providers/catalog.js";
import { sendChat } from "./modelClient.js";
import { searchWeb } from "./searchClient.js";

export function systemPrompt(config: AlliumConfig): string {
  return [
    "You are Allium AI, a local terminal personal AI assistant.",
    `Current mode: ${config.mode}.`,
    config.mode === "plan"
      ? "In plan mode, ask good questions only when necessary, outline steps, risks, and decisions before building."
      : "In build mode, focus on concrete implementation, commands, edits, and verification.",
    "Respect local privacy. Ask before irreversible desktop or external actions."
  ].join("\n");
}

export async function answerUser(
  config: AlliumConfig,
  history: ChatMessage[],
  input: string
): Promise<string> {
  if (input.startsWith("/search ")) {
    const provider = getSearchProvider(config.searchProviderId);
    if (!provider) {
      return "Search provider is not configured. Run /setup.";
    }

    const results = await searchWeb(provider, config, input.replace("/search ", "").trim());
    if (results.length === 0) {
      return "No search results found.";
    }

    return results.map((result, index) => {
      const url = result.url ? `\n   ${result.url}` : "";
      return `${index + 1}. ${result.title}${url}\n   ${result.snippet}`;
    }).join("\n\n");
  }

  const provider = getModelProvider(config.modelProviderId);
  if (!provider) {
    return "Model provider is not configured. Run /setup.";
  }

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt(config) },
    ...history,
    { role: "user", content: input }
  ];

  return sendChat(provider, config, messages);
}
