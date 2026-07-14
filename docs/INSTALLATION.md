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
- Model name
- Search provider
- API keys when the provider requires one
- Third-party CLI accounts such as Claude/Anthropic CLI, Gemini CLI, OpenAI CLI, and OpenCode
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

Type `/` in the chat box to open the command and skill list. Use `/plan` for planning mode and `/build` for build mode.

## Desktop Control

Desktop control is off by default. Enable it in `allium setup`.

For Windows and Linux:

```powershell
pip install pyautogui pillow
```

Allium routes desktop actions through `python/allium_desktop.py`.

For macOS, Allium includes `swift/AlliumDesktop.swift`. macOS may ask for Screen Recording and Accessibility permissions.
