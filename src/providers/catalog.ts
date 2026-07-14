import type { AppMcpProvider, ModelProvider, SearchProvider, ThirdPartyAccount } from "../types.js";

export const modelProviders: ModelProvider[] = [
  {
    id: "openrouter",
    label: "OpenRouter",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://openrouter.ai/api/v1",
    envKey: "OPENROUTER_API_KEY",
    keyLabel: "OpenRouter API key",
    models: ["openai/gpt-4.1", "anthropic/claude-sonnet-4", "google/gemini-2.5-pro", "x-ai/grok-4"],
    modelListUrl: "https://openrouter.ai/api/v1/models",
    requiresKey: true,
    notes: "Routes many commercial and open models through one OpenAI-compatible API."
  },
  {
    id: "openai",
    label: "OpenAI",
    kind: "model",
    protocol: "openai-responses",
    baseUrl: "https://api.openai.com/v1",
    envKey: "OPENAI_API_KEY",
    keyLabel: "OpenAI API key",
    models: ["gpt-5.1", "gpt-5-mini", "gpt-4.1", "o4-mini"],
    modelListUrl: "https://api.openai.com/v1/models",
    requiresKey: true
  },
  {
    id: "anthropic",
    label: "Anthropic",
    kind: "model",
    protocol: "anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    envKey: "ANTHROPIC_API_KEY",
    keyLabel: "Anthropic API key",
    models: ["claude-sonnet-4-5", "claude-opus-4-1", "claude-haiku-4-5"],
    requiresKey: true
  },
  {
    id: "google-gemini",
    label: "Google Gemini",
    kind: "model",
    protocol: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    envKey: "GEMINI_API_KEY",
    keyLabel: "Gemini API key",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-live-2.5-flash-preview"],
    requiresKey: true
  },
  {
    id: "xai",
    label: "xAI Grok",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://api.x.ai/v1",
    envKey: "XAI_API_KEY",
    keyLabel: "xAI API key",
    models: ["grok-4", "grok-3", "grok-3-mini"],
    requiresKey: true
  },
  {
    id: "mistral",
    label: "Mistral AI",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://api.mistral.ai/v1",
    envKey: "MISTRAL_API_KEY",
    models: ["mistral-large-latest", "codestral-latest", "ministral-8b-latest"],
    requiresKey: true
  },
  {
    id: "perplexity",
    label: "Perplexity",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://api.perplexity.ai",
    envKey: "PERPLEXITY_API_KEY",
    models: ["sonar", "sonar-pro", "sonar-reasoning-pro"],
    requiresKey: true
  },
  {
    id: "together",
    label: "Together AI",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://api.together.xyz/v1",
    envKey: "TOGETHER_API_KEY",
    models: ["meta-llama/Llama-3.3-70B-Instruct-Turbo", "deepseek-ai/DeepSeek-V3"],
    requiresKey: true
  },
  {
    id: "fireworks",
    label: "Fireworks AI",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://api.fireworks.ai/inference/v1",
    envKey: "FIREWORKS_API_KEY",
    models: ["accounts/fireworks/models/llama-v3p1-405b-instruct", "accounts/fireworks/models/deepseek-v3"],
    requiresKey: true
  },
  {
    id: "groq",
    label: "Groq",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://api.groq.com/openai/v1",
    envKey: "GROQ_API_KEY",
    models: ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "moonshotai/kimi-k2-instruct"],
    requiresKey: true
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://api.deepseek.com/v1",
    envKey: "DEEPSEEK_API_KEY",
    models: ["deepseek-chat", "deepseek-reasoner"],
    requiresKey: true
  },
  {
    id: "cohere",
    label: "Cohere",
    kind: "model",
    protocol: "custom",
    baseUrl: "https://api.cohere.com/v2",
    envKey: "COHERE_API_KEY",
    models: ["command-a-03-2025", "command-r-plus", "command-r"],
    requiresKey: true,
    notes: "Catalog entry included; adapter stub can be extended for Cohere-native chat."
  },
  {
    id: "cerebras",
    label: "Cerebras",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://api.cerebras.ai/v1",
    envKey: "CEREBRAS_API_KEY",
    models: ["llama-4-scout-17b-16e-instruct", "qwen-3-235b-a22b"],
    requiresKey: true
  },
  {
    id: "replicate",
    label: "Replicate",
    kind: "model",
    protocol: "custom",
    baseUrl: "https://api.replicate.com/v1",
    envKey: "REPLICATE_API_TOKEN",
    models: ["meta/meta-llama-3-70b-instruct", "mistralai/mixtral-8x7b-instruct-v0.1"],
    requiresKey: true
  },
  {
    id: "huggingface",
    label: "Hugging Face Inference",
    kind: "model",
    protocol: "custom",
    baseUrl: "https://api-inference.huggingface.co",
    envKey: "HF_TOKEN",
    models: ["meta-llama/Meta-Llama-3.1-8B-Instruct", "mistralai/Mistral-7B-Instruct-v0.3"],
    requiresKey: true
  },
  {
    id: "azure-openai",
    label: "Azure OpenAI",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "https://{resource}.openai.azure.com/openai/v1",
    envKey: "AZURE_OPENAI_API_KEY",
    models: ["gpt-4.1", "gpt-4o", "o4-mini"],
    requiresKey: true,
    notes: "Set ALLIUM_AZURE_BASE_URL to your resource-specific endpoint."
  },
  {
    id: "aws-bedrock",
    label: "AWS Bedrock",
    kind: "model",
    protocol: "custom",
    models: ["anthropic.claude-3-5-sonnet", "amazon.nova-pro", "meta.llama3-70b-instruct"],
    requiresKey: false,
    notes: "Uses AWS credentials from the normal AWS CLI/profile chain."
  },
  {
    id: "ollama",
    label: "Ollama",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "http://127.0.0.1:11434/v1",
    models: ["llama3.2", "qwen2.5-coder", "mistral-nemo"],
    requiresKey: false
  },
  {
    id: "lm-studio",
    label: "LM Studio",
    kind: "model",
    protocol: "openai-compatible",
    baseUrl: "http://127.0.0.1:1234/v1",
    models: ["local-model"],
    requiresKey: false
  },
  {
    id: "opencode",
    label: "OpenCode CLI",
    kind: "model",
    protocol: "cli",
    models: ["opencode-default"],
    requiresKey: false,
    notes: "Delegates to an installed opencode CLI account."
  },
  {
    id: "kilo",
    label: "Kilo Code",
    kind: "model",
    protocol: "cli",
    models: ["kilo-default"],
    requiresKey: false,
    notes: "Reserved for local Kilo/Kilo Code style CLI integration."
  }
];

