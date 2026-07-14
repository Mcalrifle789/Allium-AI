import React from "react";
import { Box, Text } from "ink";
import type { Mode } from "../types.js";

export function ModeToggle({ mode }: { mode: Mode }) {
  return (
    <Box gap={1}>
      <Text backgroundColor={mode === "plan" ? "green" : undefined} color={mode === "plan" ? "black" : "green"}>
        {" PLAN "}
      </Text>
      <Text backgroundColor={mode === "build" ? "blue" : undefined} color={mode === "build" ? "white" : "blue"}>
        {" BUILD "}
      </Text>
    </Box>
  );
}
