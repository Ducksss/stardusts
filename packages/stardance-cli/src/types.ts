export type MissionDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Unknown";

export type MissionSummary = {
  slug: string;
  url: string;
  title: string;
  description: string;
  difficulty: MissionDifficulty;
  guideLabel?: string;
  locked: boolean;
  meta: string[];
};

export type MissionDetail = MissionSummary & {
  status?: string;
  estimatedTime?: string;
  sectionCount?: number;
  requirements: string[];
  prizes: string[];
  guideUrls: string[];
};

export type MissionCatalog = {
  fetchedAt: string;
  source: string;
  missions: MissionDetail[];
};

export type ScaffoldOptions = {
  catalog: MissionCatalog;
  missionSlug: string;
  outDir: string;
};
