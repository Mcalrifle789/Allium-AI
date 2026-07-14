import React from "react";
import { Box, Text } from "ink";

const banner = [
  "    A     l l i u m      A I",
  "   / \\    | | | | |     / \\ |",
  "  /___\\   | | | | |    /___\\|",
  " /     \\  | | | | |   /     |"
];

export function Banner() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="magentaBright">allium neoxian <Text color="white">- local agent runtime -</Text> <Text color="yellow">Allium AI</Text> <Text color="white">- session main</Text></Text>
      <Text color="blueBright">  session agent:allium:main</Text>
      <Box flexDirection="column" marginTop={1}>
        {banner.map((line, index) => (
          <Text key={line} color={index < 2 ? "magentaBright" : "yellowBright"} bold>{line}</Text>
        ))}
      </Box>
      <Text color="magentaBright">Hi, I'm Allium.</Text>
    </Box>
  );
}
