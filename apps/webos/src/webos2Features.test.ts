import { describe, expect, it } from "vitest";
import {
  buildSubmissionSnapshot,
  createThemeStyle,
  searchApps,
  webOs2FeatureChecklist,
} from "./webos2Features";

describe("webos2 feature helpers", () => {
  it("filters launcher apps by name and keyword without reordering empty searches", () => {
    const apps = [
      { id: "theme", name: "Theme Studio", keywords: ["customize", "colors"] },
      { id: "ship", name: "Ship Reel", keywords: ["submit", "evidence"] },
      { id: "terminal", name: "Stardust Terminal", keywords: ["commands"] },
    ];

    expect(searchApps(apps, "")).toEqual(apps);
    expect(searchApps(apps, "color")).toEqual([apps[0]]);
    expect(searchApps(apps, "evidence")).toEqual([apps[1]]);
    expect(searchApps(apps, "missing")).toEqual([]);
  });

  it("creates bounded CSS variables for a customized theme", () => {
    expect(
      createThemeStyle({
        accent: "#ff6f91",
        glass: 120,
        motion: false,
        presetId: "aurora",
        starDensity: -20,
      }),
    ).toEqual(
      expect.objectContaining({
        "--theme-accent": "#ff6f91",
        "--theme-glass": "0.96",
        "--theme-motion": "0ms",
        "--theme-stars": "0.18",
        "--theme-wallpaper": "linear-gradient(145deg, #061016 0%, #0e3440 48%, #111827 100%)",
      }),
    );
  });

  it("builds a reviewer-ready WebOS 2 snapshot with three new features", () => {
    const snapshot = buildSubmissionSnapshot({
      openApps: ["Theme Studio", "Launchpad", "Submission Capsule"],
      readyCount: 10,
      themeName: "Aurora Terminal",
      totalTasks: 11,
    });

    expect(webOs2FeatureChecklist).toHaveLength(3);
    expect(snapshot).toContain("WebOS 2 snapshot: 10/11 mission checks ready.");
    expect(snapshot).toContain("Active theme: Aurora Terminal.");
    expect(snapshot).toContain("Open apps: Theme Studio, Launchpad, Submission Capsule.");
    expect(snapshot).toContain("New feature 1: Theme Studio - live custom colors, glass, stars, and motion controls.");
    expect(snapshot).toContain("New feature 2: Launchpad - searchable app launcher with keyword routing.");
    expect(snapshot).toContain("New feature 3: Submission Capsule - reviewer-facing export of mission evidence.");
  });
});
