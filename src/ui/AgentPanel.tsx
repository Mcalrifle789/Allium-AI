import React from "react";
import { Box, Text } from "ink";
import type { AlliumAgent } from "../types.js";

export function AgentPanel({
  agents,
  activeAgentId,
  runningAgentIds
}: {
  agents: AlliumAgent[];
  activeAgentId: string;
  runningAgentIds: string[];
}) {
  return (
    <Box borderStyle="round" borderColor="cyan" flexDirection="column" paddingX={1} marginTop={1}>
      <Text color="cyanBright">Agents</Text>
      {agents.map((agent) => {
        const active = agent.id === activeAgentId;
        const running = runningAgentIds.includes(agent.id);
        return (
          <Text key={agent.id} color={active ? "white" : undefined} backgroundColor={active ? "blue" : undefined}>
            {active ? ">" : " "} {agent.name.padEnd(18)} {running ? "running" : "idle"} - {agent.description}
          </Text>
        );
      })}
      <Text color="gray">Use /agent switch NAME, /agent run NAME, or /agent create NAME.</Text>
    </Box>
  );
}
