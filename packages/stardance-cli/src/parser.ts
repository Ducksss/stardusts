import { load } from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { MissionDetail, MissionDifficulty, MissionSummary } from "./types.js";

const STARDANCE_ORIGIN = "https://stardance.hackclub.com";

export function normalizeText(value: string | undefined | null): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function absoluteUrl(href: string | undefined, baseUrl = STARDANCE_ORIGIN): string {
  if (!href) return baseUrl;
  return new URL(href, baseUrl).toString();
}

function slugFromMissionUrl(url: string): string {
  const parsed = new URL(url, STARDANCE_ORIGIN);
  const parts = parsed.pathname.split("/").filter(Boolean);
  return parts.at(-1) ?? "";
}

function difficultyFromMeta(meta: string[]): MissionDifficulty {
  const known = meta.find((item) => ["Beginner", "Intermediate", "Advanced"].includes(item));
  return (known as MissionDifficulty | undefined) ?? "Unknown";
}

function extractGuideLabel(meta: string[]): string | undefined {
  return meta.find((item) => /guide/i.test(item) && !/locked/i.test(item));
}

function summaryFromCard($: CheerioAPI, cardElement: Parameters<CheerioAPI>[0], baseUrl: string): MissionSummary {
  const card = $(cardElement);
  const url = absoluteUrl(card.attr("href"), baseUrl);
  const meta = card
    .find(".mission-card__meta-item")
    .toArray()
    .map((item) => normalizeText($(item).text()))
    .filter(Boolean);

  return {
    slug: slugFromMissionUrl(url),
    url,
    title: normalizeText(card.find(".mission-card__title").text()),
    description: normalizeText(card.find(".mission-card__description").text()),
    difficulty: difficultyFromMeta(meta),
    guideLabel: extractGuideLabel(meta),
    locked: meta.some((item) => /locked/i.test(item)),
    meta,
  };
}

export function parseMissionIndex(html: string, baseUrl = `${STARDANCE_ORIGIN}/missions`): MissionSummary[] {
  const $ = load(html);
  return $(".mission-card")
    .toArray()
    .map((element) => summaryFromCard($, element, baseUrl))
    .filter((mission) => mission.slug.length > 0 && mission.title.length > 0);
}

function parseHeroMeta($: CheerioAPI): Pick<MissionDetail, "status" | "estimatedTime" | "sectionCount"> {
  const chips = $(".mission-home__hero-chip")
    .toArray()
    .map((chip) => normalizeText($(chip).text()))
    .filter(Boolean);

  const status = chips
    .find((chip) => /started|progress|complete|locked/i.test(chip))
    ?.replace(/^[○●]\s*/, "");
  const estimatedTime = chips.find((chip) => /hr|min/i.test(chip));
  const sectionText = chips.find((chip) => /sections?/i.test(chip));
  const sectionCount = sectionText ? Number.parseInt(sectionText, 10) : undefined;

  return {
    status,
    estimatedTime,
    sectionCount: Number.isFinite(sectionCount) ? sectionCount : undefined,
  };
}

function parseRequirements($: CheerioAPI): string[] {
  return $(".mission-home__criterion-text")
    .toArray()
    .map((item) => normalizeText($(item).text()))
    .filter(Boolean);
}

function parsePrizes($: CheerioAPI): string[] {
  const title = $(".mission-home__card-title")
    .toArray()
    .find((item) => /prize|reward/i.test(normalizeText($(item).text())));
  if (!title) return [];

  const section = $(title).closest("section");
  const rawPrizes = section
    .find("li, p")
    .toArray()
    .map((item) => normalizeText($(item).text()))
    .filter(Boolean);

  return rawPrizes.filter((prize, index) => {
    if (rawPrizes.findIndex((candidate) => candidate === prize) !== index) return false;
    return !rawPrizes.some((candidate, candidateIndex) => candidateIndex !== index && candidate.includes(prize));
  });
}

function parseGuideUrls($: CheerioAPI, baseUrl: string): string[] {
  const urls = new Set<string>();
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    const text = normalizeText($(element).text());
    if (!href) return;
    if (/guide|workshop|tutorial/i.test(text) || /guide|workshop|tutorial/i.test(href)) {
      urls.add(absoluteUrl(href, baseUrl));
    }
  });
  return [...urls];
}

export function parseMissionDetail(
  html: string,
  baseUrl: string,
  summary?: MissionSummary,
): MissionDetail {
  const $ = load(html);
  const url = absoluteUrl(baseUrl, STARDANCE_ORIGIN);
  const slug = summary?.slug ?? slugFromMissionUrl(url);
  const chips = $(".mission-home__hero-chip")
    .toArray()
    .map((chip) => normalizeText($(chip).text()))
    .filter(Boolean);
  const difficulty = difficultyFromMeta(chips);
  const fallbackDescription = $('meta[name="description"]').attr("content");
  const requirements = parseRequirements($);

  return {
    slug,
    url,
    title: normalizeText($(".mission-home__hero-title").text()) || summary?.title || "",
    description:
      normalizeText($(".mission-home__hero-brief").text()) ||
      normalizeText(fallbackDescription) ||
      summary?.description ||
      "",
    difficulty: difficulty === "Unknown" ? summary?.difficulty ?? "Unknown" : difficulty,
    guideLabel: summary?.guideLabel,
    locked: summary?.locked ?? /locked/i.test(chips.join(" ")),
    meta: summary?.meta ?? chips,
    ...parseHeroMeta($),
    requirements,
    prizes: parsePrizes($),
    guideUrls: parseGuideUrls($, url),
  };
}
