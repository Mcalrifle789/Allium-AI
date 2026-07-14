#!/usr/bin/env python3
"""Allium desktop bridge.

This file is intentionally small and conservative. It supports screenshots,
typing, hotkeys, and clicks through pyautogui when installed. Allium's
TypeScript layer is responsible for user confirmation before calling it.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


def require_pyautogui():
    try:
        import pyautogui  # type: ignore
    except Exception as exc:  # pragma: no cover - environment dependent
        raise SystemExit(
            "pyautogui is required for desktop control. Install with: pip install pyautogui pillow"
        ) from exc
    return pyautogui


def main() -> int:
    if len(sys.argv) < 2:
        print("Expected a JSON desktop action.", file=sys.stderr)
        return 2

    action = json.loads(sys.argv[1])
    pyautogui = require_pyautogui()
    action_type = action.get("type")

    if action_type == "screenshot":
        output = Path(action.get("output") or "allium-screenshot.png").resolve()
        image = pyautogui.screenshot()
        image.save(output)
        print(f"Saved screenshot: {output}")
        return 0

    if action_type == "type":
        pyautogui.write(str(action.get("text", "")), interval=0.01)
        print("Typed text.")
        return 0

    if action_type == "hotkey":
        keys = action.get("keys") or []
        pyautogui.hotkey(*keys)
        print(f"Sent hotkey: {'+'.join(keys)}")
        return 0

    if action_type == "click":
        pyautogui.click(int(action["x"]), int(action["y"]))
        print(f"Clicked {action['x']},{action['y']}.")
        return 0

    print(f"Unsupported desktop action: {action_type}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
