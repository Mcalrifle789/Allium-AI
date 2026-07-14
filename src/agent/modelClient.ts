import { spawn } from "node:child_process";
import type { AlliumConfig, ChatMessage, ModelProvider } from "../types.js";
import { getConfiguredKey } from "../config.js";

export async function sendChat(
  provider: ModelProvider,
  config: AlliumConfig,
  messages: ChatMessage[]
): Promise<string> {
  if (provider.protocol === "openai-compatible" || provider.protocol === "openai-responses") {
    return sendOpenAiCompatible(provider, config, messages);
  }

  if (provider.protocol === "anthropic") {
    return sendAnthropic(provider, config, messages);
  }

  if (provider.protocol === "gemini") {
    return sendGemini(provider, config, messages);
  }

  if (provider.protocol === "cli") {
    return runCliProvider(provider.id, messages.at(-1)?.content ?? "");
  }

  return [
    `${provider.label} is in the provider catalog, but its native adapter is not implemented yet.`,
    "Choose an OpenAI-compatible provider, Anthropic, Gemini, Ollama, or LM Studio for live chat today."
  ].join("\n");
}

async function sendOpenAiCompatible(
  provider: ModelProvider,
  config: AlliumConfig,
  messages: ChatMessage[]
): Promise<string> {
  const key = getConfiguredKey(config, provider.envKey);
  const baseUrl = provider.id === "azure-openai"
    ? process.env.ALLIUM_AZURE_BASE_URL || provider.baseUrl
    : provider.baseUrl;

  if (!baseUrl) {
    throw new Error(`${provider.label} is missing a base URL.`);
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (provider.requiresKey) {
    if (!key) {
      throw new Error(`${provider.label} API key is not configured. Run allium setup.`);
    }
    headers.Authorization = `Bearer ${key}`;
  }

  if (provider.id === "openrouter") {
    headers["HTTP-Referer"] = "https://github.com/Mcalrifle789/Allium-AI";
    headers["X-Title"] = "Allium AI";
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.mode === "plan" ? 0.3 : 0.6
    })
  });

  if (!response.ok) {
    throw new Error(`${provider.label} request failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return json.choices?.[0]?.message?.content?.trim() || "(empty response)";
}

async function sendAnthropic(
  provider: ModelProvider,
  config: AlliumConfig,
  messages: ChatMessage[]
): Promise<string> {
  const key = getConfiguredKey(config, provider.envKey);
  if (!key) {
    throw new Error("Anthropic API key is not configured. Run allium setup.");
  }

  const system = messages.find((message) => message.role === "system")?.content;
  const userMessages = messages.filter((message) => message.role !== "system");
  const response = await fetch(`${provider.baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2048,
      system,
      messages: userMessages
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json() as { content?: Array<{ text?: string }> };
  return json.content?.map((part) => part.text ?? "").join("").trim() || "(empty response)";
}

async function sendGemini(
  provider: ModelProvider,
  config: AlliumConfig,
  messages: ChatMessage[]
): Promise<string> {
  const key = getConfiguredKey(config, provider.envKey);
  if (!key) {
    throw new Error("Gemini API key is not configured. Run allium setup.");
  }

  const prompt = messages.map((message) => `${message.role}: ${message.content}`).join("\n\n");
  const response = await fetch(`${provider.baseUrl}/models/${config.model}:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() || "(empty response)";
}

function runCliProvider(providerId: string, prompt: string): Promise<string> {
  const command = providerId === "opencode" ? "opencode" : "kilo";
  return new Promise((resolve) => {
    const child = spawn(command, [prompt], { shell: true });
    let output = "";
    let error = "";

    child.stdout.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      error += chunk.toString();
    });
    child.on("close", (code) => {
      if (code === 0 && output.trim()) {
        resolve(output.trim());
        return;
      }
      resolve(`${command} did not return a successful response.\n${error.trim() || "Check that the CLI is installed and logged in."}`);
    });
  });
}
