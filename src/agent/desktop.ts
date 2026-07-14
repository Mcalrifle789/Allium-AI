import { spawn } from "node:child_process";
import { platform } from "node:os";

export type DesktopAction =
  | { type: "screenshot"; output?: string }
  | { type: "type"; text: string }
  | { type: "hotkey"; keys: string[] }
  | { type: "click"; x: number; y: number };

export async function runDesktopAction(action: DesktopAction): Promise<string> {
  const os = platform();
  if (os === "win32") {
    return runPythonBridge(action);
  }

  if (os === "darwin") {
    return runSwiftBridge(action);
  }

  return runPythonBridge(action);
}

function runPythonBridge(action: DesktopAction): Promise<string> {
  return run("python", ["python/allium_desktop.py", JSON.stringify(action)]);
}

function runSwiftBridge(action: DesktopAction): Promise<string> {
  return run("swift", ["swift/AlliumDesktop.swift", JSON.stringify(action)]);
}

function run(command: string, args: string[]): Promise<string> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { shell: true });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim() || "Desktop action completed.");
      } else {
        resolve(stderr.trim() || "Desktop bridge failed.");
      }
    });
  });
}
