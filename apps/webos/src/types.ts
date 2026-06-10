import type { LucideIcon } from "lucide-react";

export type AppId =
  | "mission-control"
  | "devlog"
  | "terminal"
  | "launchpad"
  | "theme-studio"
  | "submission-capsule"
  | "browser"
  | "soundboard"
  | "slack"
  | "hackpad"
  | "ship"
  | "stars";

export type AppDefinition = {
  id: AppId;
  keywords: string[];
  name: string;
  icon: LucideIcon;
  accent: string;
};

export type WindowState = {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  open: boolean;
  z: number;
};

export type MissionTask = {
  id: string;
  label: string;
  mission: "WebOS 1" | "Slack Bot" | "Hackpad" | "WebOS 2";
  done: boolean;
};

export type DevlogEntry = {
  id: string;
  title: string;
  minutes: number;
  body: string;
};

export type TerminalLine = {
  id: string;
  kind: "input" | "output" | "system";
  text: string;
};
