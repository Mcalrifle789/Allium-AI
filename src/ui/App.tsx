import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import type { AlliumConfig, ChatMessage } from "../types.js";
import { saveConfig } from "../config.js";
import { getModelProvider, getSearchProvider } from "../providers/catalog.js";
import { answerUser } from "../agent/alliumAgent.js";
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
  });

  async function submit(value: string) {
    const trimmed = value.trim();
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
        <Text color="magentaBright">- Tools:</Text> filesystem, web, code, memory, desktop
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

      <Text color="gray">local ready | {busy ? "thinking" : "idle"} | agent allium | tokens ?</Text>
      <Box borderStyle="round" borderColor={config.mode === "plan" ? "green" : "blue"} paddingX={1} marginTop={1}>
        <Text color="magentaBright">{">> "}</Text>
        <TextInput value={input} onChange={setInput} onSubmit={submit} placeholder="Ask anything..." />
        <Box marginLeft={1}>
          <Bloom active={busy} tick={tick} />
        </Box>
      </Box>
      <CommandMenu query={input} />
      <Box justifyContent="space-between" marginTop={1}>
        <Text color="gray">Model: <Text color="magentaBright">{config.model}</Text></Text>
        <Text color="magentaBright">0/1M tokens</Text>
      </Box>
    </Box>
  );
}
