import { describe, expect, it } from "vitest";
import { bringToFront, closeWindow, constrainWindow, defaultWindows, moveWindow } from "./windowManager";

describe("window manager", () => {
  it("opens and raises a window", () => {
    const windows = bringToFront(defaultWindows, "hackpad");
    const hackpad = windows.find((windowState) => windowState.id === "hackpad");
    expect(hackpad?.open).toBe(true);
    expect(hackpad?.z).toBeGreaterThan(Math.max(...defaultWindows.map((windowState) => windowState.z)));
  });

  it("closes without mutating unrelated windows", () => {
    const windows = closeWindow(defaultWindows, "browser");
    expect(windows.find((windowState) => windowState.id === "browser")?.open).toBe(false);
    expect(windows.find((windowState) => windowState.id === "terminal")?.open).toBe(true);
  });

  it("moves and constrains window positions to the viewport", () => {
    const moved = moveWindow(defaultWindows, "terminal", { x: 9999, y: -100 });
    const terminal = moved.find((windowState) => windowState.id === "terminal");
    expect(terminal).toMatchObject({ x: 9999, y: -100 });
    expect(constrainWindow(terminal!, 1200, 800)).toEqual({ x: 728, y: 58 });
  });
});
