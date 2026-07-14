import React from "react";
import { Box, Text } from "ink";

const banner = [
  " █████╗ ██╗     ██╗     ██╗██╗   ██╗███╗   ███╗      █████╗ ██╗",
  "██╔══██╗██║     ██║     ██║██║   ██║████╗ ████║     ██╔══██╗██║",
  "███████║██║     ██║     ██║██║   ██║██╔████╔██║     ███████║██║",
  "██╔══██║██║     ██║     ██║██║   ██║██║╚██╔╝██║     ██╔══██║██║",
  "██║  ██║███████╗███████╗██║╚██████╔╝██║ ╚═╝ ██║     ██║  ██║██║",
  "╚═╝  ╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝     ╚═╝     ╚═╝  ╚═╝╚═╝"
];

const gradientStart = "#ff2bd6";
const gradientEnd = "#ffe0bd";

function gradientColor(index: number, max: number): string {
  const start = { r: 255, g: 43, b: 214 };
  const end = { r: 255, g: 224, b: 189 };
  const ratio = max <= 0 ? 0 : index / max;
  const r = Math.round(start.r + (end.r - start.r) * ratio);
  const g = Math.round(start.g + (end.g - start.g) * ratio);
  const b = Math.round(start.b + (end.b - start.b) * ratio);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0");
}

function GradientLine({ line }: { line: string }) {
  const characters = Array.from(line);
  const max = Math.max(1, characters.length - 1);

  return (
    <Text bold>
      {characters.map((character, index) => (
        <Text key={`${character}-${index}`} color={character === " " ? gradientStart : gradientColor(index, max)}>
          {character}
        </Text>
      ))}
    </Text>
  );
}

export function Banner() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="magentaBright">allium neoxian <Text color="white">- local agent runtime -</Text> <Text color="yellow">Allium AI</Text> <Text color="white">- session main</Text></Text>
      <Text color="blueBright">  session agent:allium:main</Text>
      <Box flexDirection="column" marginTop={1}>
        {banner.map((line) => (
          <GradientLine key={line} line={line} />
        ))}
      </Box>
      <Text color="magentaBright">Hi, I'm Allium.</Text>
    </Box>
  );
}
