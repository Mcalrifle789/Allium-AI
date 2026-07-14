# Allium AI Installation Guide

Allium AI is a local terminal assistant. The main app is TypeScript, with Python and Swift bridge files for desktop control.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Git
- Optional for desktop control: Python 3.10+ with `pyautogui pillow`
- Optional on macOS: Swift command line tools

## Install From GitHub

```powershell
git clone https://github.com/Mcalrifle789/Allium-AI.git
cd Allium-AI
npm install
npm run build
npm link
```

After linking, the command is available as:

```powershell
allium
```

## Setup

Run:

```powershell
allium setup
```

The setup wizard asks for:

- Model API provider
- API key immediately after choosing a keyed model provider
- Model name
- Search provider
- Search provider API key when required
- Apps: app MCPs such as Google Workspace, Figma, Canva, Notion, Slack, Discord, GitHub, Linear, Jira, Airtable, Supabase, and Zapier
- API keys when the provider requires one
- Accounts such as Claude/Anthropic, Gemini, OpenAI, Grok/xAI, ElevenLabs, and OpenCode
- Desktop-control preference

API keys are stored in your user profile at:

```text
~/.allium/config.json
```

You can also use environment variables such as `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `BRAVE_SEARCH_API_KEY`, and others listed in the provider catalog.

## Run

```powershell
allium
```

Type `/` in the chat box to open the command and skill list. Use Up/Down or PageUp/PageDown to scroll. The command under the cursor turns white. Use `/plan` for planning mode and `/build` for build mode.

## Agents

Open the agent panel:

```powershell
/agent
```

Create, switch, or run agents:

```powershell
/agent create Research
/agent switch Research
/agent run Builder
/agent stop Builder
```

Created agent files are stored in:

```text
agents/<agent-id>/
```

## ElevenLabs Music

Connect ElevenLabs in `allium setup`, then use:

```text
/music-prompt
/music-compose
/music-remix
/music-loop
/music-stems
/music-voice
```

## Desktop Control

Desktop control is off by default. Enable it in `allium setup`.

For Windows and Linux:

```powershell
pip install pyautogui pillow
```

Allium routes desktop actions through `python/allium_desktop.py`.

For macOS, Allium includes `swift/AlliumDesktop.swift`. macOS may ask for Screen Recording and Accessibility permissions.
