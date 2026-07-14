import React from "react";
import { Box, Text } from "ink";
import { searchCommands } from "../commands.js";

export function CommandMenu({ query }: { query: string }) {
  const results = searchCommands(query).slice(0, 10);

  if (!query.startsWith("/")) {
    return null;
  }

  return (
    <Box borderStyle="round" borderColor="magenta" flexDirection="column" paddingX={1} marginTop={1}>
      <Text color="magentaBright">Commands</Text>
      {results.map((command) => (
        <Text key={command.name}>
          <Text color="cyan">{command.name.padEnd(17)}</Text>
          <Text color="gray">{command.category.padEnd(9)}</Text>
          {command.description}
        </Text>
      ))}
      {results.length === 0 ? <Text color="gray">No matching commands.</Text> : null}
    </Box>
  );
}
