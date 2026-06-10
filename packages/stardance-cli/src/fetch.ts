import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parseMissionDetail, parseMissionIndex } from "./parser.js";
import type { MissionCatalog } from "./types.js";

export type FetchLike = (url: string) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

const DEFAULT_BASE = "https://stardance.hackclub.com/missions";

export async function fetchMissionCatalog(
  fetchImpl: FetchLike = fetch,
  source = DEFAULT_BASE,
): Promise<MissionCatalog> {
  const indexResponse = await fetchImpl(source);
  if (!indexResponse.ok) {
    throw new Error(`Failed to fetch mission index: ${indexResponse.status}`);
  }

  const indexHtml = await indexResponse.text();
  const summaries = parseMissionIndex(indexHtml, source);

  const missions = await Promise.all(
    summaries.map(async (summary) => {
      const detailResponse = await fetchImpl(summary.url);
      if (!detailResponse.ok) {
        throw new Error(`Failed to fetch ${summary.url}: ${detailResponse.status}`);
      }

      const detailHtml = await detailResponse.text();
      return parseMissionDetail(detailHtml, summary.url, summary);
    }),
  );

  return {
    fetchedAt: new Date().toISOString(),
    source,
    missions,
  };
}

export async function writeCatalog(catalog: MissionCatalog, outPath: string): Promise<string> {
  const absolutePath = resolve(outPath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  return absolutePath;
}
