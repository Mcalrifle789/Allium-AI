# Allium AI

Allium AI is a local personal AI assistant for the terminal. It connects to user-selected model API providers, optional search APIs, third-party AI CLIs, and local desktop-control bridges.

The app is designed around the terminal look in the included Allium mockup: dark runtime panel, large Allium identity, model/search status, a gradient-like input area, and a blooming allium flower while the agent is thinking.

## Highlights

- TypeScript terminal UI powered by Ink
- `allium setup` configuration wizard
- Green plan mode and blue build mode
- Slash command popup with 44 commands/skills
- Model providers: OpenRouter, OpenAI, Anthropic, Google Gemini, xAI Grok, Mistral, Perplexity, Together, Fireworks, Groq, DeepSeek, Cohere, Cerebras, Replicate, Hugging Face, Azure OpenAI, AWS Bedrock, Ollama, LM Studio, OpenCode, and Kilo
- Search providers: DuckDuckGo, Parallel, Parallel Free, Perplexity, Gemini Grounding, Google Custom Search, Brave, Tavily, SerpAPI, Exa, SearXNG, Bing, Kagi, and You.com
- Python desktop bridge for Windows/Linux
- Swift desktop bridge source for macOS

## Install

```powershell
git clone https://github.com/Mcalrifle789/Allium-AI.git
cd Allium-AI
npm install
npm run build
npm link
allium setup
allium
```

See [docs/INSTALLATION.md](docs/INSTALLATION.md) for the full guide.

## Development

```powershell
npm install
npm run dev
npm run typecheck
npm run build
```

## Commands

Type `/` inside Allium to open the command palette. The app currently includes 44 commands covering planning, setup, providers, web search, desktop control, files, code, git, docs, and help.

## Privacy

Allium runs locally. Provider API calls go only to the provider selected in setup. Desktop control is disabled by default and should remain confirmation-gated for real use.