export const searchProviders: SearchProvider[] = [
  { id: "duckduckgo", label: "DuckDuckGo Instant Answer", kind: "search", requiresKey: false, baseUrl: "https://api.duckduckgo.com", notes: "Free lightweight instant-answer search." },
  { id: "parallel", label: "Parallel Web API", kind: "search", envKey: "PARALLEL_API_KEY", requiresKey: true, notes: "Commercial web research/search provider." },
  { id: "parallel-free", label: "Parallel Free", kind: "search", requiresKey: false, notes: "Free-tier placeholder for Parallel-compatible search." },
  { id: "perplexity", label: "Perplexity Sonar", kind: "search", envKey: "PERPLEXITY_API_KEY", requiresKey: true, baseUrl: "https://api.perplexity.ai" },
  { id: "google-gemini", label: "Gemini Grounding", kind: "search", envKey: "GEMINI_API_KEY", requiresKey: true },
  { id: "google-custom-search", label: "Google Custom Search", kind: "search", envKey: "GOOGLE_SEARCH_API_KEY", requiresKey: true },
  { id: "brave", label: "Brave Search", kind: "search", envKey: "BRAVE_SEARCH_API_KEY", requiresKey: true, baseUrl: "https://api.search.brave.com/res/v1/web/search" },
  { id: "tavily", label: "Tavily", kind: "search", envKey: "TAVILY_API_KEY", requiresKey: true, baseUrl: "https://api.tavily.com/search" },
  { id: "serpapi", label: "SerpAPI", kind: "search", envKey: "SERPAPI_API_KEY", requiresKey: true, baseUrl: "https://serpapi.com/search.json" },
  { id: "exa", label: "Exa", kind: "search", envKey: "EXA_API_KEY", requiresKey: true, baseUrl: "https://api.exa.ai/search" },
  { id: "searxng", label: "SearXNG", kind: "search", requiresKey: false, notes: "Set ALLIUM_SEARXNG_URL for a self-hosted instance." },
  { id: "bing", label: "Bing Web Search", kind: "search", envKey: "BING_SEARCH_API_KEY", requiresKey: true },
  { id: "kagi", label: "Kagi Search", kind: "search", envKey: "KAGI_API_KEY", requiresKey: true },
  { id: "you", label: "You.com Search", kind: "search", envKey: "YOU_API_KEY", requiresKey: true }
];

