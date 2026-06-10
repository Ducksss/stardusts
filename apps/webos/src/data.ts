import {
  Bot,
  CheckSquare,
  ClipboardList,
  Clapperboard,
  FileText,
  Globe,
  Keyboard,
  Music2,
  Palette,
  Search,
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
  {
    id: "webos2-theme-studio",
    label: "Theme Studio changes colors, glass, stars, and motion live",
    mission: "WebOS 2",
    done: true,
  },
  {
    id: "webos2-launchpad",
    label: "Launchpad searches apps and opens matching windows",
    mission: "WebOS 2",
    done: true,
  },
  {
    id: "webos2-capsule",
    label: "Submission Capsule exports reviewer-ready evidence",
    mission: "WebOS 2",
    done: true,
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
    keywords: ["tasks", "checklist", "missions", "ready"],
  },
  {
    id: "devlog",
    name: "Devlog Notes",
    icon: FileText,
    accent: "#ffb86b",
    keywords: ["notes", "journal", "time", "progress"],
  },
  {
    id: "terminal",
    name: "Stardust Terminal",
    icon: TerminalSquare,
    accent: "#7de7ff",
    keywords: ["commands", "shell", "open", "cli"],
  },
  {
    id: "launchpad",
    name: "Launchpad",
    icon: Search,
    accent: "#7de7ff",
    keywords: ["search", "apps", "launcher", "find"],
  },
  {
    id: "theme-studio",
    name: "Theme Studio",
    icon: Palette,
    accent: "#ff6f91",
    keywords: ["customize", "theme", "colors", "wallpaper", "motion"],
  },
  {
    id: "submission-capsule",
    name: "Submission Capsule",
    icon: ClipboardList,
    accent: "#6effb7",
    keywords: ["submit", "evidence", "review", "export", "webos2"],
  },
  {
    id: "browser",
    name: "Mini Browser",
    icon: Globe,
    accent: "#ff6f91",
    keywords: ["missions", "stardance", "web", "portal"],
  },
  {
    id: "soundboard",
    name: "Tiny Tools",
    icon: Music2,
    accent: "#d6b4ff",
    keywords: ["focus", "ship", "pads", "tools"],
  },
  {
    id: "slack",
    name: "Bot Console",
    icon: Bot,
    accent: "#6effb7",
    keywords: ["bot", "slack", "commands"],
  },
  {
    id: "hackpad",
    name: "Hackpad Kit",
    icon: Keyboard,
    accent: "#ffd86e",
    keywords: ["keyboard", "qmk", "pcb", "hardware"],
  },
  {
    id: "ship",
    name: "Ship Reel",
    icon: Clapperboard,
    accent: "#ff8a7a",
    keywords: ["deploy", "review", "evidence", "demo"],
  },
  {
    id: "stars",
    name: "Stars",
    icon: Sparkles,
    accent: "#f8ff9a",
    keywords: ["stardust", "score", "account"],
  },
];
