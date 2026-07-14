import type { AlliumConfig } from "../types.js";
import { getConfiguredKey } from "../config.js";

const musicSkillText: Record<string, string> = {
  "/music-prompt": "Music prompt skill: describe genre, mood, tempo, instruments, length, and intended use.",
  "/music-compose": "Music compose skill: creates a track request for ElevenLabs Music when ELEVENLABS_API_KEY is configured.",
  "/music-remix": "Music remix skill: transforms an existing idea into a new style, tempo, or arrangement.",
  "/music-loop": "Music loop skill: creates seamless looping prompts for games, apps, streams, or videos.",
  "/music-stems": "Music stems skill: plans drums, bass, melody, harmony, vocals, and effects as separate parts.",
  "/music-voice": "Music voice skill: creates a vocal hook, chant, spoken line, or lyrical motif."
};

export function answerMusicSkill(config: AlliumConfig, input: string): string | undefined {
  const command = Object.keys(musicSkillText).find((name) => input.startsWith(name));
  if (!command) {
    return undefined;
  }

  const prompt = input.replace(command, "").trim();
  const hasElevenLabs = Boolean(getConfiguredKey(config, "ELEVENLABS_API_KEY"));
  const keyStatus = hasElevenLabs
    ? "ElevenLabs is connected. A production adapter can send this request to the ElevenLabs music endpoint."
    : "ElevenLabs is not connected yet. Run allium setup, choose ElevenLabs under accounts, and paste your API key.";

  return [
    musicSkillText[command],
    keyStatus,
    prompt ? `Request: ${prompt}` : "Add a description after the command to shape the result."
  ].join("\n");
}
