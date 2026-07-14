import React from "react";
import { Text } from "ink";

const frames = ["  .  ", " .:. ", ".:*:.", "<:*:>", "<:✽:>"];

export function Bloom({ active, tick }: { active: boolean; tick: number }) {
  if (!active) {
    return <Text color="gray">idle</Text>;
  }

  return <Text color="magentaBright">{frames[tick % frames.length]}</Text>;
}
