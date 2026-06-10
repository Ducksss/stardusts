import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseMissionDetail, parseMissionIndex } from "../src/parser.js";
import { renderMissionMarkdown } from "../src/render.js";

const here = dirname(fileURLToPath(import.meta.url));

async function fixture(name: string): Promise<string> {
  return readFile(join(here, "fixtures", name), "utf8");
}

describe("Stardance mission parser", () => {
  it("extracts mission cards from the index", async () => {
    const missions = parseMissionIndex(await fixture("missions-index.html"));

    expect(missions).toEqual([
      expect.objectContaining({
        slug: "hackpad",
        title: "Hackpad",
        difficulty: "Beginner",
        guideLabel: "10-step guide",
        locked: false,
      }),
      expect.objectContaining({
        slug: "web-os-2",
        title: "WebOS 2",
        difficulty: "Intermediate",
        locked: true,
      }),
    ]);
  });

  it("extracts detail metadata and review requirements", async () => {
    const detail = parseMissionDetail(
      await fixture("slack-bot-detail.html"),
      "https://stardance.hackclub.com/missions/slack-bot",
    );

    expect(detail).toMatchObject({
      slug: "slack-bot",
      title: "Make a Slack Bot",
      difficulty: "Beginner",
      status: "not started",
      estimatedTime: "~1 hr 30 min",
      sectionCount: 8,
      requirements: [
        "Your bot is live and responds to messages",
        "There are at least 3 different commands / functions",
      ],
    });
  });

  it("renders mission checklists for project folders", async () => {
    const detail = parseMissionDetail(
      await fixture("slack-bot-detail.html"),
      "https://stardance.hackclub.com/missions/slack-bot",
    );

    expect(renderMissionMarkdown(detail)).toContain("- [ ] Your bot is live and responds to messages");
    expect(renderMissionMarkdown(detail)).toContain("https://stardance.hackclub.com/missions/slack-bot/guide");
  });
});
