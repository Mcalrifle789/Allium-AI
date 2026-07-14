import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import type { AlliumConfig, ChatMessage } from "../types.js";
import { saveConfig } from "../config.js";
import { getModelProvider, getSearchProvider } from "../providers/catalog.js";
import { answerUser } from "../agent/alliumAgent.js";
import { createAgent, findAgent } from "../agent/agentRegistry.js";
import { searchCommands } from "../commands.js";
import { AgentPanel } from "./AgentPanel.js";
import { Banner } from "./Banner.js";
import { Bloom } from "./Bloom.js";
import { CommandMenu } from "./CommandMenu.js";
import { ModeToggle } from "./ModeToggle.js";

export function App({ initialConfig }: { initialConfig: AlliumConfig }) {
  const { exit } = useApp();
  const [config, setConfig] = useState(initialConfig);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [showAgentPanel, setShowAgentPanel] = useState(false);

  const modelProvider = useMemo(() => getModelProvider(config.modelProviderId), [config.modelProviderId]);
  const searchProvider = useMemo(() => getSearchProvider(config.searchProviderId), [config.searchProviderId]);

  useEffect(() => {
    if (!busy) {
      return;
    }
    const interval = setInterval(() => setTick((value) => value + 1), 160);
    return () => clearInterval(interval);
  }, [busy]);

  useInput((character, key) => {
    if (key.ctrl && character === "c") {
      exit();
    }

    if (!input.startsWith("/")) {
      return;
    }

    const results = searchCommands(input);
    if (results.length === 0) {
      return;
    }

    if (key.upArrow) {
      setSelectedCommandIndex((value) => Math.max(0, value - 1));
    }
    if (key.downArrow) {
      setSelectedCommandIndex((value) => Math.min(results.length - 1, value + 1));
    }
    if (key.pageUp) {
      setSelectedCommandIndex((value) => Math.max(0, value - 10));
    }
    if (key.pageDown) {
      setSelectedCommandIndex((value) => Math.min(results.length - 1, value + 10));
    }
  });

  async function submit(value: string) {
    const menuResults = value.startsWith("/") ? searchCommands(value) : [];
    const selectedCommand = menuResults[selectedCommandIndex];
    const trimmed = selectedCommand && !menuResults.some((command) => command.name === value.trim())
      ? selectedCommand.name
      : value.trim();
    if (!trimmed || busy) {
      return;
    }

    setInput("");

    if (trimmed === "/quit" || trimmed === "/exit") {
      exit();
      return;
    }

    if (trimmed === "/plan") {
      const next = { ...config, mode: "plan" as const };
      setConfig(next);
      saveConfig(next);
      return;
    }

    if (trimmed === "/build") {
      const next = { ...config, mode: "build" as const };
      setConfig(next);
      saveConfig(next);
      return;
    }

    if (trimmed === "/clear") {
      setMessages([]);
      return;
    }

    if (trimmed === "/agent") {
      setShowAgentPanel((visible) => !visible);
      return;
    }

    if (trimmed.startsWith("/agent ")) {
      const reply = handleAgentCommand(trimmed);
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
      setShowAgentPanel(true);
      return;
    }

    if (trimmed === "/apps") {
      const apps = config.connectedApps.length ? config.connectedApps.join(", ") : "No app MCPs connected yet. Run allium setup.";
      setMessages((current) => [...current, { role: "assistant", content: `Connected apps: ${apps}` }]);
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setBusy(true);

    try {
      const reply = await answerUser(config, messages, trimmed);
      setMessages([...nextHistory, { role: "assistant", content: reply }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setMessages([...nextHistory, { role: "assistant", content: `Error: ${message}` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box flexDirection="column" paddingX={1}>
      <Banner />
      <Text>
        <Text color="white">- Local agent runtime initialized.</Text>
      </Text>
      <Text>
        <Text color="magentaBright">- Model:</Text> {modelProvider?.label ?? config.modelProviderId}/{config.model}
      </Text>
      <Text>
        <Text color="magentaBright">- Search:</Text> {searchProvider?.label ?? config.searchProviderId}
      </Text>
      <Text>
        <Text color="magentaBright">- Tools:</Text> filesystem, web, code, memory, desktop, apps
      </Text>
      <Text>
        <Text color="magentaBright">- Agent:</Text> {config.activeAgentId} | running {config.runningAgentIds.length}
      </Text>
      <Text>
        <Text color="magentaBright">- Desktop:</Text> {config.desktopControl.enabled ? "enabled" : "disabled"}
      </Text>

      <Box marginTop={1}>
        <ModeToggle mode={config.mode} />
      </Box>

      <Box flexDirection="column" marginTop={1}>
        {messages.slice(-8).map((message, index) => (
          <Box key={`${message.role}-${index}`} flexDirection="column" marginBottom={1}>
            <Text color={message.role === "user" ? "yellowBright" : "magentaBright"}>
              {message.role === "user" ? "you" : "allium"}
            </Text>
            <Text>{message.content}</Text>
          </Box>
        ))}
      </Box>

      <Text color="gray">local ready | {busy ? "thinking" : "idle"} | agent {config.activeAgentId} | tokens ?</Text>
      <Box borderStyle="round" borderColor={config.mode === "plan" ? "green" : "blue"} paddingX={1} marginTop={1}>
        <Text color="magentaBright">{">> "}</Text>
        <TextInput
          value={input}
          onChange={(next) => {
            setInput(next);
            setSelectedCommandIndex(0);
          }}
          onSubmit={submit}
          placeholder="Ask anything..."
        />
        <Box marginLeft={1}>
          <Bloom active={busy} tick={tick} />
        </Box>
      </Box>
      <CommandMenu query={input} selectedIndex={selectedCommandIndex} />
      {showAgentPanel ? (
        <AgentPanel
          agents={config.agents}
          activeAgentId={config.activeAgentId}
          runningAgentIds={config.runningAgentIds}
        />
      ) : null}
      <Box justifyContent="space-between" marginTop={1}>
        <Text color="gray">Model: <Text color="magentaBright">{config.model}</Text></Text>
        <Text color="magentaBright">0/1M tokens</Text>
      </Box>
    </Box>
  );

  function handleAgentCommand(command: string): string {
    const [, , action, ...rest] = command.split(" ");
    const name = rest.join(" ").trim();

    if (!action || !name) {
      return "Use /agent switch NAME, /agent run NAME, or /agent create NAME.";
    }

    if (action === "create") {
      const agent = createAgent(name);
      if (config.agents.some((candidate) => candidate.id === agent.id)) {
        return `Agent already exists: ${agent.name}`;
      }

      const next = {
        ...config,
        agents: [...config.agents, agent],
        activeAgentId: agent.id,
        runningAgentIds: Array.from(new Set([...config.runningAgentIds, agent.id]))
      };
      setConfig(next);
      saveConfig(next);
      return `Created and switched to agent: ${agent.name}`;
    }

    const agent = findAgent(config.agents, name);
    if (!agent) {
      return `No agent found named "${name}". Create it with /agent create ${name}.`;
    }

    if (action === "switch") {
      const next = { ...config, activeAgentId: agent.id };
      setConfig(next);
      saveConfig(next);
      return `Switched to agent: ${agent.name}`;
    }

    if (action === "run") {
      const next = {
        ...config,
        runningAgentIds: Array.from(new Set([...config.runningAgentIds, agent.id]))
      };
      setConfig(next);
      saveConfig(next);
      return `Running agent alongside the current session: ${agent.name}`;
    }

    if (action === "stop") {
      const next = {
        ...config,
        runningAgentIds: config.runningAgentIds.filter((id) => id !== agent.id)
      };
      setConfig(next);
      saveConfig(next);
      return `Stopped agent: ${agent.name}`;
    }

    return "Use /agent switch NAME, /agent run NAME, /agent stop NAME, or /agent create NAME.";
  }
}
