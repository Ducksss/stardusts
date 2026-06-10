import type { KnownBlock } from "@slack/types";

export const commandNamespace = "stardusts";

export const slashCommands = {
  help: `/${commandNamespace}-help`,
  launch: `/${commandNamespace}-launch`,
  mission: `/${commandNamespace}-mission`,
  status: `/${commandNamespace}-status`,
} as const;

export type SlashCommandName = (typeof slashCommands)[keyof typeof slashCommands];

export type CommandDefinition = {
  command: SlashCommandName;
  description: string;
  usage: string;
};

export const commandDefinitions: CommandDefinition[] = [
  {
    command: slashCommands.status,
    description: "Show bot uptime and mission readiness.",
    usage: "",
  },
  {
    command: slashCommands.mission,
    description: "Show the status of one Stardance mission.",
    usage: "[webos|slack|hackpad|webos2]",
  },
  {
    command: slashCommands.launch,
    description: "Post the current launch checklist in-channel.",
    usage: "",
  },
  {
    command: slashCommands.help,
    description: "List every Stardusts slash command.",
    usage: "",
  },
];

export type CommandContext = {
  text?: string;
  uptimeSeconds?: number;
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
    status: "mission-ready",
    next: `Register ${slashCommands.status}, ${slashCommands.mission}, ${slashCommands.launch}, and ${slashCommands.help} in Slack, then keep this process hosted 24/7.`,
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

function formatUptime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

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

export function statusCommand(context: CommandContext = {}): CommandResponse {
  const user = context.userName ? ` for ${context.userName}` : "";
  const uptime = formatUptime(context.uptimeSeconds ?? process.uptime());

  return {
    response_type: "ephemeral",
    text: `Stardusts bot is online${user}`,
    blocks: [
      section(`*Stardusts bot is online${user}*`),
      section(`*Namespace:* \`${commandNamespace}\`\n*Uptime:* ${uptime}`),
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
      blocks: [
        section("*Unknown mission.* Try `webos`, `slack`, `hackpad`, or `webos2`."),
        section(`Run \`${slashCommands.help}\` to see every command.`),
      ],
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
      section("1. Run tests and build.\n2. Push the GitHub repo.\n3. Keep the Slack bot online 24/7.\n4. Attach the demo, repo, and hosting evidence to Stardance."),
    ],
  };
}

export function helpCommand(): CommandResponse {
  const lines = commandDefinitions.map((definition) => {
    const usage = definition.usage ? ` ${definition.usage}` : "";
    return `\`${definition.command}${usage}\` - ${definition.description}`;
  });

  return {
    response_type: "ephemeral",
    text: "Stardusts Slack bot commands",
    blocks: [
      section("*Stardusts Slack bot commands*"),
      section(lines.join("\n")),
      divider(),
      section("All commands use the `stardusts` prefix to avoid colliding with other Hack Club Slack bots."),
    ],
  };
}

export const commandHandlers = {
  help: helpCommand,
  launch: launchCommand,
  mission: missionCommand,
  status: statusCommand,
};
