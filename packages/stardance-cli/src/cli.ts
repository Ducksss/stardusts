#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fetchMissionCatalog, writeCatalog } from "./fetch.js";
import { renderCatalogMarkdown, scaffoldMission } from "./render.js";
import type { MissionCatalog } from "./types.js";

type ParsedArgs = {
  command: string;
  flags: Record<string, string | boolean>;
  positional: string[];
};

function parseArgs(argv: string[]): ParsedArgs {
  const [command = "help", ...rest] = argv;
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const item = rest[index];
    if (!item) continue;
    if (!item.startsWith("--")) {
      positional.push(item);
      continue;
    }

    const key = item.slice(2);
    const next = rest[index + 1];
    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }

    flags[key] = next;
    index += 1;
  }

  return { command, flags, positional };
}

function usage(): string {
  return `stardusts

Commands:
  sync --write <path>      Fetch Stardance missions and write JSON
  summary --file <path>    Render a Markdown summary from catalog JSON
  scaffold <slug> --file <catalog> --out <dir>
                           Create a mission checklist folder
`;
}

function flagString(flags: Record<string, string | boolean>, name: string): string | undefined {
  const value = flags[name];
  return typeof value === "string" ? value : undefined;
}

async function readCatalog(path: string): Promise<MissionCatalog> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as MissionCatalog;
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const args = parseArgs(argv);

  switch (args.command) {
    case "sync": {
      const catalog = await fetchMissionCatalog();
      const writePath = flagString(args.flags, "write");
      if (writePath) {
        const absolutePath = await writeCatalog(catalog, writePath);
        console.log(`Wrote ${catalog.missions.length} missions to ${absolutePath}`);
      } else {
        console.log(JSON.stringify(catalog, null, 2));
      }
      return;
    }

    case "summary": {
      const file = flagString(args.flags, "file");
      if (!file) throw new Error("summary requires --file <path>");
      console.log(renderCatalogMarkdown(await readCatalog(file)));
      return;
    }

    case "scaffold": {
      const [slug] = args.positional;
      const file = flagString(args.flags, "file");
      const out = flagString(args.flags, "out") ?? "missions/workspaces";
      if (!slug) throw new Error("scaffold requires a mission slug");
      if (!file) throw new Error("scaffold requires --file <catalog>");
      const missionDir = await scaffoldMission({
        catalog: await readCatalog(file),
        missionSlug: slug,
        outDir: out,
      });
      console.log(`Created ${missionDir}`);
      return;
    }

    case "help":
    default:
      console.log(usage());
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
