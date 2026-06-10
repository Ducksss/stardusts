export type ThemePresetId = "nebula" | "aurora" | "sunrise";

export type ThemeSettings = {
  accent: string;
  glass: number;
  motion: boolean;
  presetId: ThemePresetId;
  starDensity: number;
};

export type ThemePreset = {
  accent: string;
  id: ThemePresetId;
  name: string;
  secondary: string;
  surface: string;
  wallpaper: string;
};

export type SearchableApp = {
  id: string;
  keywords?: string[];
  name: string;
};

export type SubmissionSnapshotInput = {
  openApps: string[];
  readyCount: number;
  themeName: string;
  totalTasks: number;
};

export const themePresets: ThemePreset[] = [
  {
    accent: "#b8ff6a",
    id: "nebula",
    name: "Nebula Lime",
    secondary: "#7de7ff",
    surface: "rgba(244, 248, 255, 0.94)",
    wallpaper: "linear-gradient(145deg, #070a18 0%, #10193a 46%, #0b1026 100%)",
  },
  {
    accent: "#6effb7",
    id: "aurora",
    name: "Aurora Terminal",
    secondary: "#7de7ff",
    surface: "rgba(239, 255, 250, 0.94)",
    wallpaper: "linear-gradient(145deg, #061016 0%, #0e3440 48%, #111827 100%)",
  },
  {
    accent: "#ffb86b",
    id: "sunrise",
    name: "Sunrise Relay",
    secondary: "#ff6f91",
    surface: "rgba(255, 248, 239, 0.95)",
    wallpaper: "linear-gradient(145deg, #170b16 0%, #3a1732 46%, #1a1730 100%)",
  },
];

export const defaultThemeSettings: ThemeSettings = {
  accent: themePresets[0]!.accent,
  glass: 72,
  motion: true,
  presetId: "nebula",
  starDensity: 58,
};

export const webOs2FeatureChecklist = [
  {
    id: "theme-studio",
    summary: "live custom colors, glass, stars, and motion controls",
    title: "Theme Studio",
  },
  {
    id: "launchpad",
    summary: "searchable app launcher with keyword routing",
    title: "Launchpad",
  },
  {
    id: "submission-capsule",
    summary: "reviewer-facing export of mission evidence",
    title: "Submission Capsule",
  },
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getThemePreset(id: ThemePresetId): ThemePreset {
  return themePresets.find((preset) => preset.id === id) ?? themePresets[0]!;
}

export function createThemeStyle(settings: ThemeSettings): Record<string, string> {
  const preset = getThemePreset(settings.presetId);
  const glass = clamp(settings.glass, 18, 96);
  const stars = clamp(settings.starDensity, 18, 100);

  return {
    "--theme-accent": settings.accent || preset.accent,
    "--theme-glass": (glass / 100).toFixed(2),
    "--theme-motion": settings.motion ? "180ms" : "0ms",
    "--theme-secondary": preset.secondary,
    "--theme-stars": (stars / 100).toFixed(2),
    "--theme-surface": preset.surface,
    "--theme-wallpaper": preset.wallpaper,
  };
}

export function searchApps<TApp extends SearchableApp>(apps: TApp[], query: string): TApp[] {
  const term = query.trim().toLowerCase();
  if (!term) return apps;

  return apps.filter((app) => {
    const haystack = [app.name, ...(app.keywords ?? [])].join(" ").toLowerCase();
    return haystack.includes(term);
  });
}

export function buildSubmissionSnapshot(input: SubmissionSnapshotInput): string[] {
  return [
    `WebOS 2 snapshot: ${input.readyCount}/${input.totalTasks} mission checks ready.`,
    `Active theme: ${input.themeName}.`,
    `Open apps: ${input.openApps.length > 0 ? input.openApps.join(", ") : "none"}.`,
    ...webOs2FeatureChecklist.map(
      (feature, index) => `New feature ${index + 1}: ${feature.title} - ${feature.summary}.`,
    ),
  ];
}
