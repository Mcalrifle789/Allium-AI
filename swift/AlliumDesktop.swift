#!/usr/bin/env swift
import Foundation
import AppKit

struct DesktopAction: Decodable {
    let type: String
    let text: String?
    let keys: [String]?
    let x: Double?
    let y: Double?
}

func fail(_ message: String) -> Never {
    FileHandle.standardError.write(Data((message + "\n").utf8))
    exit(2)
}

guard CommandLine.arguments.count > 1 else {
    fail("Expected a JSON desktop action.")
}

let data = Data(CommandLine.arguments[1].utf8)
let action = try JSONDecoder().decode(DesktopAction.self, from: data)

switch action.type {
case "screenshot":
    let display = CGMainDisplayID()
    guard let image = CGDisplayCreateImage(display) else {
        fail("Could not capture display.")
    }
    let bitmap = NSBitmapImageRep(cgImage: image)
    let png = bitmap.representation(using: .png, properties: [:])!
    let url = URL(fileURLWithPath: "allium-screenshot.png")
    try png.write(to: url)
    print("Saved screenshot: \(url.path)")
case "type":
    let script = "tell application \"System Events\" to keystroke \"\(action.text ?? "")\""
    var error: NSDictionary?
    NSAppleScript(source: script)?.executeAndReturnError(&error)
    if let error {
        fail("AppleScript failed: \(error)")
    }
    print("Typed text.")
default:
    fail("Unsupported macOS desktop action: \(action.type)")
}
