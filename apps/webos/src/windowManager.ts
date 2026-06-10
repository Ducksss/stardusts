import type { AppId, WindowState } from "./types";

export const defaultWindows: WindowState[] = [
  { id: "mission-control", x: 60, y: 40, width: 412, height: 430, open: true, z: 4 },
  { id: "terminal", x: 520, y: 40, width: 460, height: 300, open: true, z: 6 },
  { id: "launchpad", x: 398, y: 318, width: 370, height: 300, open: true, z: 3 },
  { id: "theme-studio", x: 790, y: 58, width: 360, height: 390, open: true, z: 5 },
  { id: "submission-capsule", x: 770, y: 366, width: 390, height: 250, open: true, z: 2 },
  { id: "browser", x: 780, y: 60, width: 360, height: 410, open: false, z: 0 },
  { id: "devlog", x: 380, y: 340, width: 500, height: 250, open: false, z: 0 },
  { id: "soundboard", x: 760, y: 440, width: 378, height: 190, open: false, z: 0 },
  { id: "slack", x: 180, y: 330, width: 360, height: 210, open: false, z: 0 },
  { id: "hackpad", x: 660, y: 260, width: 390, height: 280, open: false, z: 0 },
  { id: "ship", x: 760, y: 330, width: 372, height: 230, open: false, z: 0 },
  { id: "stars", x: 1040, y: 270, width: 260, height: 220, open: false, z: 0 },
];

export function bringToFront(windows: WindowState[], id: AppId): WindowState[] {
  const nextZ = Math.max(...windows.map((windowState) => windowState.z), 0) + 1;
  return windows.map((windowState) =>
    windowState.id === id ? { ...windowState, z: nextZ, open: true } : windowState,
  );
}

export function closeWindow(windows: WindowState[], id: AppId): WindowState[] {
  return windows.map((windowState) =>
    windowState.id === id ? { ...windowState, open: false } : windowState,
  );
}

export function moveWindow(
  windows: WindowState[],
  id: AppId,
  position: Pick<WindowState, "x" | "y">,
): WindowState[] {
  return windows.map((windowState) =>
    windowState.id === id ? { ...windowState, ...position } : windowState,
  );
}

export function constrainWindow(
  windowState: WindowState,
  viewportWidth: number,
  viewportHeight: number,
): Pick<WindowState, "x" | "y"> {
  const maxX = Math.max(12, viewportWidth - Math.min(windowState.width, viewportWidth - 24) - 12);
  const maxY = Math.max(58, viewportHeight - Math.min(windowState.height, viewportHeight - 88) - 54);
  return {
    x: Math.min(Math.max(12, windowState.x), maxX),
    y: Math.min(Math.max(58, windowState.y), maxY),
  };
}