export const thirdPartyAccounts: ThirdPartyAccount[] = [
  { id: "anthropic-cli", label: "Claude / Anthropic CLI", command: "claude", envKey: "ANTHROPIC_API_KEY", notes: "Uses your installed Claude CLI login or Anthropic API key." },
  { id: "gemini-cli", label: "Google Gemini CLI", command: "gemini", envKey: "GEMINI_API_KEY", notes: "Uses your installed Gemini CLI login or Gemini API key." },
  { id: "openai-cli", label: "OpenAI CLI", command: "openai", envKey: "OPENAI_API_KEY", notes: "Uses your installed OpenAI CLI configuration or OpenAI API key." },
  { id: "grok-account", label: "Grok / xAI Account", command: "xai", envKey: "XAI_API_KEY", notes: "Connects a Grok/xAI account through an API key." },
  { id: "elevenlabs", label: "ElevenLabs", command: "elevenlabs", envKey: "ELEVENLABS_API_KEY", notes: "Enables voice and music generation skills." },
  { id: "opencode-cli", label: "OpenCode CLI", command: "opencode", notes: "Uses your installed OpenCode account." }
];

export const appMcpProviders: AppMcpProvider[] = [
  { id: "google-workspace", label: "Google Workspace", envKey: "GOOGLE_WORKSPACE_API_KEY", notes: "Gmail, Drive, Docs, Sheets, Calendar, and Workspace automation." },
  { id: "figma", label: "Figma", envKey: "FIGMA_API_KEY", notes: "Design files, comments, components, and handoff context." },
  { id: "canva", label: "Canva", envKey: "CANVA_API_KEY", notes: "Design creation and asset workflows." },
  { id: "notion", label: "Notion", envKey: "NOTION_API_KEY", notes: "Pages, databases, docs, and workspace knowledge." },
  { id: "slack", label: "Slack", envKey: "SLACK_BOT_TOKEN", notes: "Team messages and channels." },
  { id: "discord", label: "Discord", envKey: "DISCORD_BOT_TOKEN", notes: "Discord server messaging and community workflows." },
  { id: "github", label: "GitHub", envKey: "GITHUB_TOKEN", notes: "Repositories, issues, pull requests, and releases." },
  { id: "linear", label: "Linear", envKey: "LINEAR_API_KEY", notes: "Issues, projects, cycles, and roadmaps." },
  { id: "jira", label: "Jira", envKey: "JIRA_API_TOKEN", notes: "Tickets, projects, and engineering workflows." },
  { id: "airtable", label: "Airtable", envKey: "AIRTABLE_API_KEY", notes: "Bases, records, and lightweight databases." },
  { id: "supabase", label: "Supabase", envKey: "SUPABASE_ACCESS_TOKEN", notes: "Projects, databases, edge functions, and storage." },
  { id: "zapier", label: "Zapier", envKey: "ZAPIER_API_KEY", notes: "Connected automation actions across many apps." }
];

export function getModelProvider(id: string): ModelProvider | undefined {
  return modelProviders.find((provider) => provider.id === id);
}

export function getSearchProvider(id: string): SearchProvider | undefined {
  return searchProviders.find((provider) => provider.id === id);
}
