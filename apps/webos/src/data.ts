import {
  Bot,
  CheckSquare,
  Clapperboard,
  FileText,
  Globe,
  Keyboard,
  Music2,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import type { AppDefinition, DevlogEntry, MissionTask } from "./types";

export const missionTasks: MissionTask[] = [
  {
    id: "webos-loads",
    label: "WebOS loads as a web page",
    mission: "WebOS 1",
    done: true,
  },
  {
    id: "custom-theme",
    label: "Custom theme, windows, dock, and OS chrome",
    mission: "WebOS 1",
    done: true,
  },
  {
    id: "apps-work",
    label: "Multiple apps respond to clicks and local state",
    mission: "WebOS 1",
    done: true,
  },
  {
    id: "slack-commands",
    label: "Slack bot has 3 command functions",
    mission: "Slack Bot",
    done: true,
  },
  {
    id: "slack-live",
    label: "Slack bot deployed live 24/7 with real app credentials",
    mission: "Slack Bot",
    done: false,
  },
  {
    id: "hackpad-design",
    label: "Hackpad layout, firmware, BOM, and case notes exist",
    mission: "Hackpad",
    done: true,
  },
  {
    id: "hackpad-pcb",
    label: "Export validated KiCad PCB artifacts",
    mission: "Hackpad",
    done: false,
  },
  {
    id: "webos2-unlocked",
    label: "Unlock WebOS 2 after WebOS 1 approval",
    mission: "WebOS 2",
    done: false,
  },
];

export const devlogEntries: DevlogEntry[] = [
  {
    id: "launch-shell",
    title: "Desktop shell",
    minutes: 45,
    body:
      "Built the first OS surface: taskbar, dock, draggable windows, app registry, and the mission-control checklist.",
  },
  {
    id: "mission-automation",
    title: "Mission automation",
    minutes: 35,
    body:
      "Added a Stardance parser that reads live mission cards and detail pages into JSON plus Markdown checklists.",
  },
  {
    id: "review-pass",
    title: "Review prep",
    minutes: 30,
    body:
      "Added CI, submission notes, Slack command tests, and Hackpad artifacts so reviewers can trace each requirement.",
  },
];

export const appDefinitions: AppDefinition[] = [
  {
    id: "mission-control",
    name: "Mission Control",
    icon: CheckSquare,
    accent: "#b8ff6a",
  },
  {
    id: "devlog",
    name: "Devlog Notes",
    icon: FileText,
    accent: "#ffb86b",
  },
  {
    id: "terminal",
    name: "Stardust Terminal",
    icon: TerminalSquare,
    accent: "#7de7ff",
  },
  {
    id: "browser",
    name: "Mini Browser",
    icon: Globe,
    accent: "#ff6f91",
  },
  {
    id: "soundboard",
    name: "Tiny Tools",
    icon: Music2,
    accent: "#d6b4ff",
  },
  {
    id: "slack",
    name: "Bot Console",
    icon: Bot,
    accent: "#6effb7",
  },
  {
    id: "hackpad",
    name: "Hackpad Kit",
    icon: Keyboard,
    accent: "#ffd86e",
  },
  {
    id: "ship",
    name: "Ship Reel",
    icon: Clapperboard,
    accent: "#ff8a7a",
  },
  {
    id: "stars",
    name: "Stars",
    icon: Sparkles,
    accent: "#f8ff9a",
  },
];
