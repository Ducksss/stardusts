import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { MissionCatalog, MissionDetail, ScaffoldOptions } from "./types.js";

function checkboxLines(items: string[]): string {
  if (items.length === 0) return "- [ ] Add mission-specific evidence.\n";
  return items.map((item) => `- [ ] ${item}`).join("\n");
}

export function renderMissionMarkdown(mission: MissionDetail): string {
  const guideLinks =
    mission.guideUrls.length > 0
      ? mission.guideUrls.map((url) => `- ${url}`).join("\n")
      : "- No guide link found in current page markup.";

  const prizes =
    mission.prizes.length > 0
      ? mission.prizes.map((prize) => `- ${prize}`).join("\n")
      : "- No static prize details found.";

  return `# ${mission.title}

Source: ${mission.url}

Difficulty: ${mission.difficulty}
Status: ${mission.status ?? "Unknown"}
Estimated time: ${mission.estimatedTime ?? "Unknown"}
Sections: ${mission.sectionCount ?? "Unknown"}
Locked: ${mission.locked ? "yes" : "no"}

## Description

${mission.description}

## Submission Requirements

${checkboxLines(mission.requirements)}

## Guide Links

${guideLinks}

## Prizes

${prizes}

## Evidence To Collect

- [ ] Repository URL
- [ ] Live demo URL or deployment log
- [ ] Screenshots or short screen recording
- [ ] Devlog notes
- [ ] Reviewer notes explaining how each requirement is satisfied
`;
}

export function renderCatalogMarkdown(catalog: MissionCatalog): string {
  const rows = catalog.missions
    .map(
      (mission) =>
        `| [${mission.title}](${mission.url}) | ${mission.difficulty} | ${
          mission.locked ? "Locked" : "Available"
        } | ${mission.requirements.length} |`,
    )
    .join("\n");

  return `# Stardance Mission Catalog

Fetched: ${catalog.fetchedAt}
Source: ${catalog.source}

| Mission | Difficulty | State | Requirement count |
| --- | --- | --- | ---: |
${rows}
`;
}

export async function scaffoldMission(options: ScaffoldOptions): Promise<string> {
  const mission = options.catalog.missions.find((item) => item.slug === options.missionSlug);
  if (!mission) {
    throw new Error(`Mission not found in catalog: ${options.missionSlug}`);
  }

  const missionDir = join(options.outDir, mission.slug);
  await mkdir(missionDir, { recursive: true });
  await writeFile(join(missionDir, "README.md"), renderMissionMarkdown(mission), "utf8");
  await writeFile(
    join(missionDir, "submission-checklist.md"),
    `# ${mission.title} Submission Checklist\n\n${checkboxLines(mission.requirements)}\n`,
    "utf8",
  );
  return missionDir;
}
