import type { KnownBlock } from "@slack/types";

export type CommandContext = {
  text?: string;
  userName?: string;
};

export type CommandResponse = {
  response_type: "ephemeral" | "in_channel";
  text: string;
  blocks?: KnownBlock[];
};

const missionStatus = {
  webos: {
    title: "WebOS 1",
    status: "built",
    next: "Deploy the Vite app and attach the live link to Stardance.",
  },
  slack: {
    title: "Slack Bot",
    status: "code ready",
    next: "Install with real Slack credentials and keep it hosted 24/7.",
  },
  hackpad: {
    title: "Hackpad",
    status: "design pack ready",
    next: "Export/validate KiCad PCB artifacts before review.",
  },
  webos2: {
    title: "WebOS 2",
    status: "locked",
    next: "Wait for WebOS 1 approval.",
  },
} as const;

type MissionKey = keyof typeof missionStatus;

function section(text: string): KnownBlock {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  };
}

function divider(): KnownBlock {
  return { type: "divider" };
}

export function stardustCommand(context: CommandContext = {}): CommandResponse {
  const user = context.userName ? ` for ${context.userName}` : "";
  return {
    response_type: "ephemeral",
    text: `Stardusts mission readiness${user}`,
    blocks: [
      section(`*Stardusts mission readiness${user}*`),
      divider(),
      ...Object.values(missionStatus).map((mission) =>
        section(`*${mission.title}*: ${mission.status}\nNext: ${mission.next}`),
      ),
    ],
  };
}

export function missionCommand(context: CommandContext = {}): CommandResponse {
  const normalized = (context.text ?? "webos").trim().toLowerCase().replace(/\s+/g, "");
  const key = (normalized === "webos1" ? "webos" : normalized) as MissionKey;
  const mission = missionStatus[key];

  if (!mission) {
    return {
      response_type: "ephemeral",
      text: "Unknown mission. Try webos, slack, hackpad, or webos2.",
    };
  }

  return {
    response_type: "ephemeral",
    text: `${mission.title}: ${mission.status}`,
    blocks: [
      section(`*${mission.title}* is currently *${mission.status}*.`),
      section(`*Next step:* ${mission.next}`),
    ],
  };
}

export function launchCommand(): CommandResponse {
  return {
    response_type: "in_channel",
    text: "Stardusts launch plan",
    blocks: [
      section("*Stardusts launch plan*"),
      section("1. Run tests and build.\n2. Push GitHub repo.\n3. Deploy WebOS.\n4. Attach truthful Stardance evidence."),
    ],
  };
}

export const commandHandlers = {
  stardust: stardustCommand,
  mission: missionCommand,
  launch: launchCommand,
};
