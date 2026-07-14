import type { AlliumConfig, SearchProvider } from "../types.js";
import { getConfiguredKey } from "../config.js";

export interface SearchResult {
  title: string;
  url?: string;
  snippet: string;
}

export async function searchWeb(
  provider: SearchProvider,
  config: AlliumConfig,
  query: string
): Promise<SearchResult[]> {
  if (provider.id === "duckduckgo" || provider.id === "parallel-free") {
    return searchDuckDuckGo(query);
  }

  if (provider.id === "brave") {
    return searchBrave(provider, config, query);
  }

  if (provider.id === "tavily") {
    return searchTavily(provider, config, query);
  }

  if (provider.id === "serpapi") {
    return searchSerpApi(provider, config, query);
  }

  if (provider.id === "searxng") {
    return searchSearxng(query);
  }

  return [{
    title: `${provider.label} search is configured`,
    snippet: "This provider is in the catalog. Add its native adapter in src/agent/searchClient.ts to enable live search.",
    url: provider.baseUrl
  }];
}

async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`DuckDuckGo search failed: ${response.status}`);
  }

  const json = await response.json() as {
    AbstractText?: string;
    AbstractURL?: string;
    Heading?: string;
    RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
  };

  const results: SearchResult[] = [];
  if (json.AbstractText) {
    results.push({ title: json.Heading || query, snippet: json.AbstractText, url: json.AbstractURL });
  }

  for (const topic of json.RelatedTopics ?? []) {
    if (topic.Text) {
      results.push({ title: topic.Text.split(" - ")[0] ?? query, snippet: topic.Text, url: topic.FirstURL });
    }
  }

  return results.slice(0, 5);
}

async function searchBrave(provider: SearchProvider, config: AlliumConfig, query: string): Promise<SearchResult[]> {
  const key = getConfiguredKey(config, provider.envKey);
  if (!key) {
    throw new Error("Brave Search key is not configured. Run allium setup.");
  }

  const response = await fetch(`${provider.baseUrl}?q=${encodeURIComponent(query)}&count=5`, {
    headers: { "X-Subscription-Token": key }
  });
  if (!response.ok) {
    throw new Error(`Brave search failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json() as {
    web?: { results?: Array<{ title?: string; url?: string; description?: string }> };
  };
  return (json.web?.results ?? []).map((result) => ({
    title: result.title ?? "Untitled",
    url: result.url,
    snippet: result.description ?? ""
  }));
}

async function searchTavily(provider: SearchProvider, config: AlliumConfig, query: string): Promise<SearchResult[]> {
  const key = getConfiguredKey(config, provider.envKey);
  if (!key) {
    throw new Error("Tavily key is not configured. Run allium setup.");
  }

  const response = await fetch(provider.baseUrl!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: key, query, max_results: 5 })
  });
  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json() as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };
  return (json.results ?? []).map((result) => ({
    title: result.title ?? "Untitled",
    url: result.url,
    snippet: result.content ?? ""
  }));
}

async function searchSerpApi(provider: SearchProvider, config: AlliumConfig, query: string): Promise<SearchResult[]> {
  const key = getConfiguredKey(config, provider.envKey);
  if (!key) {
    throw new Error("SerpAPI key is not configured. Run allium setup.");
  }

  const response = await fetch(`${provider.baseUrl}?engine=google&q=${encodeURIComponent(query)}&api_key=${encodeURIComponent(key)}`);
  if (!response.ok) {
    throw new Error(`SerpAPI search failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json() as {
    organic_results?: Array<{ title?: string; link?: string; snippet?: string }>;
  };
  return (json.organic_results ?? []).slice(0, 5).map((result) => ({
    title: result.title ?? "Untitled",
    url: result.link,
    snippet: result.snippet ?? ""
  }));
}

async function searchSearxng(query: string): Promise<SearchResult[]> {
  const baseUrl = process.env.ALLIUM_SEARXNG_URL;
  if (!baseUrl) {
    throw new Error("Set ALLIUM_SEARXNG_URL to use SearXNG.");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/search?q=${encodeURIComponent(query)}&format=json`);
  if (!response.ok) {
    throw new Error(`SearXNG search failed: ${response.status}`);
  }

  const json = await response.json() as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };
  return (json.results ?? []).slice(0, 5).map((result) => ({
    title: result.title ?? "Untitled",
    url: result.url,
    snippet: result.content ?? ""
  }));
}
