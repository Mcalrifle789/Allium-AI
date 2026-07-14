import type { CommandSkill } from "./types.js";

export const commandSkills: CommandSkill[] = [
  { name: "/plan", category: "Mode", description: "Switch to green planning mode for architecture, tasks, and risk checks." },
  { name: "/build", category: "Mode", description: "Switch to blue build mode for implementation and command execution." },
  { name: "/setup", category: "Config", description: "Run the Allium setup wizard." },
  { name: "/providers", category: "Config", description: "Show model providers and configured status." },
  { name: "/models", category: "Config", description: "Show or refresh models for the active provider." },
  { name: "/search-provider", category: "Config", description: "Switch the internet search provider." },
  { name: "/accounts", category: "Config", description: "Inspect linked CLI accounts." },
  { name: "/keys", category: "Config", description: "Check which provider keys are configured without revealing them." },
  { name: "/status", category: "Session", description: "Show session, mode, model, search, desktop, and token status." },
  { name: "/new", category: "Session", description: "Start a new local chat session." },
  { name: "/save", category: "Session", description: "Save the current conversation to disk." },
  { name: "/load", category: "Session", description: "Load a saved conversation." },
  { name: "/export", category: "Session", description: "Export the conversation as Markdown." },
  { name: "/clear", category: "Session", description: "Clear visible chat history." },
  { name: "/memory", category: "Memory", description: "Search local Allium memory." },
  { name: "/remember", category: "Memory", description: "Store a durable local note." },
  { name: "/forget", category: "Memory", description: "Remove a memory entry." },
  { name: "/summarize", category: "Memory", description: "Summarize the current thread." },
  { name: "/search", category: "Web", description: "Search the internet with the configured search provider." },
  { name: "/open", category: "Web", description: "Open a URL or local file." },
  { name: "/research", category: "Web", description: "Run a multi-source research pass." },
  { name: "/cite", category: "Web", description: "Request cited answers from search results." },
  { name: "/desktop", category: "Desktop", description: "Toggle desktop control." },
  { name: "/screenshot", category: "Desktop", description: "Capture desktop context for the agent." },
  { name: "/click", category: "Desktop", description: "Click coordinates after confirmation." },
  { name: "/type", category: "Desktop", description: "Type text into the active desktop app." },
  { name: "/hotkey", category: "Desktop", description: "Send a keyboard shortcut." },
  { name: "/window", category: "Desktop", description: "List or focus desktop windows." },
  { name: "/terminal", category: "Tools", description: "Run a terminal command in build mode." },
  { name: "/files", category: "Tools", description: "Browse project files." },
  { name: "/read", category: "Tools", description: "Read a file into context." },
  { name: "/edit", category: "Tools", description: "Edit a file with a requested change." },
  { name: "/diff", category: "Tools", description: "Show current code changes." },
  { name: "/test", category: "Tools", description: "Run test commands." },
  { name: "/lint", category: "Tools", description: "Run lint or type checks." },
  { name: "/commit", category: "Git", description: "Prepare a local git commit." },
  { name: "/branch", category: "Git", description: "Create or switch branches." },
  { name: "/pr", category: "Git", description: "Draft pull request notes." },
  { name: "/review", category: "Code", description: "Review code for bugs and regressions." },
  { name: "/debug", category: "Code", description: "Debug a failing command or stack trace." },
  { name: "/explain", category: "Code", description: "Explain selected code or output." },
  { name: "/refactor", category: "Code", description: "Refactor while preserving behavior." },
  { name: "/docs", category: "Docs", description: "Generate or update documentation." },
  { name: "/help", category: "Help", description: "Show command help." }
];

export function searchCommands(query: string): CommandSkill[] {
  const normalized = query.toLowerCase().replace(/^\//, "");
  return commandSkills.filter((command) => {
    return (
      command.name.toLowerCase().includes(normalized) ||
      command.category.toLowerCase().includes(normalized) ||
      command.description.toLowerCase().includes(normalized)
    );
  });
}
