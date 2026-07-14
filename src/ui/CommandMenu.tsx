import React from "react";
import { Box, Text } from "ink";
import { searchCommands } from "../commands.js";

export function CommandMenu({ query, selectedIndex }: { query: string; selectedIndex: number }) {
  const results = searchCommands(query);
  const windowSize = 10;
  const start = Math.max(0, Math.min(selectedIndex - 4, Math.max(0, results.length - windowSize)));
  const visibleResults = results.slice(start, start + windowSize);

  if (!query.startsWith("/")) {
    return null;
  }

  return (
    <Box borderStyle="round" borderColor="magenta" flexDirection="column" paddingX={1} marginTop={1}>
      <Text color="magentaBright">Commands <Text color="gray">{results.length ? `${selectedIndex + 1}/${results.length}` : "0/0"}</Text></Text>
      {visibleResults.map((command, index) => {
        const absoluteIndex = start + index;
        const selected = absoluteIndex === selectedIndex;
        return (
        <Text key={command.name} color={selected ? "white" : undefined} backgroundColor={selected ? "magenta" : undefined}>
          <Text color={selected ? "white" : "cyan"}>{command.name.padEnd(17)}</Text>
          <Text color={selected ? "white" : "gray"}>{command.category.padEnd(9)}</Text>
          {command.description}
        </Text>
        );
      })}
      {results.length === 0 ? <Text color="gray">No matching commands.</Text> : null}
      {results.length > windowSize ? <Text color="gray">Use Up/Down or PageUp/PageDown to scroll.</Text> : null}
    </Box>
  );
}
